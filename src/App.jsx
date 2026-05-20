import { useState, useEffect, useRef } from "react";
import { CREDITS } from "./data/credits.js";
import { DEMO_PROJECT } from "./data/projects.js";
import { idbGet, idbSet, idbDel, lsGet, lsSet, lsDel } from "./utils/storage.js";
import {
  isFileSystemAccessSupported, createProjectFolderStructure,
  getCreditFolder, getMeetingsFolder, listDir, listEvidence, readTextFile, saveEvidenceFile, saveTextFile,
  listProjectSlugs, loadProjectFromFolder, saveProjectToFolder,
} from "./utils/fileApi.js";

const PROJECT_ROOT_KEY = "biu:projectRoot";

// ── Helpers ──────────────────────────────────────────────────────────────────
const tod = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
const slugify = (s) => String(s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// ── A11y helper: make any element behave like a button for keyboard users ────
const buttonish = (handler) => ({
  role: "button",
  tabIndex: 0,
  onClick: handler,
  onKeyDown: (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handler(e);
    }
  },
});

// ── BREEAM Manual PDF map ────────────────────────────────────────────────────
// Maps credit code (e.g. "Tra 1") → public URL of the BREEAM manual PDF.
// 104 PDFs bundled in public/breeam-pdfs/ organized by category/credit-code/.
const CREDIT_PDF_MAP = {
  // Transport
  "Tra 1": "/breeam-pdfs/TRANSPORT/TRA_01/TRA 01 - Manual criteria - Alternate transport.pdf",
  "Tra 2": "/breeam-pdfs/TRANSPORT/TRA_02/TRA 02 - Manual Criteria - Proximity to public transport.pdf",
  "Tra 3": "/breeam-pdfs/TRANSPORT/TRA_03/TRA 03 - Manual Criteria - Proximity to amenities.pdf",
  "Tra 4": "/breeam-pdfs/TRANSPORT/TRA_04/TRA 04 - Manual Criteria - Pedestrian and cyclist safety.pdf",
  // Energy (only credits defined in CREDITS)
  "Ene 1": "/breeam-pdfs/ENERGY/ENE_01/ENE 01 - Manual criteria - Building services.pdf",
  "Ene 2": "/breeam-pdfs/ENERGY/ENE_02/ENE 02 - Manual criteria - Mech ventilation.pdf",
  "Ene 3": "/breeam-pdfs/ENERGY/ENE_03/ENE 03 - Manual criteria - Fabric performance.pdf",
  "Ene 4": "/breeam-pdfs/ENERGY/ENE_04/ENE 04 - Manual criteria - Air permeability.pdf",
  "Ene 5": "/breeam-pdfs/ENERGY/ENE_05/ENE 05 - Manual criteria - Cooling.pdf",
  "Ene 6": "/breeam-pdfs/ENERGY/ENE_06/ENE 06 - Manual criteria - Heating.pdf",
  // Water (only credits defined in CREDITS)
  "Wat 1": "/breeam-pdfs/WATER/WAT_01/WAT 01 - Manual Criteria - Water monitoring.pdf",
  "Wat 2": "/breeam-pdfs/WATER/WAT_02/WAT 02 - Manual Criteria - WCs.pdf",
  "Wat 3": "/breeam-pdfs/WATER/WAT_03/WAT 03 - Manual criteria - Urinals.pdf",
  "Wat 4": "/breeam-pdfs/WATER/WAT_04/WAT 04 - Manual Criteria - Taps.pdf",
  "Wat 5": "/breeam-pdfs/WATER/WAT_05/WAT 05 - Manual criteria - Showers.pdf",
  "Wat 6": "/breeam-pdfs/WATER/WAT_06/WAT 06 - Manual criteria - White goods.pdf",
  // Health & Wellbeing (only credits defined in CREDITS)
  "Hea 1": "/breeam-pdfs/HEALTH-&-WELLBEING/HEA_01/HEA 01 - Manual criteria - Daylighting.pdf",
  "Hea 2": "/breeam-pdfs/HEALTH-&-WELLBEING/HEA_02/HEA 02 - Manual Criteria - Glare control.pdf",
  "Hea 3": "/breeam-pdfs/HEALTH-&-WELLBEING/HEA_03/HEA 03 - Manual criteria - Lux level lighting test.pdf",
  "Hea 4": "/breeam-pdfs/HEALTH-&-WELLBEING/HEA_04/HEA 04 - Manual criteria - Lighting control.pdf",
  "Hea 5": "/breeam-pdfs/HEALTH-&-WELLBEING/HEA_05/HEA 05 - Manual criteria - Minimising flicker.pdf",
  "Hea 6": "/breeam-pdfs/HEALTH-&-WELLBEING/HEA_06/HEA 06 - Manual criteria - View out.pdf",
  "Hea 7": "/breeam-pdfs/HEALTH-&-WELLBEING/HEA_07/HEA 07 - Manual criteria - Comfort control.pdf",
  // Management 1-5 (Mat/Was/Man 6-10 intentionally omitted — see RF-22)
  "Man 1": "/breeam-pdfs/Uncategorized/MAN_01/MAN 01 - Manual Criteria - Building user guide.pdf",
  "Man 2": "/breeam-pdfs/Uncategorized/MAN_02/MAN 02 - Manual criteria - Engage and feedback.pdf",
  "Man 3": "/breeam-pdfs/Uncategorized/MAN_03/MAN 03 - Manual criteria - Maintenance policy.pdf",
  "Man 4": "/breeam-pdfs/Uncategorized/MAN_04/MAN 04 - Manual criteria - Environment policy.pdf",
  "Man 5": "/breeam-pdfs/Uncategorized/MAN_05/MAN 05 - Manual criteria - Green lease.pdf",
  // Pollution (only credits defined in CREDITS)
  "Mat 1": "/breeam-pdfs/RESOURCES/RSC_01/RSC 01 - Manual criteria - Condition Survey.pdf",
  "Mat 2": "/breeam-pdfs/RESOURCES/RSC_02/RSC 02 - Manual criteria - Reuse and recycling.pdf",
  "Mat 3": "/breeam-pdfs/RESOURCES/RSC_03/RSC 03 - Manual criteria - Resource Inventory.pdf",
  "Was 1": "/breeam-pdfs/RESOURCES/RSC_04/RSC 04 - Manual criteria - Future adaptation.pdf",
  "Lea 1": "/breeam-pdfs/LAND-USE-&-ECOLOGY/LUE_01/LUE 01 - Manual criteria - Planted area.pdf",
  "Lea 2": "/breeam-pdfs/LAND-USE-&-ECOLOGY/LUE_02/LUE 02 - Manual criteria - Ecology features.pdf",
  "Lea 3": "/breeam-pdfs/LAND-USE-&-ECOLOGY/LUE_03/LUE 03 - Manual criteria - Ecology report.pdf",
  "Lea 4": "/breeam-pdfs/LAND-USE-&-ECOLOGY/LUE_04/LUE 04 - Manual criteria - Biodiversity plan.pdf",
  "Pol 1": "/breeam-pdfs/POLLUTION/POL_01/POL 01 - Manual criteria - Water pollution.pdf",
  "Pol 2": "/breeam-pdfs/POLLUTION/POL_02/POL 02 - Manual criteria - Chemical storage.pdf",
  "Pol 3": "/breeam-pdfs/POLLUTION/POL_03/POL 03 - Manual criteria - Local air quality.pdf",
};

// ── Storage helpers (localStorage with error handling) ──────────────────────
const loadProjects = () => {
  try {
    const stored = lsGet("biu:projects") || [DEMO_PROJECT];
    return stored.map(initProject);
  }
  catch { return [initProject(DEMO_PROJECT)]; }
};
const saveProjects = (ps) => { try { lsSet("biu:projects", ps); } catch { /* quota */ } };
const loadMeetings = () => {
  try { return lsGet("biu:meetings") || []; }
  catch { return []; }
};
const saveMeetings = (ms) => { try { lsSet("biu:meetings", ms); } catch { /* quota */ } };

const isLikelyEvidenceFile = (item) => {
  if (!item) return false;
  if (typeof item === "object") return Boolean(item.name);
  if (typeof item !== "string") return false;
  return /\.[a-z0-9]{2,8}$/i.test(item) || item.includes("/") || item.includes("\\");
};

const normalizeAnswerOptions = (answers = []) =>
  answers.map((answer) => ({
    ...answer,
    points: answer.points ?? answer.credits ?? 0,
  }));

const inferSelectionMode = (credit, question) => {
  const mode = question?.selectionMode || credit?.selectionMode;
  if (mode === "single" || mode === "multiple") return mode;
  const instruction = `${question?.instruction || ""} ${credit?.instruction || ""}`.toLowerCase();
  if (instruction.includes("select all")) return "multiple";
  if (instruction.includes("single answer")) return "single";
  return "single";
};

const summarizeSelectedAnswers = (selectedAnswers = []) =>
  Array.isArray(selectedAnswers) && selectedAnswers.length ? selectedAnswers.join(", ") : "";

const getCreditQuestionOptions = (credit) =>
  (credit.questions || []).flatMap((question) => question.options || []);

const buildUpdatedCreditSelection = (credit, nextSelectedAnswers) => {
  const options = getCreditQuestionOptions(credit);
  const selected = options.filter((opt) => nextSelectedAnswers.includes(opt.label));
  const cap = Number.isFinite(credit.available) ? credit.available : 0;
  const sum = selected.reduce((acc, opt) => acc + (opt.points || 0), 0);
  const score = Math.min(cap, sum);
  const selectedAnswer = summarizeSelectedAnswers(nextSelectedAnswers);

  const hasFullCredit = cap > 0 && score === cap;
  return {
    ...credit,
    selectedAnswers: nextSelectedAnswers,
    selectedAnswer,
    score,
    status: nextSelectedAnswers.length
      ? (hasFullCredit ? "complete" : "in_progress")
      : (credit.pursuing ? "in_progress" : "not_pursuing"),
  };
};

