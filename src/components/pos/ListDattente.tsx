import { useEffect, useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Eye, Trash2 } from "lucide-react";
import { products } from "@/lib/database";

const ListDattente = ({
  selectedProducts,
  setSelectedProducts,
  onOpenChange,
}: {
  selectedProducts: products[];
  setSelectedProducts: any;
  onOpenChange: () => void;
}) => {
  const [list, setList] = useState<any[]>(
    JSON.parse(localStorage.getItem("waitingList") || "[]")
  );

  const total = (data: any[]) => {
    return data.reduce(
      (total, product) => total + product.sellPrice * product.quantity,
      0
    );
  };

  const handleAddWaitingListToCart = (items: any[]) => {
    const currentWaitingList = JSON.parse(
      localStorage.getItem("waitingList") || "[]"
    );

    const updatedWaitingList = currentWaitingList.filter(
      (waitingListItem: any) =>
        JSON.stringify(waitingListItem.products) !== JSON.stringify(items)
    );

    localStorage.setItem("waitingList", JSON.stringify(updatedWaitingList));

    if (selectedProducts.length > 0) {
      if (confirm("Toute votre panier va être remplacé! Continuer?")) {
        setSelectedProducts(items);
        onOpenChange();
      }
    } else {
      setSelectedProducts(items);
      onOpenChange();
    }
  };

  const handleDeleteWaitingListItem = (index: number) => {
    const updatedWaitingList = list.filter((_, i) => i !== index);

    localStorage.setItem("waitingList", JSON.stringify(updatedWaitingList));

    setList(updatedWaitingList);
  };

  useEffect(() => {
    if (!list || list.length == 0) {
      onOpenChange();
    }
  }, [list]);

  return (
    <>
      <DialogContent className=" w-max">
        <DialogHeader>
          <DialogTitle>Liste D'attente</DialogTitle>

          <section>
            <Table className=" h-full">
              <TableHeader>
                <TableRow className="text-[16px]">
                  <TableHead className="!font-bold">N°</TableHead>
                  <TableHead className="!font-bold">Produits</TableHead>
                  <TableHead className="!font-bold">Total</TableHead>
                  <TableHead className="!font-bold">Voir</TableHead>
                  <TableHead className="!font-bold">Supp.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className=" h-full">
                {list.map((product, index) => (
                  <TableRow key={product.reference}>
                    <TableCell className="capitalize">{index + 1}</TableCell>
                    <TableCell className="capitalize flex">
                      {product.products.map(
                        (value: { name: string }, key: number) => (
                          <p key={key} className="mr-0.5">
                            {value.name}
                            {key == product.products.length - 1 ? "." : ", "}
                          </p>
                        )
                      )}
                    </TableCell>

                    <TableCell>{total(product.products).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() =>
                          handleAddWaitingListToCart(product.products)
                        }
                        className="bg-blue-500 hover:bg-blue-700"
                        size="sm"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleDeleteWaitingListItem(index)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </DialogHeader>
      </DialogContent>
    </>
  );
};

export default ListDattente;
