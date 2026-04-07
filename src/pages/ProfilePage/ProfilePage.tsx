import { useParams } from "react-router";
import Popper from "~/components/Popper/Popper";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import type { UserModel } from "~/types/userModel";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getUserByNickname } from "~/services/userService";
import { Clock, Phone, UploadCloud } from "lucide-react";
import moment from "moment";
import { Button } from "~/components/ui/button";
import useCurrentUser from "~/zustand/useCurrentUser";

const ProfilePage = () => {
  const currentUser = useCurrentUser((state) => state.user);

  const { nickname } = useParams();
  const [user, setUser] = useState<UserModel | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await getUserByNickname(nickname!);
        setUser(response.data);
      } catch (_) {
        toast.error("Failed to load user");
      }
    };
    getUser();
  }, [nickname]);

  return (
    <div className="grid grid-cols-12 container mx-auto xl:max-w-7xl gap-4 mt-6">
      <div className="md:col-span-4 lg:col-span-3 col-span-12">
        <Popper className="p-8">
          <Avatar className="shrink-0 w-30 h-30 mx-auto">
            <AvatarImage src={user?.avatar || ""} alt="@shadcn" />
            <AvatarFallback>VN</AvatarFallback>
          </Avatar>

          <p className="text-center font-bold text-lg mt-4">
            {user?.full_name}
          </p>

          <p className="text-center text-gray-500 text-sm">{user?.nickname}</p>

          <div className="mt-3 flex flex-col gap-1">
            <p className="flex items-center text-sm gap-2 ">
              {" "}
              <Phone className="size-4" /> {user?.phone_number}
            </p>
            <p className="flex items-center text-sm gap-2 ">
              <Clock className="size-4" /> Tham gia từ{" "}
              {moment(user?.created_at).format("DD/MM/YYYY")}
            </p>
            <p className="flex items-center text-sm gap-2 ">
              <UploadCloud className="size-4" />
              <span>
                Đã đăng{" "}
                <span className="font-semibold">{user?.post_count || 0}</span>{" "}
                bài viết
              </span>
            </p>
          </div>

          {currentUser?.id === user?.id && (
            <Button variant={"secondary"} className="w-full mt-4">
              Chỉnh sửa hồ sơ
            </Button>
          )}
        </Popper>
      </div>
      <div className="md:col-span-8 lg:col-span-9 col-span-12">Right</div>
    </div>
  );
};

export default ProfilePage;
