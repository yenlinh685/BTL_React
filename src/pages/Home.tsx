import { toast } from "sonner";

const HomePage = () => {
  return (
    <div>
      <h1 onClick={() => toast.success("Hello")}>Home Page</h1>
    </div>
  );
};

export default HomePage;
