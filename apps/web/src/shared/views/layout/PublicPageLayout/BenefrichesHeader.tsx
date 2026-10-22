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
  buildLoggedInHeaderItems,
  LOGIN_HEADER_ITEM,
  toHeaderButtonProps,
  toHeaderQuickAccessItem,
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
      return [toHeaderQuickAccessItem(LOGIN_HEADER_ITEM)];
    }

    const { inlineItems, menuItems } = buildLoggedInHeaderItems({
      isAdmin,
      myEvaluationsLink,
      isMyEvaluationsCurrent: route.link.href === myEvaluationsLink.href,
      isLargeScreen: isLg,
    });

    if (!isLg) {
      // DSFR lists quick access items in its own mobile menu
      return menuItems.map(toHeaderQuickAccessItem);
    }

    return [
      ...inlineItems.map((item) => {
        const { className, ...buttonProps } = toHeaderButtonProps(item);
        return (
          <Button
            key={item.text}
            className={classNames("text-(--text-default-grey)", className)}
            priority="tertiary no outline"
            {...buttonProps}
          />
        );
      }),

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
          {menuItems.map((item) => {
            const { className, ...buttonProps } = toHeaderButtonProps(item);
            return (
              <MenuItemButton
                key={item.text}
                className={classNames("text-(--text-default-grey)", className)}
                {...buttonProps}
              />
            );
          })}
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
