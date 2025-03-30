import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // <-- Add this import
import "./index.css";
import App from "./App.jsx";
import { Provider } from 'react-redux'
import { appStore } from "./app/store";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode> {/* <-- Wrap with StrictMode for better debugging */}
    <BrowserRouter>
      <Provider store={appStore}>
        <App />
        <Toaster/>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
