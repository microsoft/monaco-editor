import {
	getAll,
	getAllByIndex,
	type RepoRecord,
	type BranchRecord,
	type CommitRecord,
	type IssueRecord,
} from "./db";
import { supabase } from "./supabase";

export interface ExportBundle {
	repo: RepoRecord;
	branches: BranchRecord[];
	commits: CommitRecord[];
	issues: IssueRecord[];
	exportedAt: number;
}

export async function exportRepoBundle(repoId: string): Promise<ExportBundle> {
	const repos = await getAll<RepoRecord>("repos");
	const repo = repos.find((r) => r.id === repoId)!;
	const branches = await getAllByIndex<BranchRecord>(
		"branches",
		"by_repo",
		repoId
	);
	const commits = await getAllByIndex<CommitRecord>(
		"commits",
		"by_repo",
		repoId
	);
	const issues = await getAllByIndex<IssueRecord>(
		"issues",
		"by_repo",
		repoId
	);
	return { repo, branches, commits, issues, exportedAt: Date.now() };
}

export async function pushRepoToSupabase(repoId: string): Promise<void> {
	if (!supabase) throw new Error("Supabase not configured");
	const bundle = await exportRepoBundle(repoId);
	const path = `repos/${repoId}.json`;
	const data = new Blob([JSON.stringify(bundle)], {
		type: "application/json",
	});
	const { error } = await supabase.storage
		.from("switch")
		.upload(path, data, { upsert: true });
	if (error) throw error;
}

export async function pullRepoFromSupabase(
	repoId: string
): Promise<ExportBundle | undefined> {
	if (!supabase) throw new Error("Supabase not configured");
	const path = `repos/${repoId}.json`;
	const { data, error } = await supabase.storage
		.from("switch")
		.download(path);
	if (error) throw error;
	const text = await data.text();
	return JSON.parse(text) as ExportBundle;
}
