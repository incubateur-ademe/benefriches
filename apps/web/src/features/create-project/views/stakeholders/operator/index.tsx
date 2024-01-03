import SiteOperatorForm, { FormValues } from "./SiteOperatorForm";

import {
  goToStep,
  ProjectCreationStep,
  setFutureOperator,
} from "@/features/create-project/application/createProject.reducer";
import { ProjectSite } from "@/features/create-project/domain/project.types";
import { getSiteStakeholders } from "@/features/create-project/domain/stakeholders";
import { selectCurrentUserCompany } from "@/features/users/application/user.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch, currentUserCompany: string, projectSite?: ProjectSite) => {
  const siteStakeholders = projectSite ? getSiteStakeholders(projectSite) : [];

  return {
    currentUserCompany,
    siteStakeholders,
    onSubmit: (data: FormValues) => {
      if (!projectSite) return;
      switch (data.futureOperator) {
        case "site_stakeholder":
          // eslint-disable-next-line no-case-declarations
          const futureOperator =
            data.siteStakeholder === "owner" ? projectSite.owner : projectSite.tenant!;
          dispatch(setFutureOperator(futureOperator));
          break;
        case "site_owner":
          dispatch(
            setFutureOperator({
              name: projectSite.owner.name,
              structureType: projectSite.owner.structureType,
            }),
          );
          break;
        case "local_or_regional_authority":
          dispatch(
            setFutureOperator({
              name: data.localOrRegionalAuthority!,
              structureType: "local_or_regional_authority",
            }),
          );
          break;
        case "user_company":
          dispatch(
            setFutureOperator({
              name: currentUserCompany,
              structureType: "company",
            }),
          );
          break;
        case "other_structure":
          dispatch(
            setFutureOperator({
              name: data.otherStructureName!,
              structureType: "unknown",
            }),
          );
          break;
      }
      dispatch(goToStep(ProjectCreationStep.STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER));
    },
  };
};

function SiteOperatorFormContainer() {
  const dispatch = useAppDispatch();
  const projectSite = useAppSelector((state) => state.projectCreation.siteData);
  const currentUserCompany = useAppSelector(selectCurrentUserCompany);

  return <SiteOperatorForm {...mapProps(dispatch, currentUserCompany, projectSite)} />;
}

export default SiteOperatorFormContainer;
