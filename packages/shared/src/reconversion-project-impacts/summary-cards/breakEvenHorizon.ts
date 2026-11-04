export type BreakEvenHorizon =
  | { status: "positiveFromFirstYear"; breakEvenYear: string }
  | { status: "compensated"; breakEvenYear: string; yearsToBreakEven: number }
  // breakEvenYear may still be set: the break-even falls after the (cropped) projection years.
  | { status: "notCompensatedWithinPeriod"; breakEvenYear: string | undefined };

// When the project's socio-economic impacts compensate its cost, relative to the projection years
// shown (the Synthèse tab's break-even card).
export const getBreakEvenHorizon = ({
  breakEvenYear,
  projectionYears,
}: {
  breakEvenYear?: string;
  projectionYears: string[];
}): BreakEvenHorizon => {
  const breakEvenIndex = breakEvenYear ? projectionYears.indexOf(breakEvenYear) : undefined;

  if (breakEvenYear && breakEvenIndex !== undefined && breakEvenIndex !== -1) {
    if (breakEvenIndex === 0) {
      return { status: "positiveFromFirstYear", breakEvenYear };
    }
    return { status: "compensated", breakEvenYear, yearsToBreakEven: breakEvenIndex };
  }

  return { status: "notCompensatedWithinPeriod", breakEvenYear };
};
