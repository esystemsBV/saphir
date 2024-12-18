import { Route, Routes } from "react-router-dom";
import { Pages } from "../data/Pages";
import PageNotFound from "../pages/PageNotFound";

const Router = () => {
  return (
    <Routes>
      {Pages.map((page) => (
        <Route
          path={page.path}
          key={page.path}
          index={page.index}
          element={page.element}
        />
      ))}

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default Router;
