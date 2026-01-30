import { fr } from "@codegouvfr/react-dsfr";
import { Controller, useForm } from "react-hook-form";
import { type UrbanProjectUse } from "shared";

import {
  getDescriptionForUrbanProjectUse,
  getLabelForUrbanProjectUse,
  getPictogramUrlForUrbanProjectUse,
} from "@/features/create-project/core/urban-project/urbanProject";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type FormValues = {
  uses: UrbanProjectUse[];
};

type Props = {
  initialValues: UrbanProjectUse[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type UseOptionsByCategory = { category: string; options: UrbanProjectUse[] }[];

const options = [
  {
    category: "Espaces publics",
    options: ["PUBLIC_GREEN_SPACES", "OTHER_PUBLIC_SPACES"],
  },
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
    category: "Établissements éducatifs",
    options: ["KINDERGARTEN_OR_PRIMARY_SCHOOL", "SECONDARY_SCHOOL", "OTHER_EDUCATIONAL_FACILITY"],
  },
  {
    category: "Structures sanitaires et sociales",
    options: ["LOCAL_HEALTH_SERVICE", "HOSPITAL", "MEDICAL_SOCIAL_FACILITY"],
  },
  {
    category: "Loisirs, sports et culture",
    options: [
      "OTHER_CULTURAL_PLACE",
      "CINEMA",
      "MUSEUM",
      "THEATER",
      "RECREATIONAL_FACILITY",
      "SPORTS_FACILITIES",
    ],
  },
  {
    category: "Autres équipements",
    options: ["PUBLIC_FACILITIES", "MULTI_STORY_PARKING", "OTHER_BUILDING"],
  },
] as const satisfies UseOptionsByCategory;

type UseTileProps = {
  use: UrbanProjectUse;
  isSelected: boolean;
  onChange: () => void;
};

const UseTile = ({ use, isSelected, onChange }: UseTileProps) => {
  const title = getLabelForUrbanProjectUse(use);
  const imgSrc = getPictogramUrlForUrbanProjectUse(use);
  const description = getDescriptionForUrbanProjectUse(use);

  return (
    <CheckableTile
      title={title}
      description={description}
      imgSrc={imgSrc}
      checked={isSelected}
      onChange={onChange}
      checkType="checkbox"
    />
  );
};

function UsesSelection({ initialValues, onSubmit, onBack }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { uses: initialValues },
  });

  const validationError = formState.errors.uses;

  return (
    <WizardFormLayout
      title="Quels usages offrira le projet urbain&nbsp;?"
      instructions={
        <FormInfo>
          <p>Plusieurs réponses possibles.</p>
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {options.map(({ category, options: categoryOptions }) => {
          return (
            <section key={category} className="mb-10">
              <h4>{category}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryOptions.map((option) => {
                  return (
                    <div key={option}>
                      <Controller
                        control={control}
                        name="uses"
                        rules={{ required: "Veuillez sélectionner au moins un usage." }}
                        render={({ field }) => {
                          const isSelected = field.value.includes(option);
                          return (
                            <UseTile
                              use={option}
                              isSelected={isSelected}
                              onChange={() => {
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

export default UsesSelection;
