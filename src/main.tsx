import * as React from "react";
import { createRoot } from "react-dom/client";
import "./app.css";
import App from "./components/App";


createRoot(document.getElementById("app")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);