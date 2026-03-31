import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { login } from "~/services/authService";
import useCurrentUser from "~/zustand/useCurrentUser";

const LoginPage = () => {
  const setUser = useCurrentUser((state) => state.setUser);

  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      setErrorMessage("");

      if (!/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        setErrorMessage("Vui lòng nhập email hợp lệ");
        return;
      }

      if (password.trim().length < 6) {
        setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự");
        return;
      }

      const response = await login(email, password);

      setUser(response.data);

      window.location.href = "/";
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrorMessage(error.response?.data?.message);

        return;
      }

      setErrorMessage("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <div>
      <h1 className="mt-12 font-bold text-center text-[#3b8af7]">
        Đăng nhập vào tài khoản của bạn
      </h1>

      <Input
        className="mt-4 py-5"
        placeholder="Nhập email của bạn"
        value={email}
        onChange={(e) => {
          setErrorMessage("");
          setEmail(e.target.value);
        }}
      />
      <div className="relative mt-2">
        <Input
          className=" py-5"
          type={showPassword ? "text" : "password"}
          placeholder="Nhập mật khẩu của bạn"
          value={password}
          onChange={(e) => {
            setErrorMessage("");
            setPassword(e.target.value);
          }}
        />

        <div
          className="absolute right-0 top-1/2 -translate-1/2 cursor-pointer p-1"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </div>
      </div>

      <small className="mt-2 text-red-500 font-medium">{errorMessage}</small>

      <Button className="w-full mt-6 py-5 bg-[#3b8af7]" onClick={handleLogin}>
        Đăng nhập
      </Button>

      <p className="mt-4 text-center text-sm">
        Bạn chưa có tài khoản?{" "}
        <Link to="/auth/register">
          <span className="text-[#3b8af7] font-medium">Đăng ký</span>
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
