import formatLocalAuthorityName, {
  formatEpciName,
  formatMunicipalityName,
} from "./formatLocalAuthorityName";

describe("strings: format mairies name", () => {
  it("should format municipality name with « élision »", () => {
    expect(formatMunicipalityName("Ornon")).toEqual("Mairie d'Ornon");
    expect(formatMunicipalityName("ornon")).toEqual("Mairie d'Ornon");
  });
  it("should format municipality name without « élision »", () => {
    expect(formatMunicipalityName("Lens")).toEqual("Mairie de Lens");
    expect(formatMunicipalityName("lens")).toEqual("Mairie de Lens");
  });
  it("should format municipality name with « élision » for city that starts with « H »", () => {
    expect(formatMunicipalityName("Hesdin")).toEqual("Mairie d'Hesdin");
    expect(formatMunicipalityName("hesdin")).toEqual("Mairie d'Hesdin");
  });
});

describe("strings: format epcis name", () => {
  it("should format epci name with « Communauté de Communes »", () => {
    expect(formatEpciName("CC de l'Oisans")).toEqual("Communauté de Communes de l'Oisans");
  });
  it("should format epci name with « Communauté d'Agglomération »", () => {
    expect(formatEpciName("CA Villefranche Beaujolais Saône")).toEqual(
      "Communauté d'Agglomération Villefranche Beaujolais Saône",
    );
  });
  it("should format epci name with « Communauté Urbaine »", () => {
    expect(formatEpciName("CU Angers Loire Métropole")).toEqual(
      "Communauté Urbaine Angers Loire Métropole",
    );
  });
  it("should not format epci name with no CA nor CC", () => {
    expect(formatEpciName("Grenoble-Alpes-Métropole")).toEqual("Grenoble-Alpes-Métropole");
  });
});

describe("strings: format local authority name", () => {
  const withNoEPCI = {
    city: {
      name: "Paris 10e Arrondissement",
      code: "75110",
    },
    department: {
      code: "75",
      name: "Paris",
    },
    region: {
      code: "11",
      name: "Île-de-France",
    },
  };
  const withEPCI = {
    city: {
      code: "38185",
      name: "Grenoble",
    },
    epci: {
      code: "200040715",
      name: "Grenoble-Alpes-Métropole",
    },
    department: {
      code: "38",
      name: "Isère",
    },
    region: {
      code: "84",
      name: "Auvergne-Rhône-Alpes",
    },
  };

  it("should return empty string", () => {
    expect(formatLocalAuthorityName("epci", withNoEPCI)).toEqual("");
  });

  it("should format epci name", () => {
    expect(formatLocalAuthorityName("epci", withEPCI)).toEqual("Grenoble-Alpes-Métropole");
  });

  it("should format municipality name", () => {
    expect(formatLocalAuthorityName("municipality", withEPCI)).toEqual("Mairie de Grenoble");
  });

  it("should format region name", () => {
    expect(formatLocalAuthorityName("region", withEPCI)).toEqual("Région Auvergne-Rhône-Alpes");
  });

  it("should format department name", () => {
    expect(formatLocalAuthorityName("department", withEPCI)).toEqual("Département Isère");
  });
});
