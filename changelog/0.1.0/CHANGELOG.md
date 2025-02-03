### Changelog between Version 0.0.1 and Version 0.1.0

#### New Features:

1. **Quick Messages Feature**:

   - Added a new feature for managing and using quick messages in the chat.
   - Introduced `QuickMessage`, `QuickMessageOptions`, and `QuickMessagesMenu` components.
   - Added a service (`quickMessagesService`) to handle CRUD operations for quick messages.
   - Quick messages can be added, updated, and deleted via the extension popup.
   - Quick messages can be inserted into the chat input field by clicking on them in the quick messages menu.

2. **FloatAlert Component**:

   - Added a new `FloatAlert` component to display alerts with different variants (default and destructive).
   - This component is used to show error messages or notifications within the extension.

3. **New UI Components**:

   - Added new UI components from ShadCn UI library:
     - `Alert`, `AlertTitle`, `AlertDescription` for displaying alerts.
     - `Dialog`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription` for modal dialogs.
     - `Input` for text input fields.
     - `Label` for form labels.
     - `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuContent`, `NavigationMenuTrigger`, `NavigationMenuLink`, `NavigationMenuIndicator`, `NavigationMenuViewport` for navigation menus.

4. **Enhanced Popup UI**:

   - The popup UI has been enhanced to include quick message operations (add, update, delete).
   - Added a new section in the popup for managing quick messages.

5. **New Utility Function**:

   - Added `isEditableElement` utility function to check if an element is editable (e.g., input, textarea, contenteditable).

6. **Global Strings Update**:
   - Added a new global string `QUICK_MESSAGES_KEY` for storing quick messages in local storage.

#### Changes:

1. **Popup Component**:

   - The popup component now includes a section for managing quick messages.
   - The popup width has been increased to accommodate the new quick message operations.

2. **Content Script**:

   - Now we allow new pages `Chaturbate.com`, `Streamatemodels.com`
   - The content script now renders the `QuickMessagesMenu` component alongside the `ContentMenu`.

3. **Dependencies**:

   - Added new dependencies:
     - `@radix-ui/react-dialog` for dialog components.
     - `@radix-ui/react-label` for label components.
     - `@radix-ui/react-navigation-menu` for navigation menu components.

4. **README.md**:

   - Updated the README to include information about the new quick messages feature, project structure, and usage instructions.

5. **Manifest Version**:

   - Updated the extension version from `0.0.1` to `0.1.0`.

6. **Maximize Button**
   - This feature is only enabled in `Stripchat`

#### Bug Fixes:

1. **Popup Toggle Extension**:

   - Fixed an issue where toggling the extension would not reload the page correctly. Now, the page is reloaded when the extension is toggled.

2. **Quick Messages Menu**:
   - Fixed an issue where the quick messages menu would not close when clicking outside of an editable element.

#### Tests:

1. **New Tests**:

   - Added tests for the new `FloatAlert` component.
   - Added tests for the new `QuickMessage` and `QuickMessagesMenu` components.
   - Added tests for the `isEditableElement` utility function.

2. **Updated Tests**:
   - Updated existing tests to accommodate new changes in the `Popup` and `ContentMenu` components.

#### Code Refactoring:

1. **Services**:

   - Refactored the `quickMessagesService` to handle CRUD operations for quick messages.
   - Added type definitions for `QuickMessage` and `QuickMessageType`.

2. **Components**:
   - Refactored the `Popup` component to include quick message operations.
   - Refactored the `ContentMenu` component to work alongside the new `QuickMessagesMenu`.

#### Other Changes:

1. **Project Structure**:

   - Added a new `services` directory to house service-related files.
   - Added a new `utils` directory under `config` for utility functions.

2. **Global Strings**:
   - Updated the `GLOBAL_STINGS` interface to include a new key for quick messages.

---

### Summary:

Version 0.1.0 introduces a significant new feature—**Quick Messages**—which allows users to manage and insert predefined messages into the chat. The UI has been enhanced with new components, and the popup now includes options for managing quick messages. Several bug fixes and improvements have been made, along with the addition of new tests to ensure the stability of the new features. The project structure has also been updated to better organize the codebase.
