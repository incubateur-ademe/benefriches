import { selectCurrentUserId } from "../users/application/user.reducer";
import CreateUserForm from "../users/views/CreateUserForm";
import OnBoardingPage from "./OnboardingPage";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";

function OnboardingPage() {
  const currentUserId = useAppSelector(selectCurrentUserId);

  if (!currentUserId) {
    return <CreateUserForm />;
  }
  return <OnBoardingPage />;
}

export default OnboardingPage;
