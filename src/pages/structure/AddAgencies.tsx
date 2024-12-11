import { useState } from "react";
import { useTranslation } from "react-i18next";
import ErrorCompo from "@/components/ui/Error";
import { LoadingSpinning } from "@/components/ui/loadingspining";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { agencies } from "@/lib/database";
import { def } from "@/data/Links";
import { responseMessage } from "@/common/Functions";

export default function AddAgencies({
  setInfos,
  infos,
  updating,
  setUpdating,
  refresh,
}: {
  setInfos: any;
  infos: agencies | null;
  updating: any;
  setUpdating: any;
  refresh: () => void;
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddagencie = async () => {
    setErrorMessage(null);

    setLoading(true);

    try {
      const response = await axios.post(`${def}/agencies/add`, infos);

      responseMessage({ res: response.data, refresh: refresh });
    } catch (error) {
      console.error(error);
      setErrorMessage(t("error.email_already_used"));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const el = e.target;
    setInfos({ ...infos, [el.name]: el.value });
  };

  const updateDocument = async () => {
    setLoading(true);

    try {
      const response = await axios.put(`${def}/agencies/edit`, infos);

      responseMessage({ res: response.data, refresh: refresh });
    } catch (err) {
    } finally {
      setLoading(false);
      setUpdating();
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-5">
        <Input
          placeholder={t("name")}
          name="name"
          value={infos?.name}
          onChange={handleChange}
        />
        <Input
          placeholder={t("location")}
          name="location"
          value={infos?.location}
          onChange={handleChange}
        />
        <Input
          placeholder={t("phone")}
          name="phone"
          value={infos?.phone}
          onChange={handleChange}
        />
        <Input
          placeholder={t("responsible")}
          name="responsible"
          value={infos?.responsible}
          onChange={handleChange}
        />
      </div>

      {errorMessage && <ErrorCompo color="red" title={errorMessage} />}

      <Button
        className="my-5 bg-green-500 hover:bg-green-700 text-white"
        onClick={updating ? updateDocument : handleAddagencie}
      >
        {loading ? <LoadingSpinning /> : updating ? t("edit") : t("submit")}
      </Button>
    </>
  );
}
