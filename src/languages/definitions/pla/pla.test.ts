/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('pla', [
	// Keywords
	// .i
	[
		{
			line: '.i 50',
			tokens: [
				{ startIndex: 0, type: 'keyword.i.pla' },
				{ startIndex: 2, type: '' },
				{ startIndex: 3, type: 'number.pla' }
			]
		},
		{
			line: '  .i 333 # Input',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'keyword.i.pla' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'number.pla' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'comment.pla' }
			]
		}
	],
	// .o
	[
		{
			line: '.o 7',
			tokens: [
				{ startIndex: 0, type: 'keyword.o.pla' },
				{ startIndex: 2, type: '' },
				{ startIndex: 3, type: 'number.pla' }
			]
		},
		{
			line: '	.o	1000 ',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'keyword.o.pla' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.pla' },
				{ startIndex: 8, type: '' }
			]
		}
	],
	// .mv
	[
		{
			line: '.mv 9 4 3 21 1',
			tokens: [
				{ startIndex: 0, type: 'keyword.mv.pla' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.pla' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'number.pla' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.pla' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.pla' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'number.pla' }
			]
		},
		{
			line: '.mv 22 22',
			tokens: [
				{ startIndex: 0, type: 'keyword.mv.pla' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.pla' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'number.pla' }
			]
		}
	],
	// .ilb
	[
		{
			line: '.ilb in1 in2 in3 in4 in5',
			tokens: [
				{ startIndex: 0, type: 'keyword.ilb.pla' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'identifier.pla' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.pla' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'identifier.pla' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'identifier.pla' },
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'identifier.pla' }
			]
		},
		{
			line: '.ilb input<0> input<1> input<2> input<3>',
			tokens: [
				{ startIndex: 0, type: 'keyword.ilb.pla' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'identifier.pla' },
				{ startIndex: 10, type: 'delimiter.angle.pla' },
				{ startIndex: 11, type: 'number.pla' },
				{ startIndex: 12, type: 'delimiter.angle.pla' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'identifier.pla' },
				{ startIndex: 19, type: 'delimiter.angle.pla' },
				{ startIndex: 20, type: 'number.pla' },
				{ startIndex: 21, type: 'delimiter.angle.pla' },
				{ startIndex: 22, type: '' },
				{ startIndex: 23, type: 'identifier.pla' },
				{ startIndex: 28, type: 'delimiter.angle.pla' },
				{ startIndex: 29, type: 'number.pla' },
				{ startIndex: 30, type: 'delimiter.angle.pla' },
				{ startIndex: 31, type: '' },
				{ startIndex: 32, type: 'identifier.pla' },
				{ startIndex: 37, type: 'delimiter.angle.pla' },
				{ startIndex: 38, type: 'number.pla' },
				{ startIndex: 39, type: 'delimiter.angle.pla' }
			]
		}
	],
	// .ob
	[
		{
			line: '.ob out1 out2 out3',
			tokens: [
				{ startIndex: 0, type: 'keyword.ob.pla' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.pla' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.pla' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'identifier.pla' }
			]
		},
		{
			line: '.ob output<0> output<1>',
			tokens: [
				{ startIndex: 0, type: 'keyword.ob.pla' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.pla' },
				{ startIndex: 10, type: 'delimiter.angle.pla' },
				{ startIndex: 11, type: 'number.pla' },
				{ startIndex: 12, type: 'delimiter.angle.pla' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'identifier.pla' },
				{ startIndex: 20, type: 'delimiter.angle.pla' },
				{ startIndex: 21, type: 'number.pla' },
				{ startIndex: 22, type: 'delimiter.angle.pla' }
			]
		}
	],
	// .label
	[
		{
			line: '.label in1 in2 in3 in4 in5',
			tokens: [
				{ startIndex: 0, type: 'keyword.label.pla' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.pla' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'identifier.pla' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'identifier.pla' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'identifier.pla' },
				{ startIndex: 22, type: '' },
				{ startIndex: 23, type: 'identifier.pla' }
			]
		},
		{
			line: '.label  var=5 part1 part2 part3 part4',
			tokens: [
				{ startIndex: 0, type: 'keyword.label.pla' },
				{ startIndex: 6, type: '' },
				{ startIndex: 8, type: 'identifier.pla' },
				{ startIndex: 11, type: 'delimiter.pla' },
				{ startIndex: 12, type: 'number.pla' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'identifier.pla' },
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'identifier.pla' },
				{ startIndex: 25, type: '' },
				{ startIndex: 26, type: 'identifier.pla' },
				{ startIndex: 31, type: '' },
				{ startIndex: 32, type: 'identifier.pla' }
			]
		}
	],
	// .type
	[
		{
			line: '.type fr',
			tokens: [
				{ startIndex: 0, type: 'keyword.type.pla' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'type.pla' }
			]
		},
		{
			line: '	.type	fdr	# Comment ',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'keyword.type.pla' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'type.pla' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'comment.pla' }
			]
		},
		{
			line: '.type other',
			tokens: [
				{ startIndex: 0, type: 'keyword.type.pla' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'type.pla' }
			]
		}
	],
	// .phase
	[
		{
			line: '.phase 010',
			tokens: [
				{ startIndex: 0, type: 'keyword.phase.pla' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'number.pla' }
			]
		}
	],
	// .pair
	[
		{
			line: '.pair 2 (aa bb) (cc dd) ## Comment',
			tokens: [
				{ startIndex: 0, type: 'keyword.pair.pla' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'number.pla' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'delimiter.parenthesis.pla' },
				{ startIndex: 9, type: 'identifier.pla' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'identifier.pla' },
				{ startIndex: 14, type: 'delimiter.parenthesis.pla' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'delimiter.parenthesis.pla' },
				{ startIndex: 17, type: 'identifier.pla' },
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'identifier.pla' },
				{ startIndex: 22, type: 'delimiter.parenthesis.pla' },
				{ startIndex: 23, type: '' },
				{ startIndex: 24, type: 'comment.pla' }
			]
		}
	],
	// .symbolic
	[
		{
			line: '.symbolic aa<2> aa<1> aa<0> ; BB CC DD ;',
			tokens: [
				{ startIndex: 0, type: 'keyword.symbolic.pla' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'identifier.pla' },
				{ startIndex: 12, type: 'delimiter.angle.pla' },
				{ startIndex: 13, type: 'number.pla' },
				{ startIndex: 14, type: 'delimiter.angle.pla' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'identifier.pla' },
				{ startIndex: 18, type: 'delimiter.angle.pla' },
				{ startIndex: 19, type: 'number.pla' },
				{ startIndex: 20, type: 'delimiter.angle.pla' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'identifier.pla' },
				{ startIndex: 24, type: 'delimiter.angle.pla' },
				{ startIndex: 25, type: 'number.pla' },
				{ startIndex: 26, type: 'delimiter.angle.pla' },
				{ startIndex: 27, type: '' },
				{ startIndex: 28, type: 'delimiter.pla' },
				{ startIndex: 29, type: '' },
				{ startIndex: 30, type: 'identifier.pla' },
				{ startIndex: 32, type: '' },
				{ startIndex: 33, type: 'identifier.pla' },
				{ startIndex: 35, type: '' },
				{ startIndex: 36, type: 'identifier.pla' },
				{ startIndex: 38, type: '' },
				{ startIndex: 39, type: 'delimiter.pla' }
			]
		},
		{
			line: '.symbolic state<3> state<2>;aaa bbb; # comment',
			tokens: [
				{ startIndex: 0, type: 'keyword.symbolic.pla' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'identifier.pla' },
				{ startIndex: 15, type: 'delimiter.angle.pla' },
				{ startIndex: 16, type: 'number.pla' },
				{ startIndex: 17, type: 'delimiter.angle.pla' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'identifier.pla' },
				{ startIndex: 24, type: 'delimiter.angle.pla' },
				{ startIndex: 25, type: 'number.pla' },
				{ startIndex: 26, type: 'delimiter.angle.pla' },
				{ startIndex: 27, type: 'delimiter.pla' },
				{ startIndex: 28, type: 'identifier.pla' },
				{ startIndex: 31, type: '' },
				{ startIndex: 32, type: 'identifier.pla' },
				{ startIndex: 35, type: 'delimiter.pla' },
				{ startIndex: 36, type: '' },
				{ startIndex: 37, type: 'comment.pla' }
			]
		}
	],
	// .symbolic-output
	[
		{
			line: '.symbolic-output out<2> out<1> out<0> ; signal_a signal_b signal_c ;',
			tokens: [
				{ startIndex: 0, type: 'keyword.symbolic-output.pla' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'identifier.pla' },
				{ startIndex: 20, type: 'delimiter.angle.pla' },
				{ startIndex: 21, type: 'number.pla' },
				{ startIndex: 22, type: 'delimiter.angle.pla' },
				{ startIndex: 23, type: '' },
				{ startIndex: 24, type: 'identifier.pla' },
				{ startIndex: 27, type: 'delimiter.angle.pla' },
				{ startIndex: 28, type: 'number.pla' },
				{ startIndex: 29, type: 'delimiter.angle.pla' },
				{ startIndex: 30, type: '' },
				{ startIndex: 31, type: 'identifier.pla' },
				{ startIndex: 34, type: 'delimiter.angle.pla' },
				{ startIndex: 35, type: 'number.pla' },
				{ startIndex: 36, type: 'delimiter.angle.pla' },
				{ startIndex: 37, type: '' },
				{ startIndex: 38, type: 'delimiter.pla' },
				{ startIndex: 39, type: '' },
				{ startIndex: 40, type: 'identifier.pla' },
				{ startIndex: 48, type: '' },
				{ startIndex: 49, type: 'identifier.pla' },
				{ startIndex: 57, type: '' },
				{ startIndex: 58, type: 'identifier.pla' },
				{ startIndex: 66, type: '' },
				{ startIndex: 67, type: 'delimiter.pla' }
			]
		}
	],
	// .kiss
	[
		{
			line: '.kiss #.kiss',
			tokens: [
				{ startIndex: 0, type: 'keyword.kiss.pla' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'comment.pla' }
			]
		}
	],
	// .p
	[
		{
			line: '.p 400',
			tokens: [
				{ startIndex: 0, type: 'keyword.p.pla' },
				{ startIndex: 2, type: '' },
				{ startIndex: 3, type: 'number.pla' }
			]
		}
	],
	// .e
	[
		{
			line: '	.e	',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'keyword.e.pla' },
				{ startIndex: 3, type: '' }
			]
		}
	],
	// PLA rows
	[
		{
			line: '0-010|1000|100000000000000000000000000|0010000000',
			tokens: [{ startIndex: 0, type: 'string.pla' }]
		},
		{
			line: '--------------0 00000000000010',
			tokens: [
				{ startIndex: 0, type: 'string.pla' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'string.pla' }
			]
		},
		{
			line: '0~~0 1-0	# Comment',
			tokens: [
				{ startIndex: 0, type: 'string.pla' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'string.pla' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'comment.pla' }
			]
		}
	],
	// Full example #1
	[
		{
			line: '.i 4',
			tokens: [
				{ startIndex: 0, type: 'keyword.i.pla' },
				{ startIndex: 2, type: '' },
				{ startIndex: 3, type: 'number.pla' }
			]
		},
		{
			line: '.o 3',
			tokens: [
				{ startIndex: 0, type: 'keyword.o.pla' },
				{ startIndex: 2, type: '' },
				{ startIndex: 3, type: 'number.pla' }
			]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: '# Comment only line',
			tokens: [{ startIndex: 0, type: 'comment.pla' }]
		},
		{
			line: '.ilb Q1 Q0 D N',
			tokens: [
				{ startIndex: 0, type: 'keyword.ilb.pla' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'identifier.pla' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'identifier.pla' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'identifier.pla' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'identifier.pla' }
			]
		},
		{
			line: '.ob T1 T0 input_1',
			tokens: [
				{ startIndex: 0, type: 'keyword.ob.pla' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.pla' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'identifier.pla' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'identifier.pla' }
			]
		},
		{
			line: '.p 5',
			tokens: [
				{ startIndex: 0, type: 'keyword.p.pla' },
				{ startIndex: 2, type: '' },
				{ startIndex: 3, type: 'number.pla' }
			]
		},
		{
			line: '0--- 100',
			tokens: [
				{ startIndex: 0, type: 'string.pla' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'string.pla' }
			]
		},
		{
			line: '1-1- 010',
			tokens: [
				{ startIndex: 0, type: 'string.pla' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'string.pla' }
			]
		},
		{
			line: '.e',
			tokens: [{ startIndex: 0, type: 'keyword.e.pla' }]
		}
	],
	// Full example #2
	[
		{
			line: '.mv 8 5 -10 -10 6',
			tokens: [
				{ startIndex: 0, type: 'keyword.mv.pla' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.pla' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'number.pla' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'number.pla' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'number.pla' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'number.pla' }
			]
		},
		{
			line: '.ilb in1 in0 wait ack nack',
			tokens: [
				{ startIndex: 0, type: 'keyword.ilb.pla' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'identifier.pla' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.pla' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'identifier.pla' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'identifier.pla' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'identifier.pla' }
			]
		},
		{
			line: '.ob wait wait2 in3 pending ack delay',
			tokens: [
				{ startIndex: 0, type: 'keyword.ob.pla' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.pla' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.pla' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'identifier.pla' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'identifier.pla' },
				{ startIndex: 26, type: '' },
				{ startIndex: 27, type: 'identifier.pla' },
				{ startIndex: 30, type: '' },
				{ startIndex: 31, type: 'identifier.pla' }
			]
		},
		{
			line: '.type fr',
			tokens: [
				{ startIndex: 0, type: 'keyword.type.pla' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'type.pla' }
			]
		},
		{
			line: '.kiss',
			tokens: [{ startIndex: 0, type: 'keyword.kiss.pla' }]
		},
		{
			line: '--1--     -        wait     110000',
			tokens: [
				{ startIndex: 0, type: 'string.pla' },
				{ startIndex: 5, type: '' },
				{ startIndex: 10, type: 'string.pla' },
				{ startIndex: 11, type: '' },
				{ startIndex: 19, type: 'identifier.pla' },
				{ startIndex: 23, type: '' },
				{ startIndex: 28, type: 'string.pla' }
			]
		},
		{
			line: '--1--     wait    wait2     110000 # row comment',
			tokens: [
				{ startIndex: 0, type: 'string.pla' },
				{ startIndex: 5, type: '' },
				{ startIndex: 10, type: 'identifier.pla' },
				{ startIndex: 14, type: '' },
				{ startIndex: 18, type: 'identifier.pla' },
				{ startIndex: 23, type: '' },
				{ startIndex: 28, type: 'string.pla' },
				{ startIndex: 34, type: '' },
				{ startIndex: 35, type: 'comment.pla' }
			]
		},
		{
			line: '--0-1     delay    ack     101000',
			tokens: [
				{ startIndex: 0, type: 'string.pla' },
				{ startIndex: 5, type: '' },
				{ startIndex: 10, type: 'identifier.pla' },
				{ startIndex: 15, type: '' },
				{ startIndex: 19, type: 'identifier.pla' },
				{ startIndex: 22, type: '' },
				{ startIndex: 27, type: 'string.pla' }
			]
		},
		{
			line: '.end',
			tokens: [{ startIndex: 0, type: 'keyword.end.pla' }]
		}
	]
]);
