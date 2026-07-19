import { TypedChannel } from '@hediet/json-rpc';
import { api } from '../../src/types';
import { ITextModelBridge } from './ITextModelBridge';
import { LspCapabilitiesRegistry } from './LspCapabilitiesRegistry';

export class LspConnection {
    constructor(
        public readonly server: typeof api.TServerInterface,
        public readonly bridge: ITextModelBridge,
        public readonly capabilities: LspCapabilitiesRegistry,
        public readonly connection: TypedChannel,
    ) { }
}
