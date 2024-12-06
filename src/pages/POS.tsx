import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import PosSide from "@/components/pos/POSside";
import ProductsSide from "@/components/pos/ProductsSide";
import { products } from "@/lib/database";
import DashboardNavBar from "@/components/main/NavBar";

export default function POS() {
  const [selectedProducts, setSelectedProducts] = useState<products[]>([]);
  const [products, setProducts] = useState<products[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);

  return (
    <div className="h-screen flex flex-col gap-3">
      <DashboardNavBar hideSideBar />

      <div className="flex-grow pb-2 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 items-center -space-x-7 h-full">
          <Card className="lg:col-span-2 h-[95%] mr-4 overflow-hidden border-none rounded-2xl">
            <CardContent className="p-0 h-full">
              <PosSide
                setProducts={setProducts}
                products={products}
                setSelectedProducts={setSelectedProducts}
                selectedProducts={selectedProducts}
                setSelectedFamily={setSelectedFamily}
                selectedFamily={selectedFamily}
              />
            </CardContent>
          </Card>
          <Card className="h-full border-none">
            <CardContent className="p-0 h-full">
              <ProductsSide
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
