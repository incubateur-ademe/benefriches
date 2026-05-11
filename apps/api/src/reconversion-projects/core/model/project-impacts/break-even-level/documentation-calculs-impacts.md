# Documentation des calculs d'impacts économiques

> **Contexte** : Ce module calcule les impacts économiques d'un projet de reconversion de site (friche industrielle, terrain agricole, etc.) selon trois grandes dimensions : le bilan de développement, le bilan d'exploitation et les impacts indirects.

---

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Bilan économique de développement](#1-bilan-économique-de-développement)
3. [Bilan économique d'exploitation](#2-bilan-économique-dexploitation)
4. [Impacts économiques indirects](#3-impacts-économiques-indirects)
   - [Impacts liés à la nature du site existant](#31-impacts-liés-à-la-nature-du-site-existant)
   - [Droits de mutation](#32-droits-de-mutation)
   - [Conservation des sols et nature](#33-conservation-des-sols-et-nature)
   - [Revenus locatifs](#34-revenus-locatifs)
   - [Impacts spécifiques aux projets photovoltaïques](#35-impacts-spécifiques-aux-projets-photovoltaïques)
   - [Impacts spécifiques aux projets urbains](#36-impacts-spécifiques-aux-projets-urbains)
5. [Actualisation et pondération temporelle des calculs](#actualisation-et-pondération-temporelle-des-calculs)
6. [Conventions de signe et nomenclature](#conventions-de-signe-et-nomenclature)

---

## Vue d'ensemble

L'évaluation économique d'un projet de reconversion repose sur trois niveaux d'analyse complémentaires :

| Module                 | Fichier source                         | Description                                                                              |
| ---------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------- |
| Bilan de développement | `projectDevelopmentEconomicBalance.ts` | Coûts et revenus liés à la phase de création du projet (one-shot)                        |
| Bilan d'exploitation   | `projectOperatingEconomicBalance.ts`   | Charges et produits récurrents actualisés sur la durée du projet                         |
| Impacts indirects      | `projectIndirectEconomicImpacts.ts`    | Externalités économiques pour l'ensemble des acteurs (collectivités, riverains, société) |

Tous les montants pluriannuels sont calculés via le service `SumOnEvolutionPeriodService`, qui applique des pondérations (actualisation, évolution du PIB, valeur du CO₂, etc.) année par année.

Dans le usecase `computeBreakEvenLevel`, le Bilan d'exploitation `projectOperatingEconomicBalance.ts` sera assigné :

- soit à la balance économique `economicBalance` (si l'exploitant et l'aménageur sont la même entité et pas une collectivité)
- soit aux impacts socio-économiques (si l'exploitation est une collectivité)
- nul part si l'exploitant n'est pas l'aménageur ni une collectivité

---

## 1. Bilan économique de développement

**Fichier** : `projectDevelopmentEconomicBalance.ts`

Ce bilan représente l'impact financier **non récurrent** du projet, du point de vue du porteur de projet (développeur).

### Postes de dépenses

#### Coûts d'installation (`projectInstallation`)

Tous les coûts d'installation du plan de développement (études, travaux, équipements) sont inclus en **négatif**.

```
pour chaque coût d'installation :
  total = -montant
```

#### Coûts de réhabilitation (`siteReinstatement`)

Inclus **uniquement** si le développeur est aussi le maître d'ouvrage de la réhabilitation :

```
si developmentPlanDeveloperName === reinstatementContractOwnerName :
  pour chaque coût de réhabilitation :
    total = -montant
```

#### Achat du site (`sitePurchase`)

La règle d'inclusion dépend du type de projet :

```
si type === "URBAN_PROJECT" :
  inclus si sitePurchaseTotalAmount est défini
sinon :
  inclus si sitePurchaseTotalAmount est défini ET développeur === futur propriétaire

  total = -sitePurchaseTotalAmount
```

> **Postulat** : dans un projet urbain, l'aménageur achète le foncier pour le rétrocéder (ex. à une collectivité), donc l'achat est toujours à sa charge, même s'il ne sera pas le propriétaire final.

### Postes de revenus

#### Revente du site (`siteResaleRevenue`)

```
si siteResaleSellingPrice > 0 :
  total = +siteResaleSellingPrice
```

#### Revente des bâtiments (`buildingsResaleRevenue`)

```
si buildingsResaleSellingPrice > 0 :
  total = +buildingsResaleSellingPrice
```

#### Aides financières (`financialAssistanceRevenues`)

Subventions liées aux travaux de réhabilitation. Incluses **uniquement** si le développeur est maître d'ouvrage de la réhabilitation (même condition que pour les coûts de réhabilitation) :

```
si developmentPlanDeveloperName === reinstatementContractOwnerName :
  pour chaque aide :
    total = +montant
```

### Total du bilan de développement

```
total = Σ(tous les postes)
```

---

## 2. Bilan économique d'exploitation

**Fichier** : `projectOperatingEconomicBalance.ts`

Ce bilan représente les flux financiers **récurrents** du projet, actualisés sur toute la durée d'exploitation.

### Charges d'exploitation

```
pour chaque charge annuelle projetée :
  detailsByYear = getWeightedYearlyValues(-montant, ["discount"])
  total         = Σ(detailsByYear)
```

Les charges sont pondérées **uniquement par le taux d'actualisation** (pas d'évolution du PIB, car il s'agit de coûts contractuels fixes).

### Produits d'exploitation

```
pour chaque revenu annuel projeté :
  detailsByYear = getWeightedYearlyValues(+montant, ["discount"])
  total         = Σ(detailsByYear)
```

### Structure de l'output

Chaque item retourné contient :

- `name` : `"projectOperatingEconomicBalance"`
- `details` : libellé du poste (purpose ou source)
- `total` : valeur actualisée sur la durée du projet
- `detailsByYear` : tableau des valeurs annuelles pondérées
- `cumulativeByYear` : tableau des valeurs cumulées année par année

---

## 3. Impacts économiques indirects

**Fichier** : `projectIndirectEconomicImpacts.ts` (orchestrateur) et sous-modules dans `indirect-economic-impacts/`

Les impacts indirects mesurent les **externalités** du projet sur des acteurs tiers : collectivités, riverains, société civile. Ils sont structurés en six grandes catégories.

---

### 3.1 Impacts liés à la nature du site existant

**Fichier** : `siteReconversionRelatedEconomicImpacts.ts`

#### A. Site de type FRICHE

##### Coûts évités de maintenance et sécurisation

La reconversion élimine les coûts annuels liés à l'état d'abandon du site :

| Purpose admis        | Description                  |
| -------------------- | ---------------------------- |
| `security`           | Gardiennage, clôtures        |
| `illegalDumpingCost` | Dépôts sauvages              |
| `accidentsCost`      | Accidents sur le site        |
| `otherSecuringCosts` | Autres coûts de sécurisation |
| `maintenance`        | Entretien général            |

L'impact est nommé selon le porteur de la dépense :

- `avoidedFricheMaintenanceAndSecuringCostsForOwner` si `bearer === "owner"`
- `avoidedFricheMaintenanceAndSecuringCostsForTenant` si `bearer === "tenant"`

```
pour chaque dépense friche retenue :
  detailsByYear = getWeightedYearlyValues(+montant, ["discount"])
  total         = Σ(detailsByYear)   [positif = bénéfice]
```

##### Routes et réseaux liés à la friche (`fricheRoadsAndUtilitiesExpenses`)

_(Uniquement pour les projets urbains)_

La reconversion génère des coûts de voirie et réseaux à partir de l'année 1 :

```
maintenanceAnnuelle = computeYearlyRoadsAndUtilitiesMaintenanceExpenses(surfaceArea)
detailsByYear       = getWeightedYearlyValues(-maintenanceAnnuelle, ["discount"],
                                               { startYearIndex: 1 })
```

> Ce sont des dépenses nouvelles (contrairement aux coûts "évités" ci-dessus). Ce calcul d'impact est surtout utile dans la comparaison en extension urbaine, pour mettre en évidence des coûts plus importants en cas de consommation de nouveaux espaces.

##### Valorisation immobilière locale (`localPropertyValueIncrease`, `localTransferDutiesIncrease`)

_(Uniquement pour les projets urbains)_

La suppression d'une friche augmente la valeur des biens immobiliers voisins. Deux impacts sont calculés via `computePropertyValueImpact()` :

```
inputs : surfaceArea, citySquareMetersSurfaceArea, cityPopulation, cityPropertyValuePerSquareMeter
outputs :
  - propertyValueIncrease            → impact "localPropertyValueIncrease"
  - propertyTransferDutiesIncrease   → impact "localTransferDutiesIncrease"
```

#### B. Site agricole opéré (`previousSiteOperationBenefitLoss`)

Si le site est une exploitation agricole en activité, la reconversion entraîne une perte du bénéfice agricole :

```
balanceAnnuelle = Σ(revenus annuels) - Σ(dépenses annuelles)
detailsByYear   = getWeightedYearlyValues(balanceAnnuelle, ["discount"])
total           = Σ(detailsByYear)
```

Le total peut être **positif** (l'exploitation était déficitaire → la perte est un bénéfice net) ou **négatif** (l'exploitation était rentable → la reconversion entraîne une perte réelle).

---

### 3.2 Droits de mutation

**Impact** : `propertyTransferDutiesIncome`

Les transactions foncières (achat du site, revente du site, revente des bâtiments) génèrent des droits de mutation au profit des collectivités. Cet impact est comptabilisé **uniquement en année 0** :

```
total = sitePurchasePropertyTransferDutiesAmount
      + siteResaleExpectedPropertyTransferDutiesAmount
      + buildingsResaleExpectedPropertyTransferDutiesAmount

si total > 0 :
  detailsByYear = getWeightedYearlyValues(total, [], { endYearIndex: 1 })
```

---

### 3.3 Conservation des sols et nature

**Fichier** : `natureConservationRelatedImpacts.ts`

Ce module évalue les impacts liés aux modifications de la qualité des sols. Le service `NatureConservationImpactsService` calcule la différence entre la situation de référence (site actuel) et la situation projetée (après reconversion) pour chaque indicateur de nature.

Seuls les impacts dont la **différence est non nulle** sont retenus.

```
pour chaque indicateur (key) avec différence non nulle :
  endYearIndex = key === "storedCo2Eq" ? 1 : undefined  // le stockage CO₂ est un one-shot
  detailsByYear = getWeightedYearlyValues(différence, ["discount", "gdp_evolution"], { endYearIndex })
  total         = Σ(detailsByYear)
```

---

### 3.4 Revenus locatifs

**Fichier** : `rentalIncomeImpacts.ts`

Ce module évalue l'évolution des revenus de loyer entre la situation actuelle et la situation projetée.

#### Loyer projeté sans loyer actuel

| Condition                                           | Impact généré                                                   |
| --------------------------------------------------- | --------------------------------------------------------------- |
| loyer projeté existe ET `hasSiteOwnerChange = true` | `projectedRentalIncome` (positif)                               |
| loyer projeté existe ET loyer actuel existe         | `projectedRentalIncomeIncrease` (différence, peut être négatif) |

```
projectedRentalIncome :
  detailsByYear = getWeightedYearlyValues(loyerProjeté, ["discount"])

projectedRentalIncomeIncrease :
  detailsByYear = getWeightedYearlyValues(loyerProjeté - loyerActuel, ["discount"])
```

#### Loyer actuel sans loyer projeté

```
oldRentalIncomeLoss :
  detailsByYear = getWeightedYearlyValues(-loyerActuel, ["discount"])
  // Signe négatif : la collectivité perd un revenu locatif existant
```

---

### 3.5 Impacts spécifiques aux projets photovoltaïques

**Fichier** : `photovoltaicRelatedImpacts.ts`

Ces impacts s'activent uniquement pour `developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"`.

#### CO₂ évité grâce à la production d'énergie (`avoidedCo2eqWithEnergyProduction`)

```
co2évité = computeAvoidedCO2TonsWithEnergyProductionImpact(expectedAnnualProduction)
detailsByYear = getWeightedYearlyValues(co2évité, ["co2_value", "discount"])
```

La production annuelle attendue (MWh) est convertie en tonnes de CO₂ évitées selon un facteur d'émission du réseau électrique français. Ces tonnes sont ensuite monétisées via la **valeur tutélaire du carbone**.

#### Taxes photovoltaïques (`projectPhotovoltaicTaxesIncome`)

```
si une dépense projetée a le purpose "taxes" :
  detailsByYear = getWeightedYearlyValues(montant, ["discount", "gdp_evolution"])
```

Il s'agit des taxes locales (IFER, CFE, etc.) payées par l'exploitant et perçues par les collectivités.

---

### 3.6 Impacts spécifiques aux projets urbains

**Fichier** : `urbanProjectImpacts.ts`

#### Fraîcheur urbaine

Le service `YearlyUrbanFreshnessRelatedImpacts` évalue les bénéfices des espaces verts et de la végétalisation sur le confort thermique urbain :

| Impact                                 | Pondérations            | Description                                               |
| -------------------------------------- | ----------------------- | --------------------------------------------------------- |
| `avoidedAirConditioningCo2eqEmissions` | `discount`, `co2_value` | CO₂ évité grâce à la réduction de la climatisation        |
| `avoidedAirConditioningExpenses`       | `discount`              | Économies sur les factures de climatisation des résidents |

```
inputs : buildingsFloorAreaDistribution, projectPublicGreenSpaceSurface,
         siteSquareMetersSurfaceArea, citySquareMetersSurfaceArea, cityPopulation
```

La surface des espaces verts publics est calculée comme la somme des surfaces de sol avec `spaceCategory === "PUBLIC_GREEN_SPACE"`.

#### Impacts liés aux déplacements

Le service `YearlyTravelRelatedImpacts` évalue les bénéfices liés à la réduction des déplacements motorisés (densification urbaine) :

| Impact                                   | Pondérations                                        | Description                                 |
| ---------------------------------------- | --------------------------------------------------- | ------------------------------------------- |
| `avoidedPropertyDamageExpenses`          | `discount`, `gdp_evolution`                         | Dommages matériels évités                   |
| `avoidedCarRelatedExpenses`              | `discount`, `gdp_evolution`                         | Frais automobiles évités                    |
| `travelTimeSavedPerTravelerExpenses`     | `discount`, `gdp_evolution`                         | Valeur du temps de trajet économisé         |
| `avoidedTrafficCo2EqEmissions`           | `co2_emitted_per_vehicule`, `co2_value`, `discount` | CO₂ du trafic évité                         |
| `avoidedAirPollutionHealthExpenses`      | `discount`, `gdp_evolution`                         | Coûts de santé liés à la pollution          |
| `avoidedAccidentsMinorInjuriesExpenses`  | `discount`, `gdp_evolution`                         | Blessures légères évitées                   |
| `avoidedAccidentsSevereInjuriesExpenses` | `discount`, `gdp_evolution`                         | Blessures graves évitées                    |
| `avoidedAccidentsDeathsExpenses`         | `discount`, `gdp_evolution`                         | Décès évités (valeur statistique de la vie) |

#### Taxes liées aux nouveaux usages

##### Taxe foncière résidentielle (`projectNewHousesTaxesIncome`)

```
si surface RESIDENTIAL > 0 :
  taxeAnnuelle  = computeEstimatedPropertyTaxesAmount(surface RESIDENTIAL)
  detailsByYear = getWeightedYearlyValues(taxeAnnuelle, ["gdp_evolution", "discount"])
```

##### Taxe entreprises / bureaux (`projectNewCompanyTaxationIncome`)

```
si surface OFFICES > 0 :
  taxeAnnuelle  = (2018 × surface OFFICES) / 15
  detailsByYear = getWeightedYearlyValues(taxeAnnuelle, ["gdp_evolution", "discount"])
```

> Le coefficient `2018 / 15` est un forfait basé sur la cotisation foncière des entreprises (CFE) pour les locaux de bureau.

---

## Actualisation et pondération temporelle des calculs

Le service `SumOnEvolutionPeriodService.getWeightedYearlyValues(valeurAnnuelle, pondérations, options?)` retourne un tableau de valeurs annuelles pondérées sur la durée du projet.

### Pondérations disponibles

| Clé                        | Description                                                  | Usage typique             |
| -------------------------- | ------------------------------------------------------------ | ------------------------- |
| `discount`                 | Actualisation financière                                     | Quasi-systématique        |
| `gdp_evolution`            | Évolution du PIB (proxy de l'évolution des coûts et valeurs) | Impacts socio-économiques |
| `co2_value`                | Valeur tutélaire du CO₂ (croissante dans le temps)           | Monétisation du carbone   |
| `co2_emitted_per_vehicule` | Facteur d'émission CO₂ par véhicule                          | Impacts trafic routier    |

### Options

| Option              | Description                                                                          |
| ------------------- | ------------------------------------------------------------------------------------ |
| `endYearIndex: 1`   | Impact comptabilisé uniquement en année 0 (ex. droits de mutation, stockage carbone) |
| `startYearIndex: 1` | Impact démarrant à l'année 1 (ex. charges de voirie)                                 |

### Calcul du cumulatif annuel

La fonction `computeCumulativeByYear(impacts: number[])` calcule la somme cumulée année par année :

```typescript
[10, 20, 30] → [10, 30, 60]
[-100, -100] → [-100, -200]
```

---

## Conventions de signe et nomenclature

### Signes

| Signe         | Signification                  |
| ------------- | ------------------------------ |
| `+` (positif) | Bénéfice / revenu / coût évité |
| `-` (négatif) | Coût / dépense / perte         |

### Noms des impacts (`IndirectEconomicImpact["name"]`)

| Nom                                                 | Catégorie          | Signe attendu |
| --------------------------------------------------- | ------------------ | ------------- |
| `avoidedFricheMaintenanceAndSecuringCostsForOwner`  | Friche             | +             |
| `avoidedFricheMaintenanceAndSecuringCostsForTenant` | Friche             | +             |
| `fricheRoadsAndUtilitiesExpenses`                   | Friche / Urbain    | −             |
| `localPropertyValueIncrease`                        | Friche / Urbain    | +             |
| `localTransferDutiesIncrease`                       | Friche / Urbain    | +             |
| `previousSiteOperationBenefitLoss`                  | Agricole           | ±             |
| `propertyTransferDutiesIncome`                      | Foncier            | +             |
| `projectedRentalIncome`                             | Loyer              | +             |
| `projectedRentalIncomeIncrease`                     | Loyer              | ±             |
| `oldRentalIncomeLoss`                               | Loyer              | −             |
| `avoidedCo2eqWithEnergyProduction`                  | PV                 | +             |
| `projectPhotovoltaicTaxesIncome`                    | PV                 | +             |
| `avoidedAirConditioningCo2eqEmissions`              | Urbain / Fraîcheur | +             |
| `avoidedAirConditioningExpenses`                    | Urbain / Fraîcheur | +             |
| `avoidedPropertyDamageExpenses`                     | Urbain / Mobilité  | +             |
| `avoidedCarRelatedExpenses`                         | Urbain / Mobilité  | +             |
| `travelTimeSavedPerTravelerExpenses`                | Urbain / Mobilité  | +             |
| `avoidedTrafficCo2EqEmissions`                      | Urbain / Mobilité  | +             |
| `avoidedAirPollutionHealthExpenses`                 | Urbain / Mobilité  | +             |
| `avoidedAccidentsMinorInjuriesExpenses`             | Urbain / Mobilité  | +             |
| `avoidedAccidentsSevereInjuriesExpenses`            | Urbain / Mobilité  | +             |
| `avoidedAccidentsDeathsExpenses`                    | Urbain / Mobilité  | +             |
| `projectNewHousesTaxesIncome`                       | Urbain / Fiscal    | +             |
| `projectNewCompanyTaxationIncome`                   | Urbain / Fiscal    | +             |
