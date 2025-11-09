import { type IRelaxedToken, testTokenization } from '../test/testRunner';

function makeTokenItemFn(type: string): (startIndex: number) => IRelaxedToken {
	return (startIndex: number) => {
		return {
			startIndex,
			type
		};
	};
}

const white = makeTokenItemFn('white.toml');
const comment = makeTokenItemFn('comment.toml');
const string = makeTokenItemFn('string.toml');
const escape = makeTokenItemFn('constant.character.escape.toml');
const escapeInvalid = makeTokenItemFn('constant.character.escape.invalid.toml');
const stringLiteral = makeTokenItemFn('string.literal.toml');
const stringMulti = makeTokenItemFn('string.multi.toml');
const stringLiteralMulti = makeTokenItemFn('string.literal.multi.toml');
const variable = makeTokenItemFn('variable.toml');
const variableQuoted = makeTokenItemFn('variable.string.toml');
const variableLiteral = makeTokenItemFn('variable.string.literal.toml');
const delimiter = makeTokenItemFn('delimiter.toml');
const square = makeTokenItemFn('delimiter.square.toml');
const bracket = makeTokenItemFn('delimiter.bracket.toml');
const boolean = makeTokenItemFn('constant.language.boolean.toml');
const decimal = makeTokenItemFn('number.toml');
const octal = makeTokenItemFn('number.octal.toml');
const hex = makeTokenItemFn('number.hex.toml');
const binary = makeTokenItemFn('number.binary.toml');
const float = makeTokenItemFn('number.float.toml');
const infinity = makeTokenItemFn('number.inf.toml');
const nan = makeTokenItemFn('number.nan.toml');
const date = makeTokenItemFn('number.date.toml');
const time = makeTokenItemFn('number.time.toml');
const datetime = makeTokenItemFn('number.datetime.toml');
const table = makeTokenItemFn('type.toml');
const tableString = makeTokenItemFn('type.string.toml');
const tableLiteral = makeTokenItemFn('type.string.literal.toml');

function testNumber(line: string, fn: (start: number) => any = decimal) {
	return {
		line,
		tokens: [variable(0), white(4), delimiter(5), white(6), fn(7)]
	};
}

