import { fr } from "@codegouvfr/react-dsfr";
import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import { useWindowInnerSize } from "@codegouvfr/react-dsfr/tools/useWindowInnerSize";
import { useBreakpointsValuesPx } from "@codegouvfr/react-dsfr/useBreakpointsValuesPx";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useMemo } from "react";
import { Fragment } from "react/jsx-runtime";
import { Link } from "type-route";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { routes } from "@/app/router";
import AboutImpactsContent from "@/features/projects/views/shared/impacts/AboutImpactsContent";

import classNames from "../../clsx";
import DsfrA11yDialog from "../../components/Dialog/DsfrA11yDialog";

const LOGIN_BTN: ButtonProps = {
  iconId: "fr-icon-logout-box-r-line",
  linkProps: routes.accessBenefriches().link,
  children: "Accéder à Bénéfriches",
};

const LOGOUT_BTN: ButtonProps = {
  iconId: "fr-icon-logout-box-r-line",
  children: "Se déconnecter",
  linkProps: { href: "/api/auth/logout" },
};

const DIALOG_ID = "fr-dialog-about-impacts-header";
const ABOUT_DIALOG_BTN: ButtonProps = {
  iconId: "fr-icon-questionnaire-line",
  children: "Questions fréquentes",
  nativeButtonProps: {
    "aria-controls": DIALOG_ID,
    "data-fr-opened": false,
  },
};

export type AppLayoutHeaderProps = {
  myEvaluationsConfig?: { link: Link; isCurrent: boolean };
  homeLinkProps?: Link;
  title?: string;
};

function BenefrichesHeader({
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

  const { breakpointsValues } = useBreakpointsValuesPx();
  const { windowInnerWidth } = useWindowInnerSize();

  const isLg = windowInnerWidth >= breakpointsValues.lg;

  const menuButtons: ButtonProps[] = useMemo(() => {
    return [
      {
        iconId: "fr-icon-bar-chart-box-line",
        children: "Mes évaluations",
        linkProps: myEvaluationsConfig.link,
        className: myEvaluationsConfig.isCurrent
          ? "bg-blue-ultralight text-blue-ultradark"
          : undefined,
      },
      ABOUT_DIALOG_BTN,
    ];
  }, [myEvaluationsConfig]);

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
      <DsfrA11yDialog dialogId={DIALOG_ID} title="Questions fréquentes" size="large">
        <AboutImpactsContent />
      </DsfrA11yDialog>
    </>
  );
}

export default BenefrichesHeader;
