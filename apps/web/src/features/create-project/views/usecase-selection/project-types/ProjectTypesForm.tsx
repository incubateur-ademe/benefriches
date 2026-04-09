import { fr } from "@codegouvfr/react-dsfr";
import { Controller, useForm } from "react-hook-form";
import { DevelopmentPlanCategory, developmentPlanCategorySchema } from "shared";

import { ProjectSuggestion } from "@/features/create-project/core/project.types";
import {
  getCompatibilityScoreBackgroundColor,
  getTextForCompatibilityScore,
} from "@/features/reconversion-compatibility/core/score";
import classNames from "@/shared/views/clsx";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import TileFormFieldWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFieldWrapper";
import TileFormFieldsWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFieldsWrapper";
import TileFormFooterWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFooterWrapper";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import {
  getLabelForDevelopmentPlanCategory,
  getLabelForReconversionProjectTemplate,
  getPictogramSrcForReconversionProjectTemplate,
} from "../../projectTypeLabelMapping";
import DevelopmentPlanCategoryTile from "./DevelopmentPlanCategoryTile";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  initialValues: FormValues | undefined;
  allowedDevelopmentPlanCategories: DevelopmentPlanCategory[];
  projectSuggestions?: ProjectSuggestion[];
};

type FormValues = {
  developmentPlanCategory: DevelopmentPlanCategory;
};

const getRankColor = (rank: number): string => {
  switch (rank) {
    case 1:
      return "bg-gold";
    case 2:
      return "bg-silver";
    case 3:
      return "bg-bronze";
    default:
      return "bg-background-light";
  }
};
function MutabilitySuggestions({
  projectSuggestions,
}: {
  projectSuggestions: ProjectSuggestion[];
}) {
  const sortedSuggestions = projectSuggestions.toSorted(
    (a, b) => b.compatibilityScore - a.compatibilityScore,
  );

  return (
    <FormInfo>
      <span className="title">Résultat de l'évaluation de mutabilité du site</span>
      <ol className="my-2 p-0 list-none">
        {sortedSuggestions.map(({ type, compatibilityScore }, index) => (
          <li key={type} className="flex items-center gap-1 py-2">
            <span
              className={classNames(
                "inline-flex items-center justify-center",
                "size-6 font-bold rounded-full mr-3 mt-0.5 shrink-0",
                getRankColor(index + 1),
              )}
            >
              {index + 1}
            </span>
            <img
              src={getPictogramSrcForReconversionProjectTemplate(type)}
              height={44}
              className="h-10 w-auto"
              aria-hidden="true"
              alt=""
            />

            <div className="flex flex-col gap-0.5 mb-0">
              {getLabelForReconversionProjectTemplate(type)}

              <span
                className={classNames(
                  getCompatibilityScoreBackgroundColor(compatibilityScore),
                  fr.cx("fr-badge", "fr-badge--sm"),
                )}
              >
                {getTextForCompatibilityScore(compatibilityScore)}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </FormInfo>
  );
}

function ProjectTypesForm({
  onSubmit,
  onBack,
  initialValues,
  allowedDevelopmentPlanCategories,
  projectSuggestions,
}: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });
  const validationError = formState.errors.developmentPlanCategory;

  const options = developmentPlanCategorySchema.options
    .filter((option) => allowedDevelopmentPlanCategories.includes(option))
    .map((option) => {
      return {
        value: option,
        label: getLabelForDevelopmentPlanCategory(option),
      };
    });

  return (
    <WizardFormLayout
      title="Quel type de projet souhaitez-vous évaluer ?"
      instructions={
        projectSuggestions ? (
          <MutabilitySuggestions projectSuggestions={projectSuggestions} />
        ) : undefined
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <TileFormFieldsWrapper>
          {options.map(({ value, label }) => {
            return (
              <TileFormFieldWrapper key={value}>
                <Controller
                  control={control}
                  name="developmentPlanCategory"
                  rules={{ required: "Veuillez sélectionner un type de projet." }}
                  render={({ field }) => {
                    const isSelected = field.value === value;
                    return (
                      <DevelopmentPlanCategoryTile
                        developmentPlanCategory={value}
                        title={label}
                        isSelected={isSelected}
                        onSelect={() => {
                          field.onChange(value);
                        }}
                      />
                    );
                  }}
                />
              </TileFormFieldWrapper>
            );
          })}

          <TileFormFooterWrapper tileCount={options.length}>
            {validationError && (
              <p className={fr.cx("fr-error-text", "fr-mb-2w")}>{validationError.message}</p>
            )}
            <BackNextButtonsGroup
              onBack={onBack}
              nextLabel="Valider"
              disabled={!formState.isValid}
            />
          </TileFormFooterWrapper>
        </TileFormFieldsWrapper>
      </form>
    </WizardFormLayout>
  );
}

export default ProjectTypesForm;
