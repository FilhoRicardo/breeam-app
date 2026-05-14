import { useState, useEffect, useRef } from "react";
import { CREDITS } from "./data/credits.js";
import { DEMO_PROJECT } from "./data/projects.js";

// ── Helpers ──────────────────────────────────────────────────────────────────
const tod = (d = new Date()) => d.toISOString().slice(0, 10);
const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const CATEGORY_COLORS = {
  Management:  { bg: "rgba(124,58,237,0.12)",  border: "rgba(124,58,237,0.35)", color: "#a78bfa" },
  Energy:       { bg: "rgba(245,158,11,0.12)",   border: "rgba(245,158,11,0.35)",  color: "#fbbf24" },
  Water:        { bg: "rgba(59,130,246,0.12)",   border: "rgba(59,130,246,0.35)",  color: "#60a5fa" },
  Materials:    { bg: "rgba(16,185,129,0.12)",   border: "rgba(16,185,129,0.35)",  color: "#10b981" },
  Waste:        { bg: "rgba(168,85,247,0.12)",   border: "rgba(168,85,247,0.35)",  color: "#c084fc" },
  Health:       { bg: "rgba(236,72,153,0.12)",    border: "rgba(236,72,153,0.35)",  color: "#f472b6" },
  Pollution:    { bg: "rgba(239,68,68,0.12)",    border: "rgba(239,68,68,0.35)",   color: "#f87171" },
  Transport:    { bg: "rgba(34,211,238,0.12)",    border: "rgba(34,211,238,0.35)",  color: "#22d3ee" },
  Ecology:      { bg: "rgba(132,204,22,0.12)",    border: "rgba(132,204,22,0.35)",  color: "#a3e635" },
};
const STATUS_COLORS = {
  complete:     { bg: "rgba(16,185,129,0.12)",   color: "#10b981" },
  in_progress:  { bg: "rgba(99,102,241,0.12)",   color: "#818cf8" },
  not_pursuing: { bg: "rgba(100,116,139,0.12)",  color: "#64748b" },
};

// ── Storage ──────────────────────────────────────────────────────────────────
const LS_KEY = "biu_projects_v1";
const LS_MEETINGS = "biu_meetings_v1";

function loadProjects() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [initProject(DEMO_PROJECT)];
    const arr = JSON.parse(raw);
    return arr.length ? arr.map(p => initProject(p)) : [initProject(DEMO_PROJECT)];
  } catch { return [initProject(DEMO_PROJECT)]; }
}

function saveProjects(projects) {
  localStorage.setItem(LS_KEY, JSON.stringify(projects));
}

function initProject(project) {
  return {
    ...project,
    credits: project.credits.map(pc => {
      const def = CREDITS.find(c => c.code === pc.code);
      return def ? { ...pc, part: def.part, category: def.category } : { ...pc, part: 1, category: "Management" };
    }),
  };
}

function loadMeetings() {
  try {
    const raw = localStorage.getItem(LS_MEETINGS);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveMeetings(meetings) {
  localStorage.setItem(LS_MEETINGS, JSON.stringify(meetings));
}

// ── Scoring helpers ──────────────────────────────────────────────────────────
function ratingLabel(score) {
  if (score >= 85) return "Outstanding";
  if (score >= 70) return "Excellent";
  if (score >= 55) return "Very Good";
  if (score >= 45) return "Good";
  if (score >= 30) return "Pass";
  return "Unclassified";
}

function calcPartScores(credits) {
  const part1 = credits.filter(c => c.part === 1 && c.pursuing);
  const part2 = credits.filter(c => c.part === 2 && c.pursuing);
  return {
    part1Score: part1.reduce((s, c) => s + (c.score || 0), 0),
    part1Avail: part1.reduce((s, c) => s + c.available, 0),
    part2Score: part2.reduce((s, c) => s + (c.score || 0), 0),
    part2Avail: part2.reduce((s, c) => s + c.available, 0),
  };
}

// ── Nav pills ────────────────────────────────────────────────────────────────
function NavPill({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        width: "100%", padding: "11px 16px",
        borderRadius: 10, border: "none", cursor: "pointer",
        background: active ? "rgba(124,58,237,0.15)" : "transparent",
        color: active ? "#c4b5fd" : "#64748b",
        fontSize: 13, fontWeight: active ? 700 : 500,
        fontFamily: "inherit", textAlign: "left",
        transition: "all 0.15s",
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      {label}
    </button>
  );
}

// ── Score Bar ────────────────────────────────────────────────────────────────
function ScoreBar({ score, available, target }) {
  const pct = available ? (score / available) * 100 : 0;
  const targetPct = available ? (target / available) * 100 : 0;
  const color = pct >= targetPct ? "#10b981" : pct >= targetPct * 0.7 ? "#fbbf24" : "#f87171";
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b", marginBottom: 5 }}>
        <span style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}></span>
        <span>{score} / {available} <span style={{ color: "#475569" }}>(target: {target})</span></span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.07)", overflow: "hidden", position: "relative" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: "width 0.6s" }} />
        <div style={{ position: "absolute", top: 0, left: `${targetPct}%`, width: 2, height: "100%", background: "rgba(255,255,255,0.4)" }} />
      </div>
    </div>
  );
}

