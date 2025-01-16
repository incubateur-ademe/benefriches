import Button from "@codegouvfr/react-dsfr/Button";
import { useTour } from "@reactour/tour";
import { Dropdown } from "antd";

import classNames from "@/shared/views/clsx";
import { useIsSmallScreen } from "@/shared/views/hooks/useIsSmallScreen";
import { routes } from "@/shared/views/router";

function MyProjectsPageHeader() {
  const { setIsOpen } = useTour();
  const isSmScreen = useIsSmallScreen();

  return (
    <div className={classNames("tw-flex", "tw-justify-between", "tw-items-center")}>
      <h2>Mes projets</h2>
      <div className={classNames("tw-flex", "tw-gap-2", "tw-mb-6")}>
        <div className="tour-guide-step-create-new-site">
          <Button
            size={isSmScreen ? "small" : "medium"}
            priority="primary"
            linkProps={routes.createSiteFoncier().link}
            iconId="fr-icon-add-line"
          >
            Nouveau site
          </Button>
        </div>
        <Dropdown
          trigger={["click"]}
          menu={{
            className: "dark:!tw-bg-dsfr-contrastGrey",
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
            size={isSmScreen ? "small" : "medium"}
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
