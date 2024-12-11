import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";

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
import { Pagination } from "@/components/ui/pagination";
import { Chip } from "@/components/ui/chip";

import { LoadingSpinning } from "@/components/ui/loadingspining";
import Title from "@/components/ui/Title";

export default function Orders() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tableLoading, setTableLoading] = useState(true);
  const [ordersData, setOrdersData] = useState<any[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const hash = searchParams.get("filter");
    setFilterStatus(hash || "tous");
    getData();
  }, [location.search]);

  const getData = async () => {
    setTableLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/orders", {
        params: { sort: "orderid", order: "desc" },
      });
      setOrdersData(response.data.length > 0 ? response.data : null);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setTableLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(1);
    const searchParams = new URLSearchParams(location.search);
    if (status !== "tous") {
      searchParams.set("filter", status);
    } else {
      searchParams.delete("filter");
    }
    navigate(`/orders/list?${searchParams.toString()}`);
  };

  const filteredOrders = ordersData?.filter((order) => {
    const matchesSearch =
      order.orderid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "tous" || order.statut === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const paginatedOrders = filteredOrders?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "nouveau":
        return "danger";
      case "prepare":
        return "success";
      case "preparateur":
        return "warning";
      default:
        return "primary";
    }
  };

  return (
    <div className="container mx-auto">
      <Title title="Gestion des Commandes" />

      <div className="flex gap-5 mb-5">
        <Input
          placeholder="Rechercher"
          onChange={handleSearch}
          value={searchTerm}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="capitalize">
              {filterStatus || "Statut"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => handleFilterChange("tous")}>
              Tous
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleFilterChange("nouveau")}>
              Nouveau
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleFilterChange("prepare")}>
              Préparé
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleFilterChange("livre")}>
              Livré
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Voir</TableHead>
              <TableHead>N° Cmd</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead className="hidden md:table-cell">Client</TableHead>
              <TableHead className="hidden md:table-cell">Agence</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="hidden md:table-cell">Montant</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <LoadingSpinning />
                </TableCell>
              </TableRow>
            ) : paginatedOrders && paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <TableRow key={order.orderid}>
                  <TableCell>
                    <Link to={`/orders/details?order=${order.orderid}`}>
                      <Chip color="primary" size="sm">
                        Détails
                      </Chip>
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium">{order.orderid}</TableCell>
                  <TableCell>{order.order.product?.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div>
                      <p>{order.client.name?.toLowerCase()}</p>
                      <a
                        href={order.client.phone.whatsapp}
                        className="text-sm text-muted-foreground"
                      >
                        +212 {order.client.phone.phone}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {order.infos.agence?.split("%20%")[1]}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div>
                      <p>{order.infos.deliverydate.date}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.infos.deliverydate.time}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div>
                      <p>{order.order.price} Dhs</p>
                      <p className="text-sm text-muted-foreground">
                        {order.order.paymentmethod}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Chip color={getStatusColor(order.statut)} size="sm">
                      {order.statut}
                    </Chip>
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
      {filteredOrders && (
        <div className="flex justify-center mt-4">
          <Pagination
            count={filteredOrders.length}
            page={currentPage}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
}
