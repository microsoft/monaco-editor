/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { distinct } from '../../../base/common/arrays.js';
import { Emitter } from '../../../base/common/event.js';
import * as types from '../../../base/common/types.js';
import * as nls from '../../../nls.js';
import { getLanguageTagSettingPlainKey } from './configuration.js';
import { Extensions as JSONExtensions } from '../../jsonschemas/common/jsonContributionRegistry.js';
import { Registry } from '../../registry/common/platform.js';
export const Extensions = {
    Configuration: 'base.contributions.configuration'
};
export const allSettings = { properties: {}, patternProperties: {} };
export const applicationSettings = { properties: {}, patternProperties: {} };
export const machineSettings = { properties: {}, patternProperties: {} };
export const machineOverridableSettings = { properties: {}, patternProperties: {} };
export const windowSettings = { properties: {}, patternProperties: {} };
export const resourceSettings = { properties: {}, patternProperties: {} };
export const resourceLanguageSettingsSchemaId = 'vscode://schemas/settings/resourceLanguage';
const contributionRegistry = Registry.as(JSONExtensions.JSONContribution);
class ConfigurationRegistry {
    constructor() {
        this.overrideIdentifiers = new Set();
        this._onDidSchemaChange = new Emitter();
        this._onDidUpdateConfiguration = new Emitter();
        this.configurationDefaultsOverrides = new Map();
        this.defaultLanguageConfigurationOverridesNode = {
            id: 'defaultOverrides',
            title: nls.localize('defaultLanguageConfigurationOverrides.title', "Default Language Configuration Overrides"),
            properties: {}
        };
        this.configurationContributors = [this.defaultLanguageConfigurationOverridesNode];
        this.resourceLanguageSettingsSchema = {
            properties: {},
            patternProperties: {},
            additionalProperties: true,
            allowTrailingCommas: true,
            allowComments: true
        };
        this.configurationProperties = {};
        this.policyConfigurations = new Map();
        this.excludedConfigurationProperties = {};
        contributionRegistry.registerSchema(resourceLanguageSettingsSchemaId, this.resourceLanguageSettingsSchema);
        this.registerOverridePropertyPatternKey();
    }
    registerConfiguration(configuration, validate = true) {
        this.registerConfigurations([configuration], validate);
    }
    registerConfigurations(configurations, validate = true) {
        const properties = new Set();
        this.doRegisterConfigurations(configurations, validate, properties);
        contributionRegistry.registerSchema(resourceLanguageSettingsSchemaId, this.resourceLanguageSettingsSchema);
        this._onDidSchemaChange.fire();
        this._onDidUpdateConfiguration.fire({ properties });
    }
    registerDefaultConfigurations(configurationDefaults) {
        const properties = new Set();
        this.doRegisterDefaultConfigurations(configurationDefaults, properties);
        this._onDidSchemaChange.fire();
        this._onDidUpdateConfiguration.fire({ properties, defaultsOverrides: true });
    }
    doRegisterDefaultConfigurations(configurationDefaults, bucket) {
        var _a;
        const overrideIdentifiers = [];
        for (const { overrides, source } of configurationDefaults) {
            for (const key in overrides) {
                bucket.add(key);
                if (OVERRIDE_PROPERTY_REGEX.test(key)) {
                    const configurationDefaultOverride = this.configurationDefaultsOverrides.get(key);
                    const valuesSources = (_a = configurationDefaultOverride === null || configurationDefaultOverride === void 0 ? void 0 : configurationDefaultOverride.valuesSources) !== null && _a !== void 0 ? _a : new Map();
                    if (source) {
                        for (const configuration of Object.keys(overrides[key])) {
                            valuesSources.set(configuration, source);
                        }
                    }
                    const defaultValue = Object.assign(Object.assign({}, ((configurationDefaultOverride === null || configurationDefaultOverride === void 0 ? void 0 : configurationDefaultOverride.value) || {})), overrides[key]);
                    this.configurationDefaultsOverrides.set(key, { source, value: defaultValue, valuesSources });
                    const plainKey = getLanguageTagSettingPlainKey(key);
                    const property = {
                        type: 'object',
                        default: defaultValue,
                        description: nls.localize('defaultLanguageConfiguration.description', "Configure settings to be overridden for the {0} language.", plainKey),
                        $ref: resourceLanguageSettingsSchemaId,
                        defaultDefaultValue: defaultValue,
                        source: types.isString(source) ? undefined : source,
                        defaultValueSource: source
                    };
                    overrideIdentifiers.push(...overrideIdentifiersFromKey(key));
                    this.configurationProperties[key] = property;
                    this.defaultLanguageConfigurationOverridesNode.properties[key] = property;
                }
                else {
                    this.configurationDefaultsOverrides.set(key, { value: overrides[key], source });
                    const property = this.configurationProperties[key];
                    if (property) {
                        this.updatePropertyDefaultValue(key, property);
                        this.updateSchema(key, property);
                    }
                }
            }
        }
        this.doRegisterOverrideIdentifiers(overrideIdentifiers);
    }
    registerOverrideIdentifiers(overrideIdentifiers) {
        this.doRegisterOverrideIdentifiers(overrideIdentifiers);
        this._onDidSchemaChange.fire();
    }
    doRegisterOverrideIdentifiers(overrideIdentifiers) {
        for (const overrideIdentifier of overrideIdentifiers) {
            this.overrideIdentifiers.add(overrideIdentifier);
        }
        this.updateOverridePropertyPatternKey();
    }
    doRegisterConfigurations(configurations, validate, bucket) {
        configurations.forEach(configuration => {
            this.validateAndRegisterProperties(configuration, validate, configuration.extensionInfo, configuration.restrictedProperties, undefined, bucket);
            this.configurationContributors.push(configuration);
            this.registerJSONConfiguration(configuration);
        });
    }
    validateAndRegisterProperties(configuration, validate = true, extensionInfo, restrictedProperties, scope = 3 /* ConfigurationScope.WINDOW */, bucket) {
        var _a;
        scope = types.isUndefinedOrNull(configuration.scope) ? scope : configuration.scope;
        const properties = configuration.properties;
        if (properties) {
            for (const key in properties) {
                const property = properties[key];
                if (validate && validateProperty(key, property)) {
                    delete properties[key];
                    continue;
                }
                property.source = extensionInfo;
                // update default value
                property.defaultDefaultValue = properties[key].default;
                this.updatePropertyDefaultValue(key, property);
                // update scope
                if (OVERRIDE_PROPERTY_REGEX.test(key)) {
                    property.scope = undefined; // No scope for overridable properties `[${identifier}]`
                }
                else {
                    property.scope = types.isUndefinedOrNull(property.scope) ? scope : property.scope;
                    property.restricted = types.isUndefinedOrNull(property.restricted) ? !!(restrictedProperties === null || restrictedProperties === void 0 ? void 0 : restrictedProperties.includes(key)) : property.restricted;
                }
                // Add to properties maps
                // Property is included by default if 'included' is unspecified
                if (properties[key].hasOwnProperty('included') && !properties[key].included) {
                    this.excludedConfigurationProperties[key] = properties[key];
                    delete properties[key];
                    continue;
                }
                else {
                    this.configurationProperties[key] = properties[key];
                    if ((_a = properties[key].policy) === null || _a === void 0 ? void 0 : _a.name) {
                        this.policyConfigurations.set(properties[key].policy.name, key);
                    }
                }
                if (!properties[key].deprecationMessage && properties[key].markdownDeprecationMessage) {
                    // If not set, default deprecationMessage to the markdown source
                    properties[key].deprecationMessage = properties[key].markdownDeprecationMessage;
                }
                bucket.add(key);
            }
        }
        const subNodes = configuration.allOf;
        if (subNodes) {
            for (const node of subNodes) {
                this.validateAndRegisterProperties(node, validate, extensionInfo, restrictedProperties, scope, bucket);
            }
        }
    }
    getConfigurationProperties() {
        return this.configurationProperties;
    }
    getPolicyConfigurations() {
        return this.policyConfigurations;
    }
    registerJSONConfiguration(configuration) {
        const register = (configuration) => {
            const properties = configuration.properties;
            if (properties) {
                for (const key in properties) {
                    this.updateSchema(key, properties[key]);
                }
            }
            const subNodes = configuration.allOf;
            subNodes === null || subNodes === void 0 ? void 0 : subNodes.forEach(register);
        };
        register(configuration);
    }
    updateSchema(key, property) {
        allSettings.properties[key] = property;
        switch (property.scope) {
            case 1 /* ConfigurationScope.APPLICATION */:
                applicationSettings.properties[key] = property;
                break;
            case 2 /* ConfigurationScope.MACHINE */:
                machineSettings.properties[key] = property;
                break;
            case 6 /* ConfigurationScope.MACHINE_OVERRIDABLE */:
                machineOverridableSettings.properties[key] = property;
                break;
            case 3 /* ConfigurationScope.WINDOW */:
                windowSettings.properties[key] = property;
                break;
            case 4 /* ConfigurationScope.RESOURCE */:
                resourceSettings.properties[key] = property;
                break;
            case 5 /* ConfigurationScope.LANGUAGE_OVERRIDABLE */:
                resourceSettings.properties[key] = property;
                this.resourceLanguageSettingsSchema.properties[key] = property;
                break;
        }
    }
    updateOverridePropertyPatternKey() {
        for (const overrideIdentifier of this.overrideIdentifiers.values()) {
            const overrideIdentifierProperty = `[${overrideIdentifier}]`;
            const resourceLanguagePropertiesSchema = {
                type: 'object',
                description: nls.localize('overrideSettings.defaultDescription', "Configure editor settings to be overridden for a language."),
                errorMessage: nls.localize('overrideSettings.errorMessage', "This setting does not support per-language configuration."),
                $ref: resourceLanguageSettingsSchemaId,
            };
            this.updatePropertyDefaultValue(overrideIdentifierProperty, resourceLanguagePropertiesSchema);
            allSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
            applicationSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
            machineSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
            machineOverridableSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
            windowSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
            resourceSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
        }
    }
    registerOverridePropertyPatternKey() {
        const resourceLanguagePropertiesSchema = {
            type: 'object',
            description: nls.localize('overrideSettings.defaultDescription', "Configure editor settings to be overridden for a language."),
            errorMessage: nls.localize('overrideSettings.errorMessage', "This setting does not support per-language configuration."),
            $ref: resourceLanguageSettingsSchemaId,
        };
        allSettings.patternProperties[OVERRIDE_PROPERTY_PATTERN] = resourceLanguagePropertiesSchema;
        applicationSettings.patternProperties[OVERRIDE_PROPERTY_PATTERN] = resourceLanguagePropertiesSchema;
        machineSettings.patternProperties[OVERRIDE_PROPERTY_PATTERN] = resourceLanguagePropertiesSchema;
        machineOverridableSettings.patternProperties[OVERRIDE_PROPERTY_PATTERN] = resourceLanguagePropertiesSchema;
        windowSettings.patternProperties[OVERRIDE_PROPERTY_PATTERN] = resourceLanguagePropertiesSchema;
        resourceSettings.patternProperties[OVERRIDE_PROPERTY_PATTERN] = resourceLanguagePropertiesSchema;
        this._onDidSchemaChange.fire();
    }
    updatePropertyDefaultValue(key, property) {
        const configurationdefaultOverride = this.configurationDefaultsOverrides.get(key);
        let defaultValue = configurationdefaultOverride === null || configurationdefaultOverride === void 0 ? void 0 : configurationdefaultOverride.value;
        let defaultSource = configurationdefaultOverride === null || configurationdefaultOverride === void 0 ? void 0 : configurationdefaultOverride.source;
        if (types.isUndefined(defaultValue)) {
            defaultValue = property.defaultDefaultValue;
            defaultSource = undefined;
        }
        if (types.isUndefined(defaultValue)) {
            defaultValue = getDefaultValue(property.type);
        }
        property.default = defaultValue;
        property.defaultValueSource = defaultSource;
    }
}
const OVERRIDE_IDENTIFIER_PATTERN = `\\[([^\\]]+)\\]`;
const OVERRIDE_IDENTIFIER_REGEX = new RegExp(OVERRIDE_IDENTIFIER_PATTERN, 'g');
export const OVERRIDE_PROPERTY_PATTERN = `^(${OVERRIDE_IDENTIFIER_PATTERN})+$`;
export const OVERRIDE_PROPERTY_REGEX = new RegExp(OVERRIDE_PROPERTY_PATTERN);
export function overrideIdentifiersFromKey(key) {
    const identifiers = [];
    if (OVERRIDE_PROPERTY_REGEX.test(key)) {
        let matches = OVERRIDE_IDENTIFIER_REGEX.exec(key);
        while (matches === null || matches === void 0 ? void 0 : matches.length) {
            const identifier = matches[1].trim();
            if (identifier) {
                identifiers.push(identifier);
            }
            matches = OVERRIDE_IDENTIFIER_REGEX.exec(key);
        }
    }
    return distinct(identifiers);
}
export function getDefaultValue(type) {
    const t = Array.isArray(type) ? type[0] : type;
    switch (t) {
        case 'boolean':
            return false;
        case 'integer':
        case 'number':
            return 0;
        case 'string':
            return '';
        case 'array':
            return [];
        case 'object':
            return {};
        default:
            return null;
    }
}
const configurationRegistry = new ConfigurationRegistry();
Registry.add(Extensions.Configuration, configurationRegistry);
export function validateProperty(property, schema) {
    var _a, _b, _c, _d;
    if (!property.trim()) {
        return nls.localize('config.property.empty', "Cannot register an empty property");
    }
    if (OVERRIDE_PROPERTY_REGEX.test(property)) {
        return nls.localize('config.property.languageDefault', "Cannot register '{0}'. This matches property pattern '\\\\[.*\\\\]$' for describing language specific editor settings. Use 'configurationDefaults' contribution.", property);
    }
    if (configurationRegistry.getConfigurationProperties()[property] !== undefined) {
        return nls.localize('config.property.duplicate', "Cannot register '{0}'. This property is already registered.", property);
    }
    if (((_a = schema.policy) === null || _a === void 0 ? void 0 : _a.name) && configurationRegistry.getPolicyConfigurations().get((_b = schema.policy) === null || _b === void 0 ? void 0 : _b.name) !== undefined) {
        return nls.localize('config.policy.duplicate', "Cannot register '{0}'. The associated policy {1} is already registered with {2}.", property, (_c = schema.policy) === null || _c === void 0 ? void 0 : _c.name, configurationRegistry.getPolicyConfigurations().get((_d = schema.policy) === null || _d === void 0 ? void 0 : _d.name));
    }
    return null;
}
