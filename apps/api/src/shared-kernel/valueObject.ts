export abstract class ValueObject<T> {
  protected readonly value: T;

  protected constructor(value: T) {
    this.validate(value);
    this.value = Object.freeze(value);
  }

  protected abstract validate(value: T): void;
}
