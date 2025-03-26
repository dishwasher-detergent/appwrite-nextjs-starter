"use client";

import { MultiCardSkeleton } from "@/components/loading/multi-card-skeleton";
import { ProductCard } from "@/components/product/product-card";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/interfaces/product.interface";

interface ProductsProps {
  initialProducts?: Product[];
  teamId?: string;
  userId?: string;
}

export function Products({ initialProducts, teamId, userId }: ProductsProps) {
  const { loading, products } = useProducts({
    initialProducts,
    teamId,
    userId,
  });

  if (loading) return <MultiCardSkeleton />;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products?.map((product) => (
        <ProductCard key={product.$id} {...product} />
      ))}
      {products?.length === 0 && (
        <p className="font-semibold text-muted-foreground">No products found</p>
      )}
    </section>
  );
}
