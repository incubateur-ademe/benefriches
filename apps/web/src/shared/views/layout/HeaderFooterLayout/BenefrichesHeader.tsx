import Button from "@codegouvfr/react-dsfr/Button";
import { Header, HeaderProps } from "@codegouvfr/react-dsfr/Header";
import { useWindowInnerSize } from "@codegouvfr/react-dsfr/tools/useWindowInnerSize";
import { useBreakpointsValuesPx } from "@codegouvfr/react-dsfr/useBreakpointsValuesPx";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { useMemo } from "react";
import { Fragment } from "react/jsx-runtime";
import { Link } from "type-route";

import AboutImpactsContent from "@/features/projects/views/shared/impacts/AboutImpactsContent";
import { routes, useRoute } from "@/shared/views/router";

import classNames from "../../clsx";
import DsfrA11yDialog from "../../components/Dialog/DsfrA11yDialog";
import MenuItemButton from "../../components/Menu/MenuItemButton";
import { useAppSelector } from "../../hooks/store.hooks";
// oxlint-disable-next-line no-unassigned-import
import "./BenefrichesHeader.css";

const QUICK_ACCESS_ITEMS_PROPS = {
  myEvaluations: {
    iconId: "fr-icon-bar-chart-box-line",
    text: "Mes évaluations",
  },
  menuItems: [
    {
      iconId: "fr-icon-logout-box-r-line",
      text: "Se déconnecter",
      linkProps: { href: "/api/auth/logout" },
    },
  ],
} as const;

const MENU_ITEMS_CLASSES = classNames(
  "z-800",
  "w-68",
  "mt-2",
  "rounded-sm",
  "bg-white dark:bg-dsfr-contrast-grey!",
  "shadow-sm",
  "ring-1 ring-black/5",
  "py-1",
);

const DIALOG_ID = "fr-dialog-about-impacts-header";

function BenefrichesHeader({
  homeLinkPropsHref = routes.home().href,
  myEvaluationsLink = routes.myEvaluations().link,
  ...props
}: Partial<HeaderProps> & { myEvaluationsLink?: Link; homeLinkPropsHref?: Link["href"] }) {
  const isUserLoggedIn = useAppSelector(
    (state) => state.currentUser.currentUserState === "authenticated",
  );

  const { breakpointsValues } = useBreakpointsValuesPx();
  const { windowInnerWidth } = useWindowInnerSize();

  const isLg = windowInnerWidth >= breakpointsValues.lg;

  const route = useRoute();

  const quickAccessItems = useMemo((): HeaderProps["quickAccessItems"] => {
    if (isUserLoggedIn) {
      if (isLg) {
        return [
          <Button
            className={classNames(
              "text-(--text-default-grey)",
              route.link.href === myEvaluationsLink.href &&
                "bg-blue-ultralight text-blue-ultradark",
            )}
            key="mes-evaluations-item"
            priority="tertiary no outline"
            {...QUICK_ACCESS_ITEMS_PROPS.myEvaluations}
            linkProps={myEvaluationsLink}
          >
            {QUICK_ACCESS_ITEMS_PROPS.myEvaluations.text}
          </Button>,
          <Button
            key="faq-item"
            className="text-(--text-default-grey)"
            iconId="fr-icon-questionnaire-line"
            nativeButtonProps={{
              "aria-controls": DIALOG_ID,
              "data-fr-opened": false,
            }}
          >
            Questions fréquentes
          </Button>,

          <Menu key="user-menu-item" as="div">
            <MenuButton as={Fragment}>
              {({ active }) => (
                <Button
                  priority={active ? "tertiary" : "tertiary no outline"}
                  iconId="fr-icon-menu-fill"
                  className="text-(--text-default-grey)"
                >
                  Menu
                </Button>
              )}
            </MenuButton>
            <MenuItems anchor="bottom end" transition className={MENU_ITEMS_CLASSES}>
              {QUICK_ACCESS_ITEMS_PROPS.menuItems.map((item) => (
                <MenuItemButton key={item.text} className="text-(--text-default-grey)" {...item}>
                  {item.text}
                </MenuItemButton>
              ))}
            </MenuItems>
          </Menu>,
        ];
      }
      return [
        { ...QUICK_ACCESS_ITEMS_PROPS.myEvaluations, linkProps: myEvaluationsLink },
        ...QUICK_ACCESS_ITEMS_PROPS.menuItems,
      ];
    }

    return [
      {
        iconId: "fr-icon-logout-box-r-line",
        linkProps: routes.accessBenefriches().link,
        text: "Accéder à Bénéfriches",
      },
    ];
  }, [isUserLoggedIn, isLg, myEvaluationsLink, route]);

  return (
    <>
      <Header
        brandTop={
          <>
            RÉPUBLIQUE
            <br />
            FRANÇAISE
          </>
        }
        homeLinkProps={{
          href: homeLinkPropsHref,
          title: "Accueil - Bénéfriches",
        }}
        operatorLogo={{
          alt: "Logo de l'ADEME et de Bénéfriches",
          imgUrl: "/img/logos/logo-ademe-and-benefriches.png",
          orientation: "horizontal",
        }}
        quickAccessItems={quickAccessItems}
        {...props}
      />
      <DsfrA11yDialog dialogId={DIALOG_ID} title="Questions fréquentes" size="large">
        <AboutImpactsContent />
      </DsfrA11yDialog>
    </>
  );
}

export default BenefrichesHeader;
