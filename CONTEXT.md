# Bénéfriches

Bénéfriches helps land-development project managers measure the economic, social and environmental impacts of reconverting a site, so that more brownfields get reconverted. Entry names are the terms used in the code; the _UI wording (FR)_ line gives the French wording users see in the app.

## Language

### Sites

**Site**:
The piece of land described in Bénéfriches, which hosts or could host a reconversion project.
_UI wording (FR)_: « site »

**Friche**:
A site that is abandoned or unused, whose owner bears security and upkeep costs until it is reconverted (`FRICHE`).
_UI wording (FR)_: « Friche »

**Agricultural operation**:
A site used for farming, such as crops, livestock, orchards or vineyards (`AGRICULTURAL_OPERATION`).
_UI wording (FR)_: « Exploitation agricole »

**Natural area**:
An undeveloped site made of natural environments such as forest, prairie or wetland (`NATURAL_AREA`).
_UI wording (FR)_: « Espace naturel »

**Urban zone**:
A site that is already urbanized: an economic activity zone, a residential zone, a public facility or a mixed urban zone (`URBAN_ZONE`).
_UI wording (FR)_: « Zone urbaine » ; types « Zone d'activités économiques », « Zone d'habitation », « Équipement public », « Zone urbaine mixte »

**Soils distribution**:
The surface area taken up by each soil type (buildings, impermeable soils, prairie, forest, water…) on a site or in a project; the starting point of most impact calculations (`soilsDistribution`).
_UI wording (FR)_: « Sols » ; types « Bâtiments », « Sols imperméabilisés », « Sols perméables minéraux », « Prairie herbacée », « Zone humide », « Plan d'eau »

**Mutability evaluation**:
An estimate of how well the site suits each possible project type, ranking them from most to least suitable (`mutability`, `compatibilityScore`).
_UI wording (FR)_: « évaluation de la mutabilité du site » ; levels « Très favorable », « Favorable », « Correct », « Défavorable »

### Projects

**Reconversion project**:
What is planned to be built or developed on a site, whose impacts Bénéfriches evaluates (`reconversionProject`).
_UI wording (FR)_: « projet »

**Urban project**:
A development project with buildings, public spaces or green spaces, filed under a category (`URBAN_PROJECT`).
_UI wording (FR)_: « Projet urbain » ; categories « Centralité urbaine », « Équipement public », « Résidentiel secteur tendu », « Résidentiel secteur détendu », « Bureaux », « Zone industrielle ou logistique », « Lieu culturel ou touristique », « Espace de nature »

**Photovoltaic power plant**:
A project that produces solar electricity on the site (`PHOTOVOLTAIC_POWER_PLANT`).
_UI wording (FR)_: « Centrale photovoltaïque »

**Project phase**:
The stage the project has reached: setup, planning, design, construction or completed (`projectPhase`).
_UI wording (FR)_: « Montage / Développement », « Programmation », « Conception / Ingénierie », « Réalisation / Construction », « Projet achevé », « Autre/Ne sait pas »

**Economic balance**:
The difference between the revenues (resale, subsidies, rents…) and the expenses (site purchase, reinstatement, works, operation) needed to carry out the project, in euros (`economicBalance`).
_UI wording (FR)_: « bilan de l'opération » ; view « Analyse coût-bénéfices »

### Impacts

**Statu quo**:
The reference situation where the site is left as it is, against which the project is compared (`statuQuo`).
_UI wording (FR)_: « statu quo »

**Impacts**:
The effects of the project compared with the statu quo, quantified over the evaluation period, whether positive or negative (`impacts`).
_UI wording (FR)_: « Évaluation des impacts »

**Evaluation period**:
The number of years over which impacts are calculated (`evaluationPeriod`).
_UI wording (FR)_: « durée d'évaluation »

**Impact family**:
One of the six groupings of impacts: economic for the local authority, economic for residents, monetized social and environmental for society, then non-monetized social and environmental.
_UI wording (FR)_: « Impacts économiques », « Impacts sociaux », « Impacts environnementaux »

**Monetization**:
Converting a non-market effect (avoided CO₂, services provided by soils…) into a euro value so it can be compared with other costs and benefits.
_UI wording (FR)_: « impact monétarisé », « monétarisation »

**Cost-benefit analysis**:
The comparison, in euros and over the evaluation period, of the project against the statu quo for each stakeholder concerned.
_UI wording (FR)_: « Analyse coût-bénéfices »

**Avoided costs analysis**:
A measure of the spending the project avoids, compared with doing nothing on the friche or with urban sprawl onto a greenfield site (`avoidedCosts`).
_UI wording (FR)_: « Analyse des coûts évités », « Coût de l'inaction »

**Development score**:
A grade from A to E summarizing the project's performance on four criteria: local authority finances, jobs, residents' quality of life and environment (`developmentScore`).
_UI wording (FR)_: « Score d'impact » (overall: « Projet à impact très positif » to « Projet à impact très négatif »)
_Avoid_: « Score d'aménagement »

## Relationships

- A **site** has a nature: **Friche**, **Agricultural operation**, **Natural area** or **Urban zone**.
- A **reconversion project** is carried out on a **site** and compared with its **statu quo**.
- **Impacts** come from the difference between the project's **soils distribution** and the site's.
- The **development score** is computed from the **impacts** and the data entered in the forms.
