import { Product } from "@/interfaces/product.interface";

interface ProductDescriptionProps {
  product: Product;
}

export function ProductDescription({ product }: ProductDescriptionProps) {
  return (
    <div className="max-w-prose">
      <h1 className="text-2xl font-bold tracking-tight mb-1">{product.name}</h1>
      <section aria-label="About">
        <p className="text-muted-foreground leading-relaxed">
          {product.description ?? "No description for this product."}
        </p>
      </section>
    </div>
  );
}
