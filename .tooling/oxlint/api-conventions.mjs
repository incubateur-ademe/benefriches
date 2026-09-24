/**
 * oxlint JS plugin enforcing apps/api conventions that used to live as prose in
 * the API instructions. Each message states the convention and why: the lint
 * message is now the only place the convention is written down.
 *
 * Rules:
 * - `no-local-dto-schema`: `*.controller.ts` files must not import zod (no local schemas).
 * - `file-naming`: `core/usecases/` files end with `.usecase.ts`, `core/events/` files end
 *   with `.event.ts`, and an `InMemory*` / `Sql*` class lives in a file of the same name.
 */

const CONTROLLER_FILE = /\.controller\.ts$/;
const TEST_SUFFIX = String.raw`(?:\.spec|\.integration-spec)?`;
const USECASE_FILE = new RegExp(String.raw`\.usecase${TEST_SUFFIX}\.ts$`);
const EVENT_FILE = new RegExp(String.raw`\.event${TEST_SUFFIX}\.ts$`);
const NAMED_ADAPTER_CLASS = /^(?:InMemory|Sql)[A-Z]/;

/**
 * @param {string} source
 * @returns {boolean}
 */
function isZodSource(source) {
  return source === "zod" || source.startsWith("zod/");
}

/**
 * `import type { z } from "zod"` and `import { type z } from "zod"` are erased at
 * build time: they can't build a schema, so they're allowed (e.g. for `z.infer`).
 * @param {import("estree").ImportDeclaration & { importKind?: string }} node
 * @returns {boolean}
 */
function isTypeOnlyImport(node) {
  if (node.importKind === "type") return true;
  return (
    node.specifiers.length > 0 &&
    node.specifiers.every(
      (specifier) => specifier.type === "ImportSpecifier" && specifier.importKind === "type",
    )
  );
}

const noLocalDtoSchema = {
  meta: { type: "problem", schema: [] },
  create(context) {
    if (!CONTROLLER_FILE.test(context.filename)) return {};
    return {
      ImportDeclaration(node) {
        if (!isZodSource(node.source.value) || isTypeOnlyImport(node)) return;
        context.report({
          node,
          message:
            'Controllers must not build Zod schemas. Request/response DTOs live in packages/shared/src/api-dtos/<feature>/<operation>.dto.ts (export the schema and its z.infer type) so the web app uses the exact contract the API validates. Import the schema from "shared" and validate with ZodValidationPipe or createZodDto.',
        });
      },
    };
  },
};

const fileNaming = {
  meta: { type: "suggestion", schema: [] },
  create(context) {
    const filename = context.filename;
    const basename = filename.slice(filename.lastIndexOf("/") + 1);
    const stem = basename.split(".")[0];

    /** @param {{ id: { name: string } | null }} node */
    function checkClassFile(node) {
      const className = node.id?.name;
      if (!className || !NAMED_ADAPTER_CLASS.test(className)) return;
      // NestJS modules follow `<name>.module.ts` (e.g. SqlConnectionModule in sqlConnection.module.ts).
      if (className.endsWith("Module")) return;
      if (className === stem) return;
      context.report({
        node: node.id,
        message: `Class "${className}" must live in "${className}.ts", not "${basename}". InMemory*/Sql* gateway implementations are named after their class so the adapter behind a gateway is found by name, and the repository/query instructions attach to Sql*/InMemory* file names.`,
      });
    }

    return {
      Program(node) {
        if (filename.includes("/core/usecases/") && !USECASE_FILE.test(basename)) {
          context.report({
            node,
            message: `"${basename}" is in core/usecases/, so it must be named <verb><Noun>.usecase.ts (its unit test: <verb><Noun>.usecase.spec.ts). The suffix is how use cases are found and paired with their tests by name and glob.`,
          });
        }
        if (filename.includes("/core/events/") && !EVENT_FILE.test(basename)) {
          context.report({
            node,
            message: `"${basename}" is in core/events/, so it must be named <eventName>.event.ts (past tense, e.g. siteCreated.event.ts). The suffix is how domain events are found and how the domain-events instructions attach to them.`,
          });
        }
      },
      ClassDeclaration: checkClassFile,
    };
  },
};

const plugin = {
  meta: { name: "api-conventions" },
  rules: {
    "no-local-dto-schema": noLocalDtoSchema,
    "file-naming": fileNaming,
  },
};

export default plugin;
