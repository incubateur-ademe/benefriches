import React from "react";

import type { ProjectFeatures } from "@/features/projects/domain/projects.types";

import DevelopmentPlanFeaturesPdf from "./DevelopmentPlanFeaturesPdf";

function collectText(node: React.ReactNode): string[] {
  if (node === null || node === undefined || typeof node === "boolean") {
    return [];
  }

  if (typeof node === "string" || typeof node === "number") {
    return [String(node)];
  }

  if (Array.isArray(node)) {
    return node.flatMap(collectText);
  }

  if (!React.isValidElement(node)) {
    return [];
  }

  type AnyProps = Record<string, unknown> & { children?: React.ReactNode };
  const element = node as React.ReactElement<AnyProps>;
  const componentName = typeof element.type === "function" ? element.type.name : undefined;
  const shouldResolveComponent =
    typeof element.type === "function" &&
    !["Text", "View", "Page", "Document", "Image"].includes(componentName ?? "");

  if (shouldResolveComponent) {
    const Component = element.type as (props: AnyProps) => React.ReactNode;
    return collectText(Component(element.props));
  }

  return collectText(element.props.children);
}

describe("DevelopmentPlanFeaturesPdf", () => {
  it("renders persisted urban-project buildings reuse data when available", () => {
    const projectFeatures = {
      developmentPlan: {
        type: "URBAN_PROJECT",
        buildingsFloorAreaDistribution: {
          RESIDENTIAL: 1000,
          OFFICES: 500,
        },
        buildingsFootprintToReuse: 1200,
        existingBuildingsUsesFloorSurfaceArea: {
          RESIDENTIAL: 800,
          OFFICES: 400,
        },
        newBuildingsUsesFloorSurfaceArea: {
          RESIDENTIAL: 300,
          OFFICES: 200,
        },
        developerWillBeBuildingsConstructor: true,
      },
      soilsDistribution: [
        {
          soilType: "BUILDINGS",
          spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
          surfaceArea: 2000,
        },
      ],
    } as unknown as ProjectFeatures;

    const text = collectText(DevelopmentPlanFeaturesPdf(projectFeatures)).join(" ");

    expect(text).toContain("Emprise au sol des bâtiments à réemployer");
    expect(text).toContain("1 200 m²");
    expect(text).toContain("Emprise au sol des nouveaux bâtiments");
    expect(text).toContain("800 m²");
    expect(text).toContain("Bâtiments existants");
    expect(text).toContain("Bâtiments neufs");
    expect(text).toContain("Oui");
    expect(text).toContain("Logements");
    expect(text).toContain("Bureaux");
  });
});
