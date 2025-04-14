import Button from "@codegouvfr/react-dsfr/Button";
import { useTour } from "@reactour/tour";

import { siteCreationInitiated } from "@/features/create-site/core/actions/introduction.actions";
import classNames from "@/shared/views/clsx";
import DropdownMenu from "@/shared/views/components/Menu/DropdownMenu";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { useIsSmallScreen } from "@/shared/views/hooks/useIsSmallScreen";
import { routes } from "@/shared/views/router";

function MyProjectsPageHeader() {
  const { setIsOpen: setIsTourGuideOpen } = useTour();
  const isSmScreen = useIsSmallScreen();
  const dispatch = useAppDispatch();

  return (
    <div className={classNames("tw-flex", "tw-justify-between", "tw-items-center")}>
      <h2>Mes projets</h2>
      <div className={classNames("tw-flex", "tw-gap-2", "tw-mb-6")}>
        <div className="tour-guide-step-create-new-site">
          <Button
            size={isSmScreen ? "small" : "medium"}
            priority="primary"
            onClick={() => {
              dispatch(siteCreationInitiated({ skipIntroduction: true }));
              routes.createSiteFoncier().push();
            }}
            iconId="fr-icon-add-line"
          >
            Nouveau site
          </Button>
        </div>

        <DropdownMenu
          size="small"
          buttonProps={{
            size: isSmScreen ? "small" : "medium",
            priority: "secondary",
            iconId: "fr-icon-more-fill",
            title: "Voir plus de fonctionnalités",
          }}
          options={[
            {
              children: "Revoir le tutoriel",
              iconId: "fr-icon-lightbulb-line",
              onClick: () => {
                setIsTourGuideOpen(true);
              },
            },
          ]}
        />
      </div>
    </div>
  );
}

export default MyProjectsPageHeader;
