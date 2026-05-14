# Security Policy

**简体中文:** [SECURITY.zh-CN.md](SECURITY.zh-CN.md)

Thank you for helping keep `frontend-craft` and its users safe.

## Supported Versions

Security updates are provided for the latest published version on npm and the default branch of this repository.

## Reporting a Vulnerability

Please do not report security vulnerabilities through public GitHub issues.

Use GitHub Security Advisories when available:

[https://github.com/bovinphang/frontend-craft/security/advisories/new](https://github.com/bovinphang/frontend-craft/security/advisories/new)

If advisories are unavailable, email the maintainer listed in `package.json`.

Please include:

- Affected version or commit.
- Affected runtime, if relevant.
- Operating system and Node.js version.
- Reproduction steps or proof of concept.
- Potential impact.
- Any known workarounds.

## Scope

Security-sensitive areas include:

- CLI installation behavior and file writes.
- Hook scripts and command execution.
- Runtime template generation.
- MCP configuration templates.
- Any behavior that may expose secrets, credentials, paths, or private project content.

## Response Expectations

Maintainers will aim to acknowledge valid reports within 7 days. Fix timelines depend on severity and maintainer availability, but high-impact issues that affect installation safety, command execution, or secret exposure will be prioritized.

Once a fix is available, maintainers may publish a patch release and credit the reporter unless they request otherwise.
