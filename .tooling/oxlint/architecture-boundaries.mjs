/**
 * Generic, config-driven oxlint JS plugin enforcing Clean Architecture import
 * boundaries. Each consuming app passes its own vocabulary as rule options in
 * its `.oxlintrc.json` (see PluginOptions below) — this file has no
 * app-specific knowledge of "web" vs "api".
 *
 * Resolution is done on import specifiers only (relative `./`, `../` and the
 * configured alias prefix). Bare package specifiers (npm packages) are
 * ignored since they can't cross these boundaries.
 */

/**
 * @typedef {Object} Boundary
 * @property {string} from - glob pattern (matched against the src-relative path of the importing file)
 * @property {string} to - glob pattern (matched against the src-relative path the import resolves to)
 *
 * Glob syntax: `*` matches within one path segment, `**` matches across
 * segments (including zero), and `{a,b,c}` is a literal alternation, e.g.
 * `"features/*\/{core,application,domain}/**"`.
 */

/**
 * @typedef {Object} PluginOptions
 * @property {string} aliasPrefix - import alias that maps to the src root, e.g. "@/" (web) or "src/" (api)
 * @property {Boundary[]} boundaries - forbidden from -> to import patterns
 */

/**
 * Escape a literal string for embedding in a `RegExp` source.
 * @param {string} text
 * @returns {string}
 */
function escapeRegExpLiteral(text) {
  return text.replace(/[.+^${}()|[\]\\]/g, "\\$&");
}

/**
 * Compile a glob pattern (`*`, `**`, `{a,b,c}`) into a `RegExp` anchored to
 * fully match a src-relative path.
 * @param {string} glob
 * @returns {RegExp}
 */
function globToRegExp(glob) {
  let pattern = "";
  for (let i = 0; i < glob.length; i++) {
    const char = glob[i];
    if (char === "*") {
      if (glob[i + 1] === "*") {
        pattern += ".*";
        i++;
      } else {
        pattern += "[^/]*";
      }
    } else if (char === "{") {
      const end = glob.indexOf("}", i);
      const alternatives = glob
        .slice(i + 1, end)
        .split(",")
        .map(escapeRegExpLiteral);
      pattern += `(?:${alternatives.join("|")})`;
      i = end;
    } else {
      pattern += escapeRegExpLiteral(char);
    }
  }
  return new RegExp(`^${pattern}$`);
}

/**
 * Drop `.`/`..`/empty segments, resolving a path made of raw (possibly
 * relative) segments down to a plain absolute-style segment list.
 * @param {string[]} segments
 * @returns {string[]}
 */
function normalizeSegments(segments) {
  const result = [];
  for (const segment of segments) {
    if (segment === "" || segment === ".") continue;
    if (segment === "..") {
      result.pop();
      continue;
    }
    result.push(segment);
  }
  return result;
}

/**
 * Resolve an import specifier to the segment list of the file it points to.
 * Returns null for bare package specifiers (can't cross our boundaries).
 * @param {string[]} fromFileSegments - segments of the importing file's path
 * @param {string} source - the raw import specifier, e.g. "../foo" or "@/shared/x"
 * @param {string[]} srcRootSegments - segments of the path up to and including "src"
 * @param {string} aliasPrefix - configured alias prefix, e.g. "@/"
 * @returns {string[] | null}
 */
function resolveImportSegments(fromFileSegments, source, srcRootSegments, aliasPrefix) {
  if (source.startsWith(aliasPrefix)) {
    return normalizeSegments([
      ...srcRootSegments,
      ...source.slice(aliasPrefix.length).split("/"),
    ]);
  }
  if (source.startsWith(".")) {
    const fromDirSegments = fromFileSegments.slice(0, -1);
    return normalizeSegments([...fromDirSegments, ...source.split("/")]);
  }
  return null;
}

/**
 * Strip the `srcRootSegments` prefix off `absoluteSegments`, returning the
 * path as a `/`-joined string relative to `src/`. Returns null if
 * `absoluteSegments` isn't under that root (e.g. an import resolving outside `src/`).
 * @param {string[]} absoluteSegments
 * @param {string[]} srcRootSegments
 * @returns {string | null}
 */
function getSrcRelativePath(absoluteSegments, srcRootSegments) {
  if (srcRootSegments.length > absoluteSegments.length) return null;
  for (let i = 0; i < srcRootSegments.length; i++) {
    if (absoluteSegments[i] !== srcRootSegments[i]) return null;
  }
  return absoluteSegments.slice(srcRootSegments.length).join("/");
}

/**
 * @param {string[]} filenameSegments
 * @returns {string[] | null} segments from the path root up to and including "src"
 */
function findSrcRootSegments(filenameSegments) {
  const index = filenameSegments.lastIndexOf("src");
  if (index === -1) return null;
  return filenameSegments.slice(0, index + 1);
}

const rule = {
  meta: {
    schema: [
      {
        type: "object",
        required: ["aliasPrefix", "boundaries"],
        additionalProperties: false,
        properties: {
          aliasPrefix: { type: "string" },
          boundaries: {
            type: "array",
            items: {
              type: "object",
              required: ["from", "to"],
              additionalProperties: false,
              properties: { from: { type: "string" }, to: { type: "string" } },
            },
          },
        },
      },
    ],
  },
  create(context) {
    /** @type {PluginOptions} */
    const options = context.options[0];
    const boundaries = options.boundaries.map((boundary) => ({
      ...boundary,
      fromRegExp: globToRegExp(boundary.from),
      toRegExp: globToRegExp(boundary.to),
    }));

    const filenameSegments = normalizeSegments(context.filename.split("/"));
    const srcRootSegments = findSrcRootSegments(filenameSegments);
    if (!srcRootSegments) return {};

    const fromPath = getSrcRelativePath(filenameSegments, srcRootSegments);
    if (fromPath === null) return {};

    const matchingBoundaries = boundaries.filter((boundary) => boundary.fromRegExp.test(fromPath));
    if (matchingBoundaries.length === 0) return {};

    /**
     * @param {import("estree").Node} node
     * @param {string} source
     */
    function checkSource(node, source) {
      const toAbsoluteSegments = resolveImportSegments(
        filenameSegments,
        source,
        srcRootSegments,
        options.aliasPrefix,
      );
      if (!toAbsoluteSegments) return;

      const toPath = getSrcRelativePath(toAbsoluteSegments, srcRootSegments);
      if (toPath === null) return;

      const violatedBoundary = matchingBoundaries.find((boundary) => boundary.toRegExp.test(toPath));
      if (violatedBoundary) {
        context.report({
          node,
          message: `"${violatedBoundary.from}" must not import from "${violatedBoundary.to}" (imported "${source}").`,
        });
      }
    }

    return {
      ImportDeclaration(node) {
        checkSource(node, node.source.value);
      },
      ExportNamedDeclaration(node) {
        if (node.source) checkSource(node, node.source.value);
      },
      ExportAllDeclaration(node) {
        checkSource(node, node.source.value);
      },
    };
  },
};

const plugin = {
  meta: { name: "architecture-boundaries" },
  rules: {
    "no-cross-layer-import": rule,
  },
};

export default plugin;
