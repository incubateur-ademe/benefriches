/**
 * Routes every TypeScript module through Node's CommonJS loader so that
 * `--require @swc-node/register` transpiles it — giving us `emitDecoratorMetadata`
 * (required by NestJS DI) and `.swcrc` path-alias rewriting (`src/*`, `test/*`),
 * exactly like the unit-test command does.
 *
 * Why this is needed: the per-test hook must be preloaded via `--import` to keep
 * its `afterEach` correctly ordered after `--test-global-setup` (a `--require`
 * preload that registers hooks makes node:test start before global setup finishes).
 * But the presence of any `--import` preload makes node:test load the `.ts` spec
 * files through the ESM loader, where Node's native type-stripping provides neither
 * decorator metadata nor path-alias resolution. Forcing `format: "commonjs"` for
 * `.ts` URLs sends them back to swc-node, resolving both.
 *
 * Registered with the synchronous in-thread `module.registerHooks()` API. Note: a
 * module that only `export`s `resolve` and is loaded via `--import` does NOT install
 * a hook — `--import` merely executes it; the hook must be registered explicitly.
 */
import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, nextResolve) {
    const resolved = nextResolve(specifier, context);
    if (resolved.url.endsWith(".ts")) {
      return { ...resolved, format: "commonjs" };
    }
    return resolved;
  },
});
