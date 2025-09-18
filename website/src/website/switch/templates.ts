import {
	get,
	put,
	del,
	getAll,
	type RepoTemplateRecord,
	type IssueTemplateRecord,
} from "./db";
import { nanoid } from "./uid";

export async function createRepoTemplate(
	name: string,
	fsHandleId: string
): Promise<RepoTemplateRecord> {
	const rec: RepoTemplateRecord = { id: nanoid(), name, fsHandleId };
	await put("repoTemplates" as any, rec as any);
	return rec;
}
export async function listRepoTemplates(): Promise<RepoTemplateRecord[]> {
	return getAll<any>("repoTemplates" as any) as any;
}
export async function deleteRepoTemplate(id: string): Promise<void> {
	await del("repoTemplates" as any, id);
}

export async function createIssueTemplate(data: {
	name: string;
	title: string;
	body: string;
	labels: string[];
}): Promise<IssueTemplateRecord> {
	const rec: IssueTemplateRecord = { id: nanoid(), ...data };
	await put("issueTemplates" as any, rec as any);
	return rec;
}
export async function listIssueTemplates(): Promise<IssueTemplateRecord[]> {
	return getAll<any>("issueTemplates" as any) as any;
}
export async function deleteIssueTemplate(id: string): Promise<void> {
	await del("issueTemplates" as any, id);
}
