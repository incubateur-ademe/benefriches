import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { selectUrbanZoneNamingViewData } from "@/features/create-site/core/urban-zone/steps/naming/naming.selectors";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";
import SiteNameAndDescriptionForm from "@/features/create-site/views/custom/naming/SiteNameAndDescription";

function UrbanZoneNamingContainer() {
  const dispatch = useAppDispatch();
  const { initialValues } = useAppSelector(selectUrbanZoneNamingViewData);

  return (
    <SiteNameAndDescriptionForm
      initialValues={initialValues}
      onSubmit={({ name, description }) => {
        dispatch(
          stepCompletionRequested({
            stepId: "URBAN_ZONE_NAMING",
            answers: { name, description },
          }),
        );
      }}
      onBack={() => dispatch(previousStepRequested())}
    />
  );
}

export default UrbanZoneNamingContainer;
