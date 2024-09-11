import Badge from "@/shared/views/components/Badge/Badge";
import TooltipInfoButton from "@/shared/views/components/TooltipInfoButton/TooltipInfoButton";

type Props = {
  siteName: string;
};

const ExpressProjectTooltipBadge = ({ siteName }: Props) => {
  return (
    <Badge small className="tw-ml-3" style="green-tilleul">
      <span>Projet express</span>
      <TooltipInfoButton
        text={
          <div>
            <span>
              Bénéfriches a généré, au sein du site "{siteName}", un projet de quartier comprenant
              des habitations, des espaces verts et des espaces publics.
            </span>
            <br />
            <br />
            Le projet a été créé en mode express. La plupart des données du projet (aménagement des
            espaces, dépenses et recettes, emplois mobilisés...) ont été affectées automatiquement,
            en se basant sur des hypothèses ou des moyennes. Cela signifie que les indicateurs du
            bilan d'opération et les impacts socio-économiques ont été calculés à partir de montant
            théoriques et peuvent ne pas refléter la réalité de votre projet.
            <br />
            {/* TODO: add link once page is available*/}
            {/* Pour savoir quelles sont les données utilisées par Bénéfriches, rendez-vous
                        dans l'onglet “Caractéristiques” */}
          </div>
        }
      />
    </Badge>
  );
};

export default ExpressProjectTooltipBadge;
