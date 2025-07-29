/**
 * QuickMessageOperations Component
 *
 * Component that handles the quick message operations section.
 *
 * @module components/Popup/QuickMessageOperations
 * @returns {JSX.Element} - Returns the JSX element representing the quick message operations.
 */

import { QuickMessageOptions } from "../../QuickMessages/QuickMessageOptions/QuickMessageOptions";
import { Label } from "../../ui/label";

const quickMessageOptions: readonly ("add" | "update" | "delete")[] = [
  "add",
  "update",
  "delete",
] as const;

export const QuickMessageOperations = () => {
  return (
    <div>
      <Label className="text-sm">Quick Message Operations</Label>
      <div className="flex flex-row">
        {quickMessageOptions.map((opt) => (
          <QuickMessageOptions label={opt} key={opt} />
        ))}
      </div>
    </div>
  );
};