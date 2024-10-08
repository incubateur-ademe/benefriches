import { fr } from "@codegouvfr/react-dsfr";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { introductionStepCompleted } from "../../application/createProject.reducer";
import CreateProjectIntroductionPage from "./CreateProjetIntroductionPage";

function CreateProjectIntroductionContainer() {
  const dispatch = useAppDispatch();
  const { siteData, siteDataLoadingState } = useAppSelector((state) => state.projectCreation);

  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <CreateProjectIntroductionPage
        siteName={siteData?.name ?? ""}
        siteLoadingState={siteDataLoadingState}
        onNext={() => dispatch(introductionStepCompleted())}
      />
    </section>
  );
}

export default CreateProjectIntroductionContainer;
