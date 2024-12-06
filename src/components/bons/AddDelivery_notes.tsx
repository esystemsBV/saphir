import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import LoadingLogo from "../others/LoadingLogo";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { t } from "i18next";
import { def } from "@/data/Links";
import brokenImage from "@/assets/brokenImage.png";
import { Button } from "../ui/button";
import Error from "../ui/Error";
import fetchData from "@/apis/HandleGetTable";
import { responseMessage } from "@/common/Functions";
import axios from "axios";
import { delivery_notes, products } from "@/lib/database";
import SelectType from "react-select";
import { Plus, X } from "lucide-react";

export default function AddDeliveryNotes({
  close,
  refresh,
  dataToAdd,
  setDataToAdd,
  edit,
  setEdit,
  selectedProducts,
  setSelectedProducts,
}: {
  close: () => void;
  refresh: () => void;
  dataToAdd: delivery_notes | null;
  setDataToAdd?: any;
  edit: boolean;
  setEdit: any;
  selectedProducts: products[];
  setSelectedProducts: any;
}) {
  const [errorMessage, setErrorMessage] = useState<false | string>(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [clientSearch, setClientSearch] = useState("");

  const {
    data: products,
    loading: loadingProducts,
  }: { data: products[]; loading: boolean } = fetchData({ page: "products" });

  const {
    data: clients,
    loading: loadingClients,
  }: { data: any[]; loading: boolean } = fetchData({
    page: "clients",
  });

  console.log(dataToAdd);

  const handleAddDeliveryNote = async (e: any) => {
    e.preventDefault();
    setErrorMessage(false);

    if (
      !dataToAdd?.client ||
      !dataToAdd.delivery_date ||
      selectedProducts.length === 0
    ) {
      setErrorMessage(t("delivery_notes.error.required_fields"));
      return;
    }

    setLoadingBtn(true);

    try {
      const deliveryData = {
        delivery_date: dataToAdd.delivery_date,
        type: dataToAdd.type || null,
        client_reference: dataToAdd.client?.reference,
        products: selectedProducts.map((prod) => ({
          product_reference: prod.reference,
          quantity: prod.quantity,
          price: prod.sellPrice,
        })),
      };

      const response: any = await axios.post(
        `${def}/delivery_notes/add`,
        deliveryData
      );
      responseMessage(response.data);
    } catch (error) {
      responseMessage({ success: false });
      console.error(error);
    } finally {
      setLoadingBtn(false);
      setSelectedProducts([]);
      setEdit(false);
      refresh();
      close();
    }
  };

  const handleEditDeliveryNote = async (e: any) => {
    e.preventDefault();
    setErrorMessage(false);

    if (!dataToAdd || !dataToAdd.reference || selectedProducts.length === 0) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setLoadingBtn(true);

    try {
      const deliveryData = {
        delivery_date: dataToAdd.delivery_date,
        type: dataToAdd.type || null,
        client_reference: dataToAdd.client?.reference || null,
        products: selectedProducts.map((prod) => ({
          product_reference: prod.reference,
          quantity: prod.quantity,
          price: prod.sellPrice,
        })),
      };

      const response: any = await axios.put(
        `${def}/delivery_notes/edit/${dataToAdd.reference}`,
        deliveryData
      );
      responseMessage(response.data);
    } catch (error) {
      responseMessage({ success: false });
      console.error(error);
    } finally {
      setLoadingBtn(false);
      setSelectedProducts([]);
      setEdit(false);
      refresh();
      close();
    }
  };
  const handleProductSearch = (e: any) => {
    setProductSearch(e.target.value);
  };

  const filteredProducts = products?.filter((prod) =>
    prod.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleQuantityChange = (id: number, newValue: number) => {
    const updatedProducts = selectedProducts.map((prod, index) =>
      index === id ? { ...prod, quantity: newValue } : prod
    );
    setSelectedProducts(updatedProducts);
  };

  const handlePriceChange = (id: number, newValue: number) => {
    const updatedProducts = selectedProducts.map((prod, index) =>
      index === id ? { ...prod, sellPrice: newValue } : prod
    );
    setSelectedProducts(updatedProducts);
  };

  const handleDeleteProduct = (id: number) => {
    const updatedProducts = selectedProducts.filter((_, index) => index !== id);
    setSelectedProducts(updatedProducts);
  };

  useEffect(() => {
    if (edit && dataToAdd) {
      setSelectedProducts(dataToAdd.products || []);
    }
  }, [edit, dataToAdd]);

  const customStyles = {
    control: (_: any, state: any) => ({
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "40px",
      width: "100%",
      borderRadius: "0.375rem",
      padding: "0 5px",
      fontSize: "14px",
      border: state.isFocused ? "1px solid #b12b89" : "1px solid #d1d5db",
      cursor: state.isDisabled ? "not-allowed" : "default",
      opacity: state.isDisabled ? 0.9 : 1,
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "",
    }),
    singleValue: (base: any) => ({
      ...base,
      display: "-webkit-box",
      WebkitLineClamp: "1",
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }),
  };

  return (
    <div>
      <div className="grid grid-cols-2 items-center gap-5">
        <SelectType
          isDisabled={edit}
          options={(clients || [])
            .filter((client) =>
              `${client.fname} ${client.lname}`
                .toLowerCase()
                .includes(clientSearch.toLowerCase())
            )
            .map((client) => ({
              value: client.reference,
              label: `${client.fname} ${client.lname}`,
              ...client,
            }))}
          styles={customStyles}
          value={dataToAdd?.client || null}
          onChange={(selectedOption: any) => {
            setDataToAdd({
              ...dataToAdd,
              client: selectedOption || null,
            });
          }}
          onInputChange={(inputValue: string) => setClientSearch(inputValue)}
          placeholder={t("search-by-name")}
          noOptionsMessage={() => t("no-clients")}
          isClearable
          isLoading={loadingClients}
        />

        <Input
          color="purple"
          type="datetime-local"
          value={dataToAdd?.delivery_date}
          onChange={(e) =>
            setDataToAdd({ ...dataToAdd, delivery_date: e.target.value })
          }
        />
      </div>

      <Input
        placeholder={t("delivery_notes.product_search")}
        className="mb-2 mt-3"
        color="purple"
        onChange={handleProductSearch}
        value={productSearch}
      />

      <div className="relative">
        <div className="flex flex-col fixed max-w-screen-2xl -mx-5 px-5 md:px-0 md:mx-auto rounded-lg z-50 shadow-xl bg-white w-full items-stretch overflow-y-auto mb-5">
          {productSearch &&
            filteredProducts?.map((prod, id) => (
              <div
                key={id}
                onClick={() => {
                  setSelectedProducts([
                    ...selectedProducts,
                    { ...prod, quantity: 1, price: prod.sellPrice },
                  ]);
                  setProductSearch("");
                }}
                className="border flex cursor-pointer hover:bg-main/10 duration-300 items-center justify-between rounded-lg p-3 capitalize"
              >
                <p>{prod.name}</p>
                <div className="w-7 bg-main flex items-center justify-center text-center text-white rounded-full h-7">
                  <Plus />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Product Table */}
      {selectedProducts.length > 0 && (
        <Table aria-label={t("table")} className="mt-2">
          <TableHeader>
            <TableRow>
              <TableHead>{t("image")}</TableHead>
              <TableHead>{t("products.designation")}</TableHead>
              <TableHead>{t("products.pv")}</TableHead>
              <TableHead>{t("quantity")}</TableHead>
              <TableHead>{t("delete")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingProducts ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t("loading")}
                </TableCell>
              </TableRow>
            ) : (
              selectedProducts.map((prod, id) => (
                <TableRow key={id}>
                  <TableCell className="w-20">
                    <img
                      src={prod.image ? `${def}${prod.image}` : brokenImage}
                      alt={prod.name}
                      className="size-12 object-cover rounded-sm bg-main"
                    />
                  </TableCell>
                  <TableCell className="capitalize">{prod.name}</TableCell>
                  <TableCell>
                    <input
                      type="number"
                      value={prod.sellPrice || 0}
                      min={0}
                      onChange={(e) => handlePriceChange(id, +e.target.value)}
                      className="text-center py-1 rounded-lg md:w-20 w-10"
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="number"
                      value={prod.quantity || 1}
                      min={1}
                      onChange={(e) =>
                        handleQuantityChange(id, Number(e.target.value))
                      }
                      className="text-center py-1 rounded-lg md:w-20 w-10"
                    />
                  </TableCell>
                  <TableCell>
                    <div
                      onClick={() => handleDeleteProduct(id)}
                      className="w-7 cursor-pointer bg-red-600 flex items-center justify-center text-center text-white rounded-full h-7"
                    >
                      <X />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      <form
        onSubmit={edit ? handleEditDeliveryNote : handleAddDeliveryNote}
        className="flex flex-col gap-3"
      >
        <Button type="submit" className="my-2 text-white bg-main">
          {loadingBtn ? <LoadingLogo /> : t("submit")}
        </Button>
      </form>

      {errorMessage && <Error title={t("error")} />}
    </div>
  );
}
