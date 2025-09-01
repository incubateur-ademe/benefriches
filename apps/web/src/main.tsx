import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";

import { appDependencies } from "./shared/core/store-config/appDependencies.ts";
import { createStore } from "./shared/core/store-config/store.ts";
import App from "./shared/views/App.tsx";
import { RouteProvider } from "./shared/views/router.ts";

startReactDsfr({ defaultColorScheme: "system" });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvider store={createStore(appDependencies)}>
      <RouteProvider>
        <App />
      </RouteProvider>
    </ReduxProvider>
  </React.StrictMode>,
);
