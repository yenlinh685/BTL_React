import { Input } from "~/components/ui/input";
import Interaction from "./components/interaction";
import Location from "./components/locations";
import Search from "./components/search";

const Header = () => {
  return (
    <div className="py-2 px-8 border-b border-gray-200 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <img className="w-10 h-10" src="/logo.png" alt="logo" />
        <Location />
      </div>

      <Search />

      <Interaction />
    </div>
  );
};

export default Header;
