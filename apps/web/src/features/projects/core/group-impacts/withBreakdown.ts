export function withBreakdown<T extends { total: number }>(item: T, base: number) {
  return {
    ...item,
    breakdown: { base, forecast: item.total + base },
  };
}
