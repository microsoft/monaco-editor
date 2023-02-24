import { createDecorator } from '../../instantiation/common/instantiation.js';
import { localize } from '../../../nls.js';
export const IAudioCueService = createDecorator('audioCue');
/**
 * Corresponds to the audio files in ./media.
*/
class Sound {
    static register(options) {
        const sound = new Sound(options.fileName);
        return sound;
    }
    constructor(fileName) {
        this.fileName = fileName;
    }
}
Sound.error = Sound.register({ fileName: 'error.mp3' });
Sound.warning = Sound.register({ fileName: 'warning.mp3' });
Sound.foldedArea = Sound.register({ fileName: 'foldedAreas.mp3' });
Sound.break = Sound.register({ fileName: 'break.mp3' });
Sound.quickFixes = Sound.register({ fileName: 'quickFixes.mp3' });
Sound.taskCompleted = Sound.register({ fileName: 'taskCompleted.mp3' });
Sound.taskFailed = Sound.register({ fileName: 'taskFailed.mp3' });
Sound.terminalBell = Sound.register({ fileName: 'terminalBell.mp3' });
Sound.diffLineInserted = Sound.register({ fileName: 'diffLineInserted.mp3' });
Sound.diffLineDeleted = Sound.register({ fileName: 'diffLineDeleted.mp3' });
Sound.diffLineModified = Sound.register({ fileName: 'diffLineModified.mp3' });
export { Sound };
class AudioCue {
    static register(options) {
        const audioCue = new AudioCue(options.sound, options.name, options.settingsKey);
        AudioCue._audioCues.add(audioCue);
        return audioCue;
    }
    constructor(sound, name, settingsKey) {
        this.sound = sound;
        this.name = name;
        this.settingsKey = settingsKey;
    }
}
AudioCue._audioCues = new Set();
AudioCue.error = AudioCue.register({
    name: localize('audioCues.lineHasError.name', 'Error on Line'),
    sound: Sound.error,
    settingsKey: 'audioCues.lineHasError',
});
AudioCue.warning = AudioCue.register({
    name: localize('audioCues.lineHasWarning.name', 'Warning on Line'),
    sound: Sound.warning,
    settingsKey: 'audioCues.lineHasWarning',
});
AudioCue.foldedArea = AudioCue.register({
    name: localize('audioCues.lineHasFoldedArea.name', 'Folded Area on Line'),
    sound: Sound.foldedArea,
    settingsKey: 'audioCues.lineHasFoldedArea',
});
AudioCue.break = AudioCue.register({
    name: localize('audioCues.lineHasBreakpoint.name', 'Breakpoint on Line'),
    sound: Sound.break,
    settingsKey: 'audioCues.lineHasBreakpoint',
});
AudioCue.inlineSuggestion = AudioCue.register({
    name: localize('audioCues.lineHasInlineSuggestion.name', 'Inline Suggestion on Line'),
    sound: Sound.quickFixes,
    settingsKey: 'audioCues.lineHasInlineSuggestion',
});
AudioCue.terminalQuickFix = AudioCue.register({
    name: localize('audioCues.terminalQuickFix.name', 'Terminal Quick Fix'),
    sound: Sound.quickFixes,
    settingsKey: 'audioCues.terminalQuickFix',
});
AudioCue.onDebugBreak = AudioCue.register({
    name: localize('audioCues.onDebugBreak.name', 'Debugger Stopped on Breakpoint'),
    sound: Sound.break,
    settingsKey: 'audioCues.onDebugBreak',
});
AudioCue.noInlayHints = AudioCue.register({
    name: localize('audioCues.noInlayHints', 'No Inlay Hints on Line'),
    sound: Sound.error,
    settingsKey: 'audioCues.noInlayHints'
});
AudioCue.taskCompleted = AudioCue.register({
    name: localize('audioCues.taskCompleted', 'Task Completed'),
    sound: Sound.taskCompleted,
    settingsKey: 'audioCues.taskCompleted'
});
AudioCue.taskFailed = AudioCue.register({
    name: localize('audioCues.taskFailed', 'Task Failed'),
    sound: Sound.taskFailed,
    settingsKey: 'audioCues.taskFailed'
});
AudioCue.terminalCommandFailed = AudioCue.register({
    name: localize('audioCues.terminalCommandFailed', 'Terminal Command Failed'),
    sound: Sound.taskFailed,
    settingsKey: 'audioCues.terminalCommandFailed'
});
AudioCue.terminalBell = AudioCue.register({
    name: localize('audioCues.terminalBell', 'Terminal Bell'),
    sound: Sound.terminalBell,
    settingsKey: 'audioCues.terminalBell'
});
AudioCue.notebookCellCompleted = AudioCue.register({
    name: localize('audioCues.notebookCellCompleted', 'Notebook Cell Completed'),
    sound: Sound.taskCompleted,
    settingsKey: 'audioCues.notebookCellCompleted'
});
AudioCue.notebookCellFailed = AudioCue.register({
    name: localize('audioCues.notebookCellFailed', 'Notebook Cell Failed'),
    sound: Sound.taskFailed,
    settingsKey: 'audioCues.notebookCellFailed'
});
AudioCue.diffLineInserted = AudioCue.register({
    name: localize('audioCues.diffLineInserted', 'Diff Line Inserted'),
    sound: Sound.diffLineInserted,
    settingsKey: 'audioCues.diffLineInserted'
});
AudioCue.diffLineDeleted = AudioCue.register({
    name: localize('audioCues.diffLineDeleted', 'Diff Line Deleted'),
    sound: Sound.diffLineDeleted,
    settingsKey: 'audioCues.diffLineDeleted'
});
AudioCue.diffLineModified = AudioCue.register({
    name: localize('audioCues.diffLineModified', 'Diff Line Modified'),
    sound: Sound.diffLineModified,
    settingsKey: 'audioCues.diffLineModified'
});
export { AudioCue };
