import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { t } from "i18next";
import { def } from "@/data/Links";

interface handleDeleteProps {
  id: string | number;
  page: string;
  refresh: () => void;
}

export const HandleDelete = async ({
  page,
  id,
  refresh,
}: handleDeleteProps) => {
  if (confirm("Supprimer?"))
    try {
      const response = await axios.delete(`${def}/table/delete/${page}/${id}`);
      console.log(response.data);
      toast({
        title: t("success"),
      });
    } catch (error) {
      toast({
        title: t("error"),
        variant: "destructive",
      });
    } finally {
      refresh();
    }
};
