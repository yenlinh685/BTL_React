import { Clock, Phone, UploadCloud } from "lucide-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router";
import { toast } from "sonner";
import Popper from "~/components/Popper/Popper";
import PostItem from "~/components/PostItem/PostItem";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { getPosts, type PostResponse } from "~/services/postService";
import { getUserByNickname } from "~/services/userService";
import type { PostModel } from "~/types/postModel";
import type { UserModel } from "~/types/userModel";
import { listenEvent } from "~/utils/event";
import useCurrentUser from "~/zustand/useCurrentUser";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import EditProfile from "./EditProfile";

const tabs = [
  { type: "approved", label: "Bài viết" },
  { type: "pending", label: "Đang chờ duyệt", isPrivate: true },
  { type: "rejected", label: "Bị từ chối", isPrivate: true },
  { type: "liked", label: "Đã thích", isPrivate: true },
];
const ProfilePage = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [posts, setPosts] = useState<PostResponse>();
  const [currentTab, setCurrentTab] = useState(tabs[0].type);
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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts({
          user_id: currentTab === "liked" ? undefined : user?.id,
          page: 1,
          per_page: 10,
          type: currentTab as "approved" | "pending" | "rejected",
        });
        setPosts(response);
      } catch (_) {
        toast.error("Failed to load posts");
      }
    };
    fetchPosts();
  }, [user, currentTab]);

  useEffect(() => {
    const remove = listenEvent("post:toggle-like", ({ detail: postId }) => {
      setPosts((prev: any) => {
        return {
          ...prev,
          data: prev?.data.map((post: PostModel) =>
            post.id === postId
              ? { ...post, is_favorite: !post.is_favorite }
              : post,
          ),
        };
      });
    });

    return () => remove();
  }, []);

  return (
    <div className="grid grid-cols-12 container mx-auto xl:max-w-7xl gap-4 mt-6">
      <div className="md:col-span-4 lg:col-span-3 col-span-12">
        <Popper className="p-8">
          <Avatar className="shrink-0 w-30 h-30 mx-auto">
            <AvatarImage
              src={
                user?.id === currentUser?.id
                  ? currentUser?.avatar || ""
                  : user?.avatar || ""
              }
              alt="@shadcn"
            />
            <AvatarFallback>VN</AvatarFallback>
          </Avatar>

          <p className="text-center font-bold text-lg mt-4">
            {user?.id === currentUser?.id
              ? currentUser?.full_name
              : user?.full_name}
          </p>

          <p className="text-center text-gray-500 text-sm">
            {user?.id === currentUser?.id
              ? currentUser?.nickname
              : user?.nickname}
          </p>

          <div className="mt-3 flex flex-col gap-1">
            <p className="flex items-center text-sm gap-2 ">
              {" "}
              <Phone className="size-4" />{" "}
              {user?.id === currentUser?.id
                ? currentUser?.phone_number
                : user?.phone_number}
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
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant={"secondary"} className="w-full mt-4">
                  Chỉnh sửa hồ sơ
                </Button>
              </DialogTrigger>
              <EditProfile setIsEditOpen={setIsEditOpen} />
            </Dialog>
          )}
        </Popper>
      </div>
      <div className="md:col-span-8 lg:col-span-9 col-span-12">
        <div className="flex p-1 rounded-lg bg-gray-100">
          {tabs.map((tab) => {
            return (
              <Button
                variant={"outline"}
                className={cn("flex-1 bg-transparent hover:bg-transparent", {
                  hidden: tab.isPrivate && currentUser?.id !== user?.id,
                  "bg-white hover:bg-white": tab.type === currentTab,
                })}
                key={tab.type}
                onClick={() => {
                  setCurrentTab(tab.type);
                }}
              >
                {tab.label}
              </Button>
            );
          })}
        </div>
        <div className="mt-2">
          <InfiniteScroll
            className="overflow-y-hidden! grid grid-cols-12 gap-2"
            dataLength={posts?.data.length || 0}
            next={() => {
              const fetchPost = async () => {
                try {
                  const response = await getPosts({
                    page: (posts?.meta.pagination.current_page || 1) + 1,

                    per_page: 15,
                    user_id: currentTab === "liked" ? undefined : user?.id,
                    type: currentTab as "approved" | "pending" | "rejected",
                  });
                  setPosts((prev: PostResponse | undefined) => {
                    return {
                      ...prev,
                      data: [...prev!.data, ...response.data],
                      meta: response.meta,
                    };
                  });
                } catch (_) {
                  toast.error(
                    "Đã có lỗi xảy ra khi lấy danh sách bất động sản",
                  );
                }
              };

              fetchPost();
            }}
            hasMore={
              posts?.meta.pagination
                ? posts?.meta.pagination.current_page <
                  posts?.meta.pagination.total_pages
                : false
            }
            loader={<></>}
          >
            {posts?.data.map((post) => {
              return (
                <React.Fragment key={post.id}>
                  <PostItem
                    post={post}
                    className="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-3"
                  ></PostItem>
                </React.Fragment>
              );
            })}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
