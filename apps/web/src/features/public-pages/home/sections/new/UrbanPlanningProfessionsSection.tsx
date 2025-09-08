import SectionTitle from "./SectionTitle";

type UrbanPlanningProfessionCardProps = {
  title: string;
  text: string;
  imgSrc: string;
};

function UrbanPlanningProfessionCard({ title, text, imgSrc }: UrbanPlanningProfessionCardProps) {
  return (
    <article className="flex rounded-xl bg-white dark:bg-grey-dark dark:border-blue-ultradark dark:border">
      <img src={imgSrc} alt="" className="rounded-s-xl" height={160} />
      <div className="p-6">
        <h3 className="text-xl mb-1">{title}</h3>
        <p className="text-sm leading-6 mb-0">{text}</p>
      </div>
    </article>
  );
}

export default function UrbanPlanningProfessionsSection() {
  return (
    <section className="py-20 bg-grey-light dark:bg-grey-dark">
      <div className="fr-container">
        <SectionTitle>Un outil conçu pour tous les métiers de l'aménagement</SectionTitle>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 mt-[60px]">
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
            text="Intégrez l'impact environnemental dans vos études de faisabilité. Valorisez les bénéfices de la reconversion de friches auprès des investisseurs, élus et futurs acquéreurs."
            imgSrc="/img/pictograms/urban-planning-professions/real-estate-developer.svg"
          />

          <UrbanPlanningProfessionCard
            title="Bailleurs sociaux"
            text="Mesurez la contribution de vos projets à la revitalisation urbaine et démontrez l'impact positif sur l'amélioration du cadre de vie et la cohésion sociale."
            imgSrc="/img/pictograms/urban-planning-professions/social-landlord.svg"
          />

          <UrbanPlanningProfessionCard
            title="Industriels"
            text="Evaluez les intérêts extra-financiers à implanter votre activité sur une friche et valorisez les informations auprès des investisseurs, élus et clients"
            imgSrc="/img/pictograms/urban-planning-professions/industry.svg"
          />
        </div>
      </div>
    </section>
  );
}
