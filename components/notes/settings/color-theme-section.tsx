import { Palette } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type ThemeValue = "light" | "dark" | "system";

const themeOptions = [
  {
    value: "light" as const,
    title: "Light Mode",
    description: "Pick a clean and classic light theme",
  },
  {
    value: "dark" as const,
    title: "Dark Mode",
    description: "Select a sleek and modern dark theme",
  },
  {
    value: "system" as const,
    title: "System",
    description: "Adapts to your device's theme",
  },
];

interface ColorThemeSectionProps {
  value: ThemeValue;
  onValueChange: (value: ThemeValue) => void;
  onApply: () => void;
}

export function ColorThemeSection({
  value,
  onValueChange,
  onApply,
}: ColorThemeSectionProps) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold">Color Theme</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose your color theme:
      </p>

      <RadioGroup
        value={value}
        onValueChange={(v) => onValueChange(v as ThemeValue)}
        className="mt-6"
      >
        {themeOptions.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card px-4 py-4 transition-colors hover:bg-accent"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground">
                <Palette className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">{option.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </div>
            <RadioGroupItem value={option.value} />
          </label>
        ))}
      </RadioGroup>

      <div className="mt-6 flex justify-end">
        <Button type="button" onClick={onApply}>
          Apply Changes
        </Button>
      </div>
    </div>
  );
}
