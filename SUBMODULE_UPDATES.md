# Submodule Auto-Update System

This project includes automated GitHub Actions workflows to keep submodules synchronized with their source repositories.

## Available Workflows

### 1. Auto Update Submodules (`auto-update-submodules.yml`)

**Purpose**: Automatically updates submodules directly to main branch.

**Features**:
- Runs daily at 02:00 UTC
- Can be triggered manually via workflow_dispatch
- Updates submodules to latest commits
- Commits and pushes directly to main branch
- Safe: only commits if there are actual changes

**When it runs**:
- Automatically: Every day at 02:00 UTC
- Manually: From GitHub Actions tab → "Auto Update Submodules" → "Run workflow"

### 2. Update Submodules (`update-submodules.yml`)

**Purpose**: Alternative workflow with similar functionality.

**Features**:
- Identical functionality to the first workflow
- Direct push to main branch
- No pull request creation

## How It Works

1. **Checkout**: Repository is checked out with submodule initialization
2. **Update**: Submodules are updated to latest remote commits
3. **Check Changes**: Git diff checks if any submodule changes exist
4. **Commit**: If changes found, creates a commit with detailed message
5. **Push**: Automatically pushes changes directly to main branch

## Manual Submodule Updates

You can also update submodules manually:

```bash
# Update all submodules to latest
git submodule update --remote --merge

# Update specific submodule
git submodule update --remote lampa-source

# View submodule status
git submodule status
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
Both workflows require:
- `contents: write` - To commit and push changes

## Benefits

1. **Automation**: No manual intervention needed for regular updates
2. **Direct Updates**: Submodules update immediately without review process
3. **Documentation**: Automatic commit messages show what was updated
4. **Safety**: Only commits when there are actual changes
5. **Transparency**: Full audit trail of all submodule updates
6. **No Review Required**: Updates happen automatically

## Security Notes

- Workflows use `GITHUB_TOKEN` with minimal required permissions
- All commits are signed by `github-actions[bot]`
- Updates are pushed directly to main branch
- Only committed changes are pushed to repository

## Troubleshooting

If workflows fail:

1. Check the Actions tab for error logs
2. Verify submodules are accessible and have updates
3. Ensure branch protection rules allow `github-actions[bot]` to push
4. Check repository permissions for Actions