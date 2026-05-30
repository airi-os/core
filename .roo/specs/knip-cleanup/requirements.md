# Knip Cleanup — Requirements

## Overview

Knip identified unlisted dependencies, missing entry-point configuration causing false positives, and confirmed unused dependencies in `apps/stage-tamagotchi`. This spec addresses all three categories to bring the Knip report to a clean state.

## Requirements

### R1: Add Unlisted Dependencies

Two packages are imported in source code but missing from [`apps/stage-tamagotchi/package.json`](apps/stage-tamagotchi/package.json):

| Package | Import Location |
|---------|----------------|
| `replicate` | [`src/main/services/airi/widgets/providers/replicate.ts`](apps/stage-tamagotchi/src/main/services/airi/widgets/providers/replicate.ts:3) |
| `@formkit/auto-animate` | [`src/renderer/main.ts`](apps/stage-tamagotchi/src/renderer/main.ts:6) |

**Requirement:** Add both packages to the `dependencies` section of [`apps/stage-tamagotchi/package.json`](apps/stage-tamagotchi/package.json) and run `pnpm install` to update the lockfile.

### R2: Refine Knip Entry Configuration

The current [`knip.json`](knip.json:11) workspace entry for `apps/stage-tamagotchi` only lists 4 entry points:

```
src/main/index.ts
src/preload/index.ts
src/renderer/main.ts
src/renderer/beat-sync.main.ts
```

This omits all Vue pages and layouts, which are loaded via file-based routing (unplugin-vue-layouts + vite-plugin-vue-layouts) and dynamic imports — patterns Knip cannot trace statically. The result is 109 unused files and 62 unused exports flagged as false positives.

**Requirement:** Add glob patterns for pages and layouts to the `entry` array in [`knip.json`](knip.json:11) under the `apps/stage-tamagotchi` workspace:

- `src/renderer/pages/**/*.vue`
- `src/renderer/layouts/**/*.vue`

Also consider adding any other dynamically-loaded entry patterns such as story files or Histoire setup if present.

### R3: Remove Confirmed Unused Dependencies

Four packages in [`apps/stage-tamagotchi/package.json`](apps/stage-tamagotchi/package.json) have zero imports anywhere in the `apps/stage-tamagotchi/src` tree:

| Package | Lines in package.json | Usage Found |
|---------|----------------------|-------------|
| `@huggingface/transformers` | [line 51](apps/stage-tamagotchi/package.json:51) | None |
| `@tresjs/cientos` | [line 73](apps/stage-tamagotchi/package.json:73) | None |
| `chess.js` | [line 94](apps/stage-tamagotchi/package.json:94) | None |
| `d3` | [line 97](apps/stage-tamagotchi/package.json:97) | None |

**Requirement:** Remove all four packages from [`apps/stage-tamagotchi/package.json`](apps/stage-tamagotchi/package.json) and run `pnpm install` to update the lockfile. Also remove any associated `@types/*` packages if they exist in devDependencies.

### R4: Verify Clean Knip Report

After completing R1–R3, re-run Knip and verify:

- No unlisted dependencies remain
- The false-positive count for unused files and exports drops significantly (pages/layouts should no longer be flagged)
- Any remaining flagged items are genuine and can be addressed in a follow-up

**Requirement:** Run `pnpm knip` and confirm the report is clean or document any remaining genuine issues.

## Out of Scope

- Removing genuinely unused exports or files that remain after fixing entry configuration (follow-up task)
- Refactoring Knip configuration for other workspaces (`packages/stage-ui`, `packages/stage-ui-three`, etc.)
- Adding missing entry points for other workspaces beyond `apps/stage-tamagotchi`