import Engine from "publicodes";
import rules from "../dist/index";

const engine = new Engine(rules);

class ConsoleWarning extends Error {
  constructor(message) {
    super(`Failing due to console.warn while running test!\n\n${message}`);
    this.name = "ConsoleWarning";
  }
}

console.warn = (message) => {
  throw new ConsoleWarning(message);
};

describe("Publicode algorithm: collecte d’informations", () => {
  test("doit renvoyer une adresse nulle", () => {
    expect(engine.evaluate("adresse").nodeValue).toBeUndefined();
  });

  test("doit renvoyer un type de friche nul", () => {
    expect(engine.evaluate("type").nodeValue).toBeUndefined();
  });

  test("doit renvoyer l’adresse définie", () => {
    const situation = { adresse: '"22 rue de la paix"' };
    engine.setSituation(situation);
    expect(engine.evaluate("adresse").nodeValue).toEqual("22 rue de la paix");
  });

  test("doit renvoyer oui pour le type de site « friche » et non pour les autres", () => {
    const situation = {
      "type . friche": "oui",
    };

    engine.setSituation(situation);

    expect(engine.evaluate("type . friche").nodeValue).toEqual(true);
    expect(engine.evaluate("type . terre agricole").nodeValue).toEqual(false);
    expect(engine.evaluate("type . prairie").nodeValue).toEqual(false);
    expect(engine.evaluate("type . forêt").nodeValue).toEqual(false);
  });
});

describe("Publicode algorithm: calcul de la surface de la friche", () => {
  test("doit renvoyer une surface de friche nulle", () => {
    expect(engine.evaluate("surface friche").nodeValue).toEqual(0);
  });

  test("doit retourner une erreur lors du calcul de surface si l’unité utilisée est mauvaise", () => {
    const situation = { "espaces . anciens sites de production": "2500 €" };
    engine.setSituation(situation);
    expect(() => engine.evaluate("surface friche")).toThrow(ConsoleWarning);
  });

  test("doit renvoyer une surface de friche égale à la superficie des anciennes usines", () => {
    const situation = { "espaces . anciens sites de production": "2500 m2" };
    engine.setSituation(situation);
    expect(engine.evaluate("surface friche").nodeValue).toEqual(2500);
  });

  test("doit renvoyer une surface de friche égale à la somme des superficies des espaces", () => {
    const situation = {
      "espaces . anciens sites de production": "2500 m2",
      "espaces . anciens espaces de stockage": "200 m2",
      "espaces . ancienne carrière": "400 m2",
    };
    engine.setSituation(situation);
    expect(engine.evaluate("surface friche").nodeValue).toEqual(3100);
  });
});

describe("Publicode algorithm: calcul du coût annuel de la friche", () => {
  const situation = {
    "espaces . anciens sites de production": "2500 m2",
    "espaces . anciens espaces de stockage": "200 m2",
    "espaces . ancienne carrière": "400 m2",
  };

  beforeAll(() => {
    engine.setSituation(situation);
  });

  test("ne doit pas calculer le coût annuel du site s’il n’est pas une friche", () => {
    expect(engine.evaluate("coût annuel friche").nodeValue).toEqual(null);
    engine.setSituation({ ...situation, "type . prairie": "oui" });
    expect(engine.evaluate("coût annuel friche").nodeValue).toEqual(null);
  });

  test("doit calculer le coût annuel de la friche à partir de la surface et des coûts par défaut", () => {
    engine.setSituation({ ...situation, "type . friche": "oui" });
    expect(engine.evaluate("coût annuel friche").nodeValue).toEqual(455700);
  });

  test("doit calculer le coût annuel de la friche à partir de la surface et des coûts spécifiques", () => {
    engine.setSituation({
      ...situation,
      "type . friche": "oui",
      "coût annuel friche . par m2 . gardiennage": "25€/m2",
      "coût annuel friche . par m2 . inondations": "30€/m2",
    });
    expect(engine.evaluate("coût annuel friche").nodeValue).toEqual(517700);
  });
});
