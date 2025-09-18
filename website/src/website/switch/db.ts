export type StoreName =
	| "repos"
	| "branches"
	| "commits"
	| "issues"
	| "fsHandles"
	| "settings";

const DB_NAME = "switch-db";
const DB_VERSION = 2;

export interface RepoRecord {
	id: string;
	name: string;
	createdAt: number;
	defaultBranch: string;
	fsHandleId?: string;
}

export interface BranchRecord {
	id: string;
	repoId: string;
	name: string;
	headCommitId?: string;
}

export interface CommitRecord {
	id: string;
	repoId: string;
	message: string;
	parentIds: string[];
	timestamp: number;
}

export interface IssueRecord {
	id: string;
	repoId: string;
	title: string;
	body: string;
	labels: string[];
	status: "open" | "closed";
	createdAt: number;
	updatedAt: number;
	branchId?: string;
	filePath?: string;
}

export interface FsHandleRecord {
	id: string;
	handle: FileSystemDirectoryHandle;
}

export interface RepoTemplateRecord {
	id: string;
	name: string;
	fsHandleId: string;
}

export interface IssueTemplateRecord {
	id: string;
	name: string;
	title: string;
	body: string;
	labels: string[];
}

export async function openDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, DB_VERSION);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains("repos")) {
				const store = db.createObjectStore("repos", { keyPath: "id" });
				store.createIndex("by_name", "name", { unique: false });
			}
			if (!db.objectStoreNames.contains("branches")) {
				const store = db.createObjectStore("branches", {
					keyPath: "id",
				});
				store.createIndex("by_repo", "repoId", { unique: false });
				store.createIndex("by_repo_name", ["repoId", "name"], {
					unique: true,
				});
			}
			if (!db.objectStoreNames.contains("commits")) {
				const store = db.createObjectStore("commits", {
					keyPath: "id",
				});
				store.createIndex("by_repo", "repoId", { unique: false });
			}
			if (!db.objectStoreNames.contains("issues")) {
				const store = db.createObjectStore("issues", { keyPath: "id" });
				store.createIndex("by_repo", "repoId", { unique: false });
			}
			if (!db.objectStoreNames.contains("fsHandles")) {
				db.createObjectStore("fsHandles", { keyPath: "id" });
			}
			if (!db.objectStoreNames.contains("settings")) {
				db.createObjectStore("settings", { keyPath: "id" });
			}
			if (!db.objectStoreNames.contains("repoTemplates")) {
				db.createObjectStore("repoTemplates", { keyPath: "id" });
			}
			if (!db.objectStoreNames.contains("issueTemplates")) {
				db.createObjectStore("issueTemplates", { keyPath: "id" });
			}
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}

export async function tx<T>(
	storeNames: StoreName[],
	mode: IDBTransactionMode,
	fn: (tx: IDBTransaction) => Promise<T>
): Promise<T> {
	const db = await openDB();
	return new Promise<T>((resolve, reject) => {
		const transaction = db.transaction(storeNames, mode);
		const done = async () => {
			try {
				const r = await fn(transaction);
				resolve(r);
			} catch (e) {
				reject(e);
			}
		};
		transaction.oncomplete = () => db.close();
		transaction.onabort = () => reject(transaction.error);
		transaction.onerror = () => reject(transaction.error);
		done();
	});
}

export async function put<T>(store: StoreName, value: T): Promise<void> {
	await tx([store], "readwrite", async (t) => {
		await requestAsPromise<void>(t.objectStore(store).put(value as any));
		return undefined as any;
	});
}

export async function get<T>(
	store: StoreName,
	key: IDBValidKey
): Promise<T | undefined> {
	return tx([store], "readonly", async (t) => {
		return requestAsPromise<T | undefined>(t.objectStore(store).get(key));
	});
}

export async function del(store: StoreName, key: IDBValidKey): Promise<void> {
	await tx([store], "readwrite", async (t) => {
		await requestAsPromise<void>(t.objectStore(store).delete(key));
		return undefined as any;
	});
}

export async function getAllByIndex<T>(
	store: StoreName,
	index: string,
	query: IDBValidKey | IDBKeyRange
): Promise<T[]> {
	return tx([store], "readonly", async (t) => {
		const idx = t.objectStore(store).index(index);
		return requestAsPromise<T[]>(idx.getAll(query));
	});
}

export async function getAll<T>(store: StoreName): Promise<T[]> {
	return tx([store], "readonly", async (t) => {
		return requestAsPromise<T[]>(t.objectStore(store).getAll());
	});
}

export async function setSetting<T>(id: string, value: T): Promise<void> {
	await put("settings", { id, value } as any);
}

export async function getSetting<T>(id: string): Promise<T | undefined> {
	const rec = await get<any>("settings", id);
	return rec?.value as T | undefined;
}

function requestAsPromise<T>(req: IDBRequest<T>): Promise<T> {
	return new Promise((resolve, reject) => {
		req.onsuccess = () => resolve(req.result as T);
		req.onerror = () => reject(req.error);
	});
}
