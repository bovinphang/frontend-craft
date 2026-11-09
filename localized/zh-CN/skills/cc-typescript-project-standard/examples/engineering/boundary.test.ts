import test from "node:test";
import assert from "node:assert/strict";
import { acceptAmount } from "./input.ts";

test("EP-TS-01 rejects invalid input before any effect", () => {
  const effects: number[] = [];
  for (const input of [{ amount: "10" }, { amount: -1 }, { amount: Number.MAX_SAFE_INTEGER + 1 }, null]) {
    assert.throws(() => acceptAmount(input, amount => effects.push(amount)), /invalid amount/);
    assert.deepEqual(effects, []);
  }
});
test("EP-TS-01 accepts a valid input exactly once", () => {
  const effects: number[] = [];
  acceptAmount({ amount: 10 }, amount => effects.push(amount));
  assert.deepEqual(effects, [10]);
});
