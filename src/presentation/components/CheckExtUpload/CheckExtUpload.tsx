import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { useEffect } from "react";

import { CloudDownload } from "lucide-react";
import { Button } from "../ui/button";

import { ExportForm } from "../QuickMessages/QuickMessageOptions/ExportForm";
import { useUpdateNotificationStatus } from "~@/presentation/hooks/useUpdateNotificationStatus/useUpdateNotificationStatus";

import "~@/presentation/assets/globals.css";

const THROTTLE_MS = 12 * 60 * 60 * 1000; // 12 hours

export const CheckExtUpload = () => {
  const { getItem, setItem } = useUpdateNotificationStatus();

  useEffect(() => {
    const checkUpdate = async () => {
      const lastShown = await getItem();

      if (lastShown && Date.now() - lastShown < THROTTLE_MS) {
        return;
      }

      browser.runtime.sendMessage(
        {
          type: GLOBAL_STRINGS.BG_MESSAGE_TYPE.CHECK_EXT_UPLOAD,
        },
        (response) => {
          if (response) {
            setItem(Date.now());
            toast(
              () => {
                return (
                  <div className="flex flex-col items-start justify-center">
                    <div className="flex items-start justify-between gap-4">
                      <CloudDownload />
                      <h1 className="text-lg">{`${GLOBAL_STRINGS.APP_INFORMATION.APP_NAME} ${response.latestVersion} Disponible`}</h1>
                    </div>
                    <p className="text-sm">
                      Antes de actualizar, no olvides respaldar tus mensajes
                      rápidos.
                    </p>
                    <div className="my-2 rounded-md bg-white p-4 text-black">
                      <ExportForm />
                    </div>
                    <Button
                      className="mt-2 self-end text-sm text-ew-star-color hover:bg-ew-star-color hover:text-white"
                      variant={"outline"}
                      onClick={() =>
                        window.open(response.downloadUrl, "_blank")
                      }
                    >
                      Actualizar
                    </Button>
                  </div>
                );
              },
              {
                duration: 15000,
              },
            );
          }
        },
      );
    };

    checkUpdate();
  }, []);

  return (
    <div>
      <Toaster
        expand
        visibleToasts={20}
        closeButton
        toastOptions={{
          classNames: {
            toast:
              "bg-ew-star-color z-1000 fixed bottom-4 right-4 p-4 rounded-md text-white border border-white max-w-sm",
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
