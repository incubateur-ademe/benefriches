import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosError } from "axios";
import { catchError, map } from "rxjs";
import { PhotovoltaicDataProvider } from "src/location-features/core/gateways/PhotovoltaicDataProvider";

const API_VERSION = "v5_2";
const TOOL_NAME = "PVcalc";

const API_URL = `https://re.jrc.ec.europa.eu/api/${API_VERSION}/${TOOL_NAME}?outputformat=json`;

interface PVGISResult {
  inputs: {
    location: { latitude: string; longitude: string; elevation: string };
    meteo_data: {
      radiation_db: "PVGIS-SARAH2";
      meteo_db: "ERA5";
      year_min: number;
      year_max: number;
      use_horizon: boolean;
      horizon_db: "DEM-calculated";
    };
    mounting_system: {
      fixed: {
        slope: { value: number; optimal: boolean };
        azimuth: { value: number; optimal: boolean };
        type: "free-standing";
      };
    };
    pv_module: {
      technology: "c-Si";
      peak_power: number; // Nominal (peak) power of the PV module kwh
      system_loss: number; // %
    };
  };
  outputs: {
    totals: {
      fixed: {
        E_d: number;
        E_m: number;
        E_y: number; // Average annual energy production from the given system kwh/y
        l_aoi: number; // Angle of incidence loss %
        l_spec: number; // Spectral loss %
        l_tg: number; // Temperature and irradiance loss %
        l_total: number; // Total loss %
      };
    };
  };
}

@Injectable()
export class PhotovoltaicGeoInfoSystemApi implements PhotovoltaicDataProvider {
  constructor(private readonly httpService: HttpService) {}

  getPhotovoltaicPerformance({
    lat,
    long,
    peakPower,
    angle = 35,
    loss = 14,
  }: {
    lat: number;
    long: number;
    peakPower: number;
    angle?: number;
    loss?: number;
  }) {
    return this.httpService
      .get(`${API_URL}&lat=${lat}&lon=${long}&peakpower=${peakPower}&loss=${loss}&angle=${angle}`)
      .pipe(
        map(({ data }: { data: PVGISResult }) => {
          const { outputs, inputs } = data;
          const { totals } = outputs;
          const { location, meteo_data, mounting_system } = inputs;
          return {
            context: {
              location: {
                lat: Number(location.latitude),
                long: Number(location.longitude),
                elevation: Number(location.elevation),
              },
              meteoData: {
                radiationDb: meteo_data.radiation_db,
                meteoDb: meteo_data.meteo_db,
                yearMin: meteo_data.year_min,
                yearMax: meteo_data.year_max,
                useHorizon: meteo_data.use_horizon,
                horizonDb: meteo_data.horizon_db,
              },
              mountingSystem: {
                slope: {
                  value: Number(mounting_system.fixed.slope.value),
                  optimal: Boolean(mounting_system.fixed.slope.optimal),
                },
                azimuth: {
                  value: Number(mounting_system.fixed.azimuth.value),
                  optimal: Boolean(mounting_system.fixed.azimuth.optimal),
                },
                type: inputs.mounting_system.fixed.type,
              },
              pvModule: {
                technology: inputs.pv_module.technology,
                peakPower: Number(inputs.pv_module.peak_power),
                systemLoss: Number(inputs.pv_module.system_loss),
              },
            },
            expectedPerformance: {
              kwhPerDay: Number(totals.fixed.E_d),
              kwhPerMonth: Number(totals.fixed.E_m),
              kwhPerYear: Number(totals.fixed.E_y),
              lossPercents: {
                angleIncidence: Number(totals.fixed.l_aoi),
                spectralIncidence: Number(totals.fixed.l_spec),
                tempAndIrradiance: Number(totals.fixed.l_tg),
                total: Number(totals.fixed.l_total),
              },
            },
          };
        }),
      )
      .pipe(
        catchError((axiosError: AxiosError) => {
          const err = new Error(`Error response from GeoApiGouv API: ${axiosError.message}`);
          if (axiosError.response?.data) {
            err.message.concat(` - ${axiosError.response.data as string}`);
          }
          throw err;
        }),
      );
  }
}
