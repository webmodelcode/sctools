import { Download, Upload } from "lucide-react";
import { TooltipDialogButton } from "../../TooltipDialogButton/TooltipDialogButton";
import { ImportForm } from "./ImportForm/ImportForm";
import { ExportForm } from "./ExportForm";
import { QUICK_MESSAGE_DATA_OPERATIONS } from "./quickMessageOptions.strings.json";
import { devConsole } from "~@/config/utils/developerUtils";

export const QuickMessageDataOperations = () => {
  return [
    {
      label: QUICK_MESSAGE_DATA_OPERATIONS.IMPORT.LABEL,
      buttonIcon: <Download />,
      buttonVariant: "outline",
      buttonClassName: "m-1 p-0",
      havePopUp: true,
      dialogHeader: QUICK_MESSAGE_DATA_OPERATIONS.IMPORT.DIALOG_HEADER,
      dialogContent: (
        <ImportForm
          onSuccess={() => {
            devConsole.log("Mensajes importados exitosamente");
          }}
          onError={(error) => {
            devConsole.error("Error al importar:", error);
          }}
        />
      ),
    },
    {
      label: "Exportar",
      buttonIcon: <Upload />,
      buttonVariant: "outline",
      buttonClassName: "m-1 px-2",
      havePopUp: true,
      dialogHeader: "Exportar mensajes",
      dialogContent: (
        <ExportForm
          onSuccess={() => {
            devConsole.log("Mensajes exportados exitosamente");
          }}
          onError={(error) => {
            devConsole.error("Error al exportar:", error);
          }}
        />
      ),
    },
  ].map((opt) => (
    <TooltipDialogButton
      key={opt.label}
      buttonLabel={opt.label}
      buttonIcon={opt.buttonIcon}
      buttonClassName={opt.buttonClassName}
      havePopUp={opt.havePopUp}
      dialogHeader={opt.dialogHeader}
      dialogContent={opt.dialogContent}
    />
  ));
};
