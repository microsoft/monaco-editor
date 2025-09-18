import { put, get, type FsHandleRecord } from "./db";
import { nanoid } from "./uid";

export async function pickDirectory(): Promise<{
	id: string;
	handle: FileSystemDirectoryHandle;
}> {
	// @ts-ignore
	const handle: FileSystemDirectoryHandle = await (
		window as any
	).showDirectoryPicker();
	const id = nanoid();
	const rec: FsHandleRecord = { id, handle };
	await put("fsHandles", rec);
	return { id, handle };
}

export async function getDirectoryHandle(
	id: string
): Promise<FileSystemDirectoryHandle | undefined> {
	const rec = await get<FsHandleRecord>("fsHandles", id);
	return rec?.handle;
}

export async function ensureReadPerm(
	dir: FileSystemDirectoryHandle
): Promise<boolean> {
	const perm = await (dir as any).queryPermission?.({ mode: "read" });
	if (perm === "granted") return true;
	const req = await (dir as any).requestPermission?.({ mode: "read" });
	return req === "granted";
}

export async function ensureWritePerm(
	dir: FileSystemDirectoryHandle
): Promise<boolean> {
	const perm = await (dir as any).queryPermission?.({ mode: "readwrite" });
	if (perm === "granted") return true;
	const req = await (dir as any).requestPermission?.({ mode: "readwrite" });
	return req === "granted";
}

export async function getDirectoryHandleByPath(
	root: FileSystemDirectoryHandle,
	path: string,
	create = false
): Promise<FileSystemDirectoryHandle | undefined> {
	const parts = path.split("/").filter(Boolean);
	let cur: FileSystemDirectoryHandle = root;
	for (const name of parts) {
		const next = await (cur as any)
			.getDirectoryHandle(name, { create })
			.catch(() => undefined);
		if (!next) return undefined;
		cur = next;
	}
	return cur;
}

export async function getFileHandleByPath(
	root: FileSystemDirectoryHandle,
	path: string,
	create = false
): Promise<FileSystemFileHandle | undefined> {
	const parts = path.split("/");
	const dirPath = parts.slice(0, -1).join("/");
	const fileName = parts[parts.length - 1];
	const dir = dirPath
		? await getDirectoryHandleByPath(root, dirPath, create)
		: root;
	if (!dir) return undefined;
	return (dir as any)
		.getFileHandle(fileName, { create })
		.catch(() => undefined);
}

export async function readFileText(
	root: FileSystemDirectoryHandle,
	path: string
): Promise<string | undefined> {
	const fh = await getFileHandleByPath(root, path);
	if (!fh) return undefined;
	const file = await fh.getFile();
	return file.text();
}

export async function writeFileText(
	root: FileSystemDirectoryHandle,
	path: string,
	content: string
): Promise<void> {
	const dirPerm = await ensureWritePerm(root);
	if (!dirPerm) throw new Error("No write permission");
	const fh = await getFileHandleByPath(root, path, true);
	if (!fh) throw new Error("Cannot create file");
	const w = await (fh as any).createWritable();
	await w.write(content);
	await w.close();
}

export async function createDirectory(
	root: FileSystemDirectoryHandle,
	path: string
): Promise<void> {
	const ok = await ensureWritePerm(root);
	if (!ok) throw new Error("No write permission");
	await getDirectoryHandleByPath(root, path, true);
}

export async function deleteEntry(
	root: FileSystemDirectoryHandle,
	path: string,
	recursive = false
): Promise<void> {
	const parts = path.split("/");
	const dirPath = parts.slice(0, -1).join("/");
	const name = parts[parts.length - 1];
	const dir = dirPath ? await getDirectoryHandleByPath(root, dirPath) : root;
	if (!dir) throw new Error("Path not found");
	await (dir as any).removeEntry(name, { recursive }).catch(() => undefined);
}

export async function* walk(
	dir: FileSystemDirectoryHandle,
	pathPrefix = ""
): AsyncGenerator<{ path: string; file: File }> {
	// @ts-ignore
	for await (const [name, entry] of (dir as any).entries()) {
		const p = pathPrefix ? `${pathPrefix}/${name}` : name;
		if (entry.kind === "directory") {
			yield* walk(entry as FileSystemDirectoryHandle, p);
		} else {
			const file = await (entry as FileSystemFileHandle).getFile();
			yield { path: p, file };
		}
	}
}

export async function copyDirectory(
	src: FileSystemDirectoryHandle,
	dest: FileSystemDirectoryHandle
): Promise<void> {
	const ok = await ensureWritePerm(dest);
	if (!ok) throw new Error("No write permission on destination");
	// @ts-ignore
	for await (const [name, entry] of (src as any).entries()) {
		if (entry.kind === "directory") {
			const sub = await (dest as any).getDirectoryHandle(name, {
				create: true,
			});
			await copyDirectory(entry as FileSystemDirectoryHandle, sub);
		} else {
			const file = await (entry as FileSystemFileHandle).getFile();
			const fh = await (dest as any).getFileHandle(name, {
				create: true,
			});
			const w = await (fh as any).createWritable();
			await w.write(await file.arrayBuffer());
			await w.close();
		}
	}
}
