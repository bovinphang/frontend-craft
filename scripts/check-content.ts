import { auditContent } from "../src/install/shared/content-audit.js";
import { resolvePluginRoot } from "../src/install/shared/resolve-plugin-root.js";

const issues = auditContent(resolvePluginRoot(import.meta.url));
if (issues.length) {
  console.error(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log("[check-content] source and localized content are valid");
}
