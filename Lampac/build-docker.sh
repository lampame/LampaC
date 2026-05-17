#!/usr/bin/env bash
set -euo pipefail

# ── Configuration ──────────────────────────────────────────────────────────────
IMAGE_NAME="ghcr.io/lampac-nextgen/lampac"
IMAGE_TAG="latest"
ALL_PLATFORMS="linux/amd64,linux/arm64"
BUILDER_NAME="lampac-builder"

# ── Colors ─────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ── Helpers ────────────────────────────────────────────────────────────────────
log()     { echo -e "${BLUE}[•]${NC} $*"; }
success() { echo -e "${GREEN}[✓]${NC} $*"; }
warn()    { echo -e "${YELLOW}[!]${NC} $*"; }
error()   { echo -e "${RED}[✗]${NC} $*" >&2; exit 1; }

usage() {
    cat <<EOF
Usage: $(basename "$0") [OPTIONS]

Build Lampac NextGen Docker image for one or multiple platforms.

Options:
  --all              Build for all platforms: ${ALL_PLATFORMS}
  --amd64            Build linux/amd64 and load into local Docker (cross-build on Apple Silicon)
  --platform <spec>  Target platform(s), e.g. linux/amd64 or linux/arm64 (comma-separated = multi-arch)
  --export-tar <path> Write a single-platform image as docker tarball (no local docker load)
  --tag   <tag>      Image tag (default: ${IMAGE_TAG})
  --push             Push image to registry after build
  --no-cache         Build without cache
  --clean-cache      Clean buildx cache for '${BUILDER_NAME}' builder
  --clean-cache-all  Clean ALL Docker build caches (builder + system)
  -h, --help         Show this help

Examples:
  $(basename "$0")                        # Build for current platform
  $(basename "$0") --amd64                # amd64 image loaded into docker images (e.g. on arm64 Mac)
  $(basename "$0") --platform linux/amd64 --export-tar ./lampac-amd64.tar
  $(basename "$0") --all                  # Build for all platforms
  $(basename "$0") --all --push           # Build & push all platforms
  $(basename "$0") --tag v1.2.3 --push    # Build & push with specific tag
  $(basename "$0") --all --no-cache       # Build all without cache
  $(basename "$0") --clean-cache          # Clean builder cache only
  $(basename "$0") --clean-cache-all      # Clean all Docker build caches
  $(basename "$0") --clean-cache --all    # Clean cache then build all platforms
EOF
    exit 0
}

# ── Detect current platform ────────────────────────────────────────────────────
detect_platform() {
    local arch
    arch=$(uname -m)
    case "$arch" in
        x86_64)  echo "linux/amd64" ;;
        arm64)   echo "linux/arm64" ;;
        aarch64) echo "linux/arm64" ;;
        *)       error "Unsupported architecture: ${arch}" ;;
    esac
}

# ── Whether cross-platform / multi-arch needs the docker-container buildx builder ─
needs_buildx_builder() {
    local platform="$1"
    local push="$2"
    local native
    native=$(detect_platform)

    [ "${push}" = "true" ] && return 0

    local pc
    pc=$(echo "${platform}" | tr ',' '\n' | grep -c . || true)
    [ "${pc}" -gt 1 ] && return 0

    [ "${platform}" != "${native}" ] && return 0
    return 1
}

# ── Check dependencies ─────────────────────────────────────────────────────────
check_deps() {
    log "Checking dependencies..."

    command -v docker &>/dev/null \
        || error "Docker is not installed. Install from https://docs.docker.com/desktop/mac/install/"

    docker info &>/dev/null \
        || error "Docker daemon is not running. Start Docker Desktop."

    docker buildx version &>/dev/null \
        || error "Docker Buildx is not available. Update Docker Desktop."

    success "Dependencies OK"
}

# ── Setup buildx builder ───────────────────────────────────────────────────────
setup_builder() {
    log "Setting up buildx builder '${BUILDER_NAME}'..."

    if docker buildx inspect "${BUILDER_NAME}" &>/dev/null; then
        warn "Builder '${BUILDER_NAME}' already exists — reusing"
    else
        docker buildx create \
            --name "${BUILDER_NAME}" \
            --driver docker-container \
            --platform "${ALL_PLATFORMS}" \
            --bootstrap
        success "Builder '${BUILDER_NAME}' created"
    fi

    docker buildx use "${BUILDER_NAME}"
}

