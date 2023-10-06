import { CallOut } from "@codegouvfr/react-dsfr/CallOut";

type Props = {
  siteFoncierName: string;
};

function SiteFoncierDetailsPage({ siteFoncierName }: Props) {
  return (
    <>
      <h1>{siteFoncierName}</h1>
      <CallOut title="En construction">
        La page de détails d'un site foncier est en cours de construction
      </CallOut>
    </>
  );
}

export default SiteFoncierDetailsPage;
