# Bénéfriches glossary

Bénéfriches is in French. A **site** is a piece of land; a **projet** (reconversion project) is what could be built on it. The app computes the **impacts** of a project compared with keeping the site as it is (**statu quo**): economic, social and environmental.

## Site natures

- `FRICHE` — **Friche**: abandoned or under-used land (former factory, warehouse, railway land…). Chosen by answering "Oui" to "Votre site est-il une friche ?". Has an activity ("activité"), possible pollution ("pollution des sols", "superficie polluée") and accidents.
- `AGRICULTURAL_OPERATION` — **Exploitation agricole**: farming land (culture, maraîchage, élevage…).
- `NATURAL_AREA` — **Espace naturel**: forest, prairie, wetland…
- `URBAN_ZONE` — **Zone urbaine**: a residential or economic-activity area, described by land parcels ("parcelles") and vacant premises ("locaux vacants").

## Project types

- `URBAN_PROJECT` — **Autre projet d'aménagement** (urban project, "projet urbain"): housing, offices, shops, public facilities, green spaces… An express urban project starts from a template such as "Centralité urbaine", "Équipement public", "Résidentiel secteur tendu" or "Résidentiel secteur détendu".
- `PHOTOVOLTAIC_POWER_PLANT` — **Centrale photovoltaïque**, under "Centrale d'énergie renouvelable": solar panels, sized by surface, electrical power (kWc) or yearly production (MWh).

## Creation modes

- **Express**: few inputs, Bénéfriches computes the rest. For a project: "J'ai pas ou peu de données". For a site: "Évaluer un site et un projet demo" creates a demo site ("site démo") and demo projects ("projet démo"), which can't be edited.
- **Custom** ("personnalisé"): every step of the wizard. For a project: "J'ai des données précises". For a site: "Évaluer mon site".
- **Duplicated**: a copy of an existing project, through "Évaluer une variante du projet" in the project page menu.

Sites and projects are created through a multi-step form ("wizard") with a stepper on the side: "Suivant" goes to the next step, "Retour" to the previous one, "Passer" skips an optional step, "Valider" confirms pre-filled values. Each wizard ends on a summary ("Récapitulatif"), then a confirmation such as "Le site « … » est créé".

## soilsDistribution

The surface of each soil type on the site or project, in square metres (m²) or as a percentage. The soil surfaces must add up to the total surface ("Superficie totale"). Soil types:

- Artificial: "Bâtiments", "Sols imperméabilisés" (asphalt, concrete), "Sols perméables minéraux" (gravel, bare soil), "Sols enherbés et arbustifs", "Sol arboré".
- Natural and agricultural: "Forêt de feuillus", "Forêt de conifères", "Forêt de peupliers", "Forêt mixte", "Prairie herbacée", "Prairie arbustive", "Prairie arborée", "Culture", "Verger", "Vigne", "Zone humide", "Plan d'eau".

The soils drive the carbon storage ("stockage du carbone par les sols") and the artificialisation impacts. A friche that keeps its buildings or its sealed soils is "déjà artificialisée".

## Other French terms

- **Mes évaluations**: the list of the user's sites and projects.
- **Aménageur**: the developer of the project. **Maître d'ouvrage**: the project owner. **Exploitant**: the operator of the site or plant. **Propriétaire**: the owner. **Collectivité**: a local authority (commune, intercommunalité, département, région).
- **Remise en état**: site reinstatement works before the project (demolition, dépollution = decontamination, désimperméabilisation = removing sealed soils).
- **Dépenses / recettes**: expenses / revenue. **Charges annuelles**: yearly expenses (taxe foncière, gardiennage = security, entretien = maintenance). **Loyer**: rent. **Acquisition du site**: site purchase. **Bilan de l'opération**: the project's financial balance.
- **Aides financières**: public financial assistance. **Subvention**: grant.
- **ETP** (équivalent temps plein): full-time jobs.
- **Calendrier**: schedule (works start and end dates, operation start, as month/year).
- **Surface de plancher**: floor area of buildings. **Emprise au sol**: footprint.
- **Impacts**: the results page of a project, with economic ("socio-économiques"), environmental and social indicators, over an evaluation period in years.
- **Mutabilité / compatibilité**: how well a friche suits each kind of project, in the "La compatibilité de ma friche" flow.
