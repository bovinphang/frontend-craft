#include "boundary.h"
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

typedef struct {
  void *live[8];
  int calls;
  int releases;
  int fail_at;
} Probe;

static void *allocate(void *context, size_t bytes) {
  Probe *probe = context;
  ++probe->calls;
  if (probe->calls == probe->fail_at || bytes > 1024) return NULL;
  void *pointer = malloc(bytes ? bytes : 1);
  for (size_t i = 0; i < 8; ++i) if (!probe->live[i]) { probe->live[i] = pointer; return pointer; }
  free(pointer);
  return NULL;
}
static void release(void *context, void *pointer) {
  Probe *probe = context;
  for (size_t i = 0; i < 8; ++i) if (probe->live[i] == pointer && pointer) {
    probe->live[i] = NULL; ++probe->releases; free(pointer); return;
  }
}
static int active(const Probe *probe) {
  int count = 0;
  for (size_t i = 0; i < 8; ++i) if (probe->live[i]) ++count;
  return count;
}
static void cleanup(Probe *probe) {
  for (size_t i = 0; i < 8; ++i) if (probe->live[i]) release(probe, probe->live[i]);
}
static int check(int condition, const char *message) {
  if (!condition) fprintf(stderr, "CRAFT_ASSERTION: EP-C-01 %s\n", message);
  return condition; /* Never compiled away by NDEBUG. */
}
static int overflow_and_partial_cleanup(void) {
  Probe probe = {0};
  Allocator allocator = { &probe, allocate, release };
  unsigned char *output = NULL;
  size_t size = 99;
  int status = build_payload(SIZE_MAX / 2 + 1, 2, &allocator, &output, &size);
  int ok = check(status != 0 && output == NULL && size == 0 && probe.calls == 0, "overflow rejected before allocation");
  cleanup(&probe); /* Keep even the intentionally faulty run free of unobserved survivors. */
  probe = (Probe){0}; probe.fail_at = 2;
  status = build_payload(4, 2, &allocator, &output, &size);
  ok = check(status != 0 && output == NULL && size == 0 && active(&probe) == 0 && probe.releases == 1, "partial failure releases acquired header") && ok;
  cleanup(&probe);
  return ok;
}
static int valid_input_and_outputs(void) {
  Probe probe = {0};
  Allocator allocator = { &probe, allocate, release };
  unsigned char *output = NULL; size_t size = 0;
  int status = build_payload(4, 2, &allocator, &output, &size);
  int ok = check(status == 0 && output != NULL && size == 8 && active(&probe) == 1, "successful transfer exposes one owned payload");
  if (output) release(&probe, output);
  ok = check(active(&probe) == 0 && probe.releases == 2, "allocator pair releases all acquired memory") && ok;
  ok = check(build_payload(4, 2, &allocator, NULL, &size) != 0 && size == 0, "valid output slot initialized on invalid arguments") && ok;
  cleanup(&probe); return ok;
}
int main(void) {
  int passed = 0, failed = 0;
  int result = overflow_and_partial_cleanup(); passed += result; failed += !result;
  printf("CRAFT_TEST {\"name\":\"overflow_and_partial_cleanup\",\"status\":\"%s\"}\n", result ? "pass" : "fail");
  result = valid_input_and_outputs(); passed += result; failed += !result;
  printf("CRAFT_TEST {\"name\":\"valid_input_and_outputs\",\"status\":\"%s\"}\n", result ? "pass" : "fail");
  printf("CRAFT_SUMMARY {\"total\":2,\"passed\":%d,\"failed\":%d,\"skipped\":0}\n", passed, failed);
  return failed ? 1 : 0;
}
