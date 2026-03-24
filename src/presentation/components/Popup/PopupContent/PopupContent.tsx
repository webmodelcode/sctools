/**
 * PopupContent Component
 *
 * Main content section of the popup containing the extension toggle and quick message operations.
 *
 * @module components/Popup/PopupContent
 * @returns {JSX.Element} - Returns the JSX element representing the popup content.
 */

import { useFeaturesStatus } from "~@/presentation/hooks/useFeaturesStatus/useFeaturesStatus";
import { QuickMessagesList } from "../../QuickMessages/QuickMessagesList/QuickMessagesList";
import { CardContent } from "../../ui/card";
import { QuickMessageOperations } from "../QuickMessageOperations/QuickMessageOperations";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~@/presentation/components/ui/tabs";
import { ExtensionToggle } from "../ExtensionToggle/ExtensionToggle";

export const PopupContent = () => {
  const { translator, quickMessages, quickMenu } = useFeaturesStatus();

  return (
    <CardContent className="px-4">
      <Tabs defaultValue="quickMessages" className="w-full">
        <TabsList className="w-full bg-secondary/30">
          <TabsTrigger
            className="cursor-pointer text-white data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            value="quickMessages"
          >
            Mensajes Rápidos
          </TabsTrigger>
          <TabsTrigger
            className="cursor-pointer text-white data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            value="features"
          >
            Funcionalidades
          </TabsTrigger>
        </TabsList>
        <TabsContent value="quickMessages">
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg p-3">
            <QuickMessageOperations />
            <QuickMessagesList />
          </div>
        </TabsContent>
        <TabsContent value="features">
          <div className="flex flex-col gap-4">
            <ExtensionToggle
              isEnabled={translator.isEnabled}
              onToggle={translator.toggle}
              orientation="horizontal"
              featureName="Traductor"
              tooltipText="Traduce automáticamente tus mensajes al chatear con tus usuarios"
            />
            <ExtensionToggle
              isEnabled={quickMessages.isEnabled}
              onToggle={quickMessages.toggle}
              orientation="horizontal"
              featureName="Mensajes Rápidos"
              tooltipText="Podrás guardar y enviar rápidamente mensajes dentro de tu chat"
            />
            <ExtensionToggle
              isEnabled={quickMenu.isEnabled}
              onToggle={quickMenu.toggle}
              orientation="horizontal"
              featureName="Menú de Acceso Rápido"
              tooltipText="Tendrás acceso a funciones especiales dentro de cada plataforma"
            />
          </div>
        </TabsContent>
      </Tabs>
    </CardContent>
  );
};
