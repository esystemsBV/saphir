import { Card, CardContent } from "@/components/ui/card";
import Title from "@/components/ui/Title";
import { t } from "i18next";
import { ArrowRight, CreditCard, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Settings() {
  const settingsCategories = [
    {
      title: "Méthodes de paiement",
      icon: CreditCard,
      link: "/settings/paimentmethodes",
    },
    {
      title: "Profil",
      icon: User,
      link: "/settings/profile",
    },
    // {
    //   title: "Notifications",
    //   icon: Bell,
    //   link: "/settings/notifications",
    // },
    // {
    //   title: "Sécurité",
    //   icon: Shield,
    //   link: "/settings/security",
    // },
  ];
  return (
    <>
      <Title title={t("settings")} />

      <div className="grid grid-cols-1 gap-5">
        {settingsCategories.map((category, index) => (
          <Card key={index} className="w-full">
            <CardContent className=" py-4 flex cursor-pointer items-center w-full justify-between">
              <Link
                to={category.link}
                className=" flex items-center justify-between w-full"
              >
                <div className="flex text-xl font-medium flex-row items-center space-x-4">
                  <category.icon className="size-7 stroke-main text-primary flex-shrink-0" />
                  <h1>{category.title}</h1>
                </div>

                <ArrowRight
                  className="h-4 w-4 mx-2 stroke-main"
                  aria-hidden="true"
                />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
