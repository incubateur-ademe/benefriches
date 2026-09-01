import { useAppSelector } from "@/app/hooks/store.hooks";
import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";
import UpdateFormStepperStep from "@/features/update-project/views/UpdateFormStepperStep";
import FormStepperWrapper from "@/shared/views/layout/WizardFormLayout/FormStepperWrapper";

function SiteUpdateUrbanZoneStepper() {
  const { selectUrbanZoneStepperGroups, onNavigateToStep } = useUrbanZoneSiteForm();
  const stepperGroups = useAppSelector(selectUrbanZoneStepperGroups);

  return (
    <FormStepperWrapper className="my-0">
      {stepperGroups.map(({ groupId, title, targetStepId, activity, validation }) => (
        <li className="p-0" key={groupId}>
          <UpdateFormStepperStep
            title={title}
            variant={{ activity, validation }}
            onClick={() => {
              onNavigateToStep(targetStepId);
            }}
          />
        </li>
      ))}
    </FormStepperWrapper>
  );
}

export default SiteUpdateUrbanZoneStepper;
