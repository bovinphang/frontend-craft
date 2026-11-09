#include "boundary.hpp"
#include <cstdlib>
#include <memory>
#include <stdexcept>
#include <string>
namespace {
struct Lease {
  Counters& counters;
  explicit Lease(Counters& state) : counters(state) { ++counters.acquired; }
  ~Lease() { ++counters.released; }
};
}
int process_borrowed(Borrowed* input, Counters& counters, bool fail) {
  if (!input) throw std::invalid_argument("null borrowed input");
  const char* mode = std::getenv("CRAFT_ENGINEERING_DEFECTIVE");
  if (mode && std::string(mode) == "1") {
    std::unique_ptr<Borrowed> wrong_owner(input); // Deliberately takes caller ownership.
    auto* lease = new Lease(counters);
    if (fail) throw std::runtime_error("payload unavailable"); // Deliberately leaks lease.
    delete lease;
    return input->value;
  }
  auto lease = std::make_unique<Lease>(counters);
  if (fail) throw std::runtime_error("payload unavailable");
  return input->value;
}
