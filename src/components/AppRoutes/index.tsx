import { Route, Routes } from "react-router";
import HomePage from "../../pages/Home";
import LoginPage from "../../pages/LoginPage";
import DefaultLayout from "../../layouts/DefaultLayout/DefaultLayout";
import AuthLayout from "~/layouts/AuthLayout/AuthLayout";
import RegisterPage from "~/pages/RegisterPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route element={<DefaultLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
