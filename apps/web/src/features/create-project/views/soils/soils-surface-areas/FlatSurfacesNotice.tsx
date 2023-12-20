import SurfaceArea from "@/shared/views/components/SurfaceArea/SurfaceArea";

type Props = {
  advisedSurface: number;
};

function FlatSurfacesNotice({ advisedSurface }: Props) {
  return (
    <p>
      Compte tenu des ratios usuels, les <strong>surfaces planes</strong>{" "}
      (c’est-à-dire tous les sols hors{" "}
      <strong>bâtiments, forêts, prairie arborée et sols arboré</strong>)
      devraient totaliser au minimum{" "}
      <SurfaceArea surfaceAreaInSquareMeters={advisedSurface} />. C’est la
      superficie requise pour vos panneaux photovoltaïques.
    </p>
  );
}

export default FlatSurfacesNotice;
