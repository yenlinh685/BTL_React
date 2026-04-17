import Popper from "~/components/Popper/Popper";
import { useEffect, useState } from "react";
import { getCategories } from "~/services/categoryService";
import type { CategoryModel } from "~/types/categoryModel";
import { Button } from "~/components/ui/button";
import { sendEvent } from "~/utils/event";

const CategoryFilter: React.FC = () => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  useEffect(() => {
    sendEvent("categoryChanged", selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  return (
    <Popper className="container xl:max-w-7xl mx-auto">
      <div>
        <h3 className="font-medium mb-4">Mua bán bất động sản giá tốt</h3>
        <Button
          variant={selectedCategory === undefined ? "default" : "secondary"}
          onClick={() => setSelectedCategory(undefined)}
        >
          Bỏ lọc
        </Button>

        {categories.map((category) => (
          <Button
            className="ml-2"
            key={category.id}
            variant={
              category.key === selectedCategory ? "default" : "secondary"
            }
            onClick={() => setSelectedCategory(category.key)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </Popper>
  );
};

export default CategoryFilter;
