import { revertFricheAccidentsStep } from "@/features/create-site/core/actions/createSite.actions";
import { completeFricheAccidents } from "@/features/create-site/core/createSite.reducer";
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
          completeFricheAccidents({
            hasRecentAccidents: hasRecentAccidents === "yes",
            ...dataRest,
          }),
        );
      }}
      onBack={() => {
        dispatch(revertFricheAccidentsStep());
      }}
    />
  );
}

export default FricheAccidentsFormContainer;
