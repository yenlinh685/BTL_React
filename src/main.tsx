import { createRoot } from "react-dom/client";
import "moment/dist/locale/vi";
import App from "./App.tsx";
import GlobalStyles from "./components/GlobalStyles/GlobalStyles.tsx";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <GlobalStyles>
      <Provider store={store}>
        <Toaster richColors />
        <App />
      </Provider>
    </GlobalStyles>
  </BrowserRouter>,
);
