import {
  createInstallSession,
  type InstallSession,
  type FileMutation,
} from "@bovinphang/craft-common";
import type { InstallContext } from "../types.js";
import { PRODUCT_DEFINITION, toProductContext } from "../product-definition.js";
export async function planProductMutations(
  ctx: InstallContext,
  operation: (session: InstallSession) => Promise<void>,
): Promise<FileMutation[]> {
  const session = createInstallSession({
    definition: PRODUCT_DEFINITION,
    context: toProductContext(ctx),
    action: ctx.mode,
  });
  await operation(session);
  return session.finish().mutations;
}
