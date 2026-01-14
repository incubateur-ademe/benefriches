import { ReactNode } from "react";

import DsfrDialogContent from "./DsfrDialogContent";
import DsfrDialogHeader from "./DsfrDialogHeader";
import DsfrDialogTitle from "./DsfrDialogTitle";
import DsfrDialogWrapper from "./DsfrDialogWrapper";

type Props = {
  dialogId: string;
  title: ReactNode;
  children: ReactNode;
  size?: "small" | "medium" | "large";
};
const DsfrA11yDialog = ({ dialogId, title, children, size = "medium" }: Props) => {
  return (
    <DsfrDialogWrapper size={size} dialogId={dialogId}>
      <DsfrDialogHeader />
      <DsfrDialogContent>
        <DsfrDialogTitle>{title}</DsfrDialogTitle>
        {children}
      </DsfrDialogContent>
    </DsfrDialogWrapper>
  );
};

export default DsfrA11yDialog;
