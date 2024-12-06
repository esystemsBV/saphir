import { products } from "@/lib/database";
import { def } from "@/data/Links";
import { t } from "i18next";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import brokenImage from "@/assets/brokenImage.png";

interface ProductListViewProps {
  product: products;
  handleAddProductToCart: (product: products) => void;
}

export function ProductGridView({
  product,
  handleAddProductToCart,
}: ProductListViewProps) {
  return (
    <Card
      key={product.reference}
      className={cn(
        "cursor-pointer transition-all duration-200 w-40 p-1 hover:shadow-md",
        (product.stock || 0) <= 0 && "opacity-50 cursor-not-allowed"
      )}
      onClick={() =>
        (product.stock || 0) > 0 && handleAddProductToCart(product)
      }
    >
      <CardContent className="relative w-full p-0">
        <img
          src={product.image ? `${def}${product.image}` : brokenImage}
          alt={product.name}
          className="w-full h-28 object-contain"
        />
        <div>
          <h3 className="font-medium text-center mb-1 truncate capitalize">
            {product.name}
          </h3>
          <div className="flex justify-between items-center">
            <p className="text-sm absolute top-2 right-2 shadow-sm px-2 py-0.5 rounded-lg bg-red-500 text-white font-semibold">
              {(product.stock || 0) > 0
                ? `${t("Qty")}: ${product.stock}`
                : t("Out of stock")}
            </p>
            <p className="bg-green-600 py-1 px-2 font-medium text-white rounded-lg w-full text-center">
              {parseFloat(product.sellPrice.toString()).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
