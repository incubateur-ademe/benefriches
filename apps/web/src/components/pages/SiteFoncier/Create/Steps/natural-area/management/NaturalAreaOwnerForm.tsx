import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { Input } from "@codegouvfr/react-dsfr/Input";

import { OwnerType } from "@/components/pages/SiteFoncier/siteFoncier";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = Record<OwnerType, boolean> & {
  agriculturalCompanyName: string;
};

function NaturalAreaOwnerForm({ onSubmit, onBack }: Props) {
  const { register, handleSubmit, watch } = useForm<FormValues>();

  const hasAgriculturalCompanyOwner =
    watch(OwnerType.AGRICULTURAL_COMPANY) === true;

  return (
    <>
      <h2>Qui est le propriétaire de cet espace naturel ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Checkbox
          options={[
            {
              label: "Une entreprise agricole",
              nativeInputProps: register(OwnerType.AGRICULTURAL_COMPANY),
            },
          ]}
        />
        {hasAgriculturalCompanyOwner && (
          <Input
            label=""
            nativeInputProps={{
              placeholder: "Nom de l'entreprise",
              ...register("agriculturalCompanyName", {
                required: "Ce champ est requis",
              }),
            }}
          />
        )}
        <Checkbox
          options={[
            {
              label: "La collectivité",
              nativeInputProps: register(OwnerType.LOCAL_OR_REGIONAL_AUTHORITY),
            },
          ]}
        />
        <Checkbox
          options={[
            { label: "Autre/NSP", nativeInputProps: register(OwnerType.OTHER) },
          ]}
        />
        <ButtonsGroup
          buttonsEquisized
          inlineLayoutWhen="always"
          buttons={[
            {
              children: "Retour",
              onClick: onBack,
              priority: "secondary",
              nativeButtonProps: { type: "button" },
            },
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

export default NaturalAreaOwnerForm;
