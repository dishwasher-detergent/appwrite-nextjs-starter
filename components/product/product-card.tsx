"use client";

import { LucideSlash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ProfileLink } from "@/components/profile-link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@/interfaces/product.interface";
import { ENDPOINT, PROJECT_ID, SAMPLE_BUCKET_ID } from "@/lib/constants";

export function ProductCard(product: Product) {
  return (
    <Card className="break-inside-avoid-column rounded-lg overflow-hidden py-0 gap-0 ">
      <CardContent className="p-0 relative">
        <AspectRatio ratio={1} className="w-full">
          {product.image ? (
            <Image
              src={`${ENDPOINT}/storage/buckets/${SAMPLE_BUCKET_ID}/files/${product.image}/view?project=${PROJECT_ID}`}
              alt={product.name}
              className="object-cover object-left-top bg-primary"
              fill
            />
          ) : (
            <div className="w-full aspect-square bg-muted grid place-items-center">
              <p className="text-muted-foreground font-semibold">No image</p>
            </div>
          )}
        </AspectRatio>
        <CardHeader className="flex flex-col justify-end bottom-0 absolute w-full p-4 h-full bg-linear-to-t from-primary to-primary/20">
          <CardTitle className="text-primary-foreground">
            <Button
              className="truncate p-0! text-primary-foreground text-xl"
              variant="link"
              asChild
            >
              <Link
                href={`/app/teams/${product.teamId}/products/${product.$id}`}
              >
                {product.name}
              </Link>
            </Button>
          </CardTitle>
          <CardDescription className="text-primary-foreground line-clamp-3">
            {product?.description ?? "No description provided."}
          </CardDescription>
          <div className="flex flex-row gap-2 items-center mt-2">
            <ProfileLink
              avatar={product?.team?.avatar}
              name={product?.team?.name}
              href={`/app/teams/${product.teamId}`}
            />
            <LucideSlash className="text-primary-foreground size-3" />
            <ProfileLink
              avatar={product?.user?.avatar}
              name={product?.user?.name}
              href={`/app/users/${product.userId}`}
            />
          </div>
        </CardHeader>
      </CardContent>
    </Card>
  );
}
