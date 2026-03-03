import { Link } from "react-router";
import { toast } from "sonner";

const HomePage = () => {
  return (
    <div>
      <h1 onClick={() => toast.success("Hello")}>Home Page</h1>

      <Link to="/auth">Auth</Link>
    </div>
  );
};

export default HomePage;
