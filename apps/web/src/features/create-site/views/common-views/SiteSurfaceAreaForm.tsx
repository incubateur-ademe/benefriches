import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { convertSquareMetersToHectares, SiteNature } from "shared";

import { formatNumberFr } from "@/shared/core/format-number/formatNumber";
import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowDecimalsNumericInput from "@/shared/views/components/form/NumericInput/RowDecimalsNumericInput";
import { requiredNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues: Partial<FormValues>;
  siteNature?: SiteNature;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  instructions?: ReactNode;
};

type FormValues = {
  surfaceArea: number;
};

const getTitle = (siteNature: SiteNature | undefined) => {
  const baseTitle = `Quelle est la superficie totale`;
  switch (siteNature) {
    case "FRICHE":
      return `${baseTitle} de la friche ?`;
    case "AGRICULTURAL_OPERATION":
      return `${baseTitle} de l'exploitation ?`;
    case "NATURAL_AREA":
      return `${baseTitle} de l'espace naturel ?`;
    default:
      return `${baseTitle} du site ?`;
  }
};

function SiteSurfaceAreaForm({ initialValues, onSubmit, onBack, siteNature, instructions }: Props) {
  const { register, handleSubmit, watch } = useForm<FormValues>({ defaultValues: initialValues });

  const surface = watch("surfaceArea");

  return (
    <WizardFormLayout title={getTitle(siteNature)} instructions={instructions}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RowDecimalsNumericInput
          addonText={SQUARE_METERS_HTML_SYMBOL}
          label={<RequiredLabel label="Superficie totale" />}
          nativeInputProps={register("surfaceArea", requiredNumericFieldRegisterOptions)}
        />

        {!isNaN(surface) && (
          <p>
            💡 Soit <strong>{formatNumberFr(convertSquareMetersToHectares(surface))}</strong> ha.
          </p>
        )}

        <BackNextButtonsGroup onBack={onBack} disabled={!surface} />
      </form>
    </WizardFormLayout>
  );
}

export default SiteSurfaceAreaForm;
