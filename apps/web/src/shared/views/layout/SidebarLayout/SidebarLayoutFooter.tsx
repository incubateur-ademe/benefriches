import { fr } from "@codegouvfr/react-dsfr";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import Display from "@codegouvfr/react-dsfr/Display/Display";
import { FooterBottomItem } from "@codegouvfr/react-dsfr/Footer";

import { selectCurrentUserEmail } from "@/features/onboarding/core/user.reducer";
import classNames from "@/shared/views/clsx";
import { routes } from "@/shared/views/router";

import { useAppSelector } from "../../hooks/store.hooks";

function SidebarLayoutFooter() {
  const currentUserEmail = useAppSelector(selectCurrentUserEmail);

  const bottomItems = [
    {
      text: "Accessibilité : non conforme",
      linkProps: routes.accessibilite().link,
    },
    {
      text: "Mentions légales",
      linkProps: routes.mentionsLegales().link,
    },
    { text: "Politique de confidentialité", linkProps: routes.politiqueConfidentialite().link },
    { text: "Statistiques", linkProps: routes.stats().link },
    {
      text: "Contact",
      linkProps: {
        href: "https://tally.so/r/wvAdk8",
        target: "_blank",
        title: "Contact - ouvre une nouvelle fenêtre",
      },
    },
    headerFooterDisplayItem,
  ];

  if (currentUserEmail) {
    bottomItems.push({
      text: "Besoin d'aide",
      iconId: "fr-icon-question-line",
      buttonProps: {
        "data-tally-open": "mOVXLY",
        "data-tally-width": "400",
        "data-tally-emoji-text": "👋",
        "data-tally-emoji-animation": "wave",
        "data-tally-auto-close": "0",
        "data-email": currentUserEmail,
        "data-url": window.location.href,
      },
    });
  }

  return (
    <footer id="footer">
      <Display />
      <div className={classNames(fr.cx("fr-footer__bottom"), "m-0")}>
        <ul className={classNames(fr.cx("fr-footer__bottom-list"), "mx-auto w-auto")}>
          {bottomItems.map((bottomItem, i) => (
            <li className={classNames(fr.cx("fr-footer__bottom-item"))} key={i}>
              <FooterBottomItem bottomItem={bottomItem} />
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export default SidebarLayoutFooter;
