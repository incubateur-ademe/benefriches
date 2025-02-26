import { FricheGenerator, AgriculturalOrNaturalSiteSiteGenerator } from "shared";

import { CreateSiteGatewayPayload } from "./actions/siteSaved.actions";
import { Address, SiteExpressDraft } from "./siteFoncier.types";

const FRANCE_AVERAGE_CITY_POPULATION = 1800;

const getExpressSiteData = (
  expressSiteProps: SiteExpressDraft,
  currentUserId: string,
): CreateSiteGatewayPayload => {
  const population = expressSiteProps.address.population || FRANCE_AVERAGE_CITY_POPULATION;

  const address: Address = {
    banId: expressSiteProps.address.banId,
    value: expressSiteProps.address.value,
    city: expressSiteProps.address.city,
    cityCode: expressSiteProps.address.cityCode,
    postCode: expressSiteProps.address.postCode,
    long: expressSiteProps.address.long,
    lat: expressSiteProps.address.lat,
  };

  const site = expressSiteProps.isFriche
    ? new FricheGenerator().fromSurfaceAreaAndCity(expressSiteProps.surfaceArea, {
        cityCode: address.cityCode,
        name: address.city,
        population,
      })
    : new AgriculturalOrNaturalSiteSiteGenerator().fromSurfaceAreaAndCity(
        expressSiteProps.surfaceArea,
        {
          cityCode: address.cityCode,
          name: address.city,
          population,
        },
      );

  return {
    ...site,
    soilsDistribution: site.soilsDistribution.toJSON(),
    id: expressSiteProps.id,
    address,
    createdBy: currentUserId,
    creationMode: "express",
  };
};

export default getExpressSiteData;
