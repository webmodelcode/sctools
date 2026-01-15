/**
 * PopupContent Component
 *
 * Main content section of the popup containing the extension toggle and quick message operations.
 *
 * @module components/Popup/PopupContent
 * @returns {JSX.Element} - Returns the JSX element representing the popup content.
 */

import { useExtensionState } from "~@/presentation/hooks/useExtensionState";
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
  const { isQuickMenuEnabled, handleToggleExtension } = useExtensionState();

  return (
    <CardContent className="px-4">
      <Tabs defaultValue="quickMessages" className="w-full">
        <TabsList className="w-full bg-secondary/30">
          <TabsTrigger value="quickMessages">Mensajes Rápidos</TabsTrigger>
          <TabsTrigger value="features">Funcionalidades</TabsTrigger>
        </TabsList>
        <TabsContent value="quickMessages">
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg p-3">
            <QuickMessageOperations />
            <QuickMessagesList />
          </div>
        </TabsContent>
        <TabsContent value="features">
          <ExtensionToggle
            isEnabled={isQuickMenuEnabled}
            onToggle={handleToggleExtension}
          />
        </TabsContent>
      </Tabs>
    </CardContent>
  );
};
