import { fr } from "@codegouvfr/react-dsfr";
import { getScenarioPictoUrl } from "../shared/scenarioType";

type Props = {
  projectName: string;
  projectId: string;
  siteName: string;
};

const ProjectsImpactsPageHeader = ({ projectName, siteName }: Props) => {
  return (
    <div className={fr.cx("fr-py-8v")} style={{ background: "#ECF5FD" }}>
      <div className={fr.cx("fr-container")}>
        <div
          className={fr.cx("fr-grid-row", "fr-my-2w")}
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              className={fr.cx("fr-mr-3v")}
              src={getScenarioPictoUrl("PHOTOVOLTAIC_POWER_PLANT")}
              aria-hidden={true}
              alt="Icône du type de scénario"
              width={76}
              height={76}
            />
            <div>
              <h2
                className={fr.cx("fr-my-0")}
                style={{ color: fr.colors.options.blueEcume.sun247moon675.default }}
              >
                {projectName}
              </h2>
              <div className={fr.cx("fr-mt-1v")}>
                <span
                  className={fr.cx("fr-icon-map-pin-2-line", "fr-icon--sm", "fr-mr-1w")}
                  aria-hidden="true"
                ></span>
                <span className={fr.cx("fr-text--lg")}>{siteName}</span>
              </div>
            </div>
          </div>

          {/* <ButtonsGroup
            inlineLayoutWhen="always"
            buttons={[
              {
                priority: "secondary",
                disabled: true,
                children: "Exporter",
                iconId: "fr-icon-external-link-line",
              },
              {
                priority: "secondary",
                disabled: true,
                iconId: "fr-icon-more-fill",
                title: "Options",
              },
            ]}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default ProjectsImpactsPageHeader;
