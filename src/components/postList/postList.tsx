import { toast } from "sonner";

import React, { useEffect, useState } from "react";
import { getPosts, type PostResponse } from "~/services/postService";
import InfiniteScroll from "react-infinite-scroll-component";
import PostItem from "~/components/PostItem/PostItem";
import { listenEvent } from "~/utils/event";
import type { PostModel } from "~/types/postModel";

const PER_PAGE = 10;

const PostList = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [posts, setPosts] = useState<PostResponse>();
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    province: string;
    district: string;
    ward: string;
  }>({
    province: "",
    district: "",
    ward: "",
  });

  useEffect(() => {
    const remove = listenEvent("categoryChanged", ({ detail: category }) => {
      setSelectedCategory(category);
    });

    return () => {
      remove();
    };
  }, []);

  useEffect(() => {
    const remove = listenEvent(
      "price-range:select",
      ({ detail: priceRange }) => {
        setPriceRange(priceRange.value);
      },
    );

    return () => remove();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const [minPrice, maxPrice] = priceRange?.split("-") || [
          undefined,
          undefined,
        ];

        const locationArray = Object.values(location).filter(Boolean);
        const response = await getPosts({
          property_categories: selectedCategory,
          min_price: minPrice,
          max_price: maxPrice,
          location: locationArray.reverse().join(", ") || undefined,
          page: 1,
          per_page: PER_PAGE,
        });
        setPosts(response);
      } catch (_) {
        toast.error("Đã có lỗi xảy ra khi lấy danh sách bất động sản");
      }
    };

    fetchPost();
  }, [
    selectedCategory,
    priceRange,
    location.ward,
    location.district,
    location.province,
    location,
  ]);
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

  useEffect(() => {
    const remove = listenEvent("location:apply", ({ detail: location }) => {
      setLocation(location);
    });

    return () => remove();
  }, []);

  return (
    <InfiniteScroll
      className="overflow-y-hidden! grid grid-cols-12 gap-2"
      dataLength={posts?.data.length || 0}
      next={() => {
        const fetchPost = async () => {
          try {
            const [minPrice, maxPrice] = priceRange?.split("-") || [
              undefined,
              undefined,
            ];

            const response = await getPosts({
              property_categories: selectedCategory,
              page: (posts?.meta.pagination.current_page || 1) + 1,
              min_price: minPrice,
              max_price: maxPrice,
              per_page: PER_PAGE,
            });
            setPosts((prev: PostResponse | undefined) => {
              return {
                ...prev,
                data: [...prev!.data, ...response.data],
                meta: response.meta,
              };
            });
          } catch (_) {
            toast.error("Đã có lỗi xảy ra khi lấy danh sách bất động sản");
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
  );
};

export default PostList;
