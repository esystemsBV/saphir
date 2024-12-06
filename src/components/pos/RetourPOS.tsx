import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import { nanoid } from "nanoid";
import { Button } from "../ui/button";
import InsideBtnLoading from "../miniCompos/InsideBtnLoading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { LoadingSpining } from "@/assets/icons";
import { clients } from "@/lib/database";

const RetourPOS = ({
  selectedProducts,
  setSelectedProducts,
  onOpenChange,
}: {
  selectedProducts: any;
  setSelectedProducts: (e: any[]) => void;
  onOpenChange: () => void;
}) => {
  const [selectedclient, setselectedclient] = useState<null | string>(null);
  const [type, setType] = useState<null | "client">(null);
  const [loading, setLoading] = useState(false);
  const [clients_data, setClients_data] = useState<null | clients[]>(null);

  const handleAddBonDeRec = async (pos: boolean) => {
    const id = nanoid(15);
    setLoading(true);

    try {
      await setDoc(doc(db, "bonderetourclient", id), {
        date: new Date(),
        ref: id,
        client: pos ? "Client comptoir" : selectedclient,
        products: selectedProducts,
        statut: "en cours",
      });
      {
        selectedProducts.map(async (value: any) => {
          await updateDoc(doc(db, "products", value.reference), {
            stock: value.quantity
              ? value.stock - value.quantity
              : value.stock - 1,
          });
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSelectedProducts([]);
      onOpenChange();
      setLoading(false);
    }
  };

  const getClients = async () => {
    if (!clients_data) {
      setLoading(true);

      try {
        const q = query(collection(db, "clients"));
        const querySnapshot = await getDocs(q);
        const dataArray: any[] = [];
        querySnapshot.forEach((doc) => {
          dataArray.push(doc.data());
        });

        setClients_data(dataArray.length > 0 ? dataArray : null);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <DialogContent className=" w-full">
        <DialogHeader>
          <DialogTitle>Retour</DialogTitle>
        </DialogHeader>

        <section>
          <div>
            {type === "client" ? (
              <div className=" max-w-lg mx-auto">
                <Select
                  onValueChange={setselectedclient}
                  value={selectedclient || ""}
                  name="clients"
                  onOpenChange={getClients}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selectionner un client" />
                  </SelectTrigger>

                  <SelectContent>
                    {clients_data?.map((value: any, id: number) => (
                      <SelectItem
                        key={id}
                        value={value?.name + "%20%" + value?.reference}
                        className="capitalize"
                      >
                        {value?.name.toLowerCase()} | {value?.reference}
                      </SelectItem>
                    ))}

                    {loading && (
                      <SelectItem
                        value="ss"
                        disabled
                        className="capitalize flex justify-center"
                      >
                        <LoadingSpining />
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <Button
                  disabled={!selectedclient}
                  className="w-full h-16 text-xl mt-5 flex flex-col bg-green-500 hover:bg-green-600"
                  onClick={() => handleAddBonDeRec(false)}
                >
                  <InsideBtnLoading text="Valider" loading={loading} />
                </Button>
              </div>
            ) : (
              <div className="max-w-md space-y-5 mx-auto">
                <Button
                  className="w-full h-20 text-xl flex flex-col bg-blue-500 hover:bg-blue-600"
                  onClick={() => handleAddBonDeRec(true)}
                >
                  Client comptoir
                </Button>

                <Button
                  className="w-full h-20 text-xl flex flex-col bg-yellow-500 hover:bg-yellow-600"
                  onClick={() => setType("client")}
                >
                  Client
                </Button>
              </div>
            )}
          </div>
        </section>
      </DialogContent>
    </>
  );
};

export default RetourPOS;

// <Select
//   onValueChange={(e) =>
//     setInfos({ ...infos, responsiblename: e })
//   }
//   value={infos?.function}
//   name="responsiblename"
// >
//   <SelectTrigger className="w-full">
//     <SelectValue placeholder="Nom complet du responsable d'agence" />
//   </SelectTrigger>

//   <SelectContent>
//     {data ? (
//                       data?.map((value: any, id: number) => (
//                         <SelectItem
//                           key={id}
//                           value={value?.userUID + "%20%" + value?.fullname}
//                           className="capitalize"
//                         >
//                           {value?.fullname}
//                         </SelectItem>
//                       ))
//                     ) : (
//                       <SelectItem value="f">x</SelectItem>
//                     )}
//   </SelectContent>
// </Select>;
