import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
import resource_boundary


class Lease:
    def __init__(self, releases, identity):
        self.releases = releases
        self.identity = identity

    def __enter__(self):
        return self

    def close(self):
        self.releases.append(self.identity)

    def __exit__(self, kind, value, traceback):
        self.close()


class BoundaryTests(unittest.TestCase):
    def test_import_is_clean(self):
        with tempfile.TemporaryDirectory() as directory:
            marker = Path(directory) / "initialized.txt"
            env = {**os.environ, "CRAFT_IMPORT_MARKER": str(marker), "PYTHONDONTWRITEBYTECODE": "1"}
            subprocess.run([sys.executable, "-B", "-c", "import resource_boundary"], env=env, check=True, capture_output=True)
            self.assertFalse(marker.exists(), "EP-PY-01 import must not initialize external state")

    def test_partial_initialization_cleanup(self):
        releases = []
        with self.assertRaises(resource_boundary.BoundaryError) as failure:
            resource_boundary.initialize(lambda: Lease(releases, "first"), True)
        self.assertIsInstance(failure.exception.__cause__, OSError)
        self.assertEqual(releases, ["first"], "EP-PY-01 partial initialization releases acquired resource")

    def test_success_closes_in_reverse_order(self):
        releases = []
        identities = iter(["first", "second"])
        result = resource_boundary.initialize(lambda: Lease(releases, next(identities)))
        self.assertEqual(result, "ready")
        self.assertEqual(releases, ["second", "first"])


if __name__ == "__main__":
    unittest.main()
