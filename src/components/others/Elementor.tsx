import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const Elementor = ({ title }: { title: string }) => {
  const location = useLocation();

  useEffect(() => {
    document.title = title + " | SaphirWeb";
  }, [location, title]);

  return null;
};
