# Actualisation des calculs d'impact

Pour chaque calcul d'impact, on calcule d'abord la valeur de l'impact rapporté à une année (l'année de mise en service) puis on multiplie cette valeur par le nombre d'année de la période d'évaluation et une ou plusieurs valeurs d'actualisation.

## Facteur d'actualisation (discount factor)

En finance, le facteur d'actualisation (en anglais : discount factor) associé à une date future est le prix qu'il faudrait payer aujourd'hui pour acheter un euro perçu à cette date future.

- $a$ = Année évaluée
- $m$ = Année de mise en service
- $k$ = Nombre d'année écoulées depuis la mise en service

$$
\frac{1}{{(1+0.045)}^{{a} - {m}}} = \frac{1}{{(1.045)}^{k}}
$$

### Somme actualisée

- $k$ = Nombre d'année écoulées depuis la mise en service
- $n$ = Période d'évalution en années
- $Valeur$ = Valeur initiale de l'impact pour une année (mise en service)

$$
\displaystyle\sum_{k=1}^{n} {\frac{1}{{1.045}^{k}}} \times {Valeur} = \displaystyle\sum_{k=1}^{n} {\frac{Valeur}{{1.045}^{k}}}
$$

#### Exemple

##### Dépenses de climatisation évitées :

- $Valeur = 93$ €
- Période d'évaluation = 10 ans

$$
\displaystyle\sum_{k=1}^{10} {\frac{93}{{(1.045)}^{k}}} = {\frac{93}{{(1.045)}^{1}}} + {\frac{93}{{(1.045)}^{2}}} + ... +{\frac{93}{{(1.045)}^{10}}} =  769 €
$$

#### Impacts concernés

- Effet de la création d’un îlot de fraîcheur sur les factures énergétiques
- Effet sur les coûts de construction
- Effets sur les coûts d'entretien/maintenance des VRD
  - **seulement 1 an après la mise en service**
    $$
      \displaystyle\sum_{k=2}^{n} {\frac{Valeur}{{1.045}^{k}}}
    $$
- Effet lié à l'amélioration du cadre de vie sur les prix immobiliers
  - **seulement 1 an après la mise en service et pendant 5 ans maximum**
- Effet lié à l'amélioration du cadre de vie sur droits de mutation
  - **seulement 1 an après la mise en service et pendant 33 ans maximum**
- Effet sur les déménagements évités des entreprises
  - **seulement pendant la durée des travaux**
- Dépenses d'entretien de la friche évités
- Revenu locatif
- Dépenses et recettes annuelles d'exploitation (dans le bilan de l'opération)

## Evolution PIB/tête par rapport à l'année d'expression des valeurs monétaires

- $a$ = Année évaluée
- $k$ = Nombre d'année écoulées depuis **2022**

$$
\frac{1+0.012}{{a} - {2022}} = \frac{1.012}{k}
$$

### Somme actualisée

- $k$ = Nombre d'année écoulées depuis la mise en service
- $n$ = Période d'évalution en années
- $Valeur$ = Valeur initiale de l'impact pour une année (mise en service)

$$
\displaystyle\sum_{k=1}^{n} {\frac{1.012}{k}} \times {Valeur} \times CoefficientActualisation
$$

#### Exemple

##### Effet pollinisation lié à la présence de nature :

- $Valeur = -14$ €
- Période d'évaluation = 10 ans

$$
 \displaystyle\sum_{k=1}^{10} {\frac{1.012}{k}}
 \times {\frac{−14}{{(1.045)}^{k}}} = {\frac{-14}{{1.045}^{1}}}
\times 1.012 + {\frac{-14}{{1.045}^{2}}} \times \frac{1.012}{2} + ... +
{\frac{-14}{{1.045}^{10}}} \times \frac{1.012}{10} = -126 €
$$

#### Impacts concernés

