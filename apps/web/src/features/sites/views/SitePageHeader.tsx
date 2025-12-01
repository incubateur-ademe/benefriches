import { fr, FrIconClassName } from "@codegouvfr/react-dsfr";
import { SiteNature } from "shared";
import { Link } from "type-route";

import classNames from "@/shared/views/clsx";
import Badge from "@/shared/views/components/Badge/Badge";
import { routes, useRoute } from "@/shared/views/router";

import { SiteRoute } from ".";

type Props = {
  siteId: string;
  siteName: string;
  siteNature: SiteNature;
  isExpressSite: boolean;
};

function getPictogramUrlForSiteNature(siteNature: SiteNature): string {
  switch (siteNature) {
    case "FRICHE":
      return "/img/pictograms/site-nature/friche.svg";
    case "AGRICULTURAL_OPERATION":
      return "/img/pictograms/site-nature/agricultural-operation.svg";
    case "NATURAL_AREA":
      return "/img/pictograms/site-nature/natural-area.svg";
  }
}

type TabItemProps = {
  isActive: boolean;
  label: React.ReactNode;
  linkProps: Link;
  iconId: FrIconClassName;
};

function TabItem({ isActive, iconId, label, linkProps }: TabItemProps) {
  return (
    <li
      className={classNames(
        isActive
          ? "bg-blue-ultralight text-blue-ultradark dark:bg-blue-dark dark:text-blue-ultralight"
          : "bg-background-light text-[#4f4f4f] dark:bg-gray-700 dark:text-grey-light",
        "px-4 py-2 text-sm font-medium rounded-t-lg",
      )}
    >
      <a className="bg-none" {...linkProps}>
        <span className="inline-flex items-center gap-2">
          <i
            className={`${iconId} fr-icon--md text-blue-dark dark:text-blue-ultralight`}
            aria-hidden="true"
          />
          {label}
        </span>
      </a>
    </li>
  );
}

export default function SitePageHeader({ siteId, siteName, siteNature, isExpressSite }: Props) {
  const route = useRoute() as SiteRoute;

  return (
    <section className="bg-background-ultralight dark:bg-grey-dark">
      <div className={fr.cx("fr-container")}>
        <div className="flex items-center py-6 md:py-14">
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
