import { useEffect } from "react";
import FutureSiteOwnerForm, { FormValues } from "./FutureSiteOwnerForm";

import {
  completeFutureSiteOwner,
  revertFutureSiteOwner,
} from "@/features/create-project/application/createProject.reducer";
import { fetchSiteLocalAuthorities } from "@/features/create-project/application/projectSiteLocalAuthorities.actions";
import { SiteLocalAuthorities } from "@/features/create-project/application/projectSiteLocalAuthorities.reducer";
import { ProjectSite, ProjectStakeholder } from "@/features/create-project/domain/project.types";
import { getSiteStakeholders } from "@/features/create-project/domain/stakeholders";
import { selectCurrentUserStructure } from "@/features/users/application/user.reducer";
import { UserStructure } from "@/features/users/domain/user";
import formatLocalAuthorityName from "@/shared/services/strings/formatLocalAuthorityName";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const convertFormValuesForStore = (
  data: FormValues,
  projectSite: ProjectSite,
  currentUserStructure: UserStructure | undefined,
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
      if (!currentUserStructure) return { name: "", structureType: "unknown" };
      return {
        name: currentUserStructure.name ?? "",
        structureType: currentUserStructure.type as ProjectStakeholder["structureType"],
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
  const currentUserStructure = useAppSelector(selectCurrentUserStructure);
  const projectSiteLocalAuthorities = useAppSelector((state) => state.projectSiteLocalAuthorities);
  const siteStakeholders = projectSite ? getSiteStakeholders(projectSite) : [];

  const siteLocalAuthorities = projectSiteLocalAuthorities.localAuthorities;

  const onSubmit = (data: FormValues) => {
    if (!projectSite || !siteLocalAuthorities) return;
    dispatch(
      completeFutureSiteOwner(
        convertFormValuesForStore(data, projectSite, currentUserStructure, siteLocalAuthorities),
      ),
    );
  };

  const onBack = () => {
    dispatch(revertFutureSiteOwner());
  };

  useEffect(() => void dispatch(fetchSiteLocalAuthorities()), [dispatch]);

  return (
    <FutureSiteOwnerForm
      onSubmit={onSubmit}
      onBack={onBack}
      siteStakeholders={siteStakeholders}
      currentUserStructure={currentUserStructure}
      projectSiteLocalAuthorities={projectSiteLocalAuthorities}
    />
  );
}

export default FutureOwnerFormContainer;
