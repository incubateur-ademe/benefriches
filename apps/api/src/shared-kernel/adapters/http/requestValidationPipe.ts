import { BadRequestException, HttpStatus, StandardSchemaValidationPipe } from "@nestjs/common";

// Validates every route parameter declared with a schema, e.g. `@Body({ schema })`.
// The 400 body keeps the `{ statusCode, message, errors }` shape clients rely on,
// `errors` being the schema issues (each with its `path`).
export const createRequestValidationPipe = (): StandardSchemaValidationPipe =>
  new StandardSchemaValidationPipe({
    exceptionFactory: (issues) =>
      new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Validation failed",
        errors: issues,
      }),
  });
