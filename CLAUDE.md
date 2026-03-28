# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**sctools** (EW Model Tools) — A Chrome extension built with WXT + React that provides translation and productivity tools for webcam model platforms (StripChat, Chaturbate, SM, CamSoda). Uses Chrome's built-in Translator and Language Detector APIs for local translation.

## Commands

- `pnpm dev` — Start WXT dev server (loads extension in Chrome with HMR)
- `pnpm build` — Production build
- `pnpm test` — Run all tests (`vitest run`)
- `pnpm test -- src/path/to/file.test.ts` — Run a single test file
- `pnpm compile` — TypeScript type checking (`tsc --noEmit`)
- `pnpm zip` — Package extension for distribution

## Architecture

The project follows a **layered architecture** with WXT as the extension framework:

### Layers (under `src/`)

- **`config/`** — Platform-specific DOM adapters and shared utilities. Each adapter (`scAdapter`, `smAdapter`, `chaturAdapter`, `camsodaAdapter`) knows how to query/manipulate the DOM of its target website (CSS selectors, element lookups, string constants).
- **`infrastructure/`** — Data sources wrapping Chrome APIs: `chromeTranslator` (Translator API), `chromeLanguageDetector` (Language Detector API), `quickMessages` (chrome.storage).
- **`domain/`** — Intended for entities, DTOs, use-cases, and interfaces (currently scaffolded with empty directories).
- **`presentation/`** — WXT entrypoints, React components, hooks, and UI. This is also the WXT `srcDir`.

### WXT Entrypoints (`src/presentation/entrypoints/`)

Each `*.content/` directory is a WXT content script injected into a specific site via URL match patterns. They use `createShadowRootUi` to render React components in isolation:

- `scLocalTranslator.content` — StripChat translator
- `chaturLocalTranslator.content` — Chaturbate translator
- `smLocalTranslator.content` — SM translator
- `camsodaLocalTranslator.content` — CamSoda translator
- `inputLocalTranslator.content` — Input field translator
- `quickMessages.content` — Quick messages feature
- `contentMenu.content` — Content menu overlay
- `checkExtUpload.content` — Extension upload checker
- `background/` — Service worker handling message routing between content scripts
- `popup/` — Extension popup UI

### Key Conventions

- **Path alias:** `~@` maps to `src/` (configured in tsconfig and vite)
- **UI components:** shadcn/ui (new-york style) at `src/presentation/components/ui/`, with Tailwind CSS v4
- **Testing:** Vitest with happy-dom environment, `@testing-library/react`, and `@testing-library/jest-dom`. Tests live in `__test__/` or `__tests__/` directories alongside their source. Setup file: `src/test/setup.ts`.
- **WXT globals:** `defineBackground`, `defineContentScript`, `createShadowRootUi`, `browser` are auto-imported by WXT — no explicit imports needed.
- **Package manager:** pnpm
