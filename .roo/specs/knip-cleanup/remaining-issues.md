# Knip Cleanup — Remaining Issues

## Summary of Changes Made

| Change | Status |
|--------|--------|
| Added `replicate` and `@formkit/auto-animate` to dependencies | Done |
| Added `src/renderer/pages/**/*.vue` and `src/renderer/layouts/**/*.vue` to knip.json entries | Done |
| Removed `@huggingface/transformers` | Done |
| Removed `@tresjs/cientos` | Done |
| Removed `chess.js` | Done |
| Removed `d3` | Done |
| Removed `onnxruntime-web` (not a peer dep, zero imports) | Done |

## Knip Results After Cleanup

| Metric | Before | After |
|--------|--------|-------|
| Unused files | 109 | 29 |
| Unused exports | 62 | 58 |
| Unlisted dependencies | 2 | 0 |

The entry-point fix eliminated the bulk of false positives (80 unused files were Vue pages/layouts that Knip couldn't trace).

## Remaining Unused Files (29) — Follow-Up Needed

These are genuine unused files that should be investigated individually:

### apps/stage-tamagotchi (10 files)
- `src/main/services/electron/system-preferences.ts` — possibly dead code
- `src/main/windows/dashboard/index.ts` — possibly dead code
- `src/main/windows/dashboard/rpc/index.electron.ts` — possibly dead code
- `src/main/windows/shared/persistence.ts` — possibly dead code
- `src/preload/beat-sync.ts` — possibly dead code
- `src/renderer/components/IconAnimation.vue` — possibly dead code
- `src/renderer/components/stage-islands/resource-status-island/loading-component-detail.vue` — possibly dead code
- `src/renderer/composables/icon-animation.ts` — possibly dead code
- `src/renderer/stores/window.ts` — possibly dead code
- `src/renderer/utils/windows.ts` — possibly dead code

### packages/ccc (1 file)
- `src/define/ext.ts`

### packages/core-agent (1 file)
- `src/messages/index.ts`

### packages/plugin-sdk (11 files)
- `src/channels/index.ts`
- `src/channels/local/event-target/index.ts`
- `src/channels/remote/websocket/index.ts`
- `src/plugin-host/testdata/test-error-plugin.ts`
- `src/plugin-host/testdata/test-injected-host-apis-plugin.ts`
- `src/plugin-host/testdata/test-no-connect-plugin.ts`
- `src/plugin-host/testdata/test-normal-plugin.ts`
- `src/plugin/local.ts`
- `src/plugin/local/index.ts`
- `src/plugin/remote.ts`
- `src/plugin/remote/index.ts`

### packages/stage-ui-live2d (1 file)
- `src/utils/live2d-structure-report.ts`

### packages/stage-ui-three (2 files)
- `src/composables/index.ts`
- `src/composables/shader/index.ts`

### packages/stage-ui (3 files)
- `src/components/animations/Replayable.vue`
- `src/utils/relative-time.ts`
- `src/utils/stream.ts`

## Remaining Unused Dependencies (88)

The vast majority (70+) are workspace packages (`@proj-airi/*`) and `@xsai/*` packages that Knip flags because they're listed in `package.json` but Knip can't trace the imports through the workspace resolution. These are likely false positives caused by missing entry points for the `packages/stage-ui-three`, `packages/plugin-sdk`, `packages/core-agent`, `packages/ccc`, and `packages/stage-layouts` workspaces in `knip.json`.

### Notable root-level unused devDependencies
- `@electron-toolkit/eslint-config-ts` — verify if used in eslint config
- `@unocss/eslint-config` — verify if used in eslint config
- `bumpp` — may be used in release scripts
- `oxc-minify` — may be used in build scripts
- `rollup` — may be used as a peer by other tools
- `sponsors-svg` — may be used in docs/build scripts
- `unplugin-lightningcss` — may be used in vite config
- `unplugin-raw` — may be used in vite config
- `vitest-browser-vue` — may be used in test setup

## Recommended Next Steps

1. **Add entry points for remaining workspaces** in `knip.json` (especially `packages/plugin-sdk`, `packages/stage-ui-three`, `packages/ccc`, `packages/core-agent`, `packages/stage-layouts`) to reduce false-positive unused dependency counts
2. **Investigate the 29 unused files** — delete confirmed dead code, add to Knip ignore list if intentionally unused
3. **Verify root-level devDependencies** — check if they're used in configs/scripts before removing
