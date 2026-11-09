import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { parseFrontmatter } from "../../src/install/shared/frontmatter.js";
const root = path.resolve(import.meta.dirname, "../..");
const targets: ReadonlyArray<readonly [string, readonly string[]]> = [
  ["fec-react-project-standard", ["effect-cleanup", "stale-results"]],
  ["fec-vue3-project-standard", ["watcher-cleanup", "stale-results"]],
  ["fec-api-integration", ["retry-safety", "consumer-contract"]],
  ["fec-data-fetching", ["mutation-retry", "query-order"]],
  ["fec-code-review", ["evidence-severity", "review-scope"]],
  ["fec-testing-strategy", ["risk-layer", "real-boundary"]],
  ["fec-security-review", ["input-trust", "secret-boundary"]],
  ["fec-dependency-upgrade", ["compatibility", "artifact-consumer"]],
];
interface Card {
  id: string;
  level: string;
  sourceIds: string[];
  caseIds: string[];
  evidence: string;
}
test("API guidance gates retries on intent and bounded idempotency", () => {
  for (const prefix of ["", "localized/zh-CN/"]) {
    const raw = fs.readFileSync(
      path.join(root, prefix, "skills/fec-api-integration/SKILL.md"),
      "utf8",
    );
    assert.doesNotMatch(
      raw,
      /429\/5xx\/Network Error: Allow backoff|429\/5xx\/网络错误：允许退避/,
    );
  }
});
test("eight frontend adaptations retain bilingual local contracts and resolvable source identities", () => {
  for (const [id, topics] of targets) {
    const languages: Card[][] = [];
    for (const prefix of ["", "localized/zh-CN/"]) {
      const file = path.join(
        root,
        prefix,
        "skills",
        id,
        "references/engineering-practices.md",
      );
      assert.ok(fs.existsSync(file), "missing frontend local decisions: " + id);
      const raw = fs.readFileSync(file, "utf8"),
        parsed = parseFrontmatter(raw, file),
        cards = parsed.fields.practiceCards as Card[];
      assert.ok(Array.isArray(cards));
      assert.deepEqual(
        cards.map((card) => card.id),
        topics.map((topic) => id + ":" + topic),
      );
      const sources = new Set(
        (
          JSON.parse(
            fs.readFileSync(
              path.join(
                root,
                prefix,
                "skills",
                id,
                "references/common/engineering-practices.sources.json",
              ),
              "utf8",
            ),
          ).sources as Array<{ id: string }>
        ).map((source) => source.id),
      );
      for (const card of cards) {
        assert.ok(
          ["required", "recommended", "conditional"].includes(card.level),
        );
        assert.ok(
          card.sourceIds.length &&
            card.sourceIds.every((source) => sources.has(source)),
        );
        assert.ok(card.caseIds.length);
        assert.ok(["case", "review-only", "not-run"].includes(card.evidence));
        assert.ok(raw.includes(`<a id="${card.id}"></a>`));
      }
      languages.push(cards);
    }
    assert.deepEqual(languages[0], languages[1]);
  }
});
