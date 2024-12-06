import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { products as ProductProps } from "@/lib/database";
import brokenImage from "@/assets/brokenImage.png";
import { def } from "@/data/Links";
import { ProductSelectionDialog } from "@/components/ProductSelectionDialog";
import { useNavigate } from "react-router-dom";

export default function AddStock() {
  const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(
    null
  );
  const [newStock, setNewStock] = useState("");
  const [products, setProducts] = useState<ProductProps[]>([]);
  const navigate = useNavigate();
  const [responseMessage, setResponseMessage] = useState<{
    message: string;
    success: boolean;
  } | null>(null);

  const handleProductSelect = (product: ProductProps) => {
    setSelectedProduct(product);
    setNewStock((product.stock || 0).toString());
  };

  const getProducts = async () => {
    try {
      const response = await axios.get(`${def}/products/withfamilyname`);

      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const getChangeType = () => {
    if (!selectedProduct) return "egal";
    const currentStock = selectedProduct.stock || 0;
    const newStockValue = parseInt(newStock, 10);
    if (newStockValue > currentStock) return "up";
    if (newStockValue < currentStock) return "down";
    return "egal";
  };

  const updateStock = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProduct) return;

    const reference = selectedProduct.reference;
    const newStockValue = parseInt(newStock, 10);
    const changeType = getChangeType();

    try {
      const response = await axios.post(`${def}/stock/add`, {
        reference,
        quantity: newStockValue,
        type: changeType,
      });

      if (response.status === 200) {
        navigate(`/depot/products/${selectedProduct.reference}`);
      } else {
        setResponseMessage({
          message: "Failed to update stock",
          success: false,
        });
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      setResponseMessage({
        message: "An error occurred while updating stock",
        success: false,
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Stock Management</CardTitle>
          <CardDescription>Update stock for products</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={updateStock}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select a product</Label>
                <ProductSelectionDialog
                  onSelectProduct={handleProductSelect}
                  products={products}
                />
              </div>

              {selectedProduct && (
                <>
                  <div className="space-y-2">
                    <Label>Selected Product</Label>
                    <div className="flex items-center space-x-4">
                      <img
                        src={
                          selectedProduct.image
                            ? `${def}${selectedProduct.image}`
                            : brokenImage
                        }
                        alt={selectedProduct.name}
                        width={50}
                        height={50}
                      />
                      <div>
                        <p className="font-medium">{selectedProduct.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Ref: {selectedProduct.reference}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Family: {selectedProduct.familyName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="current-stock">Current Stock</Label>
                    <Input
                      id="current-stock"
                      value={selectedProduct.stock}
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-stock">New Stock</Label>
                    <Input
                      id="new-stock"
                      name="newStock"
                      type="number"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    disabled={getChangeType() === "egal"}
                    type="submit"
                    className="w-full"
                  >
                    Update Stock
                  </Button>
                </>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          {responseMessage && (
            <p
              className={`text-sm ${
                responseMessage.success ? "text-green-600" : "text-red-600"
              }`}
            >
              {responseMessage.message}
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
