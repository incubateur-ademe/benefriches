import { useContext, useEffect } from "react";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { UrbanProjectCreationStep } from "@/features/create-project/core/urban-project/urbanProjectSteps";
import { useBuildStepperNavigationItems } from "@/features/create-project/views/project-form/stepper/useBuildStepperNavigationItems";
import { useProjectForm } from "@/features/create-project/views/project-form/useProjectForm";
import classNames from "@/shared/views/clsx";
import { SidebarCurrentStepContext } from "@/shared/views/layout/SidebarLayout/SidebarCurrentStepContext";
import FormStepperWrapper from "@/shared/views/layout/WizardFormLayout/FormStepperWrapper";

import UpdateFormStepperStep from "./UpdateFormStepperStep";

type Props = {
  step: UrbanProjectCreationStep;
};

const SUMMARY_LABEL = "Récapitulatif du projet";

type SummaryButtonProps = {
  isSelected: boolean;
  isCurrent: boolean;
  onClick: () => void;
};

const SummaryButton = ({ onClick, isSelected, isCurrent }: SummaryButtonProps) => {
  const { setCurrentStepLabel } = useContext(SidebarCurrentStepContext);
  useEffect(() => {
    if (isCurrent) {
      setCurrentStepLabel(SUMMARY_LABEL);
    }
  }, [isCurrent, setCurrentStepLabel]);

  return (
    <button
      onClick={onClick}
      className={classNames(
        "flex",
        "items-center",
        "p-2",
        "before:mx-4",
        "marker:content-none",
        "ri-file-list-line ",
        "text-blue-ultradark dark:text-blue-ultralight",
        isSelected
          ? ["bg-blue-ultralight dark:bg-blue-ultradark"]
          : "text-dsfr-greyDisabled font-medium",
        "hover:bg-blue-ultralight hover:dark:bg-blue-ultradark",
        "text-left font-bold w-full py-3",
      )}
    >
      {SUMMARY_LABEL}
    </button>
  );
};

function UrbanProjectUpdateStepper({ step: currentStep }: Props) {
  const { selectStepsGroupedBySections, onNavigateToStep, onNavigateToStepperGroup } =
    useProjectForm();

  const stepsGroupedBySections = useAppSelector(selectStepsGroupedBySections);

  const stepGroupsList = useBuildStepperNavigationItems({
    projectStepGroups: stepsGroupedBySections,
    currentStep,
  });

  const summary = stepGroupsList.find(({ groupId }) => groupId === "SUMMARY");

  return (
    <>
      {summary && (
        <SummaryButton
          onClick={() => {
            onNavigateToStepperGroup("SUMMARY");
          }}
          isSelected={
            summary.variant.activity === "current" || summary.variant.activity === "groupActive"
          }
          isCurrent={summary.variant.activity === "current"}
        />
      )}

      <FormStepperWrapper className="my-0">
        {stepGroupsList
          .filter(({ groupId }) => groupId !== "SUMMARY")
          .map(({ title, groupId, subGroups, variant }) => (
            <li className="p-0" key={title}>
              <UpdateFormStepperStep
                title={title}
                variant={variant}
                onClick={() => {
                  onNavigateToStepperGroup(groupId);
                }}
              />
              {subGroups &&
                (variant.activity === "groupActive" || variant.activity === "current") && (
                  <FormStepperWrapper className="my-0">
                    {subGroups.map((subStep) => (
                      <li className="p-0" key={subStep.title}>
                        <UpdateFormStepperStep
                          title={subStep.title}
                          variant={subStep.variant}
                          className="pl-6"
                          onClick={() => {
                            onNavigateToStep(subStep.targetStepId);
                          }}
                        />
                      </li>
                    ))}
                  </FormStepperWrapper>
                )}
            </li>
          ))}
      </FormStepperWrapper>
    </>
  );
}

export default UrbanProjectUpdateStepper;
