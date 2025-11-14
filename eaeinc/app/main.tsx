import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./page";

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Home />
    </React.StrictMode>
  );
} else {
  console.error("ERROR: ROOT NOT FOUND");
}
