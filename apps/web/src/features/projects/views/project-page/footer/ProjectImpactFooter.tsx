import { routes } from "@/app/views/router";
import TileLink from "@/shared/views/components/TileLink/TileLink";

type Props = {
  siteId: string;
};

function ProjectImpactFooter({ siteId }: Props) {
  return (
    <>
      <p className="tw-text-lg tw-font-bold">Aller plus loin avec ce projet :</p>
      <div className="tw-grid tw-grid-cols-[repeat(auto-fill,_282px)] tw-gap-3 md:tw-gap-6 tw-pb-6">
        <TileLink
          title="Exporter les impacts du projet"
          badgeText="Bientôt disponible"
          iconId="fr-icon-file-download-line"
          disabled
        />
        <TileLink
          title="Comparer les impacts avec un autre projet"
          badgeText="Bientôt disponible"
          iconId="fr-icon-scales-3-line"
          disabled
        />
        <TileLink
          title="Dupliquer ce projet sur un autre site"
          badgeText="Bientôt disponible"
          iconId="ri-file-copy-line"
          disabled
        />
        <TileLink
          title="Créer un nouveau projet sur ce site"
          iconId="fr-icon-add-line"
          linkProps={routes.createProject({ siteId }).link}
        />
      </div>
    </>
  );
}

export default ProjectImpactFooter;
