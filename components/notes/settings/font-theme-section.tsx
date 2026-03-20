import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { FontTheme } from "@/lib/font-theme";
import { cn } from "@/lib/utils";

const fontOptions = [
  {
    value: "sans" as const,
    title: "Sans-serif",
    description: "Clean and modern, easy to read.",
    sampleClassName: "font-sans",
  },
  {
    value: "serif" as const,
    title: "Serif",
    description: "Classic and elegant for a timeless feel.",
    sampleClassName: "font-serif",
  },
  {
    value: "mono" as const,
    title: "Monospace",
    description: "Code-like, great for a technical vibe.",
    sampleClassName: "font-mono",
  },
];

interface FontThemeSectionProps {
  value: FontTheme;
  onValueChange: (value: FontTheme) => void;
  onApply: () => void;
}

export function FontThemeSection({
  value,
  onValueChange,
  onApply,
}: FontThemeSectionProps) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold">Font Theme</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose your font theme:
      </p>

      <RadioGroup
        value={value}
        onValueChange={(v) => onValueChange(v as FontTheme)}
        className="mt-6"
      >
        {fontOptions.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card px-4 py-4 transition-colors hover:bg-accent"
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl border border-border bg-background text-base text-muted-foreground",
                  option.sampleClassName,
                )}
              >
                Aa
              </div>
              <div>
                <p
                  className={cn(
                    "text-sm font-semibold",
                    option.sampleClassName,
                  )}
                >
                  {option.title}
                </p>
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
