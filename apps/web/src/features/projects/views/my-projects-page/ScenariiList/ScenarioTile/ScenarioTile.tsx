import { fr } from "@codegouvfr/react-dsfr";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";

import classNames from "@/shared/views/clsx";

type Props = {
  title: string;
  pictogramUrl?: string;
  details?: string;
  linkProps?: { href: string };
  isHovered?: boolean;
  isSelected: boolean;
  shouldDisplayCheckbox: boolean;
  onChangeCheckbox: (selected: boolean) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

const ScenarioTileHeader = ({
  pictogramUrl,
  title,
}: {
  pictogramUrl: Props["pictogramUrl"];
  title: Props["title"];
}) => {
  return (
    <>
      {pictogramUrl && (
        <div className="fr-tile__header">
          <div className="fr-tile__pictogram">
            <img
              className="fr-responsive-img"
              src={pictogramUrl}
              aria-hidden={true}
              alt="Icône du type de scénario"
              width="80px"
              height="80px"
            />
          </div>
        </div>
      )}

      <h3 className={classNames(fr.cx("fr-tile__title"), "before:tw-content-none", "tw-text-lg")}>
        {title}
      </h3>
    </>
  );
};

function ScenarioTile({
  onChangeCheckbox,
  isSelected,
  shouldDisplayCheckbox,
  title,
  details,
  linkProps,
  pictogramUrl,
  isHovered,
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
        isSelected ? "tw-border-dsfr-borderBlue" : "tw-border-borderGrey",
        isHovered ? "tw-bg-[#F6F6F6]" : "tw-bg-none",
      )}
      {...rest}
    >
      <div className="fr-tile__body">
        <div className="fr-tile__content">
          {linkProps ? (
            <a {...linkProps} className="tw-bg-none">
              <ScenarioTileHeader title={title} pictogramUrl={pictogramUrl} />
            </a>
          ) : (
            <div>
              <ScenarioTileHeader title={title} pictogramUrl={pictogramUrl} />
            </div>
          )}

          <div className="fr-tile__details tw-grow">
            <p className="fr-tile__desc tw-text-sm">{details}</p>
          </div>
          <Checkbox
            className={classNames(
              fr.cx("fr-mt-3v"),
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
    </div>
  );
}

export default ScenarioTile;
