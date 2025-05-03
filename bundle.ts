import * as esbuild from "https://deno.land/x/esbuild@v0.25.3/mod.js";
import { denoPlugins } from "jsr:@duesabati/esbuild-deno-plugin";

async function bundle() {
  try {
    const importMapURL = new URL("./deno.json", import.meta.url);

    await esbuild.build({
      entryPoints: ["./src/mod.ts"],
      bundle: true,
      outfile: "./dist/bundle.js",
      platform: "browser",
      format: "esm",
      sourcemap: true,
      minify: true,
      plugins: denoPlugins({
        importMapURL: importMapURL.href,
      }),
    });
    console.log("\n\nBundling complete: created dist/bundle.js");
  } catch (error) {
    console.error("\n\nBundling failed:", error);
  } finally {
    await esbuild.stop();
  }
}

bundle();
