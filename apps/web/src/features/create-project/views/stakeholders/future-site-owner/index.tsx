import { useEffect } from "react";
import FutureSiteOwnerForm, { FormValues } from "./FutureSiteOwnerForm";

import {
  goToStep,
  ProjectCreationStep,
  setFutureSiteOwner,
} from "@/features/create-project/application/createProject.reducer";
import { fetchSiteLocalAuthorities } from "@/features/create-project/application/projectSiteLocalAuthorities.actions";
import { SiteLocalAuthorities } from "@/features/create-project/application/projectSiteLocalAuthorities.reducer";
import { ProjectSite, ProjectStakeholder } from "@/features/create-project/domain/project.types";
import { getSiteStakeholders } from "@/features/create-project/domain/stakeholders";
import { selectCurrentUserCompany } from "@/features/users/application/user.reducer";
import { User } from "@/features/users/domain/user";
import formatLocalAuthorityName from "@/shared/services/strings/formatLocalAuthorityName";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const convertFormValuesForStore = (
  data: FormValues,
  projectSite: ProjectSite,
  currentUserCompany: Exclude<User["organization"], undefined>,
  siteLocalAuthorities: SiteLocalAuthorities,
): ProjectStakeholder => {
  switch (data.futureSiteOwner) {
    case "site_tenant":
      return projectSite.tenant!;
    case "local_or_regional_authority":
      return {
        name: formatLocalAuthorityName(data.localAuthority, siteLocalAuthorities),
        structureType: data.localAuthority,
      };
    case "user_company":
      return {
        name: currentUserCompany.name,
        structureType: currentUserCompany.type,
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

function FutureOwnerFormContainer() {
  const dispatch = useAppDispatch();
  const projectSite = useAppSelector((state) => state.projectCreation.siteData);
  const currentUserCompany = useAppSelector(selectCurrentUserCompany);
  const projectSiteLocalAuthorities = useAppSelector((state) => state.projectSiteLocalAuthorities);
  const siteStakeholders = projectSite ? getSiteStakeholders(projectSite) : [];

  const siteLocalAuthorities = projectSiteLocalAuthorities.localAuthorities;

  const onSubmit = (data: FormValues) => {
    if (!projectSite || !siteLocalAuthorities) return;
    dispatch(
      setFutureSiteOwner(
        convertFormValuesForStore(data, projectSite, currentUserCompany, siteLocalAuthorities),
      ),
    );
    dispatch(goToStep(ProjectCreationStep.COSTS_INTRODUCTION));
  };

  useEffect(() => void dispatch(fetchSiteLocalAuthorities()), [dispatch]);

  return (
    <FutureSiteOwnerForm
      onSubmit={onSubmit}
      siteStakeholders={siteStakeholders}
      currentUserCompany={currentUserCompany}
      projectSiteLocalAuthorities={projectSiteLocalAuthorities}
    />
  );
}

export default FutureOwnerFormContainer;
