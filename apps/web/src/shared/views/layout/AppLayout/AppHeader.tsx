import { fr } from "@codegouvfr/react-dsfr";
import type { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import Button from "@codegouvfr/react-dsfr/Button";
import { useWindowInnerSize } from "@codegouvfr/react-dsfr/tools/useWindowInnerSize";
import { useBreakpointsValuesPx } from "@codegouvfr/react-dsfr/useBreakpointsValuesPx";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useMemo } from "react";
import { Fragment } from "react/jsx-runtime";
import type { Link } from "type-route";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { routes } from "@/app/router";
import { selectCurrentUserIsAdmin } from "@/shared/core/current-user/currentUser.selectors";

import classNames from "../../clsx";
import AboutImpactsHeaderDialog from "../header/AboutImpactsHeaderDialog";
import type { HeaderLinkItem } from "../header/headerItems";
import {
  buildNavigationHeaderItems,
  CURRENT_HEADER_ITEM_CLASSES,
  FAQ_HEADER_ITEM,
  LOGIN_HEADER_ITEM,
  LOGOUT_HEADER_ITEM,
} from "../header/headerItems";

function toButtonProps({ iconId, text, linkProps, isCurrent }: HeaderLinkItem): ButtonProps {
  return {
    iconId,
    linkProps,
    children: text,
    className: isCurrent ? CURRENT_HEADER_ITEM_CLASSES : undefined,
  };
}

const LOGIN_BTN = toButtonProps(LOGIN_HEADER_ITEM);
const LOGOUT_BTN = toButtonProps(LOGOUT_HEADER_ITEM);
const ABOUT_DIALOG_BTN: ButtonProps = {
  iconId: FAQ_HEADER_ITEM.iconId,
  nativeButtonProps: FAQ_HEADER_ITEM.nativeButtonProps,
  children: FAQ_HEADER_ITEM.text,
};

export type AppLayoutHeaderProps = {
  myEvaluationsConfig?: { link: Link; isCurrent: boolean };
  homeLinkProps?: Link;
  title?: string;
};

function AppHeader({
  homeLinkProps = routes.home().link,
  myEvaluationsConfig = {
    link: routes.myEvaluations().link,
    isCurrent: false,
  },
  title,
}: AppLayoutHeaderProps) {
  const isUserLoggedIn = useAppSelector(
    (state) => state.currentUser.currentUserState === "authenticated",
  );

  const isAdmin = useAppSelector(selectCurrentUserIsAdmin);

  const { breakpointsValues } = useBreakpointsValuesPx();
  const { windowInnerWidth } = useWindowInnerSize();

  const isLg = windowInnerWidth >= breakpointsValues.lg;

  const menuButtons: ButtonProps[] = useMemo(
    () => [
      ...buildNavigationHeaderItems({
        isAdmin,
        myEvaluationsLink: myEvaluationsConfig.link,
        isMyEvaluationsCurrent: myEvaluationsConfig.isCurrent,
      }).map(toButtonProps),
      ABOUT_DIALOG_BTN,
    ],
    [myEvaluationsConfig, isAdmin],
  );

  return (
    <>
      <header role="banner" className={classNames(fr.cx("fr-header"))}>
        <div className="px-8">
          <div className="flex flex-wrap  items-center justify-between py-6">
            <div className="flex flex-wrap items-center divide-x gap-4">
              <a {...homeLinkProps} className="pr-4">
                <img
                  className="fr-responsive-img max-w-36"
                  src="/img/logos/logo-benefriches-simple.svg"
                  alt="Logo de Bénéfriches"
                />
              </a>
              {title && <h1 className="text-xl">{title}</h1>}
            </div>

            <ul className="flex flex-wrap gap-2 items-center">
              {!isUserLoggedIn ? (
                <li>
                  <Button
                    size="small"
                    priority="tertiary no outline"
                    {...LOGIN_BTN}
                    className={classNames("text-(--text-default-grey)", LOGIN_BTN.className)}
                  />
                </li>
              ) : (
                <>
                  {isLg
                    ? menuButtons.map((menuBtn, index) => (
                        <li key={`menuBtn_lg_${index}`}>
                          <Button
                            size="small"
                            priority="tertiary no outline"
                            {...menuBtn}
                            className={classNames("text-(--text-default-grey)", menuBtn.className)}
                          />
                        </li>
                      ))
                    : null}
                  <li>
                    <Popover className="relative">
                      <PopoverButton as={Fragment}>
                        {({ active }) => (
                          <Button
                            priority={active ? "tertiary" : "tertiary no outline"}
                            iconId="fr-icon-menu-fill"
                            className="text-(--text-default-grey)"
                            size="small"
                          >
                            Menu
                          </Button>
                        )}
                      </PopoverButton>
                      <PopoverPanel
                        anchor="bottom end"
                        className={classNames(
                          "z-800",
                          "md:w-68",
                          "md:h-auto",
                          "w-screen",
                          "h-screen",
                          "mt-2",
                          "rounded-sm",
                          "bg-white dark:bg-dsfr-contrast-grey!",
                          "shadow-sm",
                          "ring-1 ring-black/5",
                          "py-1",
                        )}
                      >
                        {!isLg &&
                          menuButtons?.map((item, index) => (
                            <Button
                              key={`menuBtn_sm_${index}`}
                              priority="tertiary no outline"
                              {...item}
                              className={classNames(
                                "w-full",
                                "font-normal",
                                "py-2",
                                "text-(--text-default-grey)",
                                item.className,
                              )}
                            />
                          ))}
                        <Button
                          size={isLg ? "small" : "medium"}
                          priority="tertiary no outline"
                          {...LOGOUT_BTN}
                          className={classNames(
                            "w-full",
                            "font-normal",
                            "py-2",
                            "text-(--text-default-grey)",
                            LOGOUT_BTN.className,
                          )}
                        />
                      </PopoverPanel>
                    </Popover>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </header>
      <AboutImpactsHeaderDialog />
    </>
  );
}

export default AppHeader;
