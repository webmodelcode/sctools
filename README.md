# Extension Name

## Overview

Brief description of what the extension does.

## Quick Links

- [Getting Started](guides/getting-started/installation.md)
- [Architecture](guides/architecture/overview.md)
- [API Documentation](api/README.md)
- [Component Library](components/README.md)

## Documentation Structure

- `/api`: Technical API documentation
- `/components`: UI component documentation
- `/guides`: Development and usage guides

# Chrome Extension Project Overview

## Selected Stack

- **React**: UI Framework
  - _Why?_: Component-based, rich ecosystem, strong TypeScript support
- **TypeScript**: Base Language
  - _Why?_: Type safety, better DX, enhanced maintainability
- **Plasmo**: Extension Framework
  - _Why?_: Specialized for browser extensions, modern features, good DX
- **Tailwind CSS**: Styling Solution
  - _Why?_: Utility-first, zero runtime, perfect for extensions
- **shadcn/ui**: UI Component Library
  - _Why?_: Built on Tailwind, customizable, modern design
- **Vitest**: Testing Framework
  - _Why?_: Fast, good React support, Jest-compatible API
- **TypeDoc**: Documentation
  - _Why?_: Complete coverage (API + visual components)

## Testing Setup

### Basic Test Configuration

```typescript
// vitest.config.ts
import { resolve } from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    alias: {
      "~": resolve(__dirname, "src"),
      "@": resolve(__dirname, "src")
    }
  }
})
```

### Component Test Example

```typescript
// src/components/Popup/__tests__/Popup.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { Storage } from '@plasmohq/storage'
import Popup from '../Popup'

describe('Popup Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  it('should handle storage operations', async () => {
    const storage = new Storage()
    render(<Popup />)

    expect(storage.get).toHaveBeenCalled()
    await screen.findByText('test-value')
  })
})
```

## Documentation Structure

### Project Structure

```
docs/
├── api/              # TypeDoc generated API documentation
├── guides/          # Development and usage guides
│   ├── getting-started/
│   ├── architecture/
│   └── contributing/
└── README.md        # Main documentation entry point
```

### Component Documentation Example

````typescript
/**
 * Displays user settings with real-time updates
 * @component
 *
 * @example
 * ```tsx
 * <SettingsPanel
 *   initialSettings={defaultSettings}
 *   onSettingsChange={handleChange}
 * />
 * ```
 */
interface SettingsPanelProps {
  /** Initial settings configuration */
  initialSettings: Settings
  /** Callback for settings changes */
  onSettingsChange: (settings: Settings) => void
}
````

## Pending Topics

1. Update System Implementation (outside Chrome Web Store)
   - Auto-update mechanism
   - Version control
   - User notifications
2. CI/CD Pipeline Setup

   - Build process
   - Testing automation
   - Documentation generation

3. State Management Decision

   - Global state solution
   - Storage strategy

4. Security Considerations
   - Data encryption
   - Safe storage practices
   - Code signing

## Next Steps

1. Implement base project structure
2. Set up development environment
3. Configure testing and documentation tools
4. Create initial component library
5. Implement core extension features

## Additional Resources

- [Plasmo Documentation](https://docs.plasmo.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Chrome Extension Developer Guide](https://developer.chrome.com/docs/extensions/mv3/)
