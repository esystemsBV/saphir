import FetchTableURL from "@/apis/HandleGetElement";
import { LoadingSpining } from "@/assets/svgs";
import Title from "@/components/ui/Title";
import { useUser } from "@/hooks/useUserContext";
import { products } from "@/lib/database";
import { t } from "i18next";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";

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
  assigned_role: "preparateur" | "livreur";
  products: products[];
}

// Enregistrement des composants Chart.js nécessaires
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

// Interface pour les données de revenus
interface RevenueData {
  mois: string[];
  posVentes: number[];
  ecommerce: number[];
}

export default function Tests() {
  const { user } = useUser();
  const { data, loading }: { data: Order[]; loading: boolean; error: any } =
    FetchTableURL({
      url: `/orders/byuserrole&reference/${user?.reference}`,
    });

  const PartOfDay = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return t("goodmorning");
    } else if (currentHour >= 12 && currentHour < 17) {
      return t("goodafternoon");
    } else if (currentHour >= 17 && currentHour < 21) {
      return t("goodevening");
    } else {
      return t("goodnight");
    }
  };

  if (loading) return <LoadingSpining />;

  const filter = (value: string) => data.filter((x) => x.statut === value);

  const all =
    user?.role === "preparator"
      ? ["new"]
      : user?.role === "delivery"
      ? ["prepared", "collected", "shipping"]
      : user?.role === "admin"
      ? ["new", "prepared", "collected"]
      : [];

  const donneesRevenus: RevenueData = {
    mois: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin"],
    posVentes: [45000, 52000, 48000, 55000, 60000, 58000],
    ecommerce: [30000, 35000, 40000, 42000, 45000, 47000],
  };

  // Configuration du graphique des ventes en point de vente
  const dataPosVentes = {
    labels: donneesRevenus.mois,
    datasets: [
      {
        label: "Revenus Point de Vente (DH)",
        data: donneesRevenus.posVentes,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Configuration du graphique e-commerce
  const dataEcommerce = {
    labels: donneesRevenus.mois,
    datasets: [
      {
        label: "Revenus E-commerce (DH)",
        data: donneesRevenus.ecommerce,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Configuration du graphique comparatif en pourcentage
  const dataComparaison = {
    labels: ["Point de Vente", "E-commerce"],
    datasets: [
      {
        data: [
          donneesRevenus.posVentes.reduce((a, b) => a + b, 0),
          donneesRevenus.ecommerce.reduce((a, b) => a + b, 0),
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"],
        borderWidth: 1,
      },
    ],
  };

  // Options communes pour les graphiques
  const optionsBase = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
      },
    },
  };

  return (
    <section>
      <Title
        title={`${PartOfDay()}, ${
          `${user?.fname} ${user?.lname}` || "Admin"
        } (${t(user?.role || "")})`}
      />

      <section className="grid md:grid-cols-3 gap-5">
        {all.map((value, id) => (
          <Link to={`/orders/label?filter=${value}`} key={id}>
            <div className=" p-7 flex flex-row border shadow-lg items-center rounded-lg justify-between">
              <div>
                <h1 className="text-lg capitalize font-medium  w-max">
                  <span>{CurrentStats(value)}</span>
                </h1>
              </div>
              <h1 className=" text-5xl font-medium w-max text-main">
                {filter(value).length}
              </h1>
            </div>
          </Link>
        ))}
      </section>

      {user?.role === "admin" && (
        <section className="mt-10">
          <Title title={`Statistiques de Revenus`} />

          <div className="grid grid-cols-1 w-full md:grid-cols-2 gap-4 py-4">
            {/* Graphique Point de Vente */}
            <Card>
              <CardHeader>
                <CardTitle>Revenus Point de Vente</CardTitle>
              </CardHeader>
              <CardContent>
                <Bar data={dataPosVentes} options={optionsBase} />
              </CardContent>
            </Card>

            {/* Graphique E-commerce */}
            <Card>
              <CardHeader>
                <CardTitle>Revenus E-commerce</CardTitle>
              </CardHeader>
              <CardContent>
                <Line data={dataEcommerce} options={optionsBase} />
              </CardContent>
            </Card>

            {/* Graphique Comparatif */}
            <Card className="col-span-2 flex flex-col justify-center items-center w-full">
              <CardHeader>
                <CardTitle>Répartition des Revenus</CardTitle>
              </CardHeader>
              <CardContent>
                <Doughnut
                  data={dataComparaison}
                  options={{
                    ...optionsBase,
                    plugins: {
                      ...optionsBase.plugins,
                      title: {
                        ...optionsBase.plugins.title,
                        text: "Proportion des Revenus",
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </section>
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
