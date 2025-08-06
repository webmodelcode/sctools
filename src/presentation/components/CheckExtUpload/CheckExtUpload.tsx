import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";

import "~@/presentation/assets/globals.css";
import { CloudDownload } from "lucide-react";
import { Button } from "../ui/button";

export const CheckExtUpload = () => {
  const [isUploadAvailable, setIsUploadAvailable] = useState(false);
  const [latestVersion, setLatestVersion] = useState("0.0.0");
  const [downloadUrl, setDownloadUrl] = useState("");

  browser.runtime.sendMessage(
    {
      type: GLOBAL_STRINGS.BG_MESSAGE_TYPE.CHECK_EXT_UPLOAD,
    },
    (response) => {
      if (response) {
        setLatestVersion(response.latestVersion);
        setDownloadUrl(response.downloadUrl);
        setIsUploadAvailable(true);
        toast(
          () => {
            return (
              <div className="flex flex-col items-start justify-center">
                <div className="flex items-start justify-between gap-4">
                  <CloudDownload />
                  <h1 className="text-lg">{`ScTools ${response.latestVersion}`}</h1>
                </div>
                <p className="text-sm">
                  Actualiza a la ultima versión disponible, no olvides respaldar
                  tus mensajes rápidos
                </p>
                <Button
                  className="mt-2 animate-bounce self-end text-sm text-ew-star-color hover:bg-ew-star-color hover:text-white"
                  variant={"outline"}
                  onClick={() => window.open(response.downloadUrl, "_blank")}
                >
                  Descargar
                </Button>
              </div>
            );
          },
          {
            duration: 15000,
          },
        );
        return;
      }
    },
  );

  if (!isUploadAvailable) return;

  return (
    <div>
      <Toaster
        expand
        visibleToasts={20}
        closeButton
        toastOptions={{
          classNames: {
            toast:
              "bg-ew-star-color fixed bottom-4 right-4 p-4 rounded-md text-white border border-white not-hover:animate-pulse max-w-sm",
            title: "text-lg font-bold",
            description: "text-sm",
            closeButton:
              "absolute -top-2 -left-2 h-4 w-4 bg-white rounded-full text-ew-star-color flex items-center justify-center",
            actionButton:
              "border border-white hover:bg-white hover:text-ew-star-color rounded-md px-2 py-0.5 mt-2",
          },
        }}
      />
    </div>
  );
};
