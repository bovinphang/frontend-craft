import { installOpencodeFamily } from "../shared/opencode-family.js";
import type { InstallContext } from "../types.js";

/**
 * @param {import('../types.js').InstallContext} ctx
 */
export async function installKilo(ctx: InstallContext): Promise<void> {
  return installOpencodeFamily(ctx);
}
