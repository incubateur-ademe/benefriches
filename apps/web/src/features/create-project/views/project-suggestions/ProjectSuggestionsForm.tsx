import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { Controller, useForm } from "react-hook-form";
import { ReconversionProjectTemplate } from "shared";

import {
  getLabelForUrbanProjectCategory,
  getPictogramForUrbanProjectCategory,
} from "@/features/projects/views/shared/urbanProjectCategory";
import {
  getCompatibilityScoreBackgroundColor,
  getTextForCompatibilityScore,
} from "@/features/reconversion-compatibility/core/score";
import classNames from "@/shared/views/clsx";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import TileFormFooterWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFooterWrapper";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import { ProjectSuggestion } from "../../core/project.types";

const getLabelForReconversionProjectTemplate = (template: ReconversionProjectTemplate): string => {
  if (template === "PHOTOVOLTAIC_POWER_PLANT") {
    return "Centrale photovoltaïque";
  }
  return getLabelForUrbanProjectCategory(template);
};

const getUsagePictogramSrc = (usage: ReconversionProjectTemplate): string => {
  if (usage === "PHOTOVOLTAIC_POWER_PLANT")
    return "/img/pictograms/development-plans/renewable-energy-production.svg";

  return getPictogramForUrbanProjectCategory(usage);
};

type Option =
  | {
      title: string;
      compatibilityScore: number;
      value: ReconversionProjectTemplate;
    }
  | {
      title: string;
      value: "ignore-suggestions";
    };

export type FormValues = {
  selectedOption: Option["value"];
};

type Props = {
  onSubmit: (data: FormValues) => void;
  projectSuggestions: ProjectSuggestion[];
};

function ProjectSuggestionsForm({ projectSuggestions, onSubmit }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { selectedOption: undefined },
  });

  const validationError = formState.errors.selectedOption;

  const options: Option[] = [
    ...projectSuggestions.map(({ type, compatibilityScore }) => ({
      title: getLabelForReconversionProjectTemplate(type),
      compatibilityScore,
      value: type,
    })),
    { title: "Autre projet ou projet sur mesure", value: "ignore-suggestions" },
  ];

  return (
    <WizardFormLayout title="Quel type de projet souhaitez-vous évaluer&nbsp;?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {options.map((option) => (
            <Controller
              control={control}
              name="selectedOption"
              rules={{ required: "Veuillez sélectionner un type de projet." }}
              key={option.value}
              render={({ field }) => {
                const isSelected = field.value === option.value;
                return (
                  <CheckableTile
                    title={option.title}
                    checked={isSelected}
                    onChange={() => {
                      field.onChange(option.value);
                    }}
                    description={
                      option.value === "ignore-suggestions" ? (
                        "Renseignez votre propre projet, qu'il soit projet urbain, centrale photovoltaïque, espace de nature, etc."
                      ) : (
                        <div className="pt-4">
                          <div
                            className={classNames(
                              getCompatibilityScoreBackgroundColor(option.compatibilityScore),
                              "py-2 px-4 inline rounded-lg text-xs font-bold",
                            )}
                          >
                            <span>{option.compatibilityScore.toFixed(0)}%</span>
                            <span className="border-l border-black h-full opacity-25 mx-2" />
                            <span>{getTextForCompatibilityScore(option.compatibilityScore)}</span>
                          </div>
                        </div>
                      )
                    }
                    imgSrc={
                      option.value === "ignore-suggestions"
                        ? "/img/pictograms/creation-mode/custom-creation.svg"
                        : getUsagePictogramSrc(option.value)
                    }
                  />
                );
              }}
            />
          ))}
        </div>
        <TileFormFooterWrapper tileCount={options.length}>
          {validationError && <p className={fr.cx("fr-error-text")}>{validationError.message}</p>}
          <Button
            className="float-right"
            nativeButtonProps={{ type: "submit", disabled: !formState.isValid }}
          >
            Valider
          </Button>
        </TileFormFooterWrapper>
      </form>
    </WizardFormLayout>
  );
}

export default ProjectSuggestionsForm;
