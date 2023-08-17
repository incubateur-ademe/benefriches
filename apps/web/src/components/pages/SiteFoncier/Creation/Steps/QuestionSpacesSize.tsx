import { routes } from "@/router";
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { useCallback, useContext, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormDataContext } from "../StateProvider";
import { SPACES_LABELS } from "../constants";

type FormValues = {
  [key: string]: string;
};

const STATE_RELATED_MESSAGE =
  "Plusieurs réponses sont possibles. Si vous ne savez pas qualifier des espaces de la friche, sélectionner « Autre / NSP ». Vous pourrez revenir plus tard préciser votre réponse.";

function SiteFoncierCreationQuestionSpacesSize() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { spacesKinds } = useContext(FormDataContext);

  const stateRelatedMessage = useMemo(
    () => (errors.spacesKinds ? STATE_RELATED_MESSAGE : undefined),
    [errors.spacesKinds],
  );

  const onSubmit: SubmitHandler<FormValues> = useCallback((data) => {
    console.log(data);
    routes.siteFoncierForm({ question: "confirmation" }).push();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Quelles sont les superficies des différents espaces ?</h2>

      {spacesKinds.map((key) => (
        <Input
          label={SPACES_LABELS[key]}
          hintText="Superficie en m²"
          state="default"
          stateRelatedMessage={stateRelatedMessage}
          key={key}
          nativeInputProps={{
            ...register(key),
            inputMode: "numeric",
            pattern: "[0-9]*",
            type: "number",
            placeholder: "5000",
          }}
        />
      ))}

      <ButtonsGroup
        buttonsEquisized
        inlineLayoutWhen="always"
        buttons={[
          {
            children: "Retour",
            linkProps: routes.siteFoncierForm({ question: "espaces.types" })
              .link,
            priority: "secondary",
          },
          {
            children: "Suivant",
            nativeButtonProps: {
              type: "submit",
            },
          },
        ]}
      />
    </form>
  );
}

export default SiteFoncierCreationQuestionSpacesSize;
