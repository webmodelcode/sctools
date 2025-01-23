export const StatusIndicator = () => {
  const testRole = "statusIndicator";
  return (
    <div role={testRole} className="sct-status-indicator">
      <div className="sct-indicator-dot " />
      <p className="sct-status-text">...</p>
    </div>
  );
};
