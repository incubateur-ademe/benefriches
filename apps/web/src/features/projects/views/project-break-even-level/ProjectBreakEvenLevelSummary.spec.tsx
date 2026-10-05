import { render } from "@testing-library/react";
import { Provider } from "react-redux";

import { createStore } from "@/app/store/store";
import { getInitialState } from "@/features/projects/application/project-impacts/projectImpacts.reducer";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import ProjectBreakEvenLevelSummary from "./ProjectBreakEvenLevelSummary";

// Characterization of the break-even card, pinned on the component as it was before the
// break-even horizon moved to the shared package.

const renderSummary = ({
  breakEvenYear,
  projectionYears,
  evaluationPeriod,
}: {
  breakEvenYear?: string;
  projectionYears: string[];
  evaluationPeriod: number;
}) => {
  const store = createStore(getTestAppDependencies(), {
    projectImpacts: { ...getInitialState(), evaluationPeriod },
  });
  return render(
    <Provider store={store}>
      <ProjectBreakEvenLevelSummary
        breakEvenYear={breakEvenYear}
        projectionYears={projectionYears}
      />
    </Provider>,
  );
};

describe("ProjectBreakEvenLevelSummary", () => {
  it("shows a positive balance when break-even is the first projection year", () => {
    const { container } = renderSummary({
      breakEvenYear: "2026",
      projectionYears: ["2026", "2027", "2028", "2029", "2030"],
      evaluationPeriod: 5,
    });

    expect(container.textContent).toEqual(
      "En 2026Bilan de l'opération positifLa somme du bilan économique et des impacts socio-économiques est positive dès 2026.",
    );
  });

  it("shows the years until break-even when it falls inside the projection years", () => {
    const { container } = renderSummary({
      breakEvenYear: "2029",
      projectionYears: ["2026", "2027", "2028", "2029", "2030"],
      evaluationPeriod: 5,
    });

    expect(container.textContent).toEqual(
      "En 3 ansCoût de l'opération compenséLes impacts socio-économiques compenseront le coût de l'opération en 2029.",
    );
  });

  it("shows a single year until break-even", () => {
    const { container } = renderSummary({
      breakEvenYear: "2027",
      projectionYears: ["2026", "2027", "2028", "2029", "2030"],
      evaluationPeriod: 5,
    });

    expect(container.textContent).toEqual(
      "En 1 anCoût de l'opération compenséLes impacts socio-économiques compenseront le coût de l'opération en 2027.",
    );
  });

  it("shows an uncompensated cost with the break-even year when it falls after the projection years", () => {
    const { container } = renderSummary({
      breakEvenYear: "2045",
      projectionYears: ["2026", "2027", "2028", "2029", "2030"],
      evaluationPeriod: 5,
    });

    expect(container.textContent).toEqual(
      "Sur 5 ansCoût de l'opération non compenséLes impacts socio-économiques compenseront le coût de l'opération en 2045.",
    );
  });

  it("shows an uncompensated cost when there is no break-even year", () => {
    const { container } = renderSummary({
      breakEvenYear: undefined,
      projectionYears: ["2026", "2027", "2028", "2029", "2030"],
      evaluationPeriod: 5,
    });

    expect(container.textContent).toEqual(
      "Sur 5 ansCoût de l'opération non compenséLes impacts socio-économiques ne compenseront pas le coût de l'opération.",
    );
  });
});
