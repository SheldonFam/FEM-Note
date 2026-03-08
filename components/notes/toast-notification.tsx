import Link from "next/link";
import { X } from "lucide-react";
import { toast } from "sonner";

function CheckIcon() {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#21C16B]">
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.5 6L5 8.5L9.5 3.5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

interface ToastContentProps {
  message: string;
  linkLabel?: string;
  linkHref?: string;
  toastId: string | number;
}

function ToastContent({
  message,
  linkLabel,
  linkHref,
  toastId,
}: ToastContentProps) {
  return (
    <div className="flex w-full min-w-[360px] max-w-md items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
      <CheckIcon />
      <p className="flex-1 text-sm text-foreground">{message}</p>
      {linkLabel && linkHref ? (
        <Link
          href={linkHref}
          className="shrink-0 text-sm font-medium text-foreground underline underline-offset-2"
          onClick={() => toast.dismiss(toastId)}
        >
          {linkLabel}
        </Link>
      ) : null}
      <button
        type="button"
        onClick={() => toast.dismiss(toastId)}
        className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Dismiss"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export function showToast(
  message: string,
  options?: { linkLabel?: string; linkHref?: string }
) {
  toast.custom((id) => (
    <ToastContent
      message={message}
      linkLabel={options?.linkLabel}
      linkHref={options?.linkHref}
      toastId={id}
    />
  ));
}