- Services écosystémiques rendus par les zones humides
- Effet en termes de régulation du risque inondation (cycle de l'eau)
- Effet sur le coût de traitement des eaux (du fait de la remédiation et amélioration de la qualité de l’eau) / Régulation de la qualité de l'eau
- Effet pollinisation lié à la présence de nature
- Services d'approvisionnement par les forêts
- Cycle de l'azote
- Régulation de l'érosion
- Régulation des espèces invasives
- Aménités environnementales
- Maintien de la biodiversité (non-usage)
- Effet des espaces de nature et espaces verts urbains en termes de bénéfices «santé»
- Effet en termes de valeurs récréatives et culturelles liées aux nouveaux équipements et aménités proposés par le projet
- Effet éducatif lié à la création des espaces de nature
- Effet carbone de la création d'un ilot de fraicheur
- Effets sur les investissements dans les VRD
- Effet sur le temps de parcours des usagers
- Effet sur les coûts de déplacement des usagers
- Effet sur la pollution locale (si moins de déplacements en voitures particulières…)
- Effet sur la fiscalité

### Cas particulier

- Effets sur les investissements dans les VRD
  - actualisé une année seulement (mise en service) puis pas annualisé

## Évolution valeur CO2

On interpole l'évolution de la valeur CO2 à partir des données suivantes :

| Année | Valeur CO2 | Unité           |
| ----- | ---------- | --------------- |
| 2020  | 90         | valeur2020€2022 |
| 2030  | 250        | valeur2030€2022 |
| 2040  | 500        | valeur2040€2022 |
| 2050  | 775        | valeur2050€2022 |

si année évaluée < 2030

- $x_1 = 2020$
- $x_2 = 2030$
- $y_1 = 90$
- $y_2 = 250$

si année évaluée < 2040

- $x_1 = 2030$
- $x_2 = 2040$
- $y_1 = 250$
- $y_2 = 500$

sinon

- $x_1 = 2040$
- $x_2 = 2050$
- $y_1 = 500$
- $y_2 = 775$

$$CoeffValeurCO_2 = y_1 \times ({\frac{y_2}{y_1}})^{\frac{k - x_1}{x_2-x_1}}$$

### Somme actualisée

- $k$ = Nombre d'année écoulées depuis la mise en service
- $n$ = Période d'évalution en années
- $Valeur$ = Valeur initiale de l'impact pour une année (mise en service) en Tonnes de CO2

$$
\displaystyle\sum_{k=1}^{n} CoeffValeurCO_2 \times CoeffActualisation \times {Valeur}
$$

#### Exemple

##### Effet carbone de la création d'un ilot de fraicheur :

- $Valeur =  217 685 / 1000000$ (tCO2 évités / an)
- Période d'évaluation = 50 ans
- Année de mise en service = 2025

$$
\displaystyle\sum_{k=1}^{10} y_1 \times ({\frac{y_2}{y_1}})^{\frac{k - x_1}{x_2-x_1}} \times {\frac{Valeur}{{1.045}^{k}}} = ({\frac{250}{90}})^{\frac{1 - 2020}{2030-2020}} \times {\frac{217 685 / 1000000}{{1.045}^{1}}} + ({\frac{250}{90}})^{\frac{2 - 2020}{2030-2020}} \times {\frac{217 685 / 1000000}{{1.045}^{2}}} + ... + ({\frac{500}{250}})^{\frac{32 - 2030}{2040-2030}} \times {\frac{217 685 / 1000000}{{1.045}^{32}}} + ... +({\frac{775}{500}})^{\frac{50 - 2030}{2050-2040}} \times {\frac{217 685 / 1000000}{{1.045}^{50}}}
$$

#### Impacts concernés

- Effet carbone de la création d'un ilot de fraicheur
- Effet carbone du fait de la production d’énergie renouvelable

### Cas particulier

- Effet carbone (fonction de stockage et de séquestration du carbone)
  - pas d'annualisation car on n'a pas intégré la notion de flux dans le calcul de la différence de carbone stocké.
  - On récupère juste la valeur monétaire du CO2 pour l'année de mise en service.

## Évolution émissions véhicules

On interpole l'évolution de la valeur des émissions de véhicules à partir des données suivantes :

| Année | Valeur émissions véhicules | Unité       |
| ----- | -------------------------- | ----------- |
| 2015  | 157.2                      | gCO2/veh.km |
| 2030  | 120.9                      | gCO2/veh.km |
| 2050  | 87.2                       | gCO2/veh.km |

si année évaluée < 2030

- $x_1 = 2015$
- $x_2 = 2030$
- $y_1 = 157.2$
- $y_2 = 120.9$

sinon

- $x_1 = 2030$
- $x_2 = 2050$
- $y_1 = 120.9$
- $y_2 = 87.2$

$$ CoeffCO_2ParKm = p_1 \times ({\frac{p_2}{p_1}})^{\frac{k - x_1}{x_2-x_1}} $$

### Somme actualisée

#### Grammes de CO2eq émis en 1 an avec les kilomètres en voiture

- $k$ = Nombre d'année écoulées depuis la mise en service
- $n$ = Période d'évalution en années
- $Valeur$ = Nombre de vehicules.kilomètres évités pour une année

$$
\displaystyle\sum_{k=1}^{n} {CoeffCO_2ParKm\times {Valeur}}
$$

$$
\displaystyle\sum_{k=1}^{n} {p_1 \times ({\frac{p_2}{p_1}})^{\frac{k - x_1}{x_2-x_1}}\times {Valeur}}
$$

### Somme actualisée monétarisée

#### Valeur monétaire du CO2eq émis en 1 an avec les kilomètres en voiture

- $k$ = Nombre d'année écoulées depuis la mise en service
- $n$ = Période d'évalution en années
- $Valeur$ = Nombre de vehicules.kilomètres évités pour une année

$$
\displaystyle\sum_{k=1}^{n} {CoeffCO_2ParKm\times {Valeur}} \times {\frac{CoeffValeurCO_2}{1000000}} \times CoeffActualisation
$$

$$
\displaystyle\sum_{k=1}^{n} {p_1 \times ({\frac{p_2}{p_1}})^{\frac{k - x_1}{x_2-x_1}}\times {Valeur}} \times y_1 \times ({\frac{y_2}{y_1}})^{\frac{k - x_1}{x_2-x_1}} \times {\frac{1}{1000000}}  \times CoeffActualisation
$$

#### Impact concerné

- Effet sur les émissions de GES (si moins de déplacements en voitures particulières…)
