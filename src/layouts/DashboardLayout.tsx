import { useEffect, useState } from "react";
import DashboardSideBar from "@/components/main/SideBar";
import DashboardNavBar from "@/components/main/NavBar";
import { Outlet, useLocation } from "react-router-dom";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const event = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    setSidebarOpen(false);
  }, [useLocation().pathname]);

  return (
    <>
      <div
        onClick={event}
        style={{ display: sidebarOpen ? "block" : "none" }}
        className="bg-black/50 animate-in z-50 fixed w-screen h-screen"
      />
      <DashboardSideBar isOpen={sidebarOpen} event={event} />

      <DashboardNavBar event={event} />

      <div className="max-w-screen-2xl mx-5 px-5 2xl:px-0 md:mx-auto pb-28">
        <Outlet />
      </div>
    </>
  );
}
