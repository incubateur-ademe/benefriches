import Alert from "@codegouvfr/react-dsfr/Alert";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { selectCurrentUserEmail } from "@/features/onboarding/core/user.reducer";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

function UnavailableFeatureView() {
  const projectName = useAppSelector((state) => state.projectUpdate.projectData.projectName ?? "");
  const currentUserEmail = useAppSelector(selectCurrentUserEmail);

  return (
    <>
      <HtmlTitle>Modifier un projet - En construction</HtmlTitle>
      <SidebarLayout
        title={`Modification du projet «\u00a0${projectName}\u00a0»`}
        currentUserEmail={currentUserEmail}
        sidebarChildren={null}
        mainChildren={
          <div className="md:max-w-xl">
            <Alert
              severity="warning"
              title="⏳ Fonctionnalité en construction"
              description="La modification de projet démo ou photovoltaïque n'est pas encore disponible."
            />
          </div>
        }
      />
    </>
  );
}

export default UnavailableFeatureView;
