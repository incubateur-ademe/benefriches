import { useAppSelector } from "@/app/hooks/store.hooks";
import type { creationCustomFormSelectors } from "@/features/create-site/core/custom/customForm.selectors";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import FricheAccidentsForm, { FormValues } from "./FricheAccidentsForm";

const mapInitialValues = (
  siteAccidentsData: ReturnType<typeof creationCustomFormSelectors.selectSiteAccidentsData>,
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
  const { onBack, onRequestStepCompletion, selectSiteAccidentsData } = useCustomSiteForm();
  const siteAccidentsData = useAppSelector(selectSiteAccidentsData);

  return (
    <FricheAccidentsForm
      initialValues={mapInitialValues(siteAccidentsData)}
      onSubmit={(data: FormValues) => {
        onRequestStepCompletion({
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
        });
      }}
      onBack={() => {
        onBack();
      }}
    />
  );
}

export default FricheAccidentsFormContainer;
