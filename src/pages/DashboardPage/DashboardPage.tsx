import { useEffect, useState, useCallback } from "react";
import { Filter, FileText, CheckCircle, Clock, Users } from "lucide-react";
import StatCard from "./components/StatCard";
import LocationStats from "./components/LocationStats";
import CategoryManager from "./components/CategoryManager";
import type {
  OverviewData,
  LocationAnalytics,
} from "~/services/analyticsService";
import * as analyticsService from "~/services/analyticsService";
import * as categoryService from "~/services/categoryService";
import type { CategoryModel } from "~/types/categoryModel";

const CATEGORIES_PER_PAGE = 5;

const DashboardPage = () => {
  // Date filters
  const [startDate, setStartDate] = useState("2020-04-01");
  const [endDate, setEndDate] = useState("2026-05-04");

  // Overview
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);

  // Location stats
  const [locationData, setLocationData] = useState<LocationAnalytics[]>([]);
  const [locationLoading, setLocationLoading] = useState(true);

  // Categories
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [categoryPage, setCategoryPage] = useState(1);
  const [hasMoreCategories, setHasMoreCategories] = useState(true);
  const [totalCategories, setTotalCategories] = useState(0);

  // Fetch overview
  const fetchOverview = useCallback(async () => {
    setOverviewLoading(true);
    try {
      const res = await analyticsService.getOverview(startDate, endDate);
      setOverview(res.data);
    } catch {
      setOverview(null);
    } finally {
      setOverviewLoading(false);
    }
  }, [startDate, endDate]);

  // Fetch location stats
  const fetchLocation = useCallback(async () => {
    setLocationLoading(true);
    try {
      const res = await analyticsService.getPostsLocation(
        startDate,
        endDate,
        10,
      );
      setLocationData(res.data);
    } catch {
      setLocationData([]);
    } finally {
      setLocationLoading(false);
    }
  }, [startDate, endDate]);

  // Fetch categories (page 1)
  const fetchCategoriesPage1 = useCallback(async () => {
    try {
      const res = await categoryService.getCategories(1, CATEGORIES_PER_PAGE);
      setCategories(res.data);
      setTotalCategories(res.meta.pagination.total);
      setCategoryPage(1);
      setHasMoreCategories(1 < res.meta.pagination.total_pages);
    } catch {
      setCategories([]);
      setHasMoreCategories(false);
    }
  }, []);

  // Load more categories
  const loadMoreCategories = useCallback(async () => {
    const nextPage = categoryPage + 1;
    try {
      const res = await categoryService.getCategories(
        nextPage,
        CATEGORIES_PER_PAGE,
      );
      setCategories((prev) => [...prev, ...res.data]);
      setCategoryPage(nextPage);
      setTotalCategories(res.meta.pagination.total);
      setHasMoreCategories(nextPage < res.meta.pagination.total_pages);
    } catch {
      setHasMoreCategories(false);
    }
  }, [categoryPage]);

  // Initial load
  useEffect(() => {
    fetchOverview();
    fetchLocation();
    fetchCategoriesPage1();
  }, [fetchCategoriesPage1, fetchLocation, fetchOverview]);

  // Filter handler
  const handleFilter = () => {
    fetchOverview();
    fetchLocation();
  };

  return (
    <div className="max-w-300 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <h1 className="text-[28px] font-extrabold text-gray-800 m-0">
          Dashboard
        </h1>
        <div className="flex items-end gap-3.5 flex-wrap">
          <label className="flex flex-col gap-1 text-xs font-semibold text-gray-500">
            Từ ngày
            <input
              type="date"
              className="py-2 px-3 border-[1.5px] border-gray-200 rounded-lg text-[13px] text-gray-800 bg-white cursor-pointer transition-colors focus:border-[#e8590c] focus:outline-none"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-gray-500">
            Đến ngày
            <input
              type="date"
              className="py-2 px-3 border-[1.5px] border-gray-200 rounded-lg text-[13px] text-gray-800 bg-white cursor-pointer transition-colors focus:border-[#e8590c] focus:outline-none"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          <button
            className="flex items-center gap-1.5 py-2.25 px-5 bg-linear-to-br from-[#e8590c] to-[#f76707] text-white border-none rounded-lg text-[13.5px] font-semibold cursor-pointer transition-all shadow-[0_2px_8px_rgba(232,89,12,0.2)] hover:shadow-[0_4px_14px_rgba(232,89,12,0.3)] hover:-translate-y-px"
            onClick={handleFilter}
          >
            <Filter size={15} />
            Lọc
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<FileText size={22} />}
          label="Tổng tin đăng"
          value={overview?.total_post ?? 0}
          growth={overview?.total_posts_growth_percent ?? 0}
          colorClass="orange"
        />
        <StatCard
          icon={<CheckCircle size={22} />}
          label="Tin đã duyệt"
          value={overview?.approved_posts ?? 0}
          growth={overview?.approved_posts_growth_percent ?? 0}
          colorClass="green"
        />
        <StatCard
          icon={<Clock size={22} />}
          label="Chờ duyệt"
          value={overview?.pending_posts ?? 0}
          growth={overview?.pending_posts_growth_percent ?? 0}
          colorClass="yellow"
        />
        <StatCard
          icon={<Users size={22} />}
          label="Người dùng"
          value={overview?.users ?? 0}
          growth={overview?.users_growth_percent ?? 0}
          colorClass="blue"
        />
      </div>

      {/* Bottom row: Location stats + Category manager */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="min-w-0">
          <LocationStats data={locationData} loading={locationLoading} />
        </div>
        <div className="min-w-0">
          <CategoryManager
            categories={categories}
            setCategories={setCategories}
            hasMore={hasMoreCategories}
            loadMore={loadMoreCategories}
            totalCategories={totalCategories}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
