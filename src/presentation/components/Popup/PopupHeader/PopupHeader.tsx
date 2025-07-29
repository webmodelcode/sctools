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

export const PopupHeader = () => {
  return (
    <CardHeader className="flex flex-row items-center justify-around space-y-0 p-3">
      <CardTitle className="text-2xl font-bold">
        <EwLogo className="mx-auto h-32" />
        <span>ScTools</span>
        <span className="pl-2 text-sm">by Estrellas Webcam</span>
      </CardTitle>
    </CardHeader>
  );
};
