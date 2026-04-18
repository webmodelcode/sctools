# Changelog

## [1.5.0] - 2026-04-17

### Added

- Add selectionTranslator to useFeaturesStatus hook (ac10465)
- Add SelectionTooltip component for showing translation results (c3e972a)
- Add SelectionBubble component for translation trigger UI (391ae31)
- Add useSelectionTranslation hook for handling translation requests (97c88b6)
- Add useTextSelection hook for handling text selection events (48bc3df)
- Add SELECTION_MESSAGE handler and useSelectionTranslatorStatus hook (c2a11f1)
- Add handleSelectionMessage to background controller (5db625b)

### Changed

- Extract storage hook factory to eliminate duplicated WXT storage boilerplate across 10 hooks (50adf78)
- Separate localStorage keys for language selector between tooltip and popup (81d831b)
- Use native select component and prevent tooltip close on self-click (7b9aeae)
- Extract LanguageSelectorControlled as presentational component (ccd1eb6)

### Fixed

- Return text directly when source and target languages match (f42ce99)
- Correct SelectionBubble positioning with scroll offset (95a25ec)

[1.5.0]: https://keepachangelog.com/en/1.1.0/
