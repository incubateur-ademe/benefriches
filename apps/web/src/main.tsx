import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import { ConfigProvider as AntdConfigProvider } from "antd";
import { appDependencies } from "./app/application/appDependencies.ts";
import { createStore } from "./app/application/store.ts";
import { theme } from "./app/views/antdConfig.ts";
import App from "./app/views/App.tsx";
import { RouteProvider } from "./app/views/router.ts";

startReactDsfr({ defaultColorScheme: "system" });

import "./main.css";

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
