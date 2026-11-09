import type { SnapshotDeclarations } from "@bovinphang/craft-common";
const ENGINEERING_TARGETS = ["fec-react-project-standard","fec-vue3-project-standard","fec-api-integration","fec-data-fetching","fec-code-review","fec-testing-strategy","fec-security-review","fec-dependency-upgrade"] as const;
export const SNAPSHOT_DECLARATIONS: SnapshotDeclarations = {
  domainMethods: [
    ...ENGINEERING_TARGETS.map(id => ({target:`skills/${id}/references/common/engineering-practices.md`,method:"engineering-practices" as const})),
    {
      target: "skills/fec-doc-sync/references/common/doc-sync.md",
      method: "doc-sync",
    },
    {
      target: "skills/fec-debug-framework/references/common/debug.md",
      method: "debug",
    },
    {
      target: "skills/fec-refactoring/references/common/refactoring.md",
      method: "refactoring",
    },
    {
      target: "skills/fec-tdd-workflow/references/common/tdd.md",
      method: "tdd",
    },
    {
      target:
        "templates/shared/rules/references/common/source-driven-development.md",
      method: "source-driven-development",
    },
  ],
  extraResources: [
    ...ENGINEERING_TARGETS.flatMap(id => ["sources","rules"].map(kind => ({source:`methods/engineering-practices.${kind}.json`,target:`skills/${id}/references/common/engineering-practices.${kind}.json`}))),
    {
      source: "skills/cc-technical-diagrams/scripts/png-qa.mjs",
      target: "skills/fec-image-generation/scripts/png-qa.mjs",
    },
    {
      source: "skills/cc-technical-diagrams/scripts/diagram-layout.mjs",
      target: "skills/fec-image-generation/scripts/diagram-layout.mjs",
    },
    {
      source: "skills/cc-technical-diagrams/references/png-qa-autofix.md",
      target: "skills/fec-image-generation/references/png-qa-autofix.md",
    },
  ],
  retiredIds: {
    "fec-typescript-project-standard": "cc-typescript-project-standard",
    "fec-drawio-studio": "cc-drawio-studio",
    "fec-source-driven-development": "cc-source-driven-development",
  },
};