// https://toml.io/en/v1.0.0
testTokenization('toml', [
	// https://toml.io/en/v1.0.0#comment
	[
		{
			line: '# comment',
			tokens: [comment(0)]
		},
		{
			line: `another = "# This is not a comment"`,
			tokens: [variable(0), white(7), delimiter(8), white(9), string(10)]
		}
	],
	// https://toml.io/en/v1.0.0#keyvalue-pair
	[
		{
			line: `key = ""`,
			tokens: [variable(0), white(3), delimiter(4), white(5), string(6)]
		},
		{
			line: 'key= # INVALID',
			tokens: [variable(0), delimiter(3), white(4), comment(5)]
		},
		{
			line: `key = "value"`,
			tokens: [variable(0), white(3), delimiter(4), white(5), string(6)]
		}
	],
	// https://toml.io/en/v1.0.0#keys
	[
		{
			line: `bare_key = "value"`,
			tokens: [variable(0), white(8), delimiter(9), white(10), string(11)]
		},
		{
			line: `bare-key = "value"`,
			tokens: [variable(0), white(8), delimiter(9), white(10), string(11)]
		},
		{
			line: `1234 = "value"`,
			tokens: [variable(0), white(4), delimiter(5), white(6), string(7)]
		},
		{
			line: `"127.0.0.1" = "value"`,
			// ----0123456789 11
			tokens: [variableQuoted(0), white(11), delimiter(12), white(13), string(14)]
		},
		{
			line: `"character encoding" = "value"`,
			// ----0123456789 11 14 17 20 23 26 29 32
			tokens: [variableQuoted(0), white(20), delimiter(21), white(22), string(23)]
		},
		{
			line: `"ʎǝʞ" = "value"`,
			tokens: [variableQuoted(0), white(5), delimiter(6), white(7), string(8)]
		},
		{
			line: `'key2' = 'value'`,
			tokens: [variableLiteral(0), white(6), delimiter(7), white(8), stringLiteral(9)]
		},
		{
			line: `'quoted "value"' = "value"`,
			// ----0123456789 11 14 17
			tokens: [variableLiteral(0), white(16), delimiter(17), white(18), string(19)]
		},
		{
			line: `= "value" # INVALID`,
			// ----012345678 10
			tokens: [delimiter(0), white(1), string(2), white(9), comment(10)]
		},
		{
			line: `"" = "blank"`,
			tokens: [variableQuoted(0), white(2), delimiter(3), white(4), string(5)]
		},
		{
			line: `"a\\tb" = "blank"`,
			// ----012 3456789
			tokens: [
				variableQuoted(0),
				escape(2),
				variableQuoted(4),
				white(6),
				delimiter(7),
				white(8),
				string(9)
			]
		},
		{
			line: `"a\\mb" = "blank"`,
			// ----012 3456789
			tokens: [
				variableQuoted(0),
				escapeInvalid(2),
				variableQuoted(4),
				white(6),
				delimiter(7),
				white(8),
				string(9)
			]
		},
		{
			line: `'' = 'blank'`,
			tokens: [variableLiteral(0), white(2), delimiter(3), white(4), stringLiteral(5)]
		},
		{
			line: `physical.color = "orange"`,
			// ----0123456789 11 14 17 20 23 26
			tokens: [
				variable(0),
				delimiter(8),
				variable(9),
				white(14),
				delimiter(15),
				white(16),
				string(17)
			]
		},
		{
			line: `site."google.com" = true`,
			// ----0123456789 11 14 17 20
			tokens: [
				variable(0),
				delimiter(4),
				variableQuoted(5),
				white(17),
				delimiter(18),
				white(19),
				boolean(20)
			]
		},
		{
			line: `fruit. color = "yellow"`,
			// ----0123456789 11 14
			tokens: [
				variable(0),
				delimiter(5),
				white(6),
				variable(7),
				white(12),
				delimiter(13),
				white(14),
				string(15)
			]
		},
		{
			line: `fruit . flavor = "banana"`,
			// ----0123456789 11 14
			tokens: [
				variable(0),
				white(5),
				delimiter(6),
				white(7),
				variable(8),
				white(14),
				delimiter(15),
				white(16),
				string(17)
			]
		},
		{
			line: 'fruit.apple.smooth = true',
			// ----0123456789 11 14 17 20
			tokens: [
				variable(0),
				delimiter(5),
				variable(6),
				delimiter(11),
				variable(12),
				white(18),
				delimiter(19),
				white(20),
				boolean(21)
			]
		},
		{
			line: `3.14159 = "pi"`,
			// ----0123456789 11
			tokens: [variable(0), delimiter(1), variable(2), white(7), delimiter(8), white(9), string(10)]
		}
	],
	// https://toml.io/en/v1.0.0#string
	[
		{
			line: `str = "I'm a string. \\"You can quote me\\". Name\\tJos\\u00E9\\nLocation\\tSF."`,
			// ----0123456789 11 14 17 20  23 26 29 32 35 38  41 44 47  50  53 56  59 62 65 68  71
			tokens: [
				variable(0),
				white(3),
				delimiter(4),
				white(5),
				string(6),
				escape(21),
				string(23),
				escape(39),
				string(41),
				escape(47),
				string(49),
				escape(52),
				// escape(58), this is connected
				string(60),
				escape(68),
				string(70)
			]
		},
		{
			line: `"\\b \\t \\f \\r \\\\ \\u1234 \\U00012345"`,
			// ----01 234 567 8910111314 1617 20 2324 27 30 33
			tokens: [
				variableQuoted(0),
				escape(1),
				variableQuoted(3),
				escape(4),
				variableQuoted(6),
				escape(7),
				variableQuoted(9),
				escape(10),
				variableQuoted(12),
				escape(13),
				variableQuoted(15),
				escape(16),
				variableQuoted(22),
				escape(23),
				variableQuoted(33)
			]
		}
	],
	// unterminated strings
	[
		{
			line: `str = "unterminated`,
			tokens: [
				variable(0),
				white(3),
				delimiter(4),
				white(5),
				{
					startIndex: 6,
					type: 'string.invalid.toml'
				}
			]
		},
		{
			line: `str = 'unterminated`,
			tokens: [
				variable(0),
				white(3),
				delimiter(4),
				white(5),
				{
					startIndex: 6,
					type: 'string.literal.invalid.toml'
				}
			]
		},
		{
			line: `str = 'untermi\\"nated`,
			tokens: [
				variable(0),
				white(3),
				delimiter(4),
				white(5),
				{
					startIndex: 6,
					type: 'string.literal.invalid.toml'
				}
			]
		},
		{
			line: `str = "untermi\\"nated`,
			tokens: [
				variable(0),
				white(3),
				delimiter(4),
				white(5),
				{
					startIndex: 6,
					type: 'string.invalid.toml'
				}
			]
		}
	],
	// multiline basic strings
	[
		{
			line: `str1 = """`,
			tokens: [variable(0), white(4), delimiter(5), white(6), stringMulti(7)]
		},
		{
			line: 'Roses are red',
			tokens: [stringMulti(0)]
		},
		{
			line: `Violets are blue"""`,
			tokens: [stringMulti(0)]
		},
		{
			line: `str3 = """`,
			tokens: [variable(0), white(4), delimiter(5), white(6), stringMulti(7)]
		},
		{
			line: `The quick brown \\`,
			// ----0123456789 11 14
			tokens: [stringMulti(0), escape(16)]
		},
		{
			line: `fox jumps over \\`,
			// ----0123456789 11 14
			tokens: [stringMulti(0), escape(15)]
		},
		{
			line: `the lazy dog."""`,
			tokens: [stringMulti(0)]
		}
	],
	// quotes and escapes in multiline basic strings
	[
		{
			line: `str4 = """Here are two quotation marks: "". Simple enough."""`,
			// ----0123456789
			tokens: [variable(0), white(4), delimiter(5), white(6), stringMulti(7)]
		},
		{
			line: `str5 = """Here are three quotation marks: ""\\"."""`,
			// ----0123456789 11 14 17 20 23 26 29 32 35 38 41 44  47
			tokens: [
				variable(0),
				white(4),
				delimiter(5),
				white(6),
				stringMulti(7),
				escape(44),
				stringMulti(46)
			]
		},
		{
			line: `str6 = """Here are fifteen quotation marks: ""\\"""\\"""\\"""\\"""\\"."""`,
			// ----0123456789 11 14 17 20 23 26 29 32 35 38 41 44  47 50 5254 5658 6062 64
			tokens: [
				variable(0),
				white(4),
				delimiter(5),
				white(6),
				stringMulti(7),
				escape(46),
				stringMulti(48),
				escape(50),
				stringMulti(52),
				escape(54),
				stringMulti(56),
				escape(58),
				stringMulti(60),
				escape(62),
				stringMulti(64)
			]
		},
		{
			line: `str7 = """"This," she said, "is just a pointless statement.""""`,
			tokens: [variable(0), white(4), delimiter(5), white(6), stringMulti(7)]
		}
	],
	// literal strings
	[
		{
			line: `winpath = 'C:\\Users\\nodejs\\templates'`,
			tokens: [variable(0), white(7), delimiter(8), white(9), stringLiteral(10)]
		},
		{
			line: `winpath2 = '\\ServerX\\admin$\\system32\\'`,
			tokens: [variable(0), white(8), delimiter(9), white(10), stringLiteral(11)]
		},
		{
			line: `quoted   = 'Tom "Dubs" Preston-Werner'`,
			tokens: [variable(0), white(6), delimiter(9), white(10), stringLiteral(11)]
		},
		{
			line: `regex = '<\\i\\c*\\s*>'`,
			tokens: [variable(0), white(5), delimiter(6), white(7), stringLiteral(8)]
		}
	],
	// multiline literal strings
	[
		{
			line: `regex2 = '''I [dw]on't need \\d{2} apples'''`,
			tokens: [variable(0), white(6), delimiter(7), white(8), stringLiteralMulti(9)]
		},
		{
			line: `lines  = '''`,
			tokens: [variable(0), white(5), delimiter(7), white(8), stringLiteralMulti(9)]
		},
		{
			line: `The first newline is`,
			tokens: [stringLiteralMulti(0)]
		},
		{
			line: `trimmed in raw strings.`,
			tokens: [stringLiteralMulti(0)]
		},
		{
			line: `   All other whitespace`,
			tokens: [stringLiteralMulti(0)]
		},
		{
			line: `   is preserved.'''`,
			tokens: [stringLiteralMulti(0)]
		},

		{
			line: `quot15 = '''Here are fifteen quotation marks: """""""""""""""'''`,
			tokens: [variable(0), white(6), delimiter(7), white(8), stringLiteralMulti(9)]
		},
		// sequences of three or more single quotes are not permitted INSIDE the literal string
		// (so '''' = ok, ''''' = ok, '''''' = not ok)
		{
			line: `apos15 = '''Here are fifteen apostrophes: ''''''''''''''''''  # INVALID`,
			// ----0123456789 11 14 17 20 23 26 29 32 35 38 41 44 47 50 53 56 59 61
			tokens: [
				variable(0),
				white(6),
				delimiter(7),
				white(8),
				stringLiteralMulti(9),
				// after ''''', rest pairs are interpreted as variable name
				variableLiteral(47),
				// unterminated variable literal
				{
					startIndex: 59,
					type: 'variable.invalid.toml'
				}
				// and there's no comment
			]
		},
		{
			line: `apos15 = "Here are fifteen apostrophes: '''''''''''''''"`,
			tokens: [variable(0), white(6), delimiter(7), white(8), string(9)]
		},
		{
			line: `str = ''''That,' she said, 'is still pointless.''''`,
			tokens: [variable(0), white(3), delimiter(4), white(5), stringLiteralMulti(6)]
		}
	],
	// https://toml.io/en/v1.0.0#integer
	[
		testNumber('int1 = +99'),
		testNumber('int2 = 42'),
		testNumber('int3 = 0'),
		testNumber('int4 = -17'),
		testNumber('int5 = 1_000'),
		testNumber('int6 = 5_349_221'),
		testNumber('int7 = 53_49_221'),
		testNumber('int8 = 1_2_3_4_5'),
		{
			line: 'bad  = 01234', // leading zero not allowed
			tokens: [
				variable(0),
				white(3),
				delimiter(5),
				white(6),
				// 01234 becomes next key
				variable(7)
			]
		},
		testNumber('int9 = +0'),
		testNumber('intA = -0')
	],
	// hex, octal, binary
	[
		testNumber('hex1 = 0xDEADBEEF', hex),
		testNumber('hex2 = 0xdeadbeef', hex),
		testNumber('hex3 = 0xdead_beef', hex),
		testNumber('oct1 = 0o01234567', octal),
		testNumber('oct2 = 0o755', octal),
		testNumber('bin1 = 0b11010110', binary),
		testNumber('bin2 = 0b1101_0110', binary)
	],
	// https://toml.io/en/v1.0.0#float
	[
		testNumber('flt1 = +1.0', float),
		testNumber('flt2 = 3.1415', float),
		testNumber('flt3 = -0.01', float),
		testNumber('flt4 = 5e+22', float),
		testNumber('flt5 = 1e06', float),
		testNumber('flt6 = -2E-2', float),
		testNumber('flt7 = 6.626e-34', float),
		{
			line: 'invalid_float_1 = .7',
			tokens: [
				variable(0),
				white(15),
				delimiter(16),
				white(17),
				{
					startIndex: 18,
					type: 'source.toml'
				},
				variable(19)
			]
		},
		{
			line: 'invalid_float_2 = 1.',
			tokens: [variable(0), white(15), delimiter(16), white(17), variable(18), delimiter(19)]
		},
		{
			line: 'invalid_float_3 = 6.e+20',
			tokens: [
				variable(0),
				white(15),
				delimiter(16),
				white(17),
				variable(18),
				delimiter(19),
				variable(20),
				// + is not valid in this context
				{
					startIndex: 21,
					type: 'source.toml'
				},
				// 20 can be variable again
				variable(22)
			]
		},
		testNumber('flt8 = 224_617.445_991_228', float),
		testNumber('flt9 = -0.0', float),
		testNumber('fltA = +0.0', float),
		testNumber('inf1 = inf', infinity),
		testNumber('inf2 = +inf', infinity),
		testNumber('inf3 = -inf', infinity),
		testNumber('nan1 = nan', nan),
		testNumber('nan2 = +nan', nan),
		testNumber('nan3 = -nan', nan)
	],
	// https://toml.io/en/v1.0.0#boolean
	[
		{
			line: 'bool1 = true',
			tokens: [variable(0), white(5), delimiter(6), white(7), boolean(8)]
		},
		{
			line: 'bool2 = false',
			tokens: [variable(0), white(5), delimiter(6), white(7), boolean(8)]
		}
	],
	// https://toml.io/en/v1.0.0#offset-date-time
	// https://toml.io/en/v1.0.0#local-date-time
	// https://toml.io/en/v1.0.0#local-date
	[
		testNumber('odt1 = 1979-05-27T07:32:00Z', datetime),
		testNumber('odt2 = 1979-05-27T00:32:00-07:00', datetime),
		testNumber('odt3 = 1979-05-27T00:32:00.999999-07:00', datetime),
		testNumber('odt2 = 1979-05-27T00:32:00.1+07:00', datetime),
		testNumber('ldt1 = 1979-05-27T07:32:00', datetime),
		testNumber('ldt2 = 1979-05-27T00:32:00.999999', datetime),
		testNumber('ld_1 = 1979-05-27', date),
		testNumber('lt_1 = 23:32:00', time),
		testNumber('lt_2 = 00:32:00.999999', time)
	],
	// https://toml.io/en/v1.0.0#array
	[
		{
			line: 'integers = [1, 2, 3]',
			// ----0123456789 11 14 17
			tokens: [
				variable(0),
				white(8),
				delimiter(9),
				white(10),
				square(11),
				decimal(12),
				delimiter(13),
				white(14),
				decimal(15),
				delimiter(16),
				white(17),
				decimal(18),
				square(19)
			]
		},
		{
			line: `colors = ["red", "yellow", "green",]`,
			// ----0123456789 11 14 17 20 23 26 29 32
			tokens: [
				variable(0),
				white(6),
				delimiter(7),
				white(8),
				square(9),
				string(10),
				delimiter(15),
				white(16),
				string(17),
				delimiter(25),
				white(26),
				string(27),
				delimiter(34),
				square(35)
			]
		},
		{
			line: `nested_arrays_of_ints = [ [ 1, 2 ], [3, 4, 5] ]`,
			// ----0123456789 11 14 17 20 23 26 29 32 35 38 41 44
			tokens: [
				variable(0),
				white(21),
				delimiter(22),
				white(23),
				square(24),
				white(25),
				square(26),
				white(27),
				decimal(28),
				delimiter(29),
				white(30),
				decimal(31),
				white(32),
				square(33),
				delimiter(34),
				white(35),
				square(36),
				decimal(37),
				delimiter(38),
				white(39),
				decimal(40),
				delimiter(41),
				white(42),
				decimal(43),
				square(44),
				white(45),
				square(46)
			]
		},
		{
			line: `nested_mixed_array = [ [ 1, 2 ], ["a", "b", "c"] ]`,
			// ----0123456789 11 14 17 20 23 26 29 32 35 38 41 44 47
			tokens: [
				variable(0),
				white(18),
				delimiter(19),
				white(20),
				square(21),
				white(22),
				square(23),
				white(24),
				decimal(25),
				delimiter(26),
				white(27),
				decimal(28),
				white(29),
				square(30),
				delimiter(31),
				white(32),
				square(33),
				string(34),
				delimiter(37),
				white(38),
				string(39),
				delimiter(42),
				white(43),
				string(44),
				square(47),
				white(48),
				square(49)
			]
		},
		{
			line: `string_array = [ "all", 'strings', """are the same""", '''type''' ]`,
			// ----0123456789 11 14 17 20 23 26 29 32 35 38 41 44 47 50 53 56 59 62 65
			tokens: [
				variable(0),
				white(12),
				delimiter(13),
				white(14),
				square(15),
				white(16),
				string(17),
				delimiter(22),
				white(23),
				stringLiteral(24),
				delimiter(33),
				white(34),
				stringMulti(35),
				delimiter(53),
				white(54),
				stringLiteralMulti(55),
				white(65),
				square(66)
			]
		}
	],
	// Multiline arrays
	[
		{
			line: 'integers2 = [',
			// ----0123456789
			tokens: [variable(0), white(9), delimiter(10), white(11), square(12)]
		},
		{
			line: '  1, 2, 3',
			// ----012345678
			tokens: [
				white(0),
				decimal(2),
				delimiter(3),
				white(4),
				decimal(5),
				delimiter(6),
				white(7),
				decimal(8)
			]
		},
		{
			line: ']',
			tokens: [square(0)]
		},

		{
			line: 'integers3 = [',
			// ----0123456789
			tokens: [variable(0), white(9), delimiter(10), white(11), square(12)]
		},
		{
			line: '  1,',
			tokens: [white(0), decimal(2), delimiter(3)]
		},
		{
			line: '  2, # this is ok',
			tokens: [white(0), decimal(2), delimiter(3), white(4), comment(5)]
		},
		{
			line: ']',
			tokens: [square(0)]
		}
	],
	// https://toml.io/en/v1.0.0#table
	[
		{
			line: '[table]',
			tokens: [square(0), table(1), square(6)]
		},
		{
			line: '[table-1]',
			tokens: [square(0), table(1), square(8)]
		},
		{
			line: `[dog."tater.man"]`,
			// ----0123456789 11 14
			tokens: [square(0), table(1), delimiter(4), tableString(5), square(16)]
		},
		{
			line: `[a.b.c]`,
			// ----0123456
			tokens: [square(0), table(1), delimiter(2), table(3), delimiter(4), table(5), square(6)]
		},
		{
			line: `[ d.'e-e'.f ]`,
			// ----0123456789 11
			tokens: [
				square(0),
				white(1),
				table(2),
				delimiter(3),
				tableLiteral(4),
				delimiter(9),
				table(10),
				white(11),
				square(12)
			]
		},
		{
			line: `[ g .  h  . i ]`,
			// ----0123456789 11 14
			tokens: [
				square(0),
				white(1),
				table(2),
				white(3),
				delimiter(4),
				white(5),
				table(7),
				white(8),
				delimiter(10),
				white(11),
				table(12),
				white(13),
				square(14)
			]
		},
		{
			line: `[ j . "ʞ" . 'l' ]`,
			// ----0123456789 11 14
			tokens: [
				square(0),
				white(1),
				table(2),
				white(3),
				delimiter(4),
				white(5),
				tableString(6),
				white(9),
				delimiter(10),
				white(11),
				tableLiteral(12),
				white(15),
				square(16)
			]
		},
		{
			line: '    [indented]',
			// ----0123456789 11
			tokens: [white(0), square(4), table(5), square(13)]
		}
	],
	// https://toml.io/en/v1.0.0#inline-table
	[
		{
			line: `name = { first = "Tom", last = "Preston-Werner" }`,
			// ----0123456789 11 14 17 20 23 26 29 32 35 38 41 44 47
			tokens: [
				variable(0),
				white(4),
				delimiter(5),
				white(6),
				bracket(7),
				white(8),
				variable(9),
				white(14),
				delimiter(15),
				white(16),
				string(17),
				delimiter(22),
				white(23),
				variable(24),
				white(28),
				delimiter(29),
				white(30),
				string(31),
				white(47),
				bracket(48)
			]
		},
		{
			line: 'point = { x = 1, y = 2 }',
			// ----0123456789 11 14 17 20 23
			tokens: [
				variable(0),
				white(5),
				delimiter(6),
				white(7),
				bracket(8),
				white(9),
				variable(10),
				white(11),
				delimiter(12),
				white(13),
				decimal(14),
				delimiter(15),
				white(16),
				variable(17),
				white(18),
				delimiter(19),
				white(20),
				decimal(21),
				white(22),
				bracket(23)
			]
		},
		{
			line: `animal = { type.name = "pug" }`,
			// ----0123456789 11 14 17 20 23 26 29
			tokens: [
				variable(0),
				white(6),
				delimiter(7),
				white(8),
				bracket(9),
				white(10),
				variable(11),
				delimiter(15),
				variable(16),
				white(20),
				delimiter(21),
				white(22),
				string(23),
				white(28),
				bracket(29)
			]
		}
	],
	// multi line/nested array test case
	[
		{
			line: `shop = {`,
			tokens: [variable(0), white(4), delimiter(5), white(6), bracket(7)]
		},
		{
			line: `  products = [`,
			// ----0123456789 11
			tokens: [white(0), variable(2), white(10), delimiter(11), white(12), square(13)]
		},
		{
			line: `    { name = "Hammer", sku = 738594937 },`,
			// ----0123456789 11 14 17 20 23 26 29 32 35 38
			tokens: [
				white(0),
				bracket(4),
				white(5),
				variable(6),
				white(10),
				delimiter(11),
				white(12),
				string(13),
				delimiter(21),
				white(22),
				variable(23),
				white(26),
				delimiter(27),
				white(28),
				decimal(29),
				white(38),
				bracket(39),
				delimiter(40)
			]
		},
		{
			line: `    {},`,
			// ----0123456
			tokens: [
				white(0),
				bracket(4),
				// bracket(5), // connected
				delimiter(6)
			]
		},
		{
			line: `    { name = "Nail", sku = 284758393, color = "gray" }`,
			// ----0123456789 11 14 17 20 23 26 29 32 35 38 41 44 47 50 53
			tokens: [
				white(0),
				bracket(4),
				white(5),
				variable(6),
				white(10),
				delimiter(11),
				white(12),
				string(13),
				delimiter(19),
				white(20),
				variable(21),
				white(24),
				delimiter(25),
				white(26),
				decimal(27),
				delimiter(36),
				white(37),
				variable(38),
				white(43),
				delimiter(44),
				white(45),
				string(46),
				white(52),
				bracket(53)
			]
		},
		{
			line: `]}`,
			tokens: [square(0), bracket(1)]
		}
	],
	// https://toml.io/en/v1.0.0#array-of-tables
	[
		{
			line: `[[products]]`,
			// ----0123456789 11
			tokens: [square(0), table(2), square(10)]
		},
		{
			line: `[[fruits.varieties]]`,
			// ----0123456789 11 14 17
			tokens: [square(0), table(2), delimiter(8), table(9), square(18)]
		}
	]
]);
