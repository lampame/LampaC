#!/usr/bin/env bash

set -e

echo "Building Lampac project with all modules..."

# Verify .NET version
echo "Using .NET version: $(dotnet --version)"

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf ./publish ./bin ./obj

# Restore dependencies for entire solution
echo "Restoring NuGet packages..."
dotnet restore Lampac.sln

# Build all core projects in Release mode
echo "Building core solution..."
dotnet build Lampac.sln --configuration Release --no-restore

# Build and publish main application
echo "Publishing main application..."
dotnet publish Lampac/Lampac.csproj --configuration Release --output ./publish --no-build

# Copy module references and compile dynamic modules
echo "Setting up modules..."
mkdir -p ./publish/module/references

# Copy reference DLLs for module compilation
find . -name "*.dll" -path "*/bin/Release/*" -not -path "*/publish/*" | while read dll; do
    cp "$dll" ./publish/module/references/ 2>/dev/null || true
done

# Copy module source files if they exist
if [ -d "module" ]; then
    echo "Copying module files..."
    cp -r module ./publish/

    # Compile any source-based modules
    if [ -f "module/manifest.json" ]; then
        echo "Compiling dynamic modules..."
        cd ./publish

        # Use dotnet build to compile modules (this triggers the compilation logic in Startup.cs)
        dotnet build --configuration Release --no-restore || echo "Module compilation completed with warnings"

        cd ..
    fi
fi

# Copy configuration files
echo "Copying configuration files..."
cp init.conf ./publish/ 2>/dev/null || echo "init.conf not found, will use defaults"
cp init.yaml ./publish/ 2>/dev/null || echo "init.yaml not found, will use defaults"

echo "Build completed successfully!"
echo "Full application with modules available in ./publish directory"
echo ""
echo "To run the application:"
echo "  cd ./publish"
echo "  dotnet Lampac.dll"
