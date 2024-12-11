import { DataSelectionDialog } from "@/components/ProductSelectionDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { def } from "@/data/Links";
import { products } from "@/lib/database";
import { useState } from "react";
import brokenImage from "@/assets/brokenImage.png";
import { t } from "i18next";
import { FormPreNumbers } from "@/common/Functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import Title from "@/components/ui/Title";

export default function Tests() {
  const [selectedProducts, setSelectedProducts] = useState<products[]>([]);

  const onSelectProduct = (product: products) => {
    const find = selectedProducts.find(
      (x) => x.reference === product.reference
    );

    const filtred = selectedProducts.filter(
      (x) => x.reference !== product.reference
    );

    if (!find) {
      setSelectedProducts([...selectedProducts, product]);
    } else {
      setSelectedProducts([
        { ...product, quantity: (find.quantity || 1) + 1 },
        ...filtred,
      ]);
    }
  };

  const handleChangeStock = (value: number, id: number, product: products) => {
    const filtred = selectedProducts.filter(
      (x) => x.reference !== product.reference
    );

    setSelectedProducts([
      ...filtred,
      { ...selectedProducts[id], stock: value },
    ]);
  };
  const hadndleDeleteProduct = (id: number) => {
    const filtred = selectedProducts.filter(
      (x) => x.reference !== selectedProducts[id].reference
    );

    setSelectedProducts(filtred);
  };

  const handleSubmitStock = () => {
    const datatosend = selectedProducts.map((value) => ({
      stock: value.stock,
      reference: value.reference,
    }));

    console.log(datatosend);
  };

  return (
    <div>
      <Title title={t("Stock")} />

      <DataSelectionDialog
        onSelectProduct={onSelectProduct}
        ButtonTitle="select-products"
        table="/products/withfamilyname"
      />

      <Table className="border mt-10">
        <TableHeader>
          <TableRow>
            <TableHead>{t("image")}</TableHead>
            <TableHead>{t("products.designation")}</TableHead>
            {/* <TableHead>{t("quantity")}</TableHead> */}
            <TableHead>{t("products.pa")}</TableHead>
            <TableHead>{t("products.pv")}</TableHead>
            <TableHead>{t("Stock")}</TableHead>
            <TableHead>{t("products.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedProducts && selectedProducts.length > 0 ? (
            selectedProducts.map((product, id) => (
              <TableRow key={id}>
                <TableCell className="w-10">
                  <img
                    src={product.image ? `${def}${product.image}` : brokenImage}
                    alt={product.name}
                    className="size-12 object-cover rounded-sm bg-main"
                  />
                </TableCell>
                <TableCell className="capitalize">
                  <p className="text-base font-medium">{product.name}</p>
                  <p className="text-gray-500 -mt-0.5">
                    {FormPreNumbers(`${product.reference}`)}
                  </p>
                </TableCell>
                {/* <TableCell className="text-lg">{product.quantity}</TableCell> */}
                <TableCell className="text-lg">{product.boughtPrice}</TableCell>
                <TableCell className="text-lg">{product.sellPrice}</TableCell>
                <TableCell className="text-lg">
                  <Input
                    type="number"
                    value={product.stock || 0}
                    className="w-12 text-lg text-center flex items-center justify-center"
                    onChange={(e) =>
                      handleChangeStock(+e.target.value, id, product)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Trash2
                    className="w-6 h-6 cursor-pointer text-red-500"
                    onClick={() => hadndleDeleteProduct(id)}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                {t("products.empty")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div
        className="fixed p-5 bottom-0 z-50 bg-white left-0 w-full "
        onClick={handleSubmitStock}
      >
        <Button
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          {t("submit")}
        </Button>
      </div>
    </div>
  );
}
