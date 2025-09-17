import { put, get, getAll, getAllByIndex, del, type RepoRecord, type BranchRecord, type CommitRecord, type IssueRecord } from "./db";
import { nanoid } from "./uid";

export async function createRepository(name: string, fsHandleId?: string): Promise<RepoRecord> {
  const repo: RepoRecord = { id: nanoid(), name, createdAt: Date.now(), defaultBranch: "main", fsHandleId };
  await put("repos", repo);
  const main: BranchRecord = { id: nanoid(), repoId: repo.id, name: repo.defaultBranch, headCommitId: undefined };
  await put("branches", main);
  return repo;
}

export async function listRepositories(): Promise<RepoRecord[]> {
  return getAll<RepoRecord>("repos");
}

export async function deleteRepository(repoId: string): Promise<void> {
  // naive cascade delete
  const branches = await getAllByIndex<BranchRecord>("branches", "by_repo", repoId);
  for (const b of branches) await del("branches", b.id);
  const commits = await getAllByIndex<CommitRecord>("commits", "by_repo", repoId);
  for (const c of commits) await del("commits", c.id);
  const issues = await getAllByIndex<IssueRecord>("issues", "by_repo", repoId);
  for (const i of issues) await del("issues", i.id);
  await del("repos", repoId);
}

export async function createBranch(repoId: string, name: string, fromCommitId?: string): Promise<BranchRecord> {
  const existing = await getAllByIndex<BranchRecord>("branches", "by_repo_name", [repoId, name]).catch(() => []);
  if (existing && existing.length) throw new Error("Branch already exists");
  const branch: BranchRecord = { id: nanoid(), repoId, name, headCommitId: fromCommitId };
  await put("branches", branch);
  return branch;
}

export async function listBranches(repoId: string): Promise<BranchRecord[]> {
  return getAllByIndex<BranchRecord>("branches", "by_repo", repoId);
}

export async function commit(repoId: string, message: string, parentIds: string[] = []): Promise<CommitRecord> {
  const c: CommitRecord = { id: nanoid(), repoId, message, parentIds, timestamp: Date.now() };
  await put("commits", c);
  return c;
}

export async function getRepo(repoId: string): Promise<RepoRecord | undefined> {
  return get<RepoRecord>("repos", repoId);
}
