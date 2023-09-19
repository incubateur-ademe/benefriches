import { ConfigProvider } from "antd";
import React from "react";
import ReactDOM from "react-dom/client";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";

import App from "./App.tsx";
import { RouteProvider } from "./router";
startReactDsfr({ defaultColorScheme: "system" });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouteProvider>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "inherit",
          },
        }}
      >
        <App />
      </ConfigProvider>
    </RouteProvider>
  </React.StrictMode>,
);
