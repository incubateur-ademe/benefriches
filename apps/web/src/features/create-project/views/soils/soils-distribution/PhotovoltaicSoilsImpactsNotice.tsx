import {
  RECOMMENDED_M2_PER_KWC_FOR_ACCESS_PATHS,
  RECOMMENDED_M2_PER_KWC_FOR_FOUNDATIONS,
} from "@/features/create-project/domain/photovoltaic";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import SurfaceArea from "@/shared/views/components/SurfaceArea/SurfaceArea";
import FormDefinition from "@/shared/views/layout/WizardFormLayout/FormDefinition";
import FormWarning from "@/shared/views/layout/WizardFormLayout/FormWarning";

type Props = {
  advisedImpermeableSurface: number;
  advisedMineralSurface: number;
  advisedFlatSurface: number;
  siteSurfaceArea: number;
};

const RATIO_IMPERMEABLE_SOIL_HA_PER_MWC = (RECOMMENDED_M2_PER_KWC_FOR_FOUNDATIONS / 10000) * 1000;
const RATIO_IMPERMEABLE_SOIL_SQUARE_METERS_PER_MWC = RECOMMENDED_M2_PER_KWC_FOR_FOUNDATIONS * 1000;

const RATIO_MINERAL_SOIL_HA_PER_MWC = (RECOMMENDED_M2_PER_KWC_FOR_ACCESS_PATHS / 10000) * 1000;
const RATIO_MINERAL_SOIL_SQUARE_METERS_PER_MWC = RECOMMENDED_M2_PER_KWC_FOR_ACCESS_PATHS * 1000;

function PhotovoltaicSoilsImpactsNotice({
  advisedImpermeableSurface,
  advisedMineralSurface,
  advisedFlatSurface,
  siteSurfaceArea,
}: Props) {
  return (
    <>
      <FormWarning>
        <p>
          Le total des surfaces ne peut pas dépasser{" "}
          <SurfaceArea surfaceAreaInSquareMeters={siteSurfaceArea} />. Pour pouvoir augmenter la
          surface d’un sol, vous devez d’abord réduire la surface d’un autre sol.
        </p>
      </FormWarning>
      <p>
        Compte tenu des ratios, les <strong>sols imperméables</strong> devraient faire au minimum{" "}
        <SurfaceArea surfaceAreaInSquareMeters={advisedImpermeableSurface} /> et les{" "}
        <strong>sols minéraux</strong> devraient faire au minimum{" "}
        <SurfaceArea surfaceAreaInSquareMeters={advisedMineralSurface} />
      </p>
      <p>
        Compte tenu des ratios usuels, les <strong>surfaces planes</strong> (c'est-à-dire tous les
        sols hors <strong>bâtiments, forêts, prairie arborée et sols arboré</strong>) devraient
        totaliser au minimum <SurfaceArea surfaceAreaInSquareMeters={advisedFlatSurface} />. C'est
        la superficie requise pour vos panneaux photovoltaïques.
      </p>

      <FormDefinition>
        <p>
          Comme tout projet de production d'énergie, l'implantation de centrale photovoltaïque au
          sol génère, comme son nom le laisse entendre, des impacts sur les sols. Ces impacts sont
          toutefois limités.
        </p>
        <p>
          Ils sont liés à la création des pistes d'accès, à l'implantation des structures porteuses
          des panneaux (fondations, lests, pieux…) ou encore aux infrastructures de raccordement au
          réseau électrique (tranchées pour les câbles, installation d'un transformateur…).
        </p>
        <p>
          Les ratios usuels suivants sont recommandés par Bénéfriches dans le calcul des surfaces
          imperméabilisées et autrement artificialisées par une centrale photovoltaïque au
          sol&nbsp;:
        </p>
        <ul>
          <li>
            Taux d'artificialisation&nbsp;= Taux d'imperméabilisation + Taux d'artificialisation
            autre (création de pistes d'accès en granulats non liés)
          </li>
          <li>
            Taux d'imperméabilisation&nbsp;= {formatNumberFr(RATIO_IMPERMEABLE_SOIL_HA_PER_MWC, 3)}
            &nbsp;ha/MWc ou {formatNumberFr(RATIO_IMPERMEABLE_SOIL_SQUARE_METERS_PER_MWC)}
            &nbsp;m²/MWc
          </li>
          <li>
            Taux d'artificialisation autre&nbsp;= {formatNumberFr(RATIO_MINERAL_SOIL_HA_PER_MWC, 3)}
            &nbsp;ha/MWc ou {formatNumberFr(RATIO_MINERAL_SOIL_SQUARE_METERS_PER_MWC)}&nbsp;m²/MWc
          </li>
        </ul>
      </FormDefinition>
    </>
  );
}

export default PhotovoltaicSoilsImpactsNotice;
