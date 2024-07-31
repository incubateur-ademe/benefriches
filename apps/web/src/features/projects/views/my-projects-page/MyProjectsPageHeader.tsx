import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { useTour } from "@reactour/tour";
import { Dropdown } from "antd";

import { routes } from "@/app/views/router";
import classNames from "@/shared/views/clsx";

function MyProjectsPageHeader() {
  const { setIsOpen } = useTour();
  return (
    <div className={classNames(fr.cx("fr-grid-row"), "tw-justify-between", "tw-items-center")}>
      <h2>Mes projets</h2>
      <div className={classNames("tw-flex", "tw-gap-2")}>
        <div className="tour-guide-step-create-new-site">
          <Button
            priority="primary"
            linkProps={routes.createSiteFoncierIntro().link}
            iconId="fr-icon-add-line"
          >
            Nouveau site
          </Button>
        </div>
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                label: "Revoir le tutoriel",
                icon: (
                  <span className="fr-icon--sm fr-icon-lightbulb-line" aria-hidden="true"></span>
                ),
                key: "1",
              },
            ],
            onClick: () => {
              setIsOpen(true);
            },
          }}
        >
          <Button
            priority="secondary"
            iconId="fr-icon-more-fill"
            title="Voir plus de fonctionnalités"
          />
        </Dropdown>
      </div>
    </div>
  );
}

export default MyProjectsPageHeader;
