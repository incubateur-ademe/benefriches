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
        "tw-border",
        "tw-border-solid",
        "tw-rounded-lg",
        isSelected ? "tw-border-dsfr-borderBlue" : "tw-border-borderGrey",
        isHovered ? "tw-bg-grey-light dark:tw-bg-grey-dark" : "tw-bg-none",
        className,
      )}
      {...rest}
    >
      <WithTooltip tooltipText={tooltipText}>
        <div className="fr-tile__body">
          <div className="fr-tile__content">
            <a {...linkProps} className="tw-bg-none">
              {pictogramUrl && <ScenarioTileImage imageUrl={pictogramUrl} />}
              <ScenarioTileTitle>{title}</ScenarioTileTitle>
              <div className="fr-tile__details tw-grow">
                <p className="fr-tile__desc tw-text-sm dark:tw-text-grey-main">{details}</p>
              </div>
              {badgeText && (
                <Badge small className="tw-mt-2" style="blue">
                  {badgeText}
                </Badge>
              )}
            </a>
            <Checkbox
              className={classNames(
                "tw-mt-3",
                shouldDisplayCheckbox ? "tw-visible" : "tw-invisible",
              )}
              // Scenarii comparison is not released yet
              style={{ display: "none" }}
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
