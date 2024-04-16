import { fr } from "@codegouvfr/react-dsfr";
import { getScenarioPictoUrl } from "../shared/scenarioType";

import classNames from "@/shared/views/clsx";

type Props = {
  projectName: string;
  projectId: string;
  siteName: string;
};

const ProjectsImpactsPageHeader = ({ projectName, siteName }: Props) => {
  return (
    <div className={classNames(fr.cx("fr-py-8v"), "tw-bg-impacts-main")}>
      <div className={fr.cx("fr-container")}>
        <div
          className={classNames(
            fr.cx("fr-grid-row", "fr-my-2w"),
            "tw-justify-between",
            "tw-items-center",
          )}
        >
          <div className="tw-flex tw-items-center">
            <img
              className={fr.cx("fr-mr-3v")}
              src={getScenarioPictoUrl("PHOTOVOLTAIC_POWER_PLANT")}
              aria-hidden={true}
              alt="Icône du type de scénario"
              width={76}
              height={76}
            />
            <div>
              <h2 className={classNames(fr.cx("fr-my-0"), "tw-text-impacts-title")}>
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
