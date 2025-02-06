/**
 * StatusIndicator Component
 *
 * The `StatusIndicator` component monitors and displays the current status of the streaming service. Only Stripchat is compatible.
 * It periodically checks the DOM for updates and reflects the status in the UI.
 *
 * @module components/Statusindicator
 * @returns {JSX.Element} - Returns the JSX element representing the status indicator.
 */
import { useEffect, useState } from "react";
import { scAdapter, SC_STRINGS } from "@/config";

export const StatusIndicator = () => {
  const [scStatus, setScStatus] = useState("");

  useEffect(() => {
    setInterval(() => {
      try {
        const statusIndicator = scAdapter.getScElementByClassName(
          SC_STRINGS.STREAMING_STATUS.CLASS
        );

        setScStatus(
          statusIndicator?.childNodes[1]?.textContent?.toLocaleLowerCase() ?? ""
        );
      } catch (error) {
        return error;
      }
    }, 10000);
  }, []);

  const testRole = "statusIndicator";
  return (
    <div role={testRole} className="sct-status-indicator">
      <div className={`sct-indicator-dot ${scStatus}`} />
      <p className={`sct-status-text ${scStatus}`}>
        {scStatus.substring(0, 3) || "..."}
      </p>
    </div>
  );
};
