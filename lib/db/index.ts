"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { ID, Models, Permission, Query, Role } from "node-appwrite";

import { Product } from "@/interfaces/product.interface";
import { Result } from "@/interfaces/result.interface";
import { TeamData } from "@/interfaces/team.interface";
import { UserData } from "@/interfaces/user.interface";
import { withAuth } from "@/lib/auth";
import {
  DATABASE_ID,
  SAMPLE_COLLECTION_ID,
  TEAM_COLLECTION_ID,
  USER_COLLECTION_ID,
} from "@/lib/constants";
import { createSessionClient } from "@/lib/server/appwrite";
import { deleteProductImage, uploadProductImage } from "@/lib/storage";
import { AddProductFormData, EditProductFormData } from "./schemas";

/**
 * Get a list of products
 * @param {string[]} queries The queries to filter the products
 * @returns {Promise<Result<Models.DocumentList<Product>>>} The list of products
 */
export async function listProducts(
  queries: string[] = []
): Promise<Result<Models.DocumentList<Product>>> {
  return withAuth(async (user) => {
    const { database } = await createSessionClient();

    return unstable_cache(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async (queries, userId) => {
        try {
          const products = await database.listDocuments<Product>(
            DATABASE_ID,
            SAMPLE_COLLECTION_ID,
            queries
          );

          const userIds = products.documents.map((product) => product.userId);
          const uniqueUserIds = Array.from(new Set(userIds));

          const teamIds = products.documents.map((product) => product.teamId);
          const uniqueTeamIds = Array.from(new Set(teamIds));

          const users = await database.listDocuments<UserData>(
            DATABASE_ID,
            USER_COLLECTION_ID,
            [
              Query.equal("$id", uniqueUserIds),
              Query.select(["$id", "name", "avatar"]),
            ]
          );

          const teams = await database.listDocuments<TeamData>(
            DATABASE_ID,
            TEAM_COLLECTION_ID,
            [
              Query.equal("$id", uniqueTeamIds),
              Query.select(["$id", "name", "avatar"]),
            ]
          );

          const userMap = users.documents.reduce<Record<string, UserData>>(
            (acc, user) => {
              if (user) {
                acc[user.$id] = user;
              }
              return acc;
            },
            {}
          );

          const teamMap = teams.documents.reduce<Record<string, TeamData>>(
            (acc, team) => {
              if (team) {
                acc[team.$id] = team;
              }
              return acc;
            },
            {}
          );

          const newProducts = products.documents.map((product) => ({
            ...product,
            user: userMap[product.userId],
            team: teamMap[product.teamId],
          }));

          products.documents = newProducts;

          return {
            success: true,
            message: "Products successfully retrieved.",
            data: products,
          };
        } catch (err) {
          const error = err as Error;

          return {
            success: false,
            message: error.message,
          };
        }
      },
      ["products"],
      {
        tags: [
          "products",
          `products:${queries.join("-")}`,
          `products:user-${user.$id}`,
        ],
        revalidate: 600,
      }
    )(queries, user.$id);
  });
}

/**
 * Get a product by ID
 * @param {string} productId The ID of the product
 * @param {string[]} queries The queries to filter the product
 * @returns {Promise<Result<Product>>} The product
 */
export async function getProductById(
  productId: string,
  queries: string[] = []
): Promise<Result<Product>> {
  return withAuth(async () => {
    const { database } = await createSessionClient();

    return unstable_cache(
      async () => {
        try {
          const product = await database.getDocument<Product>(
            DATABASE_ID,
            SAMPLE_COLLECTION_ID,
            productId,
            queries
          );

          const userRes = await database.getDocument<UserData>(
            DATABASE_ID,
            USER_COLLECTION_ID,
            product.userId,
            [Query.select(["$id", "name", "avatar"])]
          );

          const teamRes = await database.getDocument<TeamData>(
            DATABASE_ID,
            TEAM_COLLECTION_ID,
            product.teamId,
            [Query.select(["$id", "name", "avatar"])]
          );

          return {
            success: true,
            message: "Product successfully retrieved.",
            data: {
              ...product,
              user: userRes,
              team: teamRes,
            },
          };
        } catch (err) {
          const error = err as Error;

          return {
            success: false,
            message: error.message,
          };
        }
      },
      ["product", productId],
      {
        tags: ["products", `product:${productId}`],
        revalidate: 600,
      }
    )();
  });
}

/**
 * Create a product
 * @param {Object} params The parameters for creating a product
 * @param {string} [params.id] The ID of the product (optional)
 * @param {AddProductFormData} params.data The product data
 * @param {string[]} [params.permissions] The permissions for the product (optional)
 * @returns {Promise<Result<Product>>} The created product
 */
