import { ChangeEvent, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  FileText,
  FolderOpen,
  Gavel,
  GraduationCap,
  Landmark,
  LogOut,
  Receipt,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type FileCategory = "grant" | "law" | "budget" | "program";

type SourceFile = {
  id: string;
  name: string;
  size: number;
  category: FileCategory;
  selected: boolean;
  source: "demo" | "upload";
  description?: string;
};

const CATEGORY_LABEL: Record<FileCategory, string> = {
  grant: "Grant material",
  law: "Law / compliance",
  budget: "Budget / finance",
  program: "Program evidence",
};

const CATEGORY_ICON: Record<FileCategory, typeof Landmark> = {
  grant: Landmark,
  law: Gavel,
  budget: Receipt,
  program: GraduationCap,
};

const demoFiles: SourceFile[] = [
  {
    id: "demo-grant-rfp",
    name: "youth-mental-health-RFP.pdf",
    size: 184_320,
    category: "grant",
    selected: true,
    source: "demo",
    description: "Sample state RFP describing eligibility and scoring rubric.",
  },
  {
    id: "demo-grant-prior",
    name: "prior-application-2024.docx",
    size: 96_870,
    category: "grant",
    selected: true,
    source: "demo",
    description: "Last year's full proposal narrative for reference.",
  },
  {
    id: "demo-law-irs",
    name: "IRS-determination-letter.pdf",
    size: 42_115,
    category: "law",
    selected: true,
    source: "demo",
    description: "501(c)(3) IRS determination letter.",
  },
  {
    id: "demo-law-bylaws",
    name: "organizational-bylaws.pdf",
    size: 67_902,
    category: "law",
    selected: false,
    source: "demo",
    description: "Adopted bylaws and governing rules.",
  },
  {
    id: "demo-budget-annual",
    name: "annual-operating-budget.xlsx",
    size: 28_330,
    category: "budget",
    selected: true,
    source: "demo",
    description: "Operating budget with revenue and expense breakdown.",
  },
  {
    id: "demo-budget-program",
    name: "program-budget-narrative.docx",
    size: 41_200,
    category: "budget",
    selected: false,
    source: "demo",
    description: "Line-item program budget tied to outcomes.",
  },
  {
    id: "demo-program-outcomes",
    name: "program-outcomes-2025.pdf",
    size: 73_410,
    category: "program",
    selected: true,
    source: "demo",
    description: "Outcomes data and impact narrative.",
  },
  {
    id: "demo-program-logic",
    name: "logic-model.pdf",
    size: 31_005,
    category: "program",
    selected: false,
    source: "demo",
    description: "Program logic model: inputs, activities, outcomes.",
  },
];

function inferCategory(name: string): FileCategory {
  const lower = name.toLowerCase();
  if (/(irs|501|ein|tax|bylaw|legal|compliance|sam\.gov)/.test(lower)) return "law";
  if (/(budget|finance|audit|expense|revenue|p&l)/.test(lower)) return "budget";
  if (/(program|impact|outcome|logic|evaluation|narrative)/.test(lower)) return "program";
  return "grant";
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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

const CATEGORY_ORDER: FileCategory[] = ["grant", "law", "budget", "program"];

export default function SetupPage() {
  const [, setLocation] = useLocation();
  const [files, setFiles] = useState<SourceFile[]>(demoFiles);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const selectedFiles = files.filter((file) => file.selected);
  const selectedCategories = Array.from(new Set(selectedFiles.map((f) => f.category)));
  const readiness = Math.min(95, 30 + selectedFiles.length * 7 + selectedCategories.length * 6);

  const missingCategories = useMemo(
    () => CATEGORY_ORDER.filter((c) => !selectedCategories.includes(c)),
    [selectedCategories],
  );

  const findings = useMemo(() => {
    if (!analyzed) return [] as string[];
    const lines: string[] = [];
    for (const cat of CATEGORY_ORDER) {
      const items = selectedFiles.filter((f) => f.category === cat);
      if (items.length === 0) continue;
      lines.push(
        `${CATEGORY_LABEL[cat]}: ${items.length} file${items.length === 1 ? "" : "s"} indexed for AI matching.`,
      );
    }
    if (missingCategories.length > 0) {
      lines.push(
        `Missing: ${missingCategories.map((c) => CATEGORY_LABEL[c]).join(", ")}. Add these for stronger matches.`,
      );
    }
    lines.push("Privacy: file names and types only — contents are not uploaded in this demo.");
    return lines;
  }, [analyzed, selectedFiles, missingCategories]);

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(event.target.files ?? []).map<SourceFile>((file, index) => ({
      id: `upload-${file.name}-${file.size}-${index}-${Date.now()}`,
      name: file.name,
      size: file.size,
      category: inferCategory(file.name),
      selected: true,
      source: "upload",
    }));
    if (newFiles.length === 0) return;
    setFiles((current) => [...current, ...newFiles]);
    setAnalyzed(false);
    event.target.value = "";
  }

  function toggleFile(id: string) {
    setFiles((current) =>
      current.map((file) => (file.id === id ? { ...file, selected: !file.selected } : file)),
    );
    setAnalyzed(false);
  }

  function selectAllInCategory(cat: FileCategory, value: boolean) {
    setFiles((current) =>
      current.map((file) => (file.category === cat ? { ...file, selected: value } : file)),
    );
    setAnalyzed(false);
  }

  function runAnalysis() {
    if (selectedFiles.length === 0) return;
    setAnalyzing(true);
    setAnalyzed(false);
    window.setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 700);
  }

  function continueToDashboard() {
    const params = new URLSearchParams({
      ready: String(files.length ? readiness : 62),
      files: String(selectedFiles.length),
      cats: selectedCategories.join(","),
      analyzed: analyzed ? "1" : "0",
    });
    setLocation(`/dashboard?${params.toString()}`);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12),transparent_32rem),linear-gradient(135deg,hsl(var(--background)),hsl(var(--muted)))] px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl rounded-[2rem] border border-card-border bg-card/90 p-5 shadow-2xl shadow-primary/5 md:p-8">
        <header className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <GrantPilotMark />
            <div>
              <p className="text-lg font-black tracking-tight">GrantPilot</p>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Setup stage
              </p>
            </div>
          </div>
          <Button asChild variant="outline" className="rounded-xl" data-testid="button-setup-logout">
            <Link href="/">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </Link>
          </Button>
        </header>

        <section className="grid gap-7 py-7 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <Badge
              variant="outline"
              className="mb-4 rounded-full border-primary/20 bg-primary/10 text-primary"
            >
              Step 1 before dashboard
            </Badge>
            <h1 className="max-w-3xl text-[clamp(2rem,4vw,3.5rem)] font-black leading-[0.98] tracking-[-0.055em]">
              Choose the grant files GrantPilot should analyze.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Select demo files across grant, law, budget, and program categories — or upload your
              own. GrantPilot reads file names and categories in this demo. Backend AI analysis of
              file contents is wired up but disabled in the demo to keep client data safe.
            </p>

            <div className="mt-6 rounded-3xl bg-background/70 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
                <div>
                  <h2 className="font-black">Privacy guardrail</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    No files are uploaded or stored — the demo never reads file contents. AI keys
                    never reach the browser. Real analysis runs on a secure backend once enabled.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3" data-testid="grid-setup-stats">
              <div className="rounded-2xl bg-background/70 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Files selected
                </p>
                <p className="mt-2 text-xl font-black" data-testid="text-files-selected">
                  {selectedFiles.length}
                </p>
              </div>
              <div className="rounded-2xl bg-background/70 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Categories covered
                </p>
                <p className="mt-2 text-xl font-black" data-testid="text-categories-covered">
                  {selectedCategories.length} / 4
                </p>
              </div>
              <div className="rounded-2xl bg-background/70 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Readiness estimate
                </p>
                <p className="mt-2 text-xl font-black" data-testid="text-readiness-estimate">
                  {files.length ? readiness : 62}%
                </p>
              </div>
              <div className="rounded-2xl bg-background/70 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Missing categories
                </p>
                <p className="mt-2 text-xl font-black" data-testid="text-missing-categories">
                  {missingCategories.length}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {CATEGORY_ORDER.map((cat) => {
              const Icon = CATEGORY_ICON[cat];
              const items = files.filter((f) => f.category === cat);
              const selectedInCat = items.filter((f) => f.selected).length;
              const allOn = items.length > 0 && selectedInCat === items.length;
              return (
                <section
                  key={cat}
                  className="rounded-3xl border border-border bg-background/70 p-5"
                  data-testid={`section-category-${cat}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <h2 className="text-base font-black">{CATEGORY_LABEL[cat]}</h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {selectedInCat} of {items.length} selected
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="rounded-lg text-xs"
                      onClick={() => selectAllInCategory(cat, !allOn)}
                      disabled={items.length === 0}
                      data-testid={`button-toggle-all-${cat}`}
                    >
                      {allOn ? "Clear" : "Select all"}
                    </Button>
                  </div>

                  {items.length === 0 ? (
                    <p className="mt-4 rounded-2xl bg-card p-3 text-xs text-muted-foreground">
                      No files yet. Upload one below or pick from another category.
                    </p>
                  ) : (
                    <div className="mt-4 space-y-2">
                      {items.map((file) => (
                        <label
                          key={file.id}
                          className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-card p-3 hover-elevate"
                        >
                          <input
                            data-testid={`checkbox-file-${file.id}`}
                            type="checkbox"
                            checked={file.selected}
                            onChange={() => toggleFile(file.id)}
                            className="mt-1 h-4 w-4 accent-primary"
                          />
                          <FileText
                            className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary"
                            aria-hidden="true"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-bold">{file.name}</span>
                            <span className="mt-1 block text-xs text-muted-foreground">
                              {file.source === "upload" ? "Your upload" : "Demo file"} ·{" "}
                              {formatSize(file.size)}
                              {file.description ? ` · ${file.description}` : ""}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}

            <label
              htmlFor="grant-files"
              className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-primary/30 bg-card p-6 text-center hover:bg-primary/5"
            >
              <UploadCloud className="mb-3 h-7 w-7 text-primary" aria-hidden="true" />
              <span className="text-base font-black">Add your own files</span>
              <span className="mt-1 max-w-md text-xs leading-5 text-muted-foreground">
                PDFs, Word docs, spreadsheets, text files, and CSVs. Files are auto-categorized.
              </span>
              <input
                id="grant-files"
                data-testid="input-grant-files"
                className="sr-only"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.md"
                onChange={handleUpload}
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                data-testid="button-analyze-files"
                type="button"
                className="h-12 flex-1 rounded-xl font-bold"
                onClick={runAnalysis}
                disabled={selectedFiles.length === 0 || analyzing}
              >
                {analyzing ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-pulse" aria-hidden="true" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FileSearch className="h-4 w-4" aria-hidden="true" />
                    Analyze selected files
                  </>
                )}
              </Button>
              <Button
                data-testid="button-continue-dashboard"
                type="button"
                variant="outline"
                className="h-12 flex-1 rounded-xl font-bold"
                onClick={continueToDashboard}
              >
                Continue to dashboard
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </section>

        {analyzed ? (
          <section
            data-testid="panel-analysis-results"
            className="rounded-3xl border border-primary/20 bg-primary/10 p-5"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-black">AI file analysis ready</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  GrantPilot indexed {selectedFiles.length} file
                  {selectedFiles.length === 1 ? "" : "s"} across {selectedCategories.length}{" "}
                  category{selectedCategories.length === 1 ? "" : "s"}. Findings feed the dashboard
                  matching engine.
                </p>
                <ul className="mt-4 space-y-2">
                  {findings.map((line) => (
                    <li
                      key={line}
                      className="rounded-2xl bg-card p-3 text-sm leading-6 text-muted-foreground"
                      data-testid="text-analysis-finding"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
                {missingCategories.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {missingCategories.map((cat) => (
                      <Badge key={cat} variant="outline" className="rounded-full bg-card">
                        Missing: {CATEGORY_LABEL[cat]}
                      </Badge>
                    ))}
                  </div>
                ) : null}
                <div className="mt-5">
                  <Button
                    type="button"
                    className="rounded-xl"
                    onClick={continueToDashboard}
                    data-testid="button-continue-analyzed"
                  >
                    Continue to dashboard
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-3xl bg-background/70 p-5" data-testid="panel-analysis-pending">
            <div className="flex items-start gap-3">
              <FolderOpen className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-black">Ready when you are</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Pick the grant, law, budget, and program files you want GrantPilot to consider,
                  then run the analysis. You can also continue with sample readiness data.
                </p>
              </div>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
