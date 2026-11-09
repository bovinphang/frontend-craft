/** Test switch only; normal use always validates the external boundary. */
export function acceptAmount(value: unknown, effect: (amount: number) => void): void {
  if (process.env.CRAFT_ENGINEERING_DEFECTIVE === "1") {
    effect((value as { amount: number }).amount);
    return;
  }
  if (typeof value !== "object" || value === null || !("amount" in value)
      || typeof value.amount !== "number" || !Number.isSafeInteger(value.amount) || value.amount <= 0) {
    throw new TypeError("invalid amount");
  }
  effect(value.amount);
}
