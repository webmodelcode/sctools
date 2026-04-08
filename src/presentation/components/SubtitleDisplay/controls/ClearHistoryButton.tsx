import { Trash2 } from "lucide-react";
import { Button } from "~@/presentation/components/ui/button";
import { TooltipTriggerAsChild } from "~@/presentation/components/ui/own/tooltip-trigger-aschild";

interface ClearHistoryButtonProps {
  onClear: () => void;
}

export const ClearHistoryButton = ({ onClear }: ClearHistoryButtonProps) => (
  <TooltipTriggerAsChild tooltipText="Limpiar historial de subtítulos">
    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClear}>
      <Trash2 className="h-4 w-4" />
    </Button>
  </TooltipTriggerAsChild>
);
