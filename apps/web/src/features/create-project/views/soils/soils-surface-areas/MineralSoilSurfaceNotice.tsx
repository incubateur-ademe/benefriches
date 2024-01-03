import SurfaceArea from "@/shared/views/components/SurfaceArea/SurfaceArea";

type Props = {
  advisedSurface: number;
};

function MineralSoilSurfaceNotice({ advisedSurface }: Props) {
  return (
    <p>
      Compte tenu des ratios usuels, les <strong>sols minéraux</strong> devraient faire au minimum{" "}
      <SurfaceArea surfaceAreaInSquareMeters={advisedSurface} />. C’est la superficie requise pour{" "}
      <strong>les pistes d’accès</strong>.
    </p>
  );
}

export default MineralSoilSurfaceNotice;
