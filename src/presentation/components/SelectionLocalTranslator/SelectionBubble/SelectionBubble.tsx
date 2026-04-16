import { EwLogo } from "~@/presentation/components/EwLogo/EwLogo";
import { Button } from "../../ui/button";

export interface SelectionBubbleProps {
  rect: DOMRect;
  onHover: () => void;
}

export const SelectionBubble = ({ rect, onHover }: SelectionBubbleProps) => {
  const top = rect.top + window.scrollY - 36;
  const left = rect.left + window.scrollX + rect.width / 2 - 14;

  return (
    <div>
      <Button
        data-testid="selection-bubble-button"
        aria-label="Translate selection"
        className="pointer-events-auto absolute z-1000000 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-secondary shadow-lg"
        style={{
          top: `${top}px`,
          left: `${left}px`,
        }}
        onMouseEnter={onHover}
      >
        <EwLogo className="h-4 w-4" />
      </Button>
    </div>
  );
};
