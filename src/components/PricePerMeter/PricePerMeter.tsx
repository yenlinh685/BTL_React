import { cn } from "~/lib/utils";

interface PricePerMeterProps {
  price: number;
  area: number;
  className?: string;
}
const PricePerMeter: React.FC<PricePerMeterProps> = ({
  price,
  area,
  className,
}) => {
  const formatVNPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;

    const billion = 1000000000;
    const million = 1000000;

    if (numPrice >= billion) {
      const billions = numPrice / billion;

      if (billions % 1 === 0) {
        return `${billions.toFixed(2)} tỷ`;
      }

      return `${billions.toFixed(1)} tỷ`;
    } else {
      const millions = numPrice / million;

      return `${millions.toFixed(2)} triệu`;
    }
  };

  const calculatePricePerM2 = (
    totalPrice: number | string,
    area: number | string,
  ) => {
    const numPrice =
      typeof totalPrice === "string" ? parseFloat(totalPrice) : totalPrice;
    const numArea = typeof area === "string" ? parseFloat(area) : area;

    const pricePerM2 = numPrice / numArea;

    return formatVNPrice(pricePerM2);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 text-sm text-muted-foreground",
        className,
      )}
    >
      <span className="text-base font-bold text-red-500">
        {formatVNPrice(price)}
      </span>
      <span className="text-xs mt-0.5">
        {" "}
        {calculatePricePerM2(price, area).replace("triệu", "tr")}/m²
      </span>
      <span className="text-xs mt-0.5">{area} m²</span>
    </div>
  );
};

export default PricePerMeter;
