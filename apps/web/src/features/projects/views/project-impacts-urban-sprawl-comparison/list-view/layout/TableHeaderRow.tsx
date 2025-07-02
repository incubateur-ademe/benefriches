type Props = { baseCaseSiteName: string; comparisonCaseSiteName: string };

const TableHeaderRow = ({ baseCaseSiteName, comparisonCaseSiteName }: Props) => {
  return (
    <tr>
      <th scope="col" className="tw-p-2 tw-w-8"></th>
      <th scope="col" className="tw-p-2"></th>
      <th scope="col" className="tw-p-2"></th>
      <th scope="col" className="tw-p-2 tw-text-center tw-bg-[#F6F1E1] tw-text-[#806922]">
        <span className="tw-line-clamp-1" title={baseCaseSiteName}>
          {baseCaseSiteName}
        </span>
      </th>
      <th scope="col" className="tw-p-2 tw-text-center tw-bg-[#F6E1F1] tw-text-[#7F236B]">
        <span className="tw-line-clamp-1" title={comparisonCaseSiteName}>
          {comparisonCaseSiteName}
        </span>
      </th>
    </tr>
  );
};

export default TableHeaderRow;
