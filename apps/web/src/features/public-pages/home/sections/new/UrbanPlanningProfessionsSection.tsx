import SectionTitle from "./SectionTitle";

type UrbanPlanningProfessionCardProps = {
  title: string;
  text: string;
  imgSrc: string;
};

function UrbanPlanningProfessionCard({ title, text, imgSrc }: UrbanPlanningProfessionCardProps) {
  return (
    <article className="tw-flex tw-rounded-xl tw-bg-white">
      <img src={imgSrc} alt="" className="tw-rounded-s-xl" height={160} />
      <div className="tw-p-6">
        <h3 className="tw-text-xl tw-mb-1">{title}</h3>
        <p className="tw-text-sm tw-mb-0">{text}</p>
      </div>
    </article>
  );
}

export default function UrbanPlanningProfessionsSection() {
  return (
    <section className="tw-py-20 tw-bg-grey-light dark:tw-bg-grey-dark">
      <div className="fr-container">
        <SectionTitle>Un outil conçu pour tous les métiers de l'aménagement</SectionTitle>
        <div className="tw-grid tw-grid-cols-1 tw-gap-10 md:tw-grid-cols-2 tw-mt-[60px]">
          <UrbanPlanningProfessionCard
            title="Aménageurs urbains"
            text="Évaluez la faisabilité de vos projets de reconversion grâce à une vision claire des impacts environnementaux, économiques et sociaux. Anticipez les bénéfices avant de vous lancer."
            imgSrc="/img/pictograms/urban-planning-professions/urban-planner.svg"
          />

          <UrbanPlanningProfessionCard
            title="Collectivités"
            text="Optimisez vos décisions d'aménagement territorial en mesurant les impacts positifs des projets de reconversion de friches sur votre territoire et leur contribution au développement durable local."
            imgSrc="/img/pictograms/urban-planning-professions/local-authority.svg"
          />

          <UrbanPlanningProfessionCard
            title="Développeurs photovoltaïques"
            text="Démontrez la valeur ajoutée de vos installations solaires au-delà de la production énergétique. Quantifiez les co-bénéfices environnementaux de vos projets sur friches."
            imgSrc="/img/pictograms/urban-planning-professions/photovoltaic-developer.svg"
          />

          <UrbanPlanningProfessionCard
            title="Promoteurs"
            text="Intégrez l'impact environnemental dans vos études de faisabilité. Valorisez les bénéfices de la reconversion de friches auprès des investisseurs et futurs acquéreurs."
            imgSrc="/img/pictograms/urban-planning-professions/real-estate-developer.svg"
          />

          <UrbanPlanningProfessionCard
            title="Bailleurs sociaux"
            text="Mesurez la contribution de vos projets à la revitalisation urbaine et démontrez l'impact positif sur l'amélioration du cadre de vie et la cohésion sociale."
            imgSrc="/img/pictograms/urban-planning-professions/social-landlord.svg"
          />

          <UrbanPlanningProfessionCard
            title="Industriels"
            text="Transformez vos friches industrielles en opportunités durables. Évaluez les différentes options de reconversion pour valoriser au mieux vos actifs fonciers délaissés."
            imgSrc="/img/pictograms/urban-planning-professions/industry.svg"
          />
        </div>
      </div>
    </section>
  );
}
