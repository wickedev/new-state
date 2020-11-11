import React from "react";
// @ts-ignore
import { unstable_createRoot as createRoot } from "react-dom";
import "./index.css";
import { App } from "./components/App";
import reportWebVitals from "./reportWebVitals";

const rootElement = document.getElementById("root");

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
