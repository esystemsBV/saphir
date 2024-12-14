import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  MapPin,
  Phone,
  Calendar,
  Eye,
  User,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderModal } from "./OrderModal";
import { products } from "@/lib/database";
import { t } from "i18next";
import { WhatsApp } from "@/assets/svgs";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

interface OrderGridProps {
  orders: Order[];
}

export default function OrderGrid({ orders }: OrderGridProps) {
  const { t } = useTranslation();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <Card key={order.order_reference} className="overflow-hidden">
            <CardHeader className="bg-main/10">
              <CardTitle className="flex justify-between items-center">
                <span>CMD-{order.order_reference}</span>
                <Badge
                  variant="outline"
                  className={getStatusColor(order.statut)}
                >
                  {CurrentStats(order.statut)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
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
                    <p className="text-sm text-gray-600 -mt-0.5">
                      {order.city}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="grid gap-2">
              <section className="flex gap-2">
                <Button
                  className="bg-blue-500 hover:bg-blue-700"
                  onClick={() => openModal(order)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {t("view")}
                </Button>

                <Button
                  className="bg-green-500 hover:bg-green-700"
                  onClick={() => openModal(order)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {CurrentStatusMessageButton(order.statut)}
                </Button>
              </section>

              <Accordion
                type="single"
                collapsible
                className="w-full bg-main text-white px-5 rounded-lg py-0"
              >
                <AccordionItem value="order-details">
                  <AccordionTrigger className="py-2 font-semibold">
                    {t("contact")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <section className="flex gap-2">
                      <Link
                        className=" w-full"
                        to={`https://wa.me/212${order.phone}`}
                      >
                        <Button className="bg-green-500 hover:bg-green-700">
                          <WhatsApp />
                          WhatsApp
                        </Button>
                      </Link>

                      <Link className=" w-full" to={`tel:${order.phone}`}>
                        <Button className="bg-blue-500 hover:bg-blue-700">
                          <Phone />
                          Appeler
                        </Button>
                      </Link>
                    </section>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardFooter>
          </Card>
        ))}
      </div>
      <OrderModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
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

function getStatusColor(status: string) {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-800 border-blue-300 uppercase";
    case "prepared":
      return "bg-yellow-100 text-yellow-800 border-yellow-300 uppercase";
    case "collected":
      return "bg-green-100 text-green-800 border-green-300 uppercase";
    case "shipping":
      return "bg-purple-100 text-purple-800 border-purple-300 uppercase";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300 uppercase";
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
