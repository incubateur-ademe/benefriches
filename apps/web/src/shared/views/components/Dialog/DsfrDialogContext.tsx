import { createContext } from "react";

type Context = {
  dialogId: string;
  dialogTitleId: string;
  isOpened: boolean;
};

export const DsfrDialogContext = createContext<Context>({
  dialogId: "",
  dialogTitleId: "",
  isOpened: false,
});
