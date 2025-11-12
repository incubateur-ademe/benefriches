export function getTextForReliabilityScore(reliabilityScore: number): string {
  if (reliabilityScore >= 9) return "Très fiable";
  if (reliabilityScore >= 7) return "Fiable";
  if (reliabilityScore >= 5) return "Moyennement fiable";
  if (reliabilityScore >= 3) return "Peu fiable";
  return "Très peu fiable";
}

export function getTextForCompatibilityScore(compatibilityScore: number): string {
  if (compatibilityScore >= 70) return "Très favorable";
  if (compatibilityScore >= 60) return "Favorable";
  if (compatibilityScore >= 45) return "Correct";
  return "Défavorable";
}

export function getCompatibilityScoreBackgroundColor(compatibilityScore: number): string {
  if (compatibilityScore >= 70) return "bg-success-ultralight";
  if (compatibilityScore >= 60) return "bg-[#DBF7D2]";
  if (compatibilityScore >= 45) return "bg-warning-ultralight";
  return "bg-error-ultralight";
}
