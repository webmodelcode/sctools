import { CircleHelp } from "lucide-react";
import { cn } from "~@/presentation/lib/utils";

interface HelpLinkProps {
  href: string;
  label: string;
  className?: string;
}

export const HelpLink = ({ href, label, className }: HelpLinkProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      "flex items-center gap-1.5 rounded-md bg-black/30 px-2 py-1 text-xs text-white no-underline opacity-30 transition-opacity hover:opacity-100",
      className
    )}
  >
    <CircleHelp className="size-4 shrink-0" />
    {label}
  </a>
);
