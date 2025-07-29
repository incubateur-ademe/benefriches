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

### Couverture géographique

- **Communes françaises** : 34 879
- **Arrondissements** : 45 (Paris, Marseille, Lyon)
- **Total** : 34 924 entités géographiques

### Période d'analyse

- **Année la plus récente** : 2024
- **Année la plus ancienne** : 2020
- **Années disponibles** : 2024, 2023, 2022, 2021, 2020

### Méthode de calcul

Pour chaque commune et type de bien :

1. **Priorité aux données récentes** : Les prix médians sont calculés prioritairement sur les 3 années les plus récentes
2. **Seuil de fiabilité** : Si moins de 5 transactions sont trouvées sur 3 ans, l'analyse remonte plus loin dans le temps
3. **Filtrage des données** :
   - Surfaces entre 10 et 500 m²
   - Prix au m² entre 500 et 25 000 €/m²
   - Ventes uniquement (pas de donations, etc.)

### Statistiques nationales

- **Prix médian national** : 2608 €/m²
  - **Prix médian national (maisons)** : 2179 €/m²
  - **Prix médian national (appartements)** : 3324 €/m²
- **Total transactions analysées** : 2 643 272
  - **Total transactions maisons analysées** : 1 458 404
  - **Total transactions appartements analysées** : 1 197 994
- **Prix médian par tailles de communes** :
  - **Communes de moins de 500 habitants** : 1513 €/m²
  - **Communes de moins de 501 à 1500 habitants** : 1826 €/m²
  - **Communes de moins de 1501 à 3000 habitants** : 2185 €/m²
  - **Communes de moins de 3001 à 10000 habitants** : 2571 €/m²
  - **Communes de moins de 10001 à 50000 habitants** : 3188 €/m²
  - **Communes de moins de 50001 à 100000 habitants** : 3727 €/m²
  - **Communes de moins de plus de 100000 habitants** : 3466 €/m²
- **Communes avec données** : 34 924

### Structure du fichier cityStats.csv

| Colonne                     | Description                                |
| --------------------------- | ------------------------------------------ |
| `city_code`                 | Code INSEE de la commune ou arrondissement |
| `da_name`                   | Nom de la commune ou arrondissement        |
| `da_population`             | Population de la commune                   |
| `da_surface_ha`             | Surface de la commune en hectares          |
| `dvf_nbtrans`               | Nombre de transactions total               |
| `dvf_pxm2_median`           | Prix médian au m² (€/m²)                   |
| `dvf_surface_median`        | Surface médiane (m²)                       |
| `dvf_nbtrans_cod111`        | Nombre de transactions de maisons          |
| `dvf_pxm2_median_cod111`    | Prix médian au m² des maisons (€/m²)       |
| `dvf_nbtrans_cod121`        | Nombre de transactions d'appartements      |
| `dvf_pxm2_median_cod121`    | Prix médian au m² des appartements (€/m²)  |
| `dvf_surface_median_cod111` | Surface médiane des maisons (m²)           |
| `dvf_surface_median_cod121` | Surface médiane des appartements (m²)      |

### Limites

- Les données DVF ne couvrent pas toutes les transactions (notamment les ventes de logements sociaux)
- Certaines communes peuvent avoir peu ou pas de transactions selon les années
- Les prix peuvent varier significativement au sein d'une même commune selon les quartiers

### Analyse des données manquantes

- **Total des communes analysées**: 34 924
- **Communes sans données DVF**: 1 822
- **Pourcentage sans données**: 5.2%

#### Départements connus absents des données DVF

- **Département Bas-Rhin (67)**: 514 commune(s)
- **Département Haut-Rhin (68)**: 366 commune(s)
- **Département Moselle (57)**: 725 commune(s)
- **Départements Outre-mer**: 29 commune(s)

#### Communes restantes sans données DVF: 188

- **Communes de moins de 200 habitants**: 183 commune(s)
- **Communes de plus de 200 habitants sans données**: 5 commune(s)

#### Communes de plus de 200 habitants sans données DVF

- **Orée d'Anjou** (49126) - 16975 habitants
- **Sannerville** (14666) - 1884 habitants
- **Sainte-Florence** (85212) - 1338 habitants
- **L'Oie** (85165) - 1264 habitants
- **Île-de-Sein** (29083) - 280 habitants

---

- _Fichiers générés le 29/07/2025_
