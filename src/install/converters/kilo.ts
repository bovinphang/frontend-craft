import { installOpencodeFamily } from "../shared/opencode-family.js";

/**
 * @param {import('../types.js').InstallContext} ctx
 */
export async function installKilo(ctx) {
  return installOpencodeFamily(ctx);
}
