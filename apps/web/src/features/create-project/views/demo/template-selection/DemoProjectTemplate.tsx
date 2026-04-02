import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { RenewableEnergyTemplate, type UrbanProjectTemplate } from "shared";

import { ProjectSuggestion } from "@/features/create-project/core/project.types";
import CompatibilityScoreBadge from "@/features/reconversion-compatibility/views/shared/CompatibilityScoreBadge";
import { ClassValue } from "@/shared/views/clsx";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import Badge from "@/shared/views/components/Badge/Badge";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import TileFormFieldWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFieldWrapper";
import TileFormFieldsWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFieldsWrapper";
import TileFormFooterWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFooterWrapper";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import {
  getLabelForReconversionProjectTemplate,
  getPictogramSrcForReconversionProjectTemplate,
} from "../../projectTypeLabelMapping";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack?: () => void;
  initialValues?: FormValues;
  projectSuggestions?: ProjectSuggestion[];
};

export type FormValues = {
  projectTemplate: UrbanProjectTemplate | RenewableEnergyTemplate;
};

type Option = {
  value: FormValues["projectTemplate"];
  title: string;
  description?: ReactNode;
  imgSrc: string;
  badgeText?: string;
  badgeClassName?: ClassValue;
};

const OPTIONS: Option[] = [
  {
    value: "RESIDENTIAL_NORMAL_AREA",
    title: getLabelForReconversionProjectTemplate("RESIDENTIAL_NORMAL_AREA"),
    description: "Habitat individuel + petit collectif",
    imgSrc: getPictogramSrcForReconversionProjectTemplate("RESIDENTIAL_NORMAL_AREA"),
    badgeText: "40 logements / ha",
    badgeClassName: "bg-[#ECF2FF] text-[#5371AC]",
  },
  {
    value: "RESIDENTIAL_TENSE_AREA",
    title: getLabelForReconversionProjectTemplate("RESIDENTIAL_TENSE_AREA"),
    description: "Habitat collectif, commerces, tertiaires, services et équipements de proximité",
    imgSrc: getPictogramSrcForReconversionProjectTemplate("RESIDENTIAL_TENSE_AREA"),
    badgeText: "200 logements / ha",
    badgeClassName: "bg-[#C2D5FF] text-[#212D45]",
  },

  {
    value: "NEW_URBAN_CENTER",
    title: getLabelForReconversionProjectTemplate("NEW_URBAN_CENTER"),
    description: "Forte mixité fonctionnelle",
    imgSrc: getPictogramSrcForReconversionProjectTemplate("NEW_URBAN_CENTER"),
    badgeText: "115 logements / ha",
    badgeClassName: "bg-[#D6E3FF] text-[#3A4F79]",
  },
  {
    value: "PUBLIC_FACILITIES",
    title: getLabelForReconversionProjectTemplate("PUBLIC_FACILITIES"),
    description: "Établissement public (type médiathèque) + espace vert + espace public",
    imgSrc: getPictogramSrcForReconversionProjectTemplate("PUBLIC_FACILITIES"),
  },
  {
    value: "RENATURATION",
    title: getLabelForReconversionProjectTemplate("RENATURATION"),
    description: "Parc ou jardin public",
    imgSrc: getPictogramSrcForReconversionProjectTemplate("RENATURATION"),
    badgeClassName: "bg-[#D6E3FF] text-[#3A4F79]",
  },
  {
    value: "PHOTOVOLTAIC_POWER_PLANT",
    title: getLabelForReconversionProjectTemplate("PHOTOVOLTAIC_POWER_PLANT"),
    imgSrc: getPictogramSrcForReconversionProjectTemplate("PHOTOVOLTAIC_POWER_PLANT"),
  },
] as const;

function DemoProjectTemplate({ onSubmit, onBack, initialValues, projectSuggestions = [] }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });
  const validationError = formState.errors.projectTemplate;

  const options: Option[] = [
    ...projectSuggestions.map(({ type, compatibilityScore }) => ({
      title: getLabelForReconversionProjectTemplate(type),
      value: type,
      imgSrc: getPictogramSrcForReconversionProjectTemplate(type),
      description: (
        <>
          {OPTIONS.find(({ value }) => type === value)?.description}
          <div className="pt-4">
            <CompatibilityScoreBadge score={compatibilityScore} compact />
          </div>
        </>
      ),
    })),
    ...OPTIONS.filter(({ value }) => !projectSuggestions.find(({ type }) => type === value)),
  ];

  return (
    <WizardFormLayout title="Quel type de projet démo souhaitez-vous évaluer ?" fullScreen>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TileFormFieldsWrapper>
          {options.map((option) => {
            return (
              <TileFormFieldWrapper key={option.value}>
                <Controller
                  control={control}
                  name="projectTemplate"
                  rules={{ required: "Veuillez sélectionner une typologie de projet." }}
                  render={({ field }) => {
                    const isSelected = field.value === option.value;
                    return (
                      <CheckableTile
                        title={option.title}
                        description={
                          option.badgeText ? (
                            <>
                              <div>{option.description}</div>

                              <Badge small className={["mt-2", option.badgeClassName]}>
                                {option.badgeText}
                              </Badge>
                            </>
                          ) : (
                            option.description
                          )
                        }
                        checked={isSelected}
                        onChange={() => {
                          field.onChange(option.value);
                        }}
                        imgSrc={option.imgSrc}
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
            {onBack ? (
              <BackNextButtonsGroup
                onBack={onBack}
                nextLabel="Valider"
                disabled={!formState.isValid}
              />
            ) : (
              <Button type="submit" className="float-right" disabled={!formState.isValid}>
                Valider
              </Button>
            )}
          </TileFormFooterWrapper>
        </TileFormFieldsWrapper>
      </form>
    </WizardFormLayout>
  );
}

export default DemoProjectTemplate;
