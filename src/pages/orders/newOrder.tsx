import React, { useState } from "react";
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
import Title from "@/components/ui/Title";
import SmallTitle from "@/components/ui/smalltitle";
import { t } from "i18next";
import { DataSelectionDialog } from "@/components/ProductSelectionDialog";
import {
  agencies,
  order,
  packs,
  paimentsTypes,
  products,
  users,
} from "@/lib/database";
import fetchData from "@/apis/HandleGetTable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { def } from "@/data/Links";
import brokenImage from "@/assets/brokenImage.png";
import { FormPreNumbers, responseMessage } from "@/common/Functions";
import FetchTableURL from "@/apis/HandleGetElement";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function NewOrder() {
  const navigate = useNavigate();
  const [infos, setInfos] = useState<order>({
    fullname: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "",
    agence: null,
    livreur: null,
    preparateur: null,
    ncolis: 1,
    notes: "",
    payment_method: "cash",
    is_company: false,
    order_date: new Date().toISOString().split("T")[0],
    order_time: new Date().toISOString().split("T")[1].split(".")[0],
    ice: null,
    siegesocial: null,
    raisonsocial: null,
  });
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<products[]>([]);
  const {
    data: agency,
  }: {
    data: agencies[];
  } = fetchData({
    page: "agencies",
  });

  const {
    data: preparateurs,
  }: {
    data: users[];
  } = FetchTableURL({
    url: "/users/fetch/preparator",
  });
  const {
    data: livreurs,
  }: {
    data: users[];
  } = FetchTableURL({
    url: "/users/fetch/delivery",
  });
  const {
    data: admins,
  }: {
    data: users[];
  } = FetchTableURL({
    url: "/users/fetch/admin",
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

  const handleSubmitNewOrder = async () => {
    setLoadingBtn(true);

    try {
      const response = await axios.post(`${def}/orders/add`, {
        ...infos,
        products: selectedProduct,
      });

      if (response.data.success) {
        responseMessage({ res: response.data });

        await axios.post(`${def}/api/send-notification`, {
          userId: infos.preparateur,
          payload: {
            title: "Nouvelle Commande!",
            body: "Vous avez une nouvelle commande à préparer.",
            icon: null,
            url: `${import.meta.env.VITE_notifs}/orders/label`,
          },
        });

        admins.map(async (admin) => {
          await axios.post(`${def}/api/send-notification`, {
            userId: admin.reference,
            payload: {
              title: "Nouvelle Commande!",
              body: "Vous avez une nouvelle commande à préparer.",
              icon: null,
              url: `${import.meta.env.VITE_notifs}/orders/details/${
                response.data.order_reference
              }`,
            },
          });
        });
        navigate("/orders/list");
      } else {
        responseMessage({ res: response.data });
      }
    } catch (error) {
      console.error("Error submitting order:", error);
    } finally {
      setLoadingBtn(false);
    }
  };

  const onSelectProduct = (product: products) => {
    setSelectedProduct([product, ...selectedProduct]);
  };

  const handleEditQuantity = (id: any, value: any) => {
    const updatedProducts = selectedProduct.map((prod, index) =>
      index === id ? { ...prod, quantity: value } : prod
    );
    setSelectedProduct(updatedProducts);
  };

  const handleQuantityChange = (id: any, newValue: any) => {
    const updatedProducts = selectedProduct.map((prod, index) =>
      index === id ? { ...prod, quantity: newValue } : prod
    );
    setSelectedProduct(updatedProducts);
  };

  const handleDeleteProduct = (id: number) => {
    const updatedProducts = selectedProduct.filter((_, index) => index !== id);
    setSelectedProduct(updatedProducts);
  };

  const totalPrice = selectedProduct.reduce(
    (total, product) => total + product.sellPrice * (product.quantity || 1),
    0
  );

  return (
    <>
      <Title title={t("neworder")} />
      <main className="flex flex-col gap-10">
        <section>
          <SmallTitle title={t("orderInfo")} />
          <div className="flex flex-col gap-5">
            <Select
              name="agence"
              value={infos.agence?.toString()}
              onValueChange={(value) => setInfos({ ...infos, agence: +value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("selectAgency")} />
              </SelectTrigger>
              <SelectContent>
                {agency.map((agence) => (
                  <SelectItem
                    key={agence.reference}
                    value={agence.reference.toString()}
                  >
                    {agence.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <section className="flex gap-5">
              <Input
                type="date"
                name="order_date"
                value={infos.order_date}
                onChange={handleChange}
                placeholder={t("deliveryDate")}
              />
              <Input
                type="time"
                name="order_time"
                value={infos.order_time}
                onChange={handleChange}
                placeholder={t("deliveryTime")}
              />
            </section>
          </div>
        </section>

        <section>
          <SmallTitle title={t("customerInfo")} />
          <div className="flex flex-col gap-5">
            <section className="flex gap-5">
              <Input
                type="text"
                name="fullname"
                value={infos.fullname}
                onChange={handleChange}
                placeholder={t("fullName")}
              />
              <Input
                type="text"
                name="ncolis"
                value={infos.ncolis}
                onChange={handleChange}
                placeholder={t("ncolis")}
              />
            </section>
            <section className="flex gap-5">
              <Input
                type="text"
                name="phone"
                value={infos.phone}
                onChange={handleChange}
                placeholder={t("phone")}
              />
              <Input
                type="text"
                name="whatsapp"
                value={infos.whatsapp}
                onChange={handleChange}
                placeholder={t("whatsapp")}
              />
            </section>
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
            <section className="flex gap-5">
              <Input
                type="text"
                name="city"
                value={infos.city}
                onChange={handleChange}
                placeholder={t("city")}
              />
              <Input
                type="text"
                name="address"
                value={infos.address}
                onChange={handleChange}
                placeholder={t("address")}
              />
            </section>
          </div>
        </section>

        <section>
          <SmallTitle title={t("orderDetails")} />

          <DataSelectionDialog
            onSelectPack={(pack: packs) => console.log(pack)}
            onSelectProduct={onSelectProduct}
            ButtonTitle={t("products.add")}
          />

          <Table
            style={{ display: selectedProduct.length > 0 ? "table" : "none" }}
            aria-label="table"
            className="mt-2"
          >
            <TableHeader>
              <TableRow>
                <TableHead>{t("image")}</TableHead>
                <TableHead>{t("products.designation")}</TableHead>
                <TableHead>{t("products.pv")}</TableHead>
                <TableHead>{t("products.pa")}</TableHead>
                <TableHead>{t("quantity")}</TableHead>
                <TableHead>{t("delete")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedProduct && selectedProduct.length > 0 ? (
                selectedProduct.map((prod, id) => (
                  <TableRow key={id}>
                    <TableCell className="w-20">
                      <img
                        src={prod.image ? `${def}${prod.image}` : brokenImage}
                        alt={prod.name}
                        className="size-12 object-cover rounded-sm bg-main"
                      />
                    </TableCell>
                    <TableCell className="capitalize">
                      <p className="text-base font-medium">{prod.name}</p>
                      <p className="text-gray-500 -mt-0.5">
                        {FormPreNumbers(`${prod.reference}`)}
                      </p>
                    </TableCell>
                    <TableCell className="text-lg">{prod.sellPrice}</TableCell>
                    <TableCell className="text-lg">
                      {prod.boughtPrice}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleEditQuantity(
                              id,
                              Math.max((prod?.quantity || 1) - 1, 1)
                            )
                          }
                          className=" w-7 cursor-pointer bg-main flex items-center justify-center text-center text-white rounded-full h-7"
                        >
                          -
                        </button>
                        <input
                          value={prod.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              id,
                              Math.max(1, Number(e.target.value))
                            )
                          }
                          className="text-center focus:outline-main py-1 duration-300 outline-none rounded-lg md:w-20 w-10"
                        />
                        <button
                          onClick={() =>
                            handleEditQuantity(id, (prod.quantity || 1) + 1)
                          }
                          className=" w-7 cursor-pointer bg-main flex items-center justify-center text-center text-white rounded-full h-7"
                        >
                          +
                        </button>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div
                        onClick={() => handleDeleteProduct(id)}
                        className="w-7 cursor-pointer bg-red-600 flex items-center justify-center text-center text-white rounded-full h-7"
                      >
                        X
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {t("packs.empty")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <hr />

          <div className="flex gap-5 mt-5">
            <Input
              type="number"
              name="price"
              value={totalPrice}
              disabled
              placeholder={t("montant")}
            />
            <Select
              name="payment_method"
              value={infos.payment_method}
              onValueChange={(value: paimentsTypes) =>
                setInfos({ ...infos, payment_method: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("paymentMethod")} />
              </SelectTrigger>
              <SelectContent>
                {["cash", "tpe", "cheque", "effect", "virement", "others"].map(
                  (value) => (
                    <SelectItem value={value}>{t(value)}</SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center mt-5 space-x-2">
            <Checkbox
              onCheckedChange={(checked) =>
                setInfos({
                  ...infos,
                  is_company: checked ? true : false,
                })
              }
            />
            <label>{t("withFacturation")}</label>
          </div>
        </section>

        {infos.is_company && (
          <section>
            <SmallTitle title={t("facturationdetails")} />
            <section className="flex gap-5">
              <Input
                type="text"
                name="ice"
                value={infos.ice || ""}
                onChange={handleChange}
                placeholder={t("ice")}
              />
              <Input
                type="text"
                name="raisonsocial"
                value={infos.raisonsocial || ""}
                onChange={handleChange}
                placeholder={t("raisonsocial")}
              />
              <Input
                type="text"
                name="siegesocial"
                value={infos.siegesocial || ""}
                onChange={handleChange}
                placeholder={t("siegesocial")}
              />
            </section>
          </section>
        )}

        <section>
          <SmallTitle title={t("rolesManagement")} />
          <div className="flex flex-col gap-5">
            <section className="flex gap-5">
              <Select
                disabled={livreurs.length === 0 && admins.length === 0}
                name="livreur"
                value={infos.livreur?.toString()}
                onValueChange={(value) =>
                  setInfos({ ...infos, livreur: +value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("selectdeliverylocation")} />
                </SelectTrigger>
                <SelectContent>
                  {livreurs.map((livreur) => (
                    <SelectItem
                      key={livreur.reference}
                      value={livreur.reference.toString()}
                    >
                      {livreur.fname} {livreur.lname}
                    </SelectItem>
                  ))}
                  {admins.map((preparateur) => (
                    <SelectItem
                      key={preparateur.reference}
                      value={preparateur.reference.toString()}
                    >
                      {preparateur.fname} {preparateur.lname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                disabled={preparateurs.length === 0 && admins.length === 0}
                name="preparateur"
                value={infos.preparateur?.toString()}
                onValueChange={(value) =>
                  setInfos({ ...infos, preparateur: +value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t("selectpreparationuserlocation")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {preparateurs.map((preparateur) => (
                    <SelectItem
                      key={preparateur.reference}
                      value={preparateur.reference.toString()}
                    >
                      {preparateur.fname} {preparateur.lname}
                    </SelectItem>
                  ))}
                  {admins.map((preparateur) => (
                    <SelectItem
                      key={preparateur.reference}
                      value={preparateur.reference.toString()}
                    >
                      {preparateur.fname} {preparateur.lname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </section>

            <textarea
              placeholder={t("notes")}
              className="border border-gray-200 rounded-lg px-3 focus:outline-main h-20 text-sm py-2"
            />
          </div>
        </section>

        <Button onClick={handleSubmitNewOrder} disabled={loadingBtn}>
          {loadingBtn ? t("loading") : t("submit")}
        </Button>
      </main>
    </>
  );
}
