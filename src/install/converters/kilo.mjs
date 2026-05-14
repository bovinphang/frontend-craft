import { installOpencodeFamily } from "../shared/opencode-family.mjs";

/**
 * @param {import('../types.mjs').InstallContext} ctx
 */
export async function installKilo(ctx) {
  return installOpencodeFamily(ctx);
}
