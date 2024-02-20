import { useEffect } from "react";
import SiteReinstatementContractOwnerForm, {
  FormValues,
} from "./SiteReinstatementContractOwnerForm";

import {
  goToStep,
  ProjectCreationStep,
  setReinstatementContractOwner,
} from "@/features/create-project/application/createProject.reducer";
import { fetchSiteLocalAuthorities } from "@/features/create-project/application/projectSiteLocalAuthorities.actions";
import { SiteLocalAuthorities } from "@/features/create-project/application/projectSiteLocalAuthorities.reducer";
import { ProjectSite, ProjectStakeholder } from "@/features/create-project/domain/project.types";
import { getSiteStakeholders } from "@/features/create-project/domain/stakeholders";
import { selectCurrentUserCompany } from "@/features/users/application/user.reducer";
import formatLocalAuthorityName from "@/shared/services/strings/formatLocalAuthorityName";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const convertFormValuesForStore = (
  data: FormValues,
  projectSite: ProjectSite,
  currentUserCompany: string,
  siteLocalAuthorities: SiteLocalAuthorities,
): ProjectStakeholder => {
  switch (data.futureOperator) {
    case "site_tenant":
      return projectSite.tenant!;
    case "site_owner":
      return projectSite.owner;
    case "local_or_regional_authority":
      return {
        name: formatLocalAuthorityName(data.localAuthority, siteLocalAuthorities),
        structureType: data.localAuthority,
      };
    case "user_company":
      return {
        name: currentUserCompany,
        structureType: "company",
      };
    case "other_structure":
      return {
        name: data.otherStructureName,
        structureType: "other",
      };
    case "unknown":
      return {
        name: "Inconnu",
        structureType: "unknown",
      };
  }
};

function SiteReinstatementContractOwnerFormContainer() {
  const dispatch = useAppDispatch();
  const currentUserCompany = useAppSelector(selectCurrentUserCompany);
  const projectSite = useAppSelector((state) => state.projectCreation.siteData);

  const projectSiteLocalAuthorities = useAppSelector((state) => state.projectSiteLocalAuthorities);

  const siteStakeholders = projectSite ? getSiteStakeholders(projectSite) : [];
  const siteLocalAuthorities = projectSiteLocalAuthorities.localAuthorities;

  const onSubmit = (data: FormValues) => {
    if (!projectSite || !siteLocalAuthorities) return;
    dispatch(
      setReinstatementContractOwner(
        convertFormValuesForStore(data, projectSite, currentUserCompany, siteLocalAuthorities),
      ),
    );
    dispatch(goToStep(ProjectCreationStep.STAKEHOLDERS_RECONVERSION_FULL_TIME_JOBS));
  };

  useEffect(() => void dispatch(fetchSiteLocalAuthorities()), [dispatch]);

  return (
    <SiteReinstatementContractOwnerForm
      onSubmit={onSubmit}
      siteStakeholders={siteStakeholders}
      currentUserCompany={currentUserCompany}
      projectSiteLocalAuthorities={projectSiteLocalAuthorities}
    />
  );
}

export default SiteReinstatementContractOwnerFormContainer;
