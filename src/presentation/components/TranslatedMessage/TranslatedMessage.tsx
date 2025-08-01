interface Props {
  message: string;
  bgColor: string;
}

export const TranslatedMessage: React.FC<Props> = ({ message, bgColor }) => {
  return (
    <div
      style={{
        marginTop: "4px",
        padding: "4px",
        backgroundColor: bgColor,
        borderRadius: "4px",
        fontSize: "0.9em",
      }}
    >
      🌐 <span>{message}</span>
    </div>
  );
};
