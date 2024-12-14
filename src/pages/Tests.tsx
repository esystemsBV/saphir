import FetchTableURL from "@/apis/HandleGetElement";
import { LoadingSpining } from "@/assets/svgs";
import Title from "@/components/ui/Title";
import { useUser } from "@/hooks/useUserContext";
import { products } from "@/lib/database";
import { t } from "i18next";
import { Link } from "react-router-dom";

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
