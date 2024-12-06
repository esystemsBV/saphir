import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2, Grid, List, SkipBack } from "lucide-react";
import { families, products } from "@/lib/database";
import brokenImage from "@/assets/brokenImage.png";
import { def } from "@/data/Links";
import fetchData from "@/apis/HandleGetTable";
import axios from "axios";

import { ProductListView } from "./ProductsListView";
import { ProductGridView } from "./ProductGridView";
import { Input } from "../ui/input";

interface PosSideProps {
  setSelectedProducts: React.Dispatch<React.SetStateAction<products[]>>;
  selectedProducts: products[];
  setProducts: React.Dispatch<React.SetStateAction<products[]>>;
  products: products[];
  selectedFamily: string | null;
  setSelectedFamily: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function PosSide({
  setSelectedProducts,
  selectedProducts,
  setProducts,
  products,
  selectedFamily,
  setSelectedFamily,
}: PosSideProps) {
  const { t } = useTranslation();
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGridView, setIsGridView] = useState(true);
  const { data: families, loading } = fetchData({ page: "families" });

  const fetchProducts = async (familyRef: string | null) => {
    setLoadingProducts(true);
    try {
      const response = await axios.get(
        `${def}/products/byfamilyref/${familyRef || ""}`
      );

      setProducts(response.data.data as products[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (selectedFamily !== null) {
      fetchProducts(selectedFamily);
    }
  }, [selectedFamily]);

  const handleAddProductToCart = (product: products) => {
    const productExist = selectedProducts.find(
      (x) => x.reference === product.reference
    );
    if (productExist) {
      if ((productExist?.quantity || 1) < (product.stock || 0)) {
        setSelectedProducts((prevProducts) =>
          prevProducts.map((x) =>
            x.reference === product.reference
              ? { ...x, quantity: (x.quantity || 1) + 1 }
              : x
          )
        );
      }
    } else {
      setSelectedProducts((prevProducts) => [
        ...prevProducts,
        { ...product, quantity: 1 },
      ]);
    }
  };

  const toggleView = () => setIsGridView(!isGridView);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <Card className="h-full flex flex-col bg-main/5">
      <CardHeader className="flex-none py-3 overflow-x-auto border-b">
        <div className="flex justify-between items-center gap-2">
          {selectedFamily && (
            <div
              onClick={() => setSelectedFamily(null)}
              className="border rounded-lg flex gap-2 cursor-pointer items-center justify-center px-2 py-1.5 bg-main text-white"
            >
              <SkipBack className="size-6" />
              {t("return")}
            </div>
          )}

          <section className="w-full">
            <Input
              placeholder="Recherchez Le Produit"
              className="border-main bg-main/5 placeholder:text-black/50 h-9"
              type="text"
            />
          </section>

          <div
            onClick={toggleView}
            className="rounded-lg flex gap-2 items-center justify-center px-2 py-1.5 border border-main text-main cursor-pointer"
          >
            {isGridView ? (
              <List className="size-6" />
            ) : (
              <Grid className="size-6" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow w-full overflow-y-auto p-4">
        {!selectedFamily ? (
          <section
            className={isGridView ? "grid grid-cols-5 gap-4" : "space-y-2"}
          >
            {families.map((family: families) => (
              <div
                key={family.reference}
                onClick={() =>
                  setSelectedFamily(family.reference?.toString() || "1")
                }
                className={
                  isGridView
                    ? "flex flex-col text-lg justify-center capitalize items-center bg-white cursor-pointer size-32 border-2 border-white rounded-lg shadow-lg"
                    : "flex items-center bg-white cursor-pointer p-2 border-2 border-white rounded-lg shadow-lg"
                }
              >
                <img
                  src={family.image ? `${def}${family.image}` : brokenImage}
                  className={
                    isGridView ? "size-32 object-cover rounded-md" : "hidden"
                  }
                />
                <p
                  className={
                    isGridView
                      ? "truncate pb-1 capitalize"
                      : "capitalize text-lg"
                  }
                >
                  {!isGridView && "- "}
                  {family.name.toLowerCase()}
                </p>
              </div>
            ))}
          </section>
        ) : loadingProducts ? (
          <div className="mt-10 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : products.length > 0 ? (
          <div className={isGridView ? "flex flex-wrap gap-2" : ""}>
            {isGridView ? (
              <>
                {products.map((product) => (
                  <ProductGridView
                    product={product}
                    handleAddProductToCart={handleAddProductToCart}
                  />
                ))}
              </>
            ) : (
              <ProductListView
                products={products}
                handleAddProductToCart={handleAddProductToCart}
              />
            )}
          </div>
        ) : (
          <p className="text-center text-xl mt-5 text-gray-500">
            {t("No products in this category.")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