// ── Credit Card ──────────────────────────────────────────────────────────────
function CreditCard({ credit, onUpdate, readOnly }) {
  const sc = STATUS_COLORS[credit.status] || STATUS_COLORS.not_pursuing;
  const cc = CATEGORY_COLORS[credit.category] || CATEGORY_COLORS.Management;

  const togglePursuing = () => {
    if (readOnly) return;
    onUpdate({ ...credit, pursuing: !credit.pursuing, status: !credit.pursuing ? "in_progress" : "not_pursuing" });
  };

  return (
    <div style={{
      borderRadius: 12, border: `1px solid ${sc.border}`,
      background: sc.bg, overflow: "hidden", marginBottom: 10,
    }}>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 800, background: cc.bg, color: cc.color, padding: "2px 7px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {credit.code}
              </span>
              <span style={{ fontSize: 11, color: "#64748b" }}>{credit.category}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.3 }}>{credit.title}</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>
              {credit.available} credits available
              {credit.pursuing && credit.score > 0 && <> · <strong style={{ color: "#10b981" }}>{credit.score} achieved</strong></>}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
            {readOnly ? (
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: sc.bg, color: sc.color, textTransform: "uppercase" }}>
                {credit.status.replace("_", " ")}
              </span>
            ) : (
              <button
                onClick={togglePursuing}
                style={{
                  fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20,
                  border: "none", cursor: "pointer",
                  background: credit.pursuing ? "rgba(16,185,129,0.15)" : "rgba(100,116,139,0.12)",
                  color: credit.pursuing ? "#10b981" : "#64748b",
                }}
              >
                {credit.pursuing ? "Pursuing" : "Skip"}
              </button>
            )}
            {credit.pursuing && (
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 80, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.08)" }}>
                  <div style={{ height: "100%", width: `${credit.completion}%`, background: "#818cf8", borderRadius: 99 }} />
                </div>
                <span style={{ fontSize: 10, color: "#64748b" }}>{credit.completion}%</span>
              </div>
            )}
          </div>
        </div>

        {credit.pursuing && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${sc.border}` }}>
            <textarea
              value={credit.narrative || ""}
              onChange={e => !readOnly && onUpdate({ ...credit, narrative: e.target.value })}
              placeholder={readOnly ? "No narrative yet." : "Write your assessment narrative here..."}
              readOnly={readOnly}
              rows={3}
              style={{
                width: "100%", boxSizing: "border-box", padding: "10px 12px",
                borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)", color: "#e2e8f0",
                fontSize: 12, lineHeight: 1.55, resize: "vertical", fontFamily: "inherit",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Evidence Modal ───────────────────────────────────────────────────────────
function EvidenceModal({ credit, onClose, onSave }) {
  const [files, setFiles] = useState([]);
  const [links, setLinks] = useState((credit.evidence || []).join("\n"));

  const addFiles = (incoming) => setFiles(prev => [...prev, ...incoming]);
  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const handleSave = () => {
    const evidence = [
      ...files.map(f => ({ name: f.name, type: "upload", size: f.size })),
      ...links.split("\n").filter(l => l.trim()),
    ];
    onSave({ ...credit, evidence });
    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: "#1e1b4b", border: "1px solid rgba(124,58,237,0.3)",
        borderRadius: 16, width: "100%", maxWidth: 620, maxHeight: "90vh",
        overflow: "hidden", display: "flex", flexDirection: "column",
      }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, color: "#a78bfa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Evidence</div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#f1f5f9" }}>{credit.code} — {credit.title}</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 22 }}>×</button>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "20px 24px" }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Upload files</div>
            <label style={{ display: "block", padding: "20px", borderRadius: 10, border: "2px dashed rgba(124,58,237,0.3)", textAlign: "center", cursor: "pointer" }}>
              <input
                type="file" multiple
                accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx,.zip,.7z,.rar,.tar,.gz"
                style={{ display: "none" }}
                onChange={e => {
                  const MAX_SIZE = 50 * 1024 * 1024; // 50 MB
                  const valid = Array.from(e.target.files || []).filter(f => {
                    if (f.size > MAX_SIZE) { alert(`${f.name} exceeds 50 MB limit`); return false; }
                    return true;
                  });
                  addFiles(valid);
                }}
              />
              <div style={{ fontSize: 13, color: "#a78bfa", fontWeight: 700 }}>+ Drop files or click to browse</div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>PDF, images, spreadsheets, DOCX, archives (ZIP, 7Z, RAR, TAR.GZ)</div>
            </label>
            {files.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.04)", marginTop: 6 }}>
                <span style={{ fontSize: 12, color: "#e2e8f0" }}>{f.name}</span>
                <button onClick={() => removeFile(i)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 16 }}>×</button>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Or paste file paths / URLs</div>
            <textarea
              value={links}
              onChange={e => setLinks(e.target.value)}
              rows={4}
              placeholder={"../greenwich_part1_man1/timber_coc.pdf\nhttps://example.com/energy-cert.pdf"}
              style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#e2e8f0", fontSize: 12, lineHeight: 1.55, resize: "vertical", fontFamily: "inherit" }}
            />
          </div>
        </div>

        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onClose} style={{ padding: "9px 18px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#94a3b8", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>Cancel</button>
          <button onClick={handleSave} style={{ padding: "9px 20px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#7c3aed,#3b82f6)", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>Save Evidence</button>
        </div>
      </div>
    </div>
  );
}

// ── PDF Report Generator ────────────────────────────────────────────────────
function generatePDF(project) {
  const { part1Score, part1Avail, part2Score, part2Avail } = calcPartScores(project.credits);
  const part1Pct = part1Avail ? Math.round(part1Score / part1Avail * 100) : 0;
  const part2Pct = part2Avail ? Math.round(part2Score / part2Avail * 100) : 0;

  let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${project.name} — BREEAM Evidence Package</title>
<style>
  body { font-family: Arial, sans-serif; margin: 40px; color: #111; font-size: 13px; }
  h1 { font-size: 22px; border-bottom: 2px solid #10b981; padding-bottom: 10px; }
  h2 { font-size: 16px; color: #444; margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 6px; }
  .score-section { background: #f8f9fa; padding: 16px 20px; border-radius: 8px; margin: 20px 0; }
  .credit { margin-bottom: 20px; padding: 14px; border-left: 4px solid #7c3aed; background: #fafafa; }
  .credit-header { font-weight: bold; font-size: 14px; margin-bottom: 6px; }
  .meta { color: #666; font-size: 11px; margin-bottom: 4px; }
  .narrative { margin-top: 6px; line-height: 1.6; }
  .evidence { margin-top: 6px; font-size: 12px; color: #444; }
  .figure { font-style: italic; color: #555; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; }
  td, th { border: 1px solid #ddd; padding: 8px 12px; text-align: left; font-size: 12px; }
  th { background: #f0f0f0; font-weight: bold; }
</style></head><body>
<h1>${project.name}</h1>
<p><strong>BREEAM In Use Evidence Package</strong> — ${project.assessor}<br/>
Assessment date: ${project.assessment_date} | Area: ${project.area_sqm} m² | Building age: ${project.building_age}</p>

<div class="score-section">
  <strong>Part 1 — Asset Performance:</strong> ${part1Score} / ${part1Avail} credits (${part1Pct}%) &nbsp;|&nbsp;
  <strong>Part 2 — Building Management:</strong> ${part2Score} / ${part2Avail} credits (${part2Pct}%)
</div>`;

  for (const part of [1, 2]) {
    const label = part === 1 ? "Part 1 — Asset Performance" : "Part 2 — Building Management";
    html += `<h2>${label}</h2>`;
    const partCredits = project.credits.filter(c => c.part === part && c.pursuing);
    for (const credit of partCredits) {
      html += `<div class="credit">
  <div class="credit-header">${credit.code} — ${credit.title}</div>
  <div class="meta">Category: ${credit.category} | Available: ${credit.available} | Score: ${credit.score}</div>
  <div class="narrative">${credit.narrative || "—"}</div>
  ${credit.evidence?.length ? `<div class="evidence">Evidence (${credit.evidence.length} file(s)):<br/>` +
    credit.evidence.map((e, i) => `<div class="figure">Figure ${i + 1}: ${typeof e === "string" ? e : e.name}</div>`).join("") + `</div>` : ""}
</div>`;
    }
  }

  html += `</body></html>`;
  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.print();
}

