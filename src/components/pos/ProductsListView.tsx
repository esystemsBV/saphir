import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { products } from "@/lib/database";
import { def } from "@/data/Links";
import { t } from "i18next";
import { Plus } from "lucide-react";
import brokenImage from "@/assets/brokenImage.png";

interface ProductListViewProps {
  products: products[];
  handleAddProductToCart: (product: products) => void;
}

export function ProductListView({
  products,
  handleAddProductToCart,
}: ProductListViewProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("Image")}</TableHead>
          <TableHead>{t("Product")}</TableHead>
          <TableHead>{t("Price")}</TableHead>
          <TableHead>{t("Stock")}</TableHead>
          <TableHead>{t("Action")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.reference}>
            <TableCell className="w-16">
              <img
                src={product.image ? `${def}${product.image}` : brokenImage}
                alt={product.name}
                className="w-12 h-12 object-cover rounded-sm"
              />
            </TableCell>
            <TableCell className="text-lg">{product.name}</TableCell>
            <TableCell className="text-lg">
              {parseFloat(product.sellPrice.toString()).toFixed(2)}
            </TableCell>
            <TableCell className="text-lg">{product.stock}</TableCell>
            <TableCell>
              <button
                onClick={() => handleAddProductToCart(product)}
                disabled={(product.stock || 0) <= 0}
                className="px-2 py-1 bg-blue-500 text-white rounded-md disabled:opacity-50"
              >
                <Plus />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
