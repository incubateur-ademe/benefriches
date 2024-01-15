import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import { ConfigProvider as AntdConfigProvider } from "antd";
import "./main.css";
import { theme } from "./antdConfig";
import App from "./App.tsx";
import { appDependencies } from "./appDependencies.ts";
import { RouteProvider } from "./router";
import { createStore } from "./store.ts";
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
