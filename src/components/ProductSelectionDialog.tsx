import { useEffect, useState } from "react";
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
import { Input } from "./ui/input";
import { packs, products } from "@/lib/database";
import fetchData from "@/apis/HandleGetTable";

interface DataSelectionDialogProps {
  onSelectProduct: (product: any) => void;
  onSelectPack: (pack: any) => void;
  ButtonTitle?: string;
  className?: string;
}

interface dataProps {
  data: products[];
  error: boolean;
  loading: boolean;
}

interface dataProps2 {
  data: packs[];
  error: boolean;
  loading: boolean;
}

export function DataSelectionDialog({
  onSelectProduct,
  onSelectPack,
  ButtonTitle = "",
  className = "",
}: DataSelectionDialogProps) {
  const [open, setOpen] = useState(false);
  const { data, error, loading }: dataProps = FetchTableURL({
    url: "/products/withfamilyname",
  });

  const {
    data: data2,
    error: error2,
    loading: loading2,
  }: dataProps2 = fetchData({
    page: "packs",
  });
  const [searchValue, setSearchValue] = useState("");
  const [filtredData, setFiltredData] = useState<products[]>([]);
  const [filtredData2, setFiltredData2] = useState<packs[]>([]);

  const handleSelectProduct = (product: any) => {
    onSelectProduct({ ...product, quantity: 1 });
  };

  const handleSelectPack = (pack: packs) => {
    onSelectPack({ ...pack, quantity: 1 });
  };

  useEffect(() => {
    const filterData = (data: any[], query: string) =>
      data.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );

    setFiltredData(filterData(data, searchValue));
    setFiltredData2(filterData(data2, searchValue));
  }, [searchValue, data, data2]);

  useEffect(() => {
    if (!searchValue) {
      setFiltredData(data);
    }
  }, [data, searchValue]);

  useEffect(() => {
    if (!searchValue) {
      setFiltredData2(data2);
    }
  }, [data2, searchValue]);

  if (error || error2)
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
      {loading || loading2 ? (
        <div>{t("loading")}</div>
      ) : (
        <DialogContent
          className={
            "max-w-3xl min-h-[95vh] flex flex-col w-full gap-10 items-start"
          }
        >
          <DialogHeader>
            <DialogTitle>{t("select-products")} :</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            <Input
              type="text"
              className=" h-max"
              placeholder={t("delivery_notes.product_search")}
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
            />

            <Table className="mt-5">
              <TableHeader>
                <TableRow>
                  <TableHead>{t("image")}</TableHead>
                  <TableHead>{t("name")}</TableHead>
                  <TableHead>{t("families.name")}</TableHead>
                  <TableHead>{t("sellPrice")}</TableHead>
                  <TableHead>{t("Stock")}</TableHead>
                  <TableHead>{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtredData.map((item) => (
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

                {filtredData2.map((item) => (
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
                    <TableCell>-</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => handleSelectPack(item)}
                      >
                        <Plus />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {filtredData.length === 0 && filtredData2.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      {t("products.empty")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
