import { ProductActions } from "@/components/product/product-actions";
import { Header } from "@/components/ui/header";
import { Product } from "@/interfaces/product.interface";
import { ENDPOINT, PROJECT_ID, SAMPLE_BUCKET_ID } from "@/lib/constants";

interface ProductHeaderProps {
  product: Product;
  canEdit: boolean;
}

export function ProductHeader({ product, canEdit }: ProductHeaderProps) {
  return (
    <Header
      src={
        product.image
          ? `${ENDPOINT}/storage/buckets/${SAMPLE_BUCKET_ID}/files/${product.image}/view?project=${PROJECT_ID}`
          : undefined
      }
      alt={`${product.name}'s product image`}
    >
      {canEdit && <ProductActions product={product} />}
    </Header>
  );
}
