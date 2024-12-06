import { Link, useLocation } from "react-router-dom";
import Title from "@/components/ui/Title";
import DashboardNavBar from "@/components/main/NavBar";
import { useNavigate } from "react-router-dom";
import { ArrowLeftCircleIcon, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import PageNotFound from "./PageNotFound";
import { refres } from "@/data/Pages";

export default function Menu() {
  const hashing = useLocation().search.split("?ref=")[1];
  const navigate = useNavigate();

  const menuSection = refres.find((e) => e.ref === hashing);

  if (!menuSection) {
    return <PageNotFound />;
  }

  return (
    <div>
      <DashboardNavBar hideSideBar />

      <section className="p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <Title title={menuSection.title} />
          </div>
          <div onClick={() => navigate(-1)} className="text-main">
            <ArrowLeftCircleIcon className="size-7 cursor-pointer" />
          </div>
        </div>

        {menuSection.elements.map((val, index) => (
          <Link to={val.link} key={index} className="w-full">
            <Card className=" p-7 flex flex-row justify-between items-center">
              <div className="flex gap-5 items-center">
                <div className="w-6 text-main">{val.icon}</div>
                <h1 className="text-lg font-medium">{val.title}</h1>
              </div>
              <div className="text-main">
                <ArrowRight />
              </div>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
