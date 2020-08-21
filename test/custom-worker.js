/// <reference lib="webworker">

console.log("worker")

self.extendTSWorkerFactory = (TypeScriptWorker) => {
  return class MonacoTSWorker extends TypeScriptWorker {

  }
}
