import * as React from "react";

export interface FileNode { path: string; isDir: boolean; children?: FileNode[] }

export function FileTree({ tree, onOpen }: { tree: FileNode[]; onOpen: (path: string) => void }) {
  return (
    <div className="switch-filetree" role="tree">
      {tree.map((n) => (
        <TreeNode key={n.path} node={n} onOpen={onOpen} depth={0} />
      ))}
    </div>
  );
}

function TreeNode({ node, onOpen, depth }: { node: FileNode; onOpen: (path: string) => void; depth: number }) {
  const [open, setOpen] = React.useState(true);
  const paddingLeft = 8 + depth * 12;
  if (node.isDir) {
    return (
      <div>
        <div className="switch-tree-row" style={{ paddingLeft }} onClick={() => setOpen(!open)}>
          <span className="switch-tree-chevron">{open ? "▾" : "▸"}</span>
          <span className="switch-tree-dir">{basename(node.path)}</span>
        </div>
        {open && node.children?.map((c) => (
          <TreeNode key={c.path} node={c} onOpen={onOpen} depth={depth + 1} />
        ))}
      </div>
    );
  }
  return (
    <div className="switch-tree-row" style={{ paddingLeft }} role="treeitem" onClick={() => onOpen(node.path)}>
      <span className="switch-tree-file">{basename(node.path)}</span>
    </div>
  );
}

function basename(p: string) {
  const idx = p.lastIndexOf("/");
  return idx >= 0 ? p.slice(idx + 1) : p;
}
