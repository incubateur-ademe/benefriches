import { getSelectionInfos } from "./getSelectionDetails";

const MOCK_SITES_LIST = [
  {
    id: "c8ad6277-69da-4b9c-9151-5bf2b16a870e",
    name: "Friche administrative de Gueltas",
    isFriche: true,
    reconversionProjectIds: ["e0f0bbb5-535a-43ec-99a7-de0c23a5210d"],
  },
  {
    id: "76944328-252c-4e0b-ae29-129f5a702186",
    name: "Friche d'habitat de San-Martino-di-Lota",
    isFriche: true,
    reconversionProjectIds: [],
  },
  {
    id: "8df69bf0-1148-4a91-b32b-fe32eec3520f",
    name: "Espace agricole de Centuri",
    isFriche: false,
    reconversionProjectIds: [
      "afa023c6-162c-4571-9d46-58a3e9fd75b7",
      "fc1f0e45-bd8e-471d-99ee-73509af3dc47",
    ],
  },
  {
    id: "22339455-2ca2-4e2f-ab6b-bb3e2709f3e0",
    name: "Friche d'habitat de Forcalquier",
    isFriche: true,
    reconversionProjectIds: [
      "b1cb446c-fe38-44e9-8bee-f62c5be903d3",
      "e7c9b932-97e0-4c8a-b5fd-37a15723fecc",
    ],
  },
  {
    id: "cd11d4d0-ad26-4e2b-9cdb-ac05bdb8cd8e",
    name: "Espace agricole de Anzin",
    isFriche: false,
    reconversionProjectIds: [],
  },
];

const MOCK_PROJECTS_LIST = [
  {
    id: "e0f0bbb5-535a-43ec-99a7-de0c23a5210d",
    name: "Projet photovoltaïque",
    siteId: "c8ad6277-69da-4b9c-9151-5bf2b16a870e",
    siteName: "Friche administrative de Gueltas",
    type: "PHOTOVOLTAIC_POWER_PLANT",
  },
  {
    id: "afa023c6-162c-4571-9d46-58a3e9fd75b7",
    name: "Projet photovoltaïque",
    siteId: "8df69bf0-1148-4a91-b32b-fe32eec3520f",
    siteName: "Espace agricole de Centuri",
    type: "PHOTOVOLTAIC_POWER_PLANT",
  },
  {
    id: "fc1f0e45-bd8e-471d-99ee-73509af3dc47",
    name: "Projet photovoltaïque",
    siteId: "8df69bf0-1148-4a91-b32b-fe32eec3520f",
    siteName: "Espace agricole de Centuri",
    type: "PHOTOVOLTAIC_POWER_PLANT",
  },
  {
    id: "b1cb446c-fe38-44e9-8bee-f62c5be903d3",
    name: "Projet photovoltaïque",
    siteId: "22339455-2ca2-4e2f-ab6b-bb3e2709f3e0",
    siteName: "Friche d'habitat de Forcalquier",
    type: "PHOTOVOLTAIC_POWER_PLANT",
  },
  {
    id: "e7c9b932-97e0-4c8a-b5fd-37a15723fecc",
    name: "Projet quartier",
    siteId: "22339455-2ca2-4e2f-ab6b-bb3e2709f3e0",
    siteName: "Friche d'habitat de Forcalquier",
    type: "URBAN_BUILDINGS",
  },
];

