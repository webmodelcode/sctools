import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import languagesSupported from "./languagesSupported";
import { LANGUAGE_SELECTOR } from "./languageSelector.strings.json";

import { cn } from "~@/presentation/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useLocalTranslatorTargetLanguage } from "~@/presentation/hooks/useLocalTranslatorTargetLanguage/useLocalTranslatorTargetLanguage";
import { TooltipTriggerAsChild } from "../ui/own/tooltip-trigger-aschild";

export const LanguageSelector = () => {
  const { setItem, getItem, watchItem } = useLocalTranslatorTargetLanguage();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>("");

  const init = async () => {
    const currentValue = await getItem();
    setValue(currentValue);
  };

  useEffect(() => {
    init();
  }, []);

  watchItem((newValue) => {
    setValue(newValue);
  });

  const handleSelect = async (currentValue: string) => {
    await setItem(currentValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <TooltipTriggerAsChild tooltipText="Selecciona el idioma al que deseas traducir tus mensajes">
          <div
            aria-expanded={open}
            className="flex items-center justify-between gap-2 rounded-sm border border-accent bg-ew-star-color px-3 py-2 transition-colors duration-500 ease-in-out hover:cursor-pointer hover:bg-background"
          >
            {value
              ? languagesSupported.find((language) => language.value === value)
                  ?.label
              : LANGUAGE_SELECTOR.SELECT_LANGUAGE}
            <ChevronsUpDown className="size-4" />
          </div>
        </TooltipTriggerAsChild>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0">
        <Command>
          <CommandInput
            placeholder={LANGUAGE_SELECTOR.SEARCH_PLACEHOLDER}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>{LANGUAGE_SELECTOR.NO_LANGUAGE_FOUND}</CommandEmpty>
            <CommandGroup>
              {languagesSupported.map((language) => (
                <CommandItem
                  key={language.value}
                  value={language.value}
                  onSelect={handleSelect}
                >
                  {language.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === language.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
