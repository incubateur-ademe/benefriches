import { useAppSelector } from "@/app/hooks/store.hooks";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";
import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";
import UpdateFormStepperStep from "@/features/update-project/views/UpdateFormStepperStep";
import FormStepperWrapper from "@/shared/views/layout/WizardFormLayout/FormStepperWrapper";

import type { SiteUpdateStepperEntry } from "../core/updateSite.reducer";
import { selectSiteUpdateStepperGroups } from "../core/updateSite.reducer";

// One continuous stepper across both engines (ticket 18): the custom and urban-zone sub-flows
// stay separate `WizardFormSubState` instances (ADR-0015) — only their sidebar presentation is
// merged. `selectSiteUpdateStepperGroups` carries the owning engine on each entry so a click is
// routed to that engine's own `onNavigateToStep`.
function SiteUpdateStepper() {
  const { onNavigateToStep: onNavigateToCustomStep } = useCustomSiteForm();
  const { onNavigateToStep: onNavigateToUrbanZoneStep } = useUrbanZoneSiteForm();
  const entries = useAppSelector(selectSiteUpdateStepperGroups);

  // Type-safe handler that routes to the correct navigation function based on engine type.
  // TypeScript verifies the narrowing: when entry.engine === "custom", we call onNavigateToCustomStep;
  // when entry.engine === "urbanZone", we call onNavigateToUrbanZoneStep.
  const handleNavigation = (entry: SiteUpdateStepperEntry) => {
    if (entry.engine === "custom") {
      return () => {
        onNavigateToCustomStep(entry.targetStepId);
      };
    } else {
      return () => {
        onNavigateToUrbanZoneStep(entry.targetStepId);
      };
    }
  };

  return (
    <FormStepperWrapper className="my-0">
      {entries.map((entry) => {
        const onNavigate = handleNavigation(entry);

        return (
          <li className="p-0" key={entry.key}>
            <UpdateFormStepperStep
              title={entry.title}
              variant={{ activity: entry.activity, validation: entry.validation }}
              onClick={() => {
                onNavigate();
              }}
            />
            {entry.subGroups.length > 0 &&
              (entry.activity === "groupActive" || entry.activity === "current") && (
                <FormStepperWrapper className="my-0">
                  {entry.engine === "custom" &&
                    entry.subGroups.map((subGroup) => (
                      <li className="p-0" key={`${entry.key}:${subGroup.subGroupId}`}>
                        <UpdateFormStepperStep
                          title={subGroup.title}
                          variant={{
                            activity: subGroup.activity,
                            validation: subGroup.validation,
                          }}
                          className="pl-6"
                          onClick={() => {
                            if (entry.engine === "custom") {
                              onNavigateToCustomStep(subGroup.targetStepId);
                            }
                          }}
                        />
                      </li>
                    ))}
                  {entry.engine === "urbanZone" &&
                    entry.subGroups.map((subGroup) => (
                      <li className="p-0" key={`${entry.key}:${subGroup.subGroupId}`}>
                        <UpdateFormStepperStep
                          title={subGroup.title}
                          variant={{
                            activity: subGroup.activity,
                            validation: subGroup.validation,
                          }}
                          className="pl-6"
                          onClick={() => {
                            if (entry.engine === "urbanZone") {
                              onNavigateToUrbanZoneStep(subGroup.targetStepId);
                            }
                          }}
                        />
                      </li>
                    ))}
                </FormStepperWrapper>
              )}
          </li>
        );
      })}
    </FormStepperWrapper>
  );
}

export default SiteUpdateStepper;
