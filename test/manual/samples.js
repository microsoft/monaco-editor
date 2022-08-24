/// <reference path="../../node_modules/monaco-editor-core/monaco.d.ts" />

define(['./generated/all-samples'], function (ALL_SAMPLES) {
	var XHR_SAMPLES = {};
	ALL_SAMPLES.forEach(function (sample) {
		XHR_SAMPLES[sample.name] = sample.content;
	});

	var samples = [];

	var modesIds = monaco.languages.getLanguages().map(function (language) {
		return language.id;
	});
	modesIds.sort();

	modesIds.forEach(function (modeId) {
		samples.push({
			name: 'sample - ' + modeId,
			mimeType: modeId,
			loadText: function () {
				return Promise.resolve(XHR_SAMPLES['sample.' + modeId + '.txt']);
			}
		});
	});

	function addXHRSample(name, modelUrl, mimeType, textModifier) {
		textModifier =
			textModifier ||
			function (text) {
				return text;
			};
		samples.push({
			name: name,
			mimeType: mimeType,
			loadText: function () {
				return Promise.resolve(XHR_SAMPLES[modelUrl]).then(textModifier);
			}
		});
	}

	function addStringPowerXHRSample(name, modelUrl, mimeType, power) {
		addXHRSample(name, modelUrl, mimeType, function (text) {
			var result = text;
			for (var i = 0; i < power; ++i) {
				result += '\n' + result;
			}
			return result;
		});
	}

	function addSample(name, mimeType, modelText) {
		samples.push({
			name: name,
			mimeType: mimeType,
			loadText: function () {
				return Promise.resolve(modelText);
			}
		});
	}

	addXHRSample('Y___FailingJS', 'run-editor-failing-js.txt', 'text/javascript');
	addXHRSample('Y___DefaultJS', 'run-editor-sample-js.txt', 'text/javascript');
	addStringPowerXHRSample('Y___BigJS', 'run-editor-sample-js.txt', 'text/javascript', 11);
	addXHRSample('Y___BigJS_msn', 'run-editor-sample-msn-js.txt', 'text/javascript');
	addXHRSample('Y___BigCSS', 'run-editor-sample-big-css.txt', 'text/css');
	addStringPowerXHRSample('Y___BigHTML', 'run-editor-sample-html.txt', 'text/html', 10);
	addXHRSample('Y___Korean', 'run-editor-korean.txt', 'text/plain');
	addXHRSample('Y___BOM.cs', 'run-editor-sample-bom-cs.txt', 'text/x-csharp');
	addXHRSample('Z___CR.ps1', 'run-editor-sample-cr-ps1.txt', 'text/x-powershell');

	addXHRSample('Z___jquery-min.js', 'run-editor-jquery-min-js.txt', 'text/javascript');

	addXHRSample(
		'Z___scrolling-strategy.js',
		'run-editor-sample-js.txt',
		'text/plain',
		function (text) {
			console.log('here I am');
			var lines = text.split('\n');
			var newLines = lines.slice(0);

			var problemIsAt = 80733 + 5;
			while (newLines.length < problemIsAt) {
				newLines = newLines.concat(lines);
			}

			newLines = newLines.slice(0, problemIsAt);
			return newLines.join('\n');
		}
	);

	addSample(
		'Z___special-chars',
		'text/plain',
		[
			'// single line \u000D comment', // Carriage return
			'// single line \u2028 comment', // Line separator
			'// single line \u2029 comment' // Paragraph separator
		].join('\n')
	);

	// http://www.cl.cam.ac.uk/~mgk25/ucs/examples/UTF-8-test.txt
	addSample(
		'Z___invalid-unicode',
		'text/plain',
		[
			'\uFFFE\uFFFF',
			'\uD800\uDC00',
			'\uD800\uDFFF',
			'\uDB7F\uDC00',
			'\uDB7F\uDFFF',
			'\uDB80\uDC00',
			'\uDB80\uDFFF',
			'\uDBFF\uDC00',
			'\uDBFF\uDFFF'
		].join('\n')
	);

	addSample(
		'Z___easy-debug.js',
		'text/plain',
		(function () {
			var myValue = 'Line1';
			for (var i = 2; i < 50; i++) {
				myValue += '\nLine' + i;
			}
			return myValue;
		})()
	);

	addSample(
		'Z___copy-paste.txt',
		'text/plain',
		(function () {
			var i = 0,
				sampleCopyPasteLine = '';
			while (sampleCopyPasteLine.length < 1000) {
				i++;
				sampleCopyPasteLine += i;
			}
			var sampleCopyPaste = sampleCopyPasteLine;
			for (i = 1; i <= 600; i++) {
				sampleCopyPaste += '\n' + sampleCopyPasteLine;
			}
			return sampleCopyPaste;
		})()
	);

	addSample(
		'Z___xss',
		'text/html',
		(function () {
			var xssRepresentations = [
				'<',
				'BAD\u2028CHARACTER',
				'%3C',
				'&lt',
				'&lt;',
				'&LT',
				'&LT;',
				'&#60',
				'&#060',
				'&#0060',
				'&#00060',
				'&#000060',
				'&#0000060',
				'&#60;',
				'&#060;',
				'&#0060;',
				'&#00060;',
				'&#000060;',
				'&#0000060;',
				'&#x3c',
				'&#x03c',
				'&#x003c',
				'&#x0003c',
				'&#x00003c',
				'&#x000003c',
				'&#x3c;',
				'&#x03c;',
				'&#x003c;',
				'&#x0003c;',
				'&#x00003c;',
				'&#x000003c;',
				'&#X3c',
				'&#X03c',
				'&#X003c',
				'&#X0003c',
				'&#X00003c',
				'&#X000003c',
				'&#X3c;',
				'&#X03c;',
				'&#X003c;',
				'&#X0003c;',
				'&#X00003c;',
				'&#X000003c;',
				'&#x3C',
				'&#x03C',
				'&#x003C',
				'&#x0003C',
				'&#x00003C',
				'&#x000003C',
				'&#x3C;',
				'&#x03C;',
				'&#x003C;',
				'&#x0003C;',
				'&#x00003C;',
				'&#x000003C;',
				'&#X3C',
				'&#X03C',
				'&#X003C',
				'&#X0003C',
				'&#X00003C',
				'&#X000003C',
				'&#X3C;',
				'&#X03C;',
				'&#X003C;',
				'&#X0003C;',
				'&#X00003C;',
				'&#X000003C;',
				'\x3c',
				'\x3C',
				'\u003c',
				'\u003C'
			];
			return xssRepresentations.length + ':\n' + xssRepresentations.join('\n');
		})()
	);

	addSample(
		'Z___many-links.js',
		'text/javascript',
		(function () {
			var result = 'bla bla a url: https://microsoft.com some more bla bla';
			for (var i = 0; i < 13; ++i) {
				result += '\n' + result;
			}
			return '/*' + result + '\n*/';
		})()
	);

	addSample(
		'Z___line-separators.js',
		'text/javascript',
		(function () {
			return [
				"var x = '1'; // And\u2028 here I have a nice comment.",
				'',
				"var y = x + ' +\u2028 2 = res';",
				'',
				"y.replace(/re\u2028s/gi, '3');"
			].join('\n');
		})()
	);

	addXHRSample('Z___intellisense.js', 'run-editor-intellisense-js.txt', 'text/javascript');

	addSample(
		'Z___recursion attack',
		'text/html',
		(function () {
			var arr = [];
			for (var i = 0; i < 10000; i++) {
				arr.push('\n<script type="text/html">');
			}
			return arr.length + ':\n' + arr.join('');
		})()
	);

	addSample('empty', 'text/plain', '');

	addXHRSample('Z___dynamic', 'run-editor-sample-dynamic.txt', {
		name: 'custom.1.',
		tokenizer: {
			root: [
				[/\[error.*/, 'custom-error'],
				[/\[notice.*/, 'custom-notice'],
				[/\[info.*/, 'custom-info'],
				[/\[[a-zA-Z 0-9:]+\]/, 'custom-date']
			]
		}
	});

	addXHRSample('Z___f12___css', 'run-editor-sample-f12-css.txt', 'text/css');

	addSample(
		'EDSL',
		'text/typescript',
		`export default function CommandExpansion(props: {
  activityInstance: ActivityType;
}): ExpansionReturn {
  return [
    PeelBanana(),
    A\`2020-060T03:45:19\`.ADD_WATER,
    A("2020-060T03:45:19").ADD_WATER,
    R\`00:15:00\`.EAT_BANANA,
    R('00:15:00').EAT_BANANA,
    E\`00:15:30\`.PREPARE_LOAF(1,true),
    E('00:15:30').PREPARE_LOAF(1,true),
    C.PREHEAT_OVEN(350),
    C.PREPARE_LOAF(1, false),
    C.BAKE_BREAD,
  ];

  function PeelBanana(): Command {
    if (props.activityInstance.attributes.computed < 2) {
      return C.PEEL_BANANA("fromStem");
    } else {
      return C.ECHO("Already have enough Banana's peeled...");
    }
  }
}

export type DOY_STRING = string & { __brand: 'DOY_STRING' };
export type HMS_STRING = string & { __brand: 'HMS_STRING' };

export enum TimingTypes {
  ABSOLUTE = 'ABSOLUTE',
  COMMAND_RELATIVE = 'COMMAND_RELATIVE',
  EPOCH_RELATIVE = 'EPOCH_RELATIVE',
  COMMAND_COMPLETE = 'COMMAND_COMPLETE',
}

type SeqJsonTimeType =
  | {
      type: TimingTypes.ABSOLUTE;
      tag: DOY_STRING;
    }
  | {
      type: TimingTypes.COMMAND_RELATIVE;
      tag: HMS_STRING;
    }
  | {
      type: TimingTypes.EPOCH_RELATIVE;
      tag: HMS_STRING;
    }
  | {
      type: TimingTypes.COMMAND_COMPLETE;
    };

export type CommandOptions<
  A extends ArgType[] | { [argName: string]: any } = [] | {},
  M extends Record<string, any> = Record<string, any>,
> = { stem: string; arguments: A; metadata?: M } & (
  | {
      absoluteTime: Temporal.Instant;
    }
  | {
      epochTime: Temporal.Duration;
    }
  | {
      relativeTime: Temporal.Duration;
    }
  // CommandComplete
  | {}
);

export interface CommandSeqJson<A extends ArgType[] = ArgType[]> {
  args: A;
  stem: string;
  time: SeqJsonTimeType;
  type: 'command';
  metadata: Record<string, unknown>;
}

export type ArgType = boolean | string | number;
export type Arrayable<T> = T | Arrayable<T>[];

export interface SequenceSeqJson {
  id: string;
  metadata: Record<string, any>;
  steps: CommandSeqJson[];
}

declare global {
  class Command<A extends ArgType[] | { [argName: string]: any } = [] | {}> {
    public static new<A extends any[] | { [argName: string]: any }>(opts: CommandOptions<A>): Command<A>;

    public toSeqJson(): CommandSeqJson;

    public absoluteTiming(absoluteTime: Temporal.Instant): Command<A>;

    public epochTiming(epochTime: Temporal.Duration): Command<A>;

    public relativeTiming(relativeTime: Temporal.Duration): Command<A>;
  }
  type Context = {};
  type ExpansionReturn = Arrayable<Command>;

  type U<BitLength extends 8 | 16 | 32 | 64> = number;
  type U8 = U<8>;
  type U16 = U<16>;
  type U32 = U<32>;
  type U64 = U<64>;
  type I<BitLength extends 8 | 16 | 32 | 64> = number;
  type I8 = I<8>;
  type I16 = I<16>;
  type I32 = I<32>;
  type I64 = I<64>;
  type VarString<PrefixBitLength extends number, MaxBitLength extends number> = string;
  type F<BitLength extends 32 | 64> = number;
  type F32 = F<32>;
  type F64 = F<64>;

  // @ts-ignore : 'Commands' found in generated code
  function A(...args: [TemplateStringsArray, ...string[]]): typeof Commands;
  // @ts-ignore : 'Commands' found in generated code
  function A(absoluteTime: Temporal.Instant): typeof Commands;
  // @ts-ignore : 'Commands' found in generated code
  function A(timeDOYString: string): typeof Commands;

  // @ts-ignore : 'Commands' found in generated code
  function R(...args: [TemplateStringsArray, ...string[]]): typeof Commands;
  // @ts-ignore : 'Commands' found in generated code
  function R(duration: Temporal.Duration): typeof Commands;
  // @ts-ignore : 'Commands' found in generated code
  function R(timeHMSString: string): typeof Commands;

  // @ts-ignore : 'Commands' found in generated code
  function E(...args: [TemplateStringsArray, ...string[]]): typeof Commands;
  // @ts-ignore : 'Commands' found in generated code
  function E(duration: Temporal.Duration): typeof Commands;
  // @ts-ignore : 'Commands' found in generated code
  function E(timeHMSString: string): typeof Commands;

  // @ts-ignore : 'Commands' found in generated code
  const C: typeof Commands;
}

const DOY_REGEX = /(\d{4})-(\d{3})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?/;
const HMS_REGEX = /(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?/;

export class Command<
  A extends ArgType[] | { [argName: string]: any } = [] | {},
  M extends Record<string, any> = Record<string, any>,
> {
  public readonly stem: string;
  public readonly metadata: M;
  public readonly arguments: A;
  public readonly absoluteTime: Temporal.Instant | null = null;
  public readonly epochTime: Temporal.Duration | null = null;
  public readonly relativeTime: Temporal.Duration | null = null;

  private constructor(opts: CommandOptions<A, M>) {
    this.stem = opts.stem;
    this.arguments = opts.arguments;
    this.metadata = opts.metadata ?? ({} as M);
    if ('absoluteTime' in opts) {
      this.absoluteTime = opts.absoluteTime;
    } else if ('epochTime' in opts) {
      this.epochTime = opts.epochTime;
    } else if ('relativeTime' in opts) {
      this.relativeTime = opts.relativeTime;
    }
  }

  public static new<A extends any[] | { [argName: string]: any }>(opts: CommandOptions<A>): Command<A> {
    if ('absoluteTime' in opts) {
      return new Command<A>({
        ...opts,
        absoluteTime: opts.absoluteTime,
      });
    } else if ('epochTime' in opts) {
      return new Command<A>({
        ...opts,
        epochTime: opts.epochTime,
      });
    } else if ('relativeTime' in opts) {
      return new Command<A>({
        ...opts,
        relativeTime: opts.relativeTime,
      });
    } else {
      return new Command<A>(opts);
    }
  }

  public toSeqJson(): CommandSeqJson {
    return {
      args: typeof this.arguments == 'object' ? Object.values(this.arguments) : this.arguments,
      stem: this.stem,
      time:
        this.absoluteTime !== null
          ? { type: TimingTypes.ABSOLUTE, tag: Command.instantToDoy(this.absoluteTime) }
          : this.epochTime !== null
          ? { type: TimingTypes.EPOCH_RELATIVE, tag: Command.durationToHms(this.epochTime) }
          : this.relativeTime !== null
          ? { type: TimingTypes.COMMAND_RELATIVE, tag: Command.durationToHms(this.relativeTime) }
          : { type: TimingTypes.COMMAND_COMPLETE },
      type: 'command',
      metadata: this.metadata,
    };
  }

  public static fromSeqJson<A extends ArgType[]>(json: CommandSeqJson<A>): Command<A> {
    const timeValue =
      json.time.type === TimingTypes.ABSOLUTE
        ? { absoluteTime: doyToInstant(json.time.tag) }
        : json.time.type === TimingTypes.COMMAND_RELATIVE
        ? { relativeTime: hmsToDuration(json.time.tag) }
        : json.time.type === TimingTypes.EPOCH_RELATIVE
        ? { epochTime: hmsToDuration(json.time.tag) }
        : {};

    return Command.new<A>({
      stem: json.stem,
      arguments: json.args as A,
      metadata: json.metadata,
      ...timeValue,
    });
  }

  public absoluteTiming(absoluteTime: Temporal.Instant): Command<A> {
    return Command.new({
      stem: this.stem,
      arguments: this.arguments,
      absoluteTime: absoluteTime,
    });
  }

  public epochTiming(epochTime: Temporal.Duration): Command<A> {
    return Command.new({
      stem: this.stem,
      arguments: this.arguments,
      epochTime: epochTime,
    });
  }

  public relativeTiming(relativeTime: Temporal.Duration): Command<A> {
    return Command.new({
      stem: this.stem,
      arguments: this.arguments,
      relativeTime: relativeTime,
    });
  }

  /** YYYY-DOYTHH:MM:SS.sss */
  private static instantToDoy(time: Temporal.Instant): DOY_STRING {
    const utcZonedDate = time.toZonedDateTimeISO('UTC');
    const YYYY = this.formatNumber(utcZonedDate.year, 4);
    const DOY = this.formatNumber(utcZonedDate.dayOfYear, 3);
    const HH = this.formatNumber(utcZonedDate.hour, 2);
    const MM = this.formatNumber(utcZonedDate.minute, 2);
    const SS = this.formatNumber(utcZonedDate.second, 2);
    const sss = this.formatNumber(utcZonedDate.millisecond, 3);
    return \`$\{YYYY\}-$\{DOY\}T$\{HH\}:$\{MM\}:$\{SS\}.$\{sss\}\` as DOY_STRING;
  }

  /** HH:MM:SS.sss */
  private static durationToHms(time: Temporal.Duration): HMS_STRING {
    const HH = this.formatNumber(time.hours, 2);
    const MM = this.formatNumber(time.minutes, 2);
    const SS = this.formatNumber(time.seconds, 2);
    const sss = this.formatNumber(time.milliseconds, 3);

    return \`$\{HH\}:$\{MM\}:$\{SS\}.$\{sss\}\` as HMS_STRING;
  }

  private static formatNumber(number: number, size: number): string {
    return number.toString().padStart(size, '0');
  }
}

export interface SequenceOptions {
  seqId: string;
  metadata: Record<string, any>;
  commands: Command[];
}

export class Sequence {
  public readonly seqId: string;
  public readonly metadata: Record<string, any>;
  public readonly commands: Command[];

  private constructor(opts: SequenceOptions) {
    this.seqId = opts.seqId;
    this.metadata = opts.metadata;
    this.commands = opts.commands;
  }

  public static new(opts: SequenceOptions): Sequence {
    return new Sequence(opts);
  }

  public toSeqJson(): SequenceSeqJson {
    return {
      id: this.seqId,
      metadata: this.metadata,
      steps: this.commands.map(c => c.toSeqJson()),
    };
  }

  public static fromSeqJson(json: SequenceSeqJson): Sequence {
    return Sequence.new({
      seqId: json.id,
      metadata: json.metadata,
      commands: json.steps.map(c => Command.fromSeqJson(c)),
    });
  }
}

//helper functions

function doyToInstant(doy: DOY_STRING): Temporal.Instant {
  const match = doy.match(DOY_REGEX);
  if (match === null) {
    throw new Error(\`Invalid DOY string: $\{doy\}\`);
  }
  const [, year, doyStr, hour, minute, second, millisecond] = match as [
    unknown,
    string,
    string,
    string,
    string,
    string,
    string | undefined,
  ];

  //use to convert doy to month and day
  const doyDate = new Date(parseInt(year, 10), 0, parseInt(doyStr, 10));
  // convert to UTC Date
  const utcDoyDate = new Date(
    Date.UTC(
      doyDate.getUTCFullYear(),
      doyDate.getUTCMonth(),
      doyDate.getUTCDate(),
      doyDate.getUTCHours(),
      doyDate.getUTCMinutes(),
      doyDate.getUTCSeconds(),
      doyDate.getUTCMilliseconds(),
    ),
  );

  return Temporal.ZonedDateTime.from({
    year: parseInt(year, 10),
    month: utcDoyDate.getUTCMonth() + 1,
    day: utcDoyDate.getUTCDate(),
    hour: parseInt(hour, 10),
    minute: parseInt(minute, 10),
    second: parseInt(second, 10),
    millisecond: parseInt(millisecond ?? '0', 10),
    timeZone: 'UTC',
  }).toInstant();
}

function hmsToDuration(hms: HMS_STRING): Temporal.Duration {
  const match = hms.match(HMS_REGEX);
  if (match === null) {
    throw new Error(\`Invalid HMS string: $\{hms\}\`);
  }
  const [, hours, minutes, seconds, milliseconds] = match as [unknown, string, string, string, string | undefined];
  return Temporal.Duration.from({
    hours: parseInt(hours, 10),
    minutes: parseInt(minutes, 10),
    seconds: parseInt(seconds, 10),
    milliseconds: parseInt(milliseconds ?? '0', 10),
  });
}

// @ts-ignore : Used in generated code
function A(...args: [TemplateStringsArray, ...string[]] | [Temporal.Instant] | [string]): typeof Commands {
  let time: Temporal.Instant;
  if (Array.isArray(args[0])) {
    time = doyToInstant(String.raw(...(args as [TemplateStringsArray, ...string[]])) as DOY_STRING);
  } else if (typeof args[0] === 'string') {
    time = doyToInstant(args[0] as DOY_STRING);
  } else {
    time = args[0] as Temporal.Instant;
  }

  return commandsWithTimeValue(time, TimingTypes.ABSOLUTE);
}

// @ts-ignore : Used in generated code
function R(...args: [TemplateStringsArray, ...string[]] | [Temporal.Duration] | [string]): typeof Commands {
  let duration: Temporal.Duration;
  if (Array.isArray(args[0])) {
    duration = hmsToDuration(String.raw(...(args as [TemplateStringsArray, ...string[]])) as HMS_STRING);
  } else if (typeof args[0] === 'string') {
    duration = hmsToDuration(args[0] as HMS_STRING);
  } else {
    duration = args[0] as Temporal.Duration;
  }

  return commandsWithTimeValue(duration, TimingTypes.COMMAND_RELATIVE);
}

// @ts-ignore : Used in generated code
function E(...args: [TemplateStringsArray, ...string[]] | [Temporal.Duration] | [string]): typeof Commands {
  let duration: Temporal.Duration;
  if (Array.isArray(args[0])) {
    duration = hmsToDuration(String.raw(...(args as [TemplateStringsArray, ...string[]])) as HMS_STRING);
  } else if (typeof args[0] === 'string') {
    duration = hmsToDuration(args[0] as HMS_STRING);
  } else {
    duration = args[0] as Temporal.Duration;
  }
  return commandsWithTimeValue(duration, TimingTypes.EPOCH_RELATIVE);
}

function commandsWithTimeValue<T extends TimingTypes>(
  timeValue: Temporal.Instant | Temporal.Duration,
  timeType: T,
  // @ts-ignore : 'Commands' found in generated code
): typeof Commands {
  // @ts-ignore : 'Commands' found in generated code
  return Object.keys(Commands).reduce((accum, key) => {
    // @ts-ignore : 'Commands' found in generated code
    const command = Commands[key as keyof Commands];
    if (typeof command === 'function') {
      if (timeType === TimingTypes.ABSOLUTE) {
        accum[key] = (...args: Parameters<typeof command>): typeof command => {
          return command(...args).absoluteTiming(timeValue);
        };
      } else if (timeType === TimingTypes.COMMAND_RELATIVE) {
        accum[key] = (...args: Parameters<typeof command>): typeof command => {
          return command(...args).relativeTiming(timeValue);
        };
      } else {
        accum[key] = (...args: Parameters<typeof command>): typeof command => {
          return command(...args).epochTiming(timeValue);
        };
      }
    } else {
      if (timeType === TimingTypes.ABSOLUTE) {
        accum[key] = command.absoluteTiming(timeValue);
      } else if (timeType === TimingTypes.COMMAND_RELATIVE) {
        accum[key] = command.relativeTiming(timeValue);
      } else {
        accum[key] = command.epochTiming(timeValue);
      }
    }
    return accum;
    // @ts-ignore : 'Commands' found in generated code
  }, {} as typeof Commands);
}

// @ts-ignore
function orderCommandArguments(args: { [argName: string]: any }, order: string[]): any {
  return order.map(key => args[key]);
}

// @ts-ignore: Used in generated code
function findAndOrderCommandArguments(
  commandName: string,
  args: { [argName: string]: any },
  argumentOrders: string[][],
): any {
  for (const argumentOrder of argumentOrders) {
    if (argumentOrder.length === Object.keys(args).length) {
      let difference = argumentOrder
        .filter((value: string) => !Object.keys(args).includes(value))
        .concat(Object.keys(args).filter((value: string) => !argumentOrder.includes(value))).length;

      // found correct argument order to apply
      if (difference === 0) {
        return orderCommandArguments(args, argumentOrder);
      }
    }
  }
  throw new Error(\`Could not find correct argument order for command: $\{commandName\}\`);
}


`
	);

	return samples;
});
