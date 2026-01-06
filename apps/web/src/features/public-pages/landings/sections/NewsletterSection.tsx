import Button from "@codegouvfr/react-dsfr/Button";

export default function NewsletterSection() {
  return (
    <section className="bg-blue-light py-20">
      <div className="fr-container">
        <div className="flex flex-col md:flex-row gap-6 items-center md:justify-between">
          <img src="/img/pictograms/newsletter.svg" alt="" className="md:mr-16" />
          <div className="md:mr-12">
            <h2 className="dark:text-grey-dark">
              Bénéfriches, un produit de l'ADEME qui évolue chaque jour
            </h2>
            <p className="dark:text-grey-dark font-medium">
              Soyez informé·e de la sortie des prochaines fonctionnalités de l'outil !
            </p>
          </div>
          <Button
            priority="primary"
            linkProps={{
              href: "https://cloud.contact.ademe.fr/benefriches",
              target: "_blank",
              rel: "noopener noreferrer",
            }}
            className="whitespace-nowrap"
          >
            S'abonner à la newsletter
          </Button>
        </div>
      </div>
    </section>
  );
}
