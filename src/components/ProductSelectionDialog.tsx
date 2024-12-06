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
import { products } from "@/lib/database";
import brokenImage from "@/assets/brokenImage.png";
import { def } from "@/data/Links";

interface ProductSelectionDialogProps {
  onSelectProduct: (product: products) => void;
  products: products[];
}

export function ProductSelectionDialog({
  onSelectProduct,
  products,
}: ProductSelectionDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSelectProduct = (product: products) => {
    onSelectProduct(product);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Select Product</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
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
            {products.map((product) => (
              <TableRow key={product.reference}>
                <TableCell>
                  <img
                    src={product.image ? `${def}${product.image}` : brokenImage}
                    alt={product.name}
                    width={50}
                    height={50}
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.familyName}</TableCell>
                <TableCell>{product.sellPrice}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Button onClick={() => handleSelectProduct(product)}>
                    Select
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
