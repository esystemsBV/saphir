import { useState } from "react";
import { useTranslation } from "react-i18next";
import ErrorCompo from "@/components/ui/Error";
import { LoadingSpinning } from "@/components/ui/loadingspining";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { users } from "@/lib/database";
import { def } from "@/data/Links";
import { responseMessage } from "@/common/Functions";

export default function AddUser({
  setInfos,
  infos,
  updating,
  setUpdating,
  refresh,
}: {
  setInfos: any;
  infos: users | null;
  updating: any;
  setUpdating: any;
  refresh: () => void;
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddUser = async () => {
    setErrorMessage(null);

    setLoading(true);

    try {
      const response = await axios.post(`${def}/users/add`, infos);

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
      const response = await axios.put(`${def}/users/edit`, infos);

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
          placeholder={t("fname")}
          name="fname"
          value={infos?.fname}
          onChange={handleChange}
        />
        <Input
          placeholder={t("lname")}
          name="lname"
          value={infos?.lname}
          onChange={handleChange}
        />
        <Input
          placeholder={t("email")}
          name="email"
          value={infos?.email}
          onChange={handleChange}
        />
        <Input
          placeholder={t("password")}
          name="password"
          value={infos?.password}
          onChange={handleChange}
        />
        <Select
          onValueChange={(e) => setInfos({ ...infos, role: e })}
          value={infos?.role}
          name="role"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("select.role")}></SelectValue>
          </SelectTrigger>

          <SelectContent>
            {[
              "admin",
              "preparator",
              "delivery",
              "technicocommercial",
              "cashier",
            ].map((value, id) => (
              <SelectItem key={id} value={value} className="capitalize">
                {t(`roles.${value}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          name="phone"
          placeholder={t("phone")}
          onChange={handleChange}
          value={infos?.phone}
        />
      </div>

      {errorMessage && <ErrorCompo color="red" title={errorMessage} />}

      <Button
        className="my-5 bg-green-500 hover:bg-green-700 text-white"
        onClick={updating ? updateDocument : handleAddUser}
      >
        {loading ? <LoadingSpinning /> : updating ? t("edit") : t("submit")}
      </Button>
    </>
  );
}
