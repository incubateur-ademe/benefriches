import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { selectSiteSurfaceArea } from "@/features/create-project/core/createProject.selectors";
import { spacesSurfaceAreaCompleted } from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import {
  selectSpacesCategories,
  selectSpacesCategoriesSurfaceDistribution,
} from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import UrbanProjectSpaceCategoriesSurfaceAreaDistributionForm, {
  FormValues,
} from "./SpacesCategoriesSurfaceAreaDistributionForm";

export default function UrbanProjectSpaceCategoriesSurfaceAreaDistributionContainer() {
  const dispatch = useAppDispatch();
  const totalSiteSurfaceArea = useAppSelector(selectSiteSurfaceArea);
  const selectedSpacesCategories = useAppSelector(selectSpacesCategories);
  const initialValues = useAppSelector(selectSpacesCategoriesSurfaceDistribution);

  return (
    <UrbanProjectSpaceCategoriesSurfaceAreaDistributionForm
      initialValues={initialValues.value}
      spacesCategories={selectedSpacesCategories}
      totalSurfaceArea={totalSiteSurfaceArea}
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
      onSubmit={(data: FormValues) => {
        dispatch(spacesSurfaceAreaCompleted({ surfaceAreaDistribution: data }));
      }}
    />
  );
}
