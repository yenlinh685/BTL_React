import { Outlet } from "react-router";
const AuthLayout = () => {
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-12 sm:col-span-6 p-8 flex flex-col items-center">
        <Outlet />
      </div>
      <div className="col-span-6 hidden sm:block">
        <img
          className="w-full select-none h-full max-h-dvh object-cover rounded-bl-3xl rounded-tl-3xl"
          src="https://i.pinimg.com/736x/d5/78/f2/d578f20350da4ed6b84c1d4824ee2ca7.jpg"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
