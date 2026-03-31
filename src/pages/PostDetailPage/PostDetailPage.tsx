import { Calendar, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import Popper from "~/components/Popper/Popper";
import PricePerMeter, {
  calculatePricePerM2,
} from "~/components/PricePerMeter/PricePerMeter";
import { Button } from "~/components/ui/button";
import { deletePost, getPostById } from "~/services/postService";
import type { PostModel } from "~/types/postModel";
import useCurrentUser from "~/zustand/useCurrentUser";

const PostDetailPage = () => {
  const navigate = useNavigate();

  const currentUser = useCurrentUser((state) => state.user);

  const { id } = useParams();
  const [post, setPost] = useState<PostModel | null>(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!id) return;
        const response = await getPostById(Number(id));
        setPost(response.data);
      } catch (error: any) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Đã có lỗi xảy ra");
        }
      }
    };
    fetchPost();
  }, [id]);

  const handlePrevImage = () => {
    const images = JSON.parse(post?.images || "[]");
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      setCurrentImageIndex(images.length - 1);
    }
  };

  const handleNextImage = () => {
    const images = JSON.parse(post?.images || "[]");
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0);
    }
  };

  const details = [
    {
      label: "Tình trạng",
      value: post?.status,
      image: "/media/property_status.png",
    },
    {
      label: "Loại hình nhà ở",
      value: post?.json_category?.name,
      image: "/media/house_type.png",
    },
    {
      label: "Diện tích",
      value: post?.json_post_detail?.area,
      image: "/media/size.png",
    },
    {
      label: "Giá/m²",
      value: calculatePricePerM2(
        Number(post?.json_post_detail?.price),
        Number(post?.json_post_detail?.area),
      ),
      image: "/media/price_m2.png",
    },
    {
      label: "Hướng cửa chính",
      value: post?.json_post_detail?.main_door,
      image: "/media/direction.png",
    },
    {
      label: "Hướng ban công",
      value: post?.json_post_detail?.balcony,
      image: "/media/balcony_direction.png",
    },
    {
      label: "Giấy tờ pháp lý",
      value: post?.json_post_detail?.legal_documents,
      image: "/media/property_legal_document.png",
    },
    {
      label: "Tình trạng nội thất",
      value: post?.json_post_detail?.interior_status,
      image: "/media/interior_status.png",
    },
    {
      label: "Số phòng ngủ",
      value: post?.json_post_detail?.bedrooms,
      image: "/media/rooms.png",
    },
    {
      label: "Số phòng vệ sinh",
      value: post?.json_post_detail?.bathrooms,
      image: "/media/toilets.png",
    },
  ];

  const handleToggleLike = () => {
    setPost((prev: PostModel | null) => {
      if (!prev) return prev;

      return {
        ...prev,
        is_favorite: !prev.is_favorite,
      };
    });
  };

  const handleDelete = async () => {
    if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        await deletePost(post?.id || 0);
        navigate("/");
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  return (
    <div className="grid grid-cols-12 my-5 gap-3 container mx-auto xl:max-w-7xl">
      <div className="col-span-12 lg:col-span-7 flex flex-col gap-4">
        <Popper className="p-6">
          <div className="relative w-full aspect-9/4">
            <img
              src={JSON.parse(post?.images || "[]")[currentImageIndex]}
              alt=""
              className="w-full h-full object-cover rounded-md"
            />
            <Button
              className="rounded-full flex items-center justify-center absolute top-1/2 -translate-y-1/2 left-1 bg-slate-50/30 hover:bg-slate-50/50"
              variant={"ghost"}
              size={"icon"}
              onClick={handlePrevImage}
            >
              <ChevronLeft />
            </Button>

            <Button
              className="rounded-full flex items-center justify-center absolute top-1/2 -translate-y-1/2 right-1 bg-slate-50/30 hover:bg-slate-50/50"
              variant={"ghost"}
              size={"icon"}
              onClick={handleNextImage}
            >
              <ChevronRight />
            </Button>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div>
              <h2 className="text-xl font-semibold">{post?.title}</h2>
              <p className="text-sm">{`${post?.json_post_detail?.bedrooms}PN • ${post?.json_category?.name}`}</p>
              <PricePerMeter
                price={Number(post?.json_post_detail?.price) || 0}
                area={post?.json_post_detail?.area || 0}
              ></PricePerMeter>
              <p className="flex items-center gap-2">
                <MapPin className="text-xs" size={16} />{" "}
                {post?.administrative_address}
              </p>

              <p className="flex items-center gap-2">
                <Calendar className="text-xs" size={16} />
                {moment(post?.created_at).format("DD/MM/YYYY HH:mm")}
              </p>
            </div>
            <div>
              <Button
                variant={"outline"}
                className="flex items-center gap-2 border! border-border!"
                onClick={() => {
                  handleToggleLike();
                }}
              >
                Lưu{" "}
                <span className="text-xl">
                  {post?.is_favorite ? "🌟" : "☆"}
                </span>
              </Button>
            </div>
          </div>
        </Popper>

        <Popper className="p-6">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="flex items-center gap-2 justify-between py-2 border-b border-border"
            >
              <p className="flex items-center gap-2">
                <img className="size-4" src={detail.image} alt={detail.label} />
                {detail.label}
              </p>
              <p className="font-medium">{detail.value}</p>
            </div>
          ))}
        </Popper>

        <Popper className="p-6">
          <h2 className="text-xl font-semibold">Mô tả</h2>
          <p className="text-sm">{post?.description}</p>
        </Popper>
      </div>

      <div className="col-span-12 lg:col-span-5">
        <Popper className="p-6">
          {currentUser?.id === post?.json_user?.id ? (
            <div>
              <h3 className="text-lg font-bold">Quản lý bài viết</h3>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={"secondary"}
                  className="flex-1"
                  onClick={handleDelete}
                >
                  Xóa
                </Button>
                <Button variant={"default"} className="flex-1">
                  Chỉnh sửa
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className=" flex items-center gap-2">
                <img
                  src={
                    post?.json_user?.avatar?.trim() ||
                    "https://hanoidep.vn/wp-content/uploads/2025/11/avatar-trang-4.webp"
                  }
                  alt="avatar"
                  className="size-12 rounded-full object-cover"
                />

                <div>
                  <h3 className="text-base font-semibold">
                    {post?.json_user?.full_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {post?.role === "user" ? "Người dùng" : "Môi giới"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {post?.json_user?.post_count} bài viết
                </span>

                <span className="text-sm text-muted-foreground">
                  {moment.tz(post?.created_at, "Asia/Ho_Chi_Minh").fromNow()}
                </span>
              </div>

              <Link to={`tel:${post?.json_user?.phone_number}`}>
                <Button className="w-full mt-2 bg-green-300 text-black">
                  {post?.json_user?.phone_number || "Không có số điện thoại"}
                </Button>
              </Link>
            </div>
          )}
        </Popper>
      </div>
    </div>
  );
};

export default PostDetailPage;
