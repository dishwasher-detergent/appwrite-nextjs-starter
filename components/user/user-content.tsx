import { Products } from "@/components/realtime/products";
import { Product } from "@/interfaces/product.interface";

interface UserContentProps {
  products: Product[];
  userId: string;
}

export function UserContent({ products, userId }: UserContentProps) {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">Products</h3>
      <Products initialProducts={products} userId={userId} />
    </div>
  );
}
