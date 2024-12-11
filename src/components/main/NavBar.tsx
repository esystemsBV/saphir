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
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Logo from "@/assets/logo";

export default function DashboardNavBar({
  event,
  hideSideBar = false,
}: {
  event?: () => void;
  hideSideBar?: boolean;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();

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
          {new Date().toISOString().slice(11, 16)}
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="text-white bg-main cursor-pointer">
              <AvatarImage src={""} />
              <AvatarFallback>ZE</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenu>
            <DropdownMenuContent className="flex items-center gap-2">
              <div className="w-5 text-black/70">
                <SettingsIcon />
              </div>
              <Link to={"/settings"}>Paramètres</Link>
            </DropdownMenuContent>
            <DropdownMenuContent
              color="danger"
              className="flex items-center gap-2"
            >
              <div className="w-5 text-black/70">
                <LogOut />
              </div>
              <Link to={"/logout"}>Se déconnecter</Link>
            </DropdownMenuContent>
          </DropdownMenu>
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
