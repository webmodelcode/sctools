# Changelog

## [1.4.0] - 2026-04-07

### Added

- Add subtitle display page with segmented speech recognition and streaming translation (36a70bc)
- Display subtitle page in popup window (a332eb7)
- Integrate speech-to-translate toggle into features status and popup UI (a17dc15)
- Add web speech recognition datasource with vendor prefix fallback (4fd145d)
- Add font size, font color, and clear history controls to subtitle display (d4d71e)
- Improve subtitle readability with separate line backgrounds (4a27dee)
- Pulse animation with mic icon in subtitle loading indicator (b077ebe)

### Changed

- Update extension icon (afca3a5)

### Removed

- Remove old extension icons (afca3a5)

### Fixed

- Increase controls z-index to prevent layering issues (462db52)
- Adjust default font size for subtitle display (6d6830f)
- Use optional chaining to prevent potential null reference exception (aa6ed97)
- Use globalThis instead of self for Translator API availability check (b1e7ad7)

[1.4.0]: https://keepachangelog.com/en/1.1.0/
