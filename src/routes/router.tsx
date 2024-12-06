import { Elementor } from "@/components/others/Elementor";
import { nonAuthPages, pages } from "@/data/Pages";
import DashboardLayout from "@/layouts/DashboardLayout";
import POS from "@/pages/POS";
import { t } from "i18next";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          {pages.map((page) => (
            <Route
              path={page.path}
              key={page.path}
              element={
                <>
                  <Elementor title={t(page.name)} />
                  <page.element />
                </>
              }
            />
          ))}
        </Route>

        <Route
          path="/pos"
          element={
            <>
              <Elementor title={t("pointOfSale")} />
              <POS />
            </>
          }
        />

        {nonAuthPages.map((page) => (
          <Route
            path={page.path}
            key={page.path}
            element={
              <>
                <Elementor title={t(page.name)} />
                <page.element />
              </>
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
