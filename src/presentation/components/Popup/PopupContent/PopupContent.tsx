/**
 * PopupContent Component
 *
 * Main content section of the popup containing the extension toggle and quick message operations.
 *
 * @module components/Popup/PopupContent
 * @returns {JSX.Element} - Returns the JSX element representing the popup content.
 */

import { CardContent } from "../../ui/card";
import { QuickMessageOperations } from "../QuickMessageOperations/QuickMessageOperations";

export const PopupContent = () => {
  return (
    <CardContent className="p-4">
      <div className="flex items-center justify-center gap-4 rounded-lg border p-3 shadow-sm">
        <QuickMessageOperations />
      </div>
    </CardContent>
  );
};
