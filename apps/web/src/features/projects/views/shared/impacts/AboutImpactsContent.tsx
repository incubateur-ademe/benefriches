import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

const SectionTitle = ({ children }: { children: string }) => {
  return <h3 className="text-base mb-1">{children}</h3>;
};

function AboutImpactsContcnt() {
  return (
    <>
      <section className="mb-4">
        <SectionTitle>⚙️&nbsp;Comment fonctionne Bénéfriches&nbsp;?</SectionTitle>
        <p className="mb-2">
          Bénéfriches repose sur les principes de l’analyse coûts-bénéfices, qui a pour objet
          d’apprécier l’intérêt d’une opération (projet ou investissement), sur une période donnée.
          Elle est réalisée en analysant les impacts du projet sur les différents types d’acteurs
          directement ou indirectement concernés, que ces impacts soient positifs ou négatifs
          (ex&nbsp;: tonnes de CO2 évitées, surfaces désimperméabilisées).
        </p>
        <p>
          Puis en les comparant au bilan de l’opération (recettes vs. dépenses nécessaires à sa
          réalisation) qui est exprimé en €.
        </p>
        <p>
          Pour pouvoir effectuer cette comparaison il est nécessaire de convertir les valeurs
          d’impacts en valeurs monétaires. On parle alors de «&nbsp;monétarisation&nbsp;».
        </p>
      </section>
      <section className="mb-4">
        <SectionTitle>📊&nbsp;Quels sont les impacts calculés par Bénéfriches&nbsp;?</SectionTitle>
        <p>
          Bénéfriches calcule tous les impacts de votre projet, regroupés au sein de 6 familles, sur
          la base d’un ou plusieurs indicateurs.{" "}
        </p>
        <p>4 familles d’impacts sont exprimées sous forme monétaire :</p>

        <ul>
          <li>Impacts économiques directs (exemple d’indicateur : fiscalité)</li>
          <li>
            Impacts économiques indirects (exemple d’indicateur : dépenses de sécurisation d'un
            site)
          </li>
          <li>
            Impacts sociaux monétarisés (exemple d’indicateur : temps passé en moins dans les
            transports)
          </li>
          <li>
            Impacts environnementaux monétarisés (exemple d’indicateur : valeur monétaire des
            services écosystémiques)
          </li>
        </ul>

        <p>2 autres familles proposent des impacts non-monétarisés :</p>

        <ul>
          <li>Impacts sociaux (exemple d’indicateur : emplois)</li>
          <li>Impacts environnementaux (exemple d’indicateur : surface polluée)</li>
        </ul>

        <p>
          Ces 2 impacts non-monétarisés sont utilisés pour calculer les 2 impacts monétarisés
          (sociaux et environnementaux).
        </p>
      </section>
      <section className="mb-4">
        <SectionTitle>🧮&nbsp;Comment sont calculés les indicateurs d’impacts&nbsp;?</SectionTitle>
        <p>
          Les indicateurs d'impacts sont généralement calculés simplement en multipliant une donnée
          du site ou du projet (ex : surface imperméabilisée) que vous avez renseignée, ou une
          différence entre ces 2 données, par une valeur d’impact (ex : stock de carbone dans les
          sols imperméabilisés par unité de surface).
        </p>
        <p>
          Des hypothèses sont parfois utilisées (ex : distance du site jusqu’à laquelle est
          considérée un impact).
        </p>
      </section>
      <section>
        <SectionTitle>
          🗂️&nbsp;Quelles sont les données utilisées dans le calcul des impacts&nbsp;?
        </SectionTitle>
        Les valeurs utilisées dans les calculs et qui ne sont pas saisies par l’utilisateur
        proviennent de données sourcées :
        <ul>
          <li>
            les valeurs de référence sont compilées à partir de publications institutionnelles
            (INSEE, France Stratégie, AGRESTE, ADEME, etc.) ou de publications scientifiques, par
            exemple pour les valeurs monétaires (voir ci-dessous),
          </li>
          <li>
            les exploitations sont faites à partir de bases de données reconnues voire officielles,
            accessibles en&nbsp;[opendata](https://www.data.gouv.fr/fr/)&nbsp;(ALDO, dvf, etc.)
          </li>
          <li>
            des hypothèses contextualisées (ex : temps de déplacement gagné par les habitants du
            fait de la création d'une nouvelle centralité à partir des données de l'[Observatoire
            des territoires](https://www.observatoire-des-territoires.gouv.fr/)).
          </li>
        </ul>
      </section>
      <section>
        <SectionTitle>💰 Qu’est-ce qu’un impact monétarisé&nbsp;?</SectionTitle>
        <p>
          Bénéfriches calcule tous les impacts de votre projet : économiques directs (ex :
          fiscalité), retombées (ex&nbsp;: ↘️ des dépenses de sécurisation d'un site), mais aussi
          les "gains en nature" monétarisés. Il s’agit d’effets non marchands ou "externalités"
          (ex&nbsp;: ↘️ des émissions carbone) auxquels il est possible d'attribuer une valeur
          monétaire.
        </p>
        <p>
          Par exemple : Valeur monétaire de la décarbonation → En produisant des EnR ou en réduisant
          les déplacements en voiture, le projet participe à la décarbonation. Cette action en
          faveur du climat a une valeur monétaire que Bénéfriches utilise dans ses calculs.
        </p>
      </section>
      <section>
        <SectionTitle>
          🇫🇷 Qui est la “société française” et comment mon projet l’impacte-t-elle&nbsp;?
        </SectionTitle>
        <p>
          La société française regroupe l’état français, ses acteurs économiques et sa population.
          Ils peuvent être indirectement affectés par le projet (accidents de la route évités,
          dépenses de santé évitées...)
        </p>
      </section>
      <section>
        <SectionTitle>
          🌎 Qui est la “société humaine” et comment mon projet l’impacte-t-elle&nbsp;?
        </SectionTitle>
        <p>
          L'humanité représente l’ensemble des habitants de la planète. Ceux-ci bénéficient
          indirectement des impacts du projet sur l’environnement (réduction des émissions de gaz à
          effet de serre, maintien de la biodiversité...).
        </p>
      </section>
      <section>
        <SectionTitle>⏱️ Sur quelle durée les impacts sont-ils calculés&nbsp;? </SectionTitle>
        <p>
          Bénéfriches calcule les impacts d’un projet de reconversion sur une durée représentative
          de la durée de vie ou d’usage des différents types de projets. Cette durée est prise par
          défaut égale à 20 ans pour les projets photovoltaïques, et égale à 50 ans pour les projets
          d’aménagement ou de construction. Vous pouvez modifier cette durée via le sélecteur de
          durée situé en haut de la page.
        </p>
      </section>
      <section>
        <SectionTitle>
          💶 L’euro de 2050 est-il le même que l’euro d’aujourd’hui dans le calcul des impacts
          monétaires&nbsp;?
        </SectionTitle>
        <p>
          Conformément aux principes de l’évaluation socio-économique, Bénéfriches
          «&nbsp;actualise&nbsp;» les coûts et bénéfices futurs du projet pour pouvoir les comparer.
          Actualiser signifie « ramener à une valeur d’aujourd’hui&nbsp;». Pour cela, on utilise un
          coefficient (ou taux) d’actualisation.
        </p>
        Pour les indicateurs concernés, les calculs prennent en compte :
        <ul>
          <li>l'évolution future estimée du PIB/habitants</li>
          <li>l'évolution future estimée du CO2eq émis par les véhicules</li>
          <li>l'évolution future estimée de la valeur monétaire associée aux émissions de CO2eq</li>
        </ul>
      </section>
      <section>
        <SectionTitle>
          💸 Les gains ou pertes liés à mon projet sont-ils un état final ou un différentiel&nbsp;?
        </SectionTitle>
        <p>
          Par principe, une analyse coût-bénéfices est une approche comparative. Il s’agit de
          comparer les effets du projet (positifs (bénéfices) ou négatifs (dommages)) à une option
          de référence. L’option de référence correspond à la situation la plus probable en
          l’absence de réalisation du projet.
        </p>
        <p>
          Par défaut, Bénéfriches va calculer la différence entre les impacts associés à la
          réalisation d’un projet sur le site vs. le site reste en l’état.
        </p>
      </section>
      <section>
        <SectionTitle>⚖️ Pourquoi comparer mon projet à un autre&nbsp;? </SectionTitle>
        Grâce à la fonction «&nbsp;Comparer&nbsp;», il est possible d’obtenir des résultats enrichis
        en proposant :
        <ol>
          <li>
            une décomposition du différentiel calculé en première approche avec affichage d’une part
            des impacts associés au site s’il n’est pas reconverti et d’autre part des impacts
            associés au projet. Cela permet d’apprécier une sorte de «&nbsp;coût de
            l’inaction&nbsp;».
          </li>
          <li>
            une comparaison des impacts associés au projet qu’il soit réalisé sur le site ou en
            extension urbaine,
          </li>
          <li>
            une comparaison des impacts associés à la réalisation de 2 projets distincts (ex :
            projet urbain vs. renaturation) sur le même site
          </li>
        </ol>
      </section>
      <section>
        <SectionTitle>Pour en savoir plus :</SectionTitle>
        Grâce à la fonction «&nbsp;Comparer&nbsp;», il est possible d’obtenir des résultats enrichis
        en proposant :
        <ul>
          <li>
            <ExternalLink href="https://www.strategie.gouv.fr/levaluation-socioeconomique-investir-pour-la-collectivite">
              Infographie sur l’évaluation socio-économique, France Stratégie
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.strategie.gouv.fr/taux-dactualisation-un-beta-sensible">
              Infographie sur la notion d’actualisation, France Stratégie
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.ecologie.gouv.fr/sites/default/files/publications/Th%C3%A9ma%20-%20L%27analyse%20du%20cycle%20de%20vie%20%20-%20Enjeux%20autour%20de%20la%20mon%C3%A9tarisation.pdf">
              Analyse du cycle de vie, enjeux autour de la monétarisation, Commissariat général au
              développement durable, Ministère de la transition écologique
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.ecologie.gouv.fr/sites/default/files/AMC%20-%20Guide%20m%C3%A9thodologique%20ABC.pdf">
              Analyse coût bénéfices, Ministère de la transition écologique
            </ExternalLink>
          </li>
        </ul>
      </section>
    </>
  );
}

export default AboutImpactsContcnt;
