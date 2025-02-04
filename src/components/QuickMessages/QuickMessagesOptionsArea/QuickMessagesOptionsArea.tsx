import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

export const QuickMessagesOptionsArea = () => {
  return (
    <ScrollArea className="sct-h-72 sct-w-48 sct-rounded-md sct-border">
      <div className="p-4">
        <h4 className="sct-mb-4 sct-text-sm sct-font-medium sct-leading-none">
          Quick Messages
        </h4>
        {tags.map((tag) => (
          <>
            <div key={tag} className="text-sm">
              {tag}
            </div>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  );
};
