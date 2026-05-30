#!/usr/bin/env bash
# Sets up the system Electron v42 for use with electron-vite and Node's require.resolve.
set -euo pipefail

SYSTEM_ELECTRON_LIB="/usr/lib/electron42"
SYSTEM_ELECTRON_BIN="${SYSTEM_ELECTRON_LIB}/electron"

if [ ! -x "$SYSTEM_ELECTRON_BIN" ]; then
  echo "[symlink-electron] ERROR: $SYSTEM_ELECTRON_BIN not found or not executable"
  exit 1
fi

# Find the npm-installed electron package to source type declarations from.
# pnpm stores it under node_modules/.pnpm/electron@<version>/node_modules/electron.
NPM_ELECTRON_DIR="$(find node_modules/.pnpm -path '*/node_modules/electron' -type d 2>/dev/null | head -1)"

for MODULE_DIR in "node_modules/electron" "apps/stage-tamagotchi/node_modules/electron"; do
  mkdir -p "$MODULE_DIR/dist"

  # Symlink everything EXCEPT the electron binary itself
  for item in "$SYSTEM_ELECTRON_LIB"/*; do
    local_name="$(basename "$item")"
    [ "$local_name" = "electron" ] && continue
    ln -sf "$item" "$MODULE_DIR/dist/$local_name" 2>/dev/null || true
  done

  # Create a wrapper script for the electron binary (not a symlink!)
  # This prevents require.resolve from following through to /usr/lib/electron42/
  cat > "$MODULE_DIR/dist/electron" << 'WRAPPER'
#!/usr/bin/env bash
exec /usr/lib/electron42/electron "$@"
WRAPPER
  chmod +x "$MODULE_DIR/dist/electron"

  # Copy TypeScript declarations and entry point from the npm package
  # so that TypeScript can resolve electron types correctly.
  if [ -n "$NPM_ELECTRON_DIR" ] && [ -f "$NPM_ELECTRON_DIR/electron.d.ts" ]; then
    cp -f "$NPM_ELECTRON_DIR/electron.d.ts" "$MODULE_DIR/electron.d.ts"
    cp -f "$NPM_ELECTRON_DIR/index.js" "$MODULE_DIR/index.js"
    echo "[symlink-electron] Copied type declarations from $NPM_ELECTRON_DIR"
  else
    echo "[symlink-electron] WARNING: Could not find npm electron package for type declarations"
  fi

  # Create package.json
  cat > "$MODULE_DIR/package.json" << 'PKGJSON'
{
  "name": "electron",
  "version": "42.3.0",
  "main": "dist/electron",
  "types": "electron.d.ts"
}
PKGJSON

  # Create path.txt in dist/ (where electron-vite looks for it)
  echo "electron" > "$MODULE_DIR/dist/path.txt"

  echo "[symlink-electron] Linked: $MODULE_DIR -> $SYSTEM_ELECTRON_LIB"
done
