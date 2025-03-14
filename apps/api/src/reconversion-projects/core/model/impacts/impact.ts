type ImpactValueProps = {
  base: number;
  forecast: number;
};
type AnnualizeFn = (value: number) => number;

export class Impact {
  constructor(
    readonly base: number,
    readonly forecast: number,
  ) {}

  get difference() {
    return this.forecast - this.base;
  }

  static create({ base, forecast }: ImpactValueProps) {
    return new Impact(base, forecast);
  }

  static get({ base, forecast }: ImpactValueProps) {
    const impact = Impact.create({ base, forecast });
    return impact.computeTotal();
  }

  computeTotal(annualizeFn?: AnnualizeFn) {
    if (annualizeFn) {
      const base = annualizeFn(this.base);
      const forecast = annualizeFn(this.forecast);

      return {
        base,
        forecast,
        difference: forecast - base,
      };
    }
    return {
      base: this.base,
      forecast: this.forecast,
      difference: this.difference,
    };
  }
}
