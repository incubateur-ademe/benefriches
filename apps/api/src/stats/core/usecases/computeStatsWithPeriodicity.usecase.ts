import { GetPeriodicityStatsRequestDto, GetPeriodicityStatsResponseDto } from "shared";

import { success, TResult } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

const formatDateFr = (date: Date): string =>
  date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });

const STAT_DESCRIPTION = "Nombre de projet évalués";

const getDescription = (
  periodicity: GetPeriodicityStatsRequestDto["periodicity"],
  startDate: Date,
): string => {
  switch (periodicity) {
    case "day":
      return `${STAT_DESCRIPTION} par jour depuis le ${formatDateFr(startDate)}`;
    case "month":
      return `${STAT_DESCRIPTION} par mois depuis le ${formatDateFr(startDate)}`;
    case "week":
      return `${STAT_DESCRIPTION} par semaine depuis le ${formatDateFr(startDate)}`;
    case "year":
      return `${STAT_DESCRIPTION} par an depuis le ${formatDateFr(startDate)}`;
  }
};

interface ReconversionProjectByPeriodicityQuery {
  getReconversionProjectByPeriodicity(props: GetPeriodicityStatsRequestDto): Promise<{
    startDate: Date;
    stats: GetPeriodicityStatsResponseDto["stats"];
  }>;
}

export class ComputeStatsWithPeriodicityUseCase implements UseCase<
  GetPeriodicityStatsRequestDto,
  TResult<GetPeriodicityStatsResponseDto>
> {
  private readonly periodicityStatsQuery: ReconversionProjectByPeriodicityQuery;

  constructor(periodicityStatsQuery: ReconversionProjectByPeriodicityQuery) {
    this.periodicityStatsQuery = periodicityStatsQuery;
  }

  async execute(
    request: GetPeriodicityStatsRequestDto,
  ): Promise<TResult<GetPeriodicityStatsResponseDto>> {
    const { startDate, stats } =
      await this.periodicityStatsQuery.getReconversionProjectByPeriodicity(request);

    return success({
      description: getDescription(request.periodicity, startDate),
      stats,
    });
  }
}
