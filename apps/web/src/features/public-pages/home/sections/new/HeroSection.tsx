import Button from "@codegouvfr/react-dsfr/Button";

export default function HeroSection() {
  return (
    <section className="bg-[#007EAF] lg:h-[680px]">
      <div className="fr-container text-white h-full">
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center h-full">
          <div className="flex flex-col justify-center py-10 lg:py-0">
            <h1 className="text-5xl leading-tight font-bold text-white mb-6">
              Calculez les impacts socio-économiques de votre projet d'aménagement.
            </h1>
            <p className="text-sm mb-8">+ de 400 projets évalués</p>
            <Button
              size="large"
              className="bg-white text-[#000091] hover:bg-slate-200! focus:bg-slate-200 w-fit"
              linkProps={{ href: "#votre-projet-d-amenagement" }}
            >
              Commencer
            </Button>
          </div>

          <div className="lg:h-full text-center overflow-hidden">
            <img
              src="/img/new-homepage-hero.svg"
              className="w-full lg:h-full"
              aria-hidden="true"
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  );
}
