import { Route, Routes } from "react-router";
import HomePage from "../../pages/Home";
import AuthPage from "../../pages/AuthPage";
import DefaultLayout from "../../layouts/DefaultLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