// ── New Project Modal ────────────────────────────────────────────────────────
function NewProjectModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    name: "", category: "Office", location: "",
    area_sqm: "", assessor: "", assessment_date: tod(), target_date: "",
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCreate = () => {
    if (!form.name.trim()) { alert("Project name is required"); return; }
    onCreate({
      name: form.name.trim(),
      category: form.category,
      location: form.location.trim(),
      area_sqm: parseInt(form.area_sqm) || 0,
      assessor: form.assessor.trim(),
      assessment_date: form.assessment_date,
      target_date: form.target_date,
    });
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#1e1b4b", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 16, width: "100%", maxWidth: 520, maxHeight: "90vh", overflow: "auto" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, color: "#a78bfa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>New Project</div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#f1f5f9" }}>Create BREEAM Project</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 22 }}>×</button>
        </div>
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { label: "Project Name *", key: "name", type: "text", placeholder: "e.g. Canary Wharf Tower A", col: "1" },
            { label: "Location", key: "location", type: "text", placeholder: "e.g. London E14 5AB", col: "1" },
            { label: "Category", key: "category", type: "select", options: ["Office","Retail","Industrial","Residential","Education","Healthcare","Mixed Use"], col: "1" },
            { label: "Floor Area (m²)", key: "area_sqm", type: "number", placeholder: "e.g. 3200", col: "1" },
            { label: "BREEAM Assessor", key: "assessor", type: "text", placeholder: "e.g. Jane Holloway", col: "1" },
            { label: "Assessment Date", key: "assessment_date", type: "date", col: "1" },
            { label: "Target Certification", key: "target_date", type: "date", col: "1" },
          ].map(({ label, key, type, placeholder, options }) => (
            <div key={key}>
              <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>{label}</div>
              {type === "select" ? (
                <select value={form[key]} onChange={e => set(key, e.target.value)}
                  style={{ width: "100%", padding: "8px 11px", boxSizing: "border-box", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0", fontSize: 13, fontFamily: "inherit" }}>
                  {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type={type} value={form[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder}
                  style={{ width: "100%", padding: "8px 11px", boxSizing: "border-box", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0", fontSize: 13, fontFamily: "inherit" }} />
              )}
            </div>
          ))}
        </div>
        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onClose} style={{ padding: "9px 18px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#94a3b8", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>Cancel</button>
          <button onClick={handleCreate} style={{ padding: "9px 20px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#7c3aed,#3b82f6)", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>Create Project</button>
        </div>
      </div>
    </div>
  );
}

// ── Export meeting as .md ───────────────────────────────────────────────────
function exportMeetingMd(meeting) {
  const header = [
    "---",
    `title: "${meeting.title}"`,
    `date: "${meeting.date}"`,
    `attendees: "${(meeting.attendees || []).join(", ")}"`,
    `project: "${meeting.projectName || ""}"`,
    `tags: ["meeting", "breeam"]`,
    "---",
    "",
    `# ${meeting.title}`,
    "",
    `**Date:** ${meeting.date}`,
    meeting.attendees?.length ? `\n**Attendees:** ${meeting.attendees.join(", ")}` : "",
    "",
    "## Notes",
    "",
    meeting.notes || "_No notes recorded._",
  ].filter(Boolean).join("\n");

  const blob = new Blob([header], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${meeting.date}_${slugify(meeting.title)}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── PAGE: Home ──────────────────────────────────────────────────────────────
function HomePage({ project, onNavigate }) {
  const { part1Score, part1Avail, part2Score, part2Avail } = calcPartScores(project.credits);
  const part1Target = 40, part2Target = 16;
  const overallScore = part1Score + part2Score;
  const overallRating = ratingLabel(overallScore);

  const pursuing = project.credits.filter(c => c.pursuing);
  const complete = pursuing.filter(c => c.status === "complete");
  const inProgress = pursuing.filter(c => c.status === "in_progress");

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Dashboard</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#f1f5f9" }}>{project.name}</h1>
        <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{project.category} · {project.location} · {project.area_sqm} m² · {project.assessor}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        <div style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 14, padding: "20px 22px" }}>
          <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Overall Score</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#f1f5f9" }}>{overallScore}</div>
          <div style={{ fontSize: 12, color: "#10b981", fontWeight: 600, marginTop: 4 }}>{overallRating}</div>
        </div>
        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 14, padding: "20px 22px" }}>
          <div style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Part 1 — Asset</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#f1f5f9" }}>{part1Score}<span style={{ fontSize: 18, color: "#475569" }}>/{part1Avail}</span></div>
          <ScoreBar score={part1Score} available={part1Avail} target={part1Target} />
        </div>
        <div style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 14, padding: "20px 22px" }}>
          <div style={{ fontSize: 11, color: "#60a5fa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Part 2 — BM</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#f1f5f9" }}>{part2Score}<span style={{ fontSize: 18, color: "#475569" }}>/{part2Avail}</span></div>
          <ScoreBar score={part2Score} available={part2Avail} target={part2Target} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 22px" }}>
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Credit Progress</div>
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#10b981" }}>{complete.length}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>Complete</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#818cf8" }}>{inProgress.length}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>In Progress</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#64748b" }}>{pursuing.length}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>Pursuing</div>
            </div>
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 4 }}>
            {pursuing.map(c => {
              const sc = STATUS_COLORS[c.status] || STATUS_COLORS.not_pursuing;
              return <div key={c.code} style={{ flex: 1, height: 4, borderRadius: 99, background: sc.color }} title={`${c.code}: ${c.status}`} />;
            })}
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 22px" }}>
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Quick Actions</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => onNavigate("assessment")} style={{ padding: "9px 16px", borderRadius: 9, border: "none", background: "rgba(124,58,237,0.15)", color: "#a78bfa", cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "inherit" }}>Continue Assessment →</button>
            <button onClick={() => onNavigate("preassessment")} style={{ padding: "9px 16px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#94a3b8", cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "inherit" }}>Pre-Assessment</button>
            <button onClick={() => generatePDF(project)} style={{ padding: "9px 16px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#94a3b8", cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "inherit" }}>📄 Generate PDF</button>
            <button onClick={() => onNavigate("meetings")} style={{ padding: "9px 16px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#94a3b8", cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "inherit" }}>📅 Meetings</button>
          </div>
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 22px" }}>
        <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>By Category — Part 1 Asset Performance</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {["Management","Energy","Water","Materials","Waste","Health","Pollution","Transport","Ecology"].map(cat => {
            const catCredits = project.credits.filter(c => c.category === cat && c.part === 1);
            if (!catCredits.length) return null;
            const pursuing = catCredits.filter(c => c.pursuing);
            const score = pursuing.reduce((s, c) => s + (c.score || 0), 0);
            const avail = pursuing.reduce((s, c) => s + c.available, 0);
            const cc = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Management;
            return (
              <div key={cat} style={{ background: cc.bg, border: `1px solid ${cc.border}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: cc.color, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{cat}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9" }}>{score}<span style={{ fontSize: 12, color: "#475569" }}>/{avail}</span></div>
                <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{pursuing.length} credits pursuing</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── PAGE: Pre-Assessment ─────────────────────────────────────────────────────
function PreAssessmentPage({ project, onUpdate }) {
  const [part, setPart] = useState(1);
  const [selectedCat, setSelectedCat] = useState("Management");
  const [selectedCredit, setSelectedCredit] = useState(null);

  const CATEGORIES = ["Management", "Energy", "Water", "Materials", "Waste", "Health", "Pollution", "Transport", "Ecology"];

  const credits = project.credits
    .map(pc => {
      const def = CREDITS.find(c => c.code === pc.code);
      return def ? { ...pc, part: def.part, category: def.category } : null;
    })
    .filter(Boolean)
    .filter(c => c.part === part);
  const catCredits = credits.filter(c => c.category === selectedCat);

  const pursuing = credits.filter(c => c.pursuing);
  const notPursuing = credits.filter(c => !c.pursuing);

  // Sync selected credit if it becomes un-pursued
  const liveCredit = selectedCredit ? project.credits.find(c => c.code === selectedCredit.code) : null;
  const displayCredit = liveCredit || selectedCredit;

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      {/* LEFT PANEL — Category tabs + credit list */}
      <div style={{ width: 320, borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Pre-Assessment</div>
          <h1 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800, color: "#f1f5f9" }}>Credit Decision</h1>
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 16 }}>Select Part → Category → Credit</div>

          {/* Part selector */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {[1, 2].map(p => (
              <button key={p} onClick={() => { setPart(p); setSelectedCredit(null); }}
                style={{ flex: 1, padding: "7px 10px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 11, fontFamily: "inherit",
                  background: part === p ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)", color: part === p ? "#c4b5fd" : "#64748b" }}>
                Part {p}
              </button>
            ))}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <span style={{ fontSize: 10, color: "#10b981", fontWeight: 700 }}>{pursuing.length}✓</span>
              <span style={{ fontSize: 10, color: "#475569" }}>|</span>
              <span style={{ fontSize: 10, color: "#64748b" }}>{notPursuing.length}✗</span>
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "0 12px", marginBottom: 8 }}>
          {CATEGORIES.map(cat => {
            const catCredits_ = credits.filter(c => c.category === cat);
            const pursuingCount = catCredits_.filter(c => c.pursuing).length;
            const cc = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Management;
            return (
              <button key={cat} onClick={() => { setSelectedCat(cat); setSelectedCredit(null); }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                  background: selectedCat === cat ? cc.bg : "transparent", color: selectedCat === cat ? cc.color : "#64748b", fontWeight: selectedCat === cat ? 700 : 500, fontSize: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: cc.color, flexShrink: 0, opacity: pursuingCount > 0 ? 1 : 0.3 }} />
                {cat}
                {pursuingCount > 0 && <span style={{ marginLeft: "auto", fontSize: 10, opacity: 0.7 }}>({pursuingCount})</span>}
              </button>
            );
          })}
        </div>

        {/* Credit list for selected category */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 12px" }}>
          <div style={{ fontSize: 10, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8, padding: "0 8px" }}>
            {selectedCat} — {catCredits.length} credits
          </div>
          {catCredits.map(c => {
            const sc = STATUS_COLORS[c.pursuing ? "in_progress" : "not_pursuing"];
            const cc = CATEGORY_COLORS[c.category] || CATEGORY_COLORS.Management;
            return (
              <div key={c.code} onClick={() => setSelectedCredit(c)}
                style={{ padding: "10px 12px", borderRadius: 9, marginBottom: 4, cursor: "pointer",
                  background: selectedCredit?.code === c.code ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${selectedCredit?.code === c.code ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.06)"}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: cc.color }}>{c.code}</span>
                  {c.pursuing
                    ? <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 20, background: "rgba(16,185,129,0.12)", color: "#10b981" }}>PURSUING</span>
                    : <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 20, background: "rgba(100,116,139,0.12)", color: "#64748b" }}>SKIP</span>}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.3 }}>{c.title}</div>
                {c.available > 1 && <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{c.available} credits available</div>}
              </div>
            );
          })}
          {catCredits.length === 0 && (
            <div style={{ fontSize: 11, color: "#334155", textAlign: "center", padding: 20 }}>No credits in this category</div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL — Credit detail or empty state */}
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        {!displayCredit ? (
          <div style={{ color: "#334155", fontSize: 13, padding: "80px 20px", textAlign: "center", border: "1px dashed rgba(255,255,255,0.07)", borderRadius: 12 }}>
            Select a credit from the left to view criteria and make your decision
          </div>
        ) : (
          <div>
            {/* Credit header */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800, background: "rgba(124,58,237,0.15)", color: "#a78bfa", padding: "4px 10px", borderRadius: 20 }}>{displayCredit.code}</span>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>{displayCredit.title}</span>
                <span style={{ fontSize: 11, color: "#475569" }}>Part {displayCredit.part} · {displayCredit.category}</span>
                {displayCredit.available > 1 && <span style={{ fontSize: 11, color: "#475569" }}>· {displayCredit.available} credits</span>}
              </div>

              {/* Pursue / Skip toggle */}
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button
                  onClick={() => {
                    const updated = { ...displayCredit, pursuing: true, status: "in_progress" };
                    onUpdate(updated);
                    setSelectedCredit(updated);
                  }}
                  style={{ padding: "10px 24px", borderRadius: 10, border: displayCredit.pursuing ? "2px solid #10b981" : "1px solid rgba(255,255,255,0.1)", background: displayCredit.pursuing ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)", color: displayCredit.pursuing ? "#10b981" : "#64748b", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>
                  ✓ Pursue this credit
                </button>
                <button
                  onClick={() => {
                    const updated = { ...displayCredit, pursuing: false, status: "not_pursuing", score: 0 };
                    onUpdate(updated);
                  }}
                  style={{ padding: "10px 24px", borderRadius: 10, border: !displayCredit.pursuing ? "2px solid #64748b" : "1px solid rgba(255,255,255,0.1)", background: !displayCredit.pursuing ? "rgba(100,116,139,0.1)" : "rgba(255,255,255,0.04)", color: !displayCredit.pursuing ? "#94a3b8" : "#475569", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>
                  ✗ Skip this credit
                </button>
              </div>
            </div>

            {/* Show full criteria only if pursuing */}
            {displayCredit.pursuing && displayCredit.criteria ? (
              <div>
                {/* Answer options dropdown */}
                {displayCredit.answers && (
                  <div style={{ marginBottom: 20, background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 12, padding: "16px 20px" }}>
                    <div style={{ fontSize: 11, color: "#a78bfa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                      Question — select answer
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12, fontStyle: "italic" }}>
                      {displayCredit.question}
                    </div>
                    {displayCredit.instruction && (
                      <div style={{ fontSize: 11, color: "#fbbf24", marginBottom: 10, padding: "6px 10px", background: "rgba(251,191,36,0.08)", borderRadius: 6 }}>
                        {displayCredit.instruction}
                      </div>
                    )}
                    <select
                      value={displayCredit.selectedAnswer || ""}
                      onChange={e => {
                        const ans = displayCredit.answers.find(a => a.id === e.target.value);
                        const updated = { ...displayCredit, selectedAnswer: e.target.value, score: ans ? ans.credits : 0 };
                        onUpdate(updated);
                        setSelectedCredit(updated);
                      }}
                      style={{ width: "100%", padding: "10px 14px", boxSizing: "border-box", borderRadius: 9, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#e2e8f0", fontSize: 13, fontFamily: "inherit", marginBottom: 8 }}
                    >
                      <option value="">— Select an answer —</option>
                      {displayCredit.answers.map(a => (
                        <option key={a.id} value={a.id}>Option {a.id}: {a.label} ({a.credits} credit{a.credits !== 1 ? "s" : ""})</option>
                      ))}
                    </select>
                    {displayCredit.selectedAnswer && (
                      <div style={{ marginTop: 10, padding: "10px 14px", background: "rgba(16,185,129,0.08)", borderRadius: 8, fontSize: 12, color: "#10b981" }}>
                        <strong>Selected:</strong> Option {displayCredit.selectedAnswer} — {displayCredit.answers.find(a => a.id === displayCredit.selectedAnswer)?.label}
                        <span style={{ marginLeft: 12, fontWeight: 700 }}>{displayCredit.answers.find(a => a.id === displayCredit.selectedAnswer)?.credits} credit(s)</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Assessment criteria */}
                {displayCredit.criteria && displayCredit.criteria.length > 0 && (
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                      Assessment Criteria
                    </div>
                    {displayCredit.criteria.map(cr => (
                      <div key={cr.id} style={{ marginBottom: 14, padding: "12px 16px", borderRadius: 9, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <span style={{ fontSize: 10, fontWeight: 800, background: "rgba(124,58,237,0.15)", color: "#a78bfa", padding: "2px 7px", borderRadius: 20 }}>#{cr.id}</span>
                          {cr.answer && <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(245,158,11,0.12)", color: "#fbbf24", padding: "2px 7px", borderRadius: 20 }}>→ {cr.answer}</span>}
                        </div>
                        <div style={{ fontSize: 12, color: "#e2e8f0", lineHeight: 1.55 }}>{cr.text}</div>
                        {cr.details && cr.details.length > 0 && (
                          <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
                            {cr.details.map((d, i) => (
                              <li key={i} style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5, marginBottom: 4 }}>{d}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Methodology */}
                {displayCredit.methodology && displayCredit.methodology.length > 0 && (
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                      Methodology
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9, padding: "14px 18px" }}>
                      {displayCredit.methodology.filter(Boolean).map((line, i) => (
                        <div key={i} style={{ fontSize: 12, color: line.startsWith(" ") ? "#94a3b8" : "#e2e8f0", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{line}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Evidence requirements */}
                {displayCredit.evidence && displayCredit.evidence.length > 0 && (
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                      Evidence Requirements
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9, padding: "14px 18px" }}>
                      {displayCredit.evidence.map((ev, i) => (
                        <div key={i} style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5, marginBottom: 6, display: "flex", gap: 8 }}>
                          <span style={{ color: "#60a5fa", fontWeight: 700, flexShrink: 0 }}>•</span>
                          {ev}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Asset-specific notes */}
                {displayCredit.notes && displayCredit.notes.length > 0 && (
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                      Asset-Specific Notes
                    </div>
                    {displayCredit.notes.map((note, i) => (
                      <div key={i} style={{ fontSize: 12, color: "#64748b", lineHeight: 1.55, marginBottom: 8, padding: "10px 14px", background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.12)", borderRadius: 8 }}>{note}</div>
                    ))}
                  </div>
                )}

                {/* Assessor comments */}
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                    Assessor Comments / Evidence Notes
                  </div>
                  <textarea
                    value={displayCredit.narrative || ""}
                    onChange={e => {
                      const updated = { ...displayCredit, narrative: e.target.value };
                      onUpdate(updated);
                      setSelectedCredit(updated);
                    }}
                    rows={5}
                    placeholder="Record your assessment notes, evidence references, calculations, and justification here..."
                    style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#e2e8f0", fontSize: 13, lineHeight: 1.55, resize: "vertical", fontFamily: "inherit" }}
                  />
                </div>

                {/* Score achieved */}
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                    Credits Achieved (0 – {displayCredit.available})
                  </div>
                  <input
                    type="number" min="0" max={displayCredit.available}
                    value={displayCredit.score || 0}
                    onChange={e => {
                      const updated = { ...displayCredit, score: parseInt(e.target.value) || 0 };
                      onUpdate(updated);
                      setSelectedCredit(updated);
                    }}
                    style={{ width: 100, padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#e2e8f0", fontSize: 16, fontWeight: 700, fontFamily: "inherit" }}
                  />
                  <span style={{ fontSize: 12, color: "#475569", marginLeft: 12 }}>
                    out of {displayCredit.available} available credits
                  </span>
                </div>

                {/* Status */}
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                    Status
                  </div>
                  <select
                    value={displayCredit.status || "in_progress"}
                    onChange={e => {
                      const updated = { ...displayCredit, status: e.target.value };
                      onUpdate(updated);
                      setSelectedCredit(updated);
                    }}
                    style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#e2e8f0", fontSize: 13, fontFamily: "inherit" }}>
                    <option value="in_progress">In Progress</option>
                    <option value="complete">Complete</option>
                  </select>
                </div>
              </div>
            ) : displayCredit.pursuing && !displayCredit.criteria ? (
              <div style={{ color: "#334155", fontSize: 12, padding: 20, textAlign: "center", border: "1px dashed rgba(255,255,255,0.07)", borderRadius: 10 }}>
                BREEAM criteria for {displayCredit.code} not yet loaded — upload the credit PDF collection to populate.
              </div>
            ) : (
              <div style={{ color: "#475569", fontSize: 12, padding: 20, textAlign: "center" }}>
                Toggle <strong>Pursue</strong> above to load full BREEAM criteria for {displayCredit.code}.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── PAGE: Assessment ─────────────────────────────────────────────────────────
function AssessmentPage({ project, onUpdate }) {
  const [part, setPart] = useState(1);
  const [activeCredit, setActiveCredit] = useState(null);
  const credits = project.credits.filter(c => c.part === part && c.pursuing);

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Assessment</div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#f1f5f9" }}>Assessment — Narratives & Evidence</h1>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[1, 2].map(p => {
          const count = project.credits.filter(c => c.part === p && c.pursuing).length;
          return (
            <button key={p} onClick={() => setPart(p)}
              style={{ padding: "8px 18px", borderRadius: 9, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit",
                background: part === p ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)", color: part === p ? "#c4b5fd" : "#64748b" }}>
              Part {p} — {p === 1 ? "Asset Performance" : "Building Management"} ({count})
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          {credits.map(c => (
            <div key={c.code}
              onClick={() => setActiveCredit(c.code === activeCredit?.code ? null : c)}
              style={{
                padding: "14px 16px", borderRadius: 10, marginBottom: 8, cursor: "pointer",
                background: activeCredit?.code === c.code ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${activeCredit?.code === c.code ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.07)"}`,
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#a78bfa" }}>{c.code}</span>
                  <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: 8 }}>{c.title}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {c.score > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981" }}>{c.score} credits</span>}
                  <span style={{ fontSize: 10, color: "#475569" }}>→</span>
                </div>
              </div>
              {c.narrative && <div style={{ fontSize: 11, color: "#475569", marginTop: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.narrative}</div>}
            </div>
          ))}
        </div>

        <div>
          {!activeCredit ? (
            <div style={{ color: "#334155", fontSize: 13, padding: "60px 20px", textAlign: "center", border: "1px dashed rgba(255,255,255,0.07)", borderRadius: 12 }}>
              Select a credit to write narrative and add evidence
            </div>
          ) : (() => {
            const credit = project.credits.find(c => c.code === activeCredit.code);
            return (
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "20px" }}>
                <div style={{ marginBottom: 14 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, background: "rgba(124,58,237,0.15)", color: "#a78bfa", padding: "3px 8px", borderRadius: 20 }}>{credit.code}</span>
                  <span style={{ fontSize: 13, color: "#94a3b8", marginLeft: 8 }}>{credit.title}</span>
                  <span style={{ fontSize: 11, color: "#475569", marginLeft: 8 }}>{credit.available} credits avail</span>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Score achieved (credits)</div>
                  <input type="number" min="0" max={credit.available} value={credit.score}
                    onChange={e => onUpdate({ ...credit, score: parseInt(e.target.value) || 0 })}
                    style={{ width: 80, padding: "6px 10px", borderRadius: 7, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", fontSize: 14, fontWeight: 700, fontFamily: "inherit" }} />
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Status</div>
                  <select value={credit.status} onChange={e => onUpdate({ ...credit, status: e.target.value })}
                    style={{ padding: "6px 10px", borderRadius: 7, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", fontSize: 13, fontFamily: "inherit" }}>
                    <option value="in_progress">In Progress</option>
                    <option value="complete">Complete</option>
                  </select>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Narrative</div>
                  <textarea value={credit.narrative || ""} onChange={e => onUpdate({ ...credit, narrative: e.target.value })}
                    rows={6} placeholder="Describe the evidence and assessment rationale..."
                    style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#e2e8f0", fontSize: 13, lineHeight: 1.55, resize: "vertical", fontFamily: "inherit" }} />
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Completion %</div>
                  <input type="range" min="0" max="100" value={credit.completion}
                    onChange={e => onUpdate({ ...credit, completion: parseInt(e.target.value) })}
                    style={{ width: "100%" }} />
                  <div style={{ fontSize: 11, color: "#64748b", textAlign: "right" }}>{credit.completion}%</div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>Evidence ({credit.evidence?.length || 0} files)</div>
                    <button onClick={() => setActiveCredit({ ...credit, _showEvidence: true })}
                      style={{ padding: "6px 12px", borderRadius: 7, border: "none", background: "rgba(124,58,237,0.15)", color: "#a78bfa", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}>
                      + Add Evidence
                    </button>
                  </div>
                  {credit.evidence?.map((e, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 7, background: "rgba(255,255,255,0.04)", marginBottom: 4 }}>
                      <span style={{ fontSize: 13 }}>📄</span>
                      <span style={{ fontSize: 12, color: "#e2e8f0", flex: 1 }}>{typeof e === "string" ? e : e.name}</span>
                    </div>
                  ))}
                  {!credit.evidence?.length && <div style={{ fontSize: 11, color: "#334155", textAlign: "center", padding: "12px" }}>No evidence yet</div>}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {activeCredit?._showEvidence && (
        <EvidenceModal
          credit={activeCredit}
          onClose={() => setActiveCredit({ ...activeCredit, _showEvidence: false })}
          onSave={updated => {
            onUpdate(updated);
            setActiveCredit({ ...updated, _showEvidence: false });
          }}
        />
      )}
    </div>
  );
}

// ── PAGE: Evidence Vault ────────────────────────────────────────────────────
function EvidenceVaultPage({ project }) {
  const [part, setPart] = useState(1);
  const credits = project.credits.filter(c => c.part === part && c.pursuing);

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Evidence Vault</div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#f1f5f9" }}>All Evidence Files</h1>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Browse and download evidence files per credit</div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[1, 2].map(p => (
          <button key={p} onClick={() => setPart(p)}
            style={{ padding: "8px 18px", borderRadius: 9, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit",
              background: part === p ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)", color: part === p ? "#c4b5fd" : "#64748b" }}>
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
                <span style={{ fontSize: 13, color: "#e2e8f0", marginLeft: 10 }}>{c.title}</span>
                <span style={{ fontSize: 11, color: "#64748b", marginLeft: 8 }}>{c.evidence?.length || 0} files</span>
              </div>
              <div style={{ fontSize: 11, color: "#64748b" }}>
                {c.evidence?.map((e, i) => (
                  <span key={i} style={{ marginLeft: 6 }}>📄 {typeof e === "string" ? e.split("/").pop() : e.name}</span>
                ))}
                {!c.evidence?.length && <span style={{ color: "#334155" }}>— no files</span>}
              </div>
            </div>
          </div>
        );
      })}

      {credits.every(c => !c.evidence?.length) && (
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
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#f1f5f9" }}>Generate BREEAM Evidence Package</h1>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Select credits and generate a PDF report for submission</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
        <div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#94a3b8" }}>
              <input type="checkbox" checked={onlyComplete} onChange={e => setOnlyComplete(e.target.checked)} style={{ accentColor: "#7c3aed" }} />
              Only complete credits
            </label>
            <button onClick={() => setSelected(new Set(project.credits.filter(c => c.pursuing).map(c => c.code)))}
              style={{ padding: "6px 12px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#94a3b8", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
              Select all pursuing
            </button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "#a78bfa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Part 1 — Asset Performance</div>
            {part1.map(c => (
              <div key={c.code} onClick={() => toggle(c.code)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 9, marginBottom: 6, cursor: "pointer",
                  background: selected.has(c.code) ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${selected.has(c.code) ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.07)"}` }}>
                <input type="checkbox" checked={selected.has(c.code)} onChange={() => {}} style={{ accentColor: "#7c3aed" }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: "#a78bfa" }}>{c.code}</span>
                  <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: 6 }}>{c.title}</span>
                </div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{c.score}/{c.available}</div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 11, color: "#60a5fa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Part 2 — Building Management</div>
            {part2.map(c => (
              <div key={c.code} onClick={() => toggle(c.code)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 9, marginBottom: 6, cursor: "pointer",
                  background: selected.has(c.code) ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${selected.has(c.code) ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.07)"}` }}>
                <input type="checkbox" checked={selected.has(c.code)} onChange={() => {}} style={{ accentColor: "#7c3aed" }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: "#60a5fa" }}>{c.code}</span>
                  <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: 6 }}>{c.title}</span>
                </div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{c.score}/{c.available}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "20px", position: "sticky", top: 20, alignSelf: "start" }}>
          <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Package Summary</div>
          <div style={{ fontSize: 13, color: "#e2e8f0", marginBottom: 8 }}><strong>{credits.length}</strong> credits selected</div>
          <div style={{ fontSize: 13, color: "#e2e8f0", marginBottom: 8 }}><strong>{totalScore}</strong> total credits</div>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>Part 1: {part1.reduce((s,c) => s+(c.score||0),0)} credits<br/>Part 2: {part2.reduce((s,c) => s+(c.score||0),0)} credits</div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14, marginBottom: 14 }}>
            {credits.slice(0, 8).map(c => (
              <div key={c.code} style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>
                <span style={{ color: "#a78bfa" }}>{c.code}</span> — {c.narrative?.slice(0, 40) || "no narrative"}...
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
function MeetingsPage({ project, meetings, onMeetingsChange }) {
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: "", date: tod(), attendees: "", notes: "" });

  const projectMeetings = meetings
    .filter(m => m.projectId === project.id)
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  // When switching between meetings, sync form state
  const selectMeeting = (m) => {
    setSelected(m);
    setForm({
      title: m.title || "",
      date: m.date || tod(),
      attendees: (m.attendees || []).join(", "),
      notes: m.notes || "",
    });
  };

  const newMeeting = () => {
    const m = {
      id: Date.now(),
      projectId: project.id,
      projectName: project.name,
      title: "",
      date: tod(),
      attendees: [],
      notes: "",
    };
    const updated = [m, ...meetings];
    onMeetingsChange(updated);
    selectMeeting(m);
  };

  const deleteMeeting = (id) => {
    if (!confirm("Delete this meeting?")) return;
    const updated = meetings.filter(m => m.id !== id);
    onMeetingsChange(updated);
    if (selected?.id === id) setSelected(null);
  };

  const saveCurrent = () => {
    if (!selected) return;
    const updated = meetings.map(m => {
      if (m.id !== selected.id) return m;
      return {
        ...m,
        title: form.title,
        date: form.date,
        attendees: form.attendees.split(",").map(s => s.trim()).filter(Boolean),
        notes: form.notes,
      };
    });
    onMeetingsChange(updated);
    setSelected(updated.find(m => m.id === selected.id) || selected);
  };

  // Auto-save when form changes (on blur / navigate away)
  const handleFieldChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Save immediately on change
    if (!selected) return;
    const updated = meetings.map(m => {
      if (m.id !== selected.id) return m;
      const updatedMeeting = { ...m, [field]: value };
      if (field === "attendees") updatedMeeting.attendees = value.split(",").map(s => s.trim()).filter(Boolean);
      return updatedMeeting;
    });
    onMeetingsChange(updated);
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100, display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Meetings</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#f1f5f9" }}>Meeting Notes</h1>
          <button onClick={newMeeting}
            style={{ padding: "9px 18px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#7c3aed,#3b82f6)", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit", boxShadow: "0 4px 16px rgba(124,58,237,0.3)" }}>
            + New Meeting
          </button>
        </div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
          {projectMeetings.length} meeting{projectMeetings.length !== 1 ? "s" : ""} · Stored as .md files in <code style={{ color: "#a78bfa" }}>meetings/</code>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, flex: 1, minHeight: 0 }}>
        {/* Meeting list */}
        <div style={{ borderRight: "1px solid rgba(255,255,255,0.06)", paddingRight: 16 }}>
          {projectMeetings.length === 0 && (
            <div style={{ color: "#334155", fontSize: 13, textAlign: "center", padding: "40px 10px" }}>
              No meetings yet.<br />Click "+ New Meeting" to start.
            </div>
          )}
          {projectMeetings.map(m => (
            <div key={m.id}
              onClick={() => selectMeeting(m)}
              style={{
                padding: "12px 14px", borderRadius: 10, marginBottom: 6, cursor: "pointer",
                background: selected?.id === m.id ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${selected?.id === m.id ? "rgba(124,58,237,0.35)" : "rgba(255,255,255,0.07)"}`,
              }}>
              <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700, marginBottom: 3 }}>{m.date}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
          <div style={{ color: "#334155", fontSize: 13, padding: "60px 20px", textAlign: "center", border: "1px dashed rgba(255,255,255,0.07)", borderRadius: 12 }}>
            Select a meeting or click "+ New Meeting"
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {/* Header fields */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 180px 200px", gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Meeting Title</div>
                <input
                  value={form.title}
                  onChange={e => handleFieldChange("title", e.target.value)}
                  placeholder="e.g. BREEAM Kick-off Meeting"
                  style={{ width: "100%", padding: "8px 11px", boxSizing: "border-box", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0", fontSize: 14, fontFamily: "inherit" }}
                />
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Date</div>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => handleFieldChange("date", e.target.value)}
                  style={{ width: "100%", padding: "8px 11px", boxSizing: "border-box", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0", fontSize: 13, fontFamily: "inherit" }}
                />
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Attendees</div>
                <input
                  value={form.attendees}
                  onChange={e => handleFieldChange("attendees", e.target.value)}
                  placeholder="Jane, John, Lucy"
                  style={{ width: "100%", padding: "8px 11px", boxSizing: "border-box", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0", fontSize: 13, fontFamily: "inherit" }}
                />
              </div>
            </div>

            {/* Agenda section */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Agenda / Notes</div>
              <textarea
                value={form.notes}
                onChange={e => handleFieldChange("notes", e.target.value)}
                placeholder={"## Agenda\n- Topic 1\n- Topic 2\n\n## Notes\n- Note here...\n\n## Actions\n- [ ] Action item"}
                style={{
                  width: "100%", minHeight: 340, boxSizing: "border-box",
                  padding: "14px 16px", borderRadius: 10,
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                  color: "#e2e8f0", fontSize: 13, lineHeight: 1.65, resize: "vertical",
                  fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace",
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button
                onClick={() => saveCurrent()}
                style={{ padding: "9px 18px", borderRadius: 9, border: "none", background: "rgba(124,58,237,0.15)", color: "#a78bfa", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>
                💾 Save
              </button>
              <button
                onClick={() => {
                  const m = meetings.find(m => m.id === selected.id);
                  if (m) exportMeetingMd(m);
                }}
                style={{ padding: "9px 18px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#94a3b8", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>
                📥 Export .md
              </button>
              <button
                onClick={() => deleteMeeting(selected.id)}
                style={{ padding: "9px 18px", borderRadius: 9, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.06)", color: "#f87171", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>
                🗑 Delete
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

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [projects, setProjects] = useState(loadProjects);
  const [activeProjectId, setActiveProjectId] = useState(DEMO_PROJECT.id);
  const [page, setPage] = useState("home");
  const [meetings, setMeetings] = useState(loadMeetings);
  const [showNewProject, setShowNewProject] = useState(false);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  useEffect(() => { saveProjects(projects); }, [projects]);
  useEffect(() => { saveMeetings(meetings); }, [meetings]);

  const updateCredit = (updated) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== activeProjectId) return p;
      return { ...p, credits: p.credits.map(c => c.code === updated.code ? updated : c) };
    }));
  };

  const createProject = (formData) => {
    const newProject = {
      id: Date.now(),
      name: formData.name,
      slug: slugify(formData.name),
      category: formData.category,
      location: formData.location,
      area_sqm: formData.area_sqm,
      assessor: formData.assessor,
      assessment_date: formData.assessment_date,
      target_date: formData.target_date,
      credits: CREDITS.map(c => ({ ...c, pursuing: false, status: "not_pursuing", score: 0, completion: 0, narrative: "", evidence: [] })),
    };
    setProjects(prev => [...prev, newProject]);
    setActiveProjectId(newProject.id);
    setPage("home");
  };

  const project = { ...activeProject };
  const pages = {
    home: <HomePage project={project} onNavigate={setPage} />,
    preassessment: <PreAssessmentPage project={project} onUpdate={updateCredit} />,
    assessment: <AssessmentPage project={project} onUpdate={updateCredit} />,
    vault: <EvidenceVaultPage project={project} />,
    package: <EvidencePackagePage project={project} />,
    meetings: <MeetingsPage project={project} meetings={meetings} onMeetingsChange={setMeetings} />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f0a1e", color: "#e2e8f0" }}>
      <nav style={{ width: 220, minHeight: "100vh", borderRight: "1px solid rgba(255,255,255,0.06)", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
        <div style={{ padding: "0 12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>BREEAM In Use</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#f1f5f9" }}>BIU Tracker</div>
        </div>

        <NavPill label="Home"             icon="🏠"  active={page === "home"}          onClick={() => setPage("home")} />
        <NavPill label="Pre-Assessment"   icon="🔍"  active={page === "preassessment"} onClick={() => setPage("preassessment")} />
        <NavPill label="Assessment"       icon="📋"  active={page === "assessment"}    onClick={() => setPage("assessment")} />
        <NavPill label="Evidence Vault"   icon="📦"  active={page === "vault"}         onClick={() => setPage("vault")} />
        <NavPill label="Evidence Package" icon="📄"  active={page === "package"}       onClick={() => setPage("package")} />
        <NavPill label="Meetings"         icon="📅"  active={page === "meetings"}      onClick={() => setPage("meetings")} />

        <div style={{ marginTop: "auto", padding: "16px 12px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            onClick={() => setShowNewProject(true)}
            style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px dashed rgba(124,58,237,0.35)", background: "rgba(124,58,237,0.06)", color: "#a78bfa", cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "inherit", marginBottom: 10 }}
          >
            + New Project
          </button>
          <div style={{ fontSize: 10, color: "#475569", marginBottom: 6 }}>Active project</div>
          <select
            value={activeProjectId}
            onChange={e => setActiveProjectId(parseInt(e.target.value))}
            style={{ width: "100%", padding: "7px 10px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", fontSize: 12, fontFamily: "inherit" }}
          >
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </nav>

      <main style={{ flex: 1, overflowY: "auto" }}>
        {pages[page] || pages.home}
        {showNewProject && (
          <NewProjectModal
            onClose={() => setShowNewProject(false)}
            onCreate={createProject}
          />
        )}
      </main>
    </div>
  );
}