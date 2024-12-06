import LoadingLogo from "@/components/others/LoadingLogo";
import { Toaster } from "@/components/ui/toaster";
import Router from "@/routes/router";
import { useEffect, useState } from "react";

export default function App() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 3000);
  }, []);

  if (show) return <LoadingLogo />;

  return (
    <div className="font-poppins">
      <Toaster />
      <Router />
    </div>
  );
}
