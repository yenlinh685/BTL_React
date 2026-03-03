import { useEffect } from "react";
import AppRoutes from "./components/AppRoutes";
import * as meService from "./services/meService";
import { useAppDispatch } from "./redux/hooks";
import { setCurrentUser } from "./redux/reducers/userSlice";

export function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getCurrentUser = async () => {
      const response = await meService.getCurrentUser();
      dispatch(setCurrentUser(response));
    };
    getCurrentUser();
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
