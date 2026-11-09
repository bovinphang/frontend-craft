#include "boundary.hpp"
#include <iostream>
#include <stdexcept>
#include <string>
static bool check(bool condition, const char* message) {
  if (!condition) std::cerr << "CRAFT_ASSERTION: EP-CPP-01 " << message << '\n';
  return condition; // Always active with NDEBUG as well.
}
static bool borrowing_and_partial_construction() {
  Counters state;
  auto* input = new Borrowed(state);
  bool failed = false;
  try { process_borrowed(input, state, true); }
  catch (const std::runtime_error& error) { failed = std::string(error.what()) == "payload unavailable"; }
  bool ok = check(failed, "original failure visible");
  ok = check(state.borrowed_released == 0, "borrowed input was not taken over") && ok;
  ok = check(state.acquired == 1 && state.released == 1, "partial construction releases owned lease") && ok;
  if (state.borrowed_released == 0) delete input; // Never double-delete even in the faulty test.
  return ok;
}
static bool success_keeps_caller_ownership() {
  Counters state;
  auto* input = new Borrowed(state);
  int value = process_borrowed(input, state, false);
  bool ok = check(value == 42 && state.borrowed_released == 0, "successful borrow stays with caller");
  ok = check(state.acquired == 1 && state.released == 1, "successful lease closes") && ok;
  if (state.borrowed_released == 0) delete input;
  return ok;
}
int main() {
  int passed = 0, failed = 0;
  bool result = borrowing_and_partial_construction(); passed += result; failed += !result;
  std::cout << "CRAFT_TEST {\"name\":\"borrowing_and_partial_construction\",\"status\":\"" << (result ? "pass" : "fail") << "\"}\n";
  result = success_keeps_caller_ownership(); passed += result; failed += !result;
  std::cout << "CRAFT_TEST {\"name\":\"success_keeps_caller_ownership\",\"status\":\"" << (result ? "pass" : "fail") << "\"}\n";
  std::cout << "CRAFT_SUMMARY {\"total\":2,\"passed\":" << passed << ",\"failed\":" << failed << ",\"skipped\":0}\n";
  return failed ? 1 : 0;
}
