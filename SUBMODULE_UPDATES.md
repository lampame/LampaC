# Embedded Repo Auto-Update System

This project includes automated GitHub Actions workflows to keep embedded repositories synchronized with their source repositories without using git submodules.

## Available Workflows

### Update Embedded Repos (`update-submodules.yml`)

**Purpose**: Pulls upstream repositories and syncs their files into local directories.

**Features**:
- Runs daily at 02:00 UTC
- Can be triggered manually via workflow_dispatch
- Clones upstream repos and rsyncs files into `Lampac` and `lampa-source`
- Commits and pushes directly to main branch
- Safe: only commits if there are actual changes

## How It Works

1. **Checkout**: Repository is checked out without submodules
2. **Sync**: Upstream repos are cloned into temp directories
3. **Copy**: Files are synced into `Lampac/` and `lampa-source/` (excluding `.git`)
4. **Check Changes**: Git diff checks if any updates exist
5. **Commit**: If changes found, creates a commit
6. **Push**: Automatically pushes changes directly to main branch

## Manual Repo Updates

You can also sync repositories manually:

```bash
# Sync Lampac
tmp="$(mktemp -d)" \
  && git clone --depth 1 https://github.com/immisterio/Lampac "$tmp" \
  && rm -rf "$tmp/.git" \
  && rsync -a --delete "$tmp"/ Lampac/ \
  && rm -rf "$tmp"

# Sync lampa-source
tmp="$(mktemp -d)" \
  && git clone --depth 1 https://github.com/yumata/lampa-source "$tmp" \
  && rm -rf "$tmp/.git" \
  && rsync -a --delete "$tmp"/ lampa-source/ \
  && rm -rf "$tmp"
```

## Configuration

### Schedule
To change the update frequency, edit the cron schedule in both workflow files:
```yaml
schedule:
  - cron: '0 2 * * *'  # Daily at 02:00 UTC
```

Common cron expressions:
- `0 2 * * *` - Daily at 02:00 UTC
- `0 */6 * * *` - Every 6 hours
- `0 2 * * 0` - Weekly on Sunday at 02:00 UTC
- `0 2 1 * *` - Monthly on 1st day at 02:00 UTC

### Permissions
The workflow requires:
- `contents: write` - To commit and push changes

## Benefits

1. **Automation**: No manual intervention needed for regular updates
2. **Deepwiki Friendly**: Files live in the main repository for indexing
3. **Documentation**: Automatic commit messages show what was updated
4. **Safety**: Only commits when there are actual changes
5. **Transparency**: Full audit trail of all updates
6. **No Review Required**: Updates happen automatically

## Security Notes

- Workflows use `GITHUB_TOKEN` with minimal required permissions
- All commits are signed by `github-actions[bot]`
- Updates are pushed directly to main branch
- Only committed changes are pushed to repository

## Troubleshooting

If workflows fail:

1. Check the Actions tab for error logs
2. Verify upstream repos are accessible and have updates
3. Ensure branch protection rules allow `github-actions[bot]` to push
4. Check repository permissions for Actions
