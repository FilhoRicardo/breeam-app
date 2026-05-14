// File System Access API — folder structure + file I/O
// Folder structure per project:
// project-root/
//   meetings/
//     <date>_<title>.md
//   Part 1/
//     Tra 1/
//       pre-assessment.md
//       assessment.md
//       evidence/
//         <file>
//     Hea 1/
//     Man 1/
//     ...
//   Part 2/
//     <credit>/

const PROJECT_ROOT_KEY = 'biu_project_root';

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

export async function createProjectFolderStructure(rootHandle, projectName) {
  // Creates all subfolders for a new project
  const slug = slugifyName(projectName);

  // meetings/
  const meetingsDir = await ensureDir(rootHandle, 'meetings');
  if (!meetingsDir) return false;

  // Part 1/
  const part1Dir = await ensureDir(rootHandle, 'Part 1');
  if (!part1Dir) return false;

  // Part 2/
  const part2Dir = await ensureDir(rootHandle, 'Part 2');
  if (!part2Dir) return false;

  // Per-credit subfolders
  const CREDIT_CODES_P1 = ['Tra 1','Tra 2','Tra 3','Tra 4','Man 1','Man 2','Man 3','Man 4','Hea 1','Hea 2','Hea 3','Hea 4','Ene 1','Ene 2','Ene 3','Ene 4','Ene 5','Ene 6','Wat 1','Wat 2','Wat 3','Mat 1','Mat 2','Mat 3','Mat 4','Mat 5','Mat 6','Mat 7','Was 1','Was 2','Was 3','Pol 1','Pol 2','Pol 3','Pol 4','Eco 1','Eco 2','Eco 3'];
  const CREDIT_CODES_P2 = ['Man 5','Man 6','Man 7','Man 8','Man 9','Hea 5','Hea 6','Ene 7','Ene 8','Wat 4','Mat 8','Was 4','Was 5','Pol 5','Tra 5'];

  for (const code of CREDIT_CODES_P1) {
    const creditDir = await ensureDir(part1Dir, code);
    if (creditDir) await ensureDir(creditDir, 'evidence');
  }
  for (const code of CREDIT_CODES_P2) {
    const creditDir = await ensureDir(part2Dir, code);
    if (creditDir) await ensureDir(creditDir, 'evidence');
  }

  return true;
}

function slugifyName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Get or create a credit's subfolder under Part 1 or Part 2
export async function getCreditFolder(rootHandle, creditCode, part) {
  const partDir = part === 1
    ? await rootHandle.getDirectoryHandle('Part 1', { create: false })
    : await rootHandle.getDirectoryHandle('Part 2', { create: false });
  if (!partDir) return null;
  try {
    return await partDir.getDirectoryHandle(creditCode, { create: true });
  } catch {
    return null;
  }
}

// Meetings folder
export async function getMeetingsFolder(rootHandle) {
  try {
    return await rootHandle.getDirectoryHandle('meetings', { create: true });
  } catch {
    return null;
  }
}