export async function createProduct({
  id = ID.unique(),
  data,
  permissions = [],
}: {
  id?: string;
  data: AddProductFormData;
  permissions?: string[];
}): Promise<Result<Product>> {
  return withAuth(async (user) => {
    const { database } = await createSessionClient();

    permissions = [
      ...permissions,
      Permission.read(Role.user(user.$id)),
      Permission.write(Role.user(user.$id)),
      Permission.read(Role.team(data.teamId)),
    ];

    try {
      if (data.image instanceof File) {
        const image = await uploadProductImage({
          data: data.image,
          permissions: [Permission.read(Role.team(data.teamId))],
        });

        if (!image.success) {
          throw new Error(image.message);
        }

        data.image = image.data?.$id;
      }

      const product = await database.createDocument<Product>(
        DATABASE_ID,
        SAMPLE_COLLECTION_ID,
        id,
        {
          ...data,
          userId: user.$id,
        },
        permissions
      );

      const userRes = await database.getDocument<UserData>(
        DATABASE_ID,
        USER_COLLECTION_ID,
        product.userId,
        [Query.select(["$id", "name", "avatar"])]
      );

      const teamRes = await database.getDocument<TeamData>(
        DATABASE_ID,
        TEAM_COLLECTION_ID,
        product.teamId,
        [Query.select(["$id", "name", "avatar"])]
      );

      revalidateTag("products");

      return {
        success: true,
        message: "Product successfully created.",
        data: {
          ...product,
          user: userRes,
          team: teamRes,
        },
      };
    } catch (err) {
      const error = err as Error;

      return {
        success: false,
        message: error.message,
      };
    }
  });
}

/**
 * Update a product
 * @param {Object} params The parameters for creating a product
 * @param {string} [params.id] The ID of the product
 * @param {EditProductFormData} params.data The product data
 * @param {string[]} [params.permissions] The permissions for the product (optional)
 * @returns {Promise<Result<Product>>} The updated product
 */
export async function updateProduct({
  id,
  data,
  permissions = undefined,
}: {
  id: string;
  data: EditProductFormData;
  permissions?: string[];
}): Promise<Result<Product>> {
  return withAuth(async (user) => {
    const { database } = await createSessionClient();

    try {
      const existingProduct = await database.getDocument<Product>(
        DATABASE_ID,
        SAMPLE_COLLECTION_ID,
        id
      );

      if (data.image instanceof File) {
        if (existingProduct.image) {
          await deleteProductImage(existingProduct.image);
        }

        const image = await uploadProductImage({
          data: data.image,
        });

        if (!image.success) {
          throw new Error(image.message);
        }

        data.image = image.data?.$id;
      } else if (data.image === null && existingProduct.image) {
        const image = await deleteProductImage(existingProduct.image);

        if (!image.success) {
          throw new Error(image.message);
        }

        data.image = null;
      }

      const product = await database.updateDocument<Product>(
        DATABASE_ID,
        SAMPLE_COLLECTION_ID,
        id,
        {
          ...data,
          userId: user.$id,
        },
        permissions
      );

      const userRes = await database.getDocument<UserData>(
        DATABASE_ID,
        USER_COLLECTION_ID,
        product.userId,
        [Query.select(["$id", "name", "avatar"])]
      );

      const teamRes = await database.getDocument<TeamData>(
        DATABASE_ID,
        TEAM_COLLECTION_ID,
        product.teamId,
        [Query.select(["$id", "name", "avatar"])]
      );

      revalidateTag("products");
      revalidateTag(`product:${id}`);

      return {
        success: true,
        message: "Product successfully updated.",
        data: {
          ...product,
          user: userRes,
          team: teamRes,
        },
      };
    } catch (err) {
      const error = err as Error;

      return {
        success: false,
        message: error.message,
      };
    }
  });
}

/**
 * Delete a product
 * @param {string} id The ID of the product
 * @returns {Promise<Result<Product>>} The deleted product
 */
export async function deleteProduct(id: string): Promise<Result<Product>> {
  return withAuth(async () => {
    const { database } = await createSessionClient();

    try {
      const product = await database.getDocument<Product>(
        DATABASE_ID,
        SAMPLE_COLLECTION_ID,
        id
      );

      if (product.image) {
        const image = await deleteProductImage(product.image);

        if (!image.success) {
          throw new Error(image.message);
        }
      }

      await database.deleteDocument(DATABASE_ID, SAMPLE_COLLECTION_ID, id);

      revalidateTag("products");

      return {
        success: true,
        message: "Product successfully deleted.",
      };
    } catch (err) {
      const error = err as Error;

      return {
        success: false,
        message: error.message,
      };
    }
  });
}
