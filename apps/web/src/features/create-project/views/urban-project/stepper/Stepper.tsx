import { useMemo, useCallback } from "react";

import { navigateToStep } from "@/features/create-project/core/urban-project/urbanProject.actions";
import { selectAvailableStepsState } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import {
  isAnswersStep,
  UrbanProjectCreationStep,
} from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";
import { RootState } from "@/shared/core/store-config/store";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import FormStepperStep from "@/shared/views/layout/WizardFormLayout/FormStepperStep";
import FormStepperWrapper from "@/shared/views/layout/WizardFormLayout/FormStepperWrapper";

import StepperLiItem from "./StepperItem";
import {
  STEP_CATEGORIES,
  STEP_LABELS,
  STEP_TO_CATEGORY_MAPPING,
  CategoryDefinition,
  SubCategoryDefinition,
} from "./stepperConfig";

export type CategoryState = "current" | "completed" | "active" | "empty";
type SubCategory = Pick<SubCategoryDefinition, "labelKey" | "targetStepId"> & {
  state: CategoryState;
  order: number;
};
type Category = Pick<CategoryDefinition, "labelKey" | "targetStepId"> & {
  subCategories?: SubCategory[];
  state: CategoryState;
  order: number;
};

type AvailableStepState = Partial<
  Record<
    UrbanProjectCreationStep,
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
  currentStep: UrbanProjectCreationStep,
) => {
  return useMemo(() => {
    const { categoryKey: currentCategory, subCategoryKey: currentSubCategory } =
      STEP_TO_CATEGORY_MAPPING[currentStep];

    const categories = STEP_CATEGORIES.reduce<Category[]>((categories, category) => {
      const categoryState = availableStepsState[category.targetStepId];

      if (!categoryState) return categories;

      const isCurrentCategory = currentCategory === category.labelKey;

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
        .toSorted((a, b) => a.order - b.order);

      const completedStatus =
        subCategories && !subCategories.every((sc) => sc.state === "completed")
          ? "empty"
          : categoryState.status;

      const currentStatus = currentSubCategory ? "active" : "current";

      return [
        ...categories,
        {
          ...category,
          ...categoryState,
          subCategories,
          state: isCurrentCategory ? currentStatus : completedStatus,
        },
      ];
    }, []).toSorted((a, b) => a.order - b.order);

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
  step: UrbanProjectCreationStep;
};

function UrbanProjectStepper({ step: currentStep }: Props) {
  const availableStepsState = useAppSelector(selectAvailableStepsState);
  const saveState = useAppSelector(
    (state: RootState) => state.projectCreation.urbanProject.saveState,
  );
  const dispatch = useAppDispatch();

  const onNavigateToStep = useCallback(
    (stepId: UrbanProjectCreationStep) => {
      dispatch(navigateToStep({ stepId }));
    },
    [dispatch],
  );

  const { categories, nextAvailableCategory } = useMapStepListToCategoryList(
    availableStepsState,
    currentStep,
  );

  const isFormDisabled = saveState === "success";

  return (
    <FormStepperWrapper>
      <FormStepperStep title="Type de projet" state="completed" />
      {categories.map(({ targetStepId, labelKey, subCategories, state }) => (
        <StepperLiItem
          key={labelKey}
          title={STEP_LABELS[labelKey]}
          state={state}
          isFormDisabled={isFormDisabled}
          isNextAvailable={nextAvailableCategory?.category === labelKey}
          onClick={() => {
            onNavigateToStep(targetStepId);
          }}
        >
          {subCategories && (state === "active" || state === "current") && (
            <FormStepperWrapper className="my-0">
              {subCategories.map((subStep) => (
                <StepperLiItem
                  key={subStep.labelKey}
                  title={STEP_LABELS[subStep.labelKey]}
                  state={subStep.state}
                  className="pl-6"
                  isFormDisabled={isFormDisabled}
                  isNextAvailable={nextAvailableCategory?.subCategory === subStep.labelKey}
                  onClick={() => {
                    onNavigateToStep(subStep.targetStepId);
                  }}
                />
              ))}
            </FormStepperWrapper>
          )}
        </StepperLiItem>
      ))}
    </FormStepperWrapper>
  );
}

export default UrbanProjectStepper;
