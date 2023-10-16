import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import { ConfigProvider } from "antd";
import App from "./App.tsx";
import { appDependencies } from "./appDependencies.ts";
import { RouteProvider } from "./router";
import { createStore } from "./store.ts";
startReactDsfr({ defaultColorScheme: "system" });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvider store={createStore(appDependencies)}>
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
    </ReduxProvider>
  </React.StrictMode>,
);
