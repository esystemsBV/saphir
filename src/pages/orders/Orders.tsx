import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Chip } from "@/components/ui/chip";
import { LoadingSpinning } from "@/components/ui/loadingspining";
import Title from "@/components/ui/Title";
import FetchTableURL from "@/apis/HandleGetElement";
import { order, products } from "@/lib/database";
import { t } from "i18next";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowDown, Check, Eye, X } from "lucide-react";

export default function Orders() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    data,
    loading,
    refresh,
  }: { data: order[]; loading: boolean; refresh: () => void } = FetchTableURL({
    url: "/orders",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const hash = searchParams.get("filter");
    setFilterStatus(hash || "all");
    refresh();
  }, [location.search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(1);
    const searchParams = new URLSearchParams(location.search);
    if (status !== "all") {
      searchParams.set("filter", status);
    } else {
      searchParams.delete("filter");
    }
    navigate(`/orders/list?${searchParams.toString()}`);
  };

  const filteredOrders = data?.filter((order) => {
    const matchesSearch =
      order.reference
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.fullname.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || order.statut === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const paginatedOrders = filteredOrders?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const newDataFiltred = (status: string) => {
    let filtreddata: order[] = [];
    const defaultait = (filtreddata = data?.filter(
      (order) => order.statut === status
    ));

    if (status === "delivered") {
      filtreddata = [
        ...defaultait,
        ...(filtreddata = data?.filter((order) => order.statut === "payed")),
      ];
    } else {
      filtreddata = defaultait;
    }

    return filtreddata;
  };

  const getStatusColor = (status: string) => {
    switch (status as order["statut"]) {
      case "new":
        return "bg-blue-500";
      case "collected":
        return "bg-orange-500";
      case "prepared":
        return "bg-yellow-500";
      case "shipping":
        return "bg-main";
      default:
        return "bg-green-500";
    }
  };

  const totalPrice = (products: products[]) => {
    let total = 0;
    for (let i = 0; i < products.length; i++) {
      total += products[i].sellPrice * (products[i].quantity || 1);
    }
    return total;
  };

  return (
    <div className="container mx-auto">
      <Title title="Gestion des Commandes" />
      <section className="grid md:grid-cols-6 gap-5 mb-5">
        {["new", "prepared", "collected", "shipping", "delivered", "payed"].map(
          (value) => (
            <div className=" p-7 flex flex-row border shadow-lg items-center rounded-lg justify-between">
              <div>
                <h1 className="text-lg capitalize font-medium  w-max">
                  <span>{CurrentStats(value)}</span>
                </h1>
              </div>
              <h1 className=" text-5xl font-medium w-max text-main">
                {newDataFiltred(value).length}
              </h1>
            </div>
          )
        )}
      </section>

      <div className="flex gap-5 mb-5">
        <Input
          placeholder="Rechercher"
          onChange={handleSearch}
          value={searchTerm}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="capitalize w-max">
              {t(`ord-${filterStatus}`) || "Statut"}

              <ArrowDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {[
              "all",
              "new",
              "prepared",
              "collected",
              "shipping",
              "delivered",
              "payed" as order["statut"],
            ].map((status) => (
              <DropdownMenuItem
                onSelect={() => handleFilterChange(status || "")}
                className="capitalize"
              >
                {t(`ord-${status}` || "")}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Cmd</TableHead>
              <TableHead className="hidden md:table-cell">Client</TableHead>
              <TableHead className="hidden md:table-cell">Agence</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="hidden md:table-cell">Montant</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payé</TableHead>
              <TableHead>Détails</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <LoadingSpinning />
                </TableCell>
              </TableRow>
            ) : paginatedOrders && paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <TableRow key={order.reference}>
                  <TableCell className="font-medium flex items-center gap-1">
                    CMD-
                    {order.reference}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div>
                      <p>{order.fullname}</p>
                      <a
                        href={order.whatsapp}
                        className="text-sm text-muted-foreground"
                      >
                        {order.phone}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {order.agence}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div>
                      <p>
                        {format(new Date(order.order_date), "P", {
                          locale: fr,
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.order_time}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div>
                      <p>{totalPrice(order.products || []).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        {t(order.payment_method)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      className={`capitalize text-white ${getStatusColor(
                        order.statut || "toprepare"
                      )}`}
                    >
                      {order.statut === "payed"
                        ? t("ord-delivered")
                        : t(`ord-${order.statut}`)}
                    </Chip>
                  </TableCell>

                  <TableCell>
                    {order.statut === "payed" ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-red-500" />
                    )}
                  </TableCell>

                  <TableCell>
                    <Link to={`/orders/details/${order.reference}`}>
                      <Eye className="text-green-500" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Pas de commandes pour le moment.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
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
    case "delivered":
      return t("ord-delivered");
    case "payed":
      return t("ord-payed");
  }
}
