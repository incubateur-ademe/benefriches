import { useAppSelector } from "@/app/hooks/store.hooks";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";
import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";
import UpdateFormStepperStep from "@/features/update-project/views/UpdateFormStepperStep";
import FormStepperWrapper from "@/shared/views/layout/WizardFormLayout/FormStepperWrapper";

import { selectSiteUpdateStepperGroups } from "../core/updateSite.reducer";

// One continuous stepper across both engines (ticket 18): the custom and urban-zone sub-flows
// stay separate `WizardFormSubState` instances (ADR-0015) — only their sidebar presentation is
// merged. `selectSiteUpdateStepperGroups` carries the owning engine on each entry so a click is
// routed to that engine's own `onNavigateToStep`.
function SiteUpdateStepper() {
  const { onNavigateToStep: onNavigateToCustomStep } = useCustomSiteForm();
  const { onNavigateToStep: onNavigateToUrbanZoneStep } = useUrbanZoneSiteForm();
  const entries = useAppSelector(selectSiteUpdateStepperGroups);

  return (
    <FormStepperWrapper className="my-0">
      {entries.map((entry) => (
        <li className="p-0" key={entry.key}>
          <UpdateFormStepperStep
            title={entry.title}
            variant={{ activity: entry.activity, validation: entry.validation }}
            onClick={() => {
              if (entry.engine === "custom") {
                onNavigateToCustomStep(entry.targetStepId);
              } else {
                onNavigateToUrbanZoneStep(entry.targetStepId);
              }
            }}
          />
        </li>
      ))}
    </FormStepperWrapper>
  );
}

export default SiteUpdateStepper;
