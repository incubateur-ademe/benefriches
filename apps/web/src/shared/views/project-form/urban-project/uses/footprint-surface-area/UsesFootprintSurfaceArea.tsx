import type { SurfaceAreaDistributionJson, UrbanProjectUse } from "shared";

import {
  getDescriptionForUrbanProjectUse,
  getLabelForUrbanProjectUse,
  getPictogramUrlForUrbanProjectUse,
} from "@/features/create-project/core/urban-project/urbanProject";
import { useSurfaceAreaInputMode } from "@/features/create-project/views/useSurfaceAreaInputMode";
import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import SurfaceAreaDistributionForm from "@/shared/views/components/form/SurfaceAreaDistributionForm/SurfaceAreaDistributionForm";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

type Props = {
  initialValues: SurfaceAreaDistributionJson<UrbanProjectUse>;
  totalSurfaceArea: number;
  selectedUses: UrbanProjectUse[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = SurfaceAreaDistributionJson<UrbanProjectUse>;

function UsesFootprintSurfaceArea({
  selectedUses,
  initialValues,
  totalSurfaceArea,
  onSubmit,
  onBack,
}: Props) {
  const { inputMode, onInputModeChange } = useSurfaceAreaInputMode();
  return (
    <SurfaceAreaDistributionForm
      initialValues={initialValues}
      title="Quelle sera la superficie des emprises foncières dédiées aux différents usages&nbsp;?"
      instructions={
        <FormInfo>
          <p>
            L'emprise foncière correspond à la projection au sol de chaque usage. La surface totale
            du site est de <strong>{formatSurfaceArea(totalSurfaceArea)}</strong>.
          </p>
        </FormInfo>
      }
      inputMode={inputMode}
      onInputModeChange={onInputModeChange}
      onBack={onBack}
      onSubmit={onSubmit}
      totalSurfaceArea={totalSurfaceArea}
      maxErrorMessage="L'emprise foncière ne peut pas être supérieure à la superficie totale du site"
      surfaces={selectedUses.map((use) => ({
        name: use,
        label: getLabelForUrbanProjectUse(use),
        hintText: getDescriptionForUrbanProjectUse(use),
        imgSrc: getPictogramUrlForUrbanProjectUse(use),
      }))}
    />
  );
}

export default UsesFootprintSurfaceArea;
