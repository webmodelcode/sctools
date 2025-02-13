### Changelog between Version 0.1.0 and Version 0.1.1

#### New Features:

1. **None**

#### Changes:

1. **Manifest File**:

   - Updated the `matches` field in `manifest.json` to include wildcard subdomains for `chaturbate.com`:
     ```json
     "matches": [
       "https://es.stripchat.com/*",
       "https://*.chaturbate.com/*",
       "https://performerclient.streamatemodels.com/client/*"
     ]
     ```

2. **Package Version Update**:

   - Updated the version in `package.json` from `0.1.0` to `0.1.1`.

3. **Build Script Update**:

   - Modified the `build` script in `package.json` to include a new step for zipping the build output:
     ```json
     "build": "rimraf dist && vitest run && tsc -b && vite build && npm-build-zip --source=./dist --destination=./dist"
     ```

4. **New Dependency**:

   - Added `npm-build-zip` as a development dependency to handle zipping the build artifacts:
     ```json
     "devDependencies": {
       ...
       "npm-build-zip": "^1.0.4",
       ...
     }
     ```

5. **QuickMessagesMenu Component**:

   - **Positioning Logic**: Improved the positioning of the component to prevent it from interfering with the page's native interface.

6. **Accordion Component**:
   - Replaced the use of `NavigationMenu` with `Accordion` in the `QuickMessagesMenu` component to enhance the organization and presentation of quick messages.

---

### Summary:

Version **0.1.1** includes significant improvements in the positioning of the quick messages menu (`QuickMessagesMenu`), ensuring it is displayed correctly relative to the active element. Additionally, dependencies and build scripts were updated, and minor adjustments were made to the `manifest.json` file to support wildcard subdomains. These changes enhance the user experience when interacting with the quick messages menu.
