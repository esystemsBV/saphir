import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { packs, products } from "@/lib/database";
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
import { FormPreNumbers, responseMessage } from "@/common/Functions";
import axios from "axios";
import ImageUpload from "../others/ImageUpload";

export default function AddPack({
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
  dataToAdd: packs | null;
  setDataToAdd?: any;
  edit: boolean;
  setEdit: any;
  selectedProducts: products[];
  setSelectedProducts: any;
}) {
  const [errorMessage, setErrorMessage] = useState<false | string>(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pic, setPic] = useState<any>(null);
  const {
    data: products,
    loading,
    setLoading,
  }: { data: products[]; loading: boolean; setLoading: any } = fetchData({
    page: "products",
  });

  const handleAddPack = async (e: any) => {
    e.preventDefault();
    setErrorMessage(false);

    if (
      !dataToAdd?.name ||
      !dataToAdd?.reference ||
      selectedProducts.length <= 0
    ) {
      setErrorMessage(
        "S'il vous plaît, remplissez toutes les entrées valides ou ajoutez des produits!"
      );
    } else {
      setLoadingBtn(true);

      try {
        const formData = new FormData();
        formData.append("reference", `${dataToAdd.reference}`);
        formData.append("name", dataToAdd.name);
        formData.append("price", dataToAdd.price);
        formData.append(
          "productReferences",
          JSON.stringify(
            selectedProducts.map(
              (value) =>
                [{ reference: value.reference, quantity: value.quantity }][0]
            )
          )
        );

        if (pic) {
          formData.append("image", pic);
        }

        const response: any = await axios.post(`${def}/packs/add`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        responseMessage(response.data);
      } catch (error) {
        responseMessage({ success: false });

        console.log(error);
      } finally {
        setLoadingBtn(false);
        setSelectedProducts([]);
        refresh();
        close();
      }
    }
  };

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const filteredOrders = products?.filter((prod) => {
    const matchesSearch =
      `${prod.reference}`.includes(searchTerm.toLowerCase()) ||
      prod.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleEditQuantity = (id: any, value: any) => {
    const updatedProducts = selectedProducts.map((prod, index) =>
      index === id ? { ...prod, quantity: value } : prod
    );
    setSelectedProducts(updatedProducts);
  };

  const handleQuantityChange = (id: any, newValue: any) => {
    const updatedProducts = selectedProducts.map((prod, index) =>
      index === id ? { ...prod, quantity: newValue } : prod
    );
    setSelectedProducts(updatedProducts);
  };

  const handleEditPack = async (e: any) => {
    e.preventDefault();

    if (
      !dataToAdd?.name ||
      !dataToAdd?.reference ||
      selectedProducts.length <= 0
    ) {
      setErrorMessage(
        "S'il vous plaît, remplissez toutes les entrées valides ou ajoutez des produits!"
      );
    } else {
      try {
        const response: any = await axios.put(`${def}/packs/edit`, {
          reference: dataToAdd.reference,
          name: dataToAdd.name,
          price: dataToAdd.price,
          productReferences: JSON.stringify(
            selectedProducts.map(
              (value) =>
                [{ reference: value.reference, quantity: value.quantity }][0]
            )
          ),
        });
        responseMessage(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingBtn(false);
        setDataToAdd({ name: "", ref: "", price: "" });
        setSelectedProducts([]);
        refresh();
        close();
        setEdit(false);
      }
    }
  };

  console.log(selectedProducts);

  const handleDeleteProduct = (id: number) => {
    const updatedProducts = selectedProducts.filter((_, index) => index !== id);
    setSelectedProducts(updatedProducts);
  };

  const handleProfilePictureChange = (file: File | null) => {
    setPic(file);
  };

  const getData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${def}/packs/getProductsOfPack/${dataToAdd?.reference}`
      );

      if (res.data.success) {
        setSelectedProducts(res.data.data);
      } else {
        console.log(res.data.error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (edit) {
      getData();
    }
  }, [edit]);

  return (
    <div>
      {!edit && <ImageUpload onImageChange={handleProfilePictureChange} />}

      <Input
        placeholder="Rechercher des produits à ajouter"
        className="mb-2"
        color="purple"
        onChange={handleSearch}
        value={searchTerm}
      />

      <div className="relative">
        <div className="flex flex-col absolute z-10 shadow-xl bg-white w-full items-stretch max-h-40 overflow-auto mb-5">
          {searchTerm &&
            filteredOrders?.map((prod, id) => (
              <div
                key={id}
                className=" border flex items-center bg-white justify-between rounded-lg p-3 capitalize"
              >
                <p>{prod.name}</p>
                <div
                  onClick={() => {
                    setSelectedProducts([
                      ...selectedProducts,
                      { ...prod, quantity: 1 },
                    ]);
                    setSearchTerm("");
                  }}
                  className=" w-7 cursor-pointer bg-main flex items-center justify-center text-center text-white rounded-full h-7"
                >
                  +
                </div>
              </div>
            ))}
        </div>
      </div>

      <Table aria-label="table" className="mt-2">
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
          {loading ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                {t("loading")}
              </TableCell>
            </TableRow>
          ) : selectedProducts && selectedProducts.length > 0 ? (
            selectedProducts.map((prod, id) => (
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
                <TableCell className="text-lg">{prod.boughtPrice}</TableCell>
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

      <hr className="my-5" />

      <form
        onSubmit={edit ? handleEditPack : handleAddPack}
        className="flex flex-col gap-3"
      >
        <Input
          placeholder="Référence"
          disabled={edit}
          color="purple"
          name="ref"
          value={dataToAdd?.reference}
          onChange={(e) =>
            setDataToAdd({ ...dataToAdd, reference: e.target.value })
          }
        />
        <Input
          placeholder="Désignation"
          color="purple"
          name="name"
          value={dataToAdd?.name}
          onChange={(e) => setDataToAdd({ ...dataToAdd, name: e.target.value })}
        />
        <Input
          placeholder="Prix"
          color="purple"
          name="price"
          value={dataToAdd?.price}
          onChange={(e) =>
            setDataToAdd({ ...dataToAdd, price: e.target.value })
          }
        />

        <Button type="submit" className="my-2 text-white bg-main">
          {loadingBtn ? <LoadingLogo /> : edit ? t("submit") : t("submit")}
        </Button>
      </form>

      {errorMessage && <Error title={t("error")} />}
    </div>
  );
}
