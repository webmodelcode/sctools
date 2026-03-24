# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-03-24

### ✨ Added

- Redesigned Popup with Tabs and visual improvements
- New Tabs component
- Orientation and feature label support for ExtensionToggle
- 🚀 Introduce Camsoda support to entrypoints
- 📦 Initialize Camsoda adapter configuration
- 🖼️ Add Camsoda local translator component and entrypoint
- 🎨 Implement FloatDropDown component and refactor CamsodaTranslator for better interaction
- ✨ Implement local translator for Camsoda messenger
- 🔧 Add robust JSON parsing for quick message import, supporting diverse quote styles and malformed entries

### 🔄 Changed

- Centralized feature status management with new custom hooks (`useFeaturesStatus`, `useTranslatorStatus`, `useQuickMessagesStatus`)
- Renamed `useExtensionState` to `useQuickMenuState` for clarity
- Added comprehensive unit tests for feature status hooks and updated component tests
- Removed Vitest execution from build script to optimize build process
- Updated project dependencies
- ↕️ Set new minimum size for main popup height to improve layout consistency
- ♻️ Extract ImportForm logic to dedicated hook and utility functions for better maintainability

### 🐛 Fixed

- 🔒 Increase z-index for QuickMessagesMenu to ensure visibility across UI layers
- 🐛 Update broadcast wrapper class selector in scAdapter for correct target identification
- 🐛 Adjust translator popup z-index to ensure it remains visible
