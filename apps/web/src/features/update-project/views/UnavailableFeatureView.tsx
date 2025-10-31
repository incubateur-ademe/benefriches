import Alert from "@codegouvfr/react-dsfr/Alert";

import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import UrbanProjectUpdateHeader from "./UrbanProjectUpdateHeader";

function UnavailableFeatureView() {
  const projectName = useAppSelector(
    (state) => state.projectUpdate.projectData.features?.name ?? "",
  );

  return (
    <>
      <HtmlTitle>Modifier un projet - En construction</HtmlTitle>
      <SidebarLayout
        title={<UrbanProjectUpdateHeader projectName={projectName} />}
        sidebarChildren={null}
        mainChildren={
          <div className="md:max-w-xl">
            <Alert
              severity="warning"
              title="⏳ Fonctionnalité en construction"
              description="La modification de projet express ou photovoltaïque n'est pas encore disponible."
            />
          </div>
        }
      />
    </>
  );
}

export default UnavailableFeatureView;
