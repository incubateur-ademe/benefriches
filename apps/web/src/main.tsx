import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import { ConfigProvider as AntdConfigProvider } from "antd";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";

import "./main.css";
import { appDependencies } from "./shared/core/store-config/appDependencies.ts";
import { createStore } from "./shared/core/store-config/store.ts";
import App from "./shared/views/App.tsx";
import { theme } from "./shared/views/antdConfig.ts";
import { RouteProvider } from "./shared/views/router.ts";

startReactDsfr({ defaultColorScheme: "system" });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvider store={createStore(appDependencies)}>
      <RouteProvider>
        <AntdConfigProvider theme={theme}>
          <App />
        </AntdConfigProvider>
      </RouteProvider>
    </ReduxProvider>
  </React.StrictMode>,
);
