import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Check,
  MapPin,
  NotebookTabs,
  Package,
  Phone,
  User,
} from "lucide-react";
import { products } from "@/lib/database";
import { def } from "@/data/Links";
import brokenImage from "@/assets/brokenImage.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { t } from "i18next";

interface Order {
  order_reference: number;
  order_date: string;
  order_time: string;
  fullname: string;
  phone: string;
  address: string;
  city: string;
  statut: string;
  notes: string;
  ncolis: number;
  products: products[];
}

interface OrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderModal({ order, isOpen, onClose }: OrderModalProps) {
  const { t } = useTranslation();

  if (!order) return null;

  const ValidateOrder = () => {
    const send = async () => {
      try {
        const response = await axios.post(
          `${def}/orders/changeStatus/${
            order.order_reference
          }/${getStatusNextName(order.statut)}`
        );

        if (response.data.success) {
          location.reload();
        } else {
          console.log(response.data.err);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const payed = async () => {
      try {
        const response = await axios.post(
          `${def}/orders/changeStatus/${order.order_reference}/payed`
        );

        if (response.data.success) {
          location.reload();
        } else {
          console.log(response.data.err);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (confirm(CurrentStatusMessageButton(order.statut)) + "?") {
      if (order.statut === "shipping") {
        if (confirm("Commande Payée?")) {
          payed();
        } else {
          send();
        }
      } else {
        send();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl z-[1000] min-h-screen flex h-full flex-col overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between -mt-2">
            <span>CMD-{order.order_reference}</span>
          </DialogTitle>
        </DialogHeader>

        <Badge
          variant="outline"
          className={`${getStatusColor(order.statut)} w-max h-max `}
        >
          {CurrentStats(order.statut)}
        </Badge>

        <div className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="order-details">
              <AccordionTrigger className="text-lg font-semibold">
                {t("order.details")}
              </AccordionTrigger>
              <AccordionContent>
                <section className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                    <span>
                      {new Date(
                        `${order.order_date.split("T")[0]}T${order.order_time}`
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Package className="h-5 w-5 mr-2 text-gray-500" />
                    <span>
                      {t("packages")}: {order.ncolis}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <User className="h-5 w-5 mr-2 text-gray-500 mt-1" />
                    <span>{order.fullname}</span>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-2 text-gray-500 mt-1" />
                    <span>{order.phone}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-gray-500 mt-1" />
                    <div>
                      <p>{order.address}</p>
                      <p className="text-sm text-gray-600">{order.city}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <NotebookTabs className="h-5 w-5 mr-2 text-gray-500 mt-1" />
                    <p>{order.notes || "-"}</p>
                  </div>
                </section>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <hr />

          <div className=" overflow-auto max-h-[46vh]">
            <h3 className="font-semibold mb-4">{t("products.list")}</h3>
            <ul className="space-y-4">
              {order.products.map((product) => (
                <li
                  key={product.reference}
                  className="flex items-center space-x-4"
                >
                  <div className="flex-shrink-0 w-16 h-16 relative">
                    <img
                      src={
                        product.image ? `${def}${product.image}` : brokenImage
                      }
                      alt={product.name}
                      className="rounded-md object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      {product.quantity} x {product.sellPrice}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {((product.quantity || 1) * product.sellPrice).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <hr />

          <div className="font-semibold text-right text-lg">
            {t("total")}:{" "}
            {order.products
              .reduce(
                (sum, product) =>
                  sum + (product.quantity || 1) * product.sellPrice,
                0
              )
              .toFixed(2)}
          </div>
        </div>

        <div className="fixed -m-6 bottom-10 w-full px-5">
          <Button
            onClick={ValidateOrder}
            className="bg-green-500 hover:bg-green-700"
          >
            <Check />
            {CurrentStatusMessageButton(order.statut)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-800 border-blue-300 uppercase";
    case "preparing":
      return "bg-yellow-100 text-yellow-800 border-yellow-300 uppercase";
    case "ready":
      return "bg-green-100 text-green-800 border-green-300 uppercase";
    case "delivered":
      return "bg-purple-100 text-purple-800 border-purple-300 uppercase";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300 uppercase";
  }
}

function CurrentStatusMessageButton(status: string) {
  switch (status) {
    case "new":
      return t("stats.setAsPrepared");
    case "prepared":
      return t("stats.setAsCollected");
    case "collected":
      return t("stats.setAsShipping");
    case "shipping":
      return t("stats.setAsDelivered");
  }
}

function getStatusNextName(status: string) {
  switch (status) {
    case "new":
      return "prepared";
    case "prepared":
      return "collected";
    case "collected":
      return "shipping";
    case "shipping":
      return "delivered";
  }
}

function CurrentStats(status: string) {
  switch (status) {
    case "new":
      return t("ord-toprepare");
    case "prepared":
      return t("ord-tocollect");
    case "collected":
      return t("ord-todeliver");
    case "shipping":
      return t("ord-shipping");
  }
}
