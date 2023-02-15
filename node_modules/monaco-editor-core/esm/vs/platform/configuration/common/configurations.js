import { Disposable } from '../../../base/common/lifecycle.js';
import { ConfigurationModel } from './configurationModels.js';
import { Extensions } from './configurationRegistry.js';
import { Registry } from '../../registry/common/platform.js';
export class DefaultConfiguration extends Disposable {
    constructor() {
        super(...arguments);
        this._configurationModel = new ConfigurationModel();
    }
    get configurationModel() {
        return this._configurationModel;
    }
    reload() {
        this.resetConfigurationModel();
        return this.configurationModel;
    }
    getConfigurationDefaultOverrides() {
        return {};
    }
    resetConfigurationModel() {
        this._configurationModel = new ConfigurationModel();
        const properties = Registry.as(Extensions.Configuration).getConfigurationProperties();
        this.updateConfigurationModel(Object.keys(properties), properties);
    }
    updateConfigurationModel(properties, configurationProperties) {
        const configurationDefaultsOverrides = this.getConfigurationDefaultOverrides();
        for (const key of properties) {
            const defaultOverrideValue = configurationDefaultsOverrides[key];
            const propertySchema = configurationProperties[key];
            if (defaultOverrideValue !== undefined) {
                this._configurationModel.addValue(key, defaultOverrideValue);
            }
            else if (propertySchema) {
                this._configurationModel.addValue(key, propertySchema.default);
            }
            else {
                this._configurationModel.removeValue(key);
            }
        }
    }
}
