import { SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { families, products } from "@/lib/database";
import LoadingLogo from "../others/LoadingLogo";
import { Input } from "../ui/input";
import axios from "axios";
import { def } from "@/data/Links";
import { responseMessage } from "@/common/Functions";
import ImageUpload from "../others/ImageUpload";
import fetchData from "@/apis/HandleGetTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { t } from "i18next";

interface formalProps {
  edit: boolean;
  setEdit: (val?: boolean) => void;
  refresh: () => void;
  selectedProduct: products | null;
  setselectedProduct: SetStateAction<any>;
  close: () => void;
}

export default function AddProduct({
  edit,
  refresh,
  selectedProduct,
  setselectedProduct,
  close,
}: formalProps) {
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [pic, setPic] = useState<any>(null);
  const { data, loading }: { data: families[]; loading: boolean } = fetchData({
    page: "families",
  });

  const handleAddProduct = async () => {
    if (!selectedProduct?.name) {
      responseMessage({ res: { success: false } });
    } else {
      setLoadingBtn(true);

      try {
        const formData = new FormData();
        formData.append("reference", `${selectedProduct.reference}`);
        formData.append("familyId", selectedProduct.familyId);
        formData.append("name", selectedProduct.name);
        formData.append("boughtPrice", `${selectedProduct.boughtPrice}`);
        formData.append("sellPrice", `${selectedProduct.sellPrice}`);
        formData.append("stock", `${selectedProduct.stock}`);

        if (pic) {
          formData.append("image", pic);
        }

        const response: any = await axios.post(
          `${def}/products/add`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        responseMessage(response.data);
      } catch (error) {
        responseMessage({ res: { success: false } });
      } finally {
        setLoadingBtn(false);
        refresh();
        setselectedProduct(null);
        close();
      }
    }
  };

  const handleEditProduct = async () => {
    if (!selectedProduct?.name) {
      responseMessage({ res: { success: false } });
    } else {
      setLoadingBtn(true);

      try {
        const response: any = await axios.put(`${def}/products/edit`, {
          reference: selectedProduct.reference,
          name: selectedProduct.name,
          boughtPrice: selectedProduct.boughtPrice,
          sellPrice: selectedProduct.sellPrice,
          stock: selectedProduct.stock,
        });
        responseMessage(response.data);
      } catch (error) {
        responseMessage({ res: { success: false } });
      } finally {
        setLoadingBtn(false);
        refresh();
        close();
        setselectedProduct(null);
      }
    }
  };

  const handleProfilePictureChange = (file: File | null) => {
    setPic(file);
  };

  return (
    <div>
      {!edit && <ImageUpload onImageChange={handleProfilePictureChange} />}

      <form onSubmit={edit ? handleEditProduct : handleAddProduct}>
        <div className=" md:grid grid-cols-2 gap-5">
          <Input
            disabled={edit}
            placeholder="Référence"
            name="reference"
            value={selectedProduct?.reference}
            onChange={(e) =>
              setselectedProduct({
                ...selectedProduct,
                reference: e.target.value,
              })
            }
          />
          <Input
            placeholder="Désignation"
            name="name"
            value={selectedProduct?.name}
            onChange={(e) =>
              setselectedProduct({ ...selectedProduct, name: e.target.value })
            }
          />

          <Select
            value={selectedProduct?.familyId}
            onValueChange={(e) =>
              setselectedProduct({ ...selectedProduct, familyId: e })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selectionner une famille" />
            </SelectTrigger>
            <SelectContent>
              {loading ? (
                <SelectItem value={"x"} disabled>
                  {t("loading")}
                </SelectItem>
              ) : (
                data.map((val) => (
                  <SelectItem key={val.reference} value={`${val.reference}`}>
                    {val.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Input
            placeholder="Prix d'achat"
            name="boughtPrice"
            type="number"
            value={selectedProduct?.boughtPrice}
            onChange={(e) =>
              setselectedProduct({
                ...selectedProduct,
                boughtPrice: e.target.value,
              })
            }
          />
          <Input
            placeholder="Prix de vente"
            type="number"
            name="sellPrice"
            value={selectedProduct?.sellPrice}
            onChange={(e) =>
              setselectedProduct({
                ...selectedProduct,
                sellPrice: e.target.value,
              })
            }
          />
          <Input
            placeholder={t("stock")}
            disabled={edit}
            name="stock"
            type="number"
            value={selectedProduct?.stock || 0}
            onChange={(e) =>
              setselectedProduct({
                ...selectedProduct,
                stock: e.target.value,
              })
            }
          />
        </div>

        <Button
          disabled={!selectedProduct || loadingBtn}
          type="submit"
          className="my-5 text-white bg-main"
          onClick={edit ? handleEditProduct : handleAddProduct}
        >
          {loadingBtn ? (
            <LoadingLogo />
          ) : edit ? (
            "Modifier un produit"
          ) : (
            "Ajouter un produit"
          )}
        </Button>
      </form>
    </div>
  );
}
