import HighlightsListItem from "./HighlightsListItem";

export default function MutafrichesHighlights() {
  return (
    <ul className="list-none p-0">
      <HighlightsListItem>7 usages potentiels analysés</HighlightsListItem>
      <HighlightsListItem>
        Score de compatibilité entre votre friche et les usages
      </HighlightsListItem>
      <HighlightsListItem>
        Impacts socio-économiques évaluables pour certains usages
      </HighlightsListItem>
    </ul>
  );
}
