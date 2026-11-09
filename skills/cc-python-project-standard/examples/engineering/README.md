# Import and partial initialization — EP-PY-01

In a writable copy with Python3.8+ run `python -B -m unittest -v test_resource_boundary.py` (or python3). Set `CRAFT_ENGINEERING_DEFECTIVE=1` for the faulty run, then `=0`/unset for the protected default. PowerShell uses `$env:CRAFT_ENGINEERING_DEFECTIVE`; POSIX prefixes the command. No pip install, parent source or external service is needed; keep PYTHONDONTWRITEBYTECODE=1.

The import test starts a real separate interpreter and observes whether it writes a temporary external-state marker. The failure test observes chained cause and close records after partial initialization; the success test checks reverse close order. Only the explicitly defective branch writes the supplied temporary marker or skips cleanup. Run the same three tests in both modes.

This example does not connect a database or prove driver/transaction behavior. Context-manager callbacks make ownership observable; their use is not evidence of an actual service recovery. Import/initialization guidance applies equally to libraries, CLI and desktop callers. Output and caches belong outside the source copy.
