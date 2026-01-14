import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import Select from "@codegouvfr/react-dsfr/SelectNext";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { SiteNature } from "shared";

type Props = {
  onSubmit: (formData: FormValues) => void;
  baseSiteNature: SiteNature;
  nativeSubmitButtonProps?: ButtonProps["nativeButtonProps"];
};

const COMPARE_SITE_OPTIONS = [
  {
    value: "FRICHE",
    label: "Ce projet sur une friche",
  },
  {
    value: "AGRICULTURAL_OPERATION",
    label: "Ce projet sur une exploitation agricole",
  },
  {
    value: "NATURAL_AREA",
    label: "Ce projet sur un espace de nature",
  },
] as const;

type FormValues = {
  comparisonSiteNature: "AGRICULTURAL_OPERATION" | "NATURAL_AREA" | "FRICHE";
};

function ImpactComparisonSelect({ onSubmit, baseSiteNature, nativeSubmitButtonProps }: Props) {
  const options = useMemo(
    () => COMPARE_SITE_OPTIONS.filter((siteNature) => siteNature.value !== baseSiteNature),
    [baseSiteNature],
  );

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { comparisonSiteNature: options[0]?.value },
  });

  return (
    <form className="flex gap-2 items-end" onSubmit={handleSubmit(onSubmit)}>
      <Select
        options={options.map(({ label, value }) => ({
          label,
          value,
        }))}
        label="Choix du scénario"
        nativeSelectProps={{
          ...register("comparisonSiteNature", {
            required: "Ce champ est requis",
          }),
          className: "mt-1",
        }}
        className="grow mb-0 [&>label]:text-sm"
      />
      <Button priority="primary" type="submit" nativeButtonProps={nativeSubmitButtonProps}>
        Comparer
      </Button>
    </form>
  );
}

export default ImpactComparisonSelect;
