type Props = { size?: "large" | "middle" | "small" };
const TableSeparatorRow = ({ size = "small" }: Props) => {
  return (
    <tr
      className={(() => {
        switch (size) {
          case "large":
            return "h-6";
          case "middle":
            return "h-4";
          case "small":
            return "h-2";
        }
      })()}
    >
      <td colSpan={5}></td>
    </tr>
  );
};

export default TableSeparatorRow;
