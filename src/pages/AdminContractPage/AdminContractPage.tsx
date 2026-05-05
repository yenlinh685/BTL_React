import { useEffect, useState, useCallback } from "react";
import {
  Search,
  RotateCcw,
  FileText,
  Download,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  DollarSign,
  FileCheck
} from "lucide-react";
import { toast } from "sonner";
import useCurrentUser from "~/zustand/useCurrentUser";
import moment from "moment";

import type { ContractModel, ContractSummary } from "~/services/contractService";
import * as contractService from "~/services/contractService";

moment.locale("vi");

const PER_PAGE = 10;

const AdminContractPage = () => {
  const user = useCurrentUser((state) => state.user);

  // States for filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [page, setPage] = useState(1);

  // States for data
  const [contracts, setContracts] = useState<ContractModel[]>([]);
  const [totalContracts, setTotalContracts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Summary stats
  const [summary, setSummary] = useState<ContractSummary | null>(null);

  // Fetch summary
  const fetchSummary = useCallback(async () => {
    try {
      const res = await contractService.getContractsSummary();
      setSummary(res.data);
    } catch (e) {
      // ignore
    }
  }, []);

  // Fetch contracts
  const fetchContracts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await contractService.getContracts({
        page,
        per_page: PER_PAGE,
        q: q || undefined,
        status: status || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setContracts(res.data);
      setTotalContracts(res.meta.pagination.total);
      setTotalPages(res.meta.pagination.total_pages);
    } catch (err) {
      toast.error("Lấy danh sách hợp đồng thất bại");
    } finally {
      setLoading(false);
    }
  }, [page, q, status, startDate, endDate]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const handleFilter = () => {
    setPage(1);
    fetchContracts();
  };

  const handleReset = () => {
    setQ("");
    setStatus("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handleExportCsv = async () => {
    try {
      toast.loading("Đang xuất file CSV...", { id: "export-csv" });
      await contractService.exportContractsCsv({
        q: q || undefined,
        status: status || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      toast.success("Xuất CSV thành công", { id: "export-csv" });
    } catch (error) {
      toast.error("Lỗi khi xuất CSV", { id: "export-csv" });
    }
  };

  const formatPrice = (price?: string | number | null) => {
    if (price === null || price === undefined) return "Thỏa thuận";
    const p = Number(price);
    if (isNaN(p)) return price;
    return `${p.toLocaleString("vi-VN")} ₫`;
  };

  const getStatusBadge = (contractStatus: string) => {
    switch (contractStatus) {
      case "approved":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold bg-green-100 text-green-700">Đã ký</span>;
      case "pending":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold bg-amber-100 text-amber-700">Đang chờ</span>;
      case "rejected":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold bg-gray-200 text-gray-700">Đã hủy</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold bg-gray-100 text-gray-600">{contractStatus}</span>;
    }
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
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
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
        <div>
          <h1 className="text-[22px] font-bold text-[#e8590c] m-0">Quản lý Hợp đồng</h1>
          <span className="text-[13px] text-gray-500">Xem, lọc, quản lý trạng thái hợp đồng</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 min-w-[280px] relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Tìm nhanh (tên khách, môi giới, BĐS)"
              className="w-full py-2 pl-10 pr-4 text-[13.5px] bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-gray-300 transition-all"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
            />
          </div>
          <div className="flex items-center gap-3 ml-4">
            <span className="text-[14px] font-medium text-gray-600">
              Xin chào, {user?.nickname || "Admin"}
            </span>
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              {user?.nickname?.charAt(0).toUpperCase() || "A"}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Actions Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-[14px] shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-gray-100">
          <select
            className="min-w-[160px] py-2 px-3 text-[13px] border border-gray-200 rounded-md outline-none bg-white text-gray-700 cursor-pointer"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">– Tất cả trạng thái –</option>
            <option value="approved">Đã ký</option>
            <option value="pending">Đang chờ</option>
            <option value="rejected">Đã hủy</option>
          </select>
          
          <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white">
            <input
              type="date"
              className="py-2 px-3 text-[13px] outline-none text-gray-700"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white">
            <input
              type="date"
              className="py-2 px-3 text-[13px] outline-none text-gray-700"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          
          <input
            type="text"
            placeholder="Tìm theo tên khách/môi giới/bđs"
            className="w-[240px] py-2 px-3 text-[13px] border border-gray-200 rounded-md outline-none bg-white"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <button
            className="flex items-center justify-center py-2 px-4 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-md text-[13px] font-medium transition-all cursor-pointer bg-white"
            onClick={handleFilter}
          >
            Lọc
          </button>
          
          <button
            className="flex items-center justify-center py-2 px-4 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-md text-[13px] font-medium transition-all cursor-pointer bg-white"
            onClick={handleReset}
          >
            Đặt lại
          </button>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center justify-center gap-2 py-2.5 px-5 bg-[#e8590c] hover:bg-[#d14e0a] text-white rounded-[10px] text-[13.5px] font-semibold transition-all cursor-pointer border-none shadow-sm">
            <FileText size={16} /> Tạo hợp đồng (mẫu)
          </button>
          <button 
            className="flex items-center justify-center gap-2 py-2.5 px-5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-[10px] text-[13.5px] font-semibold transition-all cursor-pointer shadow-sm"
            onClick={handleExportCsv}
          >
            Xuất CSV
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-gray-100">
          <div className="flex flex-col">
            <span className="text-[14px] text-gray-500 font-medium mb-2">Tổng hợp đồng đã ký</span>
            <span className="text-[26px] font-bold text-[#e8590c]">{summary?.total_signed || 0}</span>
          </div>
        </div>

        <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-gray-100">
          <div className="flex flex-col">
            <span className="text-[14px] text-gray-500 font-medium mb-2">Tổng giá trị</span>
            <span className="text-[26px] font-bold text-[#e8590c]">{formatPrice(summary?.total_amount)}</span>
          </div>
        </div>

        <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-gray-100">
          <div className="flex flex-col">
            <span className="text-[14px] text-gray-500 font-medium mb-2">Tổng hoa hồng</span>
            <span className="text-[26px] font-bold text-[#e8590c]">{formatPrice(summary?.total_commission)}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-gray-100 rounded-[14px] flex-1 flex flex-col overflow-hidden mb-6">
        <div className="overflow-x-auto w-full max-w-full">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="px-5 py-4 text-left text-[13px] font-bold text-gray-700">STT</th>
                <th className="px-5 py-4 text-left text-[13px] font-bold text-gray-700 min-w-[200px]">Bất động sản</th>
                <th className="px-5 py-4 text-left text-[13px] font-bold text-gray-700">Người mua</th>
                <th className="px-5 py-4 text-left text-[13px] font-bold text-gray-700">Nhân viên môi giới</th>
                <th className="px-5 py-4 text-left text-[13px] font-bold text-gray-700">Giá trị</th>
                <th className="px-5 py-4 text-left text-[13px] font-bold text-gray-700">Hoa hồng</th>
                <th className="px-5 py-4 text-left text-[13px] font-bold text-gray-700">Ngày bắt đầu</th>
                <th className="px-5 py-4 text-left text-[13px] font-bold text-gray-700">Trạng thái</th>
                <th className="px-5 py-4 text-center text-[13px] font-bold text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-gray-200 border-t-[#e8590c] rounded-full animate-spin" />
                      <span className="text-[14px] font-medium">Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : contracts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-500 text-[14px]">
                    Không tìm thấy hợp đồng nào
                  </td>
                </tr>
              ) : (
                contracts.map((contract, idx) => (
                  <tr key={contract.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 text-[13.5px] text-gray-700 font-semibold">
                      {(page - 1) * PER_PAGE + idx + 1}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[13.5px] font-medium text-gray-800 line-clamp-2 leading-snug">
                        {contract.post?.title || "N/A"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[13.5px] text-gray-700 whitespace-nowrap">
                        {contract.customer?.full_name || "N/A"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[13.5px] text-gray-700 whitespace-nowrap">
                        {contract.agent?.full_name || "N/A"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[13.5px] font-semibold text-gray-800 whitespace-nowrap">
                        {formatPrice(contract.amount)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[13.5px] font-semibold text-gray-800 whitespace-nowrap">
                        {formatPrice(contract.commission)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-500 whitespace-nowrap">
                      {contract.created_at ? moment(contract.created_at).format("YYYY-MM-DD") : "N/A"}
                    </td>
                    <td className="px-5 py-4">
                      {getStatusBadge(contract.status)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          title="Xem chi tiết"
                          className="flex items-center gap-1.5 py-1.5 px-3 border border-gray-200 rounded-md text-[12px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer bg-white shadow-sm"
                        >
                          Xem
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
    </div>
  );
};

export default AdminContractPage;
