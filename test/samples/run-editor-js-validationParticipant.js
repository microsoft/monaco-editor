define([
	'vs/base/common/severity'
], function(severity) {
	'use strict';
	function ValidateParticipant() {

	}

	ValidateParticipant.ID = 'doc.validateParticipant';
	ValidateParticipant.prototype.validate = function(mirrorModel, markerService) {

		var marker = {
			severity: severity.Error,
			message: [
				{ isText: true, text: '\u2188 ' },
				{ tagName: 'span', style: 'color:red', text: 'I AM' },
				{ isText: true, text: ' A VALIDATION PARTICIPANT \u2188' }
			],
			startLineNumber: 1,
			startColumn: 1,
			endLineNumber: 1,
			endColumn: 3
		};

		markerService.changeOne(ValidateParticipant.ID, mirrorModel.getAssociatedResource(), [marker]);
	};
	return {
		ValidateParticipant: ValidateParticipant
	};
});