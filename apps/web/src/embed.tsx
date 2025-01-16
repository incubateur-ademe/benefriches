import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import { ConfigProvider as AntdConfigProvider } from "antd";
import React from "react";
import { lazy, Suspense, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { createRouter, defineRoute, param } from "type-route";

import { initCurrentUser } from "@/features/onboarding/core/initCurrentUser.action.ts";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import "./main.css";
import { appDependencies } from "./shared/core/store-config/appDependencies.ts";
import { createStore } from "./shared/core/store-config/store.ts";
import { theme } from "./shared/views/antdConfig.ts";

startReactDsfr({ defaultColorScheme: "system" });

const ProjectImpactsPage = lazy(() => import("@/features/projects/views/project-page"));

const embedRoutes = createRouter({
  projectImpacts: defineRoute(
    { projectId: param.path.string },
    (params) => `/embed/mes-projets/${params.projectId}/impacts`,
  ),
});

export default function EmbedApp() {
  const route = embedRoutes.useRoute();
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(initCurrentUser());
  }, [dispatch]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {(() => {
        switch (route.name) {
          case embedRoutes.routes.projectImpacts.name:
            return <ProjectImpactsPage projectId={route.params.projectId} />;
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
        <AntdConfigProvider theme={theme}>
          <EmbedApp />
        </AntdConfigProvider>
      </embedRoutes.RouteProvider>
    </ReduxProvider>
  </React.StrictMode>,
);
