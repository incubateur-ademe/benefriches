import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

type Props = {
  advisedSurface: number;
};

function ImpermeableSurfacesNotice({ advisedSurface }: Props) {
  return (
    <p>
      Compte tenu des ratios usuels, les <strong>sols imperméables</strong>{" "}
      devraient faire au minimum {formatNumberFr(advisedSurface)} m2. C’est la
      superficie qu’occuperont <strong>les fondations des panneaux</strong>.
    </p>
  );
}

export default ImpermeableSurfacesNotice;
