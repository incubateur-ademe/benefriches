import SurfaceArea from "@/shared/views/components/SurfaceArea/SurfaceArea";

type Props = {
  advisedSurface: number;
};

function ImpermeableSurfacesNotice({ advisedSurface }: Props) {
  return (
    <p>
      Compte tenu des ratios usuels, les <strong>sols imperméables</strong> devraient faire au
      minimum <SurfaceArea surfaceAreaInSquareMeters={advisedSurface} />. C’est la superficie
      qu’occuperont <strong>les fondations des panneaux</strong>.
    </p>
  );
}

export default ImpermeableSurfacesNotice;
