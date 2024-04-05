import {
  RECOMMENDED_M2_PER_KWC_FOR_ACCESS_PATHS,
  RECOMMENDED_M2_PER_KWC_FOR_FOUNDATIONS,
} from "@/features/create-project/domain/photovoltaic";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import SurfaceArea from "@/shared/views/components/SurfaceArea/SurfaceArea";

type Props = {
  advisedImpermeableSurface: number;
  advisedMineralSurface: number;
};

const RATIO_IMPERMEABLE_SOIL_HA_PER_MWC = (RECOMMENDED_M2_PER_KWC_FOR_FOUNDATIONS / 10000) * 1000;
const RATIO_IMPERMEABLE_SOIL_SQUARE_METERS_PER_MWC = RECOMMENDED_M2_PER_KWC_FOR_FOUNDATIONS * 1000;

const RATIO_MINERAL_SOIL_HA_PER_MWC = (RECOMMENDED_M2_PER_KWC_FOR_ACCESS_PATHS / 10000) * 1000;
const RATIO_MINERAL_SOIL_SQUARE_METERS_PER_MWC = RECOMMENDED_M2_PER_KWC_FOR_ACCESS_PATHS * 1000;

function PhotovoltaicSoilsImpactsNotice({
  advisedImpermeableSurface,
  advisedMineralSurface,
}: Props) {
  return (
    <>
      <p>
        Comme tout projet de production d’énergie, l’implantation de centrale photovoltaïque au sol
        génère, comme son nom le laisse entendre, des impacts sur les sols. Ces impacts sont
        toutefois limités.
      </p>
      <p>
        Ils sont liés à la création des pistes d’accès, à l’implantation des structures porteuses
        des panneaux (fondations, lests, pieux…) ou encore aux infrastructures de raccordement au
        réseau électrique (tranchées pour les câbles, installation d’un transformateur…).
      </p>
      <p>
        Les ratios usuels suivants sont recommandés par Bénéfriches dans le calcul des surfaces
        imperméabilisées et autrement artificialisées par une centrale photovoltaïque au sol&nbsp;:
      </p>
      <ul>
        <li>
          Taux d’artificialisation&nbsp;= Taux d’imperméabilisation + Taux d’artificialisation autre
          (création de pistes d’accès en granulats non liés)
        </li>
        <li>
          Taux d’imperméabilisation&nbsp;= {formatNumberFr(RATIO_IMPERMEABLE_SOIL_HA_PER_MWC, 3)}
          &nbsp;ha/MWc ou {formatNumberFr(RATIO_IMPERMEABLE_SOIL_SQUARE_METERS_PER_MWC)}
          &nbsp;m²/MWc
        </li>
        <li>
          Taux d’artificialisation autre&nbsp;= {formatNumberFr(RATIO_MINERAL_SOIL_HA_PER_MWC, 3)}
          &nbsp;ha/MWc ou {formatNumberFr(RATIO_MINERAL_SOIL_SQUARE_METERS_PER_MWC)}&nbsp;m²/MWc
        </li>
      </ul>
      <p>
        Compte tenu des ratios, les <strong>sols imperméables</strong> devraient faire au minimum{" "}
        <SurfaceArea surfaceAreaInSquareMeters={advisedImpermeableSurface} /> et les{" "}
        <strong>sols minéraux</strong> devraient faire au minimum{" "}
        <SurfaceArea surfaceAreaInSquareMeters={advisedMineralSurface} />
      </p>
    </>
  );
}

export default PhotovoltaicSoilsImpactsNotice;
