import "moment/dist/locale/vi";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import App from "./App.tsx";
import GlobalStyles from "./components/GlobalStyles/GlobalStyles.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <GlobalStyles>
      <Toaster richColors />
      <App />
    </GlobalStyles>
  </BrowserRouter>,
);
