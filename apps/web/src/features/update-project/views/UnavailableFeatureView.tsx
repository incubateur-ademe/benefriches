import Alert from "@codegouvfr/react-dsfr/Alert";

import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

function UnavailableFeatureView() {
  return (
    <>
      <HtmlTitle>Modifier un projet - En construction</HtmlTitle>
      <SidebarLayout
        title="Modification du projet"
        sidebarChildren={null}
        mainChildren={
          <Alert
            severity="warning"
            title="⏳ Fonctionnalité en construction"
            description="La modification de projet express ou photovoltaïque n'est pas encore disponible."
          />
        }
      />
    </>
  );
}

export default UnavailableFeatureView;
