import { Link } from "wouter";
import {
  ArrowRight,
  CalendarClock,
  FileCheck2,
  LogOut,
  SearchCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const opportunities = [
  {
    id: "opf-youth-2026",
    name: "Community Youth Mental Health Mini-Grant",
    funder: "State Department of Health",
    amount: "$25,000 - $75,000",
    deadline: "May 31, 2026",
    score: 94,
    eligible: "Yes",
    status: "Ready to review",
    why: "Strong fit for school districts and nonprofits serving young people.",
  },
  {
    id: "rural-capacity-2026",
    name: "Rural Capacity Building Grant",
    funder: "Federal Assistance Program",
    amount: "Up to $150,000",
    deadline: "June 14, 2026",
    score: 88,
    eligible: "Likely",
    status: "Needs NOFO check",
    why: "Good fit for towns that need planning, staffing, or service capacity.",
  },
  {
    id: "community-foundation-2026",
    name: "Local Community Impact Fund",
    funder: "Community Foundation",
    amount: "$10,000 - $50,000",
    deadline: "Rolling",
    score: 82,
    eligible: "Yes",
    status: "Worth applying",
    why: "Best for local projects with clear community benefit and simple budgets.",
  },
];

function GrantPilotMark() {
  return (
    <svg aria-hidden="true" className="h-10 w-10 text-primary" viewBox="0 0 48 48" fill="none">
      <path
        d="M10 34V14.5C10 11.5 12.4 9 15.5 9H31C34.9 9 38 12.1 38 16C38 19.9 34.9 23 31 23H20"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M20 23L34 39" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M10 34C15.5 34 18.3 31.8 20 27"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ScoreBadge({ score }: { score: number }) {
  return (
    <div className="inline-flex min-w-16 items-center justify-center rounded-full bg-primary px-3 py-1 text-sm font-black text-primary-foreground">
      {score}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12),transparent_32rem),linear-gradient(135deg,hsl(var(--background)),hsl(var(--muted)))] px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl rounded-[2rem] border border-card-border bg-card/90 p-5 shadow-2xl shadow-primary/5 md:p-8">
        <header className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <GrantPilotMark />
            <div>
              <p className="text-lg font-black tracking-tight">GrantPilot</p>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Grant dashboard
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2" aria-label="Dashboard navigation">
            <Button variant="secondary" className="rounded-xl" data-testid="button-status">
              Status
            </Button>
            <Button variant="outline" className="rounded-xl" data-testid="button-run-search">
              <SearchCheck className="h-4 w-4" aria-hidden="true" />
              Run search
            </Button>
            <Button asChild variant="outline" className="rounded-xl" data-testid="button-logout">
              <Link href="/">
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Log out
              </Link>
            </Button>
          </nav>
        </header>

        <section className="grid gap-5 py-7 lg:grid-cols-[1fr_20rem]">
          <div>
            <Badge variant="outline" className="mb-4 rounded-full border-primary/20 bg-primary/10 text-primary">
              Demo data until live grant search is connected
            </Badge>
            <h1 className="max-w-3xl text-[clamp(2rem,4vw,3.5rem)] font-black leading-[0.98] tracking-[-0.055em]">
              Your strongest grant opportunities.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              GrantPilot shows only matches scoring 70 or higher. Next, we will connect this
              dashboard to real-time grant search and your Supabase project.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
            <div className="rounded-2xl bg-background/70 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Found</p>
              <p className="mt-2 text-xl font-black">12</p>
            </div>
            <div className="rounded-2xl bg-background/70 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Shown</p>
              <p className="mt-2 text-xl font-black">3</p>
            </div>
            <div className="rounded-2xl bg-background/70 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Best</p>
              <p className="mt-2 text-xl font-black">94</p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_22rem]">
          <div className="overflow-hidden rounded-3xl border border-border bg-background/70">
            <div className="flex flex-col gap-2 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-black">Opportunity table</h2>
                <p className="mt-1 text-sm text-muted-foreground">Only 70+ match scores are shown.</p>
              </div>
              <Badge className="w-fit rounded-full">3 high-fit grants</Badge>
            </div>

            <div className="hidden xl:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Grant Name</TableHead>
                    <TableHead>Funder</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Match Score</TableHead>
                    <TableHead>Eligible?</TableHead>
                    <TableHead>Why It Fits</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opportunities.map((grant) => (
                    <TableRow key={grant.id} data-testid={`row-grant-${grant.id}`}>
                      <TableCell className="max-w-56 font-bold">{grant.name}</TableCell>
                      <TableCell>{grant.funder}</TableCell>
                      <TableCell>{grant.amount}</TableCell>
                      <TableCell>{grant.deadline}</TableCell>
                      <TableCell>
                        <ScoreBadge score={grant.score} />
                      </TableCell>
                      <TableCell>{grant.eligible}</TableCell>
                      <TableCell className="max-w-72 text-muted-foreground">{grant.why}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="grid gap-3 p-4 xl:hidden">
              {opportunities.map((grant) => (
                <article
                  key={grant.id}
                  className="rounded-2xl border border-border bg-card p-4"
                  data-testid={`card-grant-${grant.id}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-black leading-6">{grant.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{grant.funder}</p>
                    </div>
                    <ScoreBadge score={grant.score} />
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="font-bold text-muted-foreground">Amount</dt>
                      <dd>{grant.amount}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-muted-foreground">Deadline</dt>
                      <dd>{grant.deadline}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-muted-foreground">Eligible?</dt>
                      <dd>{grant.eligible}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-muted-foreground">Status</dt>
                      <dd>{grant.status}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{grant.why}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl bg-primary p-5 text-primary-foreground">
              <Sparkles className="mb-4 h-6 w-6" aria-hidden="true" />
              <h2 className="text-lg font-black">Next recommended action</h2>
              <p className="mt-3 text-sm leading-6 opacity-90">
                Review the top match first. The next build step will create the opportunity page
                and add the “Yes let’s apply!” button.
              </p>
              <Button
                className="mt-5 w-full rounded-xl border border-white/20 bg-white text-primary hover:bg-white/90"
                data-testid="button-review-top-match"
              >
                Review top match
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            <div className="rounded-3xl bg-background/70 p-5">
              <CalendarClock className="mb-4 h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="text-lg font-black">Deadline watch</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Earliest deadline: May 31, 2026. Calendar reminders will be connected later.
              </p>
            </div>

            <div className="rounded-3xl bg-background/70 p-5">
              <ShieldCheck className="mb-4 h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="text-lg font-black">GrantPilot rule</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Nothing gets submitted until the client says “Approved — Submit This.”
              </p>
            </div>

            <div className="rounded-3xl bg-background/70 p-5">
              <FileCheck2 className="mb-4 h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="text-lg font-black">Source note</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                These are sample grants. Live sources will be wired after the core pages work.
              </p>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}
