import { Products } from "@/components/realtime/products";
import { Product } from "@/interfaces/product.interface";

interface TeamContentProps {
  products: Product[];
  teamId: string;
}

export function TeamContent({ products, teamId }: TeamContentProps) {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">Products</h3>
      <Products initialProducts={products} teamId={teamId} />
    </div>
  );
}
