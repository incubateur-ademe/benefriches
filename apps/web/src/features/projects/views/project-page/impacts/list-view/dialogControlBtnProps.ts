export const getDialogControlButtonProps = (dialogId: string) => {
  return {
    "data-fr-opened": false,
    "aria-controls": dialogId,
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
    },
  };
};
