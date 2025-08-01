import { Download, Upload } from "lucide-react";
import { TooltipButton } from "../../TooltipButton/TooltipButton";
import { ImportForm } from "./ImportForm";
import { ExportForm } from "./ExportForm";
import { QUICK_MESSAGE_DATA_OPERATIONS } from "./quickMessageOptions.strings.json";

export const QuickMessageDataOperations = () => {
  return [
    {
      label: QUICK_MESSAGE_DATA_OPERATIONS.IMPORT.LABEL,
      buttonLabel: <Upload />,
      buttonVariant: "outline",
      buttonClassName: "m-1 px-2",
      havePopUp: true,
      dialogHeader: QUICK_MESSAGE_DATA_OPERATIONS.IMPORT.DIALOG_HEADER,
      dialogContent: (
        <ImportForm
          onSuccess={() => {
            console.log("Mensajes importados exitosamente");
          }}
          onError={(error) => {
            console.error("Error al importar:", error);
          }}
        />
      ),
    },
    {
      label: "Exportar",
      buttonLabel: <Download />,
      buttonVariant: "outline",
      buttonClassName: "m-1 px-2",
      havePopUp: true,
      dialogHeader: "Exportar mensajes",
      dialogContent: (
        <ExportForm
          onSuccess={() => {
            console.log("Mensajes exportados exitosamente");
          }}
          onError={(error) => {
            console.error("Error al exportar:", error);
          }}
        />
      ),
    },
  ].map((opt) => (
    <TooltipButton
      key={opt.label}
      label={opt.label}
      buttonLabel={opt.buttonLabel}
      buttonClassName={opt.buttonClassName}
      havePopUp={opt.havePopUp}
      dialogHeader={opt.dialogHeader}
      dialogContent={opt.dialogContent}
    />
  ));
};
