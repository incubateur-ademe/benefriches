import { useContext } from "react";

import { UrbanProjectCreationStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";
import classNames from "@/shared/views/clsx";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { SidebarLayoutContext } from "@/shared/views/layout/SidebarLayout/SidebarLayoutContext";
import FormStepperWrapper from "@/shared/views/layout/WizardFormLayout/FormStepperWrapper";
import { useBuildStepperNavigationItems } from "@/shared/views/project-form/stepper/useBuildStepperNavigationItems";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import UpdateFormStepperStep from "./UpdateFormStepperStep";

type Props = {
  step: UrbanProjectCreationStep;
};

type SummaryButtonProps = {
  isSelected: boolean;
  onClick: () => void;
};

const SummaryButton = ({ onClick, isSelected }: SummaryButtonProps) => {
  const { isOpen: isExtended } = useContext(SidebarLayoutContext);

  return (
    <button
      title={!isExtended ? "Récapitulatif du projet" : undefined}
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
      {isExtended && "Récapitulatif du projet"}
    </button>
  );
};

function UrbanProjectUpdateStepper({ step: currentStep }: Props) {
  const { selectStepsGroupedBySections, onNavigateToStep, onNavigateToStepperGroup } =
    useProjectForm();

  const stepsGroupedBySections = useAppSelector(selectStepsGroupedBySections);

  const stepGroupsList = useBuildStepperNavigationItems(stepsGroupedBySections, currentStep);

  const summary = stepGroupsList.find(({ groupId }) => groupId === "SUMMARY");

  return (
    <>
      {summary && (
        <SummaryButton
          onClick={() => {
            onNavigateToStepperGroup("SUMMARY");
          }}
          isSelected={summary.variant === "current" || summary.variant === "active"}
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
              {subGroups && (variant === "active" || variant === "current") && (
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
