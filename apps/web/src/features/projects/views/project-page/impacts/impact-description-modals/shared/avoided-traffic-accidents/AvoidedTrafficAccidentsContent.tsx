import TravelRelatedImpactsIntroduction from "../travel-related-impacts-introduction/TravelRelatedImpactsIntroduction";

type Props = {
  withMonetarisation?: boolean;
};

const AvoidedTrafficAccidentsContent = ({ withMonetarisation }: Props) => {
  return (
    <>
      <TravelRelatedImpactsIntroduction />

      <p>
        La réduction des déplacements attendue par la réalisation du projet urbain en centralité
        conduira à un risque d’accident réduit, que ce soit des dégâts matériels ou humains (que ce
        soit des blessés légers, graves ou encore des décès).
      </p>
      {withMonetarisation && (
        <p>
          En socio-économie, il est possible de déterminer une valeur associé à une réduction de ces
          risques d’accident et d’atteintes corporelles qui en découlent (blessés ou décès).
        </p>
      )}

      <p>
        <strong>Bénéficiaire</strong> : société française
      </p>
    </>
  );
};

export default AvoidedTrafficAccidentsContent;
