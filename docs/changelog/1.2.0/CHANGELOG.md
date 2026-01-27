# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-01-27

### ✨ Added

- Redesigned Popup with Tabs and visual improvements
- New Tabs component
- Orientation and feature label support for ExtensionToggle

### 🔄 Changed

- Centralized feature status management with new custom hooks (`useFeaturesStatus`, `useTranslatorStatus`, `useQuickMessagesStatus`)
- Renamed `useExtensionState` to `useQuickMenuState` for clarity
- Added comprehensive unit tests for feature status hooks and updated component tests
- Removed Vitest execution from build script to optimize build process
- Updated project dependencies
