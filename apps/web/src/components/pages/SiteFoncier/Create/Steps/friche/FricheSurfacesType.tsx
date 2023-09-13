import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { FricheSurfaceType } from "../../../siteFoncier";

import { getSurfaceTypeLabel } from "@/helpers/getLabelForValue";

type FormValues = Record<FricheSurfaceType, boolean>;

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

function SiteFoncierCreationStepFricheSurfacesType({
  onSubmit,
  onBack,
}: Props) {
  const { register, handleSubmit } = useForm<FormValues>();

  const options = Object.values(FricheSurfaceType).map((key) => ({
    label: getSurfaceTypeLabel(key),
    nativeInputProps: register(key),
  }));

  return (
    <>
      <h2>Quels espaces y a-t-il sur cette friche ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Checkbox options={options} />
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

export default SiteFoncierCreationStepFricheSurfacesType;