# ── Cleanup builder ────────────────────────────────────────────────────────────
cleanup_builder() {
    if docker buildx inspect "${BUILDER_NAME}" &>/dev/null; then
        log "Cleaning up builder '${BUILDER_NAME}'..."
        docker buildx rm "${BUILDER_NAME}" &>/dev/null || true
    fi
}

# ── Clean cache ────────────────────────────────────────────────────────────────
clean_cache() {
    local mode="$1" # "builder" | "all"

    echo ""
    log "Cache cleanup mode: ${mode}"
    echo ""

    # ── Builder cache ──────────────────────────────────────────────────────────
    log "Cleaning buildx cache for builder '${BUILDER_NAME}'..."
    if docker buildx inspect "${BUILDER_NAME}" &>/dev/null; then
        # Show cache size before
        echo ""
        log "Cache before cleanup:"
        docker buildx du --builder "${BUILDER_NAME}" 2>/dev/null || true
        echo ""

        # Prune builder cache
        docker buildx prune \
            --builder "${BUILDER_NAME}" \
            --force
        success "Builder '${BUILDER_NAME}' cache cleared"
    else
        warn "Builder '${BUILDER_NAME}' does not exist — nothing to clean"
    fi

    # ── System-wide cache ──────────────────────────────────────────────────────
    if [ "${mode}" = "all" ]; then
        echo ""
        log "Cleaning system-wide Docker build cache..."

        # Show cache size before
        log "Build cache before cleanup:"
        docker system df --format \
            'Images: {{.ImagesSize}}  Containers: {{.ContainersSize}}  Volumes: {{.VolumesSize}}  Build Cache: {{.BuildCacheSize}}' \
            2>/dev/null || docker system df

        echo ""
        warn "This will remove ALL Docker build cache (all builders, all projects)"
        read -r -p "$(echo -e "${YELLOW}[!]${NC} Are you sure? [y/N] ")" confirm
        echo ""

        if [[ "${confirm}" =~ ^[Yy]$ ]]; then
            docker buildx prune --all --force
            success "All buildx cache cleared"

            # Also prune dangling build cache from default builder
            docker builder prune --force &>/dev/null || true
            success "Default builder cache cleared"
        else
            warn "System cache cleanup skipped"
        fi
    fi

    # ── Show cache after ───────────────────────────────────────────────────────
    echo ""
    log "Cache after cleanup:"
    docker system df --format \
        'Images: {{.ImagesSize}}  Containers: {{.ContainersSize}}  Volumes: {{.VolumesSize}}  Build Cache: {{.BuildCacheSize}}' \
        2>/dev/null || docker system df
    echo ""
}

# ── Build ──────────────────────────────────────────────────────────────────────
build() {
    local platform="$1"
    local push="$2"
    local no_cache="$3"
    local tag="$4"
    local export_tar="${5:-}"
    local full_image="${IMAGE_NAME}:${tag}"

    echo ""
    log "Build configuration:"
    echo "  Image     : ${full_image}"
    echo "  Platform  : ${platform}"
    echo "  Push      : ${push}"
    echo "  No cache  : ${no_cache}"
    if [ -n "${export_tar}" ]; then
        echo "  Export    : ${export_tar} (docker tarball)"
    fi
    echo ""

    local args=(
        buildx build
        --platform "${platform}"
        --tag "${full_image}"
        --file Dockerfile
    )

    local platform_count
    platform_count=$(echo "${platform}" | tr ',' '\n' | wc -l | tr -d ' ')

    if [ -n "${export_tar}" ]; then
        if [ "${platform_count}" -gt 1 ]; then
            error "--export-tar requires a single platform (got: ${platform})"
        fi
        if [ "${push}" = "true" ]; then
            error "--export-tar cannot be combined with --push"
        fi
        args+=(--output "type=docker,dest=${export_tar}")
    elif [ "${push}" = "true" ]; then
        args+=(--push)
    elif [ "${platform_count}" -gt 1 ]; then
        warn "Multi-platform build without --push cannot be loaded locally."
        warn "Image will be built but NOT loaded into Docker. Use --push to push to registry."
        warn "For a local amd64 image use: $(basename "$0") --amd64  or  --platform linux/amd64"
        args+=(--output "type=image,push=false")
    else
        args+=(--load)
    fi

    [ "${no_cache}" = "true" ] && args+=(--no-cache)

    log "Starting build..."
    docker "${args[@]}" .

    success "Build complete: ${full_image}"

    # Show image size if loaded locally
    if [ "${push}" = "false" ] && [ "${platform_count}" -eq 1 ] && [ -z "${export_tar}" ]; then
        echo ""
        log "Image size:"
        docker images "${IMAGE_NAME}:${tag}" --format '  {{.Repository}}:{{.Tag}} — {{.Size}}'
    elif [ -n "${export_tar}" ]; then
        echo ""
        log "Exported tarball:"
        ls -lh "${export_tar}"
    fi
}

