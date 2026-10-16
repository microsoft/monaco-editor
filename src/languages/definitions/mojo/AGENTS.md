# Mojo language support

This is the authoritative maintenance and reference document for Mojo support
in this directory. It contains the release pin, source mapping, adaptations, test
ownership, upstream coverage and verification workflow. Contributors and agents
use the same document. Keep facts and maintenance decisions here so there is
no second copy to synchronize.

## Pinned upstream

The syntax target is **Mojo 1.1.0**, using the compiler implementation at
[`mojo/v1.1.0`](https://github.com/modular/modular/tree/c6fa49f712fe15c99d0461ad2baaf2a15cbc58ce/Mojo)
(`c6fa49f712fe15c99d0461ad2baaf2a15cbc58ce`). Upstream source and tests are references;
their files are not bundled here. The tests use independently authored examples
of the behaviors exercised upstream.

## Goal and scope

- Follow the compiler implementation at the release pin above. Do not silently
  track nightly or a newer release. Read the mapped source/header and relevant
  upstream tests before changing language behavior.
- Preserve upstream structure, terminology, definition order and behavior within
  highlighting scope so future contributors can compare implementations directly.
  The Monarch adaptation is maintained manually; upstream implementation files
  are not included.
- Monarch provides lexical highlighting and limited contextual recognition.
  Helpers named after parser routines do not construct an AST or implement type
  checking, compiler diagnostics or execution semantics. Language services such
  as completion and navigation are a separate, currently unimplemented phase.
- Follow the repository contribution guide and Prettier configuration. Resolve
  the guide's historical paths against the current `src/languages/definitions`
  layout rather than introducing obsolete paths or wiring.

## Source structure and conventions

- Keep the source modules flat with lower camel case filenames. Preserve the
  source mapping below to the upstream token tables, lexer, parser base, expressions,
  statements and signatures. Keep editor configuration and assembly in `mojo.ts`
  and language identity/lazy loading in `register.ts`.
- Retain mapped upstream routine names and concepts where idiomatic TypeScript
  permits, including full names such as `lexInteger`. Follow the respective
  upstream file's definition and dispatch order where Monarch permits.
- Preserve observable language behavior when restructuring. Monarch first-match
  priority, line-based state handling and live-edit recovery sometimes require
  different grouping or order. Comment each necessary adaptation beside its rules:
  identify the upstream routine/concept, the reason and its scope. Update the
  source map or adaptation notes here when a mapping or significant adaptation changes.
- Prefer documented Monarch mechanisms and repository idioms. Use standard token
  categories and inherited defaults unless Mojo requires a different setting.
  Do not add explicit defaults, parser machinery or abstractions without a need.
  A proposed simplification must account for both behavior and upstream
  traceability; shorter code alone does not justify losing either.
- Maintain `tokenKinds.ts` by hand against pinned `TokenKinds.def`, preserving
  punctuation and keyword definition order. Exclude developer-only `__mojo_crash`;
  the production spelling of `TOK_KEYWORD(not )` is `not`.
- Do not add upstream-extraction generators, build-time preprocessing, vendored
  source/test corpora, or compiler/checkout dependencies for ordinary builds/tests.
  Existing runtime rule-assembly helpers are local Monarch adapters.

### State-maintenance contracts

- Named includes share rules; state transitions retain context. Preserve these
  distinctions and the state suffix contracts when changing helpers.
- Header states registered in `parserBase.ts` use `.context.indentation` suffixes.
  `parseIdentifier` additionally carries its destination before those suffixes.
  New header phases must participate in continuation handling where appropriate.
- `continuedBody` rewrites only direct two-element tuples whose expanded action
  contains `@rematch` and `switchTo` targeting a state in the `headers` registry.
  It preserves the destination's `.context.indentation` suffixes. Equivalent
  expanded rule objects, nested case actions, includes or three-element tuples
  are not automatically rewritten.
  Do not change such handoff forms without updating the adapter and verifying
  unindented/chained continuation behavior. An equivalent Monarch spelling is
  not necessarily equivalent input to this local helper.
- Check multiline state retention and exits, baseline indentation, delimiters,
  raw-string handling and incomplete-code recovery. Complete single-line
  tokenization alone does not establish correctness.

## Source mapping, order and adaptations

The modules live directly in this language directory, using the repository’s
lower camel case filenames. Each maps to its upstream counterpart:

| Local file       | Upstream reference under `Mojo/`                                                                |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| `tokenKinds.ts`  | `include/Mojo/MojoParser/TokenKinds.def`, in definition order                                   |
| `lexer.ts`       | `lib/MojoParser/Lexer.cpp`, in function order                                                   |
| `parserBase.ts`  | `lib/MojoParser/ParserBase.{h,cpp}`: identifiers, indentation, plus shared Monarch adapters     |
| `parserExprs.ts` | `lib/MojoParser/ParserExprs.cpp`: function types, lambdas, balanced expression lists            |
| `parserStmts.ts` | `lib/MojoParser/ParserStmts.cpp`: decorators and declaration dispatch                           |
| `signatures.ts`  | `lib/MojoParser/Signatures.cpp`: arguments, constraints, parameters, captures, effects, results |
| `mojo.ts`        | Monaco editing configuration and assembly of those rule groups                                  |

The rule names track the upstream routines. An `include` groups rules without
changing context; a state transition retains context across tokens and lines.
The small `continued_` adapters implement the lexer's backslash line splicing.
Shared declaration handling covers structs, traits, extensions, classes and aliases.
Whitespace, escape, operand, and tail helpers split upstream routines into
smaller Monarch groups; they are local adapters rather than additional parsing
stages in the compiler.

Mapped rule groups retain upstream routine names where unambiguous, including
`lexInteger`. Class-qualified methods use descriptive names: `parseArgument`
maps to `ParsedArgument::parse()` and `parseConstraint` to
`ParsedConstraint::parse()`. The local `softIdentifier` helper adapts
`ParserBase::consumeIfSoftIdentifier()`. Regex attributes use idiomatic TypeScript
spellings of the same concepts, such as `escapedIdentifier` for
`Token::escaped_identifier` and `digitPart` for
`digitpart`. String-state labels `short` and `long` follow the lexer grammar's
`shortstring` and `longstring` terminology. `declarationHeader` is explicitly
local: it covers both value/type aliases and type declarations. Monaco token
categories and state-management helpers retain their framework terminology.

The mapped definitions have been checked against the pinned source order:

- `tokenKinds.ts`: punctuation, then production keywords, with each table in
  definition order.
- `lexer.ts`: token dispatch, identifiers, escaped identifiers, comments,
  quote delimiters, Unicode escapes, string bodies and opening, template
  interpolation and bodies, template opening, integers, then floats.
- `parserBase.ts`: the header's soft-identifier helper; then the implementation's
  identifier parsing and indentation handling. Shared Monarch boundary and
  continuation adapters follow those source-mapped definitions.
- `parserExprs.ts`: infix-operator recognition, function types, lambdas, then
  expression lists. The expression-list helper is defined in this upstream file
  even though it belongs to the C++ `ParserBase` class.
- `parserStmts.ts`: decorators, statement dispatch, comptime dispatch, function
  declarations, then the shared type-declaration adapter. Dispatch alternatives
  follow the upstream switch order.
- `signatures.ts`: arguments, argument/parameter lists, constraints, parameters,
  trailing constraints, captures, effects, then results. Argument conventions,
  capture conventions, and effect alternatives follow their respective branches.

Monarch's first-match behavior requires a few ordering adjustments:

- Declaration dispatch captures indentation before whitespace is consumed.
- String-prefix dispatch precedes identifiers, as it does in `lexToken()`.
  Raw and ordinary openings share one group, so that group is included early
  to give raw prefixes priority over identifiers.
- Triple quotes and longer punctuation spellings precede their shorter forms.
- The `*`, `/`, and `>` punctuation branches preserve upstream's earlier
  assignment check before the disjoint repeated-symbol alternatives.
- `lexFloat()` is tried in the dot branch before integer fallback.
- Malformed exponents precede otherwise valid numeric prefixes.
- Valid escapes precede catch-all invalid escapes; closing quotes precede
  generic quote content. Scope terminators precede expression fallback rules.

Line continuation also tolerates an unfinished backslash at line end for live
editing. Monaco splits LF, CRLF, and CR input into lines before tokenization.
The unexpected-character fallback uses `[\s\S]` to include U+2028/U+2029;
JavaScript's dot would leave these characters unclassified.
Comptime `elif`/`else` exits likewise provide recovery rather than compiler
validation. The symbolic operator recognizer tracks expression boundaries,
including incomplete code; it does not implement `InfixInfo` classification.
For example, upstream's lexer recognizes `<>` even though its expression parser
does not classify it as an infix operator.

Definition order and execution order are distinct: Monarch includes named groups
where they are needed, just as C++ calls routines declared elsewhere. This is a
source-order map of the implemented highlighting rules, not a translation of
every compiler routine or its parsing control flow.

The emitted categories use Monaco token families such as `keyword`, `identifier`,
`number`, `string`, `comment`, `operator`, and `delimiter`. Upstream
spellings that are recognized only to diagnose removed syntax, such as `fn`
and the contextual `read` convention, remain highlighted in those contexts.

## Stable behavior-based test organization

Keep the following five behavior categories stable. Add scenarios to the existing
suite that owns the behavior. Add a new flat suite only when a genuinely new
behavior category is introduced, and update the ownership table and source-to-suite
map here. Do not repartition suites merely to match source files or agent assignments.
Test filenames omit the language prefix because this directory supplies that context.

The groups are a local organization informed by upstream feature tests, not a
one-to-one mirror of upstream directories or source modules. Suites use explicit
inline fixtures and the existing repository test harness. Grammar
assertions exercise the assembled tokenizer as component/regression tests.
Matching filenames alone do not establish coverage of every rule or transition.
These suites include Monaco-specific incomplete-code recovery cases; they are
not uniformly upstream-only suites.

| Suite                  | Ownership                                                                         |
| ---------------------- | --------------------------------------------------------------------------------- |
| `lexer.test.ts`        | Whitespace, comments, identifiers, keywords, punctuation, numbers                 |
| `strings.test.ts`      | Ordinary/raw/triple strings, escapes, Unicode and recovery                        |
| `t-strings.test.ts`    | Template interpolation, nesting, raw templates and recovery                       |
| `signatures.test.ts`   | Arguments, parameters, captures, constraints, effects, function types and lambdas |
| `declarations.test.ts` | Decorators, declarations, statement contexts and header continuations/recovery    |

Keep cross-feature snippets intact in the suite owning their principal behavior.
Use the source-to-suite map below to find related coverage; the map is navigation,
not a completeness claim.

### Local regression suite

Keep newly discovered local bugs in `regression.test.ts`, separate from the five
feature suites. This is a provenance-based exception, not a new language-feature
category. Preserve the five existing suites rather than moving or duplicating their
baseline cases merely to enforce an upstream-only interpretation.

Before placing a new regression, inspect relevant tests at the upstream pin.
If an existing upstream test covers the same behavior, adapt it in the appropriate
feature suite and record the reference. Otherwise, keep the local reproduction in
`regression.test.ts` and document the discovered failure, expected behavior and
search scope. Similar syntax alone does not establish equivalent test coverage;
compare the observable behavior exercised by each test.

Local regressions cover unexpected U+2028/U+2029 characters and
`where` as an ordinary or escaped identifier after `comptime assert`. The pinned
parser test tree, `Mojo/test/mojo-integration/unicode.mojo` and formatter
`Mojo/tools/mblack/tests/data/simple_cases/tricky_unicode_symbols.mojo` were
searched for these characters, Unicode escape spellings and the
assertion/identifier combination. No equivalent cases were found in that scope.
`statements/comptime_assert.mojo` tests assertion expressions and messages, so
that general syntax belongs in `declarations.test.ts`; the specific contextual
`where` misclassification remains a local regression.

### Source-to-suite navigation

The following map locates the primary suites for each source module. Shared
rules are also exercised through cross-feature scenarios; this is a navigation
map, not a claim that every rule or state transition has been covered.

| Source                   | Primary test suites                                                                                            |
| ------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `tokenKinds.ts`          | `lexer.test.ts`                                                                                                |
| `lexer.ts`               | `lexer.test.ts`, `strings.test.ts`, `t-strings.test.ts`; local Unicode-separator cases in `regression.test.ts` |
| `parserBase.ts`          | `signatures.test.ts`, `declarations.test.ts`                                                                   |
| `parserExprs.ts`         | `signatures.test.ts`                                                                                           |
| `parserStmts.ts`         | `declarations.test.ts`; local assertion/identifier cases in `regression.test.ts`                               |
| `signatures.ts`          | `signatures.test.ts`, `declarations.test.ts`                                                                   |
| `mojo.ts`, `register.ts` | All tokenization suites exercise language registration, lazy loading and grammar assembly                      |

## Translating upstream scenarios

- Inspect the pinned upstream tests for the behavior being changed. Prefer their
  existing scenarios and useful case ordering over inventing unrelated examples.
  Reduce/adapt snippets to the syntax needed for an observable Monaco assertion.
- Small upstream snippets may be reused where appropriate; record their origin
  and retain applicable attribution/license notices. Translating copied material
  does not remove those obligations. Do not copy the complete test corpus or
  upstream expected diagnostics/IR. Existing examples are independently authored.
- Record exact upstream file paths and selected cases/sections in the coverage record below,
  including relevant exclusions. Mark scenarios that come directly from compiler
  source and editor-only additions separately. File-level references do not imply
  complete coverage of that file or compiler conformance.
- Use the existing `../test/testRunner` harness with explicit inline token objects.
  Do not import internal `monaco-editor-core` modules in these grammar tests.
  Expected categories are Monaco highlighting decisions, not upstream token-kind
  names. Specify them independently of production regexes/tables and actual
  tokenizer output; do not generate expected results by running the implementation.
- Assert UTF-16 offsets. Adjacent tokens with the same category coalesce, so an
  assertion cannot necessarily distinguish their underlying lexical boundaries.
  Each inner fixture array is an independent snippet; lines inside it retain state.
- Cover normal syntax, lexical boundaries, contextual names, multiline transitions
  and unfinished-code recovery. Compiler diagnostics, ASTs, IR, decoded values,
  types, execution and semantic validity are outside these assertions.
- When source, documentation and expected behavior appear to disagree, check the
  pinned source and, when available, the same-version compiler. Investigate a
  failure before changing expectations; document intentional highlighter limits.
  A locally installed compiler is an optional investigation tool, not a test dependency.

## Upstream test references and scope

The following files were inspected at the release pin above. Paths are relative
to `Mojo/test/mojo-parser/`. Every reference represents **selected scenarios**,
not complete coverage of that upstream file.

### Lexical references

- `lexer_errors.mojo`: unexpected punctuation, unfinished escaped identifiers,
  leading-zero numbers, missing base digits and malformed exponents.
- `identifier_source_range.mojo`: escaped punctuation and MLIR-style names;
  assertions concern token offsets rather than compiler diagnostic ranges.
- `exprs/literals.mojo`: selected numeric and ordinary-string examples in
  `var_let_decls`; evaluation, IR and collection construction are excluded.
- `punctuation_tokens.mojo`: the complete punctuation spelling inventory.
- `vertical_whitespace.mojo`: explicit backslash continuation;
  declaration/import placement restrictions are excluded.
- `lexical_errors.mojo` was inspected for scope; its indentation, declaration,
  decorator and mismatched-bracket diagnostics are not lexer assertions here.

Additional identifier, keyword, comment and numeric boundaries follow
`Lexer.cpp` and `TokenKinds.def` directly. Continuation with horizontal whitespace
after the backslash follows `Lexer.cpp`, rather than `vertical_whitespace.mojo`.

### Ordinary-string references

- `exprs/string_literal_errors.mojo`: octal lengths, invalid/truncated escapes,
  Unicode range/surrogates and unsupported named escapes.
- `exprs/string_literal_unicode.mojo`: width boundaries, mixed text/escapes and
  raw Unicode spellings. These assert spans, not decoded UTF-8 values.
- `exprs/literals.mojo`: the ordinary string in `var_let_decls` only.

Monaco-specific additions exercise UTF-16 offsets after emoji, quote boundaries,
short-string line recovery, continuations and unfinished triple strings.

### Template-string references

- `t-strings/basic.mojo`, `test_t_strings`: empty/literal, adjacent and multiple
  interpolation, arithmetic/boolean expressions, braces, triple quotes, call
  arguments and nested templates.
- `t-strings/edge_cases.mojo`, `test_edge_cases`: cases 1–2, 4, 7–8, 11–18,
  20–22 and 24–25 inform brace runs, nested delimiters, multiline text and
  same/mixed inner quotes.
- `t-strings/raw.mojo`, `test_raw_t_strings`: prefix/quote variants, literal
  backslashes, interpolation after a backslash, braces, triples, adjacent
  interpolation and mixed raw/cooked concatenation (`s19`). Raw-only
  concatenation semantics (`s18`) are excluded.
- `t-strings/unicode.mojo`, `test_tstring_unicode`: escape spans around
  interpolation, BMP/supplementary escapes and escaped-backslash boundaries.
- `t-strings/errors.mojo`: lexical categories in empty/incomplete expressions,
  lone closing braces, short-string recovery and invalid Unicode escapes.

Format-spec validation, expression validity, stress quantities, materialization
and evaluation remain compiler concerns. The complete prefix/quote matrix follows
`lexTString()`. Monaco-specific cases check UTF-16 offsets after a literal emoji,
incomplete interpolation and resumption of root tokens.

### Declaration references

- `decls/decorators/decorators.mojo`: initial name-only, stacked and call decorators.
- `decls/decorators/decorators_errors.mojo`: initial malformed expressions and
  unexpected trailing tokens, asserting lexical recovery rather than diagnostics.
- `decls/keyword_fn_names.mojo`: keyword function/method names, especially `class`.
- `decls/alias/comptime_keyword.mojo`: simple and typed comptime declarations.
- `decls/structs.mojo`: basic and parametric headers.
- `decls/traits.mojo`: initial trait/method declarations.
- `decls/struct_extensions.mojo`: extension headers.
- `decls/body_constraint_deferral.mojo`: initial multiline function/struct
  headers and trailing constraints.
- `statements/comptime_if.mojo`: basic if/elif/else dispatch.
- `statements/comptime_for.mojo`: basic comptime-for dispatch.
- `statements/comptime_assert.mojo`, `test_assert_with_message`: assertion
  expressions and optional messages. Compiler assumption propagation is excluded.

Tabs, baseline resets, explicit continuation tolerance, unfinished headers and
cross-feature recovery are Monaco-specific cases. Decorator application order,
ownership, conformance, synthesis and execution are excluded.

### Signature references

- `decls/imm_convention.mojo`: argument/capture `imm`, removed `read` spelling,
  and ordinary parameter names versus argument conventions.
- `parameters.mojo`: input/default parameters, positional-only `/`, infer-only
  `//`, variadics and origin-bearing arguments.
- `decls/variadic_kwargs.mojo`: owned `var **kwargs` signatures.
- `decls/body_constraint_deferral.mojo`: trailing constraints and contextual
  `where` boundaries.
- `decls/where_message.mojo`: parenthesized condition/message pairs; an additional
  Unicode message asserts UTF-16 offsets.
- `closures/capture_lists.mojo`: named/default captures, mixed conventions,
  reference captures, move markers and trailing commas.
- `closures/capture_lists_parser_errors.mojo`: conflicting duplicate captures
  remain lexically highlightable; capture validation is excluded.
- `function_types_errors.mojo`: callable conventions, raising types and C ABI
  function types, without conversion diagnostics.
- `decls/fn_type_where.mojo`: thin generic function types with trailing constraints
  and parenthesized callable result boundaries.
- `exprs/lambda.mojo`: typed/variadic arguments, captures and combined
  parameter, convention, effect and result syntax.

Lambda default arguments are accepted by the pinned parser and Mojo 1.1.0, but
are not asserted by this suite. Default arguments on function declarations are
covered separately; default capture conventions are not default arguments.
No lambda default-argument cases were found in the inspected parser and
integration lambda tests, `Mojo/tools/mblack/tests/test_lambda.py`, or executable
documentation examples under `Mojo/docs/site/code/{manual/functions/lambda,reference/lambda-expressions}`.

Recognized effects and escaped spellings, thrown-type primaries, reference
results, nested callables and unfinished lambda arguments also follow the
mapped source routines. `decls/fn_type_where_errors.mojo` and
`parameters_errors.mojo` were inspected for scope; they add no coverage claim.
Capture semantics, inference, conversions and constraint proof are excluded.

### Highlighting scope and limitations

These suites do not assert compiler diagnostics, ASTs, IR, type checking,
conformance, overload resolution, decoded literal values, name lookup or execution.
Nested delimiters and partial declarations are handled permissively for editing.
In particular, parameter lists are balanced expressions: diagnostic recovery and
contextual coloring for removed per-parameter `where` clauses are outside their
scope. Supported trailing constraints are covered. Recognizing selected legacy
spellings does not promise parity with every compiler error-recovery path.

## Coordinating parallel work

When work is delegated, assign disjoint suite/file ownership. Implementers edit
only their assigned files and report source defects to the coordinator. The
coordinator owns source fixes, shared harness changes and documentation. Reviewers
remain read-only unless explicitly assigned implementation work.

Request shared changes from the coordinator rather than editing another owner's
files or inventing a shared utility. Use repository precedent first. If a proposed
new shared abstraction has no precedent, discuss it with the user before adding
it. The coordinator implements agreed shared changes and informs affected owners.

## Verification and reporting

Run checks from the repository root, selecting them according to the change.
For documentation-only edits, check formatting of the changed documents and run
`git diff --check`; grammar tests are unnecessary.

For source or test changes, run the affected suites. To run all Mojo suites:

```sh
node --import tsx --import ./test/test-setup.mjs --test src/languages/definitions/mojo/*.test.ts
```

Replace the glob with a suite filename for a targeted run. Check changed files
with Prettier; the following checks the whole Mojo directory:

```sh
./node_modules/.bin/prettier --check src/languages/definitions/mojo/*.ts src/languages/definitions/mojo/AGENTS.md
```

For source changes, also check TypeScript:

```sh
./node_modules/.bin/tsc --noEmit --emitDeclarationOnly false --target es2015 -p src
```

The ES2015 target above is a verification workaround for the existing unrelated
WGSL regular-expression error under the project's ES5 target. Disclose the
override in verification results; do not change the project target as part of
Mojo work. Reassess it if the repository configuration changes.

After behavior changes pass targeted checks, the coordinator runs the repository
grammar checks once through the existing script:

```sh
npm run test:grammars
```

When registration or samples change, use `npm test` to include sample verification
with the grammar checks.

Avoid duplicate integration runs by individual workers. Repeat checks only when
changes or failures require them. Report executed commands and results, changes
and reasons, upstream scenarios used, exclusions and unresolved findings. Validate
formatting with Prettier rather than inspection. Passing selected cases does not
establish complete coverage. Keep changes uncommitted unless the current task
requests committing/pushing.
