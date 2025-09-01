import { fr } from "@codegouvfr/react-dsfr";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";

import classNames, { ClassValue } from "@/shared/views/clsx";
import Badge from "@/shared/views/components/Badge/Badge";

import ScenarioTileImage from "./ScenarioTileImage";
import ScenarioTileTitle from "./ScenarioTileTitle";
import WithTooltip from "./ScenarioTileTooltip";

type Props = {
  title: string;
  pictogramUrl?: string;
  badgeText?: string;
  details?: string;
  linkProps?: { href: string };
  isHovered?: boolean;
  isSelected?: boolean;
  shouldDisplayCheckbox?: boolean;
  className?: ClassValue;
  tooltipText?: string;
  onChangeCheckbox?: (selected: boolean) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

function ScenarioTile({
  onChangeCheckbox = () => {},
  isSelected = false,
  shouldDisplayCheckbox,
  title,
  details,
  linkProps,
  pictogramUrl,
  isHovered,
  badgeText,
  tooltipText,
  className,
  ...rest
}: Props) {
  const onChange = () => {
    onChangeCheckbox(!isSelected);
  };

  return (
    <div
      className={classNames(
        fr.cx("fr-tile", "fr-tile--no-border"),
        "border",
        "border-solid",
        "rounded-lg",
        isSelected ? "border-dsfr-border-blue" : "border-border-grey",
        isHovered ? "bg-grey-light dark:bg-grey-dark" : "bg-none",
        className,
      )}
      {...rest}
    >
      <WithTooltip tooltipText={tooltipText}>
        <div className="fr-tile__body">
          <div className="fr-tile__content">
            <a {...linkProps} className="bg-none">
              {pictogramUrl && <ScenarioTileImage imageUrl={pictogramUrl} />}
              <ScenarioTileTitle>{title}</ScenarioTileTitle>
              <div className="fr-tile__details grow">
                <p className="fr-tile__desc text-sm dark:text-grey-main">{details}</p>
              </div>
              {badgeText && (
                <Badge small className="mt-2" style="blue">
                  {badgeText}
                </Badge>
              )}
            </a>
            <Checkbox
              className={classNames(
                "mt-3",
                // Scenarii comparison is not released yet
                "hidden",
                shouldDisplayCheckbox ? "visible" : "invisible",
              )}
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
      </WithTooltip>
    </div>
  );
}

export default ScenarioTile;
