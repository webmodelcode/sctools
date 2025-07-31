import { Download, Upload } from "lucide-react";
import { TooltipButton } from "../../TooltipButton/TooltipButton";
import { ButtonVariant } from "../../ui/button";
import { ImportForm } from "./ImportForm";
import { ExportForm } from "./ExportForm";

export const QuickMessageDataOperations = () => {
  return [
    {
      label: "Importar",
      buttonLabel: <Upload />,
      buttonVariant: "outline",
      buttonClassName: "m-1 px-2",
      havePopUp: true,
      dialogHeader: "Importar mensajes",
      dialogDescription: "Pega los mensajes que exportaste previamente",
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
      dialogDescription:
        "Copia y pega el contenido de los mensajes para crear un respaldo",
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
      dialogDescription={opt.dialogDescription}
      dialogContent={opt.dialogContent}
    />
  ));
};
