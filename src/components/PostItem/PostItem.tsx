import { cn } from "~/lib/utils";
import type { PostModel } from "~/types/postModel";
import PricePerMeter from "../PricePerMeter/PricePerMeter";
import { MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { likePost, unlikePost } from "~/services/postService";
import { sendEvent } from "~/utils/event";

interface PostItemProps {
  post: PostModel;
  className?: string;
}
const PostItem: React.FC<PostItemProps> = ({ post, className }) => {
  const handleToggleLike = async () => {
    try {
      switch (post.is_favorite) {
        case true:
          await unlikePost(post.id);
          break;
        case false:
          await likePost(post.id);
          break;
      }
      sendEvent("post:toggle-like", post.id);
    } catch (error) {
      toast.error(`Lỗi khi ${post.is_favorite ? "unlike" : "like"} bài đăng`);
    }
  };
  return (
    <div className={cn("relative", className)}>
      <img
        src={JSON.parse(post.images || "")[0]}
        className="w-full aspect-square rounded-md "
        alt=""
      />
      <p className="truncate line-clamp-2 whitespace-pre-wrap h-12 leading-6">
        {post.title}
      </p>
      <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
        <span>{post.json_post_detail.bedrooms} PN</span>
        <span>{post.json_category?.name}</span>
      </div>
      <PricePerMeter
        price={Number(post.json_post_detail.price)}
        area={post.json_post_detail.area}
      ></PricePerMeter>

      <p className="text-sm text-muted-foreground flex items-center gap-2">
        <span>
          <MapPin size={16}></MapPin>
        </span>
        {post.administrative_address}
      </p>
      <Button
        variant={"ghost"}
        size={"icon"}
        className="text-2xl absolute top-1 right-1 text-blue-600"
        onClick={handleToggleLike}
      >
        {post.is_favorite ? "🌟" : "☆"}
      </Button>
    </div>
  );
};

export default PostItem;
