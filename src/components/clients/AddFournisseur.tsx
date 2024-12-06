import { SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { fournisseurs } from "@/lib/database";
import LoadingLogo from "../others/LoadingLogo";
import { Input } from "../ui/input";
import axios from "axios";
import { def } from "@/data/Links";
import { responseMessage } from "@/common/Functions";
import { t } from "i18next";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";

interface formalProps {
  edit: boolean;
  setEdit: (val?: boolean) => void;
  refresh: () => void;
  data: fournisseurs | null;
  setData: SetStateAction<any>;
  close: () => void;
}

export default function AddFournisseurs({
  edit,
  refresh,
  data,
  setData,
  close,
}: formalProps) {
  const [loadingBtn, setLoadingBtn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data?.fname || !data?.lname || !data?.phone) {
      responseMessage({
        success: false,
      });
      return;
    }

    if (
      data.type === "company" &&
      (!data.company_rc ||
        !data.company_if ||
        !data.company_ice ||
        !data.company_tp)
    ) {
      responseMessage({ success: false });
      return;
    }

    setLoadingBtn(true);

    try {
      const endpoint = edit
        ? `${def}/fournisseurs/edit`
        : `${def}/fournisseurs/add`;
      const payload = {
        address: data.address,
        fname: data.fname,
        lname: data.lname,
        phone: data.phone,
        type: data.type || "personal",
        company_rc: data.type === "company" ? data.company_rc : null,
        company_if: data.type === "company" ? data.company_if : null,
        company_tp: data.type === "company" ? data.company_tp : null,
        company_ice: data.type === "company" ? data.company_ice : null,
      };

      const response: any = edit
        ? await axios.put(endpoint, { ...payload, reference: data.reference })
        : await axios.post(endpoint, payload);

      responseMessage(response.data);
    } catch (error) {
      responseMessage({ success: false });
    } finally {
      setLoadingBtn(false);
      refresh();
      setData(null);
      close();
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-5">
          <Input
            placeholder={t("First Name")}
            name="fname"
            value={data?.fname || ""}
            required
            onChange={(e) => setData({ ...data, fname: e.target.value })}
          />
          <Input
            placeholder={t("Last Name")}
            name="lname"
            value={data?.lname || ""}
            required
            onChange={(e) => setData({ ...data, lname: e.target.value })}
          />
          <Input
            placeholder={t("Phone Number")}
            name="phone"
            value={data?.phone || ""}
            required
            onChange={(e) => setData({ ...data, phone: e.target.value })}
          />
          <Input
            placeholder={t("address")}
            name="address"
            value={data?.address || ""}
            required
            onChange={(e) => setData({ ...data, address: e.target.value })}
          />

          <Select
            name="type"
            value={data?.type || "personal"}
            onValueChange={(e) =>
              setData({
                ...data,
                type: e,
                company_rc: null,
                company_if: null,
                company_tp: null,
                company_ice: null,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="personal">{t("personal")}</SelectItem>
                <SelectItem value="company">{t("company")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {data?.type === "company" && (
            <>
              <Input
                placeholder={t("Company RC")}
                name="company_rc"
                value={data?.company_rc || ""}
                onChange={(e) =>
                  setData({ ...data, company_rc: e.target.value })
                }
              />
              <Input
                placeholder={t("Company IF")}
                name="company_if"
                value={data?.company_if || ""}
                onChange={(e) =>
                  setData({ ...data, company_if: e.target.value })
                }
              />
              <Input
                placeholder={t("Company TP")}
                name="company_tp"
                value={data?.company_tp || ""}
                onChange={(e) =>
                  setData({ ...data, company_tp: e.target.value })
                }
              />
              <Input
                placeholder={t("Company ICE")}
                name="company_ice"
                value={data?.company_ice || ""}
                onChange={(e) =>
                  setData({ ...data, company_ice: e.target.value })
                }
              />
            </>
          )}
        </div>

        <Button
          disabled={!data || loadingBtn}
          type="submit"
          className="my-5 text-white bg-main"
        >
          {loadingBtn ? <LoadingLogo /> : t("submit")}
        </Button>
      </form>
    </div>
  );
}
