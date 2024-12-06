import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Percent,
  Save,
  Trash,
  ArrowDownUp,
  Timer,
  ListCollapse,
  FolderOpen,
} from "lucide-react";
import { products } from "@/lib/database";
import axios from "axios";
import { def } from "@/data/Links";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import ListDattente from "./ListDattente";
import CouponPOS from "./CouponPOS";

interface ProductsSideProps {
  selectedProducts: products[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<products[]>>;
}

export default function ProductsSide({
  selectedProducts,
  setSelectedProducts,
}: ProductsSideProps) {
  const { t } = useTranslation();
  const [coupon, setCoupon] = useState(0);
  const [listDattente, setListDattente] = useState(false);
  const [addCoupon, setAddCoupon] = useState(false);
  const [coupontypePercentage, setCoupontypePercentage] = useState(false);

  const total = selectedProducts.reduce(
    (total, product) => total + product.sellPrice * (product.quantity || 1),
    0
  );

  const totalWithCoupon = !coupontypePercentage
    ? total - coupon
    : total - (total * coupon) / 100;

  const handleDeleteProduct = (product: products) => {
    setSelectedProducts(
      selectedProducts.filter((x) => x.reference !== product.reference)
    );
  };

  const handleQuantityChange = (product: products, change: number) => {
    const newQuantity = (product.quantity || 1) + change;
    if (newQuantity > 0 && newQuantity <= (product.stock || 0)) {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p.reference === product.reference
            ? { ...p, quantity: newQuantity }
            : p
        )
      );
    }
  };

  const handleQuantityChangeInput = (product: products, change: number) => {
    if (change > 0 && change <= (product.stock || 0)) {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p.reference === product.reference ? { ...p, quantity: change } : p
        )
      );
    }
  };

  const handleAddWaitingList = async () => {
    const currentWaitingList = JSON.parse(
      localStorage.getItem("waitingList") || "[]"
    );
    const updatedWaitingList = [
      ...currentWaitingList,
      { products: selectedProducts },
    ];
    localStorage.setItem("waitingList", JSON.stringify(updatedWaitingList));
    setSelectedProducts([]);
  };

  const handleSendOrder = async () => {
    const dataAlo = {
      delivery_date: new Date(),
      type: "pos",
      products: selectedProducts,
      status: "completed",
      remise: total - totalWithCoupon,
    };

    try {
      const response = await axios.post(
        `${def}/delivery_notes/addpos`,
        dataAlo
      );

      if (response.data.success) {
        location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenWaitingList = () => {
    setListDattente((prev) => !prev);
  };

  return (
    <>
      <Card className="h-full flex flex-col rounded-2xl">
        <CardContent className="flex-grow p-4">
          <h2 className="text-2xl font-bold mb-4">{t("Your Cart")}</h2>
          {selectedProducts.length > 0 ? (
            <Table className=" overflow-y-auto">
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Product")}</TableHead>
                  <TableHead>{t("Quantity")}</TableHead>
                  <TableHead>{t("Price")}</TableHead>
                  <TableHead>{t("Total")}</TableHead>
                  <TableHead>{t("Supp.")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedProducts.map((product) => (
                  <TableRow key={product.reference}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Button
                          onClick={() => handleQuantityChange(product, -1)}
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <input
                          type="number"
                          value={product.quantity}
                          onChange={(e) =>
                            handleQuantityChangeInput(product, +e.target.value)
                          }
                          className="w-12 text-center mx-2 p-1 border rounded"
                        />
                        <Button
                          onClick={() => handleQuantityChange(product, 1)}
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{product.sellPrice}</TableCell>
                    <TableCell>
                      {(product.sellPrice * (product.quantity || 1)).toFixed(2)}
                    </TableCell>
                    <TableCell className="w-7">
                      <Trash2
                        onClick={() => handleDeleteProduct(product)}
                        className="size-7 bg-red-500 rounded-sm text-white p-1 cursor-pointer"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingCart className="h-16 w-16 mb-4" />
              <p className="text-xl font-semibold">
                {t("Your cart is empty!")}
              </p>
              <p>{t("Add products to get started")}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t p-4">
          <div className="w-full grid grid-cols-2 gap-2">
            <Button
              className="w-full justify-center items-center bg-yellow-500 hover:bg-yellow-700"
              disabled={selectedProducts.length === 0}
              onClick={handleAddWaitingList}
            >
              <Timer className="mr-2 h-5 w-5" />
              {t("Add to Waiting List")}
            </Button>
            <Button
              onClick={handleOpenWaitingList}
              className="w-full justify-center items-center bg-yellow-500 hover:bg-yellow-700"
              disabled={
                JSON.parse(localStorage.getItem("waitingList") || "[]")
                  .length === 0
              }
            >
              <ListCollapse className="mr-2 h-5 w-5" />
              {t("Waiting List")}
            </Button>
            <Button className="w-full justify-center items-center bg-cyan-500 hover:bg-cyan-700">
              <FolderOpen className="mr-2 h-5 w-5" />
              {t("Open Territory")}
            </Button>
            <Button
              onClick={() => setAddCoupon(true)}
              className="w-full justify-center items-center bg-blue-500 hover:bg-blue-700"
              disabled={selectedProducts.length === 0}
            >
              <Percent className="mr-2 h-5 w-5" />
              {t("Discount Options")}
            </Button>
            <Button
              className="w-full justify-center items-center bg-red-500 hover:bg-red-700"
              disabled={selectedProducts.length === 0}
              onClick={() => setSelectedProducts([])}
            >
              <Trash className="mr-2 h-5 w-5" />
              {t("Delete Order")}
            </Button>
            <Button
              className="w-full justify-center items-center bg-pink-500 hover:bg-pink-700"
              disabled={selectedProducts.length === 0}
            >
              <ArrowDownUp className="mr-2 h-5 w-5" />
              {t("Return")}
            </Button>
          </div>

          <Button
            onClick={handleSendOrder}
            className="w-full bg-green-500 hover:bg-green-700"
            size="lg"
            disabled={selectedProducts.length === 0}
          >
            <Save className="mr-2 h-5 w-5" />
            {t("Validate Order")} ({totalWithCoupon.toFixed(2)})
          </Button>
        </CardFooter>
      </Card>

      {listDattente && (
        <Dialog open={listDattente} onOpenChange={handleOpenWaitingList}>
          <ListDattente
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            onOpenChange={handleOpenWaitingList}
          />
        </Dialog>
      )}

      <Dialog open={addCoupon} onOpenChange={setAddCoupon}>
        <DialogContent className="w-max">
          <DialogHeader>
            <DialogTitle>Ajouter Coupon</DialogTitle>
          </DialogHeader>
          <CouponPOS
            coupontypePercentage={coupontypePercentage}
            setCoupontypePercentage={setCoupontypePercentage}
            setCoupon={setCoupon}
            coupon={coupon}
            setAddCoupon={setAddCoupon}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
