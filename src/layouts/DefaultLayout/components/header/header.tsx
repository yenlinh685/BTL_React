import { Input } from "~/components/ui/input";
import Interaction from "./components/interaction";
import Location from "./components/locations";

const Header = () => {
  return (
    <div className="py-2 px-8 border-b border-gray-200 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <img className="w-10 h-10" src="/logo.png" alt="logo" />
        <Location />
      </div>

      <div className="flex-1 flex justify-center min-w-0 mx-2">
        <Input
          className="w-full max-w-125"
          placeholder="Tìm kiếm bất động sản"
        />
      </div>

      <Interaction />
    </div>
  );
};

export default Header;
