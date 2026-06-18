import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formatCityWithPlacePreposition } from "./formatCityWithPlacePreposition.js";

describe("strings: format city name with french 'préposition de lieu' rules", () => {
  it("should format city name : de + la -> de la", () => {
    assert.strictEqual(formatCityWithPlacePreposition("La Francheville"), "de La Francheville");
    assert.strictEqual(formatCityWithPlacePreposition("la Bassée"), "de La Bassée");
  });
  it("should format city name : de + l' -> de l'", () => {
    assert.strictEqual(
      formatCityWithPlacePreposition("L'Aiguillon-sur-Mer"),
      "de L'Aiguillon-sur-Mer",
    );
    assert.strictEqual(
      formatCityWithPlacePreposition("l'Isle-sur-le-Doubs"),
      "de L'Isle-sur-le-Doubs",
    );
  });
  it("should format city name : de + le -> du", () => {
    assert.strictEqual(
      formatCityWithPlacePreposition("Le Poizat-Lalleyriat"),
      "du Poizat-Lalleyriat",
    );
    assert.strictEqual(formatCityWithPlacePreposition("le Grand-Serre"), "du Grand-Serre");
    assert.strictEqual(
      formatCityWithPlacePreposition("le Pont-de-Beauvoisin"),
      "du Pont-de-Beauvoisin",
    );
    assert.strictEqual(
      formatCityWithPlacePreposition("Abergement-le-Grand"),
      "d'Abergement-le-Grand",
    );
    assert.strictEqual(formatCityWithPlacePreposition("Sury-le-Comtal"), "de Sury-le-Comtal");
  });
  it("should format city name : de + les -> des", () => {
    assert.strictEqual(formatCityWithPlacePreposition("Les Vigneaux"), "des Vigneaux");
    assert.strictEqual(formatCityWithPlacePreposition("Les Deux-Villes"), "des Deux-Villes");
    assert.strictEqual(
      formatCityWithPlacePreposition("Les Églises-d'Argenteuil"),
      "des Églises-d'Argenteuil",
    );
    assert.strictEqual(
      formatCityWithPlacePreposition("Saint-Laurent-les Bains - Laval d'Aurelle"),
      "de Saint-Laurent-les Bains - Laval d'Aurelle",
    );
  });
  it("should format city name : de + voyelle -> d'", () => {
    assert.strictEqual(formatCityWithPlacePreposition("Ornon"), "d'Ornon");
    assert.strictEqual(formatCityWithPlacePreposition("ornon"), "d'Ornon");
    assert.strictEqual(
      formatCityWithPlacePreposition("Abergement-le-Grand"),
      "d'Abergement-le-Grand",
    );
    assert.strictEqual(formatCityWithPlacePreposition("ussel-d'Allier"), "d'Ussel-d'Allier");
  });
  it("should format city name : de + h -> d'", () => {
    assert.strictEqual(formatCityWithPlacePreposition("Houdain"), "d'Houdain");
    assert.strictEqual(formatCityWithPlacePreposition("houdain"), "d'Houdain");
    assert.strictEqual(
      formatCityWithPlacePreposition("Hautecourt-Romanèche"),
      "d'Hautecourt-Romanèche",
    );
  });
});
