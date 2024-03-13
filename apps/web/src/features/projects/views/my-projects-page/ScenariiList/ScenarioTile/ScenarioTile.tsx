import Badge from "@codegouvfr/react-dsfr/Badge";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

type Props = {
  projectName: string;
  pictogramUrl?: string;
  yearlyProfit: number;
  details?: string;
  impactLinkProps?: { href: string };
  isSelected: boolean;
  shouldDisplayCheckbox: boolean;
  onChangeCheckbox: (selected: boolean) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

function ScenarioTile({
  onChangeCheckbox,
  isSelected,
  shouldDisplayCheckbox,
  projectName,
  yearlyProfit,
  details,
  impactLinkProps,
  pictogramUrl,
  ...rest
}: Props) {
  const tileStyle = isSelected ? { border: "1px solid var(--border-active-blue-france)" } : {};
  const onChange = () => {
    onChangeCheckbox(!isSelected);
  };

  return (
    <div className="fr-tile" style={tileStyle} {...rest}>
      <div className="fr-tile__body">
        <div className="fr-tile__content">
          <a {...impactLinkProps}>
            {pictogramUrl && (
              <div className="fr-tile__header">
                <div className="fr-tile__pictogram">
                  <img
                    className="fr-responsive-img"
                    src={pictogramUrl}
                    aria-hidden={true}
                    alt="Icône du type de scénario"
                    width={512}
                    height={512}
                  />
                </div>
              </div>
            )}

            <h3 className="fr-tile__title">{projectName}</h3>
          </a>
          <div className="fr-tile__details" style={{ flexGrow: 1 }}>
            <p className="fr-tile__desc">{details}</p>
          </div>
          <Badge
            small
            noIcon
            severity={yearlyProfit < 0 ? "error" : "success"}
            className="fr-my-4v"
          >
            {formatNumberFr(yearlyProfit)} €/an d’impacts socio-économiques
          </Badge>

          <Checkbox
            className="fr-mt-3v"
            style={{ visibility: shouldDisplayCheckbox ? "visible" : "hidden" }}
            options={[
              {
                label: "Comparer",
                nativeInputProps: {
                  checked: isSelected,
                  onChange: onChange,
                },
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default ScenarioTile;
