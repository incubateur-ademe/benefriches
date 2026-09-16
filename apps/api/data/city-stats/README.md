# Génération des statistiques communales françaises

## Utilisation

```sh
npx ts-node build-city-stats.ts
```

## Méthodologie

Le script combine les données de **Demandes de Valeurs Foncières (DVF)** avec les données géographiques des communes françaises pour produire des statistiques de prix au m² par commune.

### Sources de données

1. **[API Géo](https://geo.api.gouv.fr/communes)**
   - Nom des communes
   - Population
   - Surface en hectares

2. **[DVF - data.gouv.fr](https://www.data.gouv.fr/datasets/demandes-de-valeurs-foncieres-geolocalisees/)**
   - Transactions immobilières (ventes uniquement)
   - Types de biens : Maisons (cod111) et Appartements (cod121)
   - Surface et prix de vente
   - Mutations de terrain sans bâti (parcelles, surface_terrain)

3. **[ANCT - Observatoire des territoires](https://www.observatoire-des-territoires.gouv.fr/outils/cartographie-interactive/#view=map76&c=indicator)**
   - DÉMOGRAPHIE > Population et évolutions > Taux d'évolution annuel de la population (%)2016-2022▼
   - MOBILITÉS > Mobilités quotidiennes > Part d'actifs selon le mode de transport principalement utilisé pour aller travailler (%) 2022 > Transport en commun

### Couverture géographique

- **Communes françaises** : 34 879
- **Arrondissements** : 45 (Paris, Marseille, Lyon)
- **Total** : 34 924 entités géographiques

# Génération des statistiques communales françaises

### DVF

#### Période d'analyse

- **Année la plus récente** : 2025
- **Année la plus ancienne** : 2021
- **Années disponibles** : 2025, 2024, 2023, 2022, 2021

#### Méthode de calcul

Pour chaque commune et type de bien :

1. **Priorité aux données récentes** : Les prix médians sont calculés prioritairement sur les 3 années les plus récentes
2. **Seuil de fiabilité** : Si moins de 5 transactions sont trouvées sur 3 ans, l'analyse remonte plus loin dans le temps
3. **Filtrage des données** :
   - Surfaces entre 10 et 500 m²
   - Prix au m² entre 500 et 25 000 €/m²
   - Ventes uniquement (pas de donations, etc.)

#### Méthode de calcul du prix foncier sans bâti (terrain)

Le fichier DVF ne détaille jamais le prix de chaque parcelle d'une mutation :
seule la `valeur_fonciere` totale de la mutation est connue. Il est donc
impossible d'isoler le prix d'un terrain vendu avec une maison. Le prix du
terrain (`dvf_pxm2_median_terrain`) n'est donc calculé **que sur les
mutations ne contenant aucun bâti** (aucune ligne Maison, Appartement,
Dépendance, local commercial...) :

1. Une mutation est écartée dès qu'une de ses lignes porte un `type_local`
2. Pour les mutations restantes, les parcelles distinctes (`id_parcelle`) sont
   dédupliquées (une même parcelle peut apparaître sur plusieurs lignes selon
   sa nature de culture) et leurs surfaces (`surface_terrain`) sont additionnées
3. Le prix au m² est `valeur_fonciere / surface_terrain_totale`
4. **Filtrage des données** :
   - Surface totale entre 10 et 10000 m²
   - Prix au m² entre 1 et 3000 €/m²

Cette méthode **sous-estime le nombre de communes couvertes** : elle exclut
volontairement toute mutation mixte (terrain vendu avec une maison), qui
reste largement majoritaire dans le foncier résidentiel.

#### Statistiques nationales

- **Prix médian national** : 2600 €/m²
  - **Prix médian national (maisons)** : 2170 €/m²
  - **Prix médian national (appartements)** : 3291 €/m²
- **Total transactions analysées** : 2 450 106
  - **Total transactions maisons analysées** : 1 353 757
  - **Total transactions appartements analysées** : 1 111 095
- **Prix médian par tailles de communes** :
  - **Communes de moins de 500 habitants** : 1524 €/m²
  - **Communes de moins de 501 à 1500 habitants** : 1823 €/m²
  - **Communes de moins de 1501 à 3000 habitants** : 2161 €/m²
  - **Communes de moins de 3001 à 10000 habitants** : 2544 €/m²
  - **Communes de moins de 10001 à 50000 habitants** : 3005 €/m²
  - **Communes de moins de 50001 à 100000 habitants** : 3500 €/m²
  - **Communes de moins de plus de 100000 habitants** : 3463 €/m²
- **Communes avec données** : 34 924

#### Limites

- Les données DVF ne couvrent pas toutes les transactions (notamment les ventes de logements sociaux)
- Certaines communes peuvent avoir peu ou pas de transactions selon les années
- Les prix peuvent varier significativement au sein d'une même commune selon les quartiers
- Le prix foncier sans bâti (`dvf_pxm2_median_terrain`) repose uniquement sur les mutations 100% terrain (sans aucune construction) ; c'est une minorité des ventes, donc beaucoup de communes n'auront aucune valeur pour ces colonnes malgré une activité immobilière normale

#### Analyse des données manquantes

- **Total des communes analysées**: 34 924
- **Communes sans données DVF**: 1 803
- **Pourcentage sans données**: 5.2%

#### Départements connus absents des données DVF

- **Département Bas-Rhin (67)**: 514 commune(s)
- **Département Haut-Rhin (68)**: 366 commune(s)
- **Département Moselle (57)**: 725 commune(s)
- **Départements Outre-mer**: 28 commune(s)

#### Communes restantes sans données DVF: 170

- **Communes de moins de 200 habitants**: 164 commune(s)
- **Communes de plus de 200 habitants sans données**: 6 commune(s)

#### Communes de plus de 200 habitants sans données DVF

- **Sannerville** (14666) - 1905 habitants
- **Sainte-Florence** (85212) - 1359 habitants
- **L'Oie** (85165) - 1250 habitants
- **Chalinargues** (15035) - 304 habitants
- **Île-de-Sein** (29083) - 263 habitants
- **Celles** (15031) - 217 habitants

### ANCT: Observatoire des territoires

#### Analyse des données manquantes

-> évolution population manquante pour : 72 communes
-> part actif transport en commun manquante pour : 80 communes

### Structure du fichier sqlCityStats.csv

| Colonne                                      | Description                                                                                |
| -------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `city_code`                                  | Code INSEE de la commune ou arrondissement                                                 |
| `da_name`                                    | Nom de la commune ou arrondissement                                                        |
| `da_population`                              | Population de la commune                                                                   |
| `da_surface_ha`                              | Surface de la commune en hectares                                                          |
| `dvf_nbtrans`                                | Nombre de transactions total                                                               |
| `dvf_pxm2_median`                            | Prix médian au m² (€/m²)                                                                   |
| `dvf_surface_median`                         | Surface médiane (m²)                                                                       |
| `dvf_nbtrans_cod111`                         | Nombre de transactions de maisons                                                          |
| `dvf_pxm2_median_cod111`                     | Prix médian au m² des maisons (€/m²)                                                       |
| `dvf_nbtrans_cod121`                         | Nombre de transactions d'appartements                                                      |
| `dvf_pxm2_median_cod121`                     | Prix médian au m² des appartements (€/m²)                                                  |
| `dvf_surface_median_cod111`                  | Surface médiane des maisons (m²)                                                           |
| `dvf_surface_median_cod121`                  | Surface médiane des appartements (m²)                                                      |
| `dvf_nbtrans_terrain`                        | Nombre de mutations de terrain sans bâti utilisées                                         |
| `dvf_pxm2_median_terrain`                    | Prix médian au m² du terrain seul (€/m²)                                                   |
| `dvf_surface_median_terrain`                 | Surface médiane des terrains vendus seuls (m²)                                             |
| `anct_part_actifs_transports_en_commun_2022` | Part d'actifs utilisant principalement les transports en commun pour aller travailler 2022 |
| `anct_taux_annuel_evol_population_2016_2022` | Taux d'évolution annuel de la population 2016-2022                                         |

---

- _Fichiers générés le 16/09/2026_
