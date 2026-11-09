#ifndef ENGINEERING_BOUNDARY_H
#define ENGINEERING_BOUNDARY_H
#include <stddef.h>

typedef struct {
  void *context;
  void *(*allocate)(void *context, size_t bytes);
  void (*release)(void *context, void *pointer);
} Allocator;

/* On failure, valid output slots are NULL/0. Success transfers only *output.
 * Release success output with this same allocator; caller retains input ownership. */
int build_payload(size_t count, size_t width, const Allocator *allocator,
                  unsigned char **output, size_t *output_size);
#endif
