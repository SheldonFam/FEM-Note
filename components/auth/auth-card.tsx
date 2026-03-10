import Image from "next/image";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-2xl bg-background px-8 py-10 shadow-sm">
      <div className="mb-6 flex justify-center">
        <Image
          src="/assets/images/logo.svg"
          alt="Notes"
          width={95}
          height={28}
          priority
          className="h-7 w-auto"
        />
      </div>

      <h1 className="text-center text-2xl font-bold tracking-tight">
        {title}
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        {description}
      </p>

      <div className="mt-8">{children}</div>
    </div>
  );
}
