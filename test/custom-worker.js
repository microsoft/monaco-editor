/// <reference lib="webworker">

self.extendTSWorkerFactory = (TypeScriptWorker) => {
  return class MonacoTSWorker extends TypeScriptWorker {

    // Adds a custom function to the webworker
    async getDTSEmitForFile(fileName) {
      const result = await this.getEmitOutput(fileName)
      const firstDTS = result.outputFiles.find(o => o.name.endsWith(".d.ts"))
      return (firstDTS && firstDTS.text) || ""
    }

  }
}
