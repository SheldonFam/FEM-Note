import { CircleAlert } from "lucide-react";

interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive">
      <CircleAlert className="size-3.5 shrink-0" />
      {message}
    </p>
  );
}
