import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { init } from "./app/util/helper.ts";
import { ErrorBoundary } from "react-error-boundary";
import PageError from "./components/organism/PageError";
import "./assets/scss/app.scss";

init();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={PageError}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
