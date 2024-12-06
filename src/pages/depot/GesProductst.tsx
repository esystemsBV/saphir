import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Eye, EditIcon } from "lucide-react";
import Title from "@/components/ui/Title";
import Error from "@/components/ui/Error";
import LoadingSpinner from "@/components/others/LoadingLogo";
import { products } from "@/lib/database";
import { HandleDelete } from "@/apis/HandleDelete";
import { Link } from "react-router-dom";
import brokenImage from "@/assets/brokenImage.png";
import { def } from "@/data/Links";
import { FormPreNumbers } from "@/common/Functions";
import AddProduct from "@/components/depot/AddProduct";
import FetchTableURL from "@/apis/HandleGetElement";

export default function ProductsPage() {
  const { t } = useTranslation();
  const [edit, setEdit] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<products | null>(null);

  const {
    data,
    loading,
    refresh,
    error,
  }: {
    data: products[];
    loading: boolean;
    refresh: () => void;
    error: boolean;
  } = FetchTableURL({
    url: "/products/withfamilyname",
  });

  const handleAccordionChange = (value: string) => {
    setOpenKeys(value ? [value] : []);
  };

  if (error) {
    return <Error title={t("products.error.loading")} />;
  }

  return (
    <div className="space-y-6">
      <Accordion
        type="single"
        collapsible
        value={openKeys[0]}
        onValueChange={handleAccordionChange}
      >
        <AccordionItem value="1">
          <AccordionTrigger>
            <Title title={edit ? t("products.edit") : t("products.add")} />
          </AccordionTrigger>
          <AccordionContent>
            <AddProduct
              edit={edit}
              setEdit={() => setEdit(!edit)}
              refresh={refresh}
              selectedProduct={selectedProduct}
              setselectedProduct={setSelectedProduct}
              close={() => setOpenKeys(["0"])}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div>
        <Title title={t("products.your")} />
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead>{t("image")}</TableHead>
              <TableHead>{t("products.designation")}</TableHead>
              <TableHead>{t("families.name")}</TableHead>
              <TableHead>{t("products.pa")}</TableHead>
              <TableHead>{t("products.pv")}</TableHead>
              <TableHead>{t("stock")}</TableHead>
              <TableHead>{t("products.actions")}</TableHead>
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
              data.map((product, id) => (
                <TableRow key={id}>
                  <TableCell className="w-10">
                    <img
                      src={
                        product.image ? `${def}${product.image}` : brokenImage
                      }
                      alt={product.name}
                      className="size-12 object-cover rounded-sm bg-main"
                    />
                  </TableCell>
                  <TableCell className="capitalize">
                    <p className="text-base font-medium">{product.name}</p>
                    <p className="text-gray-500 -mt-0.5">
                      {FormPreNumbers(`${product.reference}`)}
                    </p>
                  </TableCell>
                  <TableCell className="text-lg">
                    {product.familyName}
                  </TableCell>
                  <TableCell className="text-lg">
                    {product.boughtPrice}
                  </TableCell>
                  <TableCell className="text-lg">{product.sellPrice}</TableCell>
                  <TableCell className="text-lg">
                    {product.stock || 0}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link to={`${product.reference}`}>
                        <Eye className="size-5.5 cursor-pointer text-green-500" />
                      </Link>
                      <EditIcon
                        onClick={() => {
                          setSelectedProduct(product);
                          setEdit(true);
                          setOpenKeys(["1"]);
                        }}
                        className="size-5.5 cursor-pointer text-blue-500"
                      />
                      <Trash2
                        onClick={() =>
                          HandleDelete({
                            page: "products",
                            id: `${product.reference}`,
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
                <TableCell colSpan={7} className="h-24 text-center">
                  {t("products.empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
