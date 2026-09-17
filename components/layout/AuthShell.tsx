import { type ReactNode } from "react";

export function AuthShell({
  children,
  maxWidth = 400,
}: {
  children: ReactNode;
  maxWidth?: 400 | 420 | 480;
}) {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-[1440px] border-x border-border bg-primary">
        <div className="flex justify-center px-8 py-10 sm:px-16 sm:py-16">
          <div
            className="flex w-full flex-col gap-5"
            style={{ maxWidth }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
