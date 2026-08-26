import { fr } from "@codegouvfr/react-dsfr";
import { Link } from "type-route";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import classNames from "@/shared/views/clsx";

import { BagdeLabel, Value } from "./ModalTable";
// oxlint-disable-next-line no-unassigned-import
import "./ModalTable.css";

type Props = {
  caption: string;
  data: {
    label: string;
    linkProps?: Link;
    total: number;
    values: {
      color?: string;
      label: string;
      actor?: string;
      value: number;
      linkProps?: Link;
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
          {data.flatMap(({ values, label, total, linkProps }, index) => [
            <tr key={label} className="bg-(--background-contrast-grey)">
              <td className="uppercase">{label}</td>
              <td>
                <Value key={`${label}-value`} value={total} formatFn={formatFn} />
              </td>
              <td>
                {linkProps && (
                  <a
                    className={fr.cx("fr-btn", "fr-btn--sm", "fr-btn--tertiary-no-outline")}
                    key={label}
                    {...linkProps}
                  >
                    Voir+
                  </a>
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
                  {row.linkProps && (
                    <a
                      className={fr.cx("fr-btn", "fr-btn--sm", "fr-btn--tertiary-no-outline")}
                      key={label}
                      {...row.linkProps}
                    >
                      Voir+
                    </a>
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
