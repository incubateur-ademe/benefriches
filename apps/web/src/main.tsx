import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";

import App from "./app/App.tsx";
import { RouteProvider } from "./app/router.ts";
import { appDependencies } from "./app/store/appDependencies.ts";
import { createStore } from "./app/store/store.ts";

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
