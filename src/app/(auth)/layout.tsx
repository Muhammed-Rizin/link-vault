export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground flex items-center justify-center p-4">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] size-[50%] rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute -bottom-[10%] -right-[10%] size-[50%] rounded-full bg-primary/10 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

      </div>

      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
