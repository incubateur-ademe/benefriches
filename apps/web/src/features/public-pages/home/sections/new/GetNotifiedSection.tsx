import Button from "@codegouvfr/react-dsfr/Button";

export default function GetNotifiedSection() {
  return (
    <section className="tw-bg-[#64C7ED] tw-py-20">
      <div className="fr-container">
        <div className="tw-flex tw-flex-col md:tw-flex-row tw-gap-6 tw-items-center md:tw-justify-between">
          <img src="/img/pictograms/newsletter.svg" alt="" className="md:tw-mr-16" />
          <div className="md:tw-mr-12">
            <h2 className="dark:tw-text-grey-dark">
              Bénéfriches, un produit de l'ADEME qui évolue chaque jour
            </h2>
            <p className="dark:tw-text-grey-dark">
              Soyez informé·e de la sortie des prochaines fonctionnalités de l'outil !
            </p>
          </div>
          <Button
            priority="primary"
            data-tally-open="npKkaE"
            data-tally-width="450"
            className="tw-whitespace-nowrap"
          >
            Être tenu informé·e
          </Button>
        </div>
      </div>
    </section>
  );
}
