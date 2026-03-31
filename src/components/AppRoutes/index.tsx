import { Route, Routes } from "react-router";
import HomePage from "../../pages/HomePage/HomePage";
import LoginPage from "../../pages/LoginPage";
import DefaultLayout from "../../layouts/DefaultLayout/DefaultLayout";
import AuthLayout from "~/layouts/AuthLayout/AuthLayout";
import RegisterPage from "~/pages/RegisterPage";
import CreatePostPage from "~/pages/CreatePostPage/CreatePostPage";
import PostDetailPage from "~/pages/PostDetailPage/PostDetailPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route element={<DefaultLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/create" element={<CreatePostPage />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
