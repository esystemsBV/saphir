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
import { retour_client_notes, products } from "@/lib/database";
import { HandleDelete } from "@/apis/HandleDelete";
import { Link } from "react-router-dom";
import FetchTableURL from "@/apis/HandleGetElement";
import { Button } from "@/components/ui/button";
import { formatDate, FormPreNumbers } from "@/common/Functions";
import AddRetourClient_notes from "@/components/bons/AddRetourClient_notes";

export default function BonDeRtr() {
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
    data: retour_client_notes[];
    loading: boolean;
    refresh: () => void;
    error: boolean;
  } = FetchTableURL({ url: "/retour_client_notes/fetch/all" });

  if (error) {
    return <Error title={t("retour_client_notes.error.loading")} />;
  }

  if (edit || add) {
    return (
      <>
        <div className="flex items-center w-full justify-between">
          <Title
            title={
              edit
                ? t("retour_client_notes.edit")
                : t("retour_client_notes.add")
            }
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
        <AddRetourClient_notes
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
        <Title title={t("retour_client_notes.your")} />
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
            data.map((retour_client_notes, id) => (
              <TableRow key={id}>
                <TableCell>
                  {FormPreNumbers(retour_client_notes.reference.toString())}
                </TableCell>
                <TableCell>{`${
                  retour_client_notes.type === "pos"
                    ? t("client_pos")
                    : `${retour_client_notes.client.fname} ${retour_client_notes.client.lname}`
                }`}</TableCell>
                <TableCell>
                  {formatDate(retour_client_notes.delivery_date)}
                </TableCell>
                <TableCell>
                  {retour_client_notes.total_price.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="bg-main text-white text-sm rounded-full py-1 px-3 w-max text-center">
                    {t(retour_client_notes.status)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Link to={`${retour_client_notes.reference}`}>
                      <Eye className="size-5.5 cursor-pointer text-green-500" />
                    </Link>
                    {retour_client_notes.status === "in_progress" && (
                      <EditIcon
                        onClick={() => {
                          setDataToAdd({
                            ...retour_client_notes,
                            delivery_date:
                              retour_client_notes.delivery_date.slice(0, 16),
                            client: {
                              ...retour_client_notes.client,
                              label:
                                retour_client_notes.type === "client"
                                  ? `${retour_client_notes.client.fname} ${retour_client_notes.client.lname}`
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
                          page: "retour_client_notes",
                          id: `${retour_client_notes.reference}`,
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
                {t("retour_client_notes.empty")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
