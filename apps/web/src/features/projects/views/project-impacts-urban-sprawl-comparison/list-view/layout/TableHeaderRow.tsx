type Props = { baseCaseSiteName: string; comparisonCaseSiteName: string };

const TableHeaderRow = ({ baseCaseSiteName, comparisonCaseSiteName }: Props) => {
  return (
    <tr>
      <td colSpan={3} className="p-2"></td>
      <th scope="col" className="p-2 text-center bg-[#F6F1E1] text-[#806922]">
        <span className="line-clamp-1" title={baseCaseSiteName}>
          {baseCaseSiteName}
        </span>
      </th>
      <th scope="col" className="p-2 text-center bg-[#F6E1F1] text-[#7F236B]">
        <span className="line-clamp-1" title={comparisonCaseSiteName}>
          {comparisonCaseSiteName}
        </span>
      </th>
    </tr>
  );
};

export default TableHeaderRow;
