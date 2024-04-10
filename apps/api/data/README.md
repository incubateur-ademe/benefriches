# Calcul des stocks de carbone

Le calcul des stocks de carbone de Bénéfriches se base sur la méthode utilisé par [l'outil ALDO](https://docs.datagir.ademe.fr/documentation-aldo/stocks/methode-generale).

Les quatre réservoirs de carbone sont pris en considération : Sol, Litière, Biomasse vivante (aérienne et racinaire) et Biomasse morte.
Pour chacun d'entre eux, des stocks de carbone de référence par occupation de sol ont été attribués.

Ces stocks de référence se traduisent par la quantité de carbone stockée en tonnes de carbone (tC) dans un hectare d'une occupation de sol donnée selon la localisation géographique du territoire.

**Les sols**

Les stocks de référence à l'hectare sont calculés par occupation du sol (typologie d'occupation du sol de niveau 1) et par grande région pédoclimatique : [Stocks de carbone de référence (tC/ha)
](https://docs.datagir.ademe.fr/documentation-aldo/introduction/sources#stocks-de-carbone-des-sols).

​**La litière**

Les stocks de référence à l'hectare sont une moyenne en France pour l'occupation du sol forêt : [typologie d'occupation du sol de niveau 1](https://docs.datagir.ademe.fr/documentation-aldo/introduction/definitions#occupation-du-sol-et-changement-doccupation-du-sol).

​**La biomasse**

Pour la biomasse aérienne et racinaire et la biomasse morte en forêt, les stocks de référence à l'hectare sont calculés pour l'occupation du sol forêt par composition ([typologie d'occupation du sol de niveau 2](https://docs.datagir.ademe.fr/documentation-aldo/introduction/definitions#occupation-du-sol-et-changement-doccupation-du-sol)) et par région écologique.

Pour la biomasse aérienne et racinaire hors forêt, à savoir vignes, vergers, prairies arbustives et arborées, et sols artificiels arbustifs et arborées, les stocks de référence à l'hectare sont calculés par occupation du sol ([typologie d'occupation du sol de niveau 2](https://docs.datagir.ademe.fr/documentation-aldo/introduction/definitions#occupation-du-sol-et-changement-doccupation-du-sol)) en valeurs moyennes par régions.

En cumulant les stocks de référence pour les 4 réservoirs, et en fonction de la localisation du territoire (dans une certaine zone pédoclimatique, et une certaine grande région écologique), on obtient alors des stocks de référence à l'hectare qui peuvent être différents pour chaque territoire.

Nous avons construit deux sources de données à partir des données d'Aldo pour nous permettre de calculer les stocks de carbone dont nous avons besoin dans l'outil Bénéfriches : les données communales ([cities.csv](cities.csv)) et les données carbone ([carbonStorage.csv](carbonStorage.csv)).

## Données communales

Les données du fichier [`cities.csv`](cities.csv) sont issues des fichiers ALDO :

### Maillage administratif - millésime communal de 2018 fourni par l'IGN

- [Source Aldo](https://docs.datagir.ademe.fr/documentation-aldo/introduction/sources#maillage-administratif)

On y récupère les données :

- nom: nom de la commune
- insee: code INSEE de la commune,
- département
- région
- EPCI: établissements publics de coopération intercommunale

(35067 lignes = code INSEE)

### ZPC : Zone pédoclimatiques

Les stocks de référence pour les sols sont issus de données du Réseau de Mesures de la Qualité des Sols (RMQS) du GIS-SOL entre 2001 et 2011 et calculés par occupation du sol et par grande région pédoclimatique.

- [Source Aldo](https://docs.datagir.ademe.fr/documentation-aldo/introduction/sources#stocks-de-carbone-des-sols)
- [Source Fichier CSV](https://github.com/incubateur-ademe/aldo/blob/main/data/dataByCommune/zpc.csv)

Le fichier permet de récupérer les zpc de 35112 code INSEE.

Les 45 lignes supplémentaires par rapport au fichier maillage administratif correspondent aux arrondissements de Marseille, Lyon et Paris.
On assigne donc aux arrondissements les infos (nom, région, département...) de leur ville correspondante.

### Niveaux géographiques

La BD Forêt® de l'IGN (Institut national de l'information géographique et forestière) est un référentiel géographique forestier nomenclature nationale de 32 postes.

ALDO propose les données surfaciques issues de la BD Forêt® V2, 2018.
Les surfaces sont exprimées par composition selon le type de peuplement (feuillus, mixtes, conifères ou peupleraies)

On récupère dans ce fichier plusieurs types de qualification géographique d'une commune (par son code INSEE) :

- code GRECO : Grande Région Ecologique
- code SER : Sylvo Éco Région
- code groupe SER : [Regroupement de SER](https://inventaire-forestier.ign.fr/IMG/pdf/Part1_rapport_ser.pdf)
- code bassin populicole (peupleraie)

Il y a environ 110 codes INSEE présents dans le fichier `cities.csv` qui ne trouve pas de correspondance dans ce fichier BD Forêt® de l'IGN.

[Fichier de référence ALDO](https://github.com/incubateur-ademe/aldo/blob/main/data/dataByCommune/surface-foret.csv)

[Référence doc ALDO](https://docs.datagir.ademe.fr/documentation-aldo/introduction/sources#donnees-surfaciques-pour-loccupation-du-sol-forets)

## Données carbone

Les données du fichier [carbonStorage.csv](carbonStorage.csv) sont issues des fichiers ALDO :

- [stocks-zpc.csv](https://github.com/incubateur-ademe/aldo/blob/main/data/dataByCommune/stocks-zpc.csv)
- [region-to-inter-region.json](https://github.com/incubateur-ademe/aldo/blob/main/data/dataByCommune/region-to-inter-region.json)
- [biomass-hors-forets.csv](https://github.com/incubateur-ademe/aldo/blob/main/data/dataByCommune/biomass-hors-forets.csv)
- [bilan-carbone-foret-par-localisation.csv](https://github.com/incubateur-ademe/aldo/blob/main/data/dataByEpci/bilan-carbone-foret-par-localisation.csv)

On regroupe les données de ces différents fichiers sous la forme d'une table unique contenant les colonnes :

- `reservoir`: Le type de réservoir de carbone

  Valeurs possibles :

  - "soil" (valeurs tirées du fichier [stocks-zpc.csv](https://github.com/incubateur-ademe/aldo/blob/main/data/dataByCommune/stocks-zpc.csv))
  - "non_forest_biomass" (valeurs tirées du fichier [biomass-hors-forets.csv](https://github.com/incubateur-ademe/aldo/blob/main/data/dataByCommune/biomass-hors-forets.csv))
  - "dead_forest_biomass" (valeurs tirées du fichier [bilan-carbone-foret-par-localisation.csv](https://github.com/incubateur-ademe/aldo/blob/main/data/dataByEpci/bilan-carbone-foret-par-localisation.csv))
  - "live_forest_biomass" (valeurs tirées du fichier [bilan-carbone-foret-par-localisation.csv](https://github.com/incubateur-ademe/aldo/blob/main/data/dataByEpci/bilan-carbone-foret-par-localisation.csv))

- `soil_category`: le type de sol concerné

  Valeurs possibles :

  - "buildings"
  - "impermeable_soils"
  - "mineral_soil"
  - "artificial_grass_or_bushes_filled"
  - "artificial_tree_filled"
  - "forest_deciduous"
  - "forest_conifer"
  - "forest_poplar"
  - "forest_mixed"
  - "prairie_grass"
  - "prairie_bushes"
  - "prairie_trees"
  - "orchard" (verger)
  - "cultivation" (culture)
  - "vineyard" (vigne)
  - "wet_land" (zone humide)
  - "water" (plan d'eau)

- `stock_tC_by_ha` : la valeur de stock de carbone correspondante en tonnes de carbone par hectare.
- `localisation_category`: le type de code de localisation.

  Valeurs possibles :

  - "zpc": Zone pédoclimatiques
  - "region": [Code région](https://www.insee.fr/fr/statistiques/fichier/6051727/region_2022.csv)
  - "groupeser"
  - "greco"
  - "bassin_populicole"
  - "pays"

- `localisation_code`: Le code de localisation associé au type de localisation.

  Valeurs possibles pour `localisation_code` =

  - "zpc" : "1_1", "1_2" , "1_3", "2_1", "2_2", "2_3", "3_1", "3_2", "3_3", "4_1", "4_2", "4_3", "5_1", "5_3
  - "region" : 1, 2, 3, 4, 6, 11, 24, 27, 28, 32, 44, 52, 53, 75, 76, 84, 93, 94
  - "groupeser" : A1, AX, B3, B4, B5, B6, B7, B8, B9, BX, C1, C2, C3, C4, C5, D1, E1, E2, F1, F2, F3, F4, F5, G1, G2, G3, G4, G5, G6, G7, G8, G9, H1, H2, H3, H4, I1, I2, JX, K1
  - "greco" : A, B, C, D, E, F, G, H, I, J, K
  - "bassin_populicole" : Nord, Nord-Est, Nord-Ouest, Sud
  - "pays" : "France"

### Détails de construction du fichier [carbonStorage.csv](carbonStorage.csv)

#### Traitement du fichier [stocks ZPC](https://github.com/incubateur-ademe/aldo/blob/main/data/dataByCommune/stocks-zpc.csv)

Pour chaque ligne du fichier, création de 12 entrées `carbon_storage` (une pour chaque type de sol) avec :

- `reservoir` : "soil"
- `localisation_category`: "zpc"
- `localisation_code`: colonne "zpc" du fichier source
- `stock_tC_by_ha`: valeur de l'intersection zpc et type de sol dans le fichier
- `soil_category`: colonne "zpc" du fichier source

Correspondance des clés de colonnes :

- cultures --> `cultivation`
- prairies --> `prairie_grass`, `prairie_trees` et `prairie_bushes` (3 entrées sont créées pour prairie)
- forêts --> `forest_poplar`, `forest_mixed`, `forest_conifer` et `forest_deciduous` (4 entrées sont créées pour les forêts)
- zones humides --> `wet_land`
- vergers --> `orchard`
- vignes --> `vineyard`
- Sols artificialisés --> `artificialised_soils`
- sols artificiels imperméabilisés --> `impermeable_soils`
- sols artificiels enherbés --> `artificial_grass_or_bushes_filled`
- sols artificiels arborés et buissonants --> `artificial_tree_filled`

#### Traitement du fichier [biomass-hors-forets](https://github.com/incubateur-ademe/aldo/blob/main/data/dataByCommune/biomass-hors-forets.csv)

On ne sélectionne que les colonnes de stocks de carbone et on laisse de côté les colonnes de flux (format "x vers x").

Les colonnes prairies `cultures`, `prairies zones herbacées` et `zones humides` ne contiennent aucune données dans ce fichier.

Correspondance des clés de colonnes :

- prairies zones arborées --> `prairie_trees`
- prairies zones arbustives --> `prairie_bushes`
- vergers --> `orchard`
- vignes --> `vineyard`
- sols artificiels arborés et buissonants --> `artificial_grass_or_bushes_filled`
- sols artificiels arbustifs --> `artificial_tree_filled`
- sols artificiels imperméabilisés --> `impermeable_soils`

On récupère la correspondance `INTER_REG` --> `region` grâce au fichier aldo [region-to-inter-region](https://github.com/incubateur-ademe/aldo/blob/main/data/dataByCommune/region-to-inter-region.json).

On crée donc pour chaque région (13 régions) 7 entrées dans le fichier `carbon_storage` au format :

- `reservoir` : "non_forest_biomass"
- `localisation_category`: "region"
- `localisation_code`: intersection `INTER_REG` --> `region`
- `stock_tC_by_ha`: valeur du fichier
- `soil_category`: Cf. correspondance ci dessus

#### Traitement du fichier [bilan-carbone-foret-par-localisation](https://github.com/incubateur-ademe/aldo/blob/main/data/dataByEpci/bilan-carbone-foret-par-localisation.csv)

Pour chaque ligne du fichier, on récupère les colonnes

- `type_localisation`
- `code_localisation`
- `composition`
- `carbone_(tC∙ha-1)`
- `bois_mort_carbone_(tC∙ha-1)`

Si les valeurs de `carbone_(tC∙ha-1)` et `bois_mort_carbone_(tC∙ha-1)`sont "NA", on passe la ligne.

On ne récupère que les lignes dont la colonne `composition` vaut "Peupleraie", "Conifere", "Feuillu" ou "Mixte".

Pour chaque ligne valide, on ajoute deux entrées dans `carbon_storage` au format :

- localisation_category

  - À partir de la colonne `type_localisation`.
  - Les valeurs possibles sont `greco`, `groupeser`, `bassin_populicole`, `France` et `rad13`.
  - On transforme `France` en `pays` et `rad13` en `region`.

- localisation_code

  - À partir de la colonne `code_localisation`.
  - On transforme les valeurs de type `rad13` du format `HDF`, `IDF`... en leur associant le code région correspondant.

- `reservoir`: "dead_forest_biomass",
- `soil_category`:
  - correspondance entre ["Peupleraie", "Conifere", "Feuillu" ou "Mixte"] et ["forest_poplar", "forest_conifer", "forest_deciduous", "forest_mixte"],
- `stock_tC_by_ha`: colonne `bois_mort_carbone_(tC∙ha-1)`

et

- `localisation_category`: idem qu'au dessus
- `localisation_code`: idem qu'au dessus
- `soil_category`: idem qu'au dessus
- `reservoir`: "live_forest_biomass"
- `stock_tC_by_ha`: colonne `carbone_(tC∙ha-1)`

### Calcul du stocks de carbone des sols pour Bénéfriches

À partir d'un code INSEE et d'une liste de type de sols avec leurs surfaces, on récupère dans la base `cities` les informations :

- région
- code GRECO : Grande Région Ecologique
- code groupe SER
- code bassin populicole

On cherche alors dans la base `carbon_storage` toutes les lignes correspondantes à ces localisations, filtrées par `soil_category` grâce à la liste de types de sol fournie.

Pour les lignes relatives à la biomasse forêt ("live_forest_biomass" et "dead_forest_biomass"), on filtre les résultats pour ne garder que les valeurs les plus précises.

L'ordre de priorité est :

- code groupe SER
- code GRECO : Grande Région Ecologique
- région
- code bassin populicole
- Pays (valeur moyenne pour la France)

Les villes de la base `cities` peuvent contenir plusieurs codes "groupe SER" et codes "GRECO" car le code INSEE n'est pas assez précis pour associer une seule sylvo éco région (une ville peut être à cheval sur plusieurs zones).

Le calcul Bénéfriches prend arbitrairement la première valeur de groupe SER ou GRECO rencontrée.  
Cette imprécision pourra être améliorée plus tard.

On ajoute le cas échéant, le stock de carbone contenu dans la litière des forêts, qui correspond à la valeur moyenne française (9 tonnes de carbone par hectare). Valeur relevée dans le code source d'Aldo.

À partir de la liste des types de sols et de leur surfaces, on multiplie chaque surface par le stock de carbone par hectare associé et on additionne chaque résultat pour obtenir le total de carbone stocké sur le site.

#### Exemple :

On a en données d'entrée :

- Code INSEE: "62498"
- Types de sols:
  - `artificial_tree_filled`: 0.5 (en hectares)
  - `impermeable_soils`: 0.5
  - `cultivation`: 1
  - `wet_land`: 0.2
  - `forest_mixed`: 1
  - `forest_poplar`: 2
  - `forest_deciduous`: 3
  - `forest_conifer`: 4

Grâce à la base de données `cities`, on obtient les informations supplémentaires pour le code INSEE "62498" :

- région : 32
- zpc : 2_1
- code groupe ser : B2
- greco : B
- code populicole : Nord

On cherche maintenant les données dans la base de données `carbon_storage`.

1. Pour le carbone dans le sol à partir de la zone pédoclimatique, on récupère les valeurs suivantes :

| reservoir | soil_category          | stock_tC_by_ha | localisation_category | localisation_code |
| --------- | ---------------------- | -------------- | --------------------- | ----------------- |
| soil      | cultivation            | 50             | zpc                   | 2_1               |
| soil      | forest_deciduous       | 60             | zpc                   | 2_1               |
| soil      | forest_conifer         | 60             | zpc                   | 2_1               |
| soil      | forest_mixed           | 60             | zpc                   | 2_1               |
| soil      | forest_poplar          | 60             | zpc                   | 2_1               |
| soil      | wet_land               | 125            | zpc                   | 2_1               |
| soil      | impermeable_soils      | 30             | zpc                   | 2_1               |
| soil      | artificial_tree_filled | 60             | zpc                   | 2_1               |

**Calcul intermédiaire :**

(50 x 1) + (60 x 1) + (60 x 2) + (60 x 3) + (60 x 4) + (125 x 0.2) + (30 x 0.5) + (60 x 0.5) = 720

2. Pour le carbone dans la biomasse hors forêt, on récupère les valeurs suivantes pour la région Hauts-de-France :

| reservoir          | soil_category          | stock_tC_by_ha | localisation_category | localisation_code |
| ------------------ | ---------------------- | -------------- | --------------------- | ----------------- |
| non_forest_biomass | artificial_tree_filled | 48             | region                | 32                |

**Calcul intermédiaire :**

(48 x 0.5) = 24

3. Pour le carbone dans la biomasse forêt:

- on ne trouve aucune valeur pour le groupe SER B2.
- on récupère les valeurs suivantes pour le GRECO B :

| reservoir           | soil_category    | stock_tC_by_ha | localisation_category | localisation_code |
| ------------------- | ---------------- | -------------- | --------------------- | ----------------- |
| dead_forest_biomass | forest_conifer   | 4.24           | greco                 | B                 |
| live_forest_biomass | forest_conifer   | 79.19          | greco                 | B                 |
| dead_forest_biomass | forest_deciduous | 6.83           | greco                 | B                 |
| live_forest_biomass | forest_deciduous | 99.57          | greco                 | B                 |
| dead_forest_biomass | forest_mixed     | 7.18           | greco                 | B                 |
| live_forest_biomass | forest_mixed     | 82.17          | greco                 | B                 |

**Calcul intermédiaire :**

(4.24 x 4) + (79.19 x 4) + (6.16 x 3) + (99.57 x 3) + (7.18 x 1) + (82.17 x 1) = 740.26

- on récupère les valeurs suivantes pour la région Hauts-de-France :

| reservoir           | soil_category    | stock_tC_by_ha | localisation_category | localisation_code |
| ------------------- | ---------------- | -------------- | --------------------- | ----------------- |
| dead_forest_biomass | forest_deciduous | 6.16           | region                | 32                |
| live_forest_biomass | forest_deciduous | 97.25          | region                | 32                |

Comme on a récupéré des valeurs plus précise pour `forest_deciduous` grâce au GRECO, on n'utilise pas ces 2 valeurs.

- on récupère les valeurs suivantes pour le bassin populicole Nord :

| reservoir           | soil_category | stock_tC_by_ha | localisation_category | localisation_code |
| ------------------- | ------------- | -------------- | --------------------- | ----------------- |
| dead_forest_biomass | forest_poplar | 1.9            | bassin_populicole     | Nord              |
| live_forest_biomass | forest_poplar | 53.98          | bassin_populicole     | Nord              |

**Calcul intermédiaire :**

(1.9 x 2) + (53.98 x 2) = 111.76

- on récupère les valeurs suivantes pour la France :

| reservoir           | soil_category    | stock_tC_by_ha | localisation_category | localisation_code |
| ------------------- | ---------------- | -------------- | --------------------- | ----------------- |
| dead_forest_biomass | forest_conifer   | 6.02           | pays                  | France            |
| live_forest_biomass | forest_conifer   | 77.06          | pays                  | France            |
| dead_forest_biomass | forest_deciduous | 8.33           | pays                  | France            |
| live_forest_biomass | forest_deciduous | 90.35          | pays                  | France            |
| dead_forest_biomass | forest_mixed     | 8.56           | pays                  | France            |
| live_forest_biomass | forest_mixed     | 85.46          | pays                  | France            |
| dead_forest_biomass | forest_poplar    | 3.48           | pays                  | France            |
| live_forest_biomass | forest_poplar    | 60.95          | pays                  | France            |

Aucune ne nous est utile car on a déjà récupéré des valeurs plus précises pour ces 4 types de sols précédemment.

Pour la litière, on aura :

| reservoir | soil_category    | stock_tC_by_ha | localisation_category | localisation_code |
| --------- | ---------------- | -------------- | --------------------- | ----------------- |
| litter    | forest_conifer   | 9              | pays                  | France            |
| litter    | forest_deciduous | 9              | pays                  | France            |
| litter    | forest_mixed     | 9              | pays                  | France            |
| litter    | forest_poplar    | 9              | pays                  | France            |

**Calcul intermédiaire :**

(1 x 9) + (2 x 9) + (3 x 9) + (4 x 9) = 90

---

**Total = 720 + 24 + 740.26 + 111.76 + 90 = 1686.02 tonnes de Carbone pour le site**
