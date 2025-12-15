# LampaC

A dual repository for Deepwiki with automated submodule management system.

## Overview

LampaC is a comprehensive project that combines two important repositories as Git submodules to provide a complete solution for media streaming and content management.

## Submodules

This repository includes the following Git submodules:

### 1. lampa-source
- **Repository**: [yumata/lampa-source](https://github.com/yumata/lampa-source)
- **Purpose**: Core application source code
- **Location**: `lampa-source/`

### 2. Lampac
- **Repository**: [immisterio/Lampac](https://github.com/immisterio/Lampac)
- **Purpose**: Extended functionality and modules
- **Location**: `Lampac/`

## Automated Updates

### GitHub Actions Workflows

The project includes automated GitHub Actions workflows that keep submodules synchronized with their source repositories:

#### Auto Update Submodules
- **Schedule**: Runs automatically every day at 02:00 UTC
- **Manual Trigger**: Can be triggered manually from GitHub Actions tab
- **Process**: Updates submodules to latest commits and pushes directly to main branch
- **Safety**: Only commits when actual changes are detected

#### Update Submodules (Alternative)
- **Purpose**: Alternative workflow with identical functionality
- **Benefits**: Provides redundancy for critical updates

### Manual Submodule Updates

You can also update submodules manually:

```bash
# Update all submodules to latest
git submodule update --remote --merge

# Update specific submodule
git submodule update --remote lampa-source
git submodule update --remote Lampac

# View submodule status
git submodule status
```

## Documentation

- **[SUBMODULE_UPDATES.md](./SUBMODULE_UPDATES.md)** - Complete guide to automated submodule management
- **[SUBMODULE_COMMANDS.md](./SUBMODULE_COMMANDS.md)** - Quick reference for submodule operations

## Features

- **Automated Synchronization**: Submodules stay up-to-date automatically
- **Direct Updates**: Changes are applied immediately without review process
- **Manual Override**: Full control with manual update capabilities
- **Comprehensive Documentation**: Detailed guides for all operations
- **Safety First**: Only commits when actual changes exist

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/LampaC.git
   cd LampaC
   ```

2. **Initialize submodules**:
   ```bash
   git submodule update --init --recursive
   ```

3. **Check submodule status**:
   ```bash
   git submodule status
   ```

## Workflow

1. **Daily Automation**: GitHub Actions checks for updates daily
2. **Smart Detection**: Only commits when submodule changes exist
3. **Direct Application**: Updates are pushed directly to main branch
4. **Transparency**: All changes are logged with detailed commit messages

## Benefits

- **Zero Maintenance**: Automated system handles updates
- **Always Current**: Submodules stay synchronized with upstream
- **Developer Friendly**: Simple commands for manual operations
- **Reliable**: Multiple workflows ensure consistent updates
- **Documented**: Comprehensive guides for all operations

## Security

- Uses GitHub's built-in security features
- Minimal required permissions for workflows
- All commits are signed by `github-actions[bot]`
- Updates are logged and traceable

---

*This project is part of the Deepwiki ecosystem, providing a robust foundation for media streaming applications.*
