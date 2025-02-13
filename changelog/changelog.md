# Changelog

All notable changes to this project will be documented in this file.  
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.1] - 2025-02-09

### Added

- **Dependency**: Added `npm-build-zip` as a development dependency to handle zipping build artifacts.

### Changed

- **Manifest File**: Updated the `matches` field in `manifest.json` to include wildcard subdomains for `chaturbate.com`.
- **Build Script**: Modified the `build` script in `package.json` to include a new step for zipping the build output.
- **QuickMessagesMenu Component**: Improved the positioning logic to prevent interference with the page's native interface.
- **Accordion Component**: Replaced `NavigationMenu` with `Accordion` in the `QuickMessagesMenu` component for better organization and presentation of quick messages.
- **Package Version**: Updated the version in `package.json` from `0.1.0` to `0.1.1`.

---

## [0.1.0] - 2025-01-01

### Added

- **Quick Messages Feature**:
  - Introduced `QuickMessage`, `QuickMessageOptions`, and `QuickMessagesMenu` components.
  - Added `quickMessagesService` for CRUD operations on quick messages.
  - Enabled adding, updating, and deleting quick messages via the extension popup.
  - Allowed inserting quick messages into the chat input field.
- **FloatAlert Component**: Added a new component to display alerts with different variants (default and destructive).
- **New UI Components**: Added ShadCn UI components (`Alert`, `Dialog`, `Input`, `Label`, `NavigationMenu`, etc.).
- **Utility Function**: Added `isEditableElement` to check if an element is editable.
- **Global Strings**: Added `QUICK_MESSAGES_KEY` for storing quick messages in local storage.
- **Tests**: Added tests for `FloatAlert`, `QuickMessage`, `QuickMessagesMenu`, and `isEditableElement`.
- **Documentation**: Added documentation for the `./src` directory.

### Changed

- **Popup Component**:
  - Added a section for managing quick messages.
  - Increased popup width to accommodate new features.
- **Content Script**:
  - Allowed new pages (`Chaturbate.com`, `Streamatemodels.com`).
  - Rendered `QuickMessagesMenu` alongside `ContentMenu`.
- **Dependencies**: Added `@radix-ui/react-dialog`, `@radix-ui/react-label`, and `@radix-ui/react-navigation-menu`.
- **README.md**: Updated to include information about the quick messages feature, project structure, and usage instructions.
- **Manifest Version**: Updated from `0.0.1` to `0.1.0`.
- **Maximize Button**: Enabled only in `Stripchat`.
- **Project Structure**:
  - Added `services` directory for service-related files.
  - Added `utils` directory under `config` for utility functions.
- **Global Strings**: Updated the `GLOBAL_STINGS` interface to include a new key for quick messages.

### Fixed

- **Popup Toggle Extension**: Fixed an issue where toggling the extension would not reload the page correctly.
- **Quick Messages Menu**: Fixed an issue where the menu would not close when clicking outside an editable element.

### Refactored

- **Services**: Refactored `quickMessagesService` to handle CRUD operations.
- **Components**: Refactored `Popup` and `ContentMenu` components to accommodate new features.

---
