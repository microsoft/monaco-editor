import { Emitter } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
export const ILogService = createDecorator('logService');
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Off"] = 0] = "Off";
    LogLevel[LogLevel["Trace"] = 1] = "Trace";
    LogLevel[LogLevel["Debug"] = 2] = "Debug";
    LogLevel[LogLevel["Info"] = 3] = "Info";
    LogLevel[LogLevel["Warning"] = 4] = "Warning";
    LogLevel[LogLevel["Error"] = 5] = "Error";
})(LogLevel || (LogLevel = {}));
export const DEFAULT_LOG_LEVEL = LogLevel.Info;
export class AbstractLogger extends Disposable {
    constructor() {
        super(...arguments);
        this.level = DEFAULT_LOG_LEVEL;
        this._onDidChangeLogLevel = this._register(new Emitter());
        this.onDidChangeLogLevel = this._onDidChangeLogLevel.event;
    }
    setLevel(level) {
        if (this.level !== level) {
            this.level = level;
            this._onDidChangeLogLevel.fire(this.level);
        }
    }
    getLevel() {
        return this.level;
    }
    checkLogLevel(level) {
        return this.level !== LogLevel.Off && this.level <= level;
    }
}
export class ConsoleLogger extends AbstractLogger {
    constructor(logLevel = DEFAULT_LOG_LEVEL) {
        super();
        this.setLevel(logLevel);
    }
    trace(message, ...args) {
        if (this.checkLogLevel(LogLevel.Trace)) {
            console.log('%cTRACE', 'color: #888', message, ...args);
        }
    }
    debug(message, ...args) {
        if (this.checkLogLevel(LogLevel.Debug)) {
            console.log('%cDEBUG', 'background: #eee; color: #888', message, ...args);
        }
    }
    info(message, ...args) {
        if (this.checkLogLevel(LogLevel.Info)) {
            console.log('%c INFO', 'color: #33f', message, ...args);
        }
    }
    error(message, ...args) {
        if (this.checkLogLevel(LogLevel.Error)) {
            console.log('%c  ERR', 'color: #f33', message, ...args);
        }
    }
    dispose() {
        // noop
    }
}
export class MultiplexLogger extends AbstractLogger {
    constructor(loggers) {
        super();
        this.loggers = loggers;
        if (loggers.length) {
            this.setLevel(loggers[0].getLevel());
        }
    }
    setLevel(level) {
        for (const logger of this.loggers) {
            logger.setLevel(level);
        }
        super.setLevel(level);
    }
    trace(message, ...args) {
        for (const logger of this.loggers) {
            logger.trace(message, ...args);
        }
    }
    debug(message, ...args) {
        for (const logger of this.loggers) {
            logger.debug(message, ...args);
        }
    }
    info(message, ...args) {
        for (const logger of this.loggers) {
            logger.info(message, ...args);
        }
    }
    error(message, ...args) {
        for (const logger of this.loggers) {
            logger.error(message, ...args);
        }
    }
    dispose() {
        for (const logger of this.loggers) {
            logger.dispose();
        }
    }
}
