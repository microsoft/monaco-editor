import { get, getAllByIndex, put, del, getSetting, setSetting, type RepoRecord, type BranchRecord, type CommitRecord, type IssueRecord } from "./db";
import { nanoid } from "./uid";

const curBranchKey = (repoId: string) => `repo:${repoId}:currentBranchId`;

export async function getCurrentBranchId(repoId: string): Promise<string | undefined> {
  return getSetting<string>(curBranchKey(repoId));
}

export async function setCurrentBranchId(repoId: string, branchId: string): Promise<void> {
  await setSetting(curBranchKey(repoId), branchId);
}

export async function getBranch(repoId: string, name: string): Promise<BranchRecord | undefined> {
  const branches = await getAllByIndex<BranchRecord>("branches", "by_repo", repoId);
  return branches.find(b => b.name === name);
}

export async function listCommitsReachable(repoId: string, headCommitId?: string): Promise<CommitRecord[]> {
  const all = await getAllByIndex<CommitRecord>("commits", "by_repo", repoId);
  if (!headCommitId) return [];
  const map = new Map(all.map(c => [c.id, c] as const));
  const visited = new Set<string>();
  const ordered: CommitRecord[] = [];
  const stack = [headCommitId];
  while (stack.length) {
    const id = stack.pop()!;
    if (visited.has(id)) continue;
    visited.add(id);
    const c = map.get(id);
    if (!c) continue;
    ordered.push(c);
    for (const p of c.parentIds) stack.push(p);
  }
  ordered.sort((a,b)=>b.timestamp - a.timestamp);
  return ordered;
}

export async function commitOnBranch(repoId: string, branchId: string, message: string): Promise<CommitRecord> {
  const branch = await get<BranchRecord>("branches", branchId);
  if (!branch) throw new Error("Branch not found");
  const parent = branch.headCommitId ? [branch.headCommitId] : [];
  const commit: CommitRecord = { id: nanoid(), repoId, message, parentIds: parent, timestamp: Date.now() };
  await put("commits", commit);
  branch.headCommitId = commit.id;
  await put("branches", branch);
  return commit;
}

export async function createIssue(repoId: string, data: { title: string; body?: string; labels?: string[]; branchId?: string; filePath?: string }): Promise<IssueRecord> {
  const issue: IssueRecord = {
    id: nanoid(), repoId,
    title: data.title, body: data.body || "",
    labels: data.labels || [], status: "open",
    createdAt: Date.now(), updatedAt: Date.now(),
    branchId: data.branchId, filePath: data.filePath
  };
  await put("issues", issue);
  return issue;
}

export async function listIssues(repoId: string): Promise<IssueRecord[]> {
  return getAllByIndex<IssueRecord>("issues", "by_repo", repoId);
}

export async function updateIssue(issue: IssueRecord): Promise<void> {
  issue.updatedAt = Date.now();
  await put("issues", issue);
}

export async function deleteIssue(id: string): Promise<void> { await del("issues", id); }
