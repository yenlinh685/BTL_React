import { Outlet } from "react-router";

const DefaultLayout = () => {
  return (
    <div>
      <header> header</header>
      <Outlet />
      <footer> footer</footer>
    </div>
  );
};

export default DefaultLayout;
