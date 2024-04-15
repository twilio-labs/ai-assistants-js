const esbuild = require("esbuild");
const { nodeExternalsPlugin } = require("esbuild-node-externals");
const { argv, cwd } = require("node:process");
const { join } = require("node:path");

let [_nodeFilePath, _program, ...entryPoints] = argv;

let generateUmd = false;
if (entryPoints.includes("--umd")) {
  generateUmd = true;
  entryPoints = entryPoints
    .map((x) => (x === "--umd" ? undefined : x))
    .filter((x) => !!x);
}

function buildOne(mode, fileName, overrideOptions = {}) {
  return esbuild.build({
    color: true,
    entryPoints: entryPoints,
    outfile: join(cwd(), "dist", fileName),
    bundle: true,
    minifyIdentifiers: false,
    minifySyntax: true,
    minifyWhitespace: true,
    treeShaking: true,
    platform: "browser",
    format: mode,
    /**
     * From docs:
     * The main fields setting is set to main,module. This means tree shaking
     * will likely not happen for packages that provide both module and main
     * since tree shaking works with ECMAScript modules but not with CommonJS
     * modules.
     * Unfortunately some packages incorrectly treat module as meaning
     * "browser code" instead of "ECMAScript module code" so this default
     * behavior is required for compatibility. You can manually configure the
     * main fields setting to module,main if you want to enable tree shaking
     * and know it is safe to do so.
     */
    mainFields: ["module", "main", "browser"],
    target: ["chrome100", "firefox100", "safari14", "edge100", "node18.16.0"],
    external: ["react", "react-dom", "@twilio/conversations"],
    ...overrideOptions,
  });
}

async function build() {
  await buildOne("esm", "index.mjs");
  await buildOne("cjs", "index.js");
  if (generateUmd) {
    await buildOne("iife", "ai-assistants.bundled.js", {
      external: undefined,
      globalName: "Twilio.Alpha.AiAssistants",
      target: ["chrome100", "firefox100", "safari14", "edge100"],
    });
  }
}

build().catch(console.error);
