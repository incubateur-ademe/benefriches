# France Ruralités Revitalisation (FRR)

Official list of French communes classified under the **France Ruralités Revitalisation (FRR)** zoning scheme, used to tell whether a site is located in a rural area.

## Source

- Programme **France Ruralités** — plan de zonage FRR :
  https://www.collectivites-locales.gouv.fr/animer-les-territoires/cohesion-territoriale-et-lamenagement-du-territoire/la-cohesion-territoriale/les-ruralites/le-plan-france-ruralites
- File: `liste-communes-FRR-juillet2025.csv` (classement au 10 juillet 2025)

## File format

Semicolon-delimited CSV (UTF-8, CRLF line endings), one row per French commune (~34 875 communes). Columns:

| Column                                      | Description                            |
| ------------------------------------------- | -------------------------------------- |
| `Code_insee`                                | INSEE code of the commune (`cityCode`) |
| `Departement`                               | Department code                        |
| `Commune`                                   | Commune name                           |
| `Classement FRR et FRR+ au 10 juillet 2025` | FRR classification (see values below)  |

### Classification values

| Value                            | Rural? |
| -------------------------------- | ------ |
| `Non classée`                    | ❌ no  |
| `FRR socle`                      | ✅ yes |
| `FRR+`                           | ✅ yes |
| `FRR bénéficiaire`               | ✅ yes |
| `FRR bénéficiaire partiellement` | ✅ yes |
| `Classée FRR partiellement`      | ✅ yes |

## How it is used

A commune is considered **rural** when its classification is **anything other than `Non classée`**. The seed (`seeds/franceRuralites.ts`) imports only the rural communes into the `france_ruralites` table (`city_code` primary key); presence in the table means the commune is rural (~19 900 communes). See `scripts/read-france-ruralites-csv.ts`.
