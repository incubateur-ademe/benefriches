/**
 * Pure-ESM TypeScript loader for the `node:test` runner.
 *
 * This is `nest build` run just-in-time. The `load` hook compiles each `.ts` with
 * SWC using the SAME config the production build uses — `swc.config.json`, imported
 * directly (one SWC-config source of truth) — so two things behave identically to
 * production:
 *   - the `src/*` / `test/*` aliases are resolved by SWC (`jsc.paths`), and
 *   - `emitDecoratorMetadata` is produced (NestJS DI needs it).
 * Node's native `.ts` support only strips type annotations — it does neither — so it
 * cannot run this codebase.
 *
 * The config lives in JSON (not JS): nest's SWC builder reads it as a JSON file and
 * deep-merges it with tsconfig-derived defaults — it can't import a JS module. We
 * name it `swc.config.json` rather than `.swcrc` purely so this loader can `import`
 * it via a JSON import attribute instead of reading + parsing the file by hand
 * (Node refuses `import ... with { type: "json" }` on a `.swcrc` extension).
 *
 * One test-only hop remains, handled by the `resolve` hook. SWC rewrites `src/foo`
 * to a relative `./foo.js` (alias resolved + `.js` appended by `module.resolveFully`,
 * the `.ts`→`.js` build convention). In production that `./foo.js` exists in `dist/`;
 * tests run from un-built source where only `./foo.ts` exists, so the hook makes the
 * final `.js`→`.ts` hop — the standard "run TypeScript ESM from source" bridge (the
 * same thing tsx / ts-node ESM do).
 *
 * It is NOT `@swc-node/register/esm-register` (broken on Node 24, see ADR-0014):
 * that forces imported `.ts` to `commonjs`, causing `ERR_REQUIRE_CYCLE_MODULE` and
 * breaking ESM named imports. This loader emits ESM, so neither applies.
 */
import { transformSync } from "@swc/core";
import { existsSync, readFileSync, statSync } from "node:fs";
import { registerHooks } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import swcConfigJson from "../swc.config.json" with { type: "json" };

// `exclude` keeps spec files out of `nest build`; it is a build-only file filter that
// would make SWC refuse the very spec files the test runner asks us to compile, so
// drop it (rest-sibling destructure) — everything else is shared with the build.
const { exclude: _exclude, ...swcConfig } =
  /** @type {import("@swc/core").Options & { exclude?: string[] }} */ (swcConfigJson);

// test/ sits one level below the package root (apps/api) — the absolute `jsc.baseUrl`
// SWC resolves swc.config.json's `jsc.paths` (`src/*`, `test/*`) against.
const apiDir = dirname(dirname(fileURLToPath(import.meta.url)));

const TS_EXTENSIONS = [".ts", ".tsx", ".mts"];

/** @param {string} filePath @returns {boolean} */
const isFile = (filePath) => existsSync(filePath) && statSync(filePath).isFile();

/**
 * Resolve an imported path to its TypeScript source. SWC (`resolveFully`) emits
 * `.js` specifiers for `.ts` sources, so `./x.js` resolves to `./x.ts`.
 * @param {string} absPath
 * @returns {string | null}
 */
const toTsSource = (absPath) => {
  if (/\.(ts|tsx|mts)$/.test(absPath) && isFile(absPath)) {
    return absPath;
  }
  const base = absPath.replace(/\.(js|mjs|cjs)$/, "");
  for (const ext of TS_EXTENSIONS) {
    if (isFile(base + ext)) return base + ext;
  }
  for (const ext of TS_EXTENSIONS) {
    const indexFile = join(base, `index${ext}`);
    if (isFile(indexFile)) return indexFile;
  }
  return null;
};

registerHooks({
  resolve(specifier, context, nextResolve) {
    // SWC has already resolved the `src/*` / `test/*` aliases to relative `.js`
    // specifiers (`jsc.paths` + `resolveFully`), so only relative specifiers need
    // the `.js`→`.ts` source hop. Bare specifiers (`shared`, `@nestjs/*`, `node:*`)
    // fall through to Node's resolver.
    if (specifier.startsWith("./") || specifier.startsWith("../")) {
      const parentURL = context.parentURL ?? pathToFileURL(join(apiDir, "_")).href;
      const tsFile = toTsSource(fileURLToPath(new URL(specifier, parentURL)));
      if (tsFile) {
        return { url: pathToFileURL(tsFile).href, format: "module", shortCircuit: true };
      }
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.startsWith("file:") && /\.(ts|tsx|mts)(\?|$)/.test(url)) {
      const filename = fileURLToPath(url);
      const { code } = transformSync(readFileSync(filename, "utf8"), {
        ...swcConfig,
        // swc.config.json uses `baseUrl: "."`; passed programmatically the base dir
        // must be absolute.
        jsc: { ...swcConfig.jsc, baseUrl: apiDir },
        filename,
        sourceMaps: "inline",
      });
      return { format: "module", source: code, shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});
