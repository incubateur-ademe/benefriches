import { useAppSelector } from "@/app/hooks/store.hooks";

import NavigationBlockerDialog from "./NavigationBlockerDialog";

export default function NavigationBlockerDialogContainer() {
  const saveState = useAppSelector((state) => state.siteCreation.saveLoadingState);

  return <NavigationBlockerDialog saveState={saveState} />;
}
