#ifndef ENGINEERING_CPP_BOUNDARY_HPP
#define ENGINEERING_CPP_BOUNDARY_HPP
struct Counters { int acquired = 0; int released = 0; int borrowed_released = 0; };
struct Borrowed {
  Counters& counters;
  int value = 42;
  explicit Borrowed(Counters& state) : counters(state) {}
  ~Borrowed() { ++counters.borrowed_released; }
};
// Caller owns input. This isolated example uses exceptions; no C ABI is exported.
int process_borrowed(Borrowed* input, Counters& counters, bool fail);
#endif
