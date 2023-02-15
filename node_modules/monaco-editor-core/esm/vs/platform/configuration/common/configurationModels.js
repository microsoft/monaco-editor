/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as arrays from '../../../base/common/arrays.js';
import { ResourceMap } from '../../../base/common/map.js';
import * as objects from '../../../base/common/objects.js';
import * as types from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { addToValueTree, getConfigurationValue, removeFromValueTree, toValuesTree } from './configuration.js';
import { Extensions, overrideIdentifiersFromKey, OVERRIDE_PROPERTY_REGEX } from './configurationRegistry.js';
import { Registry } from '../../registry/common/platform.js';
function freeze(data) {
    return Object.isFrozen(data) ? data : objects.deepFreeze(data);
}
export class ConfigurationModel {
    constructor(_contents = {}, _keys = [], _overrides = [], raw) {
        this._contents = _contents;
        this._keys = _keys;
        this._overrides = _overrides;
        this.raw = raw;
        this.overrideConfigurations = new Map();
    }
    get rawConfiguration() {
        var _a;
        if (!this._rawConfiguration) {
            if ((_a = this.raw) === null || _a === void 0 ? void 0 : _a.length) {
                const rawConfigurationModels = this.raw.map(raw => {
                    if (raw instanceof ConfigurationModel) {
                        return raw;
                    }
                    const parser = new ConfigurationModelParser('');
                    parser.parseRaw(raw);
                    return parser.configurationModel;
                });
                this._rawConfiguration = rawConfigurationModels.reduce((previous, current) => current === previous ? current : previous.merge(current), rawConfigurationModels[0]);
            }
            else {
                // raw is same as current
                this._rawConfiguration = this;
            }
        }
        return this._rawConfiguration;
    }
    get contents() {
        return this._contents;
    }
    get overrides() {
        return this._overrides;
    }
    get keys() {
        return this._keys;
    }
    isEmpty() {
        return this._keys.length === 0 && Object.keys(this._contents).length === 0 && this._overrides.length === 0;
    }
    getValue(section) {
        return section ? getConfigurationValue(this.contents, section) : this.contents;
    }
    inspect(section, overrideIdentifier) {
        const value = this.rawConfiguration.getValue(section);
        const override = overrideIdentifier ? this.rawConfiguration.getOverrideValue(section, overrideIdentifier) : undefined;
        const merged = overrideIdentifier ? this.rawConfiguration.override(overrideIdentifier).getValue(section) : value;
        return { value, override, merged };
    }
    getOverrideValue(section, overrideIdentifier) {
        const overrideContents = this.getContentsForOverrideIdentifer(overrideIdentifier);
        return overrideContents
            ? section ? getConfigurationValue(overrideContents, section) : overrideContents
            : undefined;
    }
    override(identifier) {
        let overrideConfigurationModel = this.overrideConfigurations.get(identifier);
        if (!overrideConfigurationModel) {
            overrideConfigurationModel = this.createOverrideConfigurationModel(identifier);
            this.overrideConfigurations.set(identifier, overrideConfigurationModel);
        }
        return overrideConfigurationModel;
    }
    merge(...others) {
        var _a, _b;
        const contents = objects.deepClone(this.contents);
        const overrides = objects.deepClone(this.overrides);
        const keys = [...this.keys];
        const raws = ((_a = this.raw) === null || _a === void 0 ? void 0 : _a.length) ? [...this.raw] : [this];
        for (const other of others) {
            raws.push(...(((_b = other.raw) === null || _b === void 0 ? void 0 : _b.length) ? other.raw : [other]));
            if (other.isEmpty()) {
                continue;
            }
            this.mergeContents(contents, other.contents);
            for (const otherOverride of other.overrides) {
                const [override] = overrides.filter(o => arrays.equals(o.identifiers, otherOverride.identifiers));
                if (override) {
                    this.mergeContents(override.contents, otherOverride.contents);
                    override.keys.push(...otherOverride.keys);
                    override.keys = arrays.distinct(override.keys);
                }
                else {
                    overrides.push(objects.deepClone(otherOverride));
                }
            }
            for (const key of other.keys) {
                if (keys.indexOf(key) === -1) {
                    keys.push(key);
                }
            }
        }
        return new ConfigurationModel(contents, keys, overrides, raws.every(raw => raw instanceof ConfigurationModel) ? undefined : raws);
    }
    createOverrideConfigurationModel(identifier) {
        const overrideContents = this.getContentsForOverrideIdentifer(identifier);
        if (!overrideContents || typeof overrideContents !== 'object' || !Object.keys(overrideContents).length) {
            // If there are no valid overrides, return self
            return this;
        }
        const contents = {};
        for (const key of arrays.distinct([...Object.keys(this.contents), ...Object.keys(overrideContents)])) {
            let contentsForKey = this.contents[key];
            const overrideContentsForKey = overrideContents[key];
            // If there are override contents for the key, clone and merge otherwise use base contents
            if (overrideContentsForKey) {
                // Clone and merge only if base contents and override contents are of type object otherwise just override
                if (typeof contentsForKey === 'object' && typeof overrideContentsForKey === 'object') {
                    contentsForKey = objects.deepClone(contentsForKey);
                    this.mergeContents(contentsForKey, overrideContentsForKey);
                }
                else {
                    contentsForKey = overrideContentsForKey;
                }
            }
            contents[key] = contentsForKey;
        }
        return new ConfigurationModel(contents, this.keys, this.overrides);
    }
    mergeContents(source, target) {
        for (const key of Object.keys(target)) {
            if (key in source) {
                if (types.isObject(source[key]) && types.isObject(target[key])) {
                    this.mergeContents(source[key], target[key]);
                    continue;
                }
            }
            source[key] = objects.deepClone(target[key]);
        }
    }
    getContentsForOverrideIdentifer(identifier) {
        let contentsForIdentifierOnly = null;
        let contents = null;
        const mergeContents = (contentsToMerge) => {
            if (contentsToMerge) {
                if (contents) {
                    this.mergeContents(contents, contentsToMerge);
                }
                else {
                    contents = objects.deepClone(contentsToMerge);
                }
            }
        };
        for (const override of this.overrides) {
            if (arrays.equals(override.identifiers, [identifier])) {
                contentsForIdentifierOnly = override.contents;
            }
            else if (override.identifiers.includes(identifier)) {
                mergeContents(override.contents);
            }
        }
        // Merge contents of the identifier only at the end to take precedence.
        mergeContents(contentsForIdentifierOnly);
        return contents;
    }
    toJSON() {
        return {
            contents: this.contents,
            overrides: this.overrides,
            keys: this.keys
        };
    }
    // Update methods
    addValue(key, value) {
        this.updateValue(key, value, true);
    }
    setValue(key, value) {
        this.updateValue(key, value, false);
    }
    removeValue(key) {
        const index = this.keys.indexOf(key);
        if (index === -1) {
            return;
        }
        this.keys.splice(index, 1);
        removeFromValueTree(this.contents, key);
        if (OVERRIDE_PROPERTY_REGEX.test(key)) {
            this.overrides.splice(this.overrides.findIndex(o => arrays.equals(o.identifiers, overrideIdentifiersFromKey(key))), 1);
        }
    }
    updateValue(key, value, add) {
        addToValueTree(this.contents, key, value, e => console.error(e));
        add = add || this.keys.indexOf(key) === -1;
        if (add) {
            this.keys.push(key);
        }
        if (OVERRIDE_PROPERTY_REGEX.test(key)) {
            this.overrides.push({
                identifiers: overrideIdentifiersFromKey(key),
                keys: Object.keys(this.contents[key]),
                contents: toValuesTree(this.contents[key], message => console.error(message)),
            });
        }
    }
}
export class ConfigurationModelParser {
    constructor(_name) {
        this._name = _name;
        this._raw = null;
        this._configurationModel = null;
        this._restrictedConfigurations = [];
    }
    get configurationModel() {
        return this._configurationModel || new ConfigurationModel();
    }
    parseRaw(raw, options) {
        this._raw = raw;
        const { contents, keys, overrides, restricted, hasExcludedProperties } = this.doParseRaw(raw, options);
        this._configurationModel = new ConfigurationModel(contents, keys, overrides, hasExcludedProperties ? [raw] : undefined /* raw has not changed */);
        this._restrictedConfigurations = restricted || [];
    }
    doParseRaw(raw, options) {
        const configurationProperties = Registry.as(Extensions.Configuration).getConfigurationProperties();
        const filtered = this.filter(raw, configurationProperties, true, options);
        raw = filtered.raw;
        const contents = toValuesTree(raw, message => console.error(`Conflict in settings file ${this._name}: ${message}`));
        const keys = Object.keys(raw);
        const overrides = this.toOverrides(raw, message => console.error(`Conflict in settings file ${this._name}: ${message}`));
        return { contents, keys, overrides, restricted: filtered.restricted, hasExcludedProperties: filtered.hasExcludedProperties };
    }
    filter(properties, configurationProperties, filterOverriddenProperties, options) {
        let hasExcludedProperties = false;
        if (!(options === null || options === void 0 ? void 0 : options.scopes) && !(options === null || options === void 0 ? void 0 : options.skipRestricted)) {
            return { raw: properties, restricted: [], hasExcludedProperties };
        }
        const raw = {};
        const restricted = [];
        for (const key in properties) {
            if (OVERRIDE_PROPERTY_REGEX.test(key) && filterOverriddenProperties) {
                const result = this.filter(properties[key], configurationProperties, false, options);
                raw[key] = result.raw;
                hasExcludedProperties = hasExcludedProperties || result.hasExcludedProperties;
                restricted.push(...result.restricted);
            }
            else {
                const propertySchema = configurationProperties[key];
                const scope = propertySchema ? typeof propertySchema.scope !== 'undefined' ? propertySchema.scope : 3 /* ConfigurationScope.WINDOW */ : undefined;
                if (propertySchema === null || propertySchema === void 0 ? void 0 : propertySchema.restricted) {
                    restricted.push(key);
                }
                // Load unregistered configurations always.
                if ((scope === undefined || options.scopes === undefined || options.scopes.includes(scope)) // Check scopes
                    && !(options.skipRestricted && (propertySchema === null || propertySchema === void 0 ? void 0 : propertySchema.restricted))) { // Check restricted
                    raw[key] = properties[key];
                }
                else {
                    hasExcludedProperties = true;
                }
            }
        }
        return { raw, restricted, hasExcludedProperties };
    }
    toOverrides(raw, conflictReporter) {
        const overrides = [];
        for (const key of Object.keys(raw)) {
            if (OVERRIDE_PROPERTY_REGEX.test(key)) {
                const overrideRaw = {};
                for (const keyInOverrideRaw in raw[key]) {
                    overrideRaw[keyInOverrideRaw] = raw[key][keyInOverrideRaw];
                }
                overrides.push({
                    identifiers: overrideIdentifiersFromKey(key),
                    keys: Object.keys(overrideRaw),
                    contents: toValuesTree(overrideRaw, conflictReporter)
                });
            }
        }
        return overrides;
    }
}
class ConfigurationInspectValue {
    constructor(key, overrides, _value, overrideIdentifiers, defaultConfiguration, policyConfiguration, applicationConfiguration, userConfiguration, localUserConfiguration, remoteUserConfiguration, workspaceConfiguration, folderConfigurationModel, memoryConfigurationModel) {
        this.key = key;
        this.overrides = overrides;
        this._value = _value;
        this.overrideIdentifiers = overrideIdentifiers;
        this.defaultConfiguration = defaultConfiguration;
        this.policyConfiguration = policyConfiguration;
        this.applicationConfiguration = applicationConfiguration;
        this.userConfiguration = userConfiguration;
        this.localUserConfiguration = localUserConfiguration;
        this.remoteUserConfiguration = remoteUserConfiguration;
        this.workspaceConfiguration = workspaceConfiguration;
        this.folderConfigurationModel = folderConfigurationModel;
        this.memoryConfigurationModel = memoryConfigurationModel;
    }
    inspect(model, section, overrideIdentifier) {
        const inspectValue = model.inspect(section, overrideIdentifier);
        return {
            get value() { return freeze(inspectValue.value); },
            get override() { return freeze(inspectValue.override); },
            get merged() { return freeze(inspectValue.merged); }
        };
    }
    get userInspectValue() {
        if (!this._userInspectValue) {
            this._userInspectValue = this.inspect(this.userConfiguration, this.key, this.overrides.overrideIdentifier);
        }
        return this._userInspectValue;
    }
    get user() {
        return this.userInspectValue.value !== undefined || this.userInspectValue.override !== undefined ? { value: this.userInspectValue.value, override: this.userInspectValue.override } : undefined;
    }
}
export class Configuration {
    constructor(_defaultConfiguration, _policyConfiguration, _applicationConfiguration, _localUserConfiguration, _remoteUserConfiguration = new ConfigurationModel(), _workspaceConfiguration = new ConfigurationModel(), _folderConfigurations = new ResourceMap(), _memoryConfiguration = new ConfigurationModel(), _memoryConfigurationByResource = new ResourceMap()) {
        this._defaultConfiguration = _defaultConfiguration;
        this._policyConfiguration = _policyConfiguration;
        this._applicationConfiguration = _applicationConfiguration;
        this._localUserConfiguration = _localUserConfiguration;
        this._remoteUserConfiguration = _remoteUserConfiguration;
        this._workspaceConfiguration = _workspaceConfiguration;
        this._folderConfigurations = _folderConfigurations;
        this._memoryConfiguration = _memoryConfiguration;
        this._memoryConfigurationByResource = _memoryConfigurationByResource;
        this._workspaceConsolidatedConfiguration = null;
        this._foldersConsolidatedConfigurations = new ResourceMap();
        this._userConfiguration = null;
    }
    getValue(section, overrides, workspace) {
        const consolidateConfigurationModel = this.getConsolidatedConfigurationModel(section, overrides, workspace);
        return consolidateConfigurationModel.getValue(section);
    }
    updateValue(key, value, overrides = {}) {
        let memoryConfiguration;
        if (overrides.resource) {
            memoryConfiguration = this._memoryConfigurationByResource.get(overrides.resource);
            if (!memoryConfiguration) {
                memoryConfiguration = new ConfigurationModel();
                this._memoryConfigurationByResource.set(overrides.resource, memoryConfiguration);
            }
        }
        else {
            memoryConfiguration = this._memoryConfiguration;
        }
        if (value === undefined) {
            memoryConfiguration.removeValue(key);
        }
        else {
            memoryConfiguration.setValue(key, value);
        }
        if (!overrides.resource) {
            this._workspaceConsolidatedConfiguration = null;
        }
    }
    inspect(key, overrides, workspace) {
        const consolidateConfigurationModel = this.getConsolidatedConfigurationModel(key, overrides, workspace);
        const folderConfigurationModel = this.getFolderConfigurationModelForResource(overrides.resource, workspace);
        const memoryConfigurationModel = overrides.resource ? this._memoryConfigurationByResource.get(overrides.resource) || this._memoryConfiguration : this._memoryConfiguration;
        const overrideIdentifiers = new Set();
        for (const override of consolidateConfigurationModel.overrides) {
            for (const overrideIdentifier of override.identifiers) {
                if (consolidateConfigurationModel.getOverrideValue(key, overrideIdentifier) !== undefined) {
                    overrideIdentifiers.add(overrideIdentifier);
                }
            }
        }
        return new ConfigurationInspectValue(key, overrides, consolidateConfigurationModel.getValue(key), overrideIdentifiers.size ? [...overrideIdentifiers] : undefined, this._defaultConfiguration, this._policyConfiguration.isEmpty() ? undefined : this._policyConfiguration, this.applicationConfiguration.isEmpty() ? undefined : this.applicationConfiguration, this.userConfiguration, this.localUserConfiguration, this.remoteUserConfiguration, workspace ? this._workspaceConfiguration : undefined, folderConfigurationModel ? folderConfigurationModel : undefined, memoryConfigurationModel);
    }
    get applicationConfiguration() {
        return this._applicationConfiguration;
    }
    get userConfiguration() {
        if (!this._userConfiguration) {
            this._userConfiguration = this._remoteUserConfiguration.isEmpty() ? this._localUserConfiguration : this._localUserConfiguration.merge(this._remoteUserConfiguration);
        }
        return this._userConfiguration;
    }
    get localUserConfiguration() {
        return this._localUserConfiguration;
    }
    get remoteUserConfiguration() {
        return this._remoteUserConfiguration;
    }
    getConsolidatedConfigurationModel(section, overrides, workspace) {
        let configurationModel = this.getConsolidatedConfigurationModelForResource(overrides, workspace);
        if (overrides.overrideIdentifier) {
            configurationModel = configurationModel.override(overrides.overrideIdentifier);
        }
        if (!this._policyConfiguration.isEmpty() && this._policyConfiguration.getValue(section) !== undefined) {
            configurationModel = configurationModel.merge(this._policyConfiguration);
        }
        return configurationModel;
    }
    getConsolidatedConfigurationModelForResource({ resource }, workspace) {
        let consolidateConfiguration = this.getWorkspaceConsolidatedConfiguration();
        if (workspace && resource) {
            const root = workspace.getFolder(resource);
            if (root) {
                consolidateConfiguration = this.getFolderConsolidatedConfiguration(root.uri) || consolidateConfiguration;
            }
            const memoryConfigurationForResource = this._memoryConfigurationByResource.get(resource);
            if (memoryConfigurationForResource) {
                consolidateConfiguration = consolidateConfiguration.merge(memoryConfigurationForResource);
            }
        }
        return consolidateConfiguration;
    }
    getWorkspaceConsolidatedConfiguration() {
        if (!this._workspaceConsolidatedConfiguration) {
            this._workspaceConsolidatedConfiguration = this._defaultConfiguration.merge(this.applicationConfiguration, this.userConfiguration, this._workspaceConfiguration, this._memoryConfiguration);
        }
        return this._workspaceConsolidatedConfiguration;
    }
    getFolderConsolidatedConfiguration(folder) {
        let folderConsolidatedConfiguration = this._foldersConsolidatedConfigurations.get(folder);
        if (!folderConsolidatedConfiguration) {
            const workspaceConsolidateConfiguration = this.getWorkspaceConsolidatedConfiguration();
            const folderConfiguration = this._folderConfigurations.get(folder);
            if (folderConfiguration) {
                folderConsolidatedConfiguration = workspaceConsolidateConfiguration.merge(folderConfiguration);
                this._foldersConsolidatedConfigurations.set(folder, folderConsolidatedConfiguration);
            }
            else {
                folderConsolidatedConfiguration = workspaceConsolidateConfiguration;
            }
        }
        return folderConsolidatedConfiguration;
    }
    getFolderConfigurationModelForResource(resource, workspace) {
        if (workspace && resource) {
            const root = workspace.getFolder(resource);
            if (root) {
                return this._folderConfigurations.get(root.uri);
            }
        }
        return undefined;
    }
    toData() {
        return {
            defaults: {
                contents: this._defaultConfiguration.contents,
                overrides: this._defaultConfiguration.overrides,
                keys: this._defaultConfiguration.keys
            },
            policy: {
                contents: this._policyConfiguration.contents,
                overrides: this._policyConfiguration.overrides,
                keys: this._policyConfiguration.keys
            },
            application: {
                contents: this.applicationConfiguration.contents,
                overrides: this.applicationConfiguration.overrides,
                keys: this.applicationConfiguration.keys
            },
            user: {
                contents: this.userConfiguration.contents,
                overrides: this.userConfiguration.overrides,
                keys: this.userConfiguration.keys
            },
            workspace: {
                contents: this._workspaceConfiguration.contents,
                overrides: this._workspaceConfiguration.overrides,
                keys: this._workspaceConfiguration.keys
            },
            folders: [...this._folderConfigurations.keys()].reduce((result, folder) => {
                const { contents, overrides, keys } = this._folderConfigurations.get(folder);
                result.push([folder, { contents, overrides, keys }]);
                return result;
            }, [])
        };
    }
    static parse(data) {
        const defaultConfiguration = this.parseConfigurationModel(data.defaults);
        const policyConfiguration = this.parseConfigurationModel(data.policy);
        const applicationConfiguration = this.parseConfigurationModel(data.application);
        const userConfiguration = this.parseConfigurationModel(data.user);
        const workspaceConfiguration = this.parseConfigurationModel(data.workspace);
        const folders = data.folders.reduce((result, value) => {
            result.set(URI.revive(value[0]), this.parseConfigurationModel(value[1]));
            return result;
        }, new ResourceMap());
        return new Configuration(defaultConfiguration, policyConfiguration, applicationConfiguration, userConfiguration, new ConfigurationModel(), workspaceConfiguration, folders, new ConfigurationModel(), new ResourceMap());
    }
    static parseConfigurationModel(model) {
        return new ConfigurationModel(model.contents, model.keys, model.overrides);
    }
}
export class ConfigurationChangeEvent {
    constructor(change, previous, currentConfiguraiton, currentWorkspace) {
        this.change = change;
        this.previous = previous;
        this.currentConfiguraiton = currentConfiguraiton;
        this.currentWorkspace = currentWorkspace;
        this._marker = '\n';
        this._markerCode1 = this._marker.charCodeAt(0);
        this._markerCode2 = '.'.charCodeAt(0);
        this.affectedKeys = new Set();
        this._previousConfiguration = undefined;
        for (const key of change.keys) {
            this.affectedKeys.add(key);
        }
        for (const [, keys] of change.overrides) {
            for (const key of keys) {
                this.affectedKeys.add(key);
            }
        }
        // Example: '\nfoo.bar\nabc.def\n'
        this._affectsConfigStr = this._marker;
        for (const key of this.affectedKeys) {
            this._affectsConfigStr += key + this._marker;
        }
    }
    get previousConfiguration() {
        if (!this._previousConfiguration && this.previous) {
            this._previousConfiguration = Configuration.parse(this.previous.data);
        }
        return this._previousConfiguration;
    }
    affectsConfiguration(section, overrides) {
        var _a;
        // we have one large string with all keys that have changed. we pad (marker) the section
        // and check that either find it padded or before a segment character
        const needle = this._marker + section;
        const idx = this._affectsConfigStr.indexOf(needle);
        if (idx < 0) {
            // NOT: (marker + section)
            return false;
        }
        const pos = idx + needle.length;
        if (pos >= this._affectsConfigStr.length) {
            return false;
        }
        const code = this._affectsConfigStr.charCodeAt(pos);
        if (code !== this._markerCode1 && code !== this._markerCode2) {
            // NOT: section + (marker | segment)
            return false;
        }
        if (overrides) {
            const value1 = this.previousConfiguration ? this.previousConfiguration.getValue(section, overrides, (_a = this.previous) === null || _a === void 0 ? void 0 : _a.workspace) : undefined;
            const value2 = this.currentConfiguraiton.getValue(section, overrides, this.currentWorkspace);
            return !objects.equals(value1, value2);
        }
        return true;
    }
}
