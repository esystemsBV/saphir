import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import brokenImage from "@/assets/brokenImage.png";
import { def } from "@/data/Links";
import FetchTableURL from "@/apis/HandleGetElement";
import { t } from "i18next";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataSelectionDialogProps {
  onSelectProduct: (product: any) => void;
  ButtonTitle?: string;
  table: string;
  className?: string;
}

interface dataProps {
  data: any[];
  error: boolean;
  loading: boolean;
}

export function DataSelectionDialog({
  onSelectProduct,
  ButtonTitle = "",
  table,
  className = "",
}: DataSelectionDialogProps) {
  const [open, setOpen] = useState(false);
  const { data, error, loading }: dataProps = FetchTableURL({ url: table });

  const handleSelectProduct = (product: any) => {
    onSelectProduct({ ...product, quantity: 1 });
  };

  if (error)
    return (
      <Button className="bg-red-500 hover:bg-red-600 text-white">
        <X /> {t("error")}
      </Button>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn("bg-blue-500 hover:bg-blue-600 text-white", className)}
        >
          <Plus /> {t(ButtonTitle)}
        </Button>
      </DialogTrigger>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <DialogContent className={"max-w-3xl"}>
          <DialogHeader>
            <DialogTitle>Select a Product</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Family</TableHead>
                <TableHead>Sell Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.reference}>
                  <TableCell>
                    <img
                      src={item.image ? `${def}${item.image}` : brokenImage}
                      alt={item.name}
                      width={50}
                      height={50}
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.familyName}</TableCell>
                  <TableCell>{item.sellPrice}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>
                    <Button
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => handleSelectProduct(item)}
                    >
                      <Plus />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      )}
    </Dialog>
  );
}
