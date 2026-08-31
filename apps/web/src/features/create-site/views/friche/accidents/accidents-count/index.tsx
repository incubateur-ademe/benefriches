import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/custom/custom.actions";
import { selectSiteAccidentsData } from "@/features/create-site/core/selectors/createSite.selectors";

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
        dispatch(
          stepCompletionRequested({
            stepId: "FRICHE_ACCIDENTS",
            answers:
              data.hasRecentAccidents === "yes"
                ? {
                    hasRecentAccidents: true,
                    accidentsMinorInjuries: data.accidentsMinorInjuries,
                    accidentsSevereInjuries: data.accidentsSevereInjuries,
                    accidentsDeaths: data.accidentsDeaths,
                  }
                : { hasRecentAccidents: false },
          }),
        );
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default FricheAccidentsFormContainer;