# ── Parse arguments ────────────────────────────────────────────────────────────
BUILD_ALL=false
AMD64=false
PLATFORM_OVERRIDE=""
EXPORT_TAR=""
PUSH=false
NO_CACHE=false
TAG="${IMAGE_TAG}"
CLEAN_CACHE=false
CLEAN_CACHE_ALL=false
BUILD=true

while [[ $# -gt 0 ]]; do
    case "$1" in
        --all)             BUILD_ALL=true       ; shift ;;
        --amd64)           AMD64=true           ; shift ;;
        --platform)
            [[ -n "${2:-}" ]] || error "--platform requires a value"
            PLATFORM_OVERRIDE="$2"
            shift 2
            ;;
        --export-tar)
            [[ -n "${2:-}" ]] || error "--export-tar requires a path"
            EXPORT_TAR="$2"
            shift 2
            ;;
        --push)            PUSH=true            ; shift ;;
        --no-cache)        NO_CACHE=true        ; shift ;;
        --clean-cache)     CLEAN_CACHE=true     ; shift ;;
        --clean-cache-all) CLEAN_CACHE_ALL=true ; shift ;;
        --tag)
            [[ -n "${2:-}" ]] || error "--tag requires a value"
            TAG="$2"
            shift 2
            ;;
        -h|--help) usage ;;
        *) error "Unknown option: $1. Use -h for help." ;;
    esac
done

# clean-cache alone (without --all / --push / --tag) = cache only, skip build
if { [ "${CLEAN_CACHE}" = "true" ] || [ "${CLEAN_CACHE_ALL}" = "true" ]; } \
    && [ "${BUILD_ALL}" = "false" ] \
    && [ "${PUSH}" = "false" ] \
    && [ "${TAG}" = "${IMAGE_TAG}" ]; then
    BUILD=false
fi

# ── Main ───────────────────────────────────────────────────────────────────────
main() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║               Lampac NextGen               ║${NC}"
    echo -e "${BLUE}║               Docker Builder               ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
    echo ""

    check_deps

    # ── Cache cleanup (runs before build if combined) ──────────────────────────
    if [ "${CLEAN_CACHE_ALL}" = "true" ]; then
        clean_cache "all"
    elif [ "${CLEAN_CACHE}" = "true" ]; then
        clean_cache "builder"
    fi

    # ── Skip build if only cache cleanup was requested ─────────────────────────
    if [ "${BUILD}" = "false" ]; then
        success "Done!"
        return
    fi

    # ── Determine target platform ──────────────────────────────────────────────
    if [ -n "${PLATFORM_OVERRIDE}" ]; then
        PLATFORM="${PLATFORM_OVERRIDE}"
        log "Target platform (explicit): ${PLATFORM}"
    elif [ "${AMD64}" = "true" ]; then
        if [ "${BUILD_ALL}" = "true" ]; then
            error "Use either --all or --amd64, not both."
        fi
        PLATFORM="linux/amd64"
        log "Target platform: linux/amd64 (load into local Docker)"
    elif [ "${BUILD_ALL}" = "true" ]; then
        PLATFORM="${ALL_PLATFORMS}"
    else
        PLATFORM=$(detect_platform)
        log "Detected current platform: ${PLATFORM}"
    fi

    local platform_count
    platform_count=$(echo "${PLATFORM}" | tr ',' '\n' | wc -l | tr -d ' ')

    if needs_buildx_builder "${PLATFORM}" "${PUSH}"; then
        setup_builder
        trap cleanup_builder EXIT
    fi

    build "${PLATFORM}" "${PUSH}" "${NO_CACHE}" "${TAG}" "${EXPORT_TAR}"

    echo ""
    success "Done!"

    if [ "${PUSH}" = "false" ] && [ "${platform_count}" -gt 1 ]; then
        echo ""
        warn "To push the image run:"
        echo "  $(basename "$0") --all --push --tag ${TAG}"
    fi
}

main
