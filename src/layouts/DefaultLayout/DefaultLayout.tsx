import { Outlet } from "react-router";
import Header from "./components/header/header";

const DefaultLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <footer> footer</footer>
    </div>
  );
};

export default DefaultLayout;
