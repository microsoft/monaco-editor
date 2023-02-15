import BaseSeverity from '../../../base/common/severity.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
export var Severity = BaseSeverity;
export const INotificationService = createDecorator('notificationService');
export class NoOpNotification {
}
