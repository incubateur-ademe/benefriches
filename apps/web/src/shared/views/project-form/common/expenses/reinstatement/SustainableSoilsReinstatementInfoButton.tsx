import { Button } from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";

const modal = createModal({
  id: "sustainable-soils-reinstatement-info-modal",
  isOpenedByDefault: false,
});

const SustainableSoilsReinstatementInfoButton = () => {
  return (
    <>
      <Button
        iconId="fr-icon-question-line"
        priority="tertiary no outline"
        title="À propos de la restauration écologique des sols"
        size="small"
        nativeButtonProps={{ type: "button", ...modal.buttonProps }}
      />
      <modal.Component title="À propos de la restauration écologique des sols" size="large">
        <p>
          Le sol, quand il n'a pas été artificialisé, est un milieu vivant, en perpétuel
          renouvellement.
        </p>
        <p>
          Bien que les sols occupent une place centrale dans les différents enjeux globaux que sont
          la sécurité alimentaire, l'accès à l'eau potable, la régulation du climat et la
          préservation de la biodiversité, ils peuvent être soumis à des dégradations liées à une
          mauvaise gestion de cette ressource (ex&nbsp;: tassement, érosion, appauvrissement en
          matière organique ou en biodiversité, artificialisation).
        </p>
        <p>
          La restauration écologique des sols consiste donc à «&nbsp;réparer&nbsp;» ou recréer les
          processus écologiques préexistants en termes de composition spécifique ou de structures
          des communautés végétale et animale.
        </p>
        <p>Concrètement, il s'agit d'appliquer des techniques soit de&nbsp;:</p>
        <ul>
          <li>
            génie écologique par décompaction du sol, puis léger apport en matière organique,
            inoculation en micro-organismes et semis ou plantations,
          </li>
          <li>
            génie pédologique afin de créer des sols fertiles à l'aide de matériaux qui pour la
            plupart sont issus de déchets urbains.
          </li>
        </ul>

        <p>
          Ces techniques nécessitent une phase fondamentale de diagnostic avant la mise en œuvre des
          travaux.
        </p>
        <p>
          La fertilité des sols est la fonction principale recherchée, mais des fonctions
          complémentaires peuvent également être restaurées (rétention de l'eau, infiltration eau,
          lutte contre les espèces invasives etc.). Pour aller plus loin&nbsp;: les services
          écosystémiques rendus par la nature.
        </p>
      </modal.Component>
    </>
  );
};

export default SustainableSoilsReinstatementInfoButton;
