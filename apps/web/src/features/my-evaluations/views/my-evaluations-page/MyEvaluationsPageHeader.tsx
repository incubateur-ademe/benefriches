import Button from "@codegouvfr/react-dsfr/Button";

import { siteCreationInitiated } from "@/features/create-site/core/steps/introduction/introduction.actions";
import classNames from "@/shared/views/clsx";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { useIsSmallScreen } from "@/shared/views/hooks/useIsSmallScreen";
import { routes } from "@/shared/views/router";

function MyEvaluationsPageHeader() {
  const isSmScreen = useIsSmallScreen();

  const dispatch = useAppDispatch();

  return (
    <div className={classNames("flex", "justify-between", "items-center")}>
      <h2>Mes évaluations</h2>
      <div className={classNames("flex", "gap-2", "mb-6")}>
        <div>
          <Button
            size={isSmScreen ? "small" : "medium"}
            priority="primary"
            onClick={() => {
              dispatch(siteCreationInitiated({ skipIntroduction: false }));
              routes.createSite().push();
            }}
            iconId="fr-icon-add-line"
          >
            Évaluer un nouveau site
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MyEvaluationsPageHeader;
