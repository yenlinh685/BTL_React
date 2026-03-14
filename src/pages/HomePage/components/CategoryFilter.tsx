import Popper from "~/components/Popper/Popper";
import { use, useEffect, useState } from "react";
import { getCategories } from "~/services/categoryService";
import type { CategoryModel } from "~/types/categoryModel";
import { Button } from "~/components/ui/button";
interface CategoryFiterProps {
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}
const CategoryFilter: React.FC<CategoryFiterProps> = ({
  selectedCategory,
  setSelectedCategory,
}) => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);

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
          variant={selectedCategory === "" ? "default" : "secondary"}
          onClick={() => setSelectedCategory("")}
        >
          Bỏ lọc
        </Button>

        {categories.map((category) => (
          <Button
            className="ml-2"
            key={category.id}
            variant={
              category.name === selectedCategory ? "default" : "secondary"
            }
            onClick={() => setSelectedCategory(category.name)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </Popper>
  );
};

export default CategoryFilter;
