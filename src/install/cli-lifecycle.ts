import {
  createCliLifecycle as createSharedCliLifecycle,
  type LifecycleDependencies as SharedLifecycleDependencies,
  type CliLifecycleContext,
} from "@bovinphang/craft-common";
import { CLI_PRODUCT } from "./package-manager.js";

export type { CliLifecycleContext };
export interface LifecycleDependencies extends SharedLifecycleDependencies {
  fail?: () => void;
}
export function createCliLifecycle(dependencies: LifecycleDependencies = {}) {
  const run = createSharedCliLifecycle(CLI_PRODUCT, dependencies);
  return async (
    command: "update" | "uninstall",
    argv: string[],
    context: CliLifecycleContext,
  ): Promise<void> => {
    const code = await run(command, argv, context);
    if (code !== 0) {
      if (dependencies.fail) dependencies.fail();
      else process.exitCode = 1;
    }
  };
}
export const runCliLifecycle = createCliLifecycle();
