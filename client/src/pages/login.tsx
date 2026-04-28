import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, FileCheck2, LockKeyhole, SearchCheck, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function GrantPilotLogo() {
  return (
    <div className="flex items-center gap-3" aria-label="GrantPilot">
      <svg
        aria-hidden="true"
        className="h-10 w-10 text-primary"
        viewBox="0 0 48 48"
        fill="none"
      >
        <path
          d="M10 34V14.5C10 11.5 12.4 9 15.5 9H31C34.9 9 38 12.1 38 16C38 19.9 34.9 23 31 23H20"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 23L34 39"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M10 34C15.5 34 18.3 31.8 20 27"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      <div>
        <p className="text-lg font-black tracking-tight text-foreground">GrantPilot</p>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          AI grant office
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const [, setLocation] = useLocation();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Signing you in...");
    window.setTimeout(() => {
      setLocation("/dashboard");
    }, 350);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12),transparent_32rem),linear-gradient(135deg,hsl(var(--background)),hsl(var(--muted)))] text-foreground">
      <a
        href="#login-form"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:shadow-lg"
      >
        Skip to login form
      </a>

      <section className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="flex flex-col justify-between rounded-[2rem] border border-card-border bg-card/80 p-6 shadow-2xl shadow-primary/5 backdrop-blur md:p-10">
          <header className="flex items-center justify-between">
            <GrantPilotLogo />
            <div className="hidden rounded-full border border-border bg-background/70 px-4 py-2 text-sm font-medium text-muted-foreground sm:block">
              Pay only when you win
            </div>
          </header>

          <div className="max-w-2xl py-12 lg:py-20">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Built for nonprofits, towns, and school districts
            </div>
            <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-black leading-[0.95] tracking-[-0.055em] text-foreground">
              Sign in to your AI grant office.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
              GrantPilot finds grant opportunities, drafts the application, checks the work,
              and prepares a clean submission package. Nothing is submitted without approval.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-background/70 p-4">
              <SearchCheck className="mb-3 h-5 w-5 text-primary" aria-hidden="true" />
              <p className="text-sm font-bold">Find grants</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Search current grant sources.</p>
            </div>
            <div className="rounded-2xl bg-background/70 p-4">
              <FileCheck2 className="mb-3 h-5 w-5 text-primary" aria-hidden="true" />
              <p className="text-sm font-bold">Draft packets</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Create review-ready sections.</p>
            </div>
            <div className="rounded-2xl bg-background/70 p-4">
              <CheckCircle2 className="mb-3 h-5 w-5 text-primary" aria-hidden="true" />
              <p className="text-sm font-bold">Check rules</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Flag missing items before submission.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <section
            id="login-form"
            aria-labelledby="login-heading"
            className="w-full max-w-md rounded-[2rem] border border-card-border bg-card p-6 shadow-2xl shadow-black/5 md:p-8"
          >
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <LockKeyhole className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 id="login-heading" className="text-xl font-black tracking-tight">
                Client login
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Enter any email and password to open the GrantPilot demo session.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  data-testid="input-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="client@example.org"
                  required
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  data-testid="input-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                  className="h-12 rounded-xl"
                />
              </div>

              <Button
                data-testid="button-login"
                type="submit"
                size="lg"
                className="h-12 w-full rounded-xl text-sm font-bold"
              >
                Sign in
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </form>

            {message ? (
              <div
                data-testid="status-login-message"
                className="mt-5 rounded-xl border border-primary/20 bg-primary/10 p-3 text-sm font-medium text-primary"
                role="status"
              >
                {message}
              </div>
            ) : null}

            <div className="mt-8 rounded-2xl bg-muted p-4 text-sm leading-6 text-muted-foreground">
              <strong className="font-bold text-foreground">Next step:</strong> connect this
              form to Supabase Auth after the demo login flow works.
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
