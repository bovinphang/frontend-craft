import {
  identifyInstallation as identifySharedInstallation,
  relocatePackage as relocateSharedPackage,
  managerQuery as sharedManagerQuery,
  type DetectionOptions as SharedDetectionOptions,
  type CliLifecycleProduct,
  type GlobalInstallation,
  type Installation,
  type PackageManager,
} from "@bovinphang/craft-common";

export {
  findPackageManagers,
  resolveManagerExecutable,
  runProcess,
  type ProcessOptions,
  type ProcessRunner,
  type PackageManager,
  type GlobalInstallation,
  type TemporaryInstallation,
  type Installation,
} from "@bovinphang/craft-common";

export const CLI_PACKAGE = "@bovinphang/frontend-craft";
export const CLI_PRODUCT: CliLifecycleProduct = {
  packageName: CLI_PACKAGE,
  commandName: "fec",
  binName: "fec",
};
export type DetectionOptions = Omit<SharedDetectionOptions, "product">;
export function identifyInstallation(
  pluginRoot: string,
  options: DetectionOptions,
): Promise<Installation> {
  return identifySharedInstallation(pluginRoot, {
    ...options,
    product: CLI_PRODUCT,
  });
}
export function relocatePackage(
  source: GlobalInstallation,
  options: DetectionOptions,
): Promise<string> {
  return relocateSharedPackage(source, { ...options, product: CLI_PRODUCT });
}
export function managerQuery(
  manager: PackageManager,
  args: string[],
  options: DetectionOptions,
): Promise<string> {
  return sharedManagerQuery(manager, args, {
    ...options,
    product: CLI_PRODUCT,
  });
}
