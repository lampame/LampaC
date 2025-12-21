# Quick Embedded Repo Commands

## Automatic Updates
Your GitHub Actions workflows will automatically:
- Sync embedded repos daily at 02:00 UTC
- Commit changes directly to main
- You can trigger manually from GitHub Actions tab

## Manual Commands

### View what changed in embedded repos:
```bash
git diff HEAD
git diff --name-only
```

### Sync Lampac:
```bash
tmp="$(mktemp -d)" \
  && git clone --depth 1 https://github.com/immisterio/Lampac "$tmp" \
  && rm -rf "$tmp/.git" \
  && rsync -a --delete "$tmp"/ Lampac/ \
  && rm -rf "$tmp"
```

### Sync lampa-source:
```bash
tmp="$(mktemp -d)" \
  && git clone --depth 1 https://github.com/yumata/lampa-source "$tmp" \
  && rm -rf "$tmp/.git" \
  && rsync -a --delete "$tmp"/ lampa-source/ \
  && rm -rf "$tmp"
```

## Current Embedded Repos:
- `lampa-source` (https://github.com/yumata/lampa-source)
- `Lampac` (https://github.com/immisterio/Lampac)
