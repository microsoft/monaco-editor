import * as React from "react";
import { ControlledMonacoEditor } from "../../components/monaco/MonacoEditor";
import "../../switch.scss";
import {
	createRepository,
	listRepositories,
	listBranches,
	createBranch,
} from "../../switch/models";
import {
	pickDirectory,
	getDirectoryHandle,
	ensureReadPerm,
	walk,
} from "../../switch/fs";
import type {
	RepoRecord,
	BranchRecord,
	CommitRecord,
	IssueRecord,
} from "../../switch/db";
import { FileTree } from "./FileTree";
import {
	getCurrentBranchId,
	setCurrentBranchId,
	commitOnBranch,
	listCommitsReachable,
	listIssues,
	createIssue,
} from "../../switch/logic";

interface OpenFile {
	path: string;
	content: string;
	language: string;
}

export function SwitchPage() {
	const [repos, setRepos] = React.useState<RepoRecord[]>([]);
	const [activeRepo, setActiveRepo] = React.useState<
		RepoRecord | undefined
	>();
	const [tree, setTree] = React.useState<
		{ path: string; isDir: boolean; children?: any[] }[]
	>([]);
	const [openFile, setOpenFile] = React.useState<OpenFile | undefined>();
	const [editorValue, setEditorValue] = React.useState<string>(
		"// SWITCH: Open a folder to get started\n"
	);
	const [branches, setBranches] = React.useState<BranchRecord[]>([]);
	const [currentBranchId, setCurrentBranchIdState] = React.useState<
		string | undefined
	>(undefined);
	const [commitMsg, setCommitMsg] = React.useState("");
	const [history, setHistory] = React.useState<CommitRecord[]>([]);
	const [issues, setIssues] = React.useState<IssueRecord[]>([]);
	const [newIssueTitle, setNewIssueTitle] = React.useState("");
	const [selectedIssueId, setSelectedIssueId] = React.useState<
		string | undefined
	>(undefined);
	const selectedIssue = issues.find((i) => i.id === selectedIssueId);
	const [issueTitle, setIssueTitle] = React.useState("");
	const [issueBody, setIssueBody] = React.useState("");
	const [issueLabels, setIssueLabels] = React.useState<string>("");
	const [issueStatus, setIssueStatus] = React.useState<"open" | "closed">(
		"open"
	);

	React.useEffect(() => {
		refreshRepos();
	}, []);

	React.useEffect(() => {
		(async () => {
			if (!activeRepo) return;
			const b = await listBranches(activeRepo.id);
			setBranches(b);
			const cur =
				(await getCurrentBranchId(activeRepo.id)) ||
				b.find((x) => x.name === activeRepo.defaultBranch)?.id;
			if (cur) {
				setCurrentBranchIdState(cur);
				await refreshHistory(activeRepo.id, cur);
			}
			const iss = await listIssues(activeRepo.id);
			setIssues(iss);
			if (iss.length) selectIssue(iss[0].id);
		})();
	}, [activeRepo?.id]);

	function selectIssue(id: string) {
		setSelectedIssueId(id);
		const it = issues.find((i) => i.id === id);
		if (it) {
			setIssueTitle(it.title);
			setIssueBody(it.body);
			setIssueLabels(it.labels.join(", "));
			setIssueStatus(it.status);
		}
	}

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
				if (!cur.children.has(key))
					cur.children.set(key, {
						path: key,
						isDir,
						children: undefined,
					});
				cur = cur.children.get(key);
			}
		}
		const toArray = (node: any): any[] => {
			if (!node.children) return [];
			const arr = Array.from(node.children.values());
			for (const n of arr) if (n.isDir) n.children = toArray(n);
			arr.sort((a, b) =>
				a.isDir === b.isDir
					? a.path.localeCompare(b.path)
					: a.isDir
					? -1
					: 1
			);
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

	async function refreshHistory(repoId: string, branchId: string) {
		const b = branches.find((x) => x.id === branchId);
		const list = await listCommitsReachable(repoId, b?.headCommitId);
		setHistory(list);
	}

	return (
		<div className="switch-shell">
			<div className="switch-activity-bar" aria-label="Activity Bar">
				<button
					className="switch-activity-item"
					title="Explorer"
					aria-label="Explorer"
				>
					📁
				</button>
				<button
					className="switch-activity-item"
					title="Search"
					aria-label="Search"
				>
					🔎
				</button>
				<button
					className="switch-activity-item"
					title="Source Control"
					aria-label="Source Control"
				>
					🔀
				</button>
				<button
					className="switch-activity-item"
					title="Issues"
					aria-label="Issues"
				>
					🏷️
				</button>
			</div>
			<div className="switch-main">
				<aside className="switch-sidebar" aria-label="Sidebar">
					<div className="switch-pane">
						<div className="switch-pane-header">Repositories</div>
						<div className="switch-pane-body">
							<button
								className="switch-secondary-btn"
								onClick={onOpenFolder}
							>
								Open Folder
							</button>
							<div>
								{repos.map((r) => (
									<div key={r.id}>
										<label>
											<input
												type="radio"
												name="repo"
												onChange={() =>
													onSelectRepo(r.id)
												}
												checked={
													activeRepo?.id === r.id
												}
											/>{" "}
											{r.name}
										</label>
									</div>
								))}
							</div>
						</div>
					</div>
					<div className="switch-pane">
						<div className="switch-pane-header">Branches</div>
						<div className="switch-pane-body">
							<div style={{ marginBottom: 8 }}>
								<select
									value={currentBranchId || ""}
									onChange={async (e) => {
										if (!activeRepo) return;
										const id = e.target.value;
										setCurrentBranchIdState(id);
										await setCurrentBranchId(
											activeRepo.id,
											id
										);
										await refreshHistory(activeRepo.id, id);
									}}
								>
									<option value="" disabled>
										— Select branch —
									</option>
									{branches.map((b) => (
										<option key={b.id} value={b.id}>
											{b.name}
										</option>
									))}
								</select>
								<button
									className="switch-secondary-btn"
									onClick={async () => {
										if (!activeRepo) return;
										const name = prompt(
											"New branch name:",
											"feature"
										);
										if (!name) return;
										const from = branches.find(
											(b) => b.id === currentBranchId
										)?.headCommitId;
										const b = await createBranch(
											activeRepo.id,
											name,
											from
										);
										const list = await listBranches(
											activeRepo.id
										);
										setBranches(list);
										setCurrentBranchIdState(b.id);
										await setCurrentBranchId(
											activeRepo.id,
											b.id
										);
										await refreshHistory(
											activeRepo.id,
											b.id
										);
									}}
								>
									New Branch
								</button>
							</div>
							<div>
								<input
									placeholder="Commit message"
									value={commitMsg}
									onChange={(e) =>
										setCommitMsg(e.target.value)
									}
								/>
								<button
									className="switch-secondary-btn"
									onClick={async () => {
										if (!activeRepo || !currentBranchId)
											return;
										await commitOnBranch(
											activeRepo.id,
											currentBranchId,
											commitMsg || "chore: update"
										);
										setCommitMsg("");
										await refreshHistory(
											activeRepo.id,
											currentBranchId
										);
									}}
								>
									Commit
								</button>
							</div>
							<div style={{ marginTop: 8 }}>
								<div className="switch-pane-header">
									History
								</div>
								<ul
									style={{
										listStyle: "none",
										padding: 0,
										margin: 0,
									}}
								>
									{history.map((c) => (
										<li key={c.id}>
											•{" "}
											{new Date(
												c.timestamp
											).toLocaleString()}{" "}
											— {c.message}
										</li>
									))}
									{history.length === 0 && (
										<li className="switch-empty">
											No commits
										</li>
									)}
								</ul>
							</div>
						</div>
					</div>
					<div className="switch-pane">
						<div className="switch-pane-header">Templates</div>
						<div className="switch-pane-body">
							<div style={{ marginBottom: 8 }}>
								<button
									className="switch-secondary-btn"
									onClick={onSaveRepoAsTemplate}
									disabled={!activeRepo}
								>
									Save Current Repo as Template
								</button>
								<button
									className="switch-secondary-btn"
									onClick={onCreateRepoFromTemplate}
								>
									New Repo from Template
								</button>
							</div>
							<div>
								<div
									style={{
										fontSize: 12,
										color: "#9da5b4",
										margin: "6px 0",
									}}
								>
									Issue Templates
								</div>
								<div
									style={{
										display: "flex",
										gap: 6,
										marginBottom: 6,
									}}
								>
									<button
										className="switch-secondary-btn"
										onClick={onCreateIssueTemplate}
									>
										New Issue Template
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className="switch-pane">
						<div className="switch-pane-header">Cloud Sync</div>
						<div className="switch-pane-body">
							<div style={{ marginBottom: 8, color: "#9da5b4" }}>
								Supabase storage bucket "switch" is required
								(public read/write via RLS). URL and anon key
								are read from env.
							</div>
							<div>
								<button
									className="switch-secondary-btn"
									onClick={onPushToCloud}
									disabled={!activeRepo}
								>
									Push
								</button>
								<button
									className="switch-secondary-btn"
									onClick={onPullFromCloud}
									disabled={!activeRepo}
								>
									Pull
								</button>
							</div>
						</div>
					</div>
					<div className="switch-pane">
						<div className="switch-pane-header">Explorer</div>
						<div className="switch-pane-body">
							<div style={{ marginBottom: 8 }}>
								<button
									className="switch-secondary-btn"
									onClick={onNewFile}
								>
									New File
								</button>
								<button
									className="switch-secondary-btn"
									onClick={onNewFolder}
								>
									New Folder
								</button>
								<button
									className="switch-secondary-btn"
									onClick={onRefresh}
								>
									Refresh
								</button>
							</div>
							{tree.length === 0 ? (
								<div className="switch-empty">No files</div>
							) : (
								<FileTree tree={tree} onOpen={onOpenFile} />
							)}
						</div>
					</div>
					<div className="switch-pane">
						<div className="switch-pane-header">Issues</div>
						<div className="switch-pane-body">
							<div style={{ display: "flex", gap: 8 }}>
								<input
									placeholder="New issue title"
									value={newIssueTitle}
									onChange={(e) =>
										setNewIssueTitle(e.target.value)
									}
								/>
								<button
									className="switch-secondary-btn"
									onClick={async () => {
										if (!activeRepo || !newIssueTitle)
											return;
										await createIssue(activeRepo.id, {
											title: newIssueTitle,
											branchId: currentBranchId,
											filePath: openFile?.path,
										});
										setNewIssueTitle("");
										setIssues(
											await listIssues(activeRepo.id)
										);
									}}
								>
									Add
								</button>
							</div>
							<ul
								style={{
									listStyle: "none",
									padding: 0,
									marginTop: 8,
								}}
							>
								{issues.map((i) => (
									<li
										key={i.id}
										onClick={() => selectIssue(i.id)}
										style={{
											cursor: "pointer",
											padding: "2px 0",
											color:
												selectedIssueId === i.id
													? "#fff"
													: undefined,
										}}
									>
										#{i.id.slice(-5)} {i.title}{" "}
										<span style={{ color: "#858585" }}>
											({i.status})
										</span>
									</li>
								))}
								{issues.length === 0 && (
									<li className="switch-empty">No issues</li>
								)}
							</ul>
							{selectedIssue && (
								<div
									style={{
										borderTop: "1px solid #2d2d2d",
										marginTop: 8,
										paddingTop: 8,
									}}
								>
									<div style={{ marginBottom: 6 }}>
										Edit Issue
									</div>
									<div
										style={{
											display: "flex",
											flexDirection: "column",
											gap: 6,
										}}
									>
										<input
											placeholder="Title"
											value={issueTitle}
											onChange={(e) =>
												setIssueTitle(e.target.value)
											}
										/>
										<select
											value={issueStatus}
											onChange={(e) =>
												setIssueStatus(
													e.target.value as any
												)
											}
										>
											<option value="open">open</option>
											<option value="closed">
												closed
											</option>
										</select>
										<input
											placeholder="labels (comma separated)"
											value={issueLabels}
											onChange={(e) =>
												setIssueLabels(e.target.value)
											}
										/>
										<div style={{ height: 160 }}>
											<ControlledMonacoEditor
												value={issueBody}
												onDidValueChange={setIssueBody}
												language="markdown"
												theme="vs-dark"
											/>
										</div>
										<div>
											<button
												className="switch-secondary-btn"
												onClick={onSaveIssue}
											>
												Save
											</button>
											<button
												className="switch-secondary-btn"
												onClick={onDeleteIssue}
											>
												Delete
											</button>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</aside>
				<section className="switch-editor" aria-label="Editor">
					<div className="switch-tabbar">
						<div className="switch-tab active">
							{openFile?.path || "welcome.txt"}
						</div>
						<div style={{ marginLeft: "auto" }}>
							<button
								className="switch-secondary-btn"
								onClick={onSave}
								disabled={!openFile}
							>
								Save
							</button>
							<button
								className="switch-secondary-btn"
								onClick={onSaveAs}
								disabled={!activeRepo}
							>
								Save As
							</button>
							<button
								className="switch-secondary-btn"
								onClick={onRename}
								disabled={!openFile}
							>
								Rename
							</button>
							<button
								className="switch-secondary-btn"
								onClick={onDelete}
								disabled={!openFile}
							>
								Delete
							</button>
						</div>
					</div>
					<div className="switch-editor-inner">
						<ControlledMonacoEditor
							value={editorValue}
							onDidValueChange={setEditorValue}
							language={openFile?.language || "plaintext"}
							theme="vs-dark"
						/>
					</div>
				</section>
			</div>
			<footer className="switch-statusbar" aria-label="Status Bar">
				<div className="switch-status-item">SWITCH</div>
				<div className="switch-status-item">
					{openFile?.language || "Plain Text"}
				</div>
				<div className="switch-status-item">UTF-8</div>
				<div className="switch-status-item">LF</div>
			</footer>
		</div>
	);
	async function onRefresh() {
		if (activeRepo) await loadTree(activeRepo);
	}

	async function onNewFile() {
		if (!activeRepo?.fsHandleId) return;
		const name = prompt("New file path (relative):", "untitled.txt");
		if (!name) return;
		const dir = await getDirectoryHandle(activeRepo.fsHandleId);
		if (!dir) return;
		await (await import("../../switch/fs")).writeFileText(dir, name, "");
		await onRefresh();
	}

	async function onNewFolder() {
		if (!activeRepo?.fsHandleId) return;
		const name = prompt("New folder path (relative):", "folder");
		if (!name) return;
		const dir = await getDirectoryHandle(activeRepo.fsHandleId);
		if (!dir) return;
		await (await import("../../switch/fs")).createDirectory(dir, name);
		await onRefresh();
	}

	async function onSave() {
		if (!activeRepo?.fsHandleId || !openFile) return;
		const dir = await getDirectoryHandle(activeRepo.fsHandleId);
		if (!dir) return;
		await (
			await import("../../switch/fs")
		).writeFileText(dir, openFile.path, editorValue);
	}

	async function onSaveAs() {
		if (!activeRepo?.fsHandleId) return;
		const target = prompt(
			"Save As path (relative):",
			openFile?.path || "untitled.txt"
		);
		if (!target) return;
		const dir = await getDirectoryHandle(activeRepo.fsHandleId);
		if (!dir) return;
		await (
			await import("../../switch/fs")
		).writeFileText(dir, target, editorValue);
		setOpenFile({
			path: target,
			content: editorValue,
			language: languageFromPath(target),
		});
		await onRefresh();
	}

	async function onSaveRepoAsTemplate() {
		if (!activeRepo?.fsHandleId) return;
		const name = prompt("Template name:", activeRepo.name + " template");
		if (!name) return;
		const { createRepoTemplate } = await import("../../switch/templates");
		await createRepoTemplate(name, activeRepo.fsHandleId);
		alert("Template saved.");
	}

	async function onCreateRepoFromTemplate() {
		const { listRepoTemplates } = await import("../../switch/templates");
		const list = await listRepoTemplates();
		if (!list.length) {
			alert("No repo templates.");
			return;
		}
		const names = list.map((t, i) => `${i + 1}. ${t.name}`).join("\n");
		const idxStr = prompt(`Choose template:\n${names}`, "1");
		if (!idxStr) return;
		const idx = parseInt(idxStr, 10) - 1;
		if (isNaN(idx) || idx < 0 || idx >= list.length) return;
		const tpl = list[idx];
		const dest = await pickDirectory();
		const srcHandle = await getDirectoryHandle(tpl.fsHandleId);
		if (!srcHandle) {
			alert("Template folder permission required. Re-save the template.");
			return;
		}
		await (
			await import("../../switch/fs")
		).copyDirectory(srcHandle, dest.handle);
		const repo = await createRepository(
			dest.handle.name || "workspace",
			dest.id
		);
		await refreshRepos();
		setActiveRepo(repo);
		await loadTree(repo);
	}

	async function onRename() {
		if (!activeRepo?.fsHandleId || !openFile) return;
		const next = prompt("Rename to (relative):", openFile.path);
		if (!next || next === openFile.path) return;
		const dir = await getDirectoryHandle(activeRepo.fsHandleId);
		if (!dir) return;
		const fs = await import("../../switch/fs");
		await fs.writeFileText(dir, next, editorValue);
		await fs.deleteEntry(dir, openFile.path);
		setOpenFile({
			path: next,
			content: editorValue,
			language: languageFromPath(next),
		});
		await onRefresh();
	}

	async function onDelete() {
		if (!activeRepo?.fsHandleId || !openFile) return;
		if (!confirm(`Delete ${openFile.path}?`)) return;
		const dir = await getDirectoryHandle(activeRepo.fsHandleId);
		if (!dir) return;
		await (await import("../../switch/fs")).deleteEntry(dir, openFile.path);
		setOpenFile(undefined);
		setEditorValue("// File deleted\n");
		await onRefresh();
	}

	async function onSaveIssue() {
		if (!activeRepo || !selectedIssue) return;
		const { updateIssue } = await import("../../switch/logic");
		selectedIssue.title = issueTitle;
		selectedIssue.body = issueBody;
		selectedIssue.labels = issueLabels
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean);
		selectedIssue.status = issueStatus;
		await updateIssue(selectedIssue);
		setIssues(await listIssues(activeRepo.id));
	}

	async function onDeleteIssue() {
		if (!activeRepo || !selectedIssue) return;
		if (!confirm(`Delete issue ${selectedIssue.title}?`)) return;
		const { deleteIssue } = await import("../../switch/logic");
		await deleteIssue(selectedIssue.id);
		setIssues(await listIssues(activeRepo.id));
		setSelectedIssueId(undefined);
	}

	async function onPushToCloud() {
		if (!activeRepo) return;
		try {
			const { pushRepoToSupabase } = await import("../../switch/sync");
			await pushRepoToSupabase(activeRepo.id);
			alert("Pushed to Supabase storage.");
		} catch (e: any) {
			alert("Cloud push failed: " + (e?.message || e));
		}
	}
	async function onPullFromCloud() {
		if (!activeRepo) return;
		try {
			const { pullRepoFromSupabase } = await import("../../switch/sync");
			const bundle = await pullRepoFromSupabase(activeRepo.id);
			if (!bundle) {
				alert("No bundle found.");
				return;
			}
			// For now, just show summary; full import/merge logic can be added as next step
			alert(
				`Fetched bundle exportedAt=${new Date(
					bundle.exportedAt
				).toLocaleString()}\nbranches=${
					bundle.branches.length
				}, commits=${bundle.commits.length}, issues=${
					bundle.issues.length
				}`
			);
		} catch (e: any) {
			alert("Cloud pull failed: " + (e?.message || e));
		}
	}
}

async function getFileByPath(
	dir: FileSystemDirectoryHandle,
	path: string
): Promise<File | undefined> {
	const parts = path.split("/");
	let cur: FileSystemDirectoryHandle = dir;
	for (let i = 0; i < parts.length; i++) {
		const name = parts[i];
		if (i === parts.length - 1) {
			const fh = (await (cur as any)
				.getFileHandle(name)
				.catch(() => undefined)) as FileSystemFileHandle | undefined;
			return fh ? fh.getFile() : undefined;
		} else {
			cur = await (cur as any)
				.getDirectoryHandle(name)
				.catch(() => undefined);
			if (!cur) return undefined as any;
		}
	}
	return undefined as any;
}

function languageFromPath(path: string): string {
	const ext = path.split(".").pop()?.toLowerCase();
	switch (ext) {
		case "ts":
			return "typescript";
		case "tsx":
			return "typescript";
		case "js":
			return "javascript";
		case "jsx":
			return "javascript";
		case "json":
			return "json";
		case "css":
			return "css";
		case "scss":
			return "scss";
		case "html":
			return "html";
		case "md":
			return "markdown";
		case "py":
			return "python";
		case "rb":
			return "ruby";
		case "go":
			return "go";
		case "rs":
			return "rust";
		case "java":
			return "java";
		case "cs":
			return "csharp";
		case "cpp":
			return "cpp";
		case "yml":
		case "yaml":
			return "yaml";
		case "xml":
			return "xml";
		case "sql":
			return "sql";
		default:
			return "plaintext";
	}
}