const formatOptionLabel = (option) => option?.id ? `${option.id}. ${option.label}` : option?.label || "";

const preferNonEmptyArray = (...values) => {
  for (const value of values) {
    if (Array.isArray(value) && value.length > 0) return value;
  }
  return [];
};

const normalizeCredit = (template, existing = {}) => {
  const answers = normalizeAnswerOptions(existing.answers || template.answers || []);
  const legacyEvidence = existing.evidenceFiles ?? existing.evidence ?? [];
  const evidenceFiles = Array.isArray(legacyEvidence)
    ? legacyEvidence.filter(isLikelyEvidenceFile)
    : [];
  const fallbackQuestions = answers.length
    ? [{
        question: template.question || "Select the applicable answer",
        options: answers,
      }]
    : [];
  const guidance = preferNonEmptyArray(
    existing.guidance,
    template.guidance,
    [
      template.question ? `Question: ${template.question}` : null,
      template.instruction || null,
    ].filter(Boolean),
  );
  const questions = preferNonEmptyArray(existing.questions, template.questions, fallbackQuestions);
  const methodology = preferNonEmptyArray(existing.methodology, template.methodology);
  const evidenceRequirements = preferNonEmptyArray(
    existing.evidenceRequirements,
    template.evidenceRequirements,
    template.evidence,
  );
  const selectedAnswers = Array.isArray(existing.selectedAnswers)
    ? existing.selectedAnswers.filter(Boolean)
    : existing.selectedAnswer
      ? [existing.selectedAnswer]
      : [];
  const selectedAnswer = existing.selectedAnswer ?? summarizeSelectedAnswers(selectedAnswers);
  const normalizedQuestions = questions.map((question) => ({
    ...question,
    instruction: question.instruction ?? template.instruction ?? "",
    selectionMode: inferSelectionMode(template, question),
    options: normalizeAnswerOptions(question.options || []),
  }));

  return {
    ...template,
    ...existing,
    answers,
    description: existing.description ?? template.description ?? template.aim ?? "",
    guidance,
    questions: normalizedQuestions,
    methodology,
    evidenceRequirements,
    selectionMode: inferSelectionMode(template),
    selectedAnswers,
    selectedAnswer,
    evidenceFiles,
    evidence: evidenceFiles,
  };
};

// ── Project init ─────────────────────────────────────────────────────────────
const initProject = (data) => ({
  ...data,
  credits: CREDITS.map(tmpl => {
    const existing = (data.credits || []).find(c => c.code === tmpl.code);
    return normalizeCredit(tmpl, existing);
  }),
});

const getDisplayCredit = (template, projectCredit) => normalizeCredit(template, projectCredit || {});

// ── Category colours ────────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  Transport:     { bg: "rgba(245,158,11,0.08)",   border: "rgba(245,158,11,0.20)",  color: "#d97706" },
  Energy:        { bg: "rgba(239,68,68,0.07)",    border: "rgba(239,68,68,0.18)",   color: "#dc2626" },
  Water:         { bg: "rgba(14,116,144,0.08)",   border: "rgba(14,116,144,0.20)",  color: "#0e9aa9" },
  Health:        { bg: "rgba(16,185,129,0.08)",   border: "rgba(16,185,129,0.20)",  color: "#059669" },
  Materials:     { bg: "rgba(124,58,237,0.08)",   border: "rgba(124,58,237,0.20)",  color: "#7c3aed" },
  Pollution:     { bg: "rgba(6,182,212,0.08)",    border: "rgba(6,182,212,0.20)",   color: "#0891b2" },
  Ecology:        { bg: "rgba(34,197,94,0.08)",    border: "rgba(34,197,94,0.20)",   color: "#16a34a" },
  Waste:         { bg: "rgba(180,83,9,0.08)",     border: "rgba(180,83,9,0.20)",    color: "#b45309" },
  Management:    { bg: "rgba(100,116,139,0.08)",   border: "rgba(100,116,139,0.20)", color: "#64748b" },
};

const STATUS_COLORS = {
  complete:     { bg: "rgba(16,185,129,0.06)",   color: "#059669" },
  in_progress:  { bg: "rgba(99,102,241,0.10)",   color: "#6366f1" },
  not_pursuing: { bg: "rgba(100,116,139,0.10)",  color: "#64748b" },
};

