interface BaseResult {
  readonly _isSuccess: boolean;
}

export interface SuccessResult<TData = void, TIssues = undefined> extends BaseResult {
  readonly _isSuccess: true;
  readonly _data?: TData;
  isSuccess(): this is SuccessResult<TData, TIssues>;
  isFailure(): false;
  getData(): TData;
}

/**
 * Failure result branch - only allows failure operations
 */
export interface FailureResult<TError extends string = string, TIssues = undefined>
  extends BaseResult {
  readonly _isSuccess: false;
  readonly _reason: TError;
  readonly _issues?: TIssues;
  isSuccess(): false;
  isFailure(): this is FailureResult<TError, TIssues>;
  getError(): TError;
  getIssues(): TIssues;
}

/**
 * Result is a discriminated union of success and failure branches.
 * The `isSuccess()` and `isFailure()` type guards narrow to the appropriate branch,
 * making only the correct methods available at compile time.
 *
 * Success results never have issues (always `never`), while failure results can have typed issues.
 */
export type TResult<TData = void, TError extends string = string, TIssues = undefined> =
  | SuccessResult<TData, never>
  | FailureResult<TError, TIssues>;

// Overload 1: When called with data, infer the type from data
export function success<T>(data: T): SuccessResult<T>;
// Overload 2: When called without data, return SuccessResult<void>
export function success(): SuccessResult;
// Implementation
export function success<T>(data?: T): SuccessResult<T> | SuccessResult {
  return {
    _isSuccess: true,
    _data: data,
    isSuccess(this: SuccessResult<T, never>): this is SuccessResult<T, never> {
      return true;
    },
    isFailure(): false {
      return false;
    },
    getData(this: SuccessResult<T, never>): T {
      return this._data as T;
    },
  } as SuccessResult<T> | SuccessResult;
}

/**
 * Creates a failure result with a reason and optional issues.
 * @param reason - The error reason (string literal for type safety)
 * @param issues - Optional issues (e.g., validation errors from Zod)
 */
export function fail<E extends string, I = undefined>(reason: E, issues?: I): FailureResult<E, I> {
  return {
    _isSuccess: false,
    _reason: reason,
    _issues: issues,
    isSuccess(): false {
      return false;
    },
    isFailure(this: FailureResult<E, I>): this is FailureResult<E, I> {
      return true;
    },
    getError(this: FailureResult<E, I>): E {
      return this._reason;
    },
    getIssues(this: FailureResult<E, I>): I {
      return this._issues as I;
    },
  };
}
