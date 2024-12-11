import { toast } from "@/hooks/use-toast";
import { response } from "@/lib/database";
import { t } from "i18next";

export const DetectArabic = (text: string) => {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  return arabicRegex.test(text);
};

export const responseMessage = ({
  res,
  refresh,
}: {
  res: response;
  refresh: () => void;
}) => {
  if (res.success) {
    refresh();
    return toast({
      title: t("success"),
    });
  } else {
    refresh();
    console.log(res.error);
    return toast({
      variant: "destructive",
      title: t("error"),
    });
  }
};

export const FormPreNumbers = (numb: string) => {
  if (numb.length == 1) {
    return `00${numb}`;
  } else if (numb.length == 2) {
    return `0${numb}`;
  } else {
    return numb;
  }
};

export const formatDate = (date: string) => {
  return `${
    new Date(date).getDate() > 9
      ? new Date(date).getDate()
      : `0${new Date(date).getDate()}`
  }/${
    new Date(date).getMonth() + 1 > 9
      ? new Date(date).getMonth() + 1
      : `0${new Date(date).getMonth() + 1}`
  }/${
    new Date(date).getFullYear() > 9
      ? new Date(date).getFullYear()
      : `0${new Date(date).getFullYear()}`
  } à ${
    new Date(date).getHours() > 9
      ? new Date(date).getHours()
      : `0${new Date(date).getHours()}`
  }:${
    new Date(date).getMinutes() > 9
      ? new Date(date).getMinutes()
      : `0${new Date(date).getMinutes()}`
  }`;
};
