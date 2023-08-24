import { useForm } from "react-hook-form";

import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup";
import { routes } from "@/router";
import { SITE_KINDS, SiteKindsType } from "../../constants";
import { useContext, useMemo } from "react";
import { FormDataContext } from "../StateProvider";

const STATE_RELATED_MESSAGE =
  "Cette information est requise pour la suite du questionnaire.";

type FormValues = {
  siteKind: SiteKindsType | undefined;
};

function SiteFoncierCreationQuestionKind() {
  const { setKind, kind } = useContext(FormDataContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      siteKind: kind,
    },
  });

  const stateRelatedMessage = useMemo(
    () => (errors.siteKind ? STATE_RELATED_MESSAGE : undefined),
    [errors.siteKind],
  );

  const options = SITE_KINDS.map((value) => ({
    label: value.charAt(0).toUpperCase() + value.slice(1),
    nativeInputProps: { value, ...register("siteKind", { required: true }) },
  }));

  const onSubmit = handleSubmit(({ siteKind }) => {
    if (!siteKind) {
      return;
    }
    setKind(siteKind);
    const question = siteKind !== "friche" ? "construction" : "adresse";
    routes.createSiteFoncier({ question }).push();
  });

  return (
    <form onSubmit={onSubmit}>
      <h2>De quel type de site s’agit-il ?</h2>

      <RadioButtons
        options={options}
        stateRelatedMessage={stateRelatedMessage}
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
  );
}

export default SiteFoncierCreationQuestionKind;