import { fr } from "@codegouvfr/react-dsfr";

type TargetItemProps = {
  title: string;
  text: string;
  imgUrl: string;
};
function TargetItem({ title, text, imgUrl }: TargetItemProps) {
  return (
    <li>
      <div className="tw-h-[100px]">
        <img src={imgUrl} alt="" aria-hidden="true" />
      </div>
      <h3 className="tw-text-xl tw-mb-2">{title}</h3>
      <p className={fr.cx("fr-text--sm")}>{text}</p>
    </li>
  );
}

export default function TargetsSection() {
  return (
    <section className="tw-py-20 tw-bg-grey-light dark:tw-bg-grey-dark">
      <div className={fr.cx("fr-container")}>
        <h2>Un service pour tous les projets d'aménagement</h2>
        <ul className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-3 tw-gap-10 tw-list-none">
          <TargetItem
            title="Tous les métiers"
            text="Chargés d'opération en collectivité, aménageurs urbains, promoteurs,  bailleurs sociaux,  développeurs de centrales photovoltaïques ou industriels, Bénéfriches prend en compte les besoins liés à votre métier."
            imgUrl="/img/pictograms/all-professions.svg"
          />
          <TargetItem
            title="Tous les projets"
            text="Logements, lieux d'activités, centrale d'énergies renouvelables, espace de nature en ville, ferme urbaine ou zone d'activités économiques : les projets que vous pouvez créer sur Bénéfriches sont multiples."
            imgUrl="/img/pictograms/all-projects.svg"
          />
          <TargetItem
            title="Tous les états d'avancement"
            text="Que vous soyez en phase de montage, de programmation ou de conception, Bénéfriches s'adapte à votre niveau d'avancement. Il est complémentaire avec les outils d'aménagement et de calcul Energie-Carbone."
            imgUrl="/img/pictograms/all-project-phases.svg"
          />
        </ul>
      </div>
    </section>
  );
}
