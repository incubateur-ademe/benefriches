import { typedObjectEntries } from "shared";
import {
  completePhotovoltaicPanelsInstallationCost,
  revertPhotovoltaicPanelsInstallationCost,
} from "../../../application/createProject.reducer";
import PhotovoltaicPanelsInstallationCostsForm, {
  FormValues,
} from "./PhotoVoltaicPanelsInstallationCostsForm";

import { AppDispatch } from "@/app/application/store";
import { getDefaultValuesForPhotovoltaicInstallationCosts } from "@/features/create-project/application/createProject.selectors";
import { PhotovoltaicInstallationCost } from "@/shared/domain/reconversionProject";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapFormValuesToPhotovoltaicInstallationCosts = (
  formData: FormValues,
): PhotovoltaicInstallationCost[] => {
  const costs: PhotovoltaicInstallationCost[] = [];
  typedObjectEntries(formData).forEach(([purpose, amount]) => {
    if (!amount) return;
    switch (purpose) {
      case "technicalStudyAmount":
        costs.push({ amount: amount, purpose: "technical_studies" });
        break;
      case "worksAmount":
        costs.push({ amount: amount, purpose: "installation_works" });
        break;
      case "otherAmount":
        costs.push({ amount: amount, purpose: "other" });
        break;
      default:
        break;
    }
  });
  return costs;
};

const mapProps = (
  dispatch: AppDispatch,
  defaultValues?: { works: number; technicalStudy: number; other: number },
) => {
  return {
    defaultValues,
    onSubmit: (formData: FormValues) => {
      const costs = mapFormValuesToPhotovoltaicInstallationCosts(formData);
      dispatch(completePhotovoltaicPanelsInstallationCost(costs));
    },
    onBack: () => {
      dispatch(revertPhotovoltaicPanelsInstallationCost());
    },
  };
};

function PhotovoltaicPanelsInstallationCostsFormContainer() {
  const dispatch = useAppDispatch();
  const defaultValues = useAppSelector(getDefaultValuesForPhotovoltaicInstallationCosts);

  return <PhotovoltaicPanelsInstallationCostsForm {...mapProps(dispatch, defaultValues)} />;
}

export default PhotovoltaicPanelsInstallationCostsFormContainer;
