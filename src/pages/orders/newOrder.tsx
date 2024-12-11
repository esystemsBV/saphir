import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import Title from "@/components/ui/Title";
import SmallTitle from "@/components/ui/smalltitle";
import { t } from "i18next";
import { DataSelectionDialog } from "@/components/ProductSelectionDialog";
import { products } from "@/lib/database";

interface OrderInfo {
  orderid: string;
  agence: string;
  date: string;
  fullname: string;
  phone: string;
  whatsapp: string;
  city: string;
  adress: string;
  price: string;
  paymentmethod: string;
  ncolis: string;
  notes: string;
  invoice: boolean;
  ice?: string;
  raisonsocial?: string;
  siegesocial?: string;
  livreur?: any;
  preparateur?: any;
}

interface DataType {
  agences: { agenceId: string; name: string }[];
  livreur: { userUID: string; fullname: string }[];
  preparateur: { userUID: string; fullname: string }[];
}

export default function NewOrder() {
  const [infos, setInfos] = useState<OrderInfo>({
    orderid: `ORD-${Date.now()}`,
    agence: "",
    date: new Date().toISOString().split("T")[0],
    fullname: "",
    phone: "",
    whatsapp: "",
    city: "",
    adress: "",
    price: "",
    paymentmethod: "",
    ncolis: "",
    notes: "",
    invoice: false,
  });
  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [data, setData] = useState<DataType>({
    agences: [],
    livreur: [],
    preparateur: [],
  });
  const [selectedProduct, setSelectedProduct] = useState<products[]>([]);

  const notify = (type: "success" | "error", message: string) =>
    toast({
      title: type === "success" ? "Success" : "Error",
      description: message,
    });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setInfos((prevInfos) => ({
      ...prevInfos,
      [name]: value,
    }));
  };

  const loadMockData = () => {
    // Mock data to simulate fetching from the backend
    const mockData = {
      agences: [
        { agenceId: "1", name: "Agence 1" },
        { agenceId: "2", name: "Agence 2" },
      ],
      livreur: [
        { userUID: "1", fullname: "Livreur 1" },
        { userUID: "2", fullname: "Livreur 2" },
      ],
      preparateur: [
        { userUID: "3", fullname: "Preparateur 1" },
        { userUID: "4", fullname: "Preparateur 2" },
      ],
    };

    setData(mockData);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    loadMockData();
    setInfos((prevInfos) => ({
      ...prevInfos,
      orderid: `ORD-${Date.now()}`,
      invoice: false,
    }));
  }, []);

  const handleSubmitNewOrder = () => {
    setLoadingBtn(true);

    try {
      console.log("Order submitted:", {
        client: {
          name: infos.fullname,
          phone: infos.phone,
          whatsapp: infos.whatsapp,
          location: {
            city: infos.city,
            address: infos.adress,
          },
        },
        orderDetails: {
          product: selectedProduct,
          quantity: infos.ncolis,
          price: infos.price,
          paymentMethod: infos.paymentmethod,
        },
        team: {
          agence: infos.agence,
          livreur: infos.livreur,
          preparateur: infos.preparateur,
        },
        notes: infos.notes,
        invoice: infos.invoice
          ? {
              ice: infos.ice,
              raisonsocial: infos.raisonsocial,
              siegesocial: infos.siegesocial,
            }
          : null,
      });

      notify("success", "Order submitted successfully!");
    } catch (error) {
      console.error("Error submitting order:", error);
      notify("error", "Error submitting order.");
    } finally {
      setLoadingBtn(false);
    }
  };
  const onSelectProduct = (product: products) => {
    setSelectedProduct([product, ...selectedProduct]);
  };
  return (
    <>
      <Title title={t("neworder")} />
      <main className="flex flex-col gap-10">
        <section>
          <SmallTitle title={t("orderInfo")} />
          <div className="flex flex-col gap-5">
            <Select
              name="agence"
              value={infos.agence}
              onValueChange={(value) => setInfos({ ...infos, agence: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("selectAgency")} />
              </SelectTrigger>
              <SelectContent>
                {data.agences.map((agence) => (
                  <SelectItem key={agence.agenceId} value={agence.agenceId}>
                    {agence.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="datetime-local"
              name="date"
              value={infos.date}
              onChange={handleChange}
              placeholder={t("deliveryDate")}
            />

            <DataSelectionDialog
              table="/products/withfamilyname"
              onSelectProduct={onSelectProduct}
              ButtonTitle={t("products.add")}
            />
          </div>
        </section>

        <section>
          <SmallTitle title={t("customerInfo")} />
          <div className="flex flex-col gap-5">
            <Input
              type="text"
              name="fullname"
              value={infos.fullname}
              onChange={handleChange}
              placeholder={t("fullName")}
            />
            <Input
              type="text"
              name="phone"
              value={infos.phone}
              onChange={handleChange}
              placeholder={t("phone")}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="same-as-phone"
                onCheckedChange={(checked) =>
                  setInfos({
                    ...infos,
                    whatsapp: checked ? infos.phone : "",
                  })
                }
              />
              <label htmlFor="same-as-phone">{t("sameAsPhone")}</label>
            </div>
            <Input
              type="text"
              name="city"
              value={infos.city}
              onChange={handleChange}
              placeholder={t("city")}
            />
            <Input
              type="text"
              name="adress"
              value={infos.adress}
              onChange={handleChange}
              placeholder={t("address")}
            />
          </div>
        </section>

        <section>
          <SmallTitle title={t("orderDetails")} />
          <div className="flex flex-col gap-5">
            <Input
              type="number"
              name="price"
              value={infos.price}
              onChange={handleChange}
              placeholder={t("price")}
            />
            <Select
              name="paymentmethod"
              value={infos.paymentmethod}
              onValueChange={(value) =>
                setInfos({ ...infos, paymentmethod: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("paymentMethod")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">{t("cash")}</SelectItem>
                <SelectItem value="virement">{t("virement")}</SelectItem>
                <SelectItem value="cheque">{t("cheque")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        <Button onClick={handleSubmitNewOrder} disabled={loadingBtn}>
          {loadingBtn ? t("submitting") : t("submitOrder")}
        </Button>
      </main>
    </>
  );
}
