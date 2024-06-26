import { useEffect } from "react";
import { selectCurrentUserId } from "../users/application/user.reducer";
import CreateUserForm from "../users/views/CreateUserForm";

import { routes } from "@/app/views/router";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

function OnboardingPage() {
  const currentUserId = useAppSelector(selectCurrentUserId);

  useEffect(() => {
    if (currentUserId) {
      routes.createSiteFoncierIntro().push();
    }
  }, [currentUserId]);

  return <CreateUserForm />;
}

export default OnboardingPage;
