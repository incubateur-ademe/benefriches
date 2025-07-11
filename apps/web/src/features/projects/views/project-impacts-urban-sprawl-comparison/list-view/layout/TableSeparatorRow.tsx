type Props = { size?: "large" | "middle" | "small" };
const TableSeparatorRow = ({ size = "small" }: Props) => {
  return (
    <tr
      className={(() => {
        switch (size) {
          case "large":
            return "tw-h-6";
          case "middle":
            return "tw-h-4";
          case "small":
            return "tw-h-2";
        }
      })()}
    >
      <td colSpan={5}></td>
    </tr>
  );
};

export default TableSeparatorRow;
