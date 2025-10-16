import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button";

import { selectCurrentUserEmail } from "@/features/onboarding/core/user.reducer";
import { featureAlertSubscribed } from "@/features/user-feature-alerts/core/createFeatureAlert.action";
import { selectUserFeaturesAlerts } from "@/features/user-feature-alerts/core/userFeatureAlert.reducer";
import classNames from "@/shared/views/clsx";
import ButtonBadge from "@/shared/views/components/Badge/ButtonBadge";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import { routes } from "@/shared/views/router";

import { ABOUT_IMPACTS_DIALOG_ID } from "../impacts/about-impacts-modal/AboutImpactsModal";
import ProjectFeatureAlertModal from "./ProjectFeatureAlertModal";

type Link = {
  categoryName: string;
  links: (ButtonProps & { badgeProps?: ButtonProps["nativeButtonProps"] })[];
};

export const PROJECT_AND_SITE_FEATURES_FOOTER_DIALOG_ID = "project-and-site-features-footer-dialog";
const DUPLICATE_PROJECT_FEATURE_ALERT_DIALOG_ID = "duplicate-project-feature-alert-footer-dialog";
const UPDATE_PROJECT_FEATURE_ALERT_DIALOG_ID = "update-project-feature-alert-footer-dialog";
const UPDATE_SITE_FEATURE_ALERT_DIALOG_ID = "update-site-feature-alert-footer-dialog";

export default function FurtherActionsSection({ siteId }: { siteId: string }) {
  const links: Link[] = [
    {
      categoryName: "Modifier",
      links: [
        {
          iconId: "fr-icon-edit-line",
          disabled: true,
          title: "Modifier les infos du projet",
          badgeProps: {
            "aria-controls": UPDATE_PROJECT_FEATURE_ALERT_DIALOG_ID,
            "data-fr-opened": "false",
          },
        },
        {
          iconId: "fr-icon-edit-line",
          disabled: true,
          title: "Modifier les infos du site",
          badgeProps: {
            "aria-controls": UPDATE_SITE_FEATURE_ALERT_DIALOG_ID,
            "data-fr-opened": "false",
          },
        },
      ],
    },
    {
      categoryName: "Créer",
      links: [
        {
          iconId: "ri-file-copy-line",
          disabled: true,
          title: "Créer une variante du projet",
          badgeProps: {
            "aria-controls": DUPLICATE_PROJECT_FEATURE_ALERT_DIALOG_ID,
            "data-fr-opened": "false",
          },
        },
        {
          iconId: "fr-icon-file-add-line",
          linkProps: routes.createProject({ siteId }).link,
          title: "Créer un nouveau projet",
        },
        {
          iconId: "fr-icon-add-line",
          linkProps: routes.createSiteFoncier().link,
          title: "Créer un nouveau site",
        },
      ],
    },
    {
      categoryName: "Comprendre",
      links: [
        {
          iconId: "fr-icon-lightbulb-line",
          nativeButtonProps: {
            "aria-controls": ABOUT_IMPACTS_DIALOG_ID,
            "data-fr-opened": false,
          },
          title: "Comprendre les calculs de Bénéfriches",
        },
        {
          iconId: "fr-icon-file-text-line",
          nativeButtonProps: {
            "aria-controls": PROJECT_AND_SITE_FEATURES_FOOTER_DIALOG_ID,
            "data-fr-opened": false,
          },
          title: "Revoir les données du site et du projet",
        },
        //  { iconId: "ri-folder-2-line", title: "Voir des projets similaires" },
      ],
    },
    // {
    //   categoryName: "Être accompagné·e",
    //   links: [
    //     { iconId: "ri-questionnaire-line", title: "Discuter avec un·e expert·e friche" },
    //     { iconId: "ri-mail-line", title: "Demander conseil sur la dépollution" },
    //     { iconId: "ri-money-euro-box-line", title: "Trouver des subventions" },
    //   ],
    // },
  ];

  const dispatch = useAppDispatch();

  const userEmail = useAppSelector(selectCurrentUserEmail);
  const {
    createUserFeatureAlertState,
    duplicateProjectAlert,
    updateProjectAlert,
    updateSiteAlert,
  } = useAppSelector(selectUserFeaturesAlerts);

  return (
    <section className="rounded-lg mt-6 p-6 bg-impacts-main dark:bg-black">
      <h4>Aller plus loin</h4>
      <div className="grid md:grid-cols-3 gap-4">
        {links.map(({ categoryName, links }, columnIndex) => (
          <div key={`link-item-${columnIndex}`}>
            <h5 className={classNames("text-sm", "uppercase", "mb-4")}>{categoryName}</h5>
            <ul className={classNames("list-none", "m-0", "p-0")}>
              {links.map(({ title, badgeProps, ...buttonProps }, linkItemIndex) => (
                <li key={`li-${linkItemIndex}`} className="pb-4 flex items-center">
                  <Button
                    priority="tertiary no outline"
                    size="small"
                    className="text-left -ml-2"
                    {...buttonProps}
                  >
                    {title}
                  </Button>
                  {buttonProps.disabled && badgeProps && (
                    <ButtonBadge small {...badgeProps} color="green-tilleul">
                      Bientôt disponible
                    </ButtonBadge>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <ProjectFeatureAlertModal
        dialogId={DUPLICATE_PROJECT_FEATURE_ALERT_DIALOG_ID}
        title="Créer une variante du projet"
        userEmail={userEmail}
        hasProjectAlert={duplicateProjectAlert?.hasAlert === true}
        onSaveLoadingState={createUserFeatureAlertState.duplicateProject}
        onSubmit={({ email }) => {
          void dispatch(
            featureAlertSubscribed({
              feature: { type: "duplicate_project" },
              email,
            }),
          );
        }}
      />
      <ProjectFeatureAlertModal
        dialogId={UPDATE_SITE_FEATURE_ALERT_DIALOG_ID}
        title="Modifier les informations du site"
        userEmail={userEmail}
        hasProjectAlert={updateSiteAlert?.hasAlert === true}
        onSaveLoadingState={createUserFeatureAlertState.updateSite}
        onSubmit={({ email }) => {
          void dispatch(
            featureAlertSubscribed({
              feature: { type: "update_site" },
              email,
            }),
          );
        }}
      />
      <ProjectFeatureAlertModal
        dialogId={UPDATE_PROJECT_FEATURE_ALERT_DIALOG_ID}
        title="Modifier les informations du projet"
        userEmail={userEmail}
        hasProjectAlert={updateProjectAlert?.hasAlert === true}
        onSaveLoadingState={createUserFeatureAlertState.updateProject}
        onSubmit={({ email }) => {
          void dispatch(
            featureAlertSubscribed({
              feature: { type: "update_project" },
              email,
            }),
          );
        }}
      />
    </section>
  );
}
