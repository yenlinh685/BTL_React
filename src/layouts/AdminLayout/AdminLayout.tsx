import { NavLink, Navigate, Outlet } from "react-router";
import {
  LayoutDashboard,
  FileText,
  FileSignature,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import useCurrentUser from "~/zustand/useCurrentUser";

const menuItems = [
  { label: "Trang chủ", path: "/admin", icon: LayoutDashboard, end: true },
  { label: "Tin đăng", path: "/admin/posts", icon: FileText, end: false },
  {
    label: "Hợp đồng",
    path: "/admin/contracts",
    icon: FileSignature,
    end: false,
  },
];

const AdminLayout = () => {
  const user = useCurrentUser((state) => state.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // // Redirect if not logged in or not admin
  // if (!user || user.role !== "admin") {
  //   return <Navigate to="/" replace />;
  // }

  return (
    <div className="flex min-h-screen bg-[#f5f6fa]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-[220px] bg-white border-r border-gray-100 flex flex-col fixed top-0 left-0 bottom-0 z-[100] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="px-5 pt-[22px] pb-[18px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-[#ff7e5f] to-[#feb47b] flex items-center justify-center text-xl shadow-[0_2px_8px_rgba(255,126,95,0.25)]">
              🏠
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[15px] text-gray-800 leading-tight">
                Real Estate
              </span>
              <span className="text-[11px] text-gray-400 font-medium">
                Bảng quản trị
              </span>
            </div>
          </div>
          <button
            className="hidden md:hidden p-1 rounded-md text-gray-400 hover:bg-gray-100 transition-colors max-md:block"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col px-3 gap-0.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 py-[11px] px-[14px] rounded-lg text-sm font-medium no-underline transition-all duration-150 relative ${
                  isActive
                    ? "text-[#e8590c] bg-orange-50 font-semibold before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3.5px] before:h-[22px] before:rounded-r-[3px] before:bg-[#e8590c]"
                    : "text-gray-600 hover:bg-orange-50 hover:text-[#e8590c]"
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-0 md:ml-[220px] px-4 md:px-8 pt-[18px] md:pt-7 pb-8 md:pb-10 min-h-screen">
        {/* Mobile header */}
        <button
          className="md:hidden inline-flex bg-white border border-gray-200 rounded-lg px-2.5 py-2 text-gray-600 mb-4 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={22} />
        </button>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
