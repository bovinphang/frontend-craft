#include "boundary.h"
#include <stdint.h>
#include <stdlib.h>
#include <string.h>

int build_payload(size_t count, size_t width, const Allocator *allocator,
                  unsigned char **output, size_t *output_size) {
  if (output) *output = NULL;
  if (output_size) *output_size = 0;
  if (!output || !output_size || !allocator || !allocator->allocate || !allocator->release) return -1;
  const char *switch_value = getenv("CRAFT_ENGINEERING_DEFECTIVE");
  const int defective = switch_value && strcmp(switch_value, "1") == 0;
  if (!count || !width || (!defective && count > SIZE_MAX / width)) return -1;
  const size_t bytes = count * width; /* Unsigned wrap is defined, but not a valid allocation contract. */
  void *header = allocator->allocate(allocator->context, 16);
  if (!header) return -1;
  unsigned char *payload = allocator->allocate(allocator->context, bytes);
  if (!payload) {
    if (!defective) allocator->release(allocator->context, header);
    return -1;
  }
  allocator->release(allocator->context, header);
  *output = payload;
  *output_size = bytes;
  return 0;
}
