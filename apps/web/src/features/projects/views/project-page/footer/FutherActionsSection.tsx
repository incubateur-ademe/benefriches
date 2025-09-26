import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button";

import classNames from "@/shared/views/clsx";
import Badge from "@/shared/views/components/Badge/Badge";
import { routes } from "@/shared/views/router";

import { aboutImpactsModal } from "../impacts/about-impacts-modal";
import { projectAndSiteFeaturesModal } from "../impacts/project-and-site-features-modal/createProjectAndSiteFeaturesModal";

type Link = {
  categoryName: string;
  links: ButtonProps[];
};

export default function FurtherActionsSection({ siteId }: { siteId: string }) {
  const links: Link[] = [
    {
      categoryName: "Modifier",
      links: [
        {
          iconId: "fr-icon-edit-line",
          disabled: true,
          title: "Modifier les infos du projet",
        },
        {
          iconId: "fr-icon-edit-line",
          disabled: true,
          title: "Modifier les infos du site",
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
          onClick: () => {
            aboutImpactsModal.open();
          },
          title: "Comprendre les calculs de Bénéfriches",
        },
        {
          iconId: "fr-icon-file-text-line",
          onClick: () => {
            projectAndSiteFeaturesModal.open();
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

  return (
    <section className="rounded-lg mt-6 p-6 bg-impacts-main dark:bg-black">
      <h4>Aller plus loin</h4>
      <div className="grid md:grid-cols-3 gap-4">
        {links.map(({ categoryName, links }, columnIndex) => (
          <div key={`link-item-${columnIndex}`}>
            <h5 className={classNames("text-sm", "uppercase", "mb-4")}>{categoryName}</h5>
            <ul className={classNames("list-none", "m-0", "p-0")}>
              {links.map(({ title, ...buttonProps }, linkItemIndex) => (
                <li key={`li-${linkItemIndex}`} className="pb-4 flex items-center">
                  <Button
                    priority="tertiary no outline"
                    size="small"
                    className="text-left -ml-2"
                    {...buttonProps}
                  >
                    {title}
                  </Button>
                  {buttonProps.disabled && (
                    <Badge small style="green-tilleul">
                      Bientôt disponible
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
