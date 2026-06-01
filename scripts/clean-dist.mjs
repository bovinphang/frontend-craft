import fs from "node:fs";

if (process.env.FRONTEND_CRAFT_SKIP_CLEAN === "1") {
  process.exit(0);
}

fs.rmSync("dist", { recursive: true, force: true });
