import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="relative mb-8 flex items-center justify-center">
        <h1 className="text-[12rem] font-bold leading-none tracking-tighter text-muted/20 sm:text-[16rem]">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="max-w-48 text-lg font-medium text-foreground sm:text-xl">
            This link seems to have vanished into the void.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Page Not Found</h2>
          <p className="mx-auto max-w-sm text-muted-foreground">
            The vault entry you&apos;re looking for doesn&apos;t exist or has been moved to a different location.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="default" size="lg" className="h-11 px-8">
            <Link href="/">
              <MoveLeft className="mr-2 size-4" />
              Return to Vault
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-11 px-8">
            <Link href="/login">
              Authentication
            </Link>
          </Button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[15%] h-64 w-64 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] h-96 w-96 rounded-full bg-primary/10 blur-[150px]" />
      </div>
    </div>
  );
}
