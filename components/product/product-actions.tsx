import { LucideEllipsisVertical } from "lucide-react";

import { DeleteProduct } from "@/components/product/delete-product";
import { EditProduct } from "@/components/product/edit-product";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product } from "@/interfaces/product.interface";

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline" className="size-8">
          <LucideEllipsisVertical className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <EditProduct product={product} />
        <DeleteProduct product={product} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
