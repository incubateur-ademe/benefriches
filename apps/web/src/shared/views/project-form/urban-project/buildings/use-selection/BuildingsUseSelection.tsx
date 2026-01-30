import { fr } from "@codegouvfr/react-dsfr";
import { Controller, useForm } from "react-hook-form";
import { BuildingsUse } from "shared";

import {
  getDescriptionForBuildingsUse,
  getPictogramUrlForBuildingsUse,
} from "@/features/create-project/core/urban-project/urbanProject";
import { getLabelForBuildingsUse } from "@/shared/core/urbanProject";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type FormValues = {
  buildingsUses: BuildingsUse[];
};

type Props = {
  initialValues?: FormValues;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type BuildingsUseOptionsByCategory = { category: string; options: BuildingsUse[] }[];

const options = [
  {
    category: "Logements",
    options: ["RESIDENTIAL"],
  },
  {
    category: "Lieux d'activité économique",
    options: [
      "LOCAL_STORE",
      "LOCAL_SERVICES",
      "OFFICES",
      "ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES",
    ],
  },
  {
    category: "Éducation",
    options: ["KINDERGARTEN_OR_PRIMARY_SCHOOL", "SECONDARY_SCHOOL", "OTHER_EDUCATIONAL_FACILITY"],
  },
  {
    category: "Santé",
    options: ["LOCAL_HEALTH_SERVICE", "HOSPITAL", "MEDICAL_SOCIAL_FACILITY"],
  },
  {
    category: "Loisir et culture",
    options: [
      "CULTURAL_PLACE",
      "CINEMA",
      "MUSEUM",
      "THEATER",
      "RECREATIONAL_FACILITY",
      "SPORTS_FACILITIES",
    ],
  },
  {
    category: "Autres équipements",
    options: ["PUBLIC_FACILITIES", "MULTI_STORY_PARKING", "OTHER"],
  },
] as const satisfies BuildingsUseOptionsByCategory;

type BuildingsUseTileProps = {
  buildingsUse: BuildingsUse;
  isSelected: boolean;
  onSelect: () => void;
};

const BuildingsUseTile = ({ buildingsUse, isSelected, onSelect }: BuildingsUseTileProps) => {
  const title: string = getLabelForBuildingsUse(buildingsUse);
  const description: string | undefined = getDescriptionForBuildingsUse(buildingsUse);
  const imgSrc = getPictogramUrlForBuildingsUse(buildingsUse);

  return (
    <CheckableTile
      title={title}
      description={description}
      imgSrc={imgSrc}
      checked={isSelected}
      onChange={onSelect}
      checkType="checkbox"
    />
  );
};

function BuildingsUseSelection({ initialValues, onSubmit, onBack }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: initialValues ?? { buildingsUses: [] },
  });

  const validationError = formState.errors.buildingsUses;

  return (
    <WizardFormLayout
      title="Quels usages offriront les lieux d'habitation et d'activité ?"
      instructions={
        <FormInfo>
          <p>Plusieurs réponses possibles.</p>
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {options.map(({ category, options }) => {
          return (
            <section key={category} className="mb-10">
              <h4>{category}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {options.map((option) => {
                  return (
                    <div key={option}>
                      <Controller
                        control={control}
                        name="buildingsUses"
                        rules={{ required: "Veuillez sélectionner au moins un usage." }}
                        render={({ field }) => {
                          const isSelected = field.value.includes(option);
                          return (
                            <BuildingsUseTile
                              buildingsUse={option}
                              isSelected={isSelected}
                              onSelect={() => {
                                field.onChange(
                                  isSelected
                                    ? field.value.filter((v) => v !== option)
                                    : [...field.value, option],
                                );
                              }}
                            />
                          );
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
        {validationError && (
          <p className={fr.cx("fr-error-text", "fr-mb-1-5v")}>{validationError.message}</p>
        )}
        <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default BuildingsUseSelection;
