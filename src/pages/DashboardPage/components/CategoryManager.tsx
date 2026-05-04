import { useState, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { CategoryModel } from "~/types/categoryModel";
import * as categoryService from "~/services/categoryService";

interface CategoryManagerProps {
  categories: CategoryModel[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryModel[]>>;
  hasMore: boolean;
  loadMore: () => void;
  totalCategories: number;
}

const CategoryManager = ({
  categories,
  setCategories,
  hasMore,
  loadMore,
  totalCategories,
}: CategoryManagerProps) => {
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setName("");
    setKey("");
    setEditingId(null);
  }, []);

  const handleCreate = async () => {
    if (!name.trim() || !key.trim()) {
      toast.error("Vui lòng nhập đầy đủ tên danh mục và key");
      return;
    }
    setSubmitting(true);
    try {
      const res = await categoryService.createCategory({
        name: name.trim(),
        key: key.trim(),
      });
      setCategories((prev) => [res.data, ...prev]);
      resetForm();
      toast.success("Thêm danh mục thành công");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Thêm danh mục thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !name.trim() || !key.trim()) {
      toast.error("Vui lòng nhập đầy đủ tên danh mục và key");
      return;
    }
    setSubmitting(true);
    try {
      const res = await categoryService.updateCategory(editingId, {
        name: name.trim(),
        key: key.trim(),
      });
      setCategories((prev) =>
        prev.map((c) => (c.id === editingId ? res.data : c))
      );
      resetForm();
      toast.success("Cập nhật danh mục thành công");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Cập nhật danh mục thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      await categoryService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      if (editingId === id) resetForm();
      toast.success("Xóa danh mục thành công");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Xóa danh mục thất bại");
    }
  };

  const handleEdit = (cat: CategoryModel) => {
    setEditingId(cat.id);
    setName(cat.name);
    setKey(cat.key);
  };

  return (
    <div className="bg-white rounded-[14px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-gray-100 h-full flex flex-col">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Quản lí danh mục tin đăng
      </h2>

      {/* Form */}
      <div className="flex gap-3 mb-2.5">
        <input
          type="text"
          className="flex-1 py-2.5 px-3.5 border-[1.5px] border-gray-200 rounded-lg text-[13.5px] text-gray-800 bg-white transition-colors focus:border-[#e8590c] focus:outline-none focus:shadow-[0_0_0_3px_rgba(232,89,12,0.08)] placeholder:text-gray-400"
          placeholder="Tên danh mục"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="flex-1 py-2.5 px-3.5 border-[1.5px] border-gray-200 rounded-lg text-[13.5px] text-gray-800 bg-white transition-colors focus:border-[#e8590c] focus:outline-none focus:shadow-[0_0_0_3px_rgba(232,89,12,0.08)] placeholder:text-gray-400"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2.5 mb-[18px]">
        {editingId ? (
          <>
            <button
              className="py-2 px-[18px] rounded-lg text-[13.5px] font-semibold bg-gray-50 text-gray-500 border-[1.5px] border-gray-200 cursor-pointer transition-all hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={resetForm}
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              className="py-2 px-[18px] rounded-lg text-[13.5px] font-semibold bg-[#e8590c] text-white border-[1.5px] border-[#e8590c] cursor-pointer transition-all hover:bg-[#d14e0a] disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleUpdate}
              disabled={submitting}
            >
              {submitting ? "Đang xử lý..." : "Cập nhật"}
            </button>
          </>
        ) : (
          <>
            <button
              className="py-2 px-[18px] rounded-lg text-[13.5px] font-semibold bg-white text-[#e8590c] border-[1.5px] border-[#e8590c] cursor-pointer transition-all hover:bg-orange-50 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled
            >
              Cập nhật
            </button>
            <button
              className="py-2 px-[18px] rounded-lg text-[13.5px] font-semibold bg-[#e8590c] text-white border-[1.5px] border-[#e8590c] cursor-pointer transition-all hover:bg-[#d14e0a] disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleCreate}
              disabled={submitting}
            >
              {submitting ? "Đang xử lý..." : "Thêm danh mục"}
            </button>
          </>
        )}
      </div>

      {/* Category table with infinite scroll */}
      <div
        className="flex-1 overflow-y-auto max-h-[380px] rounded-lg [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded"
        id="categoryScrollContainer"
      >
        <InfiniteScroll
          dataLength={categories.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <div className="flex items-center justify-center gap-2 py-4 text-gray-500 text-[13px]">
              <div className="w-[18px] h-[18px] border-[2.5px] border-gray-200 border-t-[#e8590c] rounded-full animate-spin" />
              <span>Đang tải thêm...</span>
            </div>
          }
          scrollableTarget="categoryScrollContainer"
          endMessage={
            categories.length > 0 ? (
              <p className="text-center text-gray-400 text-[12.5px] pt-3 pb-1">
                Đã hiển thị tất cả {totalCategories} danh mục
              </p>
            ) : null
          }
        >
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-[2] bg-white">
              <tr className="border-b-2 border-gray-200">
                <th className="text-[13px] font-bold text-gray-600 py-3 px-3.5 text-left">
                  Tên danh mục
                </th>
                <th className="text-[13px] font-bold text-gray-600 py-3 px-3.5 text-center">
                  Key
                </th>
                <th className="text-[13px] font-bold text-gray-600 py-3 px-3.5 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center text-gray-400 py-8 px-3.5 text-sm"
                  >
                    Chưa có danh mục nào
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className={`hover:bg-gray-50 ${
                      editingId === cat.id ? "bg-orange-50" : ""
                    }`}
                  >
                    <td className="text-[13.5px] py-3 px-3.5 text-left font-semibold text-gray-800 border-b border-gray-100">
                      {cat.name}
                    </td>
                    <td className="text-[13.5px] py-3 px-3.5 text-center text-gray-500 border-b border-gray-100">
                      {cat.key}
                    </td>
                    <td className="text-[13.5px] py-3 px-3.5 border-b border-gray-100">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          className="w-8 h-8 rounded-[7px] flex items-center justify-center bg-blue-50 text-blue-600 cursor-pointer transition-all hover:bg-blue-200 border-none"
                          onClick={() => handleEdit(cat)}
                          title="Sửa"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="w-8 h-8 rounded-[7px] flex items-center justify-center bg-red-50 text-red-500 cursor-pointer transition-all hover:bg-red-200 border-none"
                          onClick={() => handleDelete(cat.id)}
                          title="Xóa"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default CategoryManager;
