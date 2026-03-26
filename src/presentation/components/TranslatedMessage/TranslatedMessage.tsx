import EW_LOGO from "~@/presentation/assets/ew-logo.svg";

interface Props {
  message: string;
}

export const TranslatedMessage: React.FC<Props> = ({ message }) => {
  return (
    <div
      style={{
        marginTop: "4px",
        padding: "4px",
        backgroundColor: "oklch(0.269 0 0)",
        borderRadius: "4px",
        border: "2px solid oklch(0.8 0.15 70)",
        fontSize: "0.9em",
        fontWeight: "500",
        color: "white",
        display: "flex",
        gap: "0.2rem",
        alignItems: "center",
      }}
    >
      <img
        src={EW_LOGO}
        alt="estrellas webcam"
        style={{ width: "25px", height: "25px" }}
      />
      <span>{message}</span>
    </div>
  );
};
