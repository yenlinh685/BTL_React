import { useEffect, useState } from "react";
import { Link } from "react-router";

const HomePage = () => {
  const [count, setCount] = useState();

  useEffect(() => {
    if (count) {
    }
  }, []);

  return (
    <div>
      <h1>Home Page</h1>

      <Link to="/auth">Auth</Link>
    </div>
  );
};

export default HomePage;
