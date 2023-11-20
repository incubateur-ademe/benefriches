import { z } from "zod";
import { ValueObject } from "src/shared-kernel/valueObject";

export type SurfaceAreaType = number;

export class SurfaceArea extends ValueObject<SurfaceAreaType> {
  static create(value: SurfaceAreaType) {
    return new SurfaceArea(value);
  }

  validate(value: SurfaceAreaType) {
    z.number().min(0).parse(value);
  }

  getInSquareMeters(): SurfaceAreaType {
    return this.value;
  }

  getInHectares(): SurfaceAreaType {
    return this.value / 10000;
  }
}
