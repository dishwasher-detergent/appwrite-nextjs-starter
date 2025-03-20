"use client";

import { LucideLoader2 } from "lucide-react";

import { ProductCreator } from "@/components/product/product-creator";
import { ProductHeader } from "@/components/product/product-header";
import { ProductDescription } from "@/components/product/product-info";
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
      <div className="w-full h-full grid place-items-center">
        <LucideLoader2 className="size-8 animate-spin" />
      </div>
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
