import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Check,
  Hourglass,
  X as XIcon,
  Trash2,
  RotateCcw,
  Smartphone,
  CheckCircle,
  Clock,
  Ban,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import useCurrentUser from "~/zustand/useCurrentUser";
import moment from "moment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

import type { PostModel } from "~/types/postModel";
import type { CategoryModel } from "~/types/categoryModel";
import * as postService from "~/services/postService";
import * as categoryService from "~/services/categoryService";
import * as analyticsService from "~/services/analyticsService";
import type { OverviewData } from "~/services/analyticsService";

moment.locale("vi");

const PER_PAGE = 10;

const AdminPostPage = () => {
  const user = useCurrentUser((state) => state.user);

  // States for filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<
    "approved" | "pending" | "rejected" | ""
  >("");
  const [projectType, setProjectType] = useState<"sell" | "rent" | "">("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  // States for data
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [selectedPostIds, setSelectedPostIds] = useState<number[]>([]);

  // Overview stats
  const [overview, setOverview] = useState<OverviewData | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  // Fetch categories (for filter dropdown)
  useEffect(() => {
    categoryService
      .getCategories(1, 100)
      .then((res) => {
        setCategories(res.data);
      })
      .catch(() => {});
  }, []);

  // Fetch overview
  const fetchOverview = useCallback(async () => {
    try {
      const res = await analyticsService.getOverview(
        "2020-01-01",
        "2030-01-01",
      );
      setOverview(res.data);
    } catch (e) {
      // ignore
    }
  }, []);

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await postService.getPosts({
        page,
        per_page: PER_PAGE,
        q: q || undefined,
        type: status || undefined,
        project_type: projectType || undefined,
        property_categories: category || undefined,
      });
      setPosts(res.data);
      setTotalPosts(res.meta.pagination.total);
      setTotalPages(res.meta.pagination.total_pages);
    } catch (err) {
      toast.error("Lấy danh sách tin đăng thất bại");
    } finally {
      setLoading(false);
    }
  }, [page, q, status, projectType, category]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Reset selected posts when posts list changes
  useEffect(() => {
    setSelectedPostIds([]);
  }, [posts]);

  // Checkbox handlers
  const isAllSelected = posts.length > 0 && selectedPostIds.length === posts.length;
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPostIds(posts.map((p) => p.id));
    } else {
      setSelectedPostIds([]);
    }
  };

  const handleSelectPost = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedPostIds((prev) => [...prev, id]);
    } else {
      setSelectedPostIds((prev) => prev.filter((pId) => pId !== id));
    }
  };

  // Actions
  const handleStatusChange = (
    id: number,
    newStatus: "approved" | "pending" | "rejected",
  ) => {
    const isSelected = selectedPostIds.includes(id);
    const targetIds = isSelected ? selectedPostIds : [id];

    const actionName =
      newStatus === "approved"
        ? "duyệt"
        : newStatus === "pending"
          ? "chuyển về chờ duyệt"
          : "từ chối";

    setConfirmDialog({
      open: true,
      title: "Xác nhận thao tác",
      description: targetIds.length > 1 
        ? `Bạn có chắc muốn ${actionName} ${targetIds.length} tin đăng đã chọn?`
        : `Bạn có chắc muốn ${actionName} tin đăng này?`,
      onConfirm: async () => {
        try {
          await Promise.all(targetIds.map(targetId => postService.modifyPostStatus(targetId, newStatus)));
          toast.success("Cập nhật trạng thái thành công");
          fetchPosts();
          fetchOverview();
          setSelectedPostIds([]);
        } catch (err) {
          toast.error("Cập nhật trạng thái thất bại");
        }
      },
    });
  };

  const handleDelete = (id: number) => {
    const isSelected = selectedPostIds.includes(id);
    const targetIds = isSelected ? selectedPostIds : [id];

    setConfirmDialog({
      open: true,
      title: "Xác nhận xóa",
      description: targetIds.length > 1
        ? `Bạn có chắc muốn xóa ${targetIds.length} tin đăng đã chọn? Hành động này không thể hoàn tác.`
        : "Bạn có chắc muốn xóa tin đăng này? Hành động này không thể hoàn tác.",
      onConfirm: async () => {
        try {
          await Promise.all(targetIds.map(targetId => postService.deletePost(targetId)));
          toast.success("Xóa tin đăng thành công");
          fetchPosts();
          fetchOverview();
          setSelectedPostIds([]);
        } catch (err) {
          toast.error("Xóa tin đăng thất bại");
        }
      },
    });
  };

  const handleReset = () => {
    setQ("");
    setStatus("");
    setProjectType("");
    setCategory("");
    setPage(1);
  };

  const formatPrice = (price?: string | number) => {
    if (!price) return "Thỏa thuận";
    const p = Number(price);
    if (isNaN(p)) return price;
    if (p >= 1000000000)
      return `${(p / 1000000000).toLocaleString("vi-VN", { maximumFractionDigits: 3 })} tỷ`;
    if (p >= 1000000) return `${(p / 1000000).toLocaleString("vi-VN")} triệu`;
    return `${p.toLocaleString("vi-VN")} VNĐ`;
  };

  // Pagination logic
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="max-w-[1400px] w-full min-w-0 mx-auto min-h-full flex flex-col bg-[#f5f6fa]">
      {/* Top Header */}
      <div className="flex justify-between items-center bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-gray-100 px-6 py-4 rounded-[14px] mb-6 flex-wrap gap-4">
        <h1 className="text-[22px] font-bold text-gray-800 m-0">
          Quản lí tin đăng
        </h1>
        <div className="flex items-center gap-3">
          <img
            src={
              user?.avatar ||
              "https://ui-avatars.com/api/?name=Admin&background=random"
            }
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <span className="text-[14px] font-bold text-gray-700">
            {user?.nickname || "Admin"}
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {/* Total */}
        <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-gray-100 flex items-center gap-4">
          <div className="w-[52px] h-[52px] rounded-[14px] bg-orange-50 text-[#e8590c] flex items-center justify-center shrink-0">
            <Smartphone size={26} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] text-gray-500 font-medium mb-1">
              Tổng số tin đăng
            </span>
            <span className="text-[28px] font-extrabold text-gray-800 leading-none">
              {overview?.total_post || 0}
            </span>
          </div>
        </div>

        {/* Approved */}
        <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-gray-100 flex items-center gap-4">
          <div className="w-[52px] h-[52px] rounded-[14px] bg-green-50 text-green-500 flex items-center justify-center shrink-0">
            <CheckCircle size={26} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] text-gray-500 font-medium mb-1">
              Đã duyệt
            </span>
            <span className="text-[28px] font-extrabold text-gray-800 leading-none">
              {overview?.approved_posts || 0}
            </span>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-gray-100 flex items-center gap-4">
          <div className="w-[52px] h-[52px] rounded-[14px] bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <Clock size={26} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] text-gray-500 font-medium mb-1">
              Chờ duyệt
            </span>
            <span className="text-[28px] font-extrabold text-gray-800 leading-none">
              {overview?.pending_posts || 0}
            </span>
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-gray-100 flex items-center gap-4">
          <div className="w-[52px] h-[52px] rounded-[14px] bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <Ban size={26} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] text-gray-500 font-medium mb-1">
              Bị từ chối
            </span>
            <span className="text-[28px] font-extrabold text-gray-800 leading-none">
              {overview?.rejected_posts || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-white rounded-[14px] p-2 shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-gray-100">
        <div className="flex-1 min-w-[240px] relative">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề, địa chỉ"
            className="w-full py-2.5 pl-10 pr-4 text-[13.5px] border-[1.5px] border-gray-200 rounded-lg outline-none focus:border-[#e8590c] focus:shadow-[0_0_0_3px_rgba(232,89,12,0.08)] transition-all bg-white"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <select
          className="min-w-[140px] py-2.5 px-3.5 text-[13.5px] border-[1.5px] border-gray-200 rounded-lg outline-none focus:border-[#e8590c] focus:shadow-[0_0_0_3px_rgba(232,89,12,0.08)] transition-all bg-white text-gray-700 cursor-pointer"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as any);
            setPage(1);
          }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="approved">Đã duyệt</option>
          <option value="pending">Chờ duyệt</option>
          <option value="rejected">Bị từ chối</option>
        </select>

        <select
          className="min-w-[130px] py-2.5 px-3.5 text-[13.5px] border-[1.5px] border-gray-200 rounded-lg outline-none focus:border-[#e8590c] focus:shadow-[0_0_0_3px_rgba(232,89,12,0.08)] transition-all bg-white text-gray-700 cursor-pointer"
          value={projectType}
          onChange={(e) => {
            setProjectType(e.target.value as any);
            setPage(1);
          }}
        >
          <option value="">Tất cả loại</option>
          <option value="sell">Bán</option>
          <option value="rent">Cho thuê</option>
        </select>

        <select
          className="min-w-[160px] py-2.5 px-3.5 text-[13.5px] border-[1.5px] border-gray-200 rounded-lg outline-none focus:border-[#e8590c] focus:shadow-[0_0_0_3px_rgba(232,89,12,0.08)] transition-all bg-white text-gray-700 cursor-pointer"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c.id} value={c.key}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          className="flex items-center justify-center gap-2 py-2.5 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[13.5px] font-semibold transition-all cursor-pointer border-none ml-auto"
          onClick={handleReset}
        >
          <RotateCcw size={16} /> Đặt lại
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-gray-100 rounded-[14px] flex-1 flex flex-col overflow-hidden mb-6">
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <h2 className="text-[17px] font-bold text-gray-800 m-0">
            Danh sách tin đăng
          </h2>
          <span className="text-[13px] text-gray-500 font-medium">
            Hiển thị {posts.length}/{totalPosts}
          </span>
        </div>

        <div className="overflow-x-auto w-full max-w-full">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="w-12 px-4 py-3.5 text-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 accent-[#e8590c] cursor-pointer"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-3 py-3.5 text-left text-[13px] font-bold text-gray-600">
                  STT
                </th>
                <th className="px-4 py-3.5 text-left text-[13px] font-bold text-gray-600 min-w-[300px]">
                  Tiêu đề
                </th>
                <th className="px-4 py-3.5 text-left text-[13px] font-bold text-gray-600">
                  Loại
                </th>
                <th className="px-4 py-3.5 text-left text-[13px] font-bold text-gray-600">
                  Giá
                </th>
                <th className="px-4 py-3.5 text-left text-[13px] font-bold text-gray-600">
                  Trạng thái
                </th>
                <th className="px-4 py-3.5 text-left text-[13px] font-bold text-gray-600 whitespace-nowrap">
                  Ngày đăng
                </th>
                <th className="px-4 py-3.5 text-center text-[13px] font-bold text-gray-600">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-gray-200 border-t-[#e8590c] rounded-full animate-spin" />
                      <span className="text-[14px] font-medium">
                        Đang tải dữ liệu...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-12 text-gray-500 text-[14px]"
                  >
                    Không tìm thấy tin đăng nào
                  </td>
                </tr>
              ) : (
                posts.map((post, idx) => (
                  <tr
                    key={post.id}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 accent-[#e8590c] cursor-pointer"
                        checked={selectedPostIds.includes(post.id)}
                        onChange={(e) => handleSelectPost(post.id, e.target.checked)}
                      />
                    </td>
                    <td className="px-3 py-4 text-[13.5px] text-gray-600 font-medium">
                      {(page - 1) * PER_PAGE + idx + 1}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1 max-w-[400px]">
                        <span className="text-[14px] font-bold text-gray-800 line-clamp-2 leading-snug">
                          {post.title}
                        </span>
                        <span className="text-[12.5px] text-gray-500 line-clamp-1">
                          {post.address || post.administrative_address}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-[12px] font-semibold whitespace-nowrap">
                        {post.project_type === "sell" ? "Bán" : "Cho thuê"}-
                        {post.json_category?.name || "Khác"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[13.5px] font-bold text-red-500 whitespace-nowrap">
                        {formatPrice(post.json_post_detail?.price)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-semibold whitespace-nowrap ${
                          post.post_status === "approved"
                            ? "bg-green-50 text-green-600"
                            : post.post_status === "pending"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-red-50 text-red-500"
                        }`}
                      >
                        {post.post_status === "approved"
                          ? "Đã duyệt"
                          : post.post_status === "pending"
                            ? "Chờ duyệt"
                            : "Bị từ chối"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[13px] text-gray-600 font-medium whitespace-nowrap">
                      {moment(post.created_at).fromNow()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {post.post_status !== "approved" && (
                          <button
                            title="Duyệt"
                            onClick={() =>
                              handleStatusChange(post.id, "approved")
                            }
                            className="w-[28px] h-[28px] rounded-md flex items-center justify-center bg-green-50 text-green-600 hover:bg-green-100 transition-colors border-none cursor-pointer"
                          >
                            <Check size={14} strokeWidth={2.5} />
                          </button>
                        )}
                        {post.post_status !== "pending" && (
                          <button
                            title="Chờ duyệt"
                            onClick={() =>
                              handleStatusChange(post.id, "pending")
                            }
                            className="w-[28px] h-[28px] rounded-md flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border-none cursor-pointer"
                          >
                            <Hourglass size={14} strokeWidth={2.5} />
                          </button>
                        )}
                        {post.post_status !== "rejected" && (
                          <button
                            title="Từ chối"
                            onClick={() =>
                              handleStatusChange(post.id, "rejected")
                            }
                            className="w-[28px] h-[28px] rounded-md flex items-center justify-center bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors border-none cursor-pointer"
                          >
                            <XIcon size={14} strokeWidth={2.5} />
                          </button>
                        )}
                        <button
                          title="Xóa"
                          onClick={() => handleDelete(post.id)}
                          className="w-[28px] h-[28px] rounded-md flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 transition-colors border-none cursor-pointer ml-1"
                        >
                          <Trash2 size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-center mt-auto">
            <div className="flex items-center gap-1.5">
              <button
                className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft size={16} />
              </button>

              {getPageNumbers().map((p, i) => (
                <button
                  key={i}
                  className={`min-w-[32px] h-8 px-2 flex items-center justify-center rounded-md text-[13.5px] font-semibold transition-colors ${
                    p === page
                      ? "bg-[#e8590c] text-white border border-[#e8590c]"
                      : p === "..."
                        ? "bg-transparent text-gray-400 cursor-default border-none"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 cursor-pointer"
                  }`}
                  onClick={() => p !== "..." && setPage(p as number)}
                  disabled={p === "..."}
                >
                  {p}
                </button>
              ))}

              <button
                className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>{confirmDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2">
            <button
              onClick={() =>
                setConfirmDialog((prev) => ({ ...prev, open: false }))
              }
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-[13.5px] font-semibold hover:bg-gray-200 transition-colors cursor-pointer border-none"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                confirmDialog.onConfirm();
                setConfirmDialog((prev) => ({ ...prev, open: false }));
              }}
              className="px-4 py-2.5 bg-[#e8590c] text-white rounded-lg text-[13.5px] font-semibold hover:bg-[#d14e0a] transition-colors cursor-pointer border-none ml-2"
            >
              Xác nhận
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPostPage;
