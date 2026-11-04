import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons";

import Badge from "@/shared/views/components/Badge/Badge";

import type { ExportOption } from "./exportModal.types";

function UnavailableExportOption({ label }: { label: string }) {
  return (
    <span>
      <span>{label}</span>
      <Badge small className="ml-3" style="green-tilleul">
        Bientôt disponible
      </Badge>
    </span>
  );
}

type Props = {
  value: ExportOption | undefined;
  onChange: (option: ExportOption) => void;
};

export default function ExportFormatSelector({ value, onChange }: Props) {
  return (
    <RadioButtons
      legend="Dans quel format souhaitez-vous télécharger les impacts du projet ?"
      options={[
        {
          label: "PDF",
          nativeInputProps: {
            checked: value === "pdf",
            onChange: () => {
              onChange("pdf");
            },
          },
        },
        {
          label: <UnavailableExportOption label="Tableur Excel" />,
          nativeInputProps: {
            checked: value === "excel",
            onChange: () => {
              onChange("excel");
            },
            disabled: true,
          },
        },
        {
          label: <UnavailableExportOption label="Lien à partager" />,
          nativeInputProps: {
            checked: value === "sharing_link",
            onChange: () => {
              onChange("sharing_link");
            },
            disabled: true,
          },
        },
      ]}
    />
  );
}
