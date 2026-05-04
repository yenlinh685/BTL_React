import { Route, Routes } from "react-router";
import HomePage from "../../pages/HomePage/HomePage";
import LoginPage from "../../pages/LoginPage";
import DefaultLayout from "../../layouts/DefaultLayout/DefaultLayout";
import AuthLayout from "~/layouts/AuthLayout/AuthLayout";
import AdminLayout from "~/layouts/AdminLayout/AdminLayout";
import RegisterPage from "~/pages/RegisterPage";
import CreatePostPage from "~/pages/CreatePostPage/CreatePostPage";
import PostDetailPage from "~/pages/PostDetailPage/PostDetailPage";
import ProfilePage from "~/pages/ProfilePage/ProfilePage";
import DashboardPage from "~/pages/DashboardPage/DashboardPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
      </Route>

      <Route element={<DefaultLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/create" element={<CreatePostPage />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
        <Route path="/user/:nickname" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
