type Props = {
  hasTenant: boolean;
  isFriche: boolean;
};

function SiteYearlyExpensesFormInstructions({ hasTenant, isFriche }: Props) {
  return (
    <>
      <p>
        Les montants pré-remplis le sont d'après les informations de surface que vous avez renseigné
        et les coûts moyens observés (sources&nbsp;: IDFriches, le coût de l'inaction, 2020&nbsp;;
        ADEME, données internes, 2023&nbsp;; mémoire de thèse de Marjorie Tendero, 2018). Ils sont
        exprimés en € HT.
      </p>
      <p>Vous pouvez modifier ces montants.</p>
      <div>💡</div>
      <p className="fr-text--xs">
        Un site qui reste en l'état, sans intervention, c'est un site qui coûte.
      </p>
      <ul className="fr-text--xs">
        <li>De manière directe, via la fiscalité locale (ex&nbsp;: taxe foncière)</li>
        <li>
          De manière indirecte car lorsqu'aucun moyen de préservation n'est mis en œuvre sur un site
          (clôture, gardiennage, taille, etc.), celui-ci se dégrade de manière naturelle ou par
          l'intermédiaire de dégradation volontaire ou de vandalisme (ex&nbsp;: vol de métaux, casse
          de vitres, incendie, dépôts sauvages) ou de squats, engendrant une perte financière
          (valeur du bien) voire une augmentation des dépenses de réhabilitation (source&nbsp;:
          IDFriches, le coût de l'inaction, 2020)
        </li>
      </ul>
      {hasTenant && isFriche && (
        <p className="fr-text--xs">
          Sauf en cas de défaillance de l'exploitant (faillite, liquidation judiciaire, etc.) les
          dépenses de gardiennage, d'entretien, d'enlèvement de déchets sont à la charge de ce
          dernier.
        </p>
      )}
      {hasTenant && !isFriche && (
        <p className="fr-text--xs">
          Sauf en cas de défaillance de l'exploitant (faillite, liquidation judiciaire, etc.) les
          dépenses d'entretien sont à la charge de ce dernier.
        </p>
      )}
      <p className="fr-text--xs">La taxe foncière est due par le propriétaire foncier.</p>
      <p className="fr-text--xs">
        Parmi les «&nbsp;autres coûts de gestion&nbsp;» on peut citer les factures d'eau et
        électricité.
      </p>
    </>
  );
}

export default SiteYearlyExpensesFormInstructions;
