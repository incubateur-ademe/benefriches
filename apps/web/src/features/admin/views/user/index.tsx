import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";

import { adminUserActivityRequested } from "../../core/actions/adminUserActivityRequested.action";
import { selectAdminUserViewData } from "../../core/admin.selectors";
import AdminUserPage from "./AdminUserPage";

type Props = {
  userId: string;
};

function AdminUserPageContainer({ userId }: Props) {
  const dispatch = useAppDispatch();
  const viewData = useAppSelector((state) => selectAdminUserViewData(state, userId));

  useEffect(() => {
    void dispatch(adminUserActivityRequested(userId));
  }, [dispatch, userId]);

  return <AdminUserPage viewData={viewData} />;
}

export default AdminUserPageContainer;
