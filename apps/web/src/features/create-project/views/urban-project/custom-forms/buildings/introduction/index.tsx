import {
  buildingsIntroductionCompleted,
  buildingsIntroductionReverted,
} from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { selectBuildingsFootprintSurfaceArea } from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import BuildingsIntroduction from "./BuildingsIntroduction";

export default function BuildingsIntroductionContainer() {
  const dispatch = useAppDispatch();
  const buildingsFootprintSurfaceArea = useAppSelector(selectBuildingsFootprintSurfaceArea);

  return (
    <BuildingsIntroduction
      onNext={() => dispatch(buildingsIntroductionCompleted())}
      onBack={() => dispatch(buildingsIntroductionReverted())}
      buildingsFootprintSurfaceArea={buildingsFootprintSurfaceArea}
    />
  );
}
