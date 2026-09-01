import { useAppSelector } from "@/app/hooks/store.hooks";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";
import UpdateFormStepperStep from "@/features/update-project/views/UpdateFormStepperStep";
import FormStepperWrapper from "@/shared/views/layout/WizardFormLayout/FormStepperWrapper";

function SiteUpdateStepper() {
  const { selectCustomStepperGroups, onNavigateToStep } = useCustomSiteForm();
  const stepperGroups = useAppSelector(selectCustomStepperGroups);

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

export default SiteUpdateStepper;
