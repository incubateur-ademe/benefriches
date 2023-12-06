import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

type Props = {
  advisedSurface: number;
};

function FlatSurfacesNotice({ advisedSurface }: Props) {
  return (
    <p>
      Compte tenu des ratios usuels, les <strong>surfaces planes</strong>{" "}
      (c’est-à-dire tous les sols hors{" "}
      <strong>bâtiments, forêts, prairie arborée et sols arboré</strong>)
      devraient totaliser au minimum {formatNumberFr(advisedSurface)} m2. C’est
      la superficie requise pour vos panneaux photovoltaïques.
    </p>
  );
}

export default FlatSurfacesNotice;
