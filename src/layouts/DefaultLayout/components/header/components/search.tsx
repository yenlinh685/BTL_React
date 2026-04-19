import { useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import { searchPosts } from "~/services/postService";
import HeadlessTippy from "huanpenguin-tippy-react/headless";
import type { PostModel } from "~/types/postModel";
import { Link } from "react-router";

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const [debounceValue] = useDebounce(searchValue, 500);
  const [isVisible, setIsVisible] = useState(false);
  const [searchResult, setSearchResult] = useState<PostModel[]>([]);

  useEffect(() => {
    (async () => {
      try {
        if (!debounceValue) {
          setSearchResult([]);
          return;
        }
        const response = await searchPosts(debounceValue);

        setSearchResult(response.data);
      } catch (error) {
        toast.error("Đã có lỗi xảy ra khi tìm kiếm bất động sản");
      }
    })();
  }, [debounceValue]);

  return (
    <div className="flex-1 flex justify-center min-w-0 mx-2">
      <HeadlessTippy
        visible={isVisible && searchResult.length > 0}
        render={() => {
          return (
            <div className="bg-white shadow-lg rounded-md p-4 w-full max-w-125">
              {searchResult.length > 0 ? (
                searchResult.map((post) => (
                  <Link
                    to={`/post/${post.id}`}
                    key={post.id}
                    className="py-2 border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-1.5 mt-2">
                      <img
                        src={JSON.parse(post.images)[0]}
                        className="w-12 h-12 object-cover rounded-md"
                        alt={post.title}
                      />
                      <div className="flex flex-col">
                        <p>{post.title}</p>
                        <p className="text-muted-foreground text-sm">
                          {post.administrative_address}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-gray-500">Không có kết quả nào</div>
              )}
            </div>
          );
        }}
        popperOptions={{
          modifiers: [
            {
              enabled: true,
              fn({ state }) {
                state.styles.popper.width = `${state.rects.reference.width}px`;
              },
              phase: "main",
            },
          ],
        }}
        interactive
        onClickOutside={() => setIsVisible(false)}
      >
        <Input
          className="w-full max-w-125"
          placeholder="Tìm kiếm bất động sản"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          onFocus={() => setIsVisible(true)}
        />
      </HeadlessTippy>
    </div>
  );
};

export default Search;
