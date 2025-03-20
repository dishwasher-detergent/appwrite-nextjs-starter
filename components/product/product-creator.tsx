import { ProfileLink } from "@/components/profile-link";
import { Product } from "@/interfaces/product.interface";

interface ProductCreatorProps {
  product: Product;
}

export function ProductCreator({ product }: ProductCreatorProps) {
  return (
    <ProfileLink
      className="text-foreground"
      avatar={product?.user?.avatar}
      name={product?.user?.name}
      href={`/app/users/${product?.user?.$id}`}
    />
  );
}
