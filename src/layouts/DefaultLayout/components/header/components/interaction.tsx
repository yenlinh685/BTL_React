import { Link } from "react-router";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "~/components/ui/menubar";
import { useAppSelector } from "~/redux/hooks";
import { selectCurrentUser } from "~/redux/selectors";
import { logout } from "~/services/authService";

const Interaction = () => {
  const currentUser = useAppSelector(selectCurrentUser);

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
    <>
      <div className=" items-center gap-2 hidden md:flex">
        {currentUser ? (
          <>
            <Button variant="outline">Quản lý tin đăng</Button>
            <Button variant="default">Đăng tin</Button>
          </>
        ) : (
          <>
            <Link to="/auth/login">
              <Button variant="outline">Đăng nhập</Button>
            </Link>
            <Link to="/auth/register">
              <Button variant="default">Đăng ký</Button>
            </Link>
          </>
        )}
      </div>

      {currentUser && (
        <Menubar className="border-none ml-2">
          <MenubarMenu>
            <MenubarTrigger>
              <Avatar>
                <AvatarImage src={currentUser?.avatar} />
                <AvatarFallback>VN</AvatarFallback>
              </Avatar>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                <MenubarItem>Hồ sơ cá nhân</MenubarItem>
                {currentUser.role === "admin" && (
                  <MenubarItem>Dashboard</MenubarItem>
                )}
              </MenubarGroup>
              <MenubarSeparator />
              <MenubarGroup>
                <MenubarItem className="text-red-500" onClick={handleLogout}>
                  Đăng xuất
                </MenubarItem>
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )}
    </>
  );
};

export default Interaction;
