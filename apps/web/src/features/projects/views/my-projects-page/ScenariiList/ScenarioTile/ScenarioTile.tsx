import { fr } from "@codegouvfr/react-dsfr";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";

import classNames from "@/shared/views/clsx";

type Props = {
  projectName: string;
  pictogramUrl?: string;
  details?: string;
  impactLinkProps?: { href: string };
  isSelected: boolean;
  shouldDisplayCheckbox: boolean;
  onChangeCheckbox: (selected: boolean) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

const ScenarioTileHeader = ({
  pictogramUrl,
  projectName,
}: {
  pictogramUrl: Props["pictogramUrl"];
  projectName: Props["projectName"];
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

      <h3 className={classNames(fr.cx("fr-tile__title"), "before:tw-content-none")}>
        {projectName}
      </h3>
    </>
  );
};

function ScenarioTile({
  onChangeCheckbox,
  isSelected,
  shouldDisplayCheckbox,
  projectName,
  details,
  impactLinkProps,
  pictogramUrl,
  ...rest
}: Props) {
  const onChange = () => {
    onChangeCheckbox(!isSelected);
  };

  return (
    <div
      className={classNames(
        fr.cx("fr-tile", "fr-tile--no-border"),
        "tw-bg-none",
        "tw-border",
        "tw-border-solid",
        isSelected ? "tw-border-dsfr-borderBlue" : "tw-border-grey",
      )}
      {...rest}
    >
      <div className="fr-tile__body">
        <div className="fr-tile__content">
          {impactLinkProps ? (
            <a {...impactLinkProps}>
              <ScenarioTileHeader projectName={projectName} pictogramUrl={pictogramUrl} />
            </a>
          ) : (
            <div>
              <ScenarioTileHeader projectName={projectName} pictogramUrl={pictogramUrl} />
            </div>
          )}

          <div className="fr-tile__details tw-grow">
            <p className="fr-tile__desc">{details}</p>
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
