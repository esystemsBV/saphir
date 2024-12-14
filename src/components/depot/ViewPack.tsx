"use client";

import { def } from "@/data/Links";
import { PackProductFamily } from "@/lib/database";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Title from "../ui/Title";
import brokenImage from "@/assets/brokenImage.png";
import FetchTableURL from "@/apis/HandleGetElement";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";

export default function ViewPack() {
  const { t } = useTranslation();
  const reference = useLocation().pathname.split("/depot/packs/")[1];

  const {
    data: products,
    loading,
  }: {
    data: PackProductFamily[];
    loading: boolean;
    refresh: () => void;
    error: boolean;
  } = FetchTableURL({
    url: `/packs/getWithProducts/${reference}`,
  });

  return (
    <div>
      <Title title={t("packProducts", { reference })} />

      {loading ? (
        t("loading")
      ) : (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-xl pb-5">
              <p>
                <span className="text-main">{products[0]?.packName}</span> -{" "}
                {reference}
              </p>
              <p>
                <span className="text-main">{t("packPrice")}</span> :{" "}
                {products[0]?.packPrice}
              </p>
            </CardTitle>

            <hr />
          </CardHeader>
          <CardContent>
            <div className=" relative  mb-5 w-full aspect-video">
              <img
                src={
                  products[0]?.packImage
                    ? `${def}${products[0].packImage}`
                    : brokenImage
                }
                alt={t("packImage")}
                className="object-cover mx-auto rounded-t-lg"
              />
            </div>
            <hr className="py-5" />
            <ul className="space-y-4">
              {products?.map((product, index) => (
                <li key={index} className="border-b pb-2">
                  <div className="flex justify-between items-center mb-1">
                    <Link
                      to={`/depot/products/${product.productReference}`}
                      className="text-sm underline text-main font-medium"
                    >
                      {product.productName}
                    </Link>
                    <Badge variant="secondary" className="bg-main/10">
                      x{product.productQuantity}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      {t("familyName")} : {product.familyName}
                    </p>
                    <p>
                      {t("sellPrice")} : {product.productSellPrice}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              {t("totalItems")} :{" "}
              {products?.reduce(
                (sum, product) => sum + product.productQuantity,
                0
              )}
            </p>
            <p className="text-sm font-medium">
              {t("totalSavings")} :{" "}
              {products
                ?.reduce(
                  (sum, product) =>
                    sum +
                    (product.productBoughtPrice - product.productSellPrice) *
                      product.productQuantity,
                  0
                )
                .toFixed(2)}
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
