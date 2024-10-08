import { Component as ModalComponent } from ".";

import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

export default function ClimateAndBiodiversityInformationModal() {
  return (
    <ModalComponent title="À propos des forêts, zones humides et prairies" size="large">
      <p>
        La forêt constitue un réservoir et un puits de carbone qui sont essentiels pour le climat.
        Outre sa participation au cycle du carbone, la forêt fournit un ensemble de services et de
        valeurs grâce à son patrimoine biologique et à sa biodiversité : conservation des sols,
        protection contre les aléas naturels, filtrage des particules et des polluants, augmentation
        de la disponibilité et de la circulation de l'eau, service d'approvisionnement en matériaux
        et énergies, services socioculturels (activités de loisir et de tourisme), dimension
        patrimoniale, etc. (Sources : ADEME « Forêts et usages du bois dans l'atténuation du
        changement climatique, 2021 ; EFESE : Les écosystèmes forestiers, La Documentation
        française, coll. Théma Analyses, e-publication. CGDD, 2019)).
      </p>
      <p>
        Les zones humides sont le berceau de la diversité biologique et fournissent un grand nombre
        de services : régulation de la qualité de l'eau, cycle de l'eau, etc. De nombreux animaux et
        plantes en dépendent : 100 % des d'amphibiens (grenouilles, crapauds, tritons …); 50 % des
        oiseaux; et 30 % des plantes remarquables et menacées en France (Source :&nbsp;
        <ExternalLink href="https://www.zones-humides.org/zones-humides-et-biodiversite">
          https://www.zones-humides.org/zones-humides-et-biodiversite
        </ExternalLink>
        ) .
      </p>
      <p>
        Les prairies jouent également un rôle majeur dans une multitude de processus de régulation :
        régulation du climat par la fixation et le stockage de carbone, contribution à la fixation
        symbiotique de l'azote opérée par les légumineuses très présentes dans ces écosystèmes,
        régulation de la qualité de l'eau (Source : CGDD, Quelle évaluation économique pour les
        services écosystémiques rendus par les prairies en France métropolitaine ?, 2013)
      </p>
    </ModalComponent>
  );
}
