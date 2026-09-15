# Reference Data

Static datasets used to seed the database. Each subdirectory contains a `README.md` documenting the data source, file format, and how the data is used.

| Dataset                                           | Description                                                                              |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [aldo/](./aldo/README.md)                         | Carbon storage calculations (ALDO methodology)                                           |
| [dvf/](./dvf/README.md)                           | French commune statistics built from DVF (Demandes de Valeurs Foncières)                 |
| [france-ruralites/](./france-ruralites/README.md) | France Ruralités Revitalisation (FRR) zoning — classifies communes as rural or non-rural |

# build-cities-csv.ts

Script de fusion de plusieurs sources de données géographiques françaises en un seul fichier CSV, prêt à être importé dans une table `cities`.

## Description

Le script combine trois sources :

1. **Référentiel Aldo** (`./aldo/cities.csv`, fichier local) : données forestières par commune : `zpc`, `code_greco`, `code_groupeser`, `code_ser`, `code_bassin_populicole`.
2. **Référentiel des communes de France** (API ADEME, `GEO06_COMMUNES.csv`) : nom, département, région et EPCI de chaque commune, ainsi que les rattachements des communes déléguées/périmées vers leur commune actuelle.
3. **Zonage ABC** (API tabulaire data.gouv.fr) : zonage locatif (`zonage_abc`) par commune.

Le résultat est `./sql-cities.csv`.

## Prérequis

- Node.js avec support TypeScript (`tsx`, `ts-node`, ou équivalent)
- Accès réseau sortant vers :
  - `data-interne.ademe.fr`
  - `tabular-api.data.gouv.fr`
- Le fichier `./aldo/cities.csv` doit être présent à côté du script (format `;`, en-tête `ALDO_HEADER`).

## Exécution

```bash
npx ts-node build-cities-csv.ts
```

## Règles de fusion

- **Communes actives vs déléguées/périmées** : le référentiel ADEME est parcouru pour séparer les communes actives (`dcoe_c_actual` ≠ `3`/`6`) des communes déléguées ou périmées, ces dernières étant rattachées à leur commune de référence via `dceo_c_code_pole`.
- **Arrondissements municipaux** (Paris/Lyon/Marseille) : absents du zonage ABC, ils héritent de la valeur `zonage_abc` de leur ville principale (`PARIS_LYON_MARSEILLE_ARRONDISSEMENTS`).
- **Correspondance avec Aldo** : chaque commune active est mise en correspondance avec une ligne Aldo par code INSEE. Si aucune correspondance directe n'existe :
  - une table d'exceptions manuelles (`ALDO_EXCEPTIONS`) fournit un code de repli pour les communes nouvelles annulées depuis 2018 ;
  - à défaut, les données des communes déléguées/périmées rattachées sont fusionnées (`mergeAldoRecords`), à condition qu'elles soient cohérentes entre elles (même `zpc` et `code_bassin_populicole`).
- **Champs multivalués** (`code_greco`, `code_groupeser`, `code_ser`) : dédupliqués et nettoyés (valeur `"null"` filtrée) lors des fusions.
- **Détection du délimiteur** : les CSV distants (ADEME, zonage ABC) sont parsés avec un délimiteur détecté automatiquement (`,` ou `;`) et des index de colonnes de repli si les en-têtes changent.

## Format de sortie

| Colonne                       | Description                                                       |
| ----------------------------- | ----------------------------------------------------------------- |
| `city_code`                   | Code INSEE de la commune                                          |
| `name`                        | Nom de la commune                                                 |
| `department`                  | Code département                                                  |
| `region`                      | Code région                                                       |
| `epci`                        | Code EPCI (SIREN)                                                 |
| `aldo_zpc`                    | ZPC (référentiel Aldo)                                            |
| `aldo_code_greco`             | Codes GRECO (liste séparée par `,`)                               |
| `aldo_code_groupeser`         | Codes groupe SER (liste séparée par `,`)                          |
| `aldo_code_ser`               | Codes SER (liste séparée par `,`)                                 |
| `aldo_code_bassin_populicole` | Code bassin populicole                                            |
| `mte_zonage_abc`              | Zonage ABC (Ministère de la Transition Écologique / data.gouv.fr) |

Les lignes sont triées par `city_code`.

## LOGS

Le script affiche en console :

- le nombre de communes lues dans chaque source;
- le nombre de propagations de zonage vers les arrondissements ;
- un récapitulatif final : nombre de communes actives, lignes sans correspondance Aldo (`aldo_zpc` vide), lignes sans zonage ABC (`mte_zonage_abc` vide), nombre de fusions effectuées.
- La variable `formerRecords` ou `aldoDeletion` peut servir à vérifier manuellement si des codes insee supprimés dans la mise à jour était utilisés dans les sites de la base de données de production

## Limites connues

- La table `ALDO_EXCEPTIONS` est une liste maintenue manuellement ; toute nouvelle commune fusionnée/annulée non listée n'aura pas de correspondance Aldo.
