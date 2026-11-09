"""Explicit acquisition; importing the protected module performs no external I/O."""
from contextlib import ExitStack
import os
from pathlib import Path


class BoundaryError(Exception):
    pass


if os.environ.get("CRAFT_ENGINEERING_DEFECTIVE") == "1":
    marker = os.environ.get("CRAFT_IMPORT_MARKER")
    if marker:
        Path(marker).write_text("external initialization\n", encoding="utf-8")


def initialize(acquire, fail_after_first=False):
    def fail():
        try:
            raise OSError("payload unavailable")
        except OSError as cause:
            raise BoundaryError("initialization failed") from cause

    if os.environ.get("CRAFT_ENGINEERING_DEFECTIVE") == "1":
        first = acquire()
        if fail_after_first:
            fail()  # Deliberately skips cleanup of the first acquired resource.
        second = acquire()
        second.close()
        first.close()
        return "ready"
    with ExitStack() as stack:
        stack.enter_context(acquire())
        if fail_after_first:
            fail()
        stack.enter_context(acquire())
        return "ready"
