import { npmFrameworkDetector } from "@bovinphang/craft-common";
export const FRONTEND_FRAMEWORK_DETECTORS = [
  npmFrameworkDetector("react", ["react"], ["ui"]),
  npmFrameworkDetector("vue", ["vue"], ["ui"]),
  npmFrameworkDetector("next", ["next"], ["ui"]),
  npmFrameworkDetector("nuxt", ["nuxt"], ["ui"]),
  npmFrameworkDetector("vite", ["vite"], ["ui"]),
  npmFrameworkDetector("angular", ["@angular/core"], ["ui"]),
];
