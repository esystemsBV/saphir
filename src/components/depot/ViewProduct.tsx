import { def } from "@/data/Links";
import { products, StockMovement } from "@/lib/database";
import { useLocation } from "react-router-dom";
import LoadingLogo from "../others/LoadingLogo";
import { t } from "i18next";
import Title from "../ui/Title";
import brokenImage from "@/assets/brokenImage.png";
import { Card, CardContent } from "../ui/card";
import FetchTableURL from "@/apis/HandleGetElement";
import StockMovementTable from "./StockMouvementTable";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title as MainTitle,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  MainTitle,
  Tooltip,
  Legend
);

export default function ViewProduct() {
  const reference = useLocation().pathname.split("/depot/products/")[1];
  const { data, loading, error } = FetchTableURL({
    url: `/products/byreference/${reference}`,
  });

  const transactions: StockMovement[] = data.transactions;
  const product: products = data;

  if (error || !product) return t("Error");

  if (loading) return <LoadingLogo />;

  const daysInMonth = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
  const productSalesData = [
    {
      name: product.name,
      sales: Array.from(
        { length: 30 },
        () => Math.floor(Math.random() * 50) + 10
      ),
    },
  ];

  const dataPresoo = {
    labels: daysInMonth,
    datasets: productSalesData.map((product) => ({
      label: "Ventes",
      data: product.sales,
      borderColor: `#b12b89`,
      backgroundColor: "#b12b89",
      fill: true,
      tension: 0.3,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Product Sales - Current Month",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Sales",
        },
      },
      x: {
        title: {
          display: true,
          text: "Jours du mois",
        },
      },
    },
  };

  return (
    <div className=" space-y-10 md:space-y-5">
      <section>
        <Title title={t(`Information Générales - ${product.name}`)} />
        <Card className="w-full overflow-hidden">
          <CardContent className="p-0">
            <div className="md:flex">
              <img
                src={product?.image ? `${def}${product.image}` : brokenImage}
                alt={product.name}
                className="h-52 w-max mx-auto pt-2 md:p-0 object-cover"
              />
              <div className="p-6 flex flex-col flex-grow justify-between">
                <h1 className="text-3xl font-bold mb-4">{product.name}.</h1>

                <div className="gap-2 grid md:grid-cols-3">
                  <div className="flex justify-between items-center border py-1.5 w-full px-4 rounded-lg">
                    <span className="text-gray-600">Référence :</span>
                    <span className="font-semibold">{product.reference}</span>
                  </div>
                  <div className="flex justify-between items-center border py-1.5 w-full px-4 rounded-lg">
                    <span className="text-gray-600">Famille :</span>
                    <span className="font-semibold">{product.familyName}</span>
                  </div>
                  <div className="flex justify-between items-center border py-1.5 w-full px-4 rounded-lg">
                    <span className="text-gray-600">Stock :</span>
                    <span className="font-semibold">{product.stock}</span>
                  </div>
                  <div className="flex justify-between items-center border py-1.5 w-full px-4 rounded-lg">
                    <span className="text-gray-600">Prix d'achat :</span>
                    <span className="font-semibold">{product.boughtPrice}</span>
                  </div>
                  <div className="flex justify-between items-center border py-1.5 w-full px-4 rounded-lg">
                    <span className="text-gray-600">Prix de vente :</span>
                    <span className="font-semibold">{product.sellPrice}</span>
                  </div>
                  <div className="flex justify-between items-center border py-1.5 w-full px-4 rounded-lg">
                    <span className="text-gray-600">Marge de vente :</span>
                    <span className="font-semibold">
                      {(product.sellPrice - product.boughtPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="border hidden md:block my-5" />

      <section className=" mt-5 md:grid-cols-2 md:grid space-y-10 md:space-y-0">
        <div className="md:border-r md:pr-5">
          <Title title={t(`Chiffre d'affaire ce mois`)} />
          <Line data={dataPresoo} options={options} />
        </div>
        <div className="md:border-l md:pl-5">
          <Title title={t(`Chiffre d'affaire ce mois`)} />
          <Line data={dataPresoo} options={options} />
        </div>
      </section>

      <div className="border hidden md:block my-5" />

      <div>
        <Title title={t(`Mouvement de Stock`)} />
        <StockMovementTable movements={transactions} />
      </div>
    </div>
  );
}
