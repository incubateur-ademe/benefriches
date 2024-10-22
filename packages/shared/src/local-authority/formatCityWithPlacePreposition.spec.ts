import { formatCityWithPlacePreposition } from "./formatCityWithPlacePreposition";

describe("strings: format city name with french 'préposition de lieu' rules", () => {
  it("should format city name : de + la -> de la", () => {
    expect(formatCityWithPlacePreposition("La Francheville")).toEqual("de La Francheville");
    expect(formatCityWithPlacePreposition("la Bassée")).toEqual("de La Bassée");
  });
  it("should format city name : de + l' -> de l'", () => {
    expect(formatCityWithPlacePreposition("L'Aiguillon-sur-Mer")).toEqual("de L'Aiguillon-sur-Mer");
    expect(formatCityWithPlacePreposition("l'Isle-sur-le-Doubs")).toEqual("de L'Isle-sur-le-Doubs");
  });
  it("should format city name : de + le -> du", () => {
    expect(formatCityWithPlacePreposition("Le Poizat-Lalleyriat")).toEqual("du Poizat-Lalleyriat");
    expect(formatCityWithPlacePreposition("le Grand-Serre")).toEqual("du Grand-Serre");
    expect(formatCityWithPlacePreposition("le Pont-de-Beauvoisin")).toEqual(
      "du Pont-de-Beauvoisin",
    );
    expect(formatCityWithPlacePreposition("Abergement-le-Grand")).toEqual("d'Abergement-le-Grand");
    expect(formatCityWithPlacePreposition("Sury-le-Comtal")).toEqual("de Sury-le-Comtal");
  });
  it("should format city name : de + les -> des", () => {
    expect(formatCityWithPlacePreposition("Les Vigneaux")).toEqual("des Vigneaux");
    expect(formatCityWithPlacePreposition("Les Deux-Villes")).toEqual("des Deux-Villes");
    expect(formatCityWithPlacePreposition("Les Églises-d'Argenteuil")).toEqual(
      "des Églises-d'Argenteuil",
    );
    expect(formatCityWithPlacePreposition("Saint-Laurent-les Bains - Laval d'Aurelle")).toEqual(
      "de Saint-Laurent-les Bains - Laval d'Aurelle",
    );
  });
  it("should format city name : de + voyelle -> d'", () => {
    expect(formatCityWithPlacePreposition("Ornon")).toEqual("d'Ornon");
    expect(formatCityWithPlacePreposition("ornon")).toEqual("d'Ornon");
    expect(formatCityWithPlacePreposition("Abergement-le-Grand")).toEqual("d'Abergement-le-Grand");
    expect(formatCityWithPlacePreposition("ussel-d'Allier")).toEqual("d'Ussel-d'Allier");
  });
  it("should format city name : de + h -> d'", () => {
    expect(formatCityWithPlacePreposition("Houdain")).toEqual("d'Houdain");
    expect(formatCityWithPlacePreposition("houdain")).toEqual("d'Houdain");
    expect(formatCityWithPlacePreposition("Hautecourt-Romanèche")).toEqual(
      "d'Hautecourt-Romanèche",
    );
  });
});
