import { responseMessage } from "@/common/Functions";
import { def } from "@/data/Links";
import { products } from "@/lib/database";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LoadingLogo from "../others/LoadingLogo";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { t } from "i18next";
import { Eye } from "lucide-react";
import Title from "../ui/Title";
import brokenImage from "@/assets/brokenImage.png";

export default function ViewFamily() {
  const reference = useLocation().pathname.split("/depot/families/")[1];
  const [products, setProducts] = useState<products[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getProducts = async () => {
    setLoading(true);

    try {
      const res: any = await axios.get(
        `${def}/products/byfamilyref/${reference}`
      );

      if (res.data.success) {
        setProducts(res.data.data);
      } else {
        responseMessage(res.data);
      }
    } catch (error) {
      responseMessage({ res: { success: false } });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reference) {
      getProducts();
    }
  }, [reference]);

  if (loading) return <LoadingLogo />;

  return (
    <div>
      <Title title={t(`Produits de famille -${reference}`)} />

      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>{t("image")}</TableHead>
            <TableHead>{t("families.designation")}</TableHead>
            <TableHead>{t("families.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                <LoadingLogo />
              </TableCell>
            </TableRow>
          ) : products && products.length > 0 ? (
            products.map((product, id) => (
              <TableRow key={id}>
                <TableCell className="w-10">
                  <img
                    src={product.image ? `${def}${product.image}` : brokenImage}
                    alt={product.name}
                    className="size-12 rounded-sm bg-main"
                  />
                </TableCell>
                <TableCell className="capitalize">
                  <p className="text-base font-medium">{product.name}</p>
                  <p className="text-gray-500 -mt-0.5">{product.reference}</p>
                </TableCell>

                <TableCell>
                  <Link to={`/depot/products/${product.reference}`}>
                    <Eye className="size-5.5 cursor-pointer text-green-500" />
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                {t("products.empty")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
