import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Link } from "type-route";

import classNames from "@/shared/views/clsx";

type Props = {
  nextLinkProps: Link;
  backLinkProps?: Link;
};

function OnBoardingIntroductionWhyBenefriches({ nextLinkProps, backLinkProps }: Props) {
  return (
    <section
      className={classNames(fr.cx("fr-container"), "tw-py-20", "tw-grid tw-grid-cols-12 tw-gap-6")}
    >
      <div
        className={classNames(
          "tw-col-span-12",
          "tw-row-start-2",
          "md:tw-row-start-1",
          "md:tw-col-span-4",
        )}
      >
        <img
          className="tw-max-w-full"
          src="/img/balance-illustration.svg"
          alt="Balance économique du projet"
          aria-hidden="true"
        />
      </div>

      <div className="tw-col-span-12 md:tw-col-span-8">
        <h2>En quoi Bénéfriches vous sera utile.</h2>
        <p className="tw-font-medium">
          Bénéfriches calcule la valeur réelle d’un projet d’aménagement. Il vous sera utile si :
        </p>

        <ul className="tw-list-none tw-pl-0">
          <li className="tw-pb-4">
            ✅ Vous hésitez à reconvertir une friche car vous ne savez pas si la valeur des impacts{" "}
            <strong>compensera le déficit</strong> lié aux travaux de reconversion ;
          </li>
          <li className="tw-pb-4">
            ✅ Vous hésitez sur l’<strong>emplacement</strong> de votre projet d’aménagement, entre
            une friche et un espace naturel ou agricole ;
          </li>
          <li className="tw-pb-4">
            ✅ Vous avez besoin de connaître l’ensemble des <strong>retombées</strong> de votre
            projet (sur l’environnement, l’emploi, la sécurité des personnes, les finances
            publiques...)
          </li>
        </ul>

        <p className="tw-font-medium tw-mt-10">En revanche, Bénéfriches n’est pas adapté si :</p>

        <ul className="tw-list-none tw-pl-0">
          <li className="tw-pb-4">❌ Vous recherchez une friche sur votre territoire</li>
          <li className="tw-pb-4">❌ Vous avez une friche mais ne savez pas quoi en faire</li>
          <li className="tw-pb-4">❌ Vous avez besoin de conseils pour avancer sur votre projet</li>
        </ul>

        {backLinkProps ? (
          <ButtonsGroup
            inlineLayoutWhen="always"
            alignment="between"
            buttons={[
              {
                children: "Retour",
                priority: "secondary",
                linkProps: backLinkProps,
              },
              {
                children: "Suivant",
                priority: "primary",
                linkProps: nextLinkProps,
              },
            ]}
          />
        ) : (
          <Button priority="primary" linkProps={nextLinkProps}>
            Suivant
          </Button>
        )}
      </div>
    </section>
  );
}

export default OnBoardingIntroductionWhyBenefriches;
