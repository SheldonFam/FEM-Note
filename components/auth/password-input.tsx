"use client";

import { forwardRef, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PasswordInputProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  hint?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ hint, className, ...props }, ref) {
    const [visible, setVisible] = useState(false);

    return (
      <div>
        <div className="relative">
          <Input
            ref={ref}
            type={visible ? "text" : "password"}
            className={cn("pr-10", className)}
            {...props}
          />
          <Button
            type="button"
            variant="unstyled"
            size="none"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            <Image
              src={
                visible
                  ? "/assets/images/icon-hide-password.svg"
                  : "/assets/images/icon-show-password.svg"
              }
              alt=""
              width={20}
              height={20}
              className="size-5"
            />
          </Button>
        </div>
        {hint ? (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Image
              src="/assets/images/icon-info.svg"
              alt=""
              width={16}
              height={16}
              className="size-4"
            />
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
