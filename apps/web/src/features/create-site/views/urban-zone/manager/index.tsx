import { useEffect } from "react";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";

import ManagerForm from "./ManagerForm";

function ManagerContainer() {
  const { onBack, onRequestStepCompletion, onFetchSiteMunicipalityData, selectManagerViewData } =
    useUrbanZoneSiteForm();
  const { initialValues, localAuthoritiesList } = useAppSelector(selectManagerViewData);

  useEffect(() => {
    void onFetchSiteMunicipalityData();
  }, [onFetchSiteMunicipalityData]);

  return (
    <ManagerForm
      initialValues={initialValues}
      localAuthoritiesList={localAuthoritiesList}
      onSubmit={(data) => {
        onRequestStepCompletion({
          stepId: "URBAN_ZONE_MANAGER",
          answers: data,
        });
      }}
      onBack={() => {
        onBack();
      }}
    />
  );
}

export default ManagerContainer;
