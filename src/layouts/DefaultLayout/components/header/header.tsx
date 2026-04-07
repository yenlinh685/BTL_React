import { Menu } from "lucide-react";
import { Link } from "react-router";
import MobileSidebar from "~/components/mobileSidebar/mobileSidebar";
import { Button } from "~/components/ui/button";
import { sendEvent } from "~/utils/event";
import Location from "../../../../components/Location/locations";
import Interaction from "./components/interaction";
import Search from "./components/search";

const Header = () => {
  return (
    <div className="py-2 px-8 border-b border-gray-200 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link to={"/"}>
          <img
            className="w-10 h-10 hidden md:block"
            src="/logo.png"
            alt="logo"
          />
        </Link>
        <Button
          variant="ghost"
          size={"icon"}
          onClick={() => {
            sendEvent("sidebar:toggle");
          }}
        >
          <Menu className="block md:hidden" />
        </Button>
        <Location />
      </div>

      <Search />
      {<MobileSidebar />}

      <Interaction />
    </div>
  );
};

export default Header;
