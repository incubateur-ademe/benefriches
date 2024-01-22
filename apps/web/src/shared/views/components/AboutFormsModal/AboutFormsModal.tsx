import { createModal } from "@codegouvfr/react-dsfr/Modal";

const modal = createModal({
  id: "about-benefriches-forms-modal",
  isOpenedByDefault: true,
});

function AboutFormsModal() {
  return (
    <div>
      <modal.Component
        title="À propos du formulaire Bénéfriches"
        buttons={[
          {
            children: "Saisir les informations",
            type: "button",
          },
        ]}
      >
        <ul>
          <li>
            <strong>La plupart des questions ne sont pas obligatoires</strong>
          </li>
          <p>Vous pouvez les laisser vides. Les questions obligatoires sont signalées par un *.</p>
          <li>
            <strong>
              Sur certaines questions, Bénéfriches vous propose des réponses par défaut
            </strong>
          </li>
          <p>
            Bénéfriches vous propose des valeurs par défaut, issues du retour d'éxpériences de
            l'ADEME ou autres ressources documentaires. Vous pouvez modifier ces valeurs.
          </p>
        </ul>
      </modal.Component>
    </div>
  );
}

export default AboutFormsModal;
