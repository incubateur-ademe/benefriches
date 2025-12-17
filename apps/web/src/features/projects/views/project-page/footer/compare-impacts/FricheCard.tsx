import Button from "@codegouvfr/react-dsfr/Button";
import Select from "@codegouvfr/react-dsfr/SelectNext";
import { useForm } from "react-hook-form";
import { SiteNature } from "shared";

type Props = {
  onSelectOption: (comparisonSiteNature: SiteNature) => void;
};

const COMPARE_SITE_OPTIONS = [
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
  comparisonSiteNature: "AGRICULTURAL_OPERATION" | "NATURAL_AREA";
};

function FricheComparisonSectionCard({ onSelectOption }: Props) {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { comparisonSiteNature: "AGRICULTURAL_OPERATION" },
  });
  return (
    <section className="bg-[#D8EFD7] dark:bg-[#40843E] rounded-lg mt-6 p-6 flex flex-col justify-between">
      <h4 className="mb-2">Comparer les impacts du projet avec un autre scénario</h4>
      <form
        className="flex gap-2 items-end"
        onSubmit={handleSubmit((formData) => {
          onSelectOption(formData.comparisonSiteNature);
        })}
      >
        <Select
          options={COMPARE_SITE_OPTIONS.map(({ label, value }) => ({
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
        <Button priority="primary" type="submit">
          Comparer
        </Button>
      </form>
    </section>
  );
}

export default FricheComparisonSectionCard;
