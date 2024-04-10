import Checkbox from "@codegouvfr/react-dsfr/Checkbox";

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
                    width="80px"
                    height="80px"
                  />
                </div>
              </div>
            )}

            <h3 className="fr-tile__title">{projectName}</h3>
          </a>
          <div className="fr-tile__details" style={{ flexGrow: 1 }}>
            <p className="fr-tile__desc">{details}</p>
          </div>
          <Checkbox
            className="fr-mt-3v"
            // Scenarii comparison is not released yet
            style={{ display: "none", visibility: shouldDisplayCheckbox ? "visible" : "hidden" }}
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
