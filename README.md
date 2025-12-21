# LampaC

An auto-updating mirror repository for Deepwiki that keeps `lampa-source` and `Lampac` in one place. The goal is flexible indexing of both projects and the ability to work with them as a single codebase.

[![DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/lampame/LampaC)

## Repository Structure (Project Analysis)

### lampa-source
- **Repository**: https://github.com/yumata/lampa-source
- **Role**: Lampa client application source code.
- **Notes**: NPM-based build and local documentation generation.
- **Location**: `lampa-source/`

### Lampac
- **Repository**: https://github.com/immisterio/Lampac
- **Role**: Server-side and infrastructure components, extensions, and plugins for Lampa.
- **Notes**: Installers for Linux/Windows/Docker/Android and a large integration set.
- **Location**: `Lampac/`

## Why This Repository Exists

- **Single index for Deepwiki**: both client and server parts live together for consistent indexing.
- **Shared context**: easier cross-referencing between `lampa-source` and `Lampac`.
- **Automated sync**: upstream changes are pulled without manual maintenance.

## Update Mechanism (No Git Submodules)

This repo no longer uses Git submodules. Instead, it syncs both upstream repositories by direct import via the workflow:

- `.github/workflows/update-submodules.yml`

The workflow clones the upstream repositories into temp directories and rsyncs their contents into `Lampac/` and `lampa-source/` (with `.git` removed). If changes are detected, it commits and pushes them to `main`.

## Manual Sync

```bash
# Sync Lampac
(tmp="$(mktemp -d)" \
  && git clone --depth 1 https://github.com/immisterio/Lampac "$tmp" \
  && rm -rf "$tmp/.git" \
  && rsync -a --delete "$tmp"/ Lampac/ \
  && rm -rf "$tmp")

# Sync lampa-source
(tmp="$(mktemp -d)" \
  && git clone --depth 1 https://github.com/yumata/lampa-source "$tmp" \
  && rm -rf "$tmp/.git" \
  && rsync -a --delete "$tmp"/ lampa-source/ \
  && rm -rf "$tmp")
```

## Documentation

- `SUBMODULE_UPDATES.md` — how automated updates work.
- `SUBMODULE_COMMANDS.md` — quick manual sync commands.

## Getting Started

```bash
git clone https://github.com/your-org/LampaC.git
cd LampaC
ls Lampac lampa-source
```

## Benefits

- **One repo, two sources**: unified navigation and review.
- **Always current**: automated syncing from upstream.
- **Transparent history**: syncs are committed and traceable.
- **Deepwiki-friendly**: ideal for indexing and cross-repo analysis.

## Security

- Uses standard GitHub Actions with minimal permissions.
- Commits are authored by `github-actions[bot]`.

---

*LampaC is part of the Deepwiki ecosystem, providing unified access to Lampa client and server code.*
