/**
 * PopupHeader Component
 *
 * Header section of the popup containing the logo and title.
 *
 * @module components/Popup/PopupHeader
 * @returns {JSX.Element} - Returns the JSX element representing the popup header.
 */

import { CardHeader, CardTitle } from "../../ui/card";
import { EwLogo } from "../../EwLogo/EwLogo";
import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

export const PopupHeader = () => {
  return (
    <CardHeader className="w-full px-3">
      <CardTitle
        className="flex flex-col items-start justify-center text-sm font-bold"
        data-testid="popup-header-title"
      >
        <div
          className="flex items-end"
          data-testid="popup-header-logo-container"
        >
          <EwLogo className="h-12" />
          <div>
            <span className="block">
              {GLOBAL_STRINGS.APP_INFORMATION.APP_NAME_SHORT}
            </span>
            <span>{GLOBAL_STRINGS.APP_INFORMATION.APP_DIVISION}</span>
          </div>
        </div>
        <span className="pl-2 text-xs">
          by {GLOBAL_STRINGS.APP_INFORMATION.APP_PROVIDER}
        </span>
      </CardTitle>
    </CardHeader>
  );
};
