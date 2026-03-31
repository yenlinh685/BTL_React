import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { logout } from "~/services/authService";
import { listenEvent } from "~/utils/event";
import useCurrentUser from "~/zustand/useCurrentUser";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const MobileSidebar = () => {
  const currentUser = useCurrentUser((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const MENU = [
    { label: "Trang chủ", href: "/", isAuth: false, isAdmin: false },
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      isAuth: true,
      isAdmin: true,
    },
    {
      label: "Quản lý tin đăng",
      href: "/post/manager",
      isAuth: true,
      isAdmin: false,
    },
    { label: "Đăng tin", href: "/post/create", isAuth: true, isAdmin: false },
  ];

  useEffect(() => {
    const removeListener = listenEvent("sidebar:toggle", () => {
      setIsOpen((prev) => !prev);
    });
    return () => {
      removeListener();
    };
  }, []);
  const handleLogout = async () => {
    try {
      await logout();

      window.location.reload();
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response?.data?.message);
      }

      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };
  return (
    <div>
      <div
        className={cn(
          "fixed top-0 left-0 bottom-0 w-screen sm:w-100 bg-white z-50 transition-transform duration-300 ease-in-out px-4",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Button
          variant={"ghost"}
          size={"icon"}
          className="absolute top-2 right-2"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <X></X>
        </Button>
        {currentUser ? (
          <div className="flex flex-col h-full py-6 ">
            <div className="flex-1 flex flex-col items-center mt-4">
              <Avatar className="w-30 h-30 rounded-full border border-border">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>VN</AvatarFallback>
              </Avatar>
              <h2 className="font-semibold mt-2.5">{currentUser.full_name}</h2>
              <p className="text-muted-foreground">
                {currentUser.phone_number}
              </p>
              <Link to={"/profile"}>
                <Button variant={"secondary"} className="my-4 py-5">
                  Đi tới hồ sơ của bạn
                </Button>
              </Link>
              {MENU.map((item) => {
                if (item.isAuth && currentUser && !item.isAdmin) {
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="w-full justify-start"
                    >
                      <Button
                        variant={"ghost"}
                        className="w-full justify-start"
                      >
                        {item.label}
                      </Button>
                    </Link>
                  );
                }
                if (!item.isAuth) {
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="w-full justify-start"
                    >
                      <Button
                        variant={"ghost"}
                        className="w-full justify-start"
                      >
                        {item.label}
                      </Button>
                    </Link>
                  );
                }
                if (
                  item.isAdmin &&
                  currentUser &&
                  currentUser.role === "admin"
                ) {
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="w-full justify-start"
                    >
                      <Button
                        variant={"ghost"}
                        className="w-full justify-start"
                      >
                        {item.label}
                      </Button>
                    </Link>
                  );
                }
                return null;
              })}
            </div>
            <Button
              variant={"secondary"}
              className="text-red-500"
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </div>
        ) : (
          <div className="mt-10 ">
            <h2 className="font-semibold">Đăng nhập để xem đầy đủ tính năng</h2>
            <div className="w-full mt-4 ">
              <Link to={"/auth/login"}>
                <Button variant={"secondary"} className="w-1/2">
                  Đăng nhập
                </Button>
              </Link>

              <Link to={"/auth/register"}>
                <Button className="w-1/2">Đăng ký</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
      <div
        onClick={() => {
          setIsOpen(false);
        }}
        className={cn(
          "fixed top-0 right-0 left-0 bottom-0 bg-black/30 z-40 hidden",
          { block: isOpen },
        )}
      ></div>
    </div>
  );
};

export default MobileSidebar;
