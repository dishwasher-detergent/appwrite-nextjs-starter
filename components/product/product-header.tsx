import Image from "next/image";

import { ProductActions } from "@/components/product/product-actions";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Product } from "@/interfaces/product.interface";
import { ENDPOINT, PROJECT_ID, SAMPLE_BUCKET_ID } from "@/lib/constants";

interface ProductHeaderProps {
  product: Product;
  canEdit: boolean;
}

export function ProductHeader({ product, canEdit }: ProductHeaderProps) {
  return (
    <header className="relative">
      <div
        role="img"
        aria-label="Product banner"
        className="w-full bg-linear-to-r from-primary to-secondary rounded-xl h-48"
      />
      <div className="flex items-start justify-between px-4 -mt-30">
        <figure className="relative flex-shrink-0 size-60">
          <AspectRatio ratio={1}>
            {product?.avatar ? (
              <Image
                src={`${ENDPOINT}/storage/buckets/${SAMPLE_BUCKET_ID}/files/${product.image}/view?project=${PROJECT_ID}`}
                alt={`${product.name}'s product image`}
                className="rounded-full border-4 border-background object-cover bg-primary size-full"
                fill
                priority
              />
            ) : (
              <div
                aria-label="Default picture"
                className="rounded-full border-4 border-background object-cover bg-primary size-full text-primary-foreground grid place-items-center font-bold"
              >
                No Image
              </div>
            )}
          </AspectRatio>
        </figure>
        <div className="pt-32 flex flex-row gap-1">
          {canEdit && <ProductActions product={product} />}
        </div>
      </div>
    </header>
  );
}
