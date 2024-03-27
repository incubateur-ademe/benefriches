import { fr } from "@codegouvfr/react-dsfr";

type TargetItemProps = {
  title: string;
  text: string;
  imgUrl: string;
};
function TargetItem({ title, text, imgUrl }: TargetItemProps) {
  return (
    <>
      <div style={{ height: "100px" }}>
        <img src={imgUrl} />
      </div>
      <span className={fr.cx("fr-text--xl", "fr-text--bold")}>{title}</span>
      <p className={fr.cx("fr-text--sm", "fr-mt-1w")}>{text}</p>
    </>
  );
}

export default function TargetsSection() {
  return (
    <section className={fr.cx("fr-py-10w")} style={{ background: "#F6F6F6" }}>
      <div className={fr.cx("fr-container")}>
        <h2>Un service pour tous les projets d'aménagement</h2>
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-mt-5w")}>
          <div className={fr.cx("fr-col-4")}>
            <TargetItem
              title="Tous les métiers"
              text="Chargés d’opération en collectivité, aménageurs urbains, promoteurs,  bailleurs sociaux,  développeurs de centrales photovoltaïques ou industriels, Bénéfriches prend en compte les besoins liés à votre métier."
              imgUrl="/img/pictograms/all-professions.svg"
            />
          </div>
          <div className={fr.cx("fr-col-4")}>
            <TargetItem
              title="Tous les projets"
              text="Logements, lieux d’activités, centrale d’énergies renouvelables, espace de nature en ville, ferme urbaine ou zone d’activités économiques : les projets que vous pouvez créer sur Bénéfriches sont multiples."
              imgUrl="/img/pictograms/all-projects.svg"
            />
          </div>
          <div className={fr.cx("fr-col-4")}>
            <TargetItem
              title="Tous les états d'avancement"
              text="Que vous soyez en phase de montage, de programmation ou de conception, Bénéfriches s’adapte à votre niveau d’avancement. Il est complémentaire avec les outils d’aménagement et de calcul Energie-Carbone."
              imgUrl="/img/pictograms/all-project-phases.svg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
