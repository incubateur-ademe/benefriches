import { useForm } from "react-hook-form";

import { routes } from "@/router";
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { SURFACE_KINDS, SurfaceKindsType } from "../../constants";
import { useContext, useMemo } from "react";
import { FormDataContext } from "../StateProvider";

type FormValues = {
  surfaceKinds: Array<SurfaceKindsType>;
};

const STATE_RELATED_MESSAGE =
  "Plusieurs réponses sont possibles. Si vous ne savez pas qualifier des espaces de la friche, sélectionner « Autre / NSP ». Vous pourrez revenir plus tard préciser votre réponse.";

function SiteFoncierCreationQuestionSurfacesKind() {
  const { surfaceKinds, setSurfaceKinds } = useContext(FormDataContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      surfaceKinds,
    },
  });

  const stateRelatedMessage = useMemo(
    () => (errors.surfaceKinds ? STATE_RELATED_MESSAGE : undefined),
    [errors.surfaceKinds],
  );

  const options = Object.keys(SURFACE_KINDS).map((key) => ({
    label: SURFACE_KINDS[key as SurfaceKindsType].label,
    nativeInputProps: {
      value: key,
      ...register("surfaceKinds", { required: true }),
    },
  }));

  const onSubmit = handleSubmit(({ surfaceKinds }) => {
    setSurfaceKinds(surfaceKinds);
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

export default SiteFoncierCreationQuestionSurfacesKind;
