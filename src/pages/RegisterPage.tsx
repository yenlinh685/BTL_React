import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { register } from "~/services/authService";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    try {
      setErrorMessage("");

      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        setErrorMessage("Vui lòng nhập email hợp lệ");
        return;
      }

      if (password.trim().length < 6) {
        setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự");
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage("Mật khẩu xác nhận không khớp");
        return;
      }

      await register(email, password);

      toast.success("Đăng ký thành công!");

      navigate("/auth/login");
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
        Đăng ký tài khoản mới
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

      <div className="relative mt-2">
        <Input
          className=" py-5"
          type={showPassword ? "text" : "password"}
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          onChange={(e) => {
            setErrorMessage("");
            setConfirmPassword(e.target.value);
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

      <Button
        className="w-full mt-6 py-5 bg-[#3b8af7]"
        onClick={handleRegister}
      >
        Đăng ký
      </Button>

      <p className="mt-4 text-center text-sm">
        Bạn đã có tài khoản?{" "}
        <Link to="/auth/login">
          <span className="text-[#3b8af7] font-medium">Đăng nhập</span>
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
