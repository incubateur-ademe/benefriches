import HasSiteOperatorForm, { FormValues } from "./HasSiteOperatorForm";

import { revertHasOperatorStep } from "@/features/create-site/application/createSite.actions";
import { completeHasOperator } from "@/features/create-site/application/createSite.reducer";
import { Operator, Owner } from "@/features/create-site/domain/siteFoncier.types";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const convertFormValuesForStore = (
  data: FormValues,
  owner?: Owner,
): { hasOperator: boolean; operator?: Operator } => {
  switch (data.operatorCategory) {
    case "owner":
      return { hasOperator: true, operator: owner ?? { structureType: "unknown", name: "" } };
    case "other":
      return { hasOperator: true };
    case "unknown":
      return { hasOperator: false, operator: { structureType: "unknown", name: "" } };
  }
};

function HasSiteOperatorFormContainer() {
  const dispatch = useAppDispatch();
  const siteOwner = useAppSelector((state) => state.siteCreation.siteData.owner);

  const onSubmit = (data: FormValues) => {
    dispatch(completeHasOperator(convertFormValuesForStore(data, siteOwner)));
  };

  const onBack = () => {
    dispatch(revertHasOperatorStep());
  };

  return (
    <HasSiteOperatorForm siteOwnerName={siteOwner?.name} onSubmit={onSubmit} onBack={onBack} />
  );
}

export default HasSiteOperatorFormContainer;
