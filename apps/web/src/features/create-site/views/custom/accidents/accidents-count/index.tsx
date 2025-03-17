import {
  fricheAccidentsStepCompleted,
  fricheAccidentsStepReverted,
} from "@/features/create-site/core/actions/soilsContaminationAndAccidents.actions";
import { selectSiteAccidentsData } from "@/features/create-site/core/selectors/createSite.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import FricheAccidentsForm, { FormValues } from "./FricheAccidentsForm";

const mapInitialValues = (
  siteAccidentsData: ReturnType<typeof selectSiteAccidentsData>,
): FormValues => {
  if (siteAccidentsData.hasRecentAccidents) {
    return {
      hasRecentAccidents: "yes",
      accidentsMinorInjuries: siteAccidentsData.accidentsMinorInjuries ?? 0,
      accidentsSevereInjuries: siteAccidentsData.accidentsSevereInjuries ?? 0,
      accidentsDeaths: siteAccidentsData.accidentsDeaths ?? 0,
    };
  }

  return {
    hasRecentAccidents: null,
  };
};

function FricheAccidentsFormContainer() {
  const dispatch = useAppDispatch();
  const siteAccidentsData = useAppSelector(selectSiteAccidentsData);

  return (
    <FricheAccidentsForm
      initialValues={mapInitialValues(siteAccidentsData)}
      onSubmit={(data: FormValues) => {
        const { hasRecentAccidents, ...dataRest } = data;
        dispatch(
          fricheAccidentsStepCompleted({
            hasRecentAccidents: hasRecentAccidents === "yes",
            ...dataRest,
          }),
        );
      }}
      onBack={() => {
        dispatch(fricheAccidentsStepReverted());
      }}
    />
  );
}

export default FricheAccidentsFormContainer;
