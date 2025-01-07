import { selectSiteSurfaceArea } from "@/features/create-project/application/createProject.selectors";
import {
  spacesSurfaceAreaCompleted,
  spacesSurfaceAreaReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import {
  selectSpacesCategories,
  selectSpacesCategoriesSurfaceDistribution,
} from "@/features/create-project/application/urban-project/urbanProject.selectors";
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
        dispatch(spacesSurfaceAreaReverted());
      }}
      onSubmit={(data: FormValues) => {
        dispatch(spacesSurfaceAreaCompleted({ surfaceAreaDistribution: data }));
      }}
    />
  );
}
