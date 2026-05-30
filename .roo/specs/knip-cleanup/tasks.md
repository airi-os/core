# Knip Cleanup — Tasks

## Task Breakdown

### Phase 1: Add Unlisted Dependencies

- [ ] **T1.1** Run `pnpm --filter @proj-airi/stage-tamagotchi add replicate @formkit/auto-animate` to add both missing packages to `dependencies` and update the lockfile

### Phase 2: Refine Knip Configuration

- [ ] **T2.1** Edit [`knip.json`](knip.json) to add `src/renderer/pages/**/*.vue` and `src/renderer/layouts/**/*.vue` to the `entry` array under the `apps/stage-tamagotchi` workspace
- [ ] **T2.2** Review other workspaces in [`knip.json`](knip.json) (e.g. `packages/stage-ui`, `packages/stage-ui-three`) for similar missing Vue page/layout entry patterns and add them if applicable

### Phase 3: Remove Confirmed Unused Dependencies

- [ ] **T3.1** Run `pnpm --filter @proj-airi/stage-tamagotchi remove @huggingface/transformers @tresjs/cientos chess.js d3` to remove the four confirmed unused packages
- [ ] **T3.2** Check whether `onnxruntime-web` is a peer dependency of `@xsai-transformers/embed` or `@xsai-transformers/transcription` by inspecting their `package.json` in `node_modules` — if not a peer dep, remove it too
- [ ] **T3.3** Check for any `@types/d3` or `@types/chess.js` type packages in devDependencies and remove them if they exist

### Phase 4: Verification

- [ ] **T4.1** Run `pnpm install` to ensure lockfile consistency across all changes
- [ ] **T4.2** Run `pnpm -F @proj-airi/stage-tamagotchi typecheck` to confirm no type errors from dependency removal
- [ ] **T4.3** Run `pnpm knip` and review the output — confirm that pages/layouts are no longer flagged as unused
- [ ] **T4.4** Document any remaining genuine Knip warnings (unused exports, unused files that are truly dead code) as a follow-up task if needed