import { fr } from "@codegouvfr/react-dsfr";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

type Props = {
  baseScenarioName: string;
  withScenarioName: string;
  baseSiteName: string;
  withSiteName?: string;
  isSameSite: boolean;
};

const ImpactsComparisonPageHeader = ({
  baseScenarioName,
  withScenarioName,
  baseSiteName,
  withSiteName,
  isSameSite,
}: Props) => {
  return (
    <>
      <h2
        className="fr-h6 fr-mb-1w"
        style={{
          textTransform: "uppercase",
        }}
      >
        Comparaison des impacts
      </h2>
      <div
        className={fr.cx("fr-grid-row", "fr-my-2w", "fr-mb-4w")}
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <div>
          {isSameSite ? (
            <>
              <h3 className={fr.cx("fr-mt-0", "fr-mb-4v")}>
                <span>{baseScenarioName} </span>
                <span className={fr.cx("fr-px-2w")}>/</span> <span>{withScenarioName}</span>
              </h3>
              <h4 className={fr.cx("fr-h6", "fr-my-0")} style={{ color: "var(--grey-425-625)" }}>
                <span
                  className={fr.cx("fr-icon-map-pin-2-line", "fr-pr-1w")}
                  aria-hidden="true"
                ></span>
                {baseSiteName}
              </h4>
            </>
          ) : (
            <h3
              className={fr.cx("fr-grid-row")}
              style={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <div>
                <span>{baseScenarioName} </span>
                <div className={fr.cx("fr-h6", "fr-m-0")} style={{ color: "var(--grey-425-625)" }}>
                  <span
                    className={fr.cx("fr-icon-map-pin-2-line", "fr-pr-1w")}
                    aria-hidden="true"
                  ></span>
                  {baseSiteName}
                </div>
              </div>
              <span className={fr.cx("fr-px-4w")}>/</span>
              <div>
                <span>{withScenarioName} </span>
                <div className={fr.cx("fr-h6", "fr-m-0")} style={{ color: "var(--grey-425-625)" }}>
                  <span
                    className={fr.cx("fr-icon-map-pin-2-line", "fr-pr-1w")}
                    aria-hidden="true"
                  ></span>
                  {withSiteName}
                </div>
              </div>
            </h3>
          )}
        </div>

        <div>
          <ButtonsGroup
            inlineLayoutWhen="always"
            buttons={[
              {
                priority: "secondary",
                disabled: true,
                children: "Modifier le site",
              },
              {
                priority: "secondary",
                disabled: true,
                children: "Modifier le projet",
              },
              { priority: "secondary", disabled: true, children: "Exporter" },
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default ImpactsComparisonPageHeader;
