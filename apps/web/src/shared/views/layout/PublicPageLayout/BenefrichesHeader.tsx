import Button from "@codegouvfr/react-dsfr/Button";
import type { HeaderProps } from "@codegouvfr/react-dsfr/Header";
import { Header } from "@codegouvfr/react-dsfr/Header";
import { useWindowInnerSize } from "@codegouvfr/react-dsfr/tools/useWindowInnerSize";
import { useBreakpointsValuesPx } from "@codegouvfr/react-dsfr/useBreakpointsValuesPx";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { useMemo } from "react";
import { Fragment } from "react/jsx-runtime";
import type { Link } from "type-route";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { routes, useRoute } from "@/app/router";
import { selectCurrentUserIsAdmin } from "@/shared/core/current-user/currentUser.selectors";

import classNames from "../../clsx";
import MenuItemButton from "../../components/Menu/MenuItemButton";
import AboutImpactsHeaderDialog from "../header/AboutImpactsHeaderDialog";
import {
  buildNavigationHeaderItems,
  CURRENT_HEADER_ITEM_CLASSES,
  FAQ_HEADER_ITEM,
  LOGIN_HEADER_ITEM,
  LOGOUT_HEADER_ITEM,
} from "../header/headerItems";
// oxlint-disable-next-line no-unassigned-import
import "./BenefrichesHeader.css";

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

function BenefrichesHeader({
  homeLinkPropsHref = routes.home().href,
  myEvaluationsLink = routes.myEvaluations().link,
  ...props
}: Partial<HeaderProps> & { myEvaluationsLink?: Link; homeLinkPropsHref?: Link["href"] }) {
  const isUserLoggedIn = useAppSelector(
    (state) => state.currentUser.currentUserState === "authenticated",
  );

  const isAdmin = useAppSelector(selectCurrentUserIsAdmin);

  const { breakpointsValues } = useBreakpointsValuesPx();
  const { windowInnerWidth } = useWindowInnerSize();

  const isLg = windowInnerWidth >= breakpointsValues.lg;

  const route = useRoute();

  const quickAccessItems = useMemo((): HeaderProps["quickAccessItems"] => {
    if (!isUserLoggedIn) {
      return [LOGIN_HEADER_ITEM];
    }

    const navigationItems = buildNavigationHeaderItems({
      isAdmin,
      myEvaluationsLink,
      isMyEvaluationsCurrent: route.link.href === myEvaluationsLink.href,
    });

    if (!isLg) {
      return [
        ...navigationItems.map(({ isCurrent: _isCurrent, ...item }) => item),
        LOGOUT_HEADER_ITEM,
      ];
    }

    const { text: faqText, ...faqButtonProps } = FAQ_HEADER_ITEM;
    const { text: logoutText, ...logoutButtonProps } = LOGOUT_HEADER_ITEM;

    return [
      ...navigationItems.map(({ text, isCurrent, ...buttonProps }) => (
        <Button
          className={classNames(
            "text-(--text-default-grey)",
            isCurrent && CURRENT_HEADER_ITEM_CLASSES,
          )}
          key={text}
          priority="tertiary no outline"
          {...buttonProps}
        >
          {text}
        </Button>
      )),
      <Button key={faqText} className="text-(--text-default-grey)" {...faqButtonProps}>
        {faqText}
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
          <MenuItemButton className="text-(--text-default-grey)" {...logoutButtonProps}>
            {logoutText}
          </MenuItemButton>
        </MenuItems>
      </Menu>,
    ];
  }, [isUserLoggedIn, isAdmin, isLg, myEvaluationsLink, route]);

  return (
    <>
      <Header
        disableDisplay
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
      <AboutImpactsHeaderDialog />
    </>
  );
}

export default BenefrichesHeader;
