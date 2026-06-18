import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  formatEpciName,
  formatLocalAuthorityName,
  formatMunicipalityName,
} from "./formatLocalAuthorityName.js";

describe("strings: format mairies name", () => {
  it("should format municipality name with « élision »", () => {
    assert.strictEqual(formatMunicipalityName("Ornon"), "Mairie d'Ornon");
    assert.strictEqual(formatMunicipalityName("ornon"), "Mairie d'Ornon");
  });
  it("should format municipality name without « élision »", () => {
    assert.strictEqual(formatMunicipalityName("Lens"), "Mairie de Lens");
    assert.strictEqual(formatMunicipalityName("lens"), "Mairie de Lens");
  });
  it("should format municipality name with « élision » for city that starts with « H »", () => {
    assert.strictEqual(formatMunicipalityName("Hesdin"), "Mairie d'Hesdin");
    assert.strictEqual(formatMunicipalityName("hesdin"), "Mairie d'Hesdin");
  });
});

describe("strings: format epcis name", () => {
  it("should format epci name with « Communauté de Communes »", () => {
    assert.strictEqual(formatEpciName("CC de l'Oisans"), "Communauté de Communes de l'Oisans");
  });
  it("should format epci name with « Communauté d'Agglomération »", () => {
    assert.strictEqual(
      formatEpciName("CA Villefranche Beaujolais Saône"),
      "Communauté d'Agglomération Villefranche Beaujolais Saône",
    );
  });
  it("should format epci name with « Communauté Urbaine »", () => {
    assert.strictEqual(
      formatEpciName("CU Angers Loire Métropole"),
      "Communauté Urbaine Angers Loire Métropole",
    );
  });
  it("should not format epci name with no CA nor CC", () => {
    assert.strictEqual(formatEpciName("Grenoble-Alpes-Métropole"), "Grenoble-Alpes-Métropole");
  });
});

describe("strings: format local authority name", () => {
  it("should format epci name", () => {
    assert.strictEqual(
      formatLocalAuthorityName("epci", "Grenoble-Alpes-Métropole"),
      "Grenoble-Alpes-Métropole",
    );
  });

  it("should format municipality name", () => {
    assert.strictEqual(formatLocalAuthorityName("municipality", "Grenoble"), "Mairie de Grenoble");
  });

  it("should format region name", () => {
    assert.strictEqual(
      formatLocalAuthorityName("region", "Auvergne-Rhône-Alpes"),
      "Région Auvergne-Rhône-Alpes",
    );
  });

  it("should format department name", () => {
    assert.strictEqual(formatLocalAuthorityName("department", "Isère"), "Département Isère");
  });
});
