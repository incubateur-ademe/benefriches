import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import classNames from "@/shared/views/clsx";

import { BagdeLabel, Value } from "./ModalTable";
// oxlint-disable-next-line no-unassigned-import
import "./ModalTable.css";

type Props = {
  caption: string;
  data: {
    label: string;
    onClick?: () => void;
    total: number;
    values: {
      color?: string;
      label: string;
      actor?: string;
      value: number;
      onClick?: () => void;
    }[];
  }[];
  formatFn?: (value: number) => string;
};

const ModalGroupTable = ({ data, caption, formatFn = formatMonetaryImpact }: Props) => {
  return (
    <div
      className={classNames(
        fr.cx("fr-table", "fr-table--no-caption", "fr-table--bordered"),
        "impact-modal-table",
      )}
    >
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {["Gain ou perte", "Montant", "Détail"].map((header, i) => (
              <th key={i} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.flatMap(({ values, label, total, onClick }, index) => [
            <tr key={label} className="bg-(--background-contrast-grey) uppercase">
              <td>{label}</td>
              <td>
                <Value key={`${label}-value`} value={total} formatFn={formatFn} />
              </td>
              <td>
                {onClick && (
                  <Button priority="tertiary no outline" size="small" onClick={onClick}>
                    Voir+
                  </Button>
                )}
              </td>
            </tr>,
            values.map((row) => (
              <tr key={row.label}>
                <td className="font-normal">
                  <BagdeLabel
                    key={row.label}
                    label={row.label}
                    color={row.color ?? `var(--highcharts-color-${index})`}
                  />
                </td>
                <td>
                  <Value key={`${row.label}-value`} value={row.value} formatFn={formatFn} />
                </td>
                <td>
                  {row.onClick && (
                    <Button priority="tertiary no outline" size="small" onClick={row.onClick}>
                      Voir+
                    </Button>
                  )}
                </td>
              </tr>
            )),
          ])}
        </tbody>
      </table>
    </div>
  );
};

export default ModalGroupTable;
