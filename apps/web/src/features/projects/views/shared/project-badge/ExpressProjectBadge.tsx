import Badge from "@/shared/views/components/Badge/Badge";
import InfoTooltip from "@/shared/views/components/InfoTooltip/InfoTooltip";

const ExpressProjectTooltipBadge = () => {
  return (
    <Badge small className="my-2 shrink-1 sm:ml-3 py-0.5" style="blue">
      <span className="mr-1 whitespace-nowrap">Projet express</span>
      <InfoTooltip
        title="⚠️ Attention, cette évaluation comporte des limites.
            Bénéfriches a complété automatiquement certaines caractéristiques concernant votre friche
            et/ou votre projet d'aménagement. Les impacts calculés par l'outil peuvent ne pas refléter la
            réalité de votre friche ou de votre projet."
      />
    </Badge>
  );
};

export default ExpressProjectTooltipBadge;
