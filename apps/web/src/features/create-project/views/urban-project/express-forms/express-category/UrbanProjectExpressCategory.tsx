import { fr } from "@codegouvfr/react-dsfr";
import { Controller, useForm } from "react-hook-form";

import { ClassValue } from "@/shared/views/clsx";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import Badge from "@/shared/views/components/Badge/Badge";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import TileFormFieldWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFieldWrapper";
import TileFormFieldsWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFieldsWrapper";
import TileFormFooterWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFooterWrapper";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  expressCategory:
    | "PUBLIC_FACILITIES"
    | "RESIDENTIAL_TENSE_AREA"
    | "RESIDENTIAL_NORMAL_AREA"
    | "NEW_URBAN_CENTER";
};

type Option = {
  value: FormValues["expressCategory"];
  title: string;
  description: string;
  imgSrc: string;
  badgeText?: string;
  badgeClassName?: ClassValue;
};

const options: Option[] = [
  {
    value: "PUBLIC_FACILITIES",
    title: "Équipement public",
    description: "Établissement public (type médiathèque) + espace vert + espace public",
    imgSrc: "/img/pictograms/express-urban-categories/equipement-public.svg",
  },
  {
    value: "RESIDENTIAL_NORMAL_AREA",
    title: "Résidentiel secteur détendu",
    description: "Habitat individuel + petit habitat collectif",
    imgSrc: "/img/pictograms/express-urban-categories/residentiel-secteur-detendu.svg",
    badgeText: "40 logements / ha",
    badgeClassName: "tw-bg-[#ECF2FF] tw-text-[#5371AC]",
  },
  {
    value: "RESIDENTIAL_TENSE_AREA",
    title: "Résidentiel secteur tendu",
    description: "Beaucoup d’habitat, quelques commerces, locaux tertiaires ou services",
    imgSrc: "/img/pictograms/express-urban-categories/residentiel-secteur-tendu.svg",
    badgeText: "200 logements / ha",
    badgeClassName: "tw-bg-[#C2D5FF] tw-text-[#212D45]",
  },

  {
    value: "NEW_URBAN_CENTER",
    title: "Centralité urbaine",
    description: "Un peu d’habitat, beaucoup de commerces, locaux tertiaires ou services",
    imgSrc: "/img/pictograms/express-urban-categories/nouvelle-centralite.svg",
    badgeText: "115 logements / ha",
    badgeClassName: "tw-bg-[#D6E3FF] tw-text-[#3A4F79]",
  },
] as const;

function UrbanProjectExpressCategory({ onSubmit, onBack }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>();
  const validationError = formState.errors.expressCategory;

  return (
    <WizardFormLayout title="De quel type de projet urbain s’agit-il ?" fullScreen>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TileFormFieldsWrapper>
          {options.map((option) => {
            return (
              <TileFormFieldWrapper key={option.value}>
                <Controller
                  control={control}
                  name="expressCategory"
                  rules={{ required: "Veuillez sélectionner une typologie de projet." }}
                  render={({ field }) => {
                    const isSelected = field.value === option.value;
                    return (
                      <CheckableTile
                        title={option.title}
                        description={
                          option.badgeText ? (
                            <>
                              {option.description}

                              <Badge small className={["tw-mt-2", option.badgeClassName]}>
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

export default UrbanProjectExpressCategory;
