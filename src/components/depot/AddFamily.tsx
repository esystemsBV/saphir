import { SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { families } from "@/lib/database";
import LoadingLogo from "../others/LoadingLogo";
import { Input } from "../ui/input";
import axios from "axios";
import { def } from "@/data/Links";
import { responseMessage } from "@/common/Functions";
import ImageUpload from "../others/ImageUpload";

interface formalProps {
  edit: boolean;
  setEdit: (val?: boolean) => void;
  refresh: () => void;
  selectedFamily: families | null;
  setSelectedFamily: SetStateAction<any>;
  close: () => void;
}

export default function AddFamily({
  edit,
  refresh,
  selectedFamily,
  setSelectedFamily,
  close,
}: formalProps) {
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [pic, setPic] = useState<any>(null);

  const handleAddFamily = async () => {
    if (!selectedFamily?.name) {
      responseMessage({ res: { success: false } });
    } else {
      setLoadingBtn(true);

      try {
        const formData = new FormData();
        formData.append("name", selectedFamily.name);

        if (pic) {
          formData.append("image", pic);
        }

        const response: any = await axios.post(
          `${def}/families/add`,
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
        setSelectedFamily(null);
        close();
      }
    }
  };

  const handleEditFamily = async () => {
    if (!selectedFamily?.name) {
      responseMessage({ res: { success: false } });
    } else {
      setLoadingBtn(true);

      try {
        const response: any = await axios.put(`${def}/families/edit`, {
          name: selectedFamily.name || "UndefinedFamilyName",
          reference: selectedFamily.reference,
        });
        responseMessage(response.data);
      } catch (error) {
        responseMessage({ res: { success: false } });
      } finally {
        setLoadingBtn(false);
        refresh();
        close();
        setSelectedFamily(null);
      }
    }
  };

  const handleProfilePictureChange = (file: File | null) => {
    setPic(file);
  };

  return (
    <div>
      {!edit && <ImageUpload onImageChange={handleProfilePictureChange} />}

      <form onSubmit={edit ? handleEditFamily : handleAddFamily}>
        <Input
          placeholder="Désignation"
          name="name"
          value={selectedFamily?.name}
          onChange={(e) =>
            setSelectedFamily({ ...selectedFamily, name: e.target.value })
          }
        />

        <Button
          disabled={!selectedFamily || loadingBtn}
          type="submit"
          className="my-5 text-white bg-main"
          onClick={edit ? handleEditFamily : handleAddFamily}
        >
          {loadingBtn ? (
            <LoadingLogo />
          ) : edit ? (
            "Modifier une famille"
          ) : (
            "Ajouter une famille"
          )}
        </Button>
      </form>
    </div>
  );
}
