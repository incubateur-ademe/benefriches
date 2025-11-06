import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import { routes, useRoute } from "@/shared/views/router";

import CreateUserFormContainer from "./CreateUserForm";

function OnBoardingIdentityPage() {
  const currentRoute = useRoute();

  const redirectToFromUrl =
    currentRoute.name === routes.onBoardingIdentity.name && currentRoute.params.redirectTo
      ? currentRoute.params.redirectTo
      : undefined;
  return (
    <>
      <HtmlTitle>Identité - Introduction</HtmlTitle>
      <CreateUserFormContainer
        onSuccess={() => {
          if (redirectToFromUrl) {
            window.location.href = redirectToFromUrl;
          } else {
            routes.onBoardingWhenToUse({ fonctionnalite: "evaluation-impacts" }).push();
          }
        }}
      />
    </>
  );
}

export default OnBoardingIdentityPage;
