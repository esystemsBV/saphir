import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu, ArrowRight } from "lucide-react";
import Logo from "@/assets/logo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { sidebarItems } from "@/data/Pages";
import { useUser } from "@/hooks/useUserContext";

interface DashboardSideBarProps {
  isOpen: boolean;
  event: () => void;
}

export default function DashboardSideBar({
  isOpen,
  event,
}: DashboardSideBarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const filteredSidebarItems = sidebarItems
    .filter((item) => item.roles?.includes(user?.role || "admin"))
    .map((item) => {
      if (item.children) {
        const filteredChildren = item.children.filter((_) =>
          item.roles?.includes(user?.role || "admin")
        );
        return { ...item, children: filteredChildren };
      }
      return item;
    });

  const SidebarContent = (
    <div
      className={`px-4 py-10 fixed bg-white z-[100] animate-comein shadow-lg border-r h-screen flex flex-col duration-300 ${
        isOpen ? " w-72 translate-x-0" : "-translate-x-96"
      }`}
    >
      <div className="flex items-center justify-between px-2 w-full mb-10">
        <Logo className={`h-8 text-main mx-auto`} />
        <Button
          onClick={event}
          className="bg-main/20 w-max hover:bg-main duration-300 hover:text-white text-main"
        >
          <Menu />
        </Button>
      </div>

      <ScrollArea className="flex-grow">
        <Accordion type="single" collapsible className="w-full">
          {filteredSidebarItems.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              {item.children ? (
                <>
                  <AccordionTrigger className="hover:bg-gray-200 hover:text-black rounded-lg px-3 py-3">
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-4" />
                      <span className="text-base font-normal">
                        {item.label}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {item.children.map((child, childIndex) => (
                      <NavLink
                        key={childIndex}
                        to={child.to}
                        className={({ isActive }) => `
                          flex items-center w-full gap-2 p-3 py-5 rounded-lg duration-300 hover:bg-gray-200 hover:text-black ml-6
                          ${isActive ? "bg-main text-white" : ""}
                        `}
                      >
                        <ArrowRight className="size-5" />
                        {child.label}
                      </NavLink>
                    ))}
                  </AccordionContent>
                </>
              ) : (
                <NavLink
                  to={item.to || ""}
                  className={({ isActive }) => `
                    flex items-center w-full p-3 rounded-lg duration-300
                    hover:bg-gray-200 hover:text-black
                    ${isActive ? "bg-main text-white" : ""}
                  `}
                >
                  <item.icon className="w-5 h-5 mr-4" />
                  <span className="text-base font-normal">{item.label}</span>
                </NavLink>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );

  // if (isMobile) {
  //   return (
  //     <>
  //       <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background flex justify-around items-center p-2">
  //         {sidebarItems.map((item, index) => (
  //           <NavLink
  //             key={index}
  //             to={item.to || item.children?.[0].to || "#"}
  //             className={({ isActive }) => `
  //               flex flex-col items-center p-2 rounded-lg
  //               ${isActive ? "text-main" : "text-muted-foreground"}
  //             `}
  //           >
  //             <item.icon className="w-6 h-6" />
  //             <span className="text-xs mt-1">{item.label}</span>
  //           </NavLink>
  //         ))}
  //       </div>
  //     </>
  //   );
  // }

  if (isMobile)
    return (
      <>
        {SidebarContent}
        {!isOpen && (
          <Button
            onClick={event}
            className="bg-main w-max fixed right-5 bottom-5 duration-300 z-[1000] text-white"
          >
            <Menu />
          </Button>
        )}
      </>
    );

  return <>{SidebarContent}</>;
}
