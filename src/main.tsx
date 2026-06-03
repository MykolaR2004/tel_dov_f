import * as React from "react";
import '@fontsource/montserrat/400.css'; // Regular
import '@fontsource/montserrat/500.css'; // Medium
import '@fontsource/montserrat/600.css'; // SemiBold
import '@fontsource/montserrat/700.css'; // Bold
import { createRoot } from "react-dom/client";
import "./app.css";
import App from "./components/App";


createRoot(document.getElementById("app")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);