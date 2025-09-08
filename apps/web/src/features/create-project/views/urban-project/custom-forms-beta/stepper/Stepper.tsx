import { useMemo, useCallback } from "react";

import { navigateToStep } from "@/features/create-project/core/urban-project-beta/urbanProject.actions";
import { selectAvailableStepsState } from "@/features/create-project/core/urban-project-beta/urbanProject.selectors";
import { isAnswersStep } from "@/features/create-project/core/urban-project-beta/urbanProjectSteps";
import { UrbanProjectCustomCreationStep } from "@/features/create-project/core/urban-project/creationSteps";
import classNames from "@/shared/views/clsx";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import FormStepperStep from "@/shared/views/layout/WizardFormLayout/FormStepperStep";

import {
  STEP_CATEGORIES,
  STEP_LABELS,
  STEP_TO_CATEGORY_MAPPING,
  CategoryDefinition,
  SubCategoryDefinition,
} from "./stepperConfig";

const STEPPER_CLASSES = classNames("list-none", "p-0");
const SUB_STEPPER_CLASSES = classNames("list-none", "[&>*]:pl-6", "my-0", "p-0");

type CategoryState = "current" | "completed" | "pending" | "empty";
type SubCategory = Pick<SubCategoryDefinition, "labelKey" | "targetStepId"> & {
  state: CategoryState;
  order: number;
};
type Category = Pick<CategoryDefinition, "labelKey" | "targetStepId"> & {
  subCategories?: SubCategory[];
  state: CategoryState;
  order: number;
  disabled?: boolean;
};

type AvailableStepState = Partial<
  Record<
    UrbanProjectCustomCreationStep,
    {
      order: number;
      status: "empty" | "completed";
    }
  >
>;

const getNextAvailableCategoryOrSubCategory = (categories: Category[]) => {
  const nextStep = categories.find(
    ({ state, subCategories }) =>
      state === "empty" || subCategories?.some((sc) => sc.state === "empty"),
  );

  if (!nextStep) return { categories, nextAvailableCategory: undefined };

  return {
    category: nextStep.labelKey,
    subCategory:
      nextStep.state !== "empty"
        ? nextStep.subCategories?.find((sc) => sc.state === "empty")?.labelKey
        : undefined,
  };
};

const useMapStepListToCategoryList = (
  availableStepsState: AvailableStepState,
  currentStep: UrbanProjectCustomCreationStep,
) => {
  return useMemo(() => {
    const { categoryKey: currentCategory, subCategoryKey: currentSubCategory } =
      STEP_TO_CATEGORY_MAPPING[currentStep];

    const categories = STEP_CATEGORIES.reduce<Category[]>((categories, category) => {
      const categoryState = availableStepsState[category.targetStepId];

      if (!categoryState) return categories;

      const isCurrentCategory = currentCategory === category.labelKey;

      if (currentStep === "URBAN_PROJECT_CREATION_RESULT") {
        return [
          ...categories,
          {
            ...category,
            ...categoryState,
            subCategories: [],
            state: "completed",
            disabled: true,
          },
        ];
      }

      const subCategories = category.subCategories
        ?.reduce<SubCategory[]>((subCategoryList, subCategory) => {
          const subCategoryState = availableStepsState[subCategory.targetStepId];
          if (!subCategoryState) {
            return subCategoryList;
          }
          const isCurrentStep = isCurrentCategory && subCategory.labelKey === currentSubCategory;
          return subCategoryList.concat({
            ...subCategory,
            ...subCategoryState,
            state: isCurrentStep ? "current" : subCategoryState.status,
          });
        }, [])
        .sort((a, b) => a.order - b.order);

      const completedStatus =
        subCategories && !subCategories.every((sc) => sc.state === "completed")
          ? "empty"
          : categoryState.status;

      const currentStatus = currentSubCategory ? "pending" : "current";

      return [
        ...categories,
        {
          ...category,
          ...categoryState,
          subCategories,
          state: isCurrentCategory ? currentStatus : completedStatus,
        },
      ];
    }, []).sort((a, b) => a.order - b.order);

    return {
      categories,
      nextAvailableCategory:
        isAnswersStep(currentStep) && availableStepsState[currentStep]?.status === "empty"
          ? undefined
          : getNextAvailableCategoryOrSubCategory(categories),
    };
  }, [availableStepsState, currentStep]);
};

type Props = {
  step: UrbanProjectCustomCreationStep;
};

function UrbanProjectCustomStepper({ step: currentStep }: Props) {
  const availableStepsState = useAppSelector(selectAvailableStepsState);
  const dispatch = useAppDispatch();

  const onNavigateToStep = useCallback(
    (stepId: UrbanProjectCustomCreationStep) => {
      dispatch(navigateToStep({ stepId }));
    },
    [dispatch],
  );

  const { categories, nextAvailableCategory } = useMapStepListToCategoryList(
    availableStepsState,
    currentStep,
  );

  return (
    <ol role="list" className={STEPPER_CLASSES}>
      <FormStepperStep title="Type de projet" state="completed" />
      <FormStepperStep title="Mode de création" state="completed" />

      {categories.map(({ targetStepId, labelKey, subCategories, state, disabled }) => (
        <div key={labelKey}>
          <FormStepperStep
            counterId="main"
            key={labelKey}
            title={STEP_LABELS[labelKey]}
            state={state}
            role="button"
            onClick={() => {
              onNavigateToStep(targetStepId);
            }}
            disabled={
              disabled ?? !(state === "completed" || nextAvailableCategory?.category === labelKey)
            }
          />
          {subCategories && (state === "pending" || state === "current") && (
            <ol className={SUB_STEPPER_CLASSES}>
              {subCategories.map((subStep) => (
                <FormStepperStep
                  counterId="sub"
                  key={subStep.targetStepId}
                  title={STEP_LABELS[subStep.labelKey]}
                  state={subStep.state}
                  onClick={() => {
                    onNavigateToStep(subStep.targetStepId);
                  }}
                  role="button"
                  disabled={
                    !(
                      subStep.state === "completed" ||
                      nextAvailableCategory?.subCategory === subStep.labelKey
                    )
                  }
                />
              ))}
            </ol>
          )}
        </div>
      ))}
    </ol>
  );
}

export default UrbanProjectCustomStepper;
