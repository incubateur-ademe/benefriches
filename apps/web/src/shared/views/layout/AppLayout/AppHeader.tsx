import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { useWindowInnerSize } from "@codegouvfr/react-dsfr/tools/useWindowInnerSize";
import { useBreakpointsValuesPx } from "@codegouvfr/react-dsfr/useBreakpointsValuesPx";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import type { Link } from "type-route";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { routes } from "@/app/router";
import { selectCurrentUserIsAdmin } from "@/shared/core/current-user/currentUser.selectors";

import classNames from "../../clsx";
import AboutImpactsHeaderDialog from "../header/AboutImpactsHeaderDialog";
import {
  buildLoggedInHeaderItems,
  LOGIN_HEADER_ITEM,
  toHeaderButtonProps,
} from "../header/headerItems";

const LOGIN_BTN = toHeaderButtonProps(LOGIN_HEADER_ITEM);

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

  const { inlineItems, menuItems } = buildLoggedInHeaderItems({
    isAdmin,
    myEvaluationsLink: myEvaluationsConfig.link,
    isMyEvaluationsCurrent: myEvaluationsConfig.isCurrent,
    isLargeScreen: isLg,
  });

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
                  {inlineItems.map((item) => {
                    const { className, ...buttonProps } = toHeaderButtonProps(item);
                    return (
                      <li key={item.text}>
                        <Button
                          size="small"
                          priority="tertiary no outline"
                          {...buttonProps}
                          className={classNames("text-(--text-default-grey)", className)}
                        />
                      </li>
                    );
                  })}
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
                        {menuItems.map((item) => {
                          const { className, ...buttonProps } = toHeaderButtonProps(item);
                          return (
                            <Button
                              key={item.text}
                              size={isLg ? "small" : "medium"}
                              priority="tertiary no outline"
                              {...buttonProps}
                              className={classNames(
                                "w-full",
                                "font-normal",
                                "py-2",
                                "text-(--text-default-grey)",
                                className,
                              )}
                            />
                          );
                        })}
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
