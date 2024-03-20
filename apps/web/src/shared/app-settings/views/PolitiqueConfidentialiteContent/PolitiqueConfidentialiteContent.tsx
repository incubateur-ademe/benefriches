import { routes } from "@/app/views/router";

function PolitiqueConfidentialiteContent() {
  return (
    <>
      <h2>Collecte directes de données</h2>
      <h3>Quelles sont les données que nous traitons ?</h3>
      La plateforme Bénéfriches peut traiter les données à caractère personnel suivantes :{" "}
      <ul>
        <li>
          Données relatives au formulaire d’accès à l’outil (nom, prénom, email, nom et type de la
          structure) ;
        </li>
      </ul>
      L’accès à l’outil Bénéfriches est conditionné à la fourniture des informations suivantes :{" "}
      <ul>
        <li>Adresse e-mail</li>
        <li>Type de structure </li>
      </ul>
      <h3>Traitement</h3>
      <p>
        Les informations recueillies sur ce formulaire sont enregistrées dans un fichier informatisé
        par l’éditeur de la plateforme{" "}
        <a {...routes.mentionsLegales().link} target="_blank" rel="nofollow noopener noreferrer">
          voir les mentions légales
        </a>{" "}
        pour identifier les internautes de Bénéfriches à des fins fonctionnelles, statistiques et de
        contact.
      </p>
      <p>La base légale du traitement est le consentement de l’internaute.</p>
      <p>Les données collectées seront communiquées au seul destinataires suivant : l’ADEME. </p>
      <p>
        Les données sont conservées pendant une durée maximale de 5 ans à compter de leur collecte
        ou du dernier contact émanant de l’internaute.
      </p>
      <ul>
        <li>
          Vous pouvez accéder aux données vous concernant, les rectifier, demander leur effacement
          ou exercer votre droit à la limitation du traitement de vos données;
        </li>
        <li>Vous pouvez retirer à tout moment votre consentement au traitement de vos données ;</li>
        <li>Vous pouvez également vous opposer au traitement de vos données ;</li>
        <li>Vous pouvez également exercer votre droit à la portabilité de vos données</li>
      </ul>
      <p>
        Pour exercer ces droits ou pour toute question sur le traitement de vos données dans ce
        dispositif, vous pouvez nous contacter via le{" "}
        <a rel="noopener noreferrer" target="_blank" href="https://tally.so/r/w7xBV6">
          formulaire de contact Bénéfriches
        </a>
      </p>
      <p>
        Si vous estimez, après nous avoir contactés, que vos droits « Informatique et Libertés » ne
        sont pas respectés, vous pouvez adresser une réclamation à la Commission Nationale de
        l’Informatique et des Libertés à{" "}
        <a
          href="https://www.cnil.fr/fr/cnil-direct/question/adresser-une-reclamation-plainte-la-cnil-quelles-conditions-et-comment"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          l’adresse suivante
        </a>
        .
      </p>
      <h2 id="cookies">Cookies</h2>
      <p>
        Un cookie est un fichier déposé sur votre terminal lors de la visite d’un site. Il a pour
        but de collecter des informations relatives à votre navigation et de vous adresser des
        services adaptés à votre terminal (ordinateur, mobile ou tablette).
      </p>
      <p>
        En application de l’article 5(3) de la directive 2002/58/CE modifiée concernant le
        traitement des données à caractère personnel et la protection de la vie privée dans le
        secteur des communications électroniques, transposée à l’article 82 de la loi n°78-17 du 6
        janvier 1978 relative à l’informatique, aux fichiers et aux libertés, les traceurs ou
        cookies suivent deux régimes distincts.
      </p>
      <p>
        Les cookies strictement nécessaires au service ou ayant pour finalité exclusive de faciliter
        la communication par voie électronique sont dispensés de consentement préalable au titre de
        l’article 82 de la loi n°78-17 du 6 janvier 1978.
      </p>
      <ul>
        <li>Bénéfriches utilise des cookies techniques essentiels à l’utilisation du service.</li>
        <li>
          Bénéfriches utilise des cookies techniques de personnalisation pour mémoriser certaines
          préférences de internaute (thème sombre ou clair, choix de ne plus afficher certaines
          informations, etc.)
        </li>
        <li>Bénéfriches n'utilise pas de cookies nominatifs.</li>
        <li>
          Bénéfriches n'utilise pas de cookies non essentiels au service ou n’ayant pas pour
          finalité exclusive de faciliter la communication par voie électronique.{" "}
        </li>
        <li>
          Les cookies utilisés ne permettent pas de suivre la navigation de l’internaute sur
          d’autres sites.
        </li>
      </ul>
      <p>
        À tout moment, vous pouvez refuser l’utilisation des cookies et désactiver le dépôt sur
        votre ordinateur en utilisant la fonction dédiée de votre navigateur (fonction disponible
        notamment sur Microsoft Internet Explorer 11, Google Chrome, Mozilla Firefox, Apple Safari
        et Opera). Néanmoins, il est possible que certaines sections du site ne fonctionnent pas
        correctement suite à cette désactivation.
      </p>
    </>
  );
}

export default PolitiqueConfidentialiteContent;
