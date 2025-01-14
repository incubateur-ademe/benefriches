import {
  PhotovoltaicPerformanceApiPayload,
  PhotovoltaicPerformanceApiResult,
  PhotovoltaicPerformanceGateway,
} from "@/features/create-project/core/renewable-energy/actions/getPhotovoltaicExpectedPerformance.action";
import { objectToQueryParams } from "@/shared/services/object-query-parameters/objectToQueryParameters";

export class ExpectedPhotovoltaicPerformanceApi implements PhotovoltaicPerformanceGateway {
  async getExpectedPhotovoltaicPerformance({
    lat,
    long,
    peakPower,
  }: PhotovoltaicPerformanceApiPayload) {
    const queryString = objectToQueryParams({ lat, long, peakPower });
    const response = await fetch(`/api/location-features/pv-expected-performance?${queryString}`);

    if (!response.ok) throw new Error("Error while getting expected PV performance");

    const jsonResponse = (await response.json()) as PhotovoltaicPerformanceApiResult;
    return jsonResponse;
  }
}
