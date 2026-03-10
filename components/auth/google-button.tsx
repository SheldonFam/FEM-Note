import Image from "next/image";

export function GoogleButton() {
  return (
    <button
      type="button"
      className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-border bg-card text-sm font-medium transition-colors hover:bg-accent"
    >
      <Image
        src="/assets/images/icon-google.svg"
        alt=""
        width={20}
        height={20}
        className="size-5"
      />
      Google
    </button>
  );
}
