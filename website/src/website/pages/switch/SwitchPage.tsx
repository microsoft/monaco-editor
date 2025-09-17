import * as React from "react";
import { ControlledMonacoEditor } from "../../components/monaco/MonacoEditor";

export function SwitchPage() {
  const [value, setValue] = React.useState<string>(`// Welcome to SWITCH\n// Start coding, create repos and manage issues here.\n`);
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
            <div className="switch-pane-header">Explorer</div>
            <div className="switch-pane-body">
              <button className="switch-secondary-btn">Open Folder</button>
              <button className="switch-secondary-btn">New Repository</button>
            </div>
          </div>
          <div className="switch-pane">
            <div className="switch-pane-header">Repositories</div>
            <div className="switch-pane-body">
              <div className="switch-empty">No repositories yet</div>
            </div>
          </div>
        </aside>
        <section className="switch-editor" aria-label="Editor">
          <div className="switch-tabbar">
            <div className="switch-tab active">welcome.ts</div>
          </div>
          <div className="switch-editor-inner">
            <ControlledMonacoEditor value={value} onDidValueChange={setValue} language="typescript" theme="vs-dark" />
          </div>
        </section>
      </div>
      <footer className="switch-statusbar" aria-label="Status Bar">
        <div className="switch-status-item">SWITCH</div>
        <div className="switch-status-item">TypeScript</div>
        <div className="switch-status-item">UTF-8</div>
        <div className="switch-status-item">LF</div>
      </footer>
    </div>
  );
}
