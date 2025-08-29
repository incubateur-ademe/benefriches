import Button from "@codegouvfr/react-dsfr/Button";

export default function GetNotifiedSection() {
  return (
    <section className="bg-[#64C7ED] py-20">
      <div className="fr-container">
        <div className="flex flex-col md:flex-row gap-6 items-center md:justify-between">
          <img src="/img/pictograms/newsletter.svg" alt="" className="md:mr-16" />
          <div className="md:mr-12">
            <h2 className="dark:text-grey-dark">
              Bénéfriches, un produit de l'ADEME qui évolue chaque jour
            </h2>
            <p className="dark:text-grey-dark">
              Soyez informé·e de la sortie des prochaines fonctionnalités de l'outil !
            </p>
          </div>
          <Button
            priority="primary"
            data-tally-open="npKkaE"
            data-tally-width="450"
            className="whitespace-nowrap"
          >
            Être tenu informé·e
          </Button>
        </div>
      </div>
    </section>
  );
}
