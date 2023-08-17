import { useForm } from "react-hook-form";

import { routes } from "@/router";
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { SPACES_KEYS, SPACES_LABELS } from "../constants";
import { useContext, useMemo } from "react";
import { FormDataContext } from "../StateProvider";

type FormValues = {
  spacesKinds: Array<(typeof SPACES_KEYS)[number]>;
};

const STATE_RELATED_MESSAGE =
  "Plusieurs réponses sont possibles. Si vous ne savez pas qualifier des espaces de la friche, sélectionner « Autre / NSP ». Vous pourrez revenir plus tard préciser votre réponse.";

function SiteFoncierCreationQuestionSpacesKind() {
  const { spacesKinds, setSpacesKinds } = useContext(FormDataContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      spacesKinds,
    },
  });

  const stateRelatedMessage = useMemo(
    () => (errors.spacesKinds ? STATE_RELATED_MESSAGE : undefined),
    [errors.spacesKinds],
  );

  const options = Object.entries(SPACES_LABELS).map(([key, value]) => ({
    label: value,
    nativeInputProps: {
      value: key,
      ...register("spacesKinds", { required: true }),
    },
  }));

  const onSubmit = handleSubmit(({ spacesKinds }) => {
    setSpacesKinds(spacesKinds);
    routes.siteFoncierForm({ question: "espaces.surfaces" }).push();
  });

  return (
    <form onSubmit={onSubmit}>
      <h2>Quels espaces y a t-il sur cette friche ?</h2>

      <Checkbox
        legend="Quels espaces y a t-il sur cette friche ?"
        options={options}
        state="default"
        stateRelatedMessage={stateRelatedMessage}
      />

      <ButtonsGroup
        buttonsEquisized
        inlineLayoutWhen="always"
        buttons={[
          {
            children: "Retour",
            linkProps: routes.siteFoncierForm({ question: "adresse" }).link,
            priority: "secondary",
          },
          {
            children: "Suivant",
            nativeButtonProps: { type: "submit" },
          },
        ]}
      />
    </form>
  );
}

export default SiteFoncierCreationQuestionSpacesKind;
