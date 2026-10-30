import { MonacoLspClient, MonacoLspClientOptions } from './adapters/LspClient';
import { WebSocketTransport } from '@hediet/json-rpc-websocket';
import { createTransportToWorker, createTransportToIFrame } from '@hediet/json-rpc-browser';

export { MonacoLspClient, WebSocketTransport, createTransportToWorker, createTransportToIFrame };
export type { MonacoLspClientOptions };
