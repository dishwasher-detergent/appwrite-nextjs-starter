"use client";

import { CreatorSkeleton } from "@/components/loading/creator-skeleton";
import { DescriptionSkeleton } from "@/components/loading/description-skeleton";
import { HeaderSkeleton } from "@/components/loading/header-skeleton";
import { ProductCreator } from "@/components/product/product-creator";
import { ProductDescription } from "@/components/product/product-description";
import { ProductHeader } from "@/components/product/product-header";
import { useProduct } from "@/hooks/useProduct";
import { Product as ProductType } from "@/interfaces/product.interface";

interface ProductProps {
  initialProduct: ProductType;
  canEdit: boolean;
}

export function Product({ initialProduct, canEdit }: ProductProps) {
  const { product, loading } = useProduct({ initialProduct });

  if (loading)
    return (
      <article className="space-y-6">
        <HeaderSkeleton />
        <main className="px-4 space-y-6">
          <CreatorSkeleton />
          <DescriptionSkeleton />
        </main>
      </article>
    );

  return (
    <article className="space-y-6">
      <ProductHeader product={product} canEdit={canEdit} />
      <main className="px-4 space-y-6">
        <ProductCreator product={product} />
        <ProductDescription product={product} />
      </main>
    </article>
  );
}
