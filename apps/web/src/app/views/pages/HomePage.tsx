import { CallOut } from "@codegouvfr/react-dsfr/CallOut";

function HomePage() {
  return (
    <>
      <h1>Bénéfriches</h1>
      <CallOut title="En construction">
        Ce service est actuellement en cours de construction.
        <br />
        En attendant son déploiement,{" "}
        <a
          href="https://librairie.ademe.fr/changement-climatique-et-energie/3772-evaluer-les-benefices-socio-economiques-de-la-reconversion-de-friches-pour-lutter-contre-l-artificialisation-outil-benefriches.html?results=1009"
          rel="noopener noreferrer"
          target="_blank"
        >
          le tableur Bénéfriches est disponible en téléchargement libre
        </a>
        .
      </CallOut>
    </>
  );
}

export default HomePage;
