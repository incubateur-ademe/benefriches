import Button from "@codegouvfr/react-dsfr/Button";
import Table from "@codegouvfr/react-dsfr/Table";
import { CSSProperties } from "react";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { getPositiveNegativeTextClassesFromValue } from "@/shared/views/classes/positiveNegativeTextClasses";
import classNames from "@/shared/views/clsx";

// oxlint-disable-next-line no-unassigned-import
import "./ModalTable.css";

type Props = {
  caption: string;
  data: {
    color?: string;
    label: string;
    actor?: string;
    value: number;
    onClick: () => void;
  }[];
  formatFn?: (value: number) => string;
};

export const BagdeLabel = ({ label, color }: { label: string; color: string }) => (
  <span className="flex items-center gap-1" key={label}>
    <span
      className={classNames("mr-2", "inline-flex", "min-h-5", "min-w-5", "rounded-sm")}
      aria-hidden="true"
      style={
        {
          backgroundColor: color,
        } as CSSProperties
      }
    ></span>
    {label}
  </span>
);

export const Value = ({
  value,
  formatFn,
}: {
  value: number;
  formatFn: (value: number) => string;
}) => (
  <span className={classNames(getPositiveNegativeTextClassesFromValue(value), "font-bold")}>
    {formatFn(value)}
  </span>
);

const ModalTable = ({ data, caption, formatFn = formatMonetaryImpact }: Props) => {
  const hasActors = data.some(({ actor }) => actor);

  if (hasActors) {
    return (
      <Table
        className="impact-modal-table"
        caption={caption}
        noCaption
        bordered
        headers={["Gain ou perte", "Bénéficiaire", "Montant", "Détail"]}
        data={data.map(({ label, value, color, onClick, actor }, index) => [
          <BagdeLabel
            key={label}
            label={label}
            color={color ?? `var(--highcharts-color-${index})`}
          />,
          actor,
          <Value key={`${label}-value`} value={value} formatFn={formatFn} />,
          <Button priority="tertiary no outline" size="small" key={label} onClick={onClick}>
            Voir+
          </Button>,
        ])}
      />
    );
  }

  return (
    <Table
      className="impact-modal-table impact-modal-table-3col"
      caption={caption}
      noCaption
      bordered
      headers={["Gain ou perte", "Montant", "Détail"]}
      data={data.map(({ label, value, color, onClick }, index) => [
        <BagdeLabel
          key={label}
          label={label}
          color={color ?? `var(--highcharts-color-${index})`}
        />,
        <Value key={`${label}-value`} value={value} formatFn={formatFn} />,
        <Button priority="tertiary no outline" size="small" key={label} onClick={onClick}>
          Voir+
        </Button>,
      ])}
    />
  );
};

export default ModalTable;
