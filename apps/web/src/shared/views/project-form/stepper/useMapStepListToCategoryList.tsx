import { useMemo } from "react";

import {
  isAnswersStep,
  UrbanProjectCreationStep,
} from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";

import {
  STEP_CATEGORIES,
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

export const useMapStepListToCategoryList = (
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
