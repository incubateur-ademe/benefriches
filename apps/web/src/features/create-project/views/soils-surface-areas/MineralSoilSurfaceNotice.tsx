import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

type Props = {
  advisedSurface: number;
};

function MineralSoilSurfaceNotice({ advisedSurface }: Props) {
  return (
    <p>
      Compte tenu des ratios usuels, les <strong>sols minéraux</strong>{" "}
      devraient faire au minimum {formatNumberFr(advisedSurface)} m2. C’est la
      superficie requise pour <strong>les pistes d’accès</strong>.
    </p>
  );
}

export default MineralSoilSurfaceNotice;
