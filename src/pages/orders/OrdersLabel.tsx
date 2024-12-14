import { useTranslation } from "react-i18next";
import FetchTableURL from "@/apis/HandleGetElement";
import { useUser } from "@/hooks/useUserContext";
import Error from "@/components/ui/Error";
import { LoadingSpinning } from "@/components/ui/loadingspining";
import OrderGrid from "./GridOrders";
import Title from "@/components/ui/Title";
import { Filter, PackageSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/database";
import { t } from "i18next";

interface Order {
  order_reference: number;
  order_date: string;
  order_time: string;
  fullname: string;
  phone: string;
  address: string;
  city: string;
  livreur: string | number;
  preparateur: string | number;
  statut: string;
  notes: string;
  ncolis: number;
  products: products[];
}

export default function OrdersPage() {
  const { t } = useTranslation();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const filter = new URLSearchParams(location.search).get("filter") || "";
  const [filtredOrders, setFiltredOrders] = useState<Order[]>([]);

  const {
    data = [],
    loading,
    error,
  }: { data: Order[]; loading: boolean; error: any } = FetchTableURL({
    url: `/orders/byuserrole&reference/${user?.reference}`,
  });

  useEffect(() => {
    if (!filter || filter === "all") {
      setFiltredOrders(data);
    } else {
      const filtered = data.filter((order) => order.statut === filter);
      setFiltredOrders(filtered);
    }
  }, [filter, data]);

  const handleFilterChange = (status: string) => {
    navigate(`?filter=${status}`);
  };

  const all =
    user?.role === "preparator"
      ? ["new"]
      : user?.role === "delivery"
      ? ["prepared", "collected", "shipping"]
      : user?.role === "admin"
      ? ["new", "prepared", "collected"]
      : [];

  if (loading) return <LoadingSpinning />;
  if (error) return <Error title={error.message} />;

  return (
    <div className="mt-5">
      <Title title={t("orders")} />

      <DropdownMenu>
        <DropdownMenuTrigger className="w-full mb-2">
          <Button className="capitalize w-full flex items-center gap-2">
            <Filter />
            {CurrentStats(filter) || t("ord-all")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          {["all", ...all].map((status) => (
            <DropdownMenuItem
              key={status}
              onSelect={() => handleFilterChange(status)}
              className="capitalize"
            >
              {CurrentStats(status) || t("ord-all")}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {filtredOrders.length === 0 ? (
        <div className="flex items-center justify-center mt-20 flex-col gap-2">
          <PackageSearch className="size-20 text-main" />
          <span className="text-lg font-medium text-black">
            {t("order.empty")}
          </span>
        </div>
      ) : (
        <OrderGrid orders={filtredOrders} />
      )}
    </div>
  );
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
