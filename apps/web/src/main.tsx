import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import { ConfigProvider } from "antd";
import { store } from "./store/store.ts";
import App from "./App.tsx";
import { RouteProvider } from "./router";
startReactDsfr({ defaultColorScheme: "system" });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
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
