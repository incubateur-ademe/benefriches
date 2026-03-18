import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { fetchSiteMunicipalityData } from "@/features/create-site/core/actions/siteMunicipalityData.actions";
import { selectManagerViewData } from "@/features/create-site/core/urban-zone/steps/management/manager/manager.selectors";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

import ManagerForm from "./ManagerForm";

function ManagerContainer() {
  const dispatch = useAppDispatch();
  const { initialValues, localAuthoritiesList } = useAppSelector(selectManagerViewData);

  useEffect(() => {
    void dispatch(fetchSiteMunicipalityData());
  }, [dispatch]);

  return (
    <ManagerForm
      initialValues={initialValues}
      localAuthoritiesList={localAuthoritiesList}
      onSubmit={({ structureType, localAuthority }) => {
        dispatch(
          stepCompletionRequested({
            stepId: "URBAN_ZONE_MANAGER",
            answers: { structureType, localAuthority },
          }),
        );
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default ManagerContainer;
