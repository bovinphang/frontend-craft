#!/usr/bin/env node
import { parseArgs, printOrWrite } from "./studio-core.mjs";
import { scanModules } from "./scan-js-modules.mjs";

const args = parseArgs(process.argv.slice(2));
const graph = scanModules(args._[0] ?? ".", [".ts", ".tsx", ".mts", ".cts", ".js", ".jsx", ".mjs", ".cjs"]);
printOrWrite(`${JSON.stringify(graph, null, 2)}\n`, args.output);
