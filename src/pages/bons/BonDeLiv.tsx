import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Eye, EditIcon, X } from "lucide-react";
import Title from "@/components/ui/Title";
import Error from "@/components/ui/Error";
import LoadingSpinner from "@/components/others/LoadingLogo";
import { delivery_notes, products } from "@/lib/database";
import { HandleDelete } from "@/apis/HandleDelete";
import { Link } from "react-router-dom";
import FetchTableURL from "@/apis/HandleGetElement";
import AddDelivery_notes from "@/components/bons/AddDelivery_notes";
import { Button } from "@/components/ui/button";
import { formatDate, FormPreNumbers } from "@/common/Functions";

export default function BonDeLiv() {
  const { t } = useTranslation();
  const [edit, setEdit] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<products[]>([]);
  const [add, setAdd] = useState(false);
  const [dataToAdd, setDataToAdd] = useState<any | null>({
    reference: "",
    delivery_date: new Date().toISOString().slice(0, 16),
    type: "client",
    client: null,
  });

  const {
    data,
    loading,
    refresh,
    error,
  }: {
    data: delivery_notes[];
    loading: boolean;
    refresh: () => void;
    error: boolean;
  } = FetchTableURL({ url: "/delivery_notes/fetch/all" });

  if (error) {
    return <Error title={t("delivery_notes.error.loading")} />;
  }

  if (edit || add) {
    return (
      <>
        <div className="flex items-center w-full justify-between">
          <Title
            title={edit ? t("delivery_notes.edit") : t("delivery_notes.add")}
          />
          <Button
            className=" w-max"
            onClick={() => {
              setAdd(false);
              setEdit(false);
            }}
          >
            <X />
          </Button>
        </div>
        <AddDelivery_notes
          dataToAdd={dataToAdd}
          setDataToAdd={setDataToAdd}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
          edit={edit}
          setEdit={() => setEdit(!edit)}
          refresh={refresh}
          close={() => {
            setAdd(false);
            setEdit(false);
          }}
        />
      </>
    );
  }

  return (
    <div>
      <div className="flex items-center w-full justify-between">
        <Title title={t("delivery_notes.your")} />
        <Button className=" w-max" onClick={() => setAdd(true)}>
          {t("Ajouter")}
        </Button>
      </div>
      <Table className="border overflow-auto">
        <TableHeader>
          <TableRow>
            <TableHead>{t("reference")}</TableHead>
            <TableHead>{t("client")}</TableHead>
            <TableHead>{t("date")}</TableHead>
            <TableHead>{t("amount")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                <LoadingSpinner />
              </TableCell>
            </TableRow>
          ) : data && data.length > 0 ? (
            data.map((delivery_notes, id) => (
              <TableRow key={id}>
                <TableCell>
                  {FormPreNumbers(delivery_notes.reference.toString())}
                </TableCell>
                <TableCell>{`${
                  delivery_notes.type === "pos"
                    ? t("client_pos")
                    : `${delivery_notes.client.fname} ${delivery_notes.client.lname}`
                }`}</TableCell>
                <TableCell>
                  {formatDate(delivery_notes.delivery_date)}
                </TableCell>
                <TableCell>{delivery_notes.total_price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="bg-main text-white text-sm rounded-full py-1 px-3 w-max text-center">
                    {t(delivery_notes.status)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Link to={`${delivery_notes.reference}`}>
                      <Eye className="size-5.5 cursor-pointer text-green-500" />
                    </Link>
                    {delivery_notes.status === "in_progress" && (
                      <EditIcon
                        onClick={() => {
                          setDataToAdd({
                            ...delivery_notes,
                            delivery_date: delivery_notes.delivery_date.slice(
                              0,
                              16
                            ),
                            client: {
                              ...delivery_notes.client,
                              label:
                                delivery_notes.type === "client"
                                  ? `${delivery_notes.client.fname} ${delivery_notes.client.lname}`
                                  : t("client_pos"),
                            },
                          });
                          setEdit(true);
                        }}
                        className="size-5.5 cursor-pointer text-blue-500"
                      />
                    )}
                    <Trash2
                      onClick={() =>
                        HandleDelete({
                          page: "delivery_notes",
                          id: `${delivery_notes.reference}`,
                          refresh: refresh,
                        })
                      }
                      className="size-5.5 cursor-pointer text-destructive"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                {t("delivery_notes.empty")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
