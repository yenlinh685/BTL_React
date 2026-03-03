import { useState } from "react";
import { Input } from "~/components/ui/input";
import Interaction from "./components/interaction";
interface location {
  province: string;
  district: string;
  ward: string;
}
const Header = () => {
  const [location, setLocation] = useState<location>({
    province: "",
    district: "",
    ward: "",
  });
  return (
    <div className="py-2 px-8 border-b border-gray-200 flex justify-between items-center">
      <div className="flex items-center gap-5">
        <img className="w-10 h-10" src="/logo.png" alt="logo" />
        <div className="bg-primary/20 rounded-full px-4 py-2">
          {location.province ? (
            <span>{location.province}</span>
          ) : (
            <span>Chọn vị trí</span>
          )}
        </div>
      </div>

      <Input
        className="max-w-[500px] py-4"
        placeholder="Tìm kiếm bất động sản"
      />

      <Interaction />
    </div>
  );
};

export default Header;
