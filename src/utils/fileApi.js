// File System Access API — folder structure + file I/O
//
// Folder structure per project (per-user-folder):
// user-selected-root/
//   [project-slug]/
//     project.json
//     Part 1/
//       Tra 1/
//         assessment.md
//         evidence/
//           <file>
//       Man 1/
//       ...
//     Part 2/
//       Man 5/
//       ...
//     meetings/
//       <date>_<title>.md

import { CREDITS } from '../data/credits.js';

// ── Browser compatibility ─────────────────────────────────────────────────────
export function isFileSystemAccessSupported() {
  return 'showDirectoryPicker' in window;
}

// ── Low-level dir ops ─────────────────────────────────────────────────────────
export async function ensureDir(parent, name) {
  try {
    return await parent.getDirectoryHandle(name, { create: true });
  } catch {
    return null; // permissions denied
  }
}

export async function ensureDirPath(parent, pathParts) {
  let current = parent;
  for (const part of pathParts) {
    const next = await ensureDir(current, part);
    if (!next) return null;
    current = next;
  }
  return current;
}

export async function saveTextFile(dirHandle, filename, content) {
  try {
    const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
    return true;
  } catch {
    return false;
  }
}

export async function readTextFile(dirHandle, filename) {
  try {
    const fileHandle = await dirHandle.getFileHandle(filename);
    const file = await fileHandle.getFile();
    return await file.text();
  } catch {
    return null;
  }
}

export async function listDir(dirHandle) {
  try {
    const entries = [];
    for await (const [name, handle] of dirHandle.entries()) {
      entries.push({ name, isFile: handle.kind === 'file', isFolder: handle.kind === 'directory' });
    }
    return entries;
  } catch {
    return [];
  }
}

// ── Evidence ──────────────────────────────────────────────────────────────────
export async function saveEvidenceFile(creditDirHandle, file) {
  try {
    const evidenceDir = await creditDirHandle.getDirectoryHandle('evidence', { create: true });
    const fileHandle = await evidenceDir.getFileHandle(file.name, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(file);
    await writable.close();
    return true;
  } catch {
    return false;
  }
}

export async function listEvidence(creditDirHandle) {
  try {
    const evidenceDir = await creditDirHandle.getDirectoryHandle('evidence');
    return await listDir(evidenceDir);
  } catch {
    return [];
  }
}

// ── Slug helper ───────────────────────────────────────────────────────────────
export function slugifyName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ── Create full per-project folder structure ───────────────────────────────────
// project: { slug, name, credits: [{code, part}] }
export async function createProjectFolderStructure(rootHandle, project) {
  const slug = project.slug || slugifyName(project.name);

  // root/[slug]/
  const projectDir = await ensureDir(rootHandle, slug);
  if (!projectDir) return false;

  // root/[slug]/meetings/
  await ensureDir(projectDir, 'meetings');

  // root/[slug]/Part 1/ and Part 2/
  const part1Dir = await ensureDir(projectDir, 'Part 1');
  const part2Dir = await ensureDir(projectDir, 'Part 2');
  if (!part1Dir || !part2Dir) return false;

  // Derive credit codes dynamically from CREDITS
  const part1Codes = CREDITS.filter(c => c.part === 1).map(c => c.code);
  const part2Codes = CREDITS.filter(c => c.part === 2).map(c => c.code);

  for (const code of part1Codes) {
    const creditDir = await ensureDir(part1Dir, code);
    if (creditDir) await ensureDir(creditDir, 'evidence');
  }
  for (const code of part2Codes) {
    const creditDir = await ensureDir(part2Dir, code);
    if (creditDir) await ensureDir(creditDir, 'evidence');
  }

  return true;
}

// ── Get a credit's folder: root/[slug]/Part N/[code] ─────────────────────────
export async function getCreditFolder(rootHandle, projectSlug, creditCode, part) {
  try {
    const projectDir = await rootHandle.getDirectoryHandle(projectSlug, { create: false });
    if (!projectDir) return null;
    const partDir = await projectDir.getDirectoryHandle(`Part ${part}`, { create: false });
    if (!partDir) return null;
    return await partDir.getDirectoryHandle(creditCode, { create: true });
  } catch {
    return null;
  }
}

// ── Get meetings folder: root/[slug]/meetings/ ────────────────────────────────
export async function getMeetingsFolder(rootHandle, projectSlug) {
  try {
    const projectDir = await rootHandle.getDirectoryHandle(projectSlug, { create: false });
    if (!projectDir) return null;
    return await projectDir.getDirectoryHandle('meetings', { create: true });
  } catch {
    return null;
  }
}

// ── Load projects.json from root/[slug]/project.json ─────────────────────────
export async function loadProjectFromFolder(rootHandle, projectSlug) {
  try {
    const projectDir = await rootHandle.getDirectoryHandle(projectSlug, { create: false });
    if (!projectDir) return null;
    const fileHandle = await projectDir.getFileHandle('project.json');
    const text = await (await fileHandle.getFile()).text();
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// ── Save project.json to root/[slug]/project.json ────────────────────────────
export async function saveProjectToFolder(rootHandle, projectSlug, project) {
  try {
    const projectDir = await ensureDir(rootHandle, projectSlug);
    if (!projectDir) return false;
    const fileHandle = await projectDir.getFileHandle('project.json', { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(project, null, 2));
    await writable.close();
    return true;
  } catch {
    return false;
  }
}

// ── List all project slugs in root ───────────────────────────────────────────
export async function listProjectSlugs(rootHandle) {
  const entries = await listDir(rootHandle);
  const slugs = [];
  for (const entry of entries) {
    if (entry.isFolder) {
      // Check if it looks like a project folder (has Part 1 or Part 2 subfolder)
      try {
        const projectDir = await rootHandle.getDirectoryHandle(entry.name, { create: false });
        const part1Exists = await projectDir.getDirectoryHandle('Part 1', { create: false }).then(h => !!h).catch(() => false);
        if (part1Exists) slugs.push(entry.name);
      } catch { /* skip */ }
    }
  }
  return slugs;
}