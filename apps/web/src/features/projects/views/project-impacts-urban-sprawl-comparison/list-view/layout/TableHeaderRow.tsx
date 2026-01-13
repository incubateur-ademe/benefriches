import { SiteNature } from "shared";

import { getPictogramUrlForSiteNature } from "@/shared/views/siteNature";

type Props = { baseCaseSiteNature: SiteNature; comparisonCaseSiteNature: SiteNature };

const getTextForSiteNature = (siteNature: SiteNature) => {
  switch (siteNature) {
    case "FRICHE":
      return "friche";
    case "AGRICULTURAL_OPERATION":
      return "exploitation agricole";
    case "NATURAL_AREA":
      return "espace de nature";
  }
};

const TableHeaderRow = ({ baseCaseSiteNature, comparisonCaseSiteNature }: Props) => {
  return (
    <tr>
      <td colSpan={3} className="p-2"></td>
      <th scope="col" className="p-2 text-left bg-[#F6F1E1] text-[#806922] align-top">
        <img
          src={getPictogramUrlForSiteNature(baseCaseSiteNature)}
          aria-hidden={true}
          alt=""
          width="32"
          height="32"
        />{" "}
        <span className="flex flex-col line-clamp-3">
          <span
            className="line-clamp-2"
            title={`Projet sur ${getTextForSiteNature(baseCaseSiteNature)}`}
          >
            Projet sur {getTextForSiteNature(baseCaseSiteNature)}
          </span>
          <span className="text-sm  font-normal">
            et statu quo sur {getTextForSiteNature(comparisonCaseSiteNature)}
          </span>
        </span>
      </th>
      <th scope="col" className="p-2 text-left bg-[#F6E1F1] text-[#7F236B] align-top">
        <img
          src={getPictogramUrlForSiteNature(comparisonCaseSiteNature)}
          aria-hidden={true}
          alt=""
          width="32"
          height="32"
        />
        <span className="flex flex-col justify-around">
          <span
            className="line-clamp-2"
            title={`Projet sur ${getTextForSiteNature(comparisonCaseSiteNature)}`}
          >
            Projet sur {getTextForSiteNature(comparisonCaseSiteNature)}
          </span>
          <span className="text-sm font-normal">
            et statu quo sur {getTextForSiteNature(baseCaseSiteNature)}
          </span>
        </span>
      </th>
    </tr>
  );
};

export default TableHeaderRow;
