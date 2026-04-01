import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { Controller, useForm } from "react-hook-form";
import { RenewableEnergyTemplate, type UrbanProjectTemplate } from "shared";

import {
  getLabelForUrbanProjectCategory,
  getPictogramForUrbanProjectCategory,
} from "@/features/projects/views/shared/urbanProjectCategory";
import { ClassValue } from "@/shared/views/clsx";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import Badge from "@/shared/views/components/Badge/Badge";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import TileFormFieldWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFieldWrapper";
import TileFormFieldsWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFieldsWrapper";
import TileFormFooterWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFooterWrapper";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import { getPictogramForRenewableEnergy } from "../../projectTypeLabelMapping";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack?: () => void;
  initialValues?: FormValues;
};

export type FormValues = {
  projectTemplate: UrbanProjectTemplate | RenewableEnergyTemplate;
};

type Option = {
  value: FormValues["projectTemplate"];
  title: string;
  description: string;
  imgSrc: string;
  badgeText?: string;
  badgeClassName?: ClassValue;
};

const options: Option[] = [
  {
    value: "RESIDENTIAL_NORMAL_AREA",
    title: getLabelForUrbanProjectCategory("RESIDENTIAL_NORMAL_AREA"),
    description: "Habitat individuel + petit collectif",
    imgSrc: getPictogramForUrbanProjectCategory("RESIDENTIAL_NORMAL_AREA"),
    badgeText: "40 logements / ha",
    badgeClassName: "bg-[#ECF2FF] text-[#5371AC]",
  },
  {
    value: "RESIDENTIAL_TENSE_AREA",
    title: getLabelForUrbanProjectCategory("RESIDENTIAL_TENSE_AREA"),
    description: "Habitat collectif, commerces, tertiaires, services et équipements de proximité",
    imgSrc: getPictogramForUrbanProjectCategory("RESIDENTIAL_TENSE_AREA"),
    badgeText: "200 logements / ha",
    badgeClassName: "bg-[#C2D5FF] text-[#212D45]",
  },

  {
    value: "NEW_URBAN_CENTER",
    title: getLabelForUrbanProjectCategory("NEW_URBAN_CENTER"),
    description: "Forte mixité fonctionnelle",
    imgSrc: getPictogramForUrbanProjectCategory("NEW_URBAN_CENTER"),
    badgeText: "115 logements / ha",
    badgeClassName: "bg-[#D6E3FF] text-[#3A4F79]",
  },
  {
    value: "PUBLIC_FACILITIES",
    title: getLabelForUrbanProjectCategory("PUBLIC_FACILITIES"),
    description: "Établissement public (type médiathèque) + espace vert + espace public",
    imgSrc: getPictogramForUrbanProjectCategory("PUBLIC_FACILITIES"),
  },
  {
    value: "RENATURATION",
    title: getLabelForUrbanProjectCategory("RENATURATION"),
    description: "Parc ou jardin public",
    imgSrc: getPictogramForUrbanProjectCategory("RENATURATION"),
    badgeClassName: "bg-[#D6E3FF] text-[#3A4F79]",
  },
  {
    value: "PHOTOVOLTAIC_POWER_PLANT",
    title: "Centrale photovoltaïque",
    description: "",
    imgSrc: `/img/pictograms/renewable-energy/${getPictogramForRenewableEnergy("PHOTOVOLTAIC_POWER_PLANT")}`,
  },
] as const;

function DemoProjectTemplate({ onSubmit, onBack, initialValues }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });
  const validationError = formState.errors.projectTemplate;

  return (
    <WizardFormLayout title="Quel type de projet demo souhaitez-vous évaluer ?" fullScreen>
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
