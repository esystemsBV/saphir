import { delivery_notes_by_id, products } from "@/lib/database";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import FetchTableURL from "@/apis/HandleGetElement";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { def } from "@/data/Links";
import { FormPreNumbers } from "@/common/Functions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import Title from "@/components/ui/Title";
import brokenImage from "@/assets/brokenImage.png";

interface dataProps {
  data: delivery_notes_by_id;
  loading: boolean;
  error: boolean;
}

export default function RetourClientNoteView() {
  const { t } = useTranslation();
  const reference = useLocation().pathname.split("/bon/retourclient/")[1];
  const {
    data: deliveryNote,
    loading,
    error,
  }: dataProps = FetchTableURL({
    url: `/retour_client_notes/get/${reference}`,
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !deliveryNote) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Title title={t("deliveryNote")} />{" "}
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent>
          <div className="grid grid-cols-2 pt-5 gap-4 mb-6">
            <div>
              <h3 className="font-semibold">{t("reference")}:</h3>
              <p>{FormPreNumbers(`${deliveryNote.reference}`)}</p>
            </div>
            <div>
              <h3 className="font-semibold">{t("deliveryDate")}:</h3>
              <p>
                {format(new Date(deliveryNote.delivery_date), "Pp", {
                  locale: fr,
                })}
              </p>
            </div>

            <hr />
            <hr />

            <div>
              <h3 className="font-semibold mb-2">{t("client")}:</h3>
              {deliveryNote.type === "client" ? (
                <>
                  <p>{deliveryNote.client_name}</p>
                  <p>{deliveryNote.client_phone}</p>
                </>
              ) : (
                <p>{t("client_pos")}</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold">{t("status")}:</h3>
              <Badge
                className="bg-main text-white"
                variant={
                  deliveryNote.status === "completed" ? "default" : "secondary"
                }
              >
                {t(deliveryNote.status)}
              </Badge>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("image")}</TableHead>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("quantity")}</TableHead>
                <TableHead>{t("unitPrice")}</TableHead>
                <TableHead>{t("total")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveryNote.products.map((product: products) => (
                <TableRow key={product.reference}>
                  <TableCell className="w-10">
                    <img
                      src={
                        product.image ? `${def}${product.image}` : brokenImage
                      }
                      alt={t("productImage", { name: product.name })}
                      className="size-10 rounded-lg object-cover bg-main/50"
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    {t("currency", { value: product.sellPrice })}
                  </TableCell>
                  <TableCell>
                    {((product.quantity || 1) * product.sellPrice).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6 text-right">
            <h3 className="font-semibold">{t("totalPrice")}:</h3>
            <p className="text-2xl font-bold">
              {t("currency", {
                value: deliveryNote.total_price,
              })}{" "}
              <span className="text-destructive">
                {deliveryNote.remise > 0 &&
                  `(Remise : -${deliveryNote.remise.toFixed(2)})`}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
