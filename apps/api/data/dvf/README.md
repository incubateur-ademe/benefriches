# Génération des statistiques communales françaises

## Utilisation

```sh
node build-city-stats.ts
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
   - Types de biens : Maisons (cod111), Appartements (cod121) et Terrains à bâtir
   - Surface et prix de vente

### Couverture géographique

- **Communes françaises** : 34,879
- **Arrondissements** : 45 (Paris, Marseille, Lyon)
- **Total** : 34,924 entités géographiques

### Période d'analyse

- **Année la plus récente** : 2025
- **Année la plus ancienne** : 2020
- **Années disponibles** : 2025, 2024, 2023, 2022, 2021, 2020

### Méthode de calcul

Pour chaque commune et type de bien :

1. **Priorité aux données récentes** : Les prix médians sont calculés prioritairement sur les 3 années les plus récentes
2. **Seuil de fiabilité** : Si moins de 5 transactions sont trouvées sur 3 ans, l'analyse remonte plus loin dans le temps
3. **Filtrage des données résidentielles** :
   - Surfaces entre 10 et 500 m²
   - Prix au m² entre 500 et 25 000 €/m²
   - Ventes uniquement (pas de donations, etc.)
4. **Filtrage des terrains à bâtir** :
   - Surface positive
   - Prix au m² positif et inférieur à 25 000 €/m²
   - Nature de culture : "terrains a bâtir"

### Statistiques nationales

- **Prix médian national** : 2565 €/m²
  - **Prix médian national (maisons)** : 2145 €/m²
  - **Prix médian national (appartements)** : 3295 €/m²
  - **Prix médian national (terrains à bâtir)** : 154 €/m²
- **Total transactions analysées** : 1,931,580
  - **Total transactions maisons analysées** : 1,074,344
  - **Total transactions appartements analysées** : 878,679
  - **Total transactions terrains à bâtir analysées** : 163,450
- **Prix médian par tailles de communes** :
  - **Communes de moins de 500 habitants** : 1511 €/m²
  - **Communes de moins de 501 à 1500 habitants** : 1821 €/m²
  - **Communes de moins de 1501 à 3000 habitants** : 2157 €/m²
  - **Communes de moins de 3001 à 10000 habitants** : 2547 €/m²
  - **Communes de moins de 10001 à 50000 habitants** : 3091 €/m²
  - **Communes de moins de 50001 à 100000 habitants** : 3601 €/m²
  - **Communes de moins de plus de 100000 habitants** : 3462 €/m²
- **Communes avec données** : 34,924

### Structure du fichier cityStats.csv

| Colonne                          | Description                                |
| -------------------------------- | ------------------------------------------ |
| `city_code`                      | Code INSEE de la commune ou arrondissement |
| `da_name`                        | Nom de la commune ou arrondissement        |
| `da_population`                  | Population de la commune                   |
| `da_surface_ha`                  | Surface de la commune en hectares          |
| `dvf_nbtrans_residential`        | Nombre de transactions résidentielles      |
| `dvf_pxm2_median_residential`    | Prix médian au m² résidentiel (€/m²)       |
| `dvf_surface_median_residential` | Surface médiane résidentielle (m²)         |
| `dvf_nbtrans_cod111`             | Nombre de transactions de maisons          |
| `dvf_pxm2_median_cod111`         | Prix médian au m² des maisons (€/m²)       |
| `dvf_nbtrans_cod121`             | Nombre de transactions d'appartements      |
| `dvf_pxm2_median_cod121`         | Prix médian au m² des appartements (€/m²)  |
| `dvf_surface_median_cod111`      | Surface médiane des maisons (m²)           |
| `dvf_surface_median_cod121`      | Surface médiane des appartements (m²)      |
| `dvf_nbtrans_terrain`            | Nombre de transactions de terrains à bâtir |
| `dvf_pxm2_median_terrain`        | Prix médian au m² des terrains à bâtir     |
| `dvf_surface_median_terrain`     | Surface médiane des terrains à bâtir (m²)  |

### Limites

- Les données DVF ne couvrent pas toutes les transactions (notamment les ventes de logements sociaux)
- Certaines communes peuvent avoir peu ou pas de transactions selon les années
- Les prix peuvent varier significativement au sein d'une même commune selon les quartiers

### Analyse des données manquantes

- **Total des communes analysées**: 34 924
- **Communes sans données DVF**: 1 821
- **Pourcentage sans données**: 5.2%

#### Départements connus absents des données DVF

- **Département Bas-Rhin (67)**: 514 commune(s)
- **Département Haut-Rhin (68)**: 366 commune(s)
- **Département Moselle (57)**: 725 commune(s)
- **Départements Outre-mer**: 29 commune(s)

#### Communes restantes sans données DVF: 187

- **Communes de moins de 200 habitants**: 180 commune(s)
- **Communes de plus de 200 habitants sans données**: 7 commune(s)

#### Communes de plus de 200 habitants sans données DVF

- **Orée d'Anjou** (49126) - 17162 habitants
- **Sannerville** (14666) - 1905 habitants
- **Sainte-Florence** (85212) - 1359 habitants
- **L'Oie** (85165) - 1250 habitants
- **Chalinargues** (15035) - 304 habitants
- **Île-de-Sein** (29083) - 263 habitants
- **Celles** (15031) - 217 habitants

---

- _Fichiers générés le 24/02/2026_
