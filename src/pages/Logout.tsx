import { handleLogOut } from "@/apis/HandleLogOut";
import Logo from "@/assets/logo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function LogOutPage() {
  return (
    <div className="flex items-center gap-5 flex-col px-5 justify-center w-screen h-screen">
      <Logo className="w-52 mx-auto text-main" />
      <p className="text-xl text-center">
        Voulez-vous vraiment se déconnecter?
      </p>

      <div className="grid md:grid-cols-2 w-full md:w-1/2 items-center gap-2 md:gap-5">
        <Button onClick={handleLogOut}>Oui, me déconnecter</Button>

        <Button variant="outline">
          <Link
            to={"/"}
            className="flex items-center w-full justify-center gap-5"
          >
            Cancel
          </Link>
        </Button>
      </div>
    </div>
  );
}
