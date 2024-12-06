import {
  CircleDollarSignIcon,
  CreditCardIcon,
  IdCardIcon,
  UserCircle2,
} from "lucide-react";
import { Button } from "../ui/button";
import { doc, setDoc, updateDoc } from "firebase/firestore/lite";
import { db } from "@/lib/firebase";
import { nanoid } from "nanoid";
import { Product } from "@/lib/types";

const PayingType = ({
  setSubmittedType,
  setSubmitted,
  selectedProducts,
  setSelectedProducts,
  total,
}: {
  setSubmittedType: (type: "cash" | "credit") => void;
  setSubmitted: (type: boolean) => void;
  selectedProducts: Product[];
  setSelectedProducts: any;
  total: number;
}) => {
  const id = nanoid(10);

  const handleSubmitTPE = async () => {
    try {
      await setDoc(doc(db, "bondeliv", id), {
        date: new Date().toISOString().slice(0, 16),
        ref: id,
        client: { name: "client comptoir" },
        products: selectedProducts,
        total: total,
        statut: "payé",
        method: "Carte TPE",
      });

      for (const product of selectedProducts) {
        await updateDoc(doc(db, "products", product.reference), {
          stock: product.stock - (product.quantity || 1),
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSelectedProducts([]);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        className="w-full text-xl flex flex-col h-20 bg-green-500 hover:bg-green-600"
        onClick={() => {
          setSubmittedType("cash");
          setSubmitted(false);
        }}
      >
        <CircleDollarSignIcon />
        Espèce
      </Button>
      <Button
        className="w-full text-xl flex flex-col h-20 bg-blue-500 hover:bg-blue-600"
        onClick={() => {
          setSubmittedType("credit");
          setSubmitted(false);
        }}
      >
        <UserCircle2 />
        Crédit
      </Button>
      <Button
        className="w-full text-xl flex flex-col h-20 bg-yellow-500 hover:bg-yellow-600"
        onClick={async () => {
          await handleSubmitTPE();
          setSubmitted(false);
        }}
      >
        <CreditCardIcon />
        Carte / TPE
      </Button>
      <Button
        className="w-full text-xl flex flex-col h-20 bg-red-500 hover:bg-red-600"
        onClick={() => {
          setSubmittedType("cash");
          setSubmitted(false);
        }}
      >
        <IdCardIcon />
        Carte Fédilité
      </Button>
    </div>
  );
};

export default PayingType;
