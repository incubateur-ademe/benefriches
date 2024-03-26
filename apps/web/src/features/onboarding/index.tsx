import { useEffect } from "react";
import { selectIsCurrentUserIdentitySaved } from "../users/application/user.reducer";
import IdentityForm from "../users/views/IdentityForm/";

import { routes } from "@/app/views/router";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

function OnboardingPage() {
  const isIdentityAlreadySaved = useAppSelector(selectIsCurrentUserIdentitySaved);

  useEffect(() => {
    if (isIdentityAlreadySaved) {
      routes.createSiteFoncierIntro().push();
    }
  }, [isIdentityAlreadySaved]);

  return <IdentityForm />;
}

export default OnboardingPage;
