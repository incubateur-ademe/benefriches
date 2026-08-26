import { render, screen } from "@testing-library/react";

import UrbanProjectBuildingsSection from "./UrbanProjectBuildingsSection";

describe("UrbanProjectBuildingsSection", () => {
  it("shows persisted reuse and construction data when available", () => {
    render(
      <UrbanProjectBuildingsSection
        buildingsFloorAreaDistribution={{
          RESIDENTIAL: 1000,
          OFFICES: 500,
        }}
        projectBuildingsFootprint={2000}
        isExpress={false}
        totalSurfaceArea={5000}
        urbanProjectCategoryLabel="Recyclage"
        buildingsFootprintToReuse={1200}
        existingBuildingsUsesFloorSurfaceArea={{
          RESIDENTIAL: 800,
          OFFICES: 400,
        }}
        newBuildingsUsesFloorSurfaceArea={{
          RESIDENTIAL: 300,
          OFFICES: 200,
        }}
        developerWillBeBuildingsConstructor={true}
      />,
    );

    expect(screen.getByText("Emprise au sol des bâtiments à réemployer")).toBeVisible();
    expect(screen.getAllByText(/1\s*200\s*㎡/).length).toBeGreaterThan(0);
    expect(screen.getByText("Emprise au sol des nouveaux bâtiments")).toBeVisible();
    expect(screen.getAllByText("800 ㎡").length).toBeGreaterThan(0);
    expect(screen.getByText("Bâtiments existants")).toBeVisible();
    expect(screen.getByText("Bâtiments neufs")).toBeVisible();
    expect(screen.getAllByText("Logements")[0]).toBeVisible();
    expect(screen.getAllByText("Bureaux")[0]).toBeVisible();
    expect(screen.getByText("L'aménageur sera constructeur des nouveaux bâtiments")).toBeVisible();
    expect(screen.getByText("Oui")).toBeVisible();
  });

  it("still renders reuse data when no building floor area distribution is present", () => {
    render(
      <UrbanProjectBuildingsSection
        buildingsFloorAreaDistribution={{}}
        projectBuildingsFootprint={0}
        isExpress={false}
        totalSurfaceArea={5000}
        urbanProjectCategoryLabel="Recyclage"
        buildingsFootprintToReuse={800}
        existingBuildingsUsesFloorSurfaceArea={undefined}
        newBuildingsUsesFloorSurfaceArea={undefined}
        developerWillBeBuildingsConstructor={false}
      />,
    );

    expect(screen.getByText("Réemploi et construction")).toBeVisible();
    expect(screen.getByText("Emprise au sol des bâtiments à réemployer")).toBeVisible();
    expect(screen.getByText("800 ㎡")).toBeVisible();
    expect(screen.getByText("L'aménageur sera constructeur des nouveaux bâtiments")).toBeVisible();
    expect(screen.getByText("Non")).toBeVisible();
  });
});
