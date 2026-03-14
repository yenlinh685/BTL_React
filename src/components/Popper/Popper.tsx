import { cn } from "~/lib/utils";
interface PopperProps {
  children: React.ReactNode;
  className?: string;
}
const Popper: React.FC<PopperProps> = ({ children, className }) => {
  return (
    <div className={cn("p-4 rounded-md shadow-md bg-white", className)}>
      {children}
    </div>
  );
};

export default Popper;
