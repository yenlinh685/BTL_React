import type { LocationAnalytics } from "~/services/analyticsService";

interface LocationStatsProps {
  data: LocationAnalytics[];
  loading: boolean;
}

const LocationStats = ({ data, loading }: LocationStatsProps) => {
  return (
    <div className="bg-white rounded-[14px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-gray-100 h-full flex flex-col">
      <h2 className="text-lg font-bold text-gray-800 mb-[18px] text-center">
        Thống kê theo vị trí
      </h2>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-[#e8590c]">
              <th className="text-[11.5px] font-bold text-[#4a6fa5] uppercase py-2.5 px-3 text-center tracking-wide whitespace-nowrap">
                TỈNH THÀNH
              </th>
              <th className="text-[11.5px] font-bold text-[#4a6fa5] uppercase py-2.5 px-3 text-center tracking-wide whitespace-nowrap">
                SỐ TIN ĐĂNG
              </th>
              <th className="text-[11.5px] font-bold text-[#4a6fa5] uppercase py-2.5 px-3 text-center tracking-wide whitespace-nowrap">
                TĂNG TRƯỞNG
              </th>
              <th className="text-[11.5px] font-bold text-[#4a6fa5] uppercase py-2.5 px-3 text-center tracking-wide whitespace-nowrap">
                TỶ LỆ
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center text-gray-400 py-8 px-3 text-sm">
                  <div className="flex items-center justify-center gap-2.5">
                    <div className="w-[18px] h-[18px] border-[2.5px] border-gray-200 border-t-[#e8590c] rounded-full animate-spin" />
                    <span>Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-gray-400 py-8 px-3 text-sm">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              data.map((item, idx) => {
                const isPositive = item.growth_rate >= 0;
                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="text-[13.5px] py-3 px-3 text-left font-semibold text-gray-800 border-b border-gray-100">
                      {item.address}
                    </td>
                    <td className="text-[13.5px] py-3 px-3 text-center text-gray-600 border-b border-gray-100">
                      {item.post_count}
                    </td>
                    <td className="text-[13.5px] py-3 px-3 text-center border-b border-gray-100">
                      <span
                        className={`text-xs font-semibold py-[3px] px-2 rounded-md inline-block ${
                          isPositive
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        {isPositive ? "↑" : "↓"}{" "}
                        {Math.abs(Math.round(item.growth_rate))}%
                      </span>
                    </td>
                    <td className="text-[13.5px] py-3 px-3 text-center text-gray-600 border-b border-gray-100">
                      {(item.percentage * 100).toFixed(1)}%
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocationStats;
