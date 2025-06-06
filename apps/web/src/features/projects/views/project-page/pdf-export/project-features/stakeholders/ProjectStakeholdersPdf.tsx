import DataLine from "../../components/DataLine";
import FeaturesSection from "../../components/FeaturesSection";

type Props = {
  developerName?: string;
  futureOwner?: string;
  futureOperator?: string;
  reinstatementContractOwner?: string;
};

export default function ProjectStakeholdersPdf({
  developerName,
  futureOperator,
  futureOwner,
  reinstatementContractOwner,
}: Props) {
  return (
    <FeaturesSection title="👱 Acteurs">
      <DataLine
        label="Aménageur du site"
        value={developerName ?? "Non renseigné"}
        labelClassName="font-bold"
      />
      <DataLine
        label="Futur propriétaire du site"
        value={futureOwner ?? "Pas de changement de propriétaire"}
        labelClassName="font-bold"
      />
      {futureOperator && (
        <DataLine label="Futur exploitant" labelClassName="font-bold" value={futureOperator} />
      )}
      {reinstatementContractOwner && (
        <DataLine
          label="Maître d'ouvrage des travaux de remise en état de la friche"
          value={reinstatementContractOwner}
          labelClassName="font-bold"
        />
      )}
    </FeaturesSection>
  );
}
