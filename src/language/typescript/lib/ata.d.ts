export interface ATABootstrapConfig {
  /** A object you pass in to get callbacks */
  delegate: {
    /** The callback which gets called when ATA decides a file needs to be written to your VFS  */
    receivedFile?: (code: string, path: string) => void
    /** A way to display progress */
    progress?: (downloaded: number, estimatedTotal: number) => void
    /** Note: An error message does not mean ATA has stopped! */
    errorMessage?: (userFacingMessage: string, error: Error) => void
    /** A callback indicating that ATA actually has work to do */
    started?: () => void
    /** The callback when all ATA has finished */
    finished?: (files: Map<string, string>) => void
  }
  /** Passed to fetch as the user-agent */
  projectName: string
  /** Your local copy of typescript */
  typescript: typeof import("typescript")
  /** If you need a custom version of fetch */
  fetcher?: typeof fetch
  /** If you need a custom logger instead of the console global */
  logger?: Logger
}

type ModuleMeta = { state: "loading" }

/**
 * The function which starts up type acquisition,
 * returns a function which you then pass the initial
 * source code for the app with.
 *
 * This is effectively the main export, everything else is
 * basically exported for tests and should be considered
 * implementation details by consumers.
 */
export const setupTypeAcquisition: (config: ATABootstrapConfig) => (initialSourceFile: string) => void

interface Logger {
  log: (...args: any[]) => void
  error: (...args: any[]) => void
  groupCollapsed: (...args: any[]) => void
  groupEnd: (...args: any[]) => void
}
