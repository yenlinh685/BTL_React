import { useState } from "react";
import Popper from "~/components/Popper/Popper";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
interface PriceRangeFilterProps {
  setPriceRange: React.Dispatch<React.SetStateAction<string | null>>;
}
const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  setPriceRange,
}) => {
  const [selectedRange, setSelectedRange] = useState<string | null>(null);
  const range = [
    {
      label: "Giá dưới 1 tỷ",
      value: "0-1000000000",
    },
    {
      label: "Giá 1 - 2 tỷ",
      value: "1000000000-2000000000",
    },
    {
      label: "Giá 2 - 3 tỷ",
      value: "2000000000-3000000000",
    },
    {
      label: "Giá 3 - 5 tỷ",
      value: "3000000000-5000000000",
    },
    {
      label: "Giá 5 - 7 tỷ",
      value: "5000000000-7000000000",
    },
    {
      label: "Giá 7 - 10 tỷ",
      value: "7000000000-10000000000",
    },
    {
      label: "Giá 10 - 15 tỷ",
      value: "10000000000-15000000000",
    },
    {
      label: "Giá 15 - 20 tỷ",
      value: "15000000000-20000000000",
    },
    {
      label: "Giá 20 - 30 tỷ",
      value: "20000000000-30000000000",
    },
    {
      label: "Giá trên 30 tỷ",
      value: "30000000000",
    },
  ];
  return (
    <Popper>
      <p className="font-semibold ">Lọc theo khoảng giá</p>
      <Button
        variant="outline"
        className="w-full mt-2 flex justify-start font-normal"
        onClick={() => {
          setSelectedRange(null);
          setPriceRange(null);
        }}
      >
        Xóa lọc
      </Button>

      {range.map((item) => (
        <Button
          key={item.label}
          variant="outline"
          className={cn("w-full flex justify-start font-normal", {
            "text-primary hover:text-primary": selectedRange === item.label,
          })}
          onClick={() => {
            setSelectedRange(item.label);
            setPriceRange(item.value);
          }}
        >
          <p className="text-sm">{item.label}</p>
        </Button>
      ))}
    </Popper>
  );
};

export default PriceRangeFilter;
