import { useAppSelector } from "@/app/hooks/store.hooks";
import { siteCreationLens } from "@/features/create-site/core/siteForm.lens";

import NavigationBlockerDialog from "./NavigationBlockerDialog";

// `saveLoadingState` lives on the shared root `SiteCreationState` (not nested under
// custom/urbanZone/demo), and this container is rendered from both the custom-flow and
// urban-zone-flow branches of SiteCreationWizard — so it reads through `siteCreationLens`
// directly rather than through either flow's form-context hook, which would tie it to one
// flow's provider tree.
export default function NavigationBlockerDialogContainer() {
  const saveState = useAppSelector(
    (state) => siteCreationLens.selectSiteForm(state).saveLoadingState,
  );

  return <NavigationBlockerDialog saveState={saveState} />;
}
