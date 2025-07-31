/**
 * QuickMessageOperations Component
 *
 * Component that handles the quick message operations section.
 *
 * @module components/Popup/QuickMessageOperations
 * @returns {JSX.Element} - Returns the JSX element representing the quick message operations.
 */

import { QuickMessageOptions } from "../../QuickMessages/QuickMessageOptions/QuickMessageOptions";
import { LabelOptions } from "../../QuickMessages/QuickMessageOptions/types";
import { Label } from "../../ui/label";
import { QUICK_MESSAGE_OPERATIONS } from "./strings.json";

const quickMessageOptions: LabelOptions[] = ["add", "update", "delete"];

export const QuickMessageOperations = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Label className="text-sm">{QUICK_MESSAGE_OPERATIONS.TITLE}</Label>
      <div className="flex flex-row">
        {quickMessageOptions.map((opt) => (
          <QuickMessageOptions label={opt} key={opt} />
        ))}
      </div>
    </div>
  );
};
