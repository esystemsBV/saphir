import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Printer, Save } from "lucide-react";
import { nanoid } from "nanoid";
import { doc, setDoc, updateDoc } from "firebase/firestore/lite";
import { db } from "@/lib/firebase";
import { Product } from "@/lib/types";
import bills from "@/data/Bills.json";
import NumPad from "../miniCompos/NumPad";
import InsideBtnLoading from "../miniCompos/InsideBtnLoading";

export default function SubmitCash({
  cartTotal,
  selectedProducts,
  setSelectedProducts,
  onOpenChange,
  totalX,
}: {
  cartTotal: number;
  selectedProducts: Product[];
  setSelectedProducts: (value: any[]) => void;
  onOpenChange: () => void;
  totalX: number;
}) {
  const [total, setTotal] = useState<number | string>(0);
  const [id] = useState(nanoid(6));
  const [miniloading, setMiniLoading] = useState<boolean>(false);
  const currentCurrency = "MA";

  const handleAddBonDeRec = async (bon: boolean) => {
    setMiniLoading(true);

    try {
      await setDoc(doc(db, "bondeliv", id), {
        date: new Date(),
        ref: id,
        client: { name: "client comptoir" },
        products: selectedProducts,
        statut: "payé",
        total: totalX,
        method: "espece",
      });

      for (const product of selectedProducts) {
        await updateDoc(doc(db, "products", product.reference), {
          stock: product.stock - (product.quantity || 1),
        });
      }

      if (bon) {
        //print invoice function
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSelectedProducts([]);
      setMiniLoading(false);
      onOpenChange();
    }
  };

  const data = [
    { title: "à payer", value: cartTotal, color: "bg-blue-400" },
    { title: "recu", value: +total, color: "bg-red-400" },
    {
      title: "à rendre",
      value: +total > +cartTotal ? +total - cartTotal : 0,
      color: "bg-yellow-400",
    },
  ];

  return (
    <>
      <DialogContent className=" w-full">
        <DialogHeader>
          <DialogTitle>Paiment par Espèce.</DialogTitle>
        </DialogHeader>

        <div className="flex gap-5 px-10">
          {/* NUMPAD */}
          <NumPad total={total} setTotal={setTotal} />

          {/* BILLS ADDING SECTIONS */}
          <section className="flex gap-5 flex-row-reverse">
            <div className="w-20 space-y-2 flex-col flex justify-between">
              {bills[currentCurrency].coins.map((bill, id) => (
                <img
                  key={id}
                  src={bill.image}
                  onClick={() => setTotal(+total + bill.value)}
                />
              ))}
            </div>
            <div className="w-52 space-y-2">
              {bills[currentCurrency].bills.map((bill, id) => (
                <img
                  key={id}
                  src={bill.image}
                  onClick={() => setTotal(+total + bill.value)}
                />
              ))}
            </div>
          </section>
        </div>

        <hr />

        <section className="grid grid-cols-7 font-medium gap-5 px-5">
          {data.map((val, index) => (
            <p
              key={index}
              className={`capitalize cursor-pointer flex items-center justify-center rounded-lg py-2 px-4 text-white text-center ${val.color}`}
            >
              {val.title} :<br />
              {val.value.toFixed(2)}
            </p>
          ))}

          <Button
            onClick={() => handleAddBonDeRec(false)}
            className="bg-green-500 hover:bg-green-700 text-xl col-span-2 h-full space-x-5"
          >
            <InsideBtnLoading
              icon={Save}
              loading={miniloading}
              text="Valider"
            />
          </Button>
          <Button
            onClick={() => handleAddBonDeRec(true)}
            className="bg-blue-500 hover:bg-blue-700 text-xl col-span-2 h-full space-x-5"
          >
            <InsideBtnLoading
              icon={Printer}
              loading={miniloading}
              text="Valider & imprimer"
            />
          </Button>
        </section>
      </DialogContent>
    </>
  );
}
