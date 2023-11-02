import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";

type Props = {
  onSubmit: (data: FormValues) => void;
};

export type FormValues = {
  reinstatementContractOwner: string;
};

const requiredMessage = "Champ requis";

const options = [
  {
    label: "Mon entreprise",
    value: "user_company",
  },
  {
    label: "La collectivité",
    value: "local_or_regional_authority",
  },
  {
    label: "Établissement public foncier",
    value: "public_land_institution",
  },
  {
    label: "Autre",
    value: "other",
  },
];

function SiteReinstatementContractOwnerForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();

  return (
    <>
      <h2>
        Qui sera le maître d’ouvrage des travaux de remise en état de la friche
        ?
      </h2>
      <p>
        Les travaux de remise en état incluent la désimperméabimisation des
        sols, la dépollution, l’enlèvement des déchets, la déconstruction, etc.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("reinstatementContractOwner", {
            required: requiredMessage,
          })}
          options={options}
          error={formState.errors.reinstatementContractOwner}
        />
        <ButtonsGroup
          buttonsEquisized
          inlineLayoutWhen="always"
          buttons={[
            {
              children: "Suivant",
              nativeButtonProps: { type: "submit" },
            },
          ]}
        />
      </form>
    </>
  );
}

export default SiteReinstatementContractOwnerForm;
