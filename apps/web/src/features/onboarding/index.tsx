import { useEffect } from "react";

import { routes } from "@/app/views/router";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import { selectCurrentUserId } from "../users/application/user.reducer";
import CreateUserForm from "../users/views/CreateUserForm";

function OnboardingPage() {
  const currentUserId = useAppSelector(selectCurrentUserId);

  useEffect(() => {
    if (currentUserId) {
      routes.createSiteFoncier().push();
    }
  }, [currentUserId]);

  return <CreateUserForm />;
}

export default OnboardingPage;
