import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  FileText,
  FolderOpen,
  Loader2,
  Lock,
  LogOut,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Opportunity = {
  id: string;
  name: string;
  funder: string;
  amount: string;
  deadline: string;
  daysLeft: number;
  score: number;
  eligible: "Yes" | "Likely" | "Unsure";
  status: "Found" | "Brief Ready" | "Rules Review" | "Drafting" | "Ready to Submit";
  nextStep: string;
  quality: number;
  factCheck: "Passed" | "In progress" | "Not started";
  confidence: "High" | "Medium" | "Low";
  risk: "Low" | "Medium" | "High";
  why: string;
};

const baseOpportunities: Opportunity[] = [
  {
    id: "opf-youth-2026",
    name: "Community Youth Mental Health Mini-Grant",
    funder: "State Department of Health",
    amount: "$25,000 - $75,000",
    deadline: "May 31, 2026",
    daysLeft: 33,
    score: 94,
    eligible: "Yes",
    status: "Brief Ready",
    nextStep: "Review brief",
    quality: 86,
    factCheck: "Passed",
    confidence: "High",
    risk: "Low",
    why: "Applicant type, youth focus, and deadline all look strong.",
  },
  {
    id: "rural-capacity-2026",
    name: "Rural Capacity Building Grant",
    funder: "Federal Assistance Program",
    amount: "Up to $150,000",
    deadline: "June 14, 2026",
    daysLeft: 47,
    score: 88,
    eligible: "Likely",
    status: "Rules Review",
    nextStep: "Finish NOFO check",
    quality: 0,
    factCheck: "Not started",
    confidence: "Medium",
    risk: "Low",
    why: "Good fit for towns that need planning, staffing, or service capacity.",
  },
  {
    id: "community-foundation-2026",
    name: "Local Community Impact Fund",
    funder: "Community Foundation",
    amount: "$10,000 - $50,000",
    deadline: "Rolling",
    daysLeft: 90,
    score: 82,
    eligible: "Yes",
    status: "Found",
    nextStep: "Generate brief",
    quality: 0,
    factCheck: "Not started",
    confidence: "Medium",
    risk: "Low",
    why: "Best for local projects with clear community benefit and simple budgets.",
  },
];

const refreshedOpportunities: Opportunity[] = [
  {
    id: "education-equity-2026",
    name: "Education Equity Innovation Grant",
    funder: "Department of Education",
    amount: "$50,000 - $200,000",
    deadline: "July 8, 2026",
    daysLeft: 71,
    score: 91,
    eligible: "Yes",
    status: "Found",
    nextStep: "Generate brief",
    quality: 0,
    factCheck: "Not started",
    confidence: "High",
    risk: "Low",
    why: "Matches school-aged program scope and equity outcome focus.",
  },
  {
    id: "afterschool-2026",
    name: "Afterschool Enrichment Block Grant",
    funder: "State Education Agency",
    amount: "$15,000 - $40,000",
    deadline: "June 28, 2026",
    daysLeft: 61,
    score: 79,
    eligible: "Likely",
    status: "Found",
    nextStep: "Confirm eligibility",
    quality: 0,
    factCheck: "Not started",
    confidence: "Medium",
    risk: "Medium",
    why: "Demographic match is strong; check matching-funds requirement.",
  },
];

const baseReadinessItems = [
  { id: "profile", label: "Organization profile complete", done: true },
  { id: "ein", label: "EIN added", done: true },
  { id: "sam", label: "SAM.gov status confirmed", done: false },
  { id: "signer", label: "Authorized signer added", done: false },
  { id: "budget", label: "Annual budget uploaded", done: true },
  { id: "program", label: "Program description added", done: true },
  { id: "past", label: "Past grants listed", done: false },
];

const baseMissingInfo = [
  { id: "sam-q", label: "Are you registered in SAM.gov?", priority: "High" },
  { id: "signer-q", label: "Who is allowed to sign applications?", priority: "High" },
  { id: "board-q", label: "Upload board list or governing body roster.", priority: "Medium" },
  { id: "past-q", label: "Add past grants won — or write none.", priority: "Medium" },
];

