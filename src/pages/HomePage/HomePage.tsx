import { useState } from "react";
import Popper from "~/components/Popper/Popper";
import PostList from "~/components/postList/postList";
import CategoryFilter from "./components/CategoryFilter";
import PriceRangeFilter from "./components/PriceRangeFilter";

const HomePage = () => {
  return (
    <div className="py-5 ">
      <CategoryFilter></CategoryFilter>
      <div className="grid grid-cols-12 gap-3 container xl:max-w-7xl mx-auto mt-5">
        <Popper className="col-span-12 md:col-span-8 order-2 md:order-1">
          <PostList />
        </Popper>
        <div className="col-span-12 md:col-span-4 order-1 md:order-2">
          <PriceRangeFilter></PriceRangeFilter>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
