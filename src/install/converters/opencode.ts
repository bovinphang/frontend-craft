import { installOpencodeFamily } from "../shared/opencode-family.js";

/**
 * @param {import('../types.js').InstallContext} ctx
 */
export async function installOpencode(ctx) {
  return installOpencodeFamily(ctx);
}