const baseDocuments = [
  { name: "Annual budget", status: "Uploaded" as const },
  { name: "IRS determination letter", status: "Uploaded" as const },
  { name: "Board list", status: "Missing" as const },
  { name: "Letters of support", status: "Needed later" as const },
  { name: "Program budget", status: "Uploaded" as const },
  { name: "Authorized signer letter", status: "Missing" as const },
];

const CATEGORY_LABEL: Record<string, string> = {
  grant: "Grant material",
  law: "Law / compliance",
  budget: "Budget / finance",
  program: "Program evidence",
};

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

function ProgressBar({ value, label }: { value: number; label?: string }) {
  return (
    <div
      className="h-2 overflow-hidden rounded-full bg-border"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
    </div>
  );
}

function readSetupParams() {
  if (typeof window === "undefined") return null;
  const search = window.location.search.replace(/^\?/, "");
  if (!search) return null;
  const params = new URLSearchParams(search);
  return {
    ready: Number(params.get("ready") ?? "62"),
    files: Number(params.get("files") ?? "0"),
    cats: (params.get("cats") ?? "").split(",").filter(Boolean),
    analyzed: params.get("analyzed") === "1",
  };
}

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const [setupContext, setSetupContext] = useState(() => readSetupParams());

  useEffect(() => {
    function onChange() {
      setSetupContext(readSetupParams());
    }
    window.addEventListener("popstate", onChange);
    window.addEventListener("hashchange", onChange);
    return () => {
      window.removeEventListener("popstate", onChange);
      window.removeEventListener("hashchange", onChange);
    };
  }, []);

  const setupReadiness = setupContext?.ready;
  const setupFiles = setupContext?.files ?? 0;
  const setupCats = setupContext?.cats ?? [];
  const setupAnalyzed = setupContext?.analyzed ?? false;

  const [opportunities, setOpportunities] = useState<Opportunity[]>(baseOpportunities);
  const [searchRunning, setSearchRunning] = useState(false);
  const [searchRan, setSearchRan] = useState(false);
  const [submissionTarget, setSubmissionTarget] = useState<Opportunity | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [submittedIds, setSubmittedIds] = useState<string[]>([]);
  const [activity, setActivity] = useState<string[]>(() => {
    const lines = ["GrantPilot dashboard loaded — submission guardrail is active."];
    if (setupContext) {
      lines.unshift(
        `Setup analyzed ${setupContext.files} file${setupContext.files === 1 ? "" : "s"} across ${setupContext.cats.length} categor${setupContext.cats.length === 1 ? "y" : "ies"}.`,
      );
    }
    lines.push("3 strong opportunities surfaced after AI scoring.");
    lines.push("9 weak matches filtered out (score < 70).");
    return lines;
  });

  const readinessItems = useMemo(() => {
    if (!setupContext) return baseReadinessItems;
    const updated = baseReadinessItems.map((item) => {
      if (item.id === "budget" && setupCats.includes("budget")) return { ...item, done: true };
      if (item.id === "program" && setupCats.includes("program")) return { ...item, done: true };
      if (item.id === "past" && setupCats.includes("grant") && setupFiles >= 2)
        return { ...item, done: true };
      return item;
    });
    return updated;
  }, [setupContext, setupCats, setupFiles]);

  const readinessDone = readinessItems.filter((item) => item.done).length;
  const readinessScore = setupReadiness ?? Math.round((readinessDone / readinessItems.length) * 100);

  const missingInfo = useMemo(() => {
    if (!setupCats.includes("law")) return baseMissingInfo;
    return baseMissingInfo.filter((item) => item.id !== "board-q");
  }, [setupCats]);

  const documents = useMemo(() => {
    if (!setupCats.includes("law")) return baseDocuments;
    return baseDocuments.map((doc) =>
      doc.name === "IRS determination letter" || doc.name === "Annual budget"
        ? { ...doc, status: "Uploaded" as const }
        : doc,
    );
  }, [setupCats]);

  const stats = useMemo(() => {
    const strong = opportunities.filter((o) => o.score >= 85).length;
    const active = opportunities.filter(
      (o) => o.status === "Brief Ready" || o.status === "Rules Review" || o.status === "Drafting",
    ).length;
    const missingDocs = documents.filter((d) => d.status === "Missing").length;
    const nextDeadline = opportunities
      .filter((o) => o.daysLeft > 0)
      .sort((a, b) => a.daysLeft - b.daysLeft)[0];
    return {
      strong,
      active,
      missing: missingDocs,
      nextDeadline: nextDeadline?.deadline ?? "—",
      nextDays: nextDeadline?.daysLeft ?? 0,
    };
  }, [opportunities, documents]);

  function logActivity(line: string) {
    setActivity((current) => [`Just now — ${line}`, ...current]);
  }

  function runSearch() {
    if (searchRunning) return;
    setSearchRunning(true);
    logActivity("AI grant search started against Grants.gov, SAM.gov, and foundation feeds (demo).");
    window.setTimeout(() => {
      setOpportunities((current) => {
        const existingIds = new Set(current.map((o) => o.id));
        const additions = refreshedOpportunities.filter((o) => !existingIds.has(o.id));
        return [...current, ...additions].sort((a, b) => b.score - a.score);
      });
      setSearchRan(true);
      setSearchRunning(false);
      logActivity(
        `AI grant search complete — ${refreshedOpportunities.length} new opportunities scored above 70.`,
      );
    }, 850);
  }

  function generateBrief(opp: Opportunity) {
    setOpportunities((current) =>
      current.map((o) =>
        o.id === opp.id
          ? {
              ...o,
              status: "Brief Ready",
              nextStep: "Review brief",
              quality: 80,
              factCheck: "In progress",
            }
          : o,
      ),
    );
    logActivity(`Brief generated for ${opp.name}. Awaiting client review.`);
  }

  function openSubmissionDialog(opp: Opportunity) {
    setSubmissionTarget(opp);
    setConfirmText("");
  }

  function confirmSubmission() {
    if (!submissionTarget) return;
    setSubmittedIds((current) => [...current, submissionTarget.id]);
    setOpportunities((current) =>
      current.map((o) =>
        o.id === submissionTarget.id
          ? { ...o, status: "Ready to Submit", nextStep: "Awaiting funder confirmation" }
          : o,
      ),
    );
    logActivity(`${submissionTarget.name} marked Ready to Submit after explicit approval.`);
    setSubmissionTarget(null);
    setConfirmText("");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12),transparent_32rem),linear-gradient(135deg,hsl(var(--background)),hsl(var(--muted)))] px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl rounded-[2rem] border border-card-border bg-card/90 p-5 shadow-2xl shadow-primary/5 md:p-8">
        <header className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <GrantPilotMark />
            <div>
              <p className="text-lg font-black tracking-tight">GrantPilot</p>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                AI grant command center
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2" aria-label="Dashboard navigation">
            <Button asChild variant="secondary" className="rounded-xl" data-testid="button-setup">
              <Link href="/setup">
                <FolderOpen className="h-4 w-4" aria-hidden="true" />
                Setup files
              </Link>
            </Button>
            <Button
              type="button"
              className="rounded-xl"
              data-testid="button-run-search"
              onClick={runSearch}
              disabled={searchRunning}
            >
              {searchRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Searching...
                </>
              ) : (
                <>
                  <SearchCheck className="h-4 w-4" aria-hidden="true" />
                  Run AI search
                </>
              )}
            </Button>
            <Button asChild variant="outline" className="rounded-xl" data-testid="button-logout">
              <Link href="/">
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Log out
              </Link>
            </Button>
          </nav>
        </header>

        <section className="grid gap-5 py-7 lg:grid-cols-[1fr_22rem]">
          <div>
            <Badge
              variant="outline"
              className="mb-4 rounded-full border-primary/20 bg-primary/10 text-primary"
              data-testid="badge-search-state"
            >
              {searchRan
                ? `Search refreshed · ${opportunities.length} opportunities scored`
                : setupAnalyzed
                ? `Setup analyzed · ${setupFiles} files indexed across ${setupCats.length} categories`
                : "Demo data until live grant search is connected"}
            </Badge>
            <h1 className="max-w-3xl text-[clamp(2rem,4vw,3.5rem)] font-black leading-[0.98] tracking-[-0.055em]">
              Your AI grant office is ready.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              GrantPilot scored grants against your setup files, ranked the best fits, drafted
              briefs, and locked submission behind explicit approval. Nothing is submitted without
              your sign-off.
            </p>

            {setupAnalyzed && setupCats.length > 0 ? (
              <div
                className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground"
                data-testid="panel-setup-summary"
              >
                <p className="font-bold text-foreground">Setup feed used for scoring:</p>
                <p className="mt-2">
                  {setupCats.map((c) => CATEGORY_LABEL[c] ?? c).join(", ")} ·{" "}
                  {setupFiles} file{setupFiles === 1 ? "" : "s"}
                </p>
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3" data-testid="grid-dashboard-stats">
            <div className="rounded-2xl bg-background/70 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Strong
              </p>
              <p className="mt-2 text-xl font-black" data-testid="stat-strong">
                {stats.strong}
              </p>
            </div>
            <div className="rounded-2xl bg-background/70 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Active
              </p>
              <p className="mt-2 text-xl font-black" data-testid="stat-active">
                {stats.active}
              </p>
            </div>
            <div className="rounded-2xl bg-background/70 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Missing docs
              </p>
              <p className="mt-2 text-xl font-black" data-testid="stat-missing">
                {stats.missing}
              </p>
            </div>
            <div className="rounded-2xl bg-background/70 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Next deadline
              </p>
              <p className="mt-2 text-xl font-black" data-testid="stat-deadline">
                {stats.nextDeadline}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_24rem]">
          <div className="space-y-5">
            <div
              className="overflow-hidden rounded-3xl border border-border bg-background/70"
              data-testid="panel-opportunity-table"
            >
              <div className="flex flex-col gap-2 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-black">AI opportunity match</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Only grants scoring 70 or higher are shown. Click a row to take action.
                  </p>
                </div>
                <Badge className="w-fit rounded-full">
                  {opportunities.length} shown · 9 filtered · 12 scanned
                </Badge>
              </div>

              <div className="hidden 2xl:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Grant Name</TableHead>
                      <TableHead>Funder</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Next Step</TableHead>
                      <TableHead className="w-44">Action</TableHead>
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
                        <TableCell>
                          <Badge variant="outline" className="rounded-full">
                            {grant.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{grant.nextStep}</TableCell>
                        <TableCell>
                          {grant.status === "Brief Ready" ? (
                            <Button
                              size="sm"
                              type="button"
                              className="rounded-lg"
                              onClick={() => openSubmissionDialog(grant)}
                              data-testid={`button-submit-${grant.id}`}
                              disabled={submittedIds.includes(grant.id)}
                            >
                              {submittedIds.includes(grant.id) ? "Submitted" : "Approve & submit"}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              type="button"
                              className="rounded-lg"
                              onClick={() => generateBrief(grant)}
                              data-testid={`button-brief-${grant.id}`}
                            >
                              Generate brief
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="grid gap-3 p-4 2xl:hidden">
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
                    <div className="mt-4 flex flex-wrap gap-2">
                      {grant.status === "Brief Ready" ? (
                        <Button
                          className="flex-1 rounded-xl"
                          data-testid={`button-submit-${grant.id}`}
                          type="button"
                          onClick={() => openSubmissionDialog(grant)}
                          disabled={submittedIds.includes(grant.id)}
                        >
                          <Lock className="h-4 w-4" aria-hidden="true" />
                          {submittedIds.includes(grant.id) ? "Submitted" : "Approve & submit"}
                        </Button>
                      ) : (
                        <Button
                          className="flex-1 rounded-xl"
                          variant="outline"
                          data-testid={`button-brief-${grant.id}`}
                          type="button"
                          onClick={() => generateBrief(grant)}
                        >
                          Generate brief
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <section
                className="rounded-3xl bg-background/70 p-5"
                data-testid="panel-pipeline"
              >
                <h2 className="flex items-center gap-2 text-lg font-black">
                  <ClipboardCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                  Application pipeline
                </h2>
                <div className="mt-4 space-y-3">
                  {opportunities.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl bg-card p-4"
                      data-testid={`pipeline-${item.id}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-bold">{item.name}</p>
                        <Badge variant="outline" className="rounded-full">
                          {submittedIds.includes(item.id) ? "Approved" : item.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">Next: {item.nextStep}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section
                className="rounded-3xl bg-background/70 p-5"
                data-testid="panel-document-vault"
              >
                <h2 className="flex items-center gap-2 text-lg font-black">
                  <FileCheck2 className="h-5 w-5 text-primary" aria-hidden="true" />
                  Document vault
                </h2>
                <div className="mt-4 space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.name}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-card p-3"
                      data-testid={`document-${doc.name.replace(/\s+/g, "-").toLowerCase()}`}
                    >
                      <span className="text-sm font-bold">{doc.name}</span>
                      <Badge
                        variant={doc.status === "Uploaded" ? "default" : "outline"}
                        className="rounded-full"
                      >
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="mt-4 w-full rounded-xl"
                  data-testid="button-vault-add"
                >
                  <Link href="/setup">
                    <Upload className="h-4 w-4" aria-hidden="true" />
                    Add files in setup
                  </Link>
                </Button>
              </section>
            </div>

            <section
              className="rounded-3xl bg-background/70 p-5"
              data-testid="panel-quality-fact-check"
            >
              <h2 className="flex items-center gap-2 text-lg font-black">
                <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
                Application quality and fact check
              </h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-card p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    Draft quality
                  </p>
                  <p className="mt-2 text-xl font-black">{opportunities[0]?.quality ?? 0}/100</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Top brief is {opportunities[0]?.quality && opportunities[0].quality >= 80 ? "ready for client review" : "still being drafted"}.
                  </p>
                </div>
                <div className="rounded-2xl bg-card p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    Fact check
                  </p>
                  <p className="mt-2 text-xl font-black">{opportunities[0]?.factCheck ?? "Not started"}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Every claim links to a source placeholder until live citations connect.
                  </p>
                </div>
                <div className="rounded-2xl bg-card p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    Submit guardrail
                  </p>
                  <p
                    className="mt-2 flex items-center gap-2 text-xl font-black"
                    data-testid="text-guardrail-status"
                  >
                    <Lock className="h-5 w-5 text-primary" aria-hidden="true" />
                    Locked
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Requires explicit “Approved — Submit This” confirmation per application.
                  </p>
                </div>
              </div>
            </section>

            <section
              className="rounded-3xl border border-amber-500/30 bg-background/70 p-5"
              data-testid="panel-deadline-risk"
            >
              <div className="flex items-start gap-3">
                <CalendarClock
                  className="mt-1 h-6 w-6 text-primary"
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-black">Deadline risk</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Earliest deadline: {stats.nextDeadline} ·{" "}
                    {stats.nextDays > 0 ? `${stats.nextDays} days left` : "rolling"}.
                  </p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {opportunities
                      .slice()
                      .sort((a, b) => a.daysLeft - b.daysLeft)
                      .slice(0, 3)
                      .map((o) => {
                        const tone =
                          o.daysLeft <= 14
                            ? "bg-destructive/10 text-destructive"
                            : o.daysLeft <= 35
                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                            : "bg-card text-muted-foreground";
                        return (
                          <div
                            key={o.id}
                            className={`rounded-2xl p-3 text-sm ${tone}`}
                            data-testid={`deadline-${o.id}`}
                          >
                            <p className="font-bold">{o.name}</p>
                            <p className="mt-1 text-xs">
                              {o.deadline} · {o.daysLeft > 0 ? `${o.daysLeft} days` : "rolling"}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl bg-primary p-5 text-primary-foreground">
              <Sparkles className="mb-4 h-6 w-6" aria-hidden="true" />
              <h2 className="text-lg font-black">Best next step</h2>
              <p className="mt-3 text-sm leading-6 opacity-90">
                Review the {opportunities[0]?.name ?? "top match"}. Highest score, clear fit, and a
                realistic deadline.
              </p>
              <Button
                className="mt-5 w-full rounded-xl border border-white/20 bg-white text-primary hover:bg-white/90"
                data-testid="button-review-top-match"
                type="button"
                onClick={() => {
                  const top = opportunities[0];
                  if (!top) return;
                  if (top.status === "Brief Ready") openSubmissionDialog(top);
                  else generateBrief(top);
                }}
              >
                {opportunities[0]?.status === "Brief Ready" ? "Review & approve" : "Generate brief"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            <section
              className="rounded-3xl bg-background/70 p-5"
              data-testid="panel-readiness"
            >
              <h2 className="text-lg font-black">Grant readiness checklist</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                You are{" "}
                <span data-testid="text-readiness-score" className="font-bold text-foreground">
                  {readinessScore}%
                </span>{" "}
                ready.
              </p>
              <div className="mt-4">
                <ProgressBar value={readinessScore} label="Grant readiness" />
              </div>
              <div className="mt-4 space-y-3">
                {readinessItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-2 text-sm"
                    data-testid={`readiness-${item.id}`}
                  >
                    {item.done ? (
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 text-primary"
                        aria-hidden="true"
                      />
                    ) : (
                      <AlertTriangle
                        className="mt-0.5 h-4 w-4 text-amber-500"
                        aria-hidden="true"
                      />
                    )}
                    <span className={item.done ? "text-foreground" : "text-muted-foreground"}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section
              className="rounded-3xl bg-background/70 p-5"
              data-testid="panel-missing-info"
            >
              <h2 className="text-lg font-black">Missing info detector</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                GrantPilot won't guess — it asks instead.
              </p>
              <ol className="mt-4 space-y-3 text-sm leading-6">
                {missingInfo.map((item, index) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 rounded-2xl bg-card p-3"
                    data-testid={`missing-${item.id}`}
                  >
                    <span className="font-black text-primary">{index + 1}.</span>
                    <span className="flex-1 text-muted-foreground">{item.label}</span>
                    <Badge variant="outline" className="rounded-full text-xs">
                      {item.priority}
                    </Badge>
                  </li>
                ))}
              </ol>
              <Button
                asChild
                variant="outline"
                className="mt-5 w-full rounded-xl"
                data-testid="button-complete-setup"
              >
                <Link href="/setup">Complete setup</Link>
              </Button>
            </section>

            <section
              className="rounded-3xl bg-background/70 p-5"
              data-testid="panel-confidence"
            >
              <ShieldCheck className="mb-4 h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="text-lg font-black">Confidence and risk</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Confidence: Medium until the full NOFO/RFP is read. GrantPilot will say{" "}
                <em>"I need more information about this"</em> instead of guessing.
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                No application is submitted without your written confirmation.
              </p>
            </section>

            <section
              className="rounded-3xl bg-background/70 p-5"
              data-testid="panel-activity-feed"
            >
              <h2 className="text-lg font-black">AI activity feed</h2>
              <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
                {activity.slice(0, 10).map((item, index) => (
                  <p
                    key={`${item}-${index}`}
                    className="rounded-2xl bg-card p-3 text-sm leading-6 text-muted-foreground"
                    data-testid="text-activity-line"
                  >
                    {item}
                  </p>
                ))}
              </div>
            </section>
          </aside>
        </section>

        <section
          className="mt-7 rounded-3xl border border-primary/30 bg-primary/5 p-5"
          data-testid="panel-submission-guardrail"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <Lock className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-black">Submission guardrail</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Nothing is submitted to any funder without your explicit written approval. Drafts
                  stay in this dashboard until you confirm with{" "}
                  <span className="font-bold text-foreground">Approved — Submit This</span>.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="rounded-xl"
              type="button"
              onClick={() => setLocation("/setup")}
              data-testid="button-back-to-setup"
            >
              Back to setup
            </Button>
          </div>
        </section>
      </section>

      <Dialog
        open={submissionTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSubmissionTarget(null);
            setConfirmText("");
          }
        }}
      >
        <DialogContent data-testid="dialog-submission-guardrail">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" aria-hidden="true" />
              Confirm submission approval
            </DialogTitle>
            <DialogDescription>
              You are approving the {submissionTarget?.name ?? "application"} packet. GrantPilot
              will mark it Ready to Submit but will not transmit anything until a human submits
              through the funder portal.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm leading-6 text-muted-foreground">
              Type <span className="font-bold text-foreground">Approved — Submit This</span> below
              to confirm.
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              placeholder="Approved — Submit This"
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm focus:border-primary focus:outline-none"
              data-testid="input-confirmation-text"
              aria-label="Approval phrase"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSubmissionTarget(null);
                setConfirmText("");
              }}
              data-testid="button-cancel-submission"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmSubmission}
              disabled={confirmText.trim() !== "Approved — Submit This"}
              data-testid="button-confirm-submission"
            >
              <Lock className="h-4 w-4" aria-hidden="true" />
              Confirm approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
