import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import React from "react";
import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { createRouter, defineRoute, param } from "type-route";

import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import QuickImpactsEmbedView from "./features/projects/views/quick-impacts-embed-view/index.tsx";
import "./main.css";
import { appDependencies } from "./shared/core/store-config/appDependencies.ts";
import { createStore } from "./shared/core/store-config/store.ts";

startReactDsfr({ defaultColorScheme: "system" });

const embedRoutes = createRouter({
  quickImpactsUrbanProject: defineRoute(
    {
      siteSurfaceArea: param.query.number,
      siteCityCode: param.query.string,
    },
    () => `/embed/calcul-rapide-impacts-projet-urbain`,
  ),
});

export default function EmbedApp() {
  const route = embedRoutes.useRoute();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {(() => {
        switch (route.name) {
          case embedRoutes.routes.quickImpactsUrbanProject.name:
            return <QuickImpactsEmbedView {...route.params} />;
          // 404
          default:
            return <p>Page non accessible en iframe</p>;
        }
      })()}
    </Suspense>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvider store={createStore(appDependencies)}>
      <embedRoutes.RouteProvider>
        <EmbedApp />
      </embedRoutes.RouteProvider>
    </ReduxProvider>
  </React.StrictMode>,
);
