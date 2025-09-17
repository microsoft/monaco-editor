import { put, get, type FsHandleRecord } from "./db";
import { nanoid } from "./uid";

export async function pickDirectory(): Promise<{ id: string; handle: FileSystemDirectoryHandle }> {
  // @ts-ignore
  const handle: FileSystemDirectoryHandle = await (window as any).showDirectoryPicker();
  const id = nanoid();
  const rec: FsHandleRecord = { id, handle };
  await put("fsHandles", rec);
  return { id, handle };
}

export async function getDirectoryHandle(id: string): Promise<FileSystemDirectoryHandle | undefined> {
  const rec = await get<FsHandleRecord>("fsHandles", id);
  return rec?.handle;
}

export async function ensureReadPerm(dir: FileSystemDirectoryHandle): Promise<boolean> {
  const perm = await (dir as any).queryPermission?.({ mode: "read" });
  if (perm === "granted") return true;
  const req = await (dir as any).requestPermission?.({ mode: "read" });
  return req === "granted";
}

export async function* walk(dir: FileSystemDirectoryHandle, pathPrefix = ""): AsyncGenerator<{ path: string; file: File }>{
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