// ── Utility: export meeting to .md file ─────────────────────────────────────
const exportMeetingMd = (meeting) => {
  const front = ["---", `title: "${meeting.title}"`, `date: "${meeting.date}"`,
    `attendees: "${(meeting.attendees || []).join(", ")}"`, `project: "${meeting.projectName}"`,
    `tags: ["meeting", "breeam"]`, "---\n"].join("\n");
  const body = [`# ${meeting.title}`, "", `**Date:** ${meeting.date}`,
    meeting.attendees?.length ? `\n**Attendees:** ${meeting.attendees.join(", ")}` : "",
    "", "## Notes", "", meeting.notes || "_No notes recorded._"].filter(Boolean).join("\n");
  const blob = new Blob([front + body], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${meeting.date}_${slugify(meeting.title || "untitled")}.md`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// ── Utility: generate PDF (stub using browser print) ─────────────────────────
const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[c]));

const generatePDF = (project) => {
  const w = window.open("", "_blank");
  if (!w) {
    alert("Could not open the PDF preview window. Please allow popups for this site and try again.");
    return;
  }
  w.document.write(`<html><head><title>${escapeHtml(project.name)} — Evidence Package</title>`);
  w.document.write(`<style>body{font-family:sans-serif;padding:40px;max-width:800px;margin:0 auto}
    h1{font-size:22px;border-bottom:2px solid #7c3aed;padding-bottom:10px}
    h2{font-size:16px;color:#7c3aed;margin-top:30px}
    .credit{margin-bottom:20px;padding:16px;border:1px solid #e2e8f0;border-radius:8px}
    .credit-header{display:flex;justify-content:space-between}
    .code{font-weight:800;color:#7c3aed;font-size:13px}
    .score{font-size:13px;color:#64748b}
    .narrative{font-size:13px;color:#475569;margin-top:8px;line-height:1.6;white-space:pre-wrap}
    .evidence{font-size:12px;color:#64748b;margin-top:6px}
    </style></head><body>`);
  w.document.write(`<h1>${escapeHtml(project.name)} — BREEAM Evidence Package</h1>`);
  w.document.write(`<p style="color:#64748b;font-size:13px">Generated: ${escapeHtml(tod())} | ${project.credits.filter(c=>c.pursuing).length} credits pursued</p>`);
  project.credits.filter(c => c.pursuing).forEach(c => {
    const evidenceFiles = c.evidenceFiles || c.evidence || [];
    const evidenceNames = evidenceFiles.map(e => escapeHtml(typeof e === "string" ? e : e.name)).join(", ");
    w.document.write(`<div class="credit">
      <div class="credit-header">
        <span class="code">${escapeHtml(c.code)}</span>
        <span class="score">${c.score || 0} / ${c.available || 0} credits</span>
      </div>
      <div style="font-size:12px;color:#475569;margin-top:4px">${escapeHtml(c.title)}</div>
      ${c.narrative ? `<div class="narrative">${escapeHtml(c.narrative)}</div>` : ""}
      ${evidenceFiles.length ? `<div class="evidence">📎 ${evidenceNames}</div>` : ""}
    </div>`);
  });
  w.document.write(`</body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 500);
};

// ── PAGE: Home ───────────────────────────────────────────────────────────────
function HomePage({ project, onNavigate }) {
  const [expanded, setExpanded] = useState(false);
  const categories = [...new Set(CREDITS.map(c => c.category))];
  const pursuing = project.credits.filter(c => c.pursuing);
  const byCat = (cat) => categories.indexOf(cat);

  const score = pursuing.reduce((s, c) => s + (c.score || 0), 0);
  const available = pursuing.reduce((s, c) => s + (c.available || 0), 0);
  const pct = available ? Math.round((score / available) * 100) : 0;

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Dashboard</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#1e293b" }}>{project.name}</h1>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => onNavigate("preassessment")}
              style={{ padding: "9px 18px", borderRadius: 9, border: "1px solid rgba(0,0,0,0.10)", background: "rgba(255,255,255,0.03)", color: "#475569", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>
              🔍 Pre-Assessment
            </button>
            <button onClick={() => onNavigate("assessment")}
              style={{ padding: "9px 18px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#7c3aed,#3b82f6)", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit", boxShadow: "0 4px 14px rgba(124,58,237,0.3)" }}>
              📋 Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Score summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Credits Pursued", value: pursuing.length, sub: `of ${CREDITS.length} total` },
          { label: "Credits Complete", value: pursuing.filter(c => c.status === "complete").length, sub: "status: complete" },
          { label: "Score", value: `${score}`, sub: `of ${available} available` },
          { label: "Completion", value: `${pct}%`, sub: available ? `${score}/${available}` : "—" },
        ].map(({ label, value, sub }) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#7c3aed", lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 14, padding: "20px 22px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Category Progress</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {categories.sort((a, b) => byCat(a) - byCat(b)).map(cat => {
            const catCredits = CREDITS.filter(c => c.category === cat);
            const pursued = catCredits.filter(c => project.credits.find(pc => pc.code === c.code && pc.pursuing));
            const done = pursued.filter(c => project.credits.find(pc => pc.code === c.code && pc.status === "complete"));
            const cc = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Management;
            return (
              <div key={cat} style={{ background: cc.bg, border: `1px solid ${cc.border}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: cc.color, marginBottom: 8 }}>{cat}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: cc.color }}>{done.length}<span style={{ fontSize: 12, fontWeight: 400, color: "#64748b" }}>/{catCredits.length}</span></div>
                <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{pursued.length} pursued</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Credits by category */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {categories.sort((a, b) => byCat(a) - byCat(b)).map(cat => {
          const cc = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Management;
          const catCredits = CREDITS.filter(c => c.category === cat);
          return (
            <div key={cat} style={{ border: `1px solid ${cc.border}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ background: cc.bg, padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: cc.color }}>{cat}</span>
                <span style={{ fontSize: 11, color: "#64748b" }}>
                  {catCredits.filter(c => project.credits.find(pc => pc.code === c.code && pc.pursuing)).length} / {catCredits.length} pursued
                </span>
              </div>
              <div style={{ background: "#ffffff", padding: "12px 18px", display: "flex", flexWrap: "wrap", gap: 6 }}>
                {catCredits.map(c => {
                  const pc = project.credits.find(p => p.code === c.code);
                  const pursued = pc?.pursuing;
                  const sc = pc?.status || "not_pursuing";
                  return (
                    <div key={c.code}
                      {...buttonish(() => onNavigate("assessment"))}
                      aria-label={`${c.code} ${c.title}`}
                      style={{
                        padding: "5px 10px", borderRadius: 7, border: `1px solid ${pursued ? cc.border : "rgba(0,0,0,0.08)"}`,
                        background: pursued ? cc.bg : "rgba(0,0,0,0.02)",
                        cursor: "pointer", fontSize: 12, fontFamily: "monospace",
                      }}>
                      <span style={{ fontWeight: 700, color: pursued ? cc.color : "#64748b" }}>{c.code}</span>
                      <span style={{ marginLeft: 5, color: "#475569" }}>{c.title}</span>
                      {pursued && sc === "complete" && <span style={{ marginLeft: 6, color: "#059669" }}>✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── PAGE: Pre-Assessment ────────────────────────────────────────────────────
function PreAssessmentPage({ project, onUpdate, projectRoot, projectSlug }) {
  const [selectedCredit, setSelectedCredit] = useState(null);

  useEffect(() => {
    if (!projectRoot || !projectSlug) return;
    const credit = selectedCredit;
    if (!credit || !credit.pursuing) return;
    const label = credit.selectedAnswers?.length
      ? `${credit.score || 0} credits`
      : "not assessed";
    const body = [
      `---`,
      `code: "${credit.code}"`,
      `title: "${credit.title}"`,
      `selectedAnswer: "${credit.selectedAnswer || ""}"`,
      `selectedAnswers: [${(credit.selectedAnswers || []).map(answer => `"${String(answer).replace(/"/g, '\\"')}"`).join(", ")}]`,
      `score: ${credit.score || 0}`,
      `available: ${credit.available || 0}`,
      `narrative: "${(credit.narrative || "").replace(/"/g, '\\"')}"`,
      `status: "${credit.status || "in_progress"}"`,
      `date: "${tod()}"`,
      `---`,
      ``,
      `# ${credit.code} — Pre-Assessment`,
      ``,
      `**Status:** ${credit.status || "in_progress"} | **Score:** ${credit.score || 0}/${credit.available || 0}`,
      `**Answer:** ${credit.selectedAnswer || "—"}`,
      ``,
      credit.narrative ? `## Assessor Narrative\n\n${credit.narrative}` : "_No narrative recorded._",
    ].join("\n");
    const handle = setTimeout(async () => {
      const folder = await getCreditFolder(projectRoot, projectSlug, credit.code, credit.part);
      if (folder) await saveTextFile(folder, "assessment.md", body);
    }, 500);
    return () => clearTimeout(handle);
  }, [selectedCredit?.code, selectedCredit?.pursuing, selectedCredit?.selectedAnswer,
      JSON.stringify(selectedCredit?.selectedAnswers || []), selectedCredit?.score,
      selectedCredit?.narrative, selectedCredit?.status]);

  const byCat = (c) => [...new Set(CREDITS.map(x => x.category))].indexOf(c.category);

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Pre-Assessment</div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1e293b" }}>Credit Assessment</h1>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Select a credit to view guidance and record your assessment</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}>
        {/* Credit list */}
        <div>
          {[1, 2].map(part => {
            const partCredits = CREDITS.filter(c => c.part === part);
            const partCats = [...new Set(partCredits.map(c => c.category))].sort((a, b) => byCat(a) - byCat(b));
            return (
              <div key={part} style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                  Part {part} — {part === 1 ? "Asset Performance" : "Building Management"}
                </div>
                {partCats.map(cat => {
                  const cc = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Management;
                  const catCredits = partCredits.filter(c => c.category === cat);
                  return (
                    <div key={cat} style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5, paddingLeft: 4 }}>{cat}</div>
                      {catCredits.map(c => {
                        const pc = project.credits.find(p => p.code === c.code);
                        const pursued = pc?.pursuing;
                        const sc = pc?.status || "not_pursuing";
                        return (
                          <div key={c.code}
                            {...buttonish(() => setSelectedCredit(getDisplayCredit(c, pc)))}
                            aria-label={`${c.code} ${c.title}`}
                            style={{
                              padding: "9px 12px", borderRadius: 8, marginBottom: 3, cursor: "pointer",
                              background: selectedCredit?.code === c.code ? "rgba(124,58,237,0.12)" : pursued ? "rgba(255,255,255,0.04)" : "transparent",
                              border: `1px solid ${selectedCredit?.code === c.code ? "rgba(124,58,237,0.3)" : pursued ? cc.border : "rgba(0,0,0,0.06)"}`,
                            }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <span style={{ fontSize: 12, fontWeight: 800, color: pursued ? cc.color : "#64748b" }}>{c.code}</span>
                              <span style={{ fontSize: 10, color: "#475569" }}>{pursued ? `${pc.score || 0}/${c.available}` : "—"}</span>
                            </div>
                            <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{c.title}</div>
                            {pursued && <div style={{ fontSize: 9, color: STATUS_COLORS[sc]?.color || "#64748b", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>{sc.replace("_", " ")}</div>}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Credit detail */}
        <div style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 14, padding: "22px 24px", position: "sticky", top: 12, alignSelf: "start" }}>
          {!selectedCredit ? (
            <div style={{ color: "#64748b", fontSize: 14, textAlign: "center", padding: "40px 20px" }}>
              Select a credit from the list to view its details
            </div>
          ) : (() => {
            const c = selectedCredit;
            const cc = CATEGORY_COLORS[c.category] || CATEGORY_COLORS.Management;
            return (
              <div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: cc.color, background: cc.bg, padding: "3px 8px", borderRadius: 5 }}>{c.code}</span>
                    <span style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase" }}>Part {c.part}</span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1e293b" }}>{c.title}</h2>
                </div>

                <div style={{ fontSize: 12, color: "#334155", marginBottom: 14, lineHeight: 1.6 }}>{c.description}</div>

                {c.criteria && c.criteria.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, color: "#2563eb", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Assessment Criteria</div>
                    <div style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 8, padding: "12px 16px" }}>
                      {c.criteria.map((criterion) => (
                        <div key={criterion.id} style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 11, color: "#334155", lineHeight: 1.6, fontWeight: 600 }}>
                            {criterion.id}. {criterion.text}
                          </div>
                          {criterion.details?.map((detail, index) => (
                            <div key={index} style={{ fontSize: 11, color: "#475569", lineHeight: 1.5, marginTop: 4, paddingLeft: 12 }}>
                              - {detail}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {c.evidenceRequirements && c.evidenceRequirements.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, color: "#059669", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Requirements / Evidence Needed</div>
                    <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 8, padding: "12px 16px" }}>
                      {c.evidenceRequirements.map((ev, i) => (
                        <div key={i} style={{ fontSize: 11, color: "#334155", lineHeight: 1.5, marginBottom: 5, display: "flex", gap: 6 }}>
                          <span style={{ color: "#059669", fontWeight: 700, flexShrink: 0 }}>•</span>
                          {ev}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {c.questions && c.questions.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Options</div>
                    {c.questions.map((q, i) => (
                      <div key={i} style={{ marginBottom: 10, padding: "10px 14px", background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.10)", borderRadius: 8 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", marginBottom: 6 }}>Q{i + 1}: {q.question}</div>
                        {q.instruction && (
                          <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.5, marginBottom: 8 }}>
                            {q.instruction}
                          </div>
                        )}
                        {q.options && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            {q.options.map((opt, oi) => {
                              const isMultiple = q.selectionMode === "multiple";
                              const selected = (c.selectedAnswers || []).includes(opt.label);
                              const handleSelect = () => {
                                const baseCredit = selectedCredit?.code === c.code ? selectedCredit : c;
                                const baseSelectedAnswers = baseCredit.selectedAnswers || [];
                                const isAlreadySelected = baseSelectedAnswers.includes(opt.label);
                                const nextSelectedAnswers = isMultiple
                                  ? (isAlreadySelected
                                      ? baseSelectedAnswers.filter((answer) => answer !== opt.label)
                                      : [...baseSelectedAnswers, opt.label])
                                  : [opt.label];
                                const updated = buildUpdatedCreditSelection(baseCredit, nextSelectedAnswers);
                                setSelectedCredit(updated);
                                onUpdate(updated);
                              };
                              return (
                                <div key={oi}
                                  {...buttonish(handleSelect)}
                                  role={isMultiple ? "checkbox" : "radio"}
                                  aria-checked={selected}
                                  aria-label={opt.label}
                                  style={{
                                    padding: "7px 10px", borderRadius: 6, cursor: "pointer",
                                    background: selected ? "rgba(124,58,237,0.10)" : "rgba(0,0,0,0.02)",
                                    border: `1px solid ${selected ? "rgba(124,58,237,0.3)" : "rgba(0,0,0,0.07)"}`,
                                    fontSize: 12, color: selected ? "#6d28d9" : "#334155",
                                  }}>
                                  <span style={{ fontWeight: 600 }}>{formatOptionLabel(opt)}</span>
                                  <span style={{ marginLeft: 6, color: "#475569" }}>- {opt.points} credit{opt.points !== 1 ? "s" : ""}</span>
                                  {opt.sub && (
                                    <div style={{ marginTop: 5, fontSize: 11, color: "#475569", lineHeight: 1.5 }}>
                                      {opt.sub}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Pursue / Skip toggle */}
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 14 }}>
                  <button
                    onClick={() => {
                      const updated = { ...c, pursuing: true, status: c.status || "in_progress" };
                      setSelectedCredit(updated);
                      onUpdate(updated);
                    }}
                    style={{ padding: "10px 24px", borderRadius: 10, border: c.pursuing ? "2px solid #059669" : "1px solid rgba(124,58,237,0.25)", background: c.pursuing ? "rgba(16,185,129,0.08)" : "rgba(124,58,237,0.06)", color: c.pursuing ? "#059669" : "#7c3aed", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>
                    ✓ Pursue this credit
                  </button>
                  <button
                    onClick={() => {
                      const updated = { ...c, pursuing: false, status: "not_pursuing", score: 0, selectedAnswer: "", selectedAnswers: [] };
                      setSelectedCredit(updated);
                      onUpdate(updated);
                    }}
                    style={{ padding: "10px 24px", borderRadius: 10, border: !c.pursuing ? "2px solid #94a3b8" : "1px solid rgba(0,0,0,0.10)", background: !c.pursuing ? "rgba(100,116,139,0.08)" : "rgba(0,0,0,0.03)", color: !c.pursuing ? "#334155" : "#94a3b8", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>
                    ✗ Skip this credit
                  </button>
                  {CREDIT_PDF_MAP[c.code] && (
                    <a
                      href={CREDIT_PDF_MAP[c.code]}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{ marginLeft: "auto", padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(124,58,237,0.25)", background: "rgba(124,58,237,0.08)", color: "#7c3aed", cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "inherit", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                      📖 BREEAM Manual
                    </a>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

// ── PAGE: Assessment (detailed) ───────────────────────────────────────────────
function AssessmentPage({ project, onUpdate, projectRoot, projectSlug }) {
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [evidenceModalCredit, setEvidenceModalCredit] = useState(null);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Left: credit list */}
      <div style={{ width: 380, borderRight: "1px solid rgba(0,0,0,0.07)", overflowY: "auto", padding: "24px 18px" }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Assessment</div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1e293b" }}>Credits</h1>
        </div>

        {[1, 2].map(part => {
          const partCredits = CREDITS.filter(c => c.part === part);
          const partCats = [...new Set(partCredits.map(c => c.category))].sort((a, b) => {
            const cats = [...new Set(CREDITS.map(x => x.category))];
            return cats.indexOf(a) - cats.indexOf(b);
          });
          return (
            <div key={part} style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                Part {part} — {part === 1 ? "Asset Performance" : "Building Management"}
              </div>
              {partCats.map(cat => {
                const cc = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Management;
                const catCredits = partCredits.filter(c => c.category === cat);
                return (
                  <div key={cat} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4, paddingLeft: 6 }}>{cat}</div>
                    {catCredits.map(c => {
                      const pc = project.credits.find(p => p.code === c.code);
                      const pursued = pc?.pursuing;
                      const sc = pc?.status || "not_pursuing";
                      return (
                        <div key={c.code}
                          {...buttonish(() => setSelectedCredit(getDisplayCredit(c, pc)))}
                          aria-label={`${c.code} ${c.title}`}
                          style={{
                            padding: "10px 12px", borderRadius: 9, marginBottom: 4, cursor: "pointer",
                            background: selectedCredit?.code === c.code ? "rgba(124,58,237,0.12)" : "transparent",
                            border: `1px solid ${selectedCredit?.code === c.code ? "rgba(124,58,237,0.35)" : pursued ? cc.border : "rgba(0,0,0,0.06)"}`,
                          }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                            <span style={{ fontSize: 13, fontWeight: 800, color: pursued ? cc.color : "#64748b" }}>{c.code}</span>
                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                              {pursued && <div style={{ width: 7, height: 7, borderRadius: "50%", background: STATUS_COLORS[sc]?.color || "#64748b" }} />}
                              {pursued ? <span style={{ fontSize: 10, color: "#475569" }}>{pc.score || 0}/{c.available}</span> : null}
                            </div>
                          </div>
                          <div style={{ fontSize: 11, color: pursued ? "#475569" : "#64748b" }}>{c.title}</div>
                          {pursued && pc.completion > 0 && (
                            <div style={{ marginTop: 5, height: 3, borderRadius: 2, background: "rgba(0,0,0,0.06)" }}>
                              <div style={{ width: `${pc.completion}%`, height: "100%", borderRadius: 2, background: cc.color }} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Right: credit detail */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
        {!selectedCredit ? (
          <div style={{ color: "#64748b", fontSize: 15, textAlign: "center", padding: "80px 20px" }}>
            Click a credit to view and edit its details
          </div>
        ) : (() => {
          const credit = selectedCredit;
          const cc = CATEGORY_COLORS[credit.category] || CATEGORY_COLORS.Management;
          const displayCredit = credit;
          const onUpdateCredit = (updated) => {
            onUpdate(updated);
            setSelectedCredit(updated);
          };
          return (
            <div>
              {/* Credit header */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: cc.color, background: cc.bg, padding: "4px 10px", borderRadius: 6 }}>{displayCredit.code}</span>
                  <span style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase" }}>Part {displayCredit.part}</span>
                  <span style={{ fontSize: 10, color: "#64748b", marginLeft: 4 }}>{displayCredit.category}</span>
                </div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1e293b" }}>{displayCredit.title}</h2>
              </div>

              <div style={{ marginBottom: 16, padding: "14px 16px", background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.14)", borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Selected Answer From Pre-Assessment</div>
                {displayCredit.selectedAnswers?.length ? (
                  <div style={{ marginBottom: 4 }}>
                    {displayCredit.selectedAnswers.map((answer) => (
                      <div key={answer} style={{ fontSize: 14, color: "#1e293b", fontWeight: 700, marginBottom: 4 }}>
                        {answer}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 14, color: "#1e293b", fontWeight: 700, marginBottom: 4 }}>
                    {displayCredit.selectedAnswer || "No option selected yet"}
                  </div>
                )}
                <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>
                  Score: {displayCredit.score || 0} / {displayCredit.available || 0} credits
                  {" | "}
                  Status: {(displayCredit.status || "in_progress").replace("_", " ")}
                </div>
              </div>

              {/* Methodology */}
              {displayCredit.methodology && displayCredit.methodology.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: "#2563eb", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Methodology</div>
                  <div style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 8, padding: "12px 16px" }}>
                    {displayCredit.methodology.filter(Boolean).map((line, i) => (
                      <div key={i} style={{ fontSize: 11, color: line.startsWith(" ") ? "#475569" : "#334155", lineHeight: 1.6, whiteSpace: "pre-wrap", fontWeight: line.startsWith(" ") ? 400 : 500 }}>{line}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Evidence requirements */}
              {displayCredit.evidenceRequirements && displayCredit.evidenceRequirements.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: "#059669", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Evidence Requirements</div>
                  <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 8, padding: "12px 16px" }}>
                    {displayCredit.evidenceRequirements.map((ev, i) => (
                      <div key={i} style={{ fontSize: 11, color: "#334155", lineHeight: 1.5, marginBottom: 5, display: "flex", gap: 6 }}>
                        <span style={{ color: "#059669", fontWeight: 700, flexShrink: 0 }}>•</span>
                        {ev}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Asset-specific notes */}
              {displayCredit.notes && displayCredit.notes.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: "#d97706", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Asset-Specific Notes</div>
                  {displayCredit.notes.map((note, i) => (
                    <div key={i} style={{ fontSize: 11, color: "#334155", lineHeight: 1.5, marginBottom: 6, padding: "8px 12px", background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.10)", borderRadius: 7 }}>{note}</div>
                  ))}
                </div>
              )}

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Narrative</div>
                <textarea value={displayCredit.narrative || ""} onChange={e => onUpdateCredit({ ...displayCredit, narrative: e.target.value })}
                  rows={6} placeholder="Describe the evidence and assessment rationale..."
                  style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)", background: "rgba(255,255,255,0.03)", color: "#1e293b", fontSize: 13, lineHeight: 1.55, resize: "vertical", fontFamily: "inherit" }} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Completion %</div>
                <input type="range" min="0" max="100" value={displayCredit.completion}
                  onChange={e => onUpdateCredit({ ...displayCredit, completion: parseInt(e.target.value) })}
                  style={{ width: "100%" }} />
                <div style={{ fontSize: 11, color: "#64748b", textAlign: "right" }}>{displayCredit.completion}%</div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>Evidence ({displayCredit.evidenceFiles?.length || 0} files)</div>
                  <button onClick={() => setEvidenceModalCredit(displayCredit)}
                    style={{ padding: "6px 12px", borderRadius: 7, border: "none", background: "rgba(124,58,237,0.10)", color: "#7c3aed", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}>
                    + Add Evidence
                  </button>
                </div>
                {displayCredit.evidenceFiles?.map((e, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 7, background: "rgba(0,0,0,0.03)", marginBottom: 4 }}>
                    <span style={{ fontSize: 13 }}>📄</span>
                    <span style={{ fontSize: 12, color: "#1e293b", flex: 1 }}>{typeof e === "string" ? e : e.name}</span>
                  </div>
                ))}
                {!displayCredit.evidenceFiles?.length && <div style={{ fontSize: 11, color: "#334155", textAlign: "center", padding: "12px" }}>No evidence yet</div>}
              </div>

              {/* Pursue / Skip toggle */}
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 14 }}>
                <button
                  onClick={() => {
                    const updated = { ...displayCredit, pursuing: true, status: "in_progress" };
                    onUpdateCredit(updated);
                    setSelectedCredit(updated);
                  }}
                  style={{ padding: "10px 24px", borderRadius: 10, border: displayCredit.pursuing ? "2px solid #059669" : "1px solid rgba(124,58,237,0.25)", background: displayCredit.pursuing ? "rgba(16,185,129,0.08)" : "rgba(124,58,237,0.06)", color: displayCredit.pursuing ? "#059669" : "#7c3aed", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>
                  ✓ Pursue this credit
                </button>
                <button
                  onClick={() => {
                    const updated = { ...displayCredit, pursuing: false, status: "not_pursuing", score: 0 };
                    onUpdateCredit(updated);
                  }}
                  style={{ padding: "10px 24px", borderRadius: 10, border: !displayCredit.pursuing ? "2px solid #94a3b8" : "1px solid rgba(0,0,0,0.10)", background: !displayCredit.pursuing ? "rgba(100,116,139,0.08)" : "rgba(0,0,0,0.03)", color: !displayCredit.pursuing ? "#334155" : "#94a3b8", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>
                  ✗ Skip this credit
                </button>
                {CREDIT_PDF_MAP[displayCredit.code] && (
                  <a
                    href={CREDIT_PDF_MAP[displayCredit.code]}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{ marginLeft: "auto", padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(124,58,237,0.25)", background: "rgba(124,58,237,0.08)", color: "#7c3aed", cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "inherit", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                    📖 BREEAM Manual
                  </a>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {evidenceModalCredit && (
        <EvidenceModal
          credit={evidenceModalCredit}
          projectRoot={projectRoot}
          projectSlug={projectSlug}
          onClose={() => setEvidenceModalCredit(null)}
          onPersist={updated => {
            onUpdate(updated);
            if (selectedCredit?.code === updated.code) setSelectedCredit(updated);
          }}
          onSave={updated => {
            onUpdate(updated);
            if (selectedCredit?.code === updated.code) setSelectedCredit(updated);
            setEvidenceModalCredit(null);
          }}
        />
      )}
    </div>
  );
}

// ── Helper state for EvidenceModal (lifted up from AssessmentPage) ───────────
// ── PAGE: Evidence Vault ────────────────────────────────────────────────────
function EvidenceVaultPage({ project }) {
  const [part, setPart] = useState(1);
  const credits = project.credits.filter(c => c.part === part && c.pursuing);

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Evidence Vault</div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1e293b" }}>All Evidence Files</h1>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Browse and download evidence files per credit</div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[1, 2].map(p => (
          <button key={p} onClick={() => setPart(p)}
            style={{ padding: "8px 18px", borderRadius: 9, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit",
              background: part === p ? "rgba(124,58,237,0.15)" : "rgba(0,0,0,0.05)", color: part === p ? "#a78bfa" : "#64748b" }}>
            Part {p}
          </button>
        ))}
      </div>

      {credits.map(c => {
        const cc = CATEGORY_COLORS[c.category] || CATEGORY_COLORS.Management;
        return (
          <div key={c.code} style={{ marginBottom: 16, borderRadius: 12, border: `1px solid ${cc.border}`, background: cc.bg }}>
            <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: cc.color }}>{c.code}</span>
                <span style={{ fontSize: 13, color: "#1e293b", marginLeft: 10 }}>{c.title}</span>
                <span style={{ fontSize: 11, color: "#64748b", marginLeft: 8 }}>{c.evidenceFiles?.length || 0} files</span>
              </div>
              <div style={{ fontSize: 11, color: "#64748b" }}>
                {c.evidenceFiles?.map((e, i) => (
                  <span key={i} style={{ marginLeft: 6 }}>📄 {typeof e === "string" ? e.split("/").pop() : e.name}</span>
                ))}
                {!c.evidenceFiles?.length && <span style={{ color: "#334155" }}>— no files</span>}
              </div>
            </div>
          </div>
        );
      })}

      {credits.every(c => !c.evidenceFiles?.length) && (
        <div style={{ color: "#334155", fontSize: 13, padding: 40, textAlign: "center" }}>
          No evidence files uploaded yet. Go to Assessment to add evidence.
        </div>
      )}
    </div>
  );
}

// ── PAGE: Evidence Package (PDF) ────────────────────────────────────────────
function EvidencePackagePage({ project }) {
  const [selected, setSelected] = useState(() => new Set(project.credits.filter(c => c.pursuing).map(c => c.code)));
  const [onlyComplete, setOnlyComplete] = useState(false);

  useEffect(() => {
    const pursuingCodes = new Set(project.credits.filter(c => c.pursuing).map(c => c.code));
    setSelected(prev => {
      const next = new Set();
      for (const code of prev) if (pursuingCodes.has(code)) next.add(code);
      for (const code of pursuingCodes) if (!prev.has(code)) next.add(code);
      return next;
    });
  }, [project.id, project.credits]);

  const credits = project.credits.filter(c => c.pursuing && selected.has(c.code) && (!onlyComplete || c.status === "complete"));
  const part1 = credits.filter(c => c.part === 1);
  const part2 = credits.filter(c => c.part === 2);
  const totalScore = credits.reduce((s, c) => s + (c.score || 0), 0);

  const toggle = (code) => setSelected(prev => {
    const next = new Set(prev);
    if (next.has(code)) next.delete(code); else next.add(code);
    return next;
  });

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Evidence Package</div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1e293b" }}>Generate BREEAM Evidence Package</h1>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Select credits and generate a PDF report for submission</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
        <div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#475569" }}>
              <input type="checkbox" checked={onlyComplete} onChange={e => setOnlyComplete(e.target.checked)} style={{ accentColor: "#7c3aed" }} />
              Only complete credits
            </label>
            <button onClick={() => setSelected(new Set(project.credits.filter(c => c.pursuing).map(c => c.code)))}
              style={{ padding: "6px 12px", borderRadius: 7, border: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.03)", color: "#475569", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
              Select all pursuing
            </button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Part 1 — Asset Performance</div>
            {part1.map(c => (
              <div key={c.code}
                {...buttonish(() => toggle(c.code))}
                role="checkbox"
                aria-checked={selected.has(c.code)}
                aria-label={`${c.code} ${c.title}`}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 9, marginBottom: 6, cursor: "pointer",
                  background: selected.has(c.code) ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${selected.has(c.code) ? "rgba(124,58,237,0.3)" : "rgba(0,0,0,0.07)"}` }}>
                <input type="checkbox" checked={selected.has(c.code)} onChange={() => {}} style={{ accentColor: "#7c3aed" }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: "#7c3aed" }}>{c.code}</span>
                  <span style={{ fontSize: 12, color: "#475569", marginLeft: 6 }}>{c.title}</span>
                </div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{c.score}/{c.available}</div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 11, color: "#2563eb", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Part 2 — Building Management</div>
            {part2.map(c => (
              <div key={c.code}
                {...buttonish(() => toggle(c.code))}
                role="checkbox"
                aria-checked={selected.has(c.code)}
                aria-label={`${c.code} ${c.title}`}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 9, marginBottom: 6, cursor: "pointer",
                  background: selected.has(c.code) ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${selected.has(c.code) ? "rgba(124,58,237,0.3)" : "rgba(0,0,0,0.07)"}` }}>
                <input type="checkbox" checked={selected.has(c.code)} onChange={() => {}} style={{ accentColor: "#7c3aed" }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: "#2563eb" }}>{c.code}</span>
                  <span style={{ fontSize: 12, color: "#475569", marginLeft: 6 }}>{c.title}</span>
                </div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{c.score}/{c.available}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 14, padding: "20px", position: "sticky", top: 20, alignSelf: "start" }}>
          <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Package Summary</div>
          <div style={{ fontSize: 13, color: "#1e293b", marginBottom: 8 }}><strong>{credits.length}</strong> credits selected</div>
          <div style={{ fontSize: 13, color: "#1e293b", marginBottom: 8 }}><strong>{totalScore}</strong> total credits</div>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>Part 1: {part1.reduce((s,c) => s+(c.score||0),0)} credits<br/>Part 2: {part2.reduce((s,c) => s+(c.score||0),0)} credits</div>

          <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: 14, marginBottom: 14 }}>
            {credits.slice(0, 8).map(c => (
              <div key={c.code} style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>
                <span style={{ color: "#7c3aed" }}>{c.code}</span> — {c.narrative?.slice(0, 40) || "no narrative"}...
              </div>
            ))}
            {credits.length > 8 && <div style={{ fontSize: 11, color: "#475569" }}>+ {credits.length - 8} more credits</div>}
          </div>

          <button onClick={() => generatePDF({ ...project, credits: credits })}
            style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#7c3aed,#3b82f6)", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "inherit", boxShadow: "0 4px 16px rgba(124,58,237,0.4)" }}>
            📄 Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PAGE: Meetings ───────────────────────────────────────────────────────────
function MeetingsPage({ project, meetings, onMeetingsChange, projectRoot, projectSlug }) {
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: "", date: tod(), attendees: "", notes: "" });
  const diskWriteHandle = useRef(null);
  const scheduleDiskWrite = (saved) => {
    if (!projectRoot || !saved) return;
    if (diskWriteHandle.current) clearTimeout(diskWriteHandle.current);
    diskWriteHandle.current = setTimeout(() => {
      getMeetingsFolder(projectRoot, projectSlug).then(meetingsDir => {
        if (!meetingsDir) return;
        const filename = `${saved.date}_${slugify(saved.title || "untitled")}.md`;
        const content = ["---", `title: "${saved.title}"`, `date: "${saved.date}"`, `attendees: "${(saved.attendees || []).join(", ")}"`, `project: "${project.name}"`, `tags: ["meeting", "breeam"]`, "---", "", `# ${saved.title}`, "", `**Date:** ${saved.date}`, saved.attendees?.length ? `\n**Attendees:** ${saved.attendees.join(", ")}` : "", "", "## Notes", "", saved.notes || "_No notes recorded._"].filter(Boolean).join("\n");
        saveTextFile(meetingsDir, filename, content);
      });
    }, 500);
  };

  // Fix 2: Load existing .md files from disk on mount
  useEffect(() => {
    if (!projectRoot) return;
    (async () => {
      const meetingsDir = await getMeetingsFolder(projectRoot, projectSlug);
      if (!meetingsDir) return;
      const entries = await listDir(meetingsDir);
      const mdFiles = entries.filter(e => e.isFile && e.name.endsWith(".md"));
      const diskMeetings = await Promise.all(
        mdFiles.map(async (f) => {
          const text = await readTextFile(meetingsDir, f.name);
          const match = f.name.match(/^(\d{4}-\d{2}-\d{2})_(.+)\.md$/);
          return { _diskFile: f.name, _diskContent: text, _diskDate: match?.[1] || "", _diskTitle: match?.[2] || f.name };
        })
      );
      const existingIds = new Set(meetings.map(m => m.id));
      const toAdd = diskMeetings.filter(dm => !existingIds.has(dm._diskFile));
      if (toAdd.length) {
        const newMeetings = toAdd.map(dm => ({
          id: dm._diskFile,
          projectId: project.id,
          projectName: project.name,
          title: dm._diskTitle.replace(/-/g, " "),
          date: dm._diskDate,
          attendees: [],
          notes: dm._diskContent || "",
        }));
        onMeetingsChange(prev => [...prev, ...newMeetings]);
      }
    })();
  }, [projectRoot]);

  const projectMeetings = meetings.filter(m => m.projectId === project.id).sort((a, b) => (a.date > b.date ? -1 : 1));

  const selectMeeting = (m) => {
    setSelected(m);
    setForm({ title: m.title || "", date: m.date || tod(), attendees: (m.attendees || []).join(", "), notes: m.notes || "" });
  };

  const newMeeting = () => {
    const m = { id: Date.now(), projectId: project.id, projectName: project.name, title: "", date: tod(), attendees: [], notes: "" };
    const updated = [m, ...meetings];
    if (projectRoot) {
      getMeetingsFolder(projectRoot, projectSlug).then(meetingsDir => {
        if (!meetingsDir) return;
        const filename = `${m.date}_untitled.md`;
        const content = ["---", `title: ""`, `date: "${m.date}"`, `attendees: ""`, `project: "${project.name}"`, `tags: ["meeting", "breeam"]`, "---", "", `# Untitled Meeting`, "", `**Date:** ${m.date}`, "", "## Notes", "", "_No notes recorded._"].join("\n");
        saveTextFile(meetingsDir, filename, content);
      });
    }
    onMeetingsChange(updated);
    selectMeeting(m);
  };

  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const deleteMeeting = (id) => {
    if (pendingDeleteId !== id) {
      setPendingDeleteId(id);
      setTimeout(() => setPendingDeleteId(curr => curr === id ? null : curr), 3000);
      return;
    }
    setPendingDeleteId(null);
    const updated = meetings.filter(m => m.id !== id);
    onMeetingsChange(updated);
    if (selected?.id === id) setSelected(null);
  };

  const saveCurrent = () => {
    if (!selected) return;
    const updated = meetings.map(m => {
      if (m.id !== selected.id) return m;
      return { ...m, title: form.title, date: form.date, attendees: form.attendees.split(",").map(s => s.trim()).filter(Boolean), notes: form.notes };
    });
    if (diskWriteHandle.current) clearTimeout(diskWriteHandle.current);
    if (projectRoot) {
      const saved = updated.find(m => m.id === selected.id);
      if (saved) {
        getMeetingsFolder(projectRoot, projectSlug).then(meetingsDir => {
          if (!meetingsDir) return;
          const filename = `${saved.date}_${slugify(saved.title || "untitled")}.md`;
          const content = ["---", `title: "${saved.title}"`, `date: "${saved.date}"`, `attendees: "${(saved.attendees || []).join(", ")}"`, `project: "${project.name}"`, `tags: ["meeting", "breeam"]`, "---", "", `# ${saved.title}`, "", `**Date:** ${saved.date}`, saved.attendees?.length ? `\n**Attendees:** ${saved.attendees.join(", ")}` : "", "", "## Notes", "", saved.notes || "_No notes recorded._"].filter(Boolean).join("\n");
          saveTextFile(meetingsDir, filename, content);
        });
      }
    }
    onMeetingsChange(updated);
    setSelected(updated.find(m => m.id === selected.id) || selected);
  };

  const handleFieldChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (!selected) return;
    const updated = meetings.map(m => {
      if (m.id !== selected.id) return m;
      const updatedMeeting = { ...m, [field]: value };
      if (field === "attendees") updatedMeeting.attendees = value.split(",").map(s => s.trim()).filter(Boolean);
      return updatedMeeting;
    });
    scheduleDiskWrite(updated.find(m => m.id === selected.id));
    onMeetingsChange(updated);
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100, display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Meetings</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1e293b" }}>Meeting Notes</h1>
          <button onClick={newMeeting}
            style={{ padding: "9px 18px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#7c3aed,#3b82f6)", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit", boxShadow: "0 4px 16px rgba(124,58,237,0.3)" }}>
            + New Meeting
          </button>
        </div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
          {projectMeetings.length} meeting{projectMeetings.length !== 1 ? "s" : ""} · Stored as .md files in <code style={{ color: "#7c3aed" }}>meetings/</code>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, flex: 1, minHeight: 0 }}>
        {/* Meeting list */}
        <div style={{ borderRight: "1px solid rgba(0,0,0,0.06)", paddingRight: 16 }}>
          {projectMeetings.length === 0 && (
            <div style={{ color: "#334155", fontSize: 13, textAlign: "center", padding: "40px 10px" }}>
              No meetings yet.<br />Click "+ New Meeting" to start.
            </div>
          )}
          {projectMeetings.map(m => (
            <div key={m.id}
              {...buttonish(() => selectMeeting(m))}
              aria-label={`Meeting: ${m.title || "Untitled"} on ${m.date}`}
              style={{
                padding: "12px 14px", borderRadius: 10, marginBottom: 6, cursor: "pointer",
                background: selected?.id === m.id ? "rgba(124,58,237,0.10)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${selected?.id === m.id ? "rgba(124,58,237,0.25)" : "rgba(0,0,0,0.07)"}`,
              }}>
              <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700, marginBottom: 3 }}>{m.date}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {m.title || <em style={{ color: "#475569" }}>Untitled meeting</em>}
              </div>
              {m.attendees?.length > 0 && (
                <div style={{ fontSize: 11, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {(m.attendees || []).join(", ")}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Meeting editor */}
        {!selected ? (
          <div style={{ color: "#334155", fontSize: 13, padding: "60px 20px", textAlign: "center", border: "1px dashed rgba(0,0,0,0.07)", borderRadius: 12 }}>
            Select a meeting or click "+ New Meeting"
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 180px 200px", gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Meeting Title</div>
                <input value={form.title} onChange={e => handleFieldChange("title", e.target.value)} placeholder="e.g. BREEAM Kick-off Meeting"
                  style={{ width: "100%", padding: "8px 11px", boxSizing: "border-box", borderRadius: 8, background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.08)", color: "#1e293b", fontSize: 14, fontFamily: "inherit" }} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Date</div>
                <input type="date" value={form.date} onChange={e => handleFieldChange("date", e.target.value)}
                  style={{ width: "100%", padding: "8px 11px", boxSizing: "border-box", borderRadius: 8, background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.08)", color: "#1e293b", fontSize: 13, fontFamily: "inherit" }} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Attendees</div>
                <input value={form.attendees} onChange={e => handleFieldChange("attendees", e.target.value)} placeholder="Jane, John, Lucy"
                  style={{ width: "100%", padding: "8px 11px", boxSizing: "border-box", borderRadius: 8, background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.08)", color: "#1e293b", fontSize: 13, fontFamily: "inherit" }} />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Agenda / Notes</div>
              <textarea value={form.notes} onChange={e => handleFieldChange("notes", e.target.value)}
                placeholder={"## Agenda\n- Topic 1\n- Topic 2\n\n## Notes\n- Note here...\n\n## Actions\n- [ ] Action item"}
                style={{ width: "100%", minHeight: 340, boxSizing: "border-box", padding: "14px 16px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,0,0,0.08)", color: "#1e293b", fontSize: 13, lineHeight: 1.65, resize: "vertical", fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace" }} />
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button onClick={() => saveCurrent()}
                style={{ padding: "9px 18px", borderRadius: 9, border: "none", background: "rgba(124,58,237,0.10)", color: "#7c3aed", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>💾 Save</button>
              <button onClick={() => { const m = meetings.find(m => m.id === selected.id); if (m) exportMeetingMd(m); }}
                style={{ padding: "9px 18px", borderRadius: 9, border: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.03)", color: "#475569", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>📥 Export .md</button>
              <button onClick={() => deleteMeeting(selected.id)}
                style={{ padding: "9px 18px", borderRadius: 9, border: `1px solid ${pendingDeleteId === selected.id ? "rgba(239,68,68,0.5)" : "rgba(239,68,68,0.15)"}`, background: pendingDeleteId === selected.id ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.05)", color: "#dc2626", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>
                {pendingDeleteId === selected.id ? "🗑 Click again to confirm" : "🗑 Delete"}
              </button>
              <div style={{ marginLeft: "auto", fontSize: 11, color: "#475569" }}>
                {selected.date}_{slugify(selected.title || "untitled")}.md
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── EvidenceModal ────────────────────────────────────────────────────────────
function EvidenceModal({ credit, projectRoot, projectSlug, onClose, onSave, onPersist }) {
  const [uploads, setUploads] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const MAX_SIZE_MB = 50;
  const fileName = (f) => typeof f === "string" ? f : f?.name;
  const uploadNames = new Set(uploads.map(fileName).filter(Boolean));
  const existingFiles = (credit.evidenceFiles || credit.evidence || [])
    .filter(f => {
      const n = fileName(f);
      return n && !uploadNames.has(n);
    });

  useEffect(() => {
    if (!projectRoot) return;
    (async () => {
      const folder = await getCreditFolder(projectRoot, projectSlug, credit.code, credit.part);
      if (!folder) return;
      const files = await listEvidence(folder);
      setUploads(files.map(f => ({ name: f.name, size: 0 })));
    })();
  }, [projectRoot, projectSlug, credit.code, credit.part]);

  const handleFiles = async (fileList) => {
    setError(null);
    if (!projectRoot) {
      setError("Connect a project folder before uploading evidence files.");
      return;
    }
    setSaving(true);
    const arr = Array.from(fileList);
    const oversized = arr.filter(f => f.size > MAX_SIZE_MB * 1024 * 1024).map(f => f.name);
    const valid = arr.filter(f => f.size <= MAX_SIZE_MB * 1024 * 1024);
    if (oversized.length) {
      setError(`Skipped (over ${MAX_SIZE_MB}MB): ${oversized.join(", ")}`);
    }
    const newFiles = [];
    const folder = await getCreditFolder(projectRoot, projectSlug, credit.code, credit.part);
    if (!folder) {
      setSaving(false);
      setError("Unable to access the credit folder.");
      return;
    }
    for (const file of valid) {
      try {
        const saved = await saveEvidenceFile(folder, file);
        if (saved) newFiles.push({ name: file.name, type: file.type, size: file.size });
      } catch (e) { console.error("Upload failed:", e); }
    }
    const nextUploads = [...uploads, ...newFiles];
    setUploads(nextUploads);
    if (newFiles.length > 0) {
      onPersist({ ...credit, evidenceFiles: nextUploads, evidence: nextUploads });
    }
    setSaving(false);
  };

  const handleSave = () => {
    onSave({ ...credit, evidenceFiles: uploads, evidence: uploads });
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 16, padding: "28px 32px", width: 520, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Evidence</div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#1e293b" }}>{credit.code} — {credit.title}</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: 4 }}>✕</button>
        </div>

        {error && (
          <div style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 8, padding: "10px 12px", marginBottom: 12, fontSize: 12, color: "#dc2626" }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", padding: "16px 20px", borderRadius: 10, border: "2px dashed rgba(124,58,237,0.25)", background: "rgba(124,58,237,0.04)", cursor: "pointer", textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#7c3aed", marginBottom: 4 }}>+ Add Evidence Files</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>PDF, JPG, PNG, XLSX, DOCX, ZIP (max {MAX_SIZE_MB}MB each)</div>
            <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx,.zip,.7z,.rar,.tar,.gz" onChange={e => handleFiles(e.target.files)} style={{ display: "none" }} />
          </label>
        </div>

        {uploads.filter(Boolean).length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Uploaded Files ({uploads.filter(Boolean).length})</div>
            {uploads.filter(Boolean).map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "rgba(0,0,0,0.03)", borderRadius: 7, marginBottom: 4 }}>
                <span style={{ fontSize: 14 }}>📄</span>
                <span style={{ fontSize: 12, color: "#1e293b", flex: 1 }}>{typeof f === "string" ? f : f.name}</span>
                {f.size > 0 && <span style={{ fontSize: 10, color: "#64748b" }}>{(f.size / 1024 / 1024).toFixed(1)} MB</span>}
              </div>
            ))}
          </div>
        )}

        {existingFiles.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Previously Saved</div>
            {existingFiles.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "rgba(0,0,0,0.02)", borderRadius: 7, marginBottom: 4, border: "1px solid rgba(0,0,0,0.05)" }}>
                <span style={{ fontSize: 14 }}>📄</span>
                <span style={{ fontSize: 12, color: "#64748b", flex: 1 }}>{typeof f === "string" ? f : f.name}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose}
            style={{ padding: "9px 18px", borderRadius: 9, border: "1px solid rgba(0,0,0,0.10)", background: "rgba(0,0,0,0.03)", color: "#475569", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            style={{ padding: "9px 20px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#7c3aed,#3b82f6)", color: "#fff", cursor: saving ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving..." : "💾 Save Evidence"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Nav pill ─────────────────────────────────────────────────────────────────
function NavPill({ label, icon, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px",
      borderRadius: 9, border: "none", cursor: "pointer",
      background: active ? "rgba(124,58,237,0.12)" : "transparent",
      color: active ? "#7c3aed" : "#475569",
      fontWeight: active ? 700 : 500, fontSize: 13, fontFamily: "inherit",
      textAlign: "left",
    }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      {label}
    </button>
  );
}

// ── New Project Modal ─────────────────────────────────────────────────────────
function NewProjectModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ name: "", location: "", assessment_date: tod(), target_date: "", assessment_type: "BREEAM In Use" });
  const [nameError, setNameError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setNameError("Project name is required"); return; }
    setNameError("");
    onCreate(form);
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 16, padding: "28px 32px", width: 440, boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>🏗️</span>
            <span style={{ fontSize: 17, fontWeight: 800, color: "#1e293b" }}>New Project</span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: 4 }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { label: "Project Name", key: "name", placeholder: "e.g. Riverside Office — 12 Storey", type: "text" },
            { label: "Building Location", key: "location", placeholder: "e.g. Canary Wharf, London", type: "text" },
            { label: "Assessment Date", key: "assessment_date", type: "date" },
            { label: "Target Certification Date", key: "target_date", type: "date" },
          ].map(({ label, key, placeholder, type }) => (
            <div key={key}>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{label}</div>
              <input type={type} value={form[key]} onChange={e => { setForm(prev => ({ ...prev, [key]: e.target.value })); if (key === "name") setNameError(""); }} placeholder={placeholder}
                style={{ width: "100%", padding: "9px 12px", boxSizing: "border-box", borderRadius: 8, border: `1px solid ${key === "name" && nameError ? "#dc2626" : "rgba(0,0,0,0.10)"}`, background: "rgba(0,0,0,0.03)", color: "#1e293b", fontSize: 14, fontFamily: "inherit" }} />
              {key === "name" && nameError && (
                <div style={{ fontSize: 11, color: "#dc2626", marginTop: 4 }}>{nameError}</div>
              )}
            </div>
          ))}

          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: "10px", borderRadius: 9, border: "1px solid rgba(0,0,0,0.10)", background: "rgba(0,0,0,0.03)", color: "#475569", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>
              Cancel
            </button>
            <button type="submit"
              style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#7c3aed,#3b82f6)", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Folder Setup Screen ─────────────────────────────────────────────────────────
function FolderSetupScreen({ folderStatus, folderError, onPick, onClose }) {
  const isConnected = folderStatus.projects === "connected";
  const isSaved = folderStatus.projects === "saved";
  const isUnsupported = !isFileSystemAccessSupported();

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 16, padding: "32px 36px", width: 440, boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>📁</span>
            <span style={{ fontSize: 17, fontWeight: 800, color: "#1e293b" }}>Projects Folder</span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: 4 }}>✕</button>
        </div>

        {isUnsupported ? (
          <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12, padding: "14px 18px", marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6, color: "#d97706" }}>
              Browser not supported
            </div>
            <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>
              Folder storage requires Chrome, Edge, or another Chromium-based browser. Safari and Firefox don't yet support the File System Access API. Your data is still saved in this browser's local storage, but you won't be able to write Markdown files or evidence uploads to disk.
            </div>
          </div>
        ) : (
          <div style={{ background: isConnected ? "rgba(5,150,105,0.06)" : isSaved ? "rgba(245,158,11,0.08)" : "rgba(220,38,38,0.06)", border: `1px solid ${isConnected ? "rgba(5,150,105,0.2)" : isSaved ? "rgba(245,158,11,0.2)" : "rgba(220,38,38,0.2)"}`, borderRadius: 12, padding: "14px 18px", marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6, color: isConnected ? "#059669" : isSaved ? "#d97706" : "#dc2626" }}>
              {isConnected ? "Connected" : isSaved ? "Access lost — reconnect" : "Not connected"}
            </div>
            <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>
              {isConnected ? "Projects are saved to and loaded from your selected folder." : isSaved ? "Browser permissions were revoked. Reconnect to restore folder access." : "Select a folder on your device to store project files."}
            </div>
          </div>
        )}

        {!isUnsupported && (
          <button onClick={onPick} style={{ width: "100%", padding: "12px 20px", borderRadius: 10, border: "none", background: "rgba(124,58,237,0.1)", color: "#7c3aed", cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            📂 {isConnected ? "Change Folder" : isSaved ? "Reconnect Folder" : "Select Folder"}
          </button>
        )}

        {folderError && (
          <div style={{ marginTop: 14, background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#dc2626" }}>
            {folderError}
          </div>
        )}

        <div style={{ marginTop: 14, fontSize: 11, color: "#64748b", textAlign: "center", lineHeight: 1.5 }}>
          Uses the browser's native File System Access API.<br />Your data stays on your device.
        </div>
      </div>
    </div>
  );
}

// ── Folder Status Pill ─────────────────────────────────────────────────────────
function FolderStatusPill({ folderStatus, onClick }) {
  const isUnsupported = !isFileSystemAccessSupported();
  const isConnected = folderStatus.projects === "connected";
  const isSaved = folderStatus.projects === "saved";
  const bg = isUnsupported ? "rgba(245,158,11,0.1)" : isConnected ? "rgba(16,185,129,0.1)" : isSaved ? "rgba(245,158,11,0.1)" : "rgba(100,116,139,0.1)";
  const color = isUnsupported ? "#d97706" : isConnected ? "#059669" : isSaved ? "#f59e0b" : "#64748b";
  const icon = isUnsupported ? "⚠️" : isConnected ? "✅" : isSaved ? "⚠️" : "📁";
  const label = isUnsupported ? "Browser not supported" : isConnected ? "Folder connected" : isSaved ? "Folder — reconnect" : "Folder not set";

  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 12px", borderRadius: 8, border: "none", cursor: "pointer", background: bg, color, fontSize: 11, fontWeight: 600, fontFamily: "inherit", textAlign: "left" }}>
      <span style={{ fontSize: 13 }}>{icon}</span>
      {label}
    </button>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [projects, setProjects] = useState(loadProjects);
  const [activeProjectId, setActiveProjectId] = useState(() => {
    const initial = loadProjects();
    return initial[0]?.id ?? DEMO_PROJECT.id;
  });
  const [page, setPage] = useState("home");
  const [meetings, setMeetings] = useState(loadMeetings);
  const [showNewProject, setShowNewProject] = useState(false);
  const [showFolderSetup, setShowFolderSetup] = useState(false);
  const [folderStatus, setFolderStatus] = useState({});
  const [folderBusy, setFolderBusy] = useState(false);
  const [folderError, setFolderError] = useState("");
  const [projectRoot, setProjectRoot] = useState(null);
  const mainRef = useRef(null);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  useEffect(() => { saveProjects(projects); }, [projects]);
  useEffect(() => { saveMeetings(meetings); }, [meetings]);

  // Boot: check if project root folder was previously saved
  useEffect(() => {
    if (!isFileSystemAccessSupported()) return;
    (async () => {
      try {
        const saved = await idbGet(PROJECT_ROOT_KEY);
        if (saved) {
          try {
            const perm = await saved.queryPermission({ mode: "readwrite" });
            if (perm === "granted") {
              const slugs = await listProjectSlugs(saved);
              if (slugs.length) {
                const loadedProjects = [];
                for (const slug of slugs) {
                  const data = await loadProjectFromFolder(saved, slug);
                  if (data) loadedProjects.push(initProject(data));
                }
                if (loadedProjects.length) {
                  setProjects(loadedProjects);
                  setActiveProjectId(loadedProjects[0].id);
                }
              }
              setProjectRoot(saved);
              setFolderStatus({ projects: "connected" });
            } else {
              setFolderStatus({ projects: "saved" });
            }
          } catch {
            setFolderStatus({ projects: "saved" });
          }
        }
      } catch { /* no folder yet */ }
    })();
  }, []);

  const pickProjectsFolder = async () => {
    setFolderBusy(true);
    setFolderError("");
    try {
      const dir = await window.showDirectoryPicker({ mode: "readwrite" });
      await idbSet(PROJECT_ROOT_KEY, dir);
      setProjectRoot(dir);
      setFolderStatus({ projects: "connected" });
      const slugs = await listProjectSlugs(dir);
      if (slugs.length) {
        const loadedProjects = [];
        for (const slug of slugs) {
          const data = await loadProjectFromFolder(dir, slug);
          if (data) loadedProjects.push(initProject(data));
        }
        if (loadedProjects.length) {
          setProjects(loadedProjects);
          setActiveProjectId(loadedProjects[0].id);
        }
      }
    } catch (e) { if (e.name !== "AbortError") setFolderError(e.message || String(e)); }
    setFolderBusy(false);
  };

  // Save each project to its own per-slug folder on every change
  useEffect(() => {
    if (!projectRoot) return;
    (async () => {
      for (const project of projects) {
        await saveProjectToFolder(projectRoot, project.slug, project);
      }
    })();
  }, [projects, projectRoot]);

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: "auto" });
  }, [page, activeProjectId]);

  const updateCredit = (updated) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== activeProjectId) return p;
      return { ...p, credits: p.credits.map(c => c.code === updated.code ? updated : c) };
    }));
  };

  const createProject = (formData) => {
    const id = Date.now();
    const baseSlug = slugify(formData.name) || `project-${id}`;
    const existingSlugs = new Set(projects.map(p => p.slug));
    let slug = baseSlug;
    let suffix = 2;
    while (existingSlugs.has(slug)) {
      slug = `${baseSlug}-${suffix++}`;
    }
    const newProject = {
      id, slug,
      ...formData,
      building_age: "",
      assessment_date: formData.assessment_date || tod(),
      target_date: formData.target_date || "",
      created_at: tod(),
      status: "pre-assessment",
      credits: CREDITS.map(c => ({
        code: c.code, pursuing: false, status: "not_pursuing",
        score: 0, completion: 0, narrative: "", evidence: [], selectedAnswer: "", selectedAnswers: [],
      })),
    };
    const initialized = initProject(newProject);
    setProjects(prev => [...prev, initialized]);
    setActiveProjectId(id);
    (async () => {
      const saved = await idbGet(PROJECT_ROOT_KEY);
      if (!saved) return;
      try {
        await createProjectFolderStructure(saved, initialized);
        await saveProjectToFolder(saved, initialized.slug, initialized);
      } catch (e) { /* non-fatal */ }
    })();
  };

  const project = { ...activeProject };
  const pages = {
    home: <HomePage project={project} onNavigate={setPage} />,
    preassessment: <PreAssessmentPage project={project} onUpdate={updateCredit} projectRoot={projectRoot} projectSlug={project.slug} />,
    assessment: <AssessmentPage project={project} onUpdate={updateCredit} projectRoot={projectRoot} projectSlug={project.slug} />,
    vault: <EvidenceVaultPage project={project} />,
    package: <EvidencePackagePage project={project} />,
    meetings: <MeetingsPage project={project} meetings={meetings} onMeetingsChange={setMeetings} projectRoot={projectRoot} projectSlug={project.slug} />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", alignItems: "stretch" }}>
      <nav style={{ width: 220, minHeight: "100vh", borderRight: "1px solid rgba(0,0,0,0.06)", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 4, flexShrink: 0, background: "#ffffff", position: "sticky", top: 0, alignSelf: "flex-start" }}>
        <div style={{ padding: "0 12px 20px", borderBottom: "1px solid rgba(0,0,0,0.06)", marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>BREEAM In Use</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#1e293b" }}>BIU Tracker</div>
        </div>

        <NavPill label="Home"             icon="🏠"  active={page === "home"}          onClick={() => setPage("home")} />
        <NavPill label="Pre-Assessment"   icon="🔍"  active={page === "preassessment"} onClick={() => setPage("preassessment")} />
        <NavPill label="Assessment"       icon="📋"  active={page === "assessment"}    onClick={() => setPage("assessment")} />
        <NavPill label="Evidence Vault"   icon="📦"  active={page === "vault"}         onClick={() => setPage("vault")} />
        <NavPill label="Evidence Package" icon="📄"  active={page === "package"}       onClick={() => setPage("package")} />
        <NavPill label="Meetings"         icon="📅"  active={page === "meetings"}      onClick={() => setPage("meetings")} />

        <div style={{ marginTop: "auto", padding: "16px 12px 0", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <FolderStatusPill folderStatus={folderStatus} onClick={() => setShowFolderSetup(true)} />

          <div style={{ marginTop: 10, marginBottom: 6, fontSize: 10, color: "#475569" }}>Active project</div>
          <select value={String(activeProjectId)} onChange={e => {
              const raw = e.target.value;
              const match = projects.find(p => String(p.id) === raw);
              setActiveProjectId(match ? match.id : raw);
            }}
            style={{ width: "100%", padding: "7px 10px", borderRadius: 8, background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.10)", color: "#1e293b", fontSize: 12, fontFamily: "inherit" }}>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button onClick={() => setShowNewProject(true)}
            style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px dashed rgba(124,58,237,0.25)", background: "rgba(124,58,237,0.05)", color: "#7c3aed", cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "inherit", marginTop: 8 }}>
            + New Project
          </button>
        </div>
      </nav>

      <main ref={mainRef} style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
        {pages[page] || pages.home}
        {showFolderSetup && (
          <FolderSetupScreen folderStatus={folderStatus} folderError={folderError} onPick={pickProjectsFolder} onClose={() => { setShowFolderSetup(false); setFolderError(""); }} />
        )}
        {showNewProject && (
          <NewProjectModal onClose={() => setShowNewProject(false)} onCreate={createProject} />
        )}
      </main>
    </div>
  );
}
