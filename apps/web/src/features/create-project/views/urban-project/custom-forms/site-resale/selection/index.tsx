import { requestStepCompletion } from "@/features/create-project/core/urban-project/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useStepBack } from "../../useStepBack";
import SiteResaleForm from "./SiteResaleForm";

export default function SiteResaleFormContainer() {
  const dispatch = useAppDispatch();
  const { siteResalePlannedAfterDevelopment } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_SITE_RESALE_SELECTION")) ?? {};

  const onBack = useStepBack();
  return (
    <SiteResaleForm
      onSubmit={(formData) => {
        dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
            answers: {
              siteResalePlannedAfterDevelopment: formData.siteResalePlanned === "yes",
            },
          }),
        );
      }}
      onBack={onBack}
      initialValues={
        siteResalePlannedAfterDevelopment === undefined
          ? undefined
          : { siteResalePlanned: siteResalePlannedAfterDevelopment ? "yes" : "no" }
      }
    />
  );
}
