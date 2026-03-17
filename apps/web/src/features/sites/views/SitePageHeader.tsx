import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { SiteNature } from "shared";

import { routes, useRoute } from "@/app/router";
import ArchiveSiteDialog from "@/features/archive-site/views/ArchiveSiteDialog";
import classNames from "@/shared/views/clsx";
import Badge from "@/shared/views/components/Badge/Badge";
import MenuItemButton from "@/shared/views/components/Menu/MenuItemButton";
import { MENU_ITEMS_CLASSES } from "@/shared/views/components/Menu/classes";
import TabItem from "@/shared/views/components/TabItem/TabItem";
import { getPictogramUrlForSiteNature } from "@/shared/views/siteNature";

import { SiteRoute } from ".";

type Props = {
  siteId: string;
  siteName: string;
  siteNature: SiteNature;
  isExpressSite: boolean;
  onSuccessArchiveSite: () => void;
};

export default function SitePageHeader({
  siteId,
  siteName,
  siteNature,
  isExpressSite,
  onSuccessArchiveSite,
}: Props) {
  const route = useRoute() as SiteRoute;

  return (
    <section className="bg-background-ultralight dark:bg-grey-dark">
      <div className={fr.cx("fr-container")}>
        <div className="flex flex-wrap items-center py-6 md:py-14">
          <img
            className="mr-3"
            src={getPictogramUrlForSiteNature(siteNature)}
            aria-hidden={true}
            alt=""
            width={76}
            height={76}
          />
          <h2 className="my-0">{siteName}</h2>
          {isExpressSite && (
            <Badge small className="my-2 md:mx-3" style="blue">
              Site express
            </Badge>
          )}
          <div className="grow" aria-hidden="true"></div>

          <Menu>
            <MenuButton as={Fragment}>
              <Button
                priority="secondary"
                iconId="fr-icon-more-fill"
                title="Voir plus de fonctionnalités"
              />
            </MenuButton>
            <MenuItems
              anchor="bottom end"
              transition
              className={classNames("z-40", "w-80", MENU_ITEMS_CLASSES)}
            >
              <MenuItemButton
                iconId="fr-icon-delete-line"
                className="text-error-ultradark"
                nativeButtonProps={{
                  "aria-controls": `archive-site-${siteId}`,
                  "data-fr-opened": true,
                }}
              >
                Supprimer le site
              </MenuItemButton>
            </MenuItems>
          </Menu>
          <ArchiveSiteDialog
            dialogId={`archive-site-${siteId}`}
            siteId={siteId}
            siteName={siteName}
            onSuccess={onSuccessArchiveSite}
          />
        </div>
        <div>
          <ul role="navigation" className="list-none inline-flex gap-2 m-0 p-0">
            <TabItem
              isActive={route.name === routes.siteActionsList.name}
              iconId="fr-icon-check-line"
              label="Suivi du site"
              linkProps={routes.siteActionsList({ ...route.params, siteId }).link}
            />
            <TabItem
              isActive={route.name === routes.siteFeatures.name}
              iconId="fr-icon-article-line"
              label="Caractéristiques du site"
              linkProps={routes.siteFeatures({ ...route.params, siteId }).link}
            />
            <TabItem
              isActive={route.name === routes.siteCompatibilityEvaluation.name}
              iconId="fr-icon-bar-chart-box-line"
              label="Analyse de compatibilité"
              linkProps={routes.siteCompatibilityEvaluation({ ...route.params, siteId }).link}
            />
            <TabItem
              isActive={route.name === routes.siteEvaluatedProjects.name}
              iconId="fr-icon-community-line"
              label="Projets évalués"
              linkProps={routes.siteEvaluatedProjects({ ...route.params, siteId }).link}
            />
          </ul>
        </div>
      </div>
    </section>
  );
}
