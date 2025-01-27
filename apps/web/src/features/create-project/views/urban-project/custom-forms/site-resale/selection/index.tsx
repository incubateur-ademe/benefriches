import {
  siteResaleChoiceCompleted,
  siteResaleChoiceReverted,
} from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { selectCreationData } from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteResaleForm from "./SiteResaleForm";

export default function SiteResaleFormContainer() {
  const dispatch = useAppDispatch();
  const initialValue = useAppSelector(selectCreationData).siteResalePlannedAfterDevelopment;
  const hasInitialValue = initialValue !== undefined;

  return (
    <SiteResaleForm
      initialValues={
        hasInitialValue
          ? {
              siteResalePlanned: initialValue ? "yes" : "no",
            }
          : undefined
      }
      onSubmit={(formData) => {
        dispatch(
          siteResaleChoiceCompleted({
            siteResalePlannedAfterDevelopment: formData.siteResalePlanned === "yes",
          }),
        );
      }}
      onBack={() => {
        dispatch(siteResaleChoiceReverted());
      }}
    />
  );
}
