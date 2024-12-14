import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Collected,
  Delivered,
  EmptyBox,
  LoadingSpining,
  Paid,
  Prepared,
  // ReturnIcon,
  Rocket,
  Shipping,
} from "@/assets/svgs";
import FetchTableURL from "@/apis/HandleGetElement";
import Title from "@/components/ui/Title";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
import { order } from "@/lib/database";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { t } from "i18next";

export default function Details() {
  const orderKey = useLocation().pathname.split("orders/details/")[1];
  const [progress, setProgress] = useState(0);
  const { data, loading }: { data: order; loading: boolean } = FetchTableURL({
    url: `/orders/fetch/${orderKey}`,
  });

  const stops = [
    {
      position: 0,
      icon: <Rocket />,
      title: "créé",
      statut: "new",
      data:
        !loading &&
        format(new Date(data?.createdAt || ""), "P", { locale: fr }),
    },
    {
      position: 20,
      icon: <Prepared />,
      title: "préparé",
      statut: "prepared",
    },
    {
      position: 40,
      icon: <Collected />,
      title: "collecté",
      statut: "collected",
    },
    {
      position: 60,
      icon: <Shipping />,
      title: "en route",
      statut: "shipping",
    },
    {
      position: 80,
      icon: <Delivered />,
      title: "livré",
      statut: "delivered",
    },
    { position: 99, icon: <Paid />, title: "payé", statut: "payed" },
  ];

  useEffect(() => {
    if (data && !loading) {
      const statut = data.statut;
      const index = stops.findIndex((stop) => stop.statut === statut);
      setProgress(stops[index].position);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="text-main my-20">
        <LoadingSpining />
      </div>
    );
  }

  if (!loading && !data) {
    return (
      <>
        <EmptyBox />
      </>
    );
  }

  return (
    <>
      <section>
        <Title title={`Details de commande N° : ${orderKey}`} />

        <div className="mx-10 mb-16 mt-10 md:mt-32">
          <div
            className={`w-3 md:mx-auto h-[600px] md:h-3 md:w-full flex flex-col relative md:flex-row justify-between md:items-end bg-gray-300 rounded-full`}
          >
            <div
              className={`bg-green-500  w-2.5 md:h-2.5 p-1.5 rounded-full absolute`}
              style={{
                width: `${progress + 5}%`,
                height: `${progress + 5}%`,
              }}
            />
            {stops.map((stop, index) => (
              <div
                key={index}
                className="flex md:flex-col flex-row-reverse w-max md:gap-3 gap-20 items-center md:-mb-1.5 -ml-1.5"
              >
                <div className="flex items-center justify-center gap-1 w-max md:w-max flex-col">
                  <div className=" w-5 text-main">{stop.icon}</div>
                  <div>Cmd {stop.title}</div>
                  {/* <div className="text-sm text-foreground-400 -mt-2">
                    {progress >= stop.position
                      ? stop.statut
                      : "pas encore défénie"}
                  </div> */}
                </div>
                <div
                  className={`w-6 h-6 rounded-full z-10`}
                  style={{
                    background:
                      progress >= stop.position ? "#4caf50" : "#e0e0e0",
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <Title
          title={`Informations générales: (${t(
            `ord-${data?.statut}`
          ).toUpperCase()})`}
        />

        <div className="grid mt-10 md:grid-cols-2  lg:grid-cols-3 items-stretch gap-10">
          <section className="capitalize border border-main p-5 relative rounded-lg">
            <h1 className=" text-main font-semibold text-lg absolute -top-4 px-3 bg-white">
              Distinataire :
            </h1>
            <h1>Nom: {data?.fullname}</h1>
            <h1>Téléphone: {data?.phone}</h1>
            <h1>Whatsapp: {data?.whatsapp}</h1>
            <h1>
              Localisation: {data?.city}, {data?.address}
            </h1>
          </section>

          <section className="capitalize border border-main relative p-5 rounded-lg">
            <h1 className=" text-main font-semibold text-lg absolute -top-4 px-3 bg-white">
              Commande :
            </h1>
            {data.products?.map((product, index) => (
              <div key={index}>
                <h1>{product.name}</h1>
                <h1>Quantité: {product.quantity}</h1>
                <h1>Prix: {product.sellPrice}</h1>

                <hr />
              </div>
            ))}
          </section>

          <section className="capitalize border border-main relative p-5 rounded-lg">
            <h1 className=" text-main font-semibold text-lg absolute -top-4 px-3 bg-white">
              à propos :
            </h1>
            <h1>
              à livrer le:{" "}
              {format(new Date(data?.order_date), "P", { locale: fr })} à{" "}
              {data?.order_time}
            </h1>
            <h1>Agence: {data?.agence}</h1>
            <h1>livreur: {data?.livreur || "-"}</h1>
            <h1>preparateur: {data?.preparateur || "-"}</h1>
            <h1 className=" w-full">notes: {data?.notes || "-"}</h1>
          </section>
        </div>
      </section>

      <section className="mt-10 mb-20">
        <Title title={`Historique des actions:`} />

        <div className=" px-10">
          <ol className="relative text-gray-500 border-s border-gray-200">
            {/* {data?.history.map((value: any, index: any) => (
              <li className="mb-10 ms-10" key={index}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {value.creator.split("%20%")[0]}
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="absolute cursor-pointer flex items-center justify-center w-12 h-12 bg-main text-white rounded-full -start-4 ring-4 ring-white">
                        <h1 className="text-3xl font-medium uppercase">
                          {value.creator[0]}
                        </h1>
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <h3 className="font-medium leading-tight text-black">
                  {value.title}
                </h3>
                <p className="text-sm">{value.created}</p>
              </li>
            ))} */}

            <li className="mb-10 ms-10">
              <span className="absolute flex items-center justify-center size-10 bg-main text-white rounded-full -start-4 ring-4 ring-white">
                <h1 className="text-3xl font-medium uppercase">-</h1>
              </span>

              <h3 className="font-medium leading-tight text-black">
                Commande Créé
              </h3>
              <p className="text-sm">
                {format(new Date(data?.createdAt || ""), "P", {
                  locale: fr,
                })}{" "}
                à {data?.order_time}
              </p>
            </li>
          </ol>
        </div>
      </section>
    </>
  );
}

{
  /* <QRCode
        value={`https://192.168.11.102/orders/details?order=${orderKey}`}
        className=" w-20 h-20"
      /> */
}
