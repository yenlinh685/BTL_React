import { useEffect } from "react";
import AppRoutes from "./components/AppRoutes";
import * as meService from "./services/meService";
import useCurrentUser from "./zustand/useCurrentUser";

export function App() {
  const setUser = useCurrentUser((state) => state.setUser);

  useEffect(() => {
    const getCurrentUser = async () => {
      const response = await meService.getCurrentUser();
      setUser(response.data);
    };
    getCurrentUser();
  }, [setUser]);

  return <AppRoutes />;
}

export default App;
