/**
 * PopupContent Component
 *
 * Main content section of the popup containing the extension toggle and quick message operations.
 *
 * @module components/Popup/PopupContent
 * @returns {JSX.Element} - Returns the JSX element representing the popup content.
 */

import { QuickMessagesList } from "../../QuickMessages/QuickMessagesList/QuickMessagesList";
import { CardContent } from "../../ui/card";
import { QuickMessageOperations } from "../QuickMessageOperations/QuickMessageOperations";

export const PopupContent = () => {
  return (
    <CardContent className="px-4">
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg p-3">
        <QuickMessageOperations />
        <QuickMessagesList />
      </div>
    </CardContent>
  );
};
