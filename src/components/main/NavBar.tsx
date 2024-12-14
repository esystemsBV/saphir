import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Expand,
  LogOut,
  Menu,
  Minimize2,
  MoveLeft,
  SettingsIcon,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Logo from "@/assets/logo";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { t } from "i18next";
import { useUser } from "@/hooks/useUserContext";

export default function DashboardNavBar({
  event,
  hideSideBar = false,
}: {
  event?: () => void;
  hideSideBar?: boolean;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
    setIsFullscreen(true);
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  return (
    <div className="border-b border shadow-sm bg-white z-50 sticky top-0 flex items-center justify-between px-5 py-2">
      <div className="flex justify-between text-main items-center w-full">
        <div className="flex items-center justify-center">
          <div className="items-center hidden md:flex">
            {!hideSideBar && (
              <Button
                onClick={event}
                className="bg-main/20 hover:bg-main duration-300 hover:text-white text-main mr-5"
              >
                <Menu />
              </Button>
            )}
          </div>

          <Logo className="w-32 text-main" />
        </div>
      </div>
      <div className="flex items-center gap-5">
        <p className="text-xl font-semibold hidden md:block">
          {format(new Date(), "p", { locale: fr })}
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer bg-primary text-primary-foreground">
              <AvatarImage src="" alt="User avatar" />
              <AvatarFallback>{`${user?.fname[0]}${user?.lname[0]}`}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center">
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>{t("settings")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/logout" className="flex items-center text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("logout")}</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className={`justify-center flex items-center cursor-pointer size-10 rounded-lg bg-yellow-200 text-yellow-500`}
          >
            <MoveLeft />
          </button>

          <button
            onClick={toggleFullscreen}
            className={`justify-center hidden md:flex items-center cursor-pointer size-10 rounded-lg ${
              isFullscreen
                ? "bg-red-200 text-red-500"
                : "bg-green-200 text-green-500"
            }`}
          >
            {isFullscreen ? <Minimize2 /> : <Expand />}
          </button>
        </div>
      </div>
    </div>
  );
}
