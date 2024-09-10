import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import { ConfigProvider as AntdConfigProvider } from "antd";
import { createRouter, defineRoute, param } from "type-route";
import { appDependencies } from "./app/application/appDependencies.ts";
import { createStore } from "./app/application/store.ts";
import { theme } from "./app/views/antdConfig.ts";

startReactDsfr({ defaultColorScheme: "system" });

import { lazy, Suspense, useEffect } from "react";
import "./main.css";

import { initCurrentUser } from "@/features/users/application/initCurrentUser.action";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
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
