/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('hcl', [
	/*
    // Foo
    /* Bar */
	/*
    /*
    Baz
    *\/
    # Another

    # Multiple
    # Lines
    foo = "bar"
    */
	[
		{
			line: '// Foo',
			tokens: [{ startIndex: 0, type: 'comment.hcl' }]
		},
		{
			line: '/* Bar */',
			tokens: [{ startIndex: 0, type: 'comment.hcl' }]
		},
		{
			line: '/*',
			tokens: [{ startIndex: 0, type: 'comment.hcl' }]
		},
		{
			line: '/*',
			tokens: [{ startIndex: 0, type: 'comment.hcl' }]
		},
		{
			line: 'Baz',
			tokens: [{ startIndex: 0, type: 'comment.hcl' }]
		},
		{
			line: '*/',
			tokens: [{ startIndex: 0, type: 'comment.hcl' }]
		},
		{
			line: '# Another',
			tokens: [{ startIndex: 0, type: 'comment.hcl' }]
		},
		{
			line: '',
			tokens: []
		},
		{
			line: '# Multiple',
			tokens: [{ startIndex: 0, type: 'comment.hcl' }]
		},
		{
			line: '# Lines',
			tokens: [{ startIndex: 0, type: 'comment.hcl' }]
		},
		{
			line: 'foo = "bar"',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operator.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'string.hcl' }
			]
		}
	],

	[
		{
			line: '',
			tokens: []
		}
	],

	/*
    foo = [
        "1",
        "2", # comment
    ]
    */
	[
		{
			line: 'foo = [',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operator.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.square.hcl' }
			]
		},
		{
			line: '"1",',
			tokens: [
				{ startIndex: 0, type: 'string.hcl' },
				{ startIndex: 3, type: 'delimiter.hcl' }
			]
		},
		{
			line: '"2", # comment',
			tokens: [
				{ startIndex: 0, type: 'string.hcl' },
				{ startIndex: 3, type: 'delimiter.hcl' },
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'comment.hcl' }
			]
		},
		{
			line: ']',
			tokens: [{ startIndex: 0, type: 'delimiter.square.hcl' }]
		}
	],

	/*
    resource = [{
    "foo": {
        "bar": {},
        "baz": [1, 2, "foo"],
        }
    }]
    */
	[
		{
			line: 'resource = [{',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'operator.hcl' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'delimiter.square.hcl' },
				{ startIndex: 12, type: 'delimiter.curly.hcl' }
			]
		},
		{
			line: '"foo": {',
			tokens: [
				{ startIndex: 0, type: 'string.hcl' },
				{ startIndex: 5, type: 'operator.hcl' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'delimiter.curly.hcl' }
			]
		},
		{
			line: '"bar": {},',
			tokens: [
				{ startIndex: 0, type: 'string.hcl' },
				{ startIndex: 5, type: 'operator.hcl' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'delimiter.curly.hcl' },
				{ startIndex: 9, type: 'delimiter.hcl' }
			]
		},
		{
			line: '"baz": [1, 2, "foo"],',
			tokens: [
				{ startIndex: 0, type: 'string.hcl' },
				{ startIndex: 5, type: 'operator.hcl' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'delimiter.square.hcl' },
				{ startIndex: 8, type: 'number.hcl' },
				{ startIndex: 9, type: 'delimiter.hcl' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'number.hcl' },
				{ startIndex: 12, type: 'delimiter.hcl' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'string.hcl' },
				{ startIndex: 19, type: 'delimiter.square.hcl' },
				{ startIndex: 20, type: 'delimiter.hcl' }
			]
		},
		{
			line: '}',
			tokens: [{ startIndex: 0, type: 'delimiter.curly.hcl' }]
		},
		{
			line: '}]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.curly.hcl' },
				{ startIndex: 1, type: 'delimiter.square.hcl' }
			]
		}
	],

	/*
    variable "foo" {
        default = "bar"
        description = "bar"
    }
    */
	[
		{
			line: 'variable "foo" {',
			tokens: [
				{ startIndex: 0, type: 'type.hcl' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'string.hcl' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'delimiter.curly.hcl' }
			]
		},
		{
			line: '  default = "bar"',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'variable.hcl' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'operator.hcl' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'string.hcl' }
			]
		},
		{
			line: '  description = "bar"',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'variable.hcl' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'operator.hcl' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'string.hcl' }
			]
		},
		{
			line: '}',
			tokens: [{ startIndex: 0, type: 'delimiter.curly.hcl' }]
		}
	],
	[
		{
			line: 'provider "aws" {',
			tokens: [
				{ startIndex: 0, type: 'type.hcl' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'string.hcl' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'delimiter.curly.hcl' }
			]
		}
	],
	/*
    provider "do" {
        api_key = "${var.foo}"
    }
    */
	[
		{
			line: 'provider "do" {',
			tokens: [
				{ startIndex: 0, type: 'type.hcl' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'string.hcl' },
				{ startIndex: 13, type: '' },
				{ startIndex: 14, type: 'delimiter.curly.hcl' }
			]
		},
		{
			line: '  api_key = "${var.foo}"',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'variable.hcl' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'operator.hcl' },
				{ startIndex: 11, type: '' },
				{ startIndex: 12, type: 'string.hcl' },
				{ startIndex: 13, type: 'delimiter.hcl' },
				{ startIndex: 15, type: 'keyword.var.hcl' },
				{ startIndex: 18, type: 'delimiter.hcl' },
				{ startIndex: 19, type: 'variable.hcl' },
				{ startIndex: 22, type: 'delimiter.hcl' },
				{ startIndex: 23, type: 'string.hcl' }
			]
		},
		{
			line: '}',
			tokens: [{ startIndex: 0, type: 'delimiter.curly.hcl' }]
		}
	],
	/*
    resource "aws_security_group" "firewall" {
        count = 5
    }
    */
	[
		{
			line: 'resource "aws_security_group" "firewall" {',
			tokens: [
				{ startIndex: 0, type: 'type.hcl' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'string.hcl' },
				{ startIndex: 29, type: '' },
				{ startIndex: 30, type: 'string.hcl' },
				{ startIndex: 40, type: '' },
				{ startIndex: 41, type: 'delimiter.curly.hcl' }
			]
		},
		{
			line: '  count = 5',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'variable.hcl' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'operator.hcl' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.hcl' }
			]
		},
		{
			line: '}',
			tokens: [{ startIndex: 0, type: 'delimiter.curly.hcl' }]
		}
	],
	[
		{
			line: 'resource aws_security_group firewall {',
			tokens: [
				{ startIndex: 0, type: 'type.hcl' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'string.hcl' },
				{ startIndex: 27, type: '' },
				{ startIndex: 28, type: 'string.hcl' },
				{ startIndex: 36, type: '' },
				{ startIndex: 37, type: 'delimiter.curly.hcl' }
			]
		}
	],
	[
		{
			line: 'resource "aws_security_group" firewall {',
			tokens: [
				{ startIndex: 0, type: 'type.hcl' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'string.hcl' },
				{ startIndex: 29, type: '' },
				{ startIndex: 30, type: 'string.hcl' },
				{ startIndex: 38, type: '' },
				{ startIndex: 39, type: 'delimiter.curly.hcl' }
			]
		}
	],
	[
		{
			line: 'resource aws_security_group "firewall" {',
			tokens: [
				{ startIndex: 0, type: 'type.hcl' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'string.hcl' },
				{ startIndex: 27, type: '' },
				{ startIndex: 28, type: 'string.hcl' },
				{ startIndex: 38, type: '' },
				{ startIndex: 39, type: 'delimiter.curly.hcl' }
			]
		}
	],
	/*
    resource aws_instance "web" {
        ami = "${var.foo}"
        security_groups = [
            "foo",
            "${aws_security_group.firewall.foo}"
        ]
        network_interface {
            device_index = 0
            description = "Main network interface"
        }
    }
    */
	[
		{
			line: 'resource aws_instance "web" {',
			tokens: [
				{ startIndex: 0, type: 'type.hcl' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'string.hcl' },
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'string.hcl' },
				{ startIndex: 27, type: '' },
				{ startIndex: 28, type: 'delimiter.curly.hcl' }
			]
		},
		{
			line: '  ami = "${var.foo}"',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'variable.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'operator.hcl' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'string.hcl' },
				{ startIndex: 9, type: 'delimiter.hcl' },
				{ startIndex: 11, type: 'keyword.var.hcl' },
				{ startIndex: 14, type: 'delimiter.hcl' },
				{ startIndex: 15, type: 'variable.hcl' },
				{ startIndex: 18, type: 'delimiter.hcl' },
				{ startIndex: 19, type: 'string.hcl' }
			]
		},
		{
			line: '  security_groups = [',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'variable.hcl' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'operator.hcl' },
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'delimiter.square.hcl' }
			]
		},
		{
			line: '    "foo",',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'string.hcl' },
				{ startIndex: 9, type: 'delimiter.hcl' }
			]
		},
		{
			line: '    "${aws_security_group.firewall.foo}"',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'string.hcl' },
				{ startIndex: 5, type: 'delimiter.hcl' },
				{ startIndex: 7, type: 'variable.hcl' },
				{ startIndex: 25, type: 'delimiter.hcl' },
				{ startIndex: 26, type: 'variable.hcl' },
				{ startIndex: 34, type: 'delimiter.hcl' },
				{ startIndex: 35, type: 'variable.hcl' },
				{ startIndex: 38, type: 'delimiter.hcl' },
				{ startIndex: 39, type: 'string.hcl' }
			]
		},
		{
			line: '  ]',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'delimiter.square.hcl' }
			]
		},
		{
			line: '  network_interface {',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'identifier.hcl' },
				{ startIndex: 20, type: 'delimiter.curly.hcl' }
			]
		},
		{
			line: '    device_index = 0',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'variable.hcl' },
				{ startIndex: 16, type: '' },
				{ startIndex: 17, type: 'operator.hcl' },
				{ startIndex: 18, type: '' },
				{ startIndex: 19, type: 'number.hcl' }
			]
		},
		{
			line: '    description = "Main network interface"',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'variable.hcl' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'operator.hcl' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'string.hcl' }
			]
		},
		{
			line: '  }',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'delimiter.curly.hcl' }
			]
		},
		{
			line: '}',
			tokens: [{ startIndex: 0, type: 'delimiter.curly.hcl' }]
		}
	],
	/*
    resource "aws_instance" "db" {
        security_groups = "${aws_security_group.firewall.*.id}"
        VPC = "foo"
        depends_on = ["aws_instance.web"]
    }
    */
	[
		{
			line: 'resource "aws_instance" "db" {',
			tokens: [
				{ startIndex: 0, type: 'type.hcl' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'string.hcl' },
				{ startIndex: 23, type: '' },
				{ startIndex: 24, type: 'string.hcl' },
				{ startIndex: 28, type: '' },
				{ startIndex: 29, type: 'delimiter.curly.hcl' }
			]
		},
		{
			line: '  security_groups = "${aws_security_group.firewall.*.id}"',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'variable.hcl' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'operator.hcl' },
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'string.hcl' },
				{ startIndex: 21, type: 'delimiter.hcl' },
				{ startIndex: 23, type: 'variable.hcl' },
				{ startIndex: 41, type: 'delimiter.hcl' },
				{ startIndex: 42, type: 'variable.hcl' },
				{ startIndex: 50, type: 'delimiter.hcl' },
				{ startIndex: 51, type: 'operator.hcl' },
				{ startIndex: 52, type: 'delimiter.hcl' },
				{ startIndex: 53, type: 'variable.hcl' },
				{ startIndex: 55, type: 'delimiter.hcl' },
				{ startIndex: 56, type: 'string.hcl' }
			]
		},
		{
			line: '  VPC = "foo"',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'variable.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'operator.hcl' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'string.hcl' }
			]
		},
		{
			line: '  depends_on = ["aws_instance.web"]',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'variable.hcl' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'operator.hcl' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'delimiter.square.hcl' },
				{ startIndex: 16, type: 'string.hcl' },
				{ startIndex: 34, type: 'delimiter.square.hcl' }
			]
		},
		{
			line: '}',
			tokens: [{ startIndex: 0, type: 'delimiter.curly.hcl' }]
		}
	],
	/*
    output "web_ip" {
        value = "${aws_instance.web.private_ip}"
    }
    */
	[
		{
			line: 'output "web_ip" {',
			tokens: [
				{ startIndex: 0, type: 'type.hcl' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'string.hcl' },
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'delimiter.curly.hcl' }
			]
		},
		{
			line: 'value = "${aws_instance.web.private_ip}"',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'operator.hcl' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'string.hcl' },
				{ startIndex: 9, type: 'delimiter.hcl' },
				{ startIndex: 11, type: 'variable.hcl' },
				{ startIndex: 23, type: 'delimiter.hcl' },
				{ startIndex: 24, type: 'variable.hcl' },
				{ startIndex: 27, type: 'delimiter.hcl' },
				{ startIndex: 28, type: 'variable.hcl' },
				{ startIndex: 38, type: 'delimiter.hcl' },
				{ startIndex: 39, type: 'string.hcl' }
			]
		},
		{
			line: '}',
			tokens: [{ startIndex: 0, type: 'delimiter.curly.hcl' }]
		}
	],

	[
		{
			line: 'foo = [1, 2, "foo"]',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operator.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.square.hcl' },
				{ startIndex: 7, type: 'number.hcl' },
				{ startIndex: 8, type: 'delimiter.hcl' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.hcl' },
				{ startIndex: 11, type: 'delimiter.hcl' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'string.hcl' },
				{ startIndex: 18, type: 'delimiter.square.hcl' }
			]
		}
	],
	[
		{
			line: 'foo = [1, 2, "foo",]',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operator.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.square.hcl' },
				{ startIndex: 7, type: 'number.hcl' },
				{ startIndex: 8, type: 'delimiter.hcl' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.hcl' },
				{ startIndex: 11, type: 'delimiter.hcl' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'string.hcl' },
				{ startIndex: 18, type: 'delimiter.hcl' },
				{ startIndex: 19, type: 'delimiter.square.hcl' }
			]
		}
	],
	/*
    default = {
        "eu-west-1": "ami-b1cf19c6",
    }
    */
	[
		{
			line: 'default = {',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'operator.hcl' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'delimiter.curly.hcl' }
			]
		},
		{
			line: '  "eu-west-1": "ami-b1cf19c6",',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'string.hcl' },
				{ startIndex: 13, type: 'operator.hcl' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'string.hcl' },
				{ startIndex: 29, type: 'delimiter.hcl' }
			]
		},
		{
			line: '}',
			tokens: [{ startIndex: 0, type: 'delimiter.curly.hcl' }]
		}
	],
	[
		{
			line: 'resource "foo" "bar" {}',
			tokens: [
				{ startIndex: 0, type: 'type.hcl' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'string.hcl' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'string.hcl' },
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'delimiter.curly.hcl' }
			]
		}
	],
	[
		{
			line: 'foo = "bar"',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operator.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'string.hcl' }
			]
		}
	],
	[
		{
			line: 'bar = 7',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operator.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'number.hcl' }
			]
		}
	],
	[
		{
			line: 'baz = [1,2,3]',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operator.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.square.hcl' },
				{ startIndex: 7, type: 'number.hcl' },
				{ startIndex: 8, type: 'delimiter.hcl' },
				{ startIndex: 9, type: 'number.hcl' },
				{ startIndex: 10, type: 'delimiter.hcl' },
				{ startIndex: 11, type: 'number.hcl' },
				{ startIndex: 12, type: 'delimiter.square.hcl' }
			]
		}
	],
	[
		{
			line: 'foo = -12',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operator.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'operator.hcl' },
				{ startIndex: 7, type: 'number.hcl' }
			]
		}
	],
	[
		{
			line: 'bar = 3.14159',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operator.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'number.float.hcl' }
			]
		}
	],
	[
		{
			line: 'foo = true',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operator.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'keyword.true.hcl' }
			]
		}
	],
	[
		{
			line: 'bar = false',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operator.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'keyword.false.hcl' }
			]
		}
	],
	/*
    resource = [{
        foo = [{
            bar = {}
        }]
    }]
    */
	[
		{
			line: 'resource = [{',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'operator.hcl' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'delimiter.square.hcl' },
				{ startIndex: 12, type: 'delimiter.curly.hcl' }
			]
		},
		{
			line: '  foo = [{',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'variable.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'operator.hcl' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'delimiter.square.hcl' },
				{ startIndex: 9, type: 'delimiter.curly.hcl' }
			]
		},
		{
			line: '    bar = {}',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 4, type: 'variable.hcl' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'operator.hcl' },
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'delimiter.curly.hcl' }
			]
		},
		{
			line: '  }]',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'delimiter.curly.hcl' },
				{ startIndex: 3, type: 'delimiter.square.hcl' }
			]
		},
		{
			line: '}]',
			tokens: [
				{ startIndex: 0, type: 'delimiter.curly.hcl' },
				{ startIndex: 1, type: 'delimiter.square.hcl' }
			]
		}
	],
	[
		{
			line: 'bar = "${file("bing/bong.txt")}"',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operator.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'string.hcl' },
				{ startIndex: 7, type: 'delimiter.hcl' },
				{ startIndex: 9, type: 'type.hcl' },
				{ startIndex: 13, type: 'delimiter.parenthesis.hcl' },
				{ startIndex: 14, type: 'string.hcl' },
				{ startIndex: 29, type: 'delimiter.parenthesis.hcl' },
				{ startIndex: 30, type: 'delimiter.hcl' },
				{ startIndex: 31, type: 'string.hcl' }
			]
		}
	],
	[
		{
			line: 'foo-bar="baz"',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 7, type: 'operator.hcl' },
				{ startIndex: 8, type: 'string.hcl' }
			]
		}
	],
	/*
     key "foo/" {
        policy = "write"
    }
    */
	[
		{
			line: 'key "foo/" {',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'string.hcl' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'delimiter.curly.hcl' }
			]
		},
		{
			line: '  policy = "write"',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'variable.hcl' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'operator.hcl' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'string.hcl' }
			]
		},
		{
			line: '}',
			tokens: [{ startIndex: 0, type: 'delimiter.curly.hcl' }]
		}
	],
	[
		{
			line: 'foo = "bar\\"baz\\\\n"',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operator.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'string.hcl' },
				{ startIndex: 10, type: 'string.escape.hcl' },
				{ startIndex: 12, type: 'string.hcl' },
				{ startIndex: 15, type: 'string.escape.hcl' },
				{ startIndex: 17, type: 'string.hcl' }
			]
		}
	],
	[
		{
			line: 'bar = "new\\nline"',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operator.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'string.hcl' },
				{ startIndex: 10, type: 'string.escape.hcl' },
				{ startIndex: 12, type: 'string.hcl' }
			]
		}
	],
	[
		{
			line: 'qux = "back\\\\slash"',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operator.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'string.hcl' },
				{ startIndex: 11, type: 'string.escape.hcl' },
				{ startIndex: 13, type: 'string.hcl' }
			]
		}
	],
	[
		{
			line: 'qax = "slash\\\\:colon"',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operator.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'string.hcl' },
				{ startIndex: 12, type: 'string.escape.hcl' },
				{ startIndex: 14, type: 'string.hcl' }
			]
		}
	],
	[
		{
			line: 'nested = "${HH\\\\:mm\\\\:ss}"',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 6, type: '' },
				{ startIndex: 7, type: 'operator.hcl' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'string.hcl' },
				{ startIndex: 10, type: 'delimiter.hcl' },
				{ startIndex: 12, type: 'variable.hcl' },
				{ startIndex: 14, type: '' },
				{ startIndex: 16, type: 'operator.hcl' },
				{ startIndex: 17, type: 'variable.hcl' },
				{ startIndex: 19, type: '' },
				{ startIndex: 21, type: 'operator.hcl' },
				{ startIndex: 22, type: 'variable.hcl' },
				{ startIndex: 24, type: 'delimiter.hcl' },
				{ startIndex: 25, type: 'string.hcl' }
			]
		}
	],
	[
		{
			line: 'nestedquotes = "${"\\"stringwrappedinquotes\\""}"',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'operator.hcl' },
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'string.hcl' },
				{ startIndex: 16, type: 'delimiter.hcl' },
				{ startIndex: 18, type: 'string.hcl' },
				{ startIndex: 19, type: 'string.escape.hcl' },
				{ startIndex: 21, type: 'string.hcl' },
				{ startIndex: 42, type: 'string.escape.hcl' },
				{ startIndex: 44, type: 'string.hcl' },
				{ startIndex: 45, type: 'delimiter.hcl' },
				{ startIndex: 46, type: 'string.hcl' }
			]
		}
	],
	/*
      foo = <<-EOF
      bar
      EOF
    */
	[
		{
			line: '  foo = <<-EOF',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 2, type: 'variable.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'operator.hcl' },
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'string.heredoc.delimiter.hcl' }
			]
		},
		{
			line: '  bar',
			tokens: [{ startIndex: 0, type: 'string.heredoc.hcl' }]
		},
		{
			line: '  EOF',
			tokens: [
				{ startIndex: 0, type: 'string.heredoc.hcl' },
				{ startIndex: 2, type: 'string.heredoc.delimiter.hcl' }
			]
		}
	],
	/*
    foo = <<EOF
    bar
    EOF
    */
	[
		{
			line: 'foo = <<EOF',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operator.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'string.heredoc.delimiter.hcl' }
			]
		},
		{
			line: 'bar',
			tokens: [{ startIndex: 0, type: 'string.heredoc.hcl' }]
		},
		{
			line: 'EOF',
			tokens: [{ startIndex: 0, type: 'string.heredoc.delimiter.hcl' }]
		}
	],
	[
		{
			line: 'foo = <EOF',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operator.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'delimiter.angle.hcl' },
				{ startIndex: 7, type: 'variable.hcl' }
			]
		}
	],
	[
		{
			line: 'foo = <<-EOF',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operator.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'string.heredoc.delimiter.hcl' }
			]
		}
	],
	/*
    multiline_literal = "hello
    world"
    foo = "bar"
    */
	[
		{
			line: 'multiline_literal = "hello',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'operator.hcl' },
				{ startIndex: 19, type: '' },
				{ startIndex: 20, type: 'string.hcl' }
			]
		},
		{
			line: '  world"',
			tokens: [{ startIndex: 0, type: 'string.hcl' }]
		},
		{
			line: 'foo = "bar"',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operator.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'string.hcl' }
			]
		}
	],
	/*
    multiline_literal_with_hil = "${hello
    world}"
    */
	[
		{
			line: 'multiline_literal_with_hil = "${hello',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 26, type: '' },
				{ startIndex: 27, type: 'operator.hcl' },
				{ startIndex: 28, type: '' },
				{ startIndex: 29, type: 'string.hcl' },
				{ startIndex: 30, type: 'delimiter.hcl' },
				{ startIndex: 32, type: 'variable.hcl' }
			]
		},
		{
			line: ' world}"',
			tokens: [
				{ startIndex: 0, type: '' },
				{ startIndex: 1, type: 'variable.hcl' },
				{ startIndex: 6, type: 'delimiter.hcl' },
				{ startIndex: 7, type: 'string.hcl' }
			]
		},
		{
			line: 'foo = "bar"',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'operator.hcl' },
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'string.hcl' }
			]
		}
	],
	// scientific numbers
	[
		{
			line: 'a = 1e-10',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'operator.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.float.hcl' }
			]
		}
	],
	[
		{
			line: 'b = 1e+10',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'operator.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.float.hcl' }
			]
		}
	],
	[
		{
			line: 'c = 1e10',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'operator.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.float.hcl' }
			]
		}
	],
	[
		{
			line: 'd = 1.2e-10',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'operator.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.float.hcl' }
			]
		}
	],
	[
		{
			line: 'e = 1.2e+10',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'operator.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.float.hcl' }
			]
		}
	],
	[
		{
			line: 'f = 1.2e10',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'operator.hcl' },
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'number.float.hcl' }
			]
		}
	],
	[
		{
			line: 'map.key1 = "Value"',
			tokens: [
				{ startIndex: 0, type: 'variable.hcl' },
				{ startIndex: 3, type: 'delimiter.hcl' },
				{ startIndex: 4, type: 'variable.hcl' },
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'operator.hcl' },
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'string.hcl' }
			]
		}
	]
]);
