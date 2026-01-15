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
    <CardHeader className="px-3">
      <CardTitle className="flex items-end justify-center text-sm font-bold">
        <div>
          <EwLogo className="mx-auto h-12" />
          <span>{GLOBAL_STRINGS.APP_INFORMATION.APP_NAME}</span>
        </div>
        <span className="pl-2 text-xs">
          by {GLOBAL_STRINGS.APP_INFORMATION.APP_PROVIDER}
        </span>
      </CardTitle>
    </CardHeader>
  );
};
