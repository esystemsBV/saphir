import { formatDate } from "@/common/Functions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StockMovement } from "@/lib/database";
import { t } from "i18next";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

interface StockMovementTableProps {
  movements: StockMovement[];
}

export default function StockMovementTable({
  movements,
}: StockMovementTableProps) {
  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>{t("type")}</TableHead>
          <TableHead>{t("source")}</TableHead>
          <TableHead>{t("quantity")}</TableHead>
          <TableHead>{t("date")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {movements.map((movement, index) => (
          <TableRow
            key={index}
            className={`${
              movement.type === "up"
                ? "bg-green-100 hover:bg-green-200"
                : "bg-red-100 hover:bg-red-200"
            }`}
          >
            <TableCell className="w-6">
              {movement.type === "up" ? (
                <ArrowUpCircle className="text-green-600 size-6" />
              ) : (
                <ArrowDownCircle className="text-red-600 size-6" />
              )}
            </TableCell>
            <TableCell>{t(movement.source)}</TableCell>
            <TableCell>
              {movement.quantity > 0 && `${movement.type === "up" ? "+" : "-"}`}
              {movement.quantity}
            </TableCell>
            <TableCell>{formatDate(movement.date)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
