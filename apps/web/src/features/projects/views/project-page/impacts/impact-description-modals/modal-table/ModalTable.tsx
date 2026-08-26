import { fr } from "@codegouvfr/react-dsfr";
import Table from "@codegouvfr/react-dsfr/Table";
import { CSSProperties, ReactNode } from "react";
import { Link } from "type-route";

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
    linkProps?: Link;
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

const mapDataToTableRow = (
  { label, value, color, linkProps, actor }: Props["data"][number],
  index: number,
  formatFn: (value: number) => string,
  { hasActors, hasLinks }: { hasActors: boolean; hasLinks: boolean },
) => {
  const row: ReactNode[] = hasActors
    ? [
        <BagdeLabel
          key={label}
          label={label}
          color={color ?? `var(--highcharts-color-${index})`}
        />,
        actor,
        <Value key={`${label}-value`} value={value} formatFn={formatFn} />,
      ]
    : [
        <BagdeLabel
          key={label}
          label={label}
          color={color ?? `var(--highcharts-color-${index})`}
        />,
        <Value key={`${label}-value`} value={value} formatFn={formatFn} />,
      ];

  if (hasLinks) {
    row.push(
      linkProps ? (
        <a
          className={fr.cx("fr-btn", "fr-btn--sm", "fr-btn--tertiary-no-outline")}
          key={label}
          {...linkProps}
        >
          Voir+
        </a>
      ) : null,
    );
  }

  return row;
};

const ModalTable = ({ data, caption, formatFn = formatMonetaryImpact }: Props) => {
  const hasActors = data.some(({ actor }) => actor);
  const hasLinks = data.some(({ linkProps }) => linkProps);

  const tableData = data.map((item, index) =>
    mapDataToTableRow(item, index, formatFn, { hasActors, hasLinks }),
  );

  if (hasActors) {
    return (
      <Table
        className="impact-modal-table"
        caption={caption}
        noCaption
        bordered
        headers={
          hasLinks
            ? ["Gain ou perte", "Bénéficiaire", "Montant", "Détail"]
            : ["Gain ou perte", "Bénéficiaire", "Montant"]
        }
        data={tableData}
      />
    );
  }

  return (
    <Table
      className="impact-modal-table impact-modal-table-3col"
      caption={caption}
      noCaption
      bordered
      headers={hasLinks ? ["Gain ou perte", "Montant", "Détail"] : ["Gain ou perte", "Montant"]}
      data={tableData}
    />
  );
};

export default ModalTable;