describe("My projects page comparaison selection information", () => {
  it("returns no baseScenario nor withScenario if nothing is selected, everything is selectable except site with no projects", () => {
    expect(getSelectionInfos(MOCK_SITES_LIST, MOCK_PROJECTS_LIST, [], undefined)).toEqual({
      selectedIds: [],
      selectableIds: [
        "c8ad6277-69da-4b9c-9151-5bf2b16a870e",
        "8df69bf0-1148-4a91-b32b-fe32eec3520f",
        "22339455-2ca2-4e2f-ab6b-bb3e2709f3e0",
        "e0f0bbb5-535a-43ec-99a7-de0c23a5210d",
        "afa023c6-162c-4571-9d46-58a3e9fd75b7",
        "fc1f0e45-bd8e-471d-99ee-73509af3dc47",
        "b1cb446c-fe38-44e9-8bee-f62c5be903d3",
        "e7c9b932-97e0-4c8a-b5fd-37a15723fecc",
      ],
    });
  });

  it("returns only projects of site for statu quo baseScenario selected", () => {
    expect(
      getSelectionInfos(
        MOCK_SITES_LIST,
        MOCK_PROJECTS_LIST,
        [],
        "22339455-2ca2-4e2f-ab6b-bb3e2709f3e0",
      ),
    ).toEqual({
      selectedIds: ["22339455-2ca2-4e2f-ab6b-bb3e2709f3e0"],
      selectableIds: [
        "b1cb446c-fe38-44e9-8bee-f62c5be903d3",
        "e7c9b932-97e0-4c8a-b5fd-37a15723fecc",
      ],
      baseScenario: {
        type: "STATU_QUO",
        id: "22339455-2ca2-4e2f-ab6b-bb3e2709f3e0",
        name: "Site en friche",
        siteName: "Friche d'habitat de Forcalquier",
      },
    });
  });

  it("returns related site statu quo, other project of the site and other photovoltaic projects (differents sites)", () => {
    expect(
      getSelectionInfos(
        MOCK_SITES_LIST,
        MOCK_PROJECTS_LIST,
        ["fc1f0e45-bd8e-471d-99ee-73509af3dc47"],
        undefined,
      ),
    ).toEqual({
      selectedIds: ["fc1f0e45-bd8e-471d-99ee-73509af3dc47"],
      selectableIds: [
        "8df69bf0-1148-4a91-b32b-fe32eec3520f",
        "e0f0bbb5-535a-43ec-99a7-de0c23a5210d",
        "afa023c6-162c-4571-9d46-58a3e9fd75b7",
        "fc1f0e45-bd8e-471d-99ee-73509af3dc47",
        "b1cb446c-fe38-44e9-8bee-f62c5be903d3",
      ],
      baseScenario: {
        type: "PROJECT",
        id: "fc1f0e45-bd8e-471d-99ee-73509af3dc47",
        name: "Projet photovoltaïque",
        siteName: "Espace agricole de Centuri",
      },
    });
  });

  it("returns related site statu quo and other project of the site", () => {
    expect(
      getSelectionInfos(
        MOCK_SITES_LIST,
        MOCK_PROJECTS_LIST,
        ["e7c9b932-97e0-4c8a-b5fd-37a15723fecc"],
        undefined,
      ),
    ).toEqual({
      selectedIds: ["e7c9b932-97e0-4c8a-b5fd-37a15723fecc"],
      selectableIds: [
        "22339455-2ca2-4e2f-ab6b-bb3e2709f3e0",
        "b1cb446c-fe38-44e9-8bee-f62c5be903d3",
        "e7c9b932-97e0-4c8a-b5fd-37a15723fecc",
      ],
      baseScenario: {
        type: "PROJECT",
        id: "e7c9b932-97e0-4c8a-b5fd-37a15723fecc",
        name: "Projet quartier",
        siteName: "Friche d'habitat de Forcalquier",
      },
    });
  });

  it("returns no selectable ids and the right infos for baseScenario statu quo and withScenario Project", () => {
    expect(
      getSelectionInfos(
        MOCK_SITES_LIST,
        MOCK_PROJECTS_LIST,
        ["e7c9b932-97e0-4c8a-b5fd-37a15723fecc"],
        "22339455-2ca2-4e2f-ab6b-bb3e2709f3e0",
      ),
    ).toEqual({
      selectedIds: ["22339455-2ca2-4e2f-ab6b-bb3e2709f3e0", "e7c9b932-97e0-4c8a-b5fd-37a15723fecc"],
      selectableIds: [],
      baseScenario: {
        type: "STATU_QUO",
        id: "22339455-2ca2-4e2f-ab6b-bb3e2709f3e0",
        name: "Site en friche",
        siteName: "Friche d'habitat de Forcalquier",
      },
      withScenario: {
        id: "e7c9b932-97e0-4c8a-b5fd-37a15723fecc",
        name: "Projet quartier",
        siteName: "Friche d'habitat de Forcalquier",
      },
    });
  });
  it("returns no selectable ids and the right infos for baseScenario project and withScenario Project", () => {
    expect(
      getSelectionInfos(
        MOCK_SITES_LIST,
        MOCK_PROJECTS_LIST,
        ["e7c9b932-97e0-4c8a-b5fd-37a15723fecc", "b1cb446c-fe38-44e9-8bee-f62c5be903d3"],
        undefined,
      ),
    ).toEqual({
      selectedIds: ["e7c9b932-97e0-4c8a-b5fd-37a15723fecc", "b1cb446c-fe38-44e9-8bee-f62c5be903d3"],
      selectableIds: [],
      baseScenario: {
        type: "PROJECT",
        id: "e7c9b932-97e0-4c8a-b5fd-37a15723fecc",
        name: "Projet quartier",
        siteName: "Friche d'habitat de Forcalquier",
      },
      withScenario: {
        id: "b1cb446c-fe38-44e9-8bee-f62c5be903d3",
        name: "Projet photovoltaïque",
        siteName: "Friche d'habitat de Forcalquier",
      },
    });
  });
  it("returns no selectable ids and the right infos for baseScenario project and withScenario Project on different sites", () => {
    expect(
      getSelectionInfos(
        MOCK_SITES_LIST,
        MOCK_PROJECTS_LIST,
        ["e0f0bbb5-535a-43ec-99a7-de0c23a5210d", "b1cb446c-fe38-44e9-8bee-f62c5be903d3"],
        undefined,
      ),
    ).toEqual({
      selectedIds: ["e0f0bbb5-535a-43ec-99a7-de0c23a5210d", "b1cb446c-fe38-44e9-8bee-f62c5be903d3"],
      selectableIds: [],
      baseScenario: {
        type: "PROJECT",
        id: "e0f0bbb5-535a-43ec-99a7-de0c23a5210d",
        name: "Projet photovoltaïque",
        siteName: "Friche administrative de Gueltas",
      },
      withScenario: {
        id: "b1cb446c-fe38-44e9-8bee-f62c5be903d3",
        name: "Projet photovoltaïque",
        siteName: "Friche d'habitat de Forcalquier",
      },
    });
  });
});
