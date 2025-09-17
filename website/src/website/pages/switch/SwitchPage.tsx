import * as React from "react";
import { ControlledMonacoEditor } from "../../components/monaco/MonacoEditor";
import "../../switch.scss";
import { createRepository, listRepositories } from "../../switch/models";
import { pickDirectory, getDirectoryHandle, ensureReadPerm, walk } from "../../switch/fs";
import type { RepoRecord } from "../../switch/db";
import { FileTree } from "./FileTree";

interface OpenFile { path: string; content: string; language: string }

export function SwitchPage() {
  const [repos, setRepos] = React.useState<RepoRecord[]>([]);
  const [activeRepo, setActiveRepo] = React.useState<RepoRecord | undefined>();
  const [tree, setTree] = React.useState<{ path: string; isDir: boolean; children?: any[] }[]>([]);
  const [openFile, setOpenFile] = React.useState<OpenFile | undefined>();
  const [editorValue, setEditorValue] = React.useState<string>("// SWITCH: Open a folder to get started\n");

  React.useEffect(() => {
    refreshRepos();
  }, []);

  async function refreshRepos() {
    const list = await listRepositories();
    setRepos(list);
  }

  async function onOpenFolder() {
    const { id: fsId, handle } = await pickDirectory();
    if (!(await ensureReadPerm(handle))) return;
    const repo = await createRepository(handle.name || "workspace", fsId);
    await refreshRepos();
    setActiveRepo(repo);
    await loadTree(repo);
  }

  async function loadTree(repo: RepoRecord) {
    if (!repo.fsHandleId) return;
    const dir = await getDirectoryHandle(repo.fsHandleId);
    if (!dir) return;
    if (!(await ensureReadPerm(dir))) return;

    // flatten files then build a simple tree
    const files: { path: string }[] = [];
    for await (const f of walk(dir)) files.push({ path: f.path });
    const root: any = {};
    for (const f of files) {
      const parts = f.path.split("/");
      let cur = root;
      for (let i = 0; i < parts.length; i++) {
        const key = parts.slice(0, i + 1).join("/");
        const isDir = i < parts.length - 1;
        cur.children = cur.children || new Map<string, any>();
        if (!cur.children.has(key)) cur.children.set(key, { path: key, isDir, children: undefined });
        cur = cur.children.get(key);
      }
    }
    const toArray = (node: any): any[] => {
      if (!node.children) return [];
      const arr = Array.from(node.children.values());
      for (const n of arr) if (n.isDir) n.children = toArray(n);
      arr.sort((a, b) => (a.isDir === b.isDir ? a.path.localeCompare(b.path) : a.isDir ? -1 : 1));
      return arr;
    };
    setTree(toArray(root));
  }

  async function onSelectRepo(repoId: string) {
    const repo = repos.find((r) => r.id === repoId);
    setActiveRepo(repo);
    if (repo) await loadTree(repo);
  }

  async function onOpenFile(path: string) {
    if (!activeRepo?.fsHandleId) return;
    const dir = await getDirectoryHandle(activeRepo.fsHandleId);
    if (!dir) return;
    if (!(await ensureReadPerm(dir))) return;
    const file = await getFileByPath(dir, path);
    if (!file) return;
    const content = await file.text();
    setOpenFile({ path, content, language: languageFromPath(path) });
    setEditorValue(content);
  }

  return (
    <div className="switch-shell">
      <div className="switch-activity-bar" aria-label="Activity Bar">
        <button className="switch-activity-item" title="Explorer" aria-label="Explorer">📁</button>
        <button className="switch-activity-item" title="Search" aria-label="Search">🔎</button>
        <button className="switch-activity-item" title="Source Control" aria-label="Source Control">🔀</button>
        <button className="switch-activity-item" title="Issues" aria-label="Issues">🏷️</button>
      </div>
      <div className="switch-main">
        <aside className="switch-sidebar" aria-label="Sidebar">
          <div className="switch-pane">
            <div className="switch-pane-header">Repositories</div>
            <div className="switch-pane-body">
              <button className="switch-secondary-btn" onClick={onOpenFolder}>Open Folder</button>
              <div>
                {repos.map((r) => (
                  <div key={r.id}>
                    <label>
                      <input type="radio" name="repo" onChange={() => onSelectRepo(r.id)} checked={activeRepo?.id === r.id} /> {r.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="switch-pane">
            <div className="switch-pane-header">Explorer</div>
            <div className="switch-pane-body">
              {tree.length === 0 ? (
                <div className="switch-empty">No files</div>
              ) : (
                <FileTree tree={tree} onOpen={onOpenFile} />
              )}
            </div>
          </div>
        </aside>
        <section className="switch-editor" aria-label="Editor">
          <div className="switch-tabbar">
            <div className="switch-tab active">{openFile?.path || "welcome.txt"}</div>
          </div>
          <div className="switch-editor-inner">
            <ControlledMonacoEditor value={editorValue} onDidValueChange={setEditorValue} language={openFile?.language || "plaintext"} theme="vs-dark" />
          </div>
        </section>
      </div>
      <footer className="switch-statusbar" aria-label="Status Bar">
        <div className="switch-status-item">SWITCH</div>
        <div className="switch-status-item">{openFile?.language || "Plain Text"}</div>
        <div className="switch-status-item">UTF-8</div>
        <div className="switch-status-item">LF</div>
      </footer>
    </div>
  );
}

async function getFileByPath(dir: FileSystemDirectoryHandle, path: string): Promise<File | undefined> {
  const parts = path.split("/");
  let cur: FileSystemDirectoryHandle = dir;
  for (let i = 0; i < parts.length; i++) {
    const name = parts[i];
    if (i === parts.length - 1) {
      const fh = await (cur as any).getFileHandle(name).catch(() => undefined) as FileSystemFileHandle | undefined;
      return fh ? fh.getFile() : undefined;
    } else {
      cur = await (cur as any).getDirectoryHandle(name).catch(() => undefined);
      if (!cur) return undefined as any;
    }
  }
  return undefined as any;
}

function languageFromPath(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "ts": return "typescript";
    case "tsx": return "typescript";
    case "js": return "javascript";
    case "jsx": return "javascript";
    case "json": return "json";
    case "css": return "css";
    case "scss": return "scss";
    case "html": return "html";
    case "md": return "markdown";
    case "py": return "python";
    case "rb": return "ruby";
    case "go": return "go";
    case "rs": return "rust";
    case "java": return "java";
    case "cs": return "csharp";
    case "cpp": return "cpp";
    case "yml":
    case "yaml": return "yaml";
    case "xml": return "xml";
    case "sql": return "sql";
    default: return "plaintext";
  }
}
