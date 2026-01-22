# Build System Modernization Evaluation

## Executive Summary

The current build system relies on **Parcel v1.12.4**, which is now deprecated and causing significant friction in the modernization process. Specifically, Parcel v1's reliance on older `terser` versions forces us to downgrade TypeScript targets to ES2019, preventing the use of modern syntax like Optional Chaining (`?.`) in production builds.

We evaluated two modernization paths:

1.  **Parcel v2 Migration**
2.  **Vite Migration (Recommended)**

**Recommendation:** Migrate to **Vite**. It offers superior performance, a robust plugin ecosystem for Electron, and better long-term maintainability. The barriers to entry (e.g., Nunjucks templates) are minimal and easily resolved.

---

## 1. Current State Assessment

- **Bundler**: Parcel v1.12.4
- **Key Issues**:
  - **Build Failures**: Incompatibility with ES2020+ syntax (e.g., `?.`, `??`) due to outdated minifiers.
  - **Performance**: Slower HMR and build times compared to modern tools.
  - **Deprecated Dependencies**: Relies on `parcel-plugin-nunjucks` and `parcel-plugin-bundle-visualiser` which are unmaintained.
- **Configuration**:
  - Entry point: `src/index.prod.njk` (uses Nunjucks for simple includes).
  - Worker instantiation: `new Worker("./net-worker.ts")`.
  - Custom aliases: `~App`, `~Workers`, etc.

## 2. Option 1: Parcel v2

### Pros

- **Familiarity**: "Zero configuration" philosophy remains.
- **Upgrade Path**: Theoretically closer to the current setup than Vite.

### Cons

- **Breaking Changes**: Parcel v2 is a complete rewrite with significant configuration changes (`.parcelrc`).
- **Plugin Ecosystem**: The critical `parcel-plugin-nunjucks` is likely incompatible with v2, requiring us to find a replacement or rewrite templates anyway.
- **Electron Support**: While supported, community tooling for Electron + Parcel v2 is less mature than Vite's.

## 3. Option 2: Vite (Recommended)

### Pros

- **Performance**: Instant Server Start and lightning-fast HMR.
- **Modern Ecosystem**: Native support for ES modules, Workers, and TypeScript.
- **Electron Integration**: Excellent support via `vite-plugin-electron` or `electron-vite`.
- **Maintainability**: Large community, frequent updates, and stable plugin API.

### Migration Challenges & Solutions

1.  **Nunjucks Templates (`.njk`)**:
    - _Issue_: Vite uses `index.html` as the entry point.
    - _Solution_: The current Nunjucks usage is trivial (including `splash.html`). We can inline this HTML into `index.html` or use a simple transform plugin.
2.  **Web Workers**:
    - _Issue_: `new Worker("./file.ts")` syntax.
    - _Solution_: Vite supports `new Worker(new URL('./file.ts', import.meta.url), { type: 'module' })`.
3.  **Path Aliases**:
    - _Issue_: `~App` style aliases.
    - _Solution_: Easily configured in `vite.config.ts` via `resolve.alias`.
4.  **CommonJS Dependencies**:
    - _Issue_: Some legacy dependencies might be CJS.
    - _Solution_: Vite handles most CJS dependencies automatically; edge cases can be handled with `vite-plugin-commonjs`.

## 4. Migration Roadmap (Vite)

### Phase 1: Preparation

- [ ] Uninstall Parcel v1 and related plugins.
- [ ] Install `vite`, `vite-plugin-electron`, `@vitejs/plugin-react`.

### Phase 2: Configuration

- [ ] Create `vite.config.ts` with alias mappings and Electron setup.
- [ ] Convert `src/index.prod.njk` and `src/index.dev.njk` to a single `index.html`.
- [ ] Update `tsconfig.json` to potentially use `ESNext` modules for Vite.

### Phase 3: Code Updates

- [ ] Refactor `Worker` instantiation in `src/Workers/worker-controller.ts`.
- [ ] Update `package.json` scripts (`dev`, `build`, etc.) to use `vite`.
- [ ] Fix any strict ESM import issues.

### Phase 4: Verification

- [ ] Verify Electron startup in dev mode.
- [ ] Verify Production build and packaging (`electron-builder`).
- [ ] Verify Web Worker functionality (Network requests).
