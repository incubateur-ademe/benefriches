import SiteReinstatementContractOwnerForm, {
  FormValues,
} from "./SiteReinstatementContractOwnerForm";

import {
  goToStep,
  ProjectCreationStep,
  setReinstatementContractOwner,
} from "@/features/create-project/application/createProject.reducer";
import { ProjectSite } from "@/features/create-project/domain/project.types";
import { getSiteStakeholders } from "@/features/create-project/domain/stakeholders";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch, projectSite: ProjectSite) => {
  const siteStakeholders = getSiteStakeholders(projectSite);

  return {
    siteStakeholders,
    onSubmit: (data: FormValues) => {
      switch (data.futureOperator) {
        case "site_stakeholder":
          // eslint-disable-next-line no-case-declarations
          const futureOperator =
            data.siteStakeholder === "owner"
              ? projectSite.owner
              : projectSite.tenant!;
          dispatch(setReinstatementContractOwner(futureOperator));
          break;
        case "site_owner":
          dispatch(
            setReinstatementContractOwner({
              name: projectSite.owner.name,
              structureType: projectSite.owner.structureType,
            }),
          );
          break;
        case "local_or_regional_authority":
          dispatch(
            setReinstatementContractOwner({
              name: data.localOrRegionalAuthority!,
              structureType: "local_or_regional_authority",
            }),
          );
          break;
        case "user_company":
          dispatch(
            setReinstatementContractOwner({
              name: "TODO: nom de la structure de l'utilisateur",
              structureType: "unknown",
            }),
          );
          break;
        case "other_structure":
          dispatch(
            setReinstatementContractOwner({
              name: data.otherStructureName!,
              structureType: "unknown",
            }),
          );
          break;
      }
      dispatch(
        goToStep(ProjectCreationStep.STAKEHOLDERS_RECONVERSION_FULL_TIME_JOBS),
      );
    },
  };
};

function SiteReinstatementContractOwnerFormContainer() {
  const dispatch = useAppDispatch();
  const projectSite = useAppSelector((state) => state.projectCreation.siteData);

  return (
    <SiteReinstatementContractOwnerForm {...mapProps(dispatch, projectSite!)} />
  );
}

export default SiteReinstatementContractOwnerFormContainer;
