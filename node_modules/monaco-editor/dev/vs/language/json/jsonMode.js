"use strict";
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.40.0(83b3cf23ca80c94cccca7c5b3e48351b220f8e35)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/language/json/jsonMode", ["require"],(require)=>{
var moduleExports = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/fillers/monaco-editor-core-amd.ts
  var require_monaco_editor_core_amd = __commonJS({
    "src/fillers/monaco-editor-core-amd.ts"(exports, module) {
      var api = __toESM(__require("vs/editor/editor.api"));
      module.exports = api;
    }
  });

  // src/language/json/jsonMode.ts
  var jsonMode_exports = {};
  __export(jsonMode_exports, {
    CompletionAdapter: () => CompletionAdapter,
    DefinitionAdapter: () => DefinitionAdapter,
    DiagnosticsAdapter: () => DiagnosticsAdapter,
    DocumentColorAdapter: () => DocumentColorAdapter,
    DocumentFormattingEditProvider: () => DocumentFormattingEditProvider,
    DocumentHighlightAdapter: () => DocumentHighlightAdapter,
    DocumentLinkAdapter: () => DocumentLinkAdapter,
    DocumentRangeFormattingEditProvider: () => DocumentRangeFormattingEditProvider,
    DocumentSymbolAdapter: () => DocumentSymbolAdapter,
    FoldingRangeAdapter: () => FoldingRangeAdapter,
    HoverAdapter: () => HoverAdapter,
    ReferenceAdapter: () => ReferenceAdapter,
    RenameAdapter: () => RenameAdapter,
    SelectionRangeAdapter: () => SelectionRangeAdapter,
    WorkerManager: () => WorkerManager,
    fromPosition: () => fromPosition,
    fromRange: () => fromRange,
    setupMode: () => setupMode,
    toRange: () => toRange,
    toTextEdit: () => toTextEdit
  });

  // src/fillers/monaco-editor-core.ts
  var monaco_editor_core_exports = {};
  __reExport(monaco_editor_core_exports, __toESM(require_monaco_editor_core_amd()));

  // src/language/json/workerManager.ts
  var STOP_WHEN_IDLE_FOR = 2 * 60 * 1e3;
  var WorkerManager = class {
    _defaults;
    _idleCheckInterval;
    _lastUsedTime;
    _configChangeListener;
    _worker;
    _client;
    constructor(defaults) {
      this._defaults = defaults;
      this._worker = null;
      this._client = null;
      this._idleCheckInterval = window.setInterval(() => this._checkIfIdle(), 30 * 1e3);
      this._lastUsedTime = 0;
      this._configChangeListener = this._defaults.onDidChange(() => this._stopWorker());
    }
    _stopWorker() {
      if (this._worker) {
        this._worker.dispose();
        this._worker = null;
      }
      this._client = null;
    }
    dispose() {
      clearInterval(this._idleCheckInterval);
      this._configChangeListener.dispose();
      this._stopWorker();
    }
    _checkIfIdle() {
      if (!this._worker) {
        return;
      }
      let timePassedSinceLastUsed = Date.now() - this._lastUsedTime;
      if (timePassedSinceLastUsed > STOP_WHEN_IDLE_FOR) {
        this._stopWorker();
      }
    }
    _getClient() {
      this._lastUsedTime = Date.now();
      if (!this._client) {
        this._worker = monaco_editor_core_exports.editor.createWebWorker({
          moduleId: "vs/language/json/jsonWorker",
          label: this._defaults.languageId,
          createData: {
            languageSettings: this._defaults.diagnosticsOptions,
            languageId: this._defaults.languageId,
            enableSchemaRequest: this._defaults.diagnosticsOptions.enableSchemaRequest
          }
        });
        this._client = this._worker.getProxy();
      }
      return this._client;
    }
    getLanguageServiceWorker(...resources) {
      let _client;
      return this._getClient().then((client) => {
        _client = client;
      }).then((_) => {
        if (this._worker) {
          return this._worker.withSyncedResources(resources);
        }
      }).then((_) => _client);
    }
  };

  // node_modules/vscode-languageserver-types/lib/esm/main.js
  var integer;
  (function(integer2) {
    integer2.MIN_VALUE = -2147483648;
    integer2.MAX_VALUE = 2147483647;
  })(integer || (integer = {}));
  var uinteger;
  (function(uinteger2) {
    uinteger2.MIN_VALUE = 0;
    uinteger2.MAX_VALUE = 2147483647;
  })(uinteger || (uinteger = {}));
  var Position;
  (function(Position3) {
    function create(line, character) {
      if (line === Number.MAX_VALUE) {
        line = uinteger.MAX_VALUE;
      }
      if (character === Number.MAX_VALUE) {
        character = uinteger.MAX_VALUE;
      }
      return { line, character };
    }
    Position3.create = create;
    function is(value) {
      var candidate = value;
      return Is.objectLiteral(candidate) && Is.uinteger(candidate.line) && Is.uinteger(candidate.character);
    }
    Position3.is = is;
  })(Position || (Position = {}));
  var Range;
  (function(Range3) {
    function create(one, two, three, four) {
      if (Is.uinteger(one) && Is.uinteger(two) && Is.uinteger(three) && Is.uinteger(four)) {
        return { start: Position.create(one, two), end: Position.create(three, four) };
      } else if (Position.is(one) && Position.is(two)) {
        return { start: one, end: two };
      } else {
        throw new Error("Range#create called with invalid arguments[" + one + ", " + two + ", " + three + ", " + four + "]");
      }
    }
    Range3.create = create;
    function is(value) {
      var candidate = value;
      return Is.objectLiteral(candidate) && Position.is(candidate.start) && Position.is(candidate.end);
    }
    Range3.is = is;
  })(Range || (Range = {}));
  var Location;
  (function(Location2) {
    function create(uri, range) {
      return { uri, range };
    }
    Location2.create = create;
    function is(value) {
      var candidate = value;
      return Is.defined(candidate) && Range.is(candidate.range) && (Is.string(candidate.uri) || Is.undefined(candidate.uri));
    }
    Location2.is = is;
  })(Location || (Location = {}));
  var LocationLink;
  (function(LocationLink2) {
    function create(targetUri, targetRange, targetSelectionRange, originSelectionRange) {
      return { targetUri, targetRange, targetSelectionRange, originSelectionRange };
    }
    LocationLink2.create = create;
    function is(value) {
      var candidate = value;
      return Is.defined(candidate) && Range.is(candidate.targetRange) && Is.string(candidate.targetUri) && (Range.is(candidate.targetSelectionRange) || Is.undefined(candidate.targetSelectionRange)) && (Range.is(candidate.originSelectionRange) || Is.undefined(candidate.originSelectionRange));
    }
    LocationLink2.is = is;
  })(LocationLink || (LocationLink = {}));
  var Color;
  (function(Color2) {
    function create(red, green, blue, alpha) {
      return {
        red,
        green,
        blue,
        alpha
      };
    }
    Color2.create = create;
    function is(value) {
      var candidate = value;
      return Is.numberRange(candidate.red, 0, 1) && Is.numberRange(candidate.green, 0, 1) && Is.numberRange(candidate.blue, 0, 1) && Is.numberRange(candidate.alpha, 0, 1);
    }
    Color2.is = is;
  })(Color || (Color = {}));
  var ColorInformation;
  (function(ColorInformation2) {
    function create(range, color) {
      return {
        range,
        color
      };
    }
    ColorInformation2.create = create;
    function is(value) {
      var candidate = value;
      return Range.is(candidate.range) && Color.is(candidate.color);
    }
    ColorInformation2.is = is;
  })(ColorInformation || (ColorInformation = {}));
  var ColorPresentation;
  (function(ColorPresentation2) {
    function create(label, textEdit, additionalTextEdits) {
      return {
        label,
        textEdit,
        additionalTextEdits
      };
    }
    ColorPresentation2.create = create;
    function is(value) {
      var candidate = value;
      return Is.string(candidate.label) && (Is.undefined(candidate.textEdit) || TextEdit.is(candidate)) && (Is.undefined(candidate.additionalTextEdits) || Is.typedArray(candidate.additionalTextEdits, TextEdit.is));
    }
    ColorPresentation2.is = is;
  })(ColorPresentation || (ColorPresentation = {}));
  var FoldingRangeKind;
  (function(FoldingRangeKind2) {
    FoldingRangeKind2["Comment"] = "comment";
    FoldingRangeKind2["Imports"] = "imports";
    FoldingRangeKind2["Region"] = "region";
  })(FoldingRangeKind || (FoldingRangeKind = {}));
  var FoldingRange;
  (function(FoldingRange2) {
    function create(startLine, endLine, startCharacter, endCharacter, kind) {
      var result = {
        startLine,
        endLine
      };
      if (Is.defined(startCharacter)) {
        result.startCharacter = startCharacter;
      }
      if (Is.defined(endCharacter)) {
        result.endCharacter = endCharacter;
      }
      if (Is.defined(kind)) {
        result.kind = kind;
      }
      return result;
    }
    FoldingRange2.create = create;
    function is(value) {
      var candidate = value;
      return Is.uinteger(candidate.startLine) && Is.uinteger(candidate.startLine) && (Is.undefined(candidate.startCharacter) || Is.uinteger(candidate.startCharacter)) && (Is.undefined(candidate.endCharacter) || Is.uinteger(candidate.endCharacter)) && (Is.undefined(candidate.kind) || Is.string(candidate.kind));
    }
    FoldingRange2.is = is;
  })(FoldingRange || (FoldingRange = {}));
  var DiagnosticRelatedInformation;
  (function(DiagnosticRelatedInformation2) {
    function create(location, message) {
      return {
        location,
        message
      };
    }
    DiagnosticRelatedInformation2.create = create;
    function is(value) {
      var candidate = value;
      return Is.defined(candidate) && Location.is(candidate.location) && Is.string(candidate.message);
    }
    DiagnosticRelatedInformation2.is = is;
  })(DiagnosticRelatedInformation || (DiagnosticRelatedInformation = {}));
  var DiagnosticSeverity;
  (function(DiagnosticSeverity2) {
    DiagnosticSeverity2.Error = 1;
    DiagnosticSeverity2.Warning = 2;
    DiagnosticSeverity2.Information = 3;
    DiagnosticSeverity2.Hint = 4;
  })(DiagnosticSeverity || (DiagnosticSeverity = {}));
  var DiagnosticTag;
  (function(DiagnosticTag2) {
    DiagnosticTag2.Unnecessary = 1;
    DiagnosticTag2.Deprecated = 2;
  })(DiagnosticTag || (DiagnosticTag = {}));
  var CodeDescription;
  (function(CodeDescription2) {
    function is(value) {
      var candidate = value;
      return candidate !== void 0 && candidate !== null && Is.string(candidate.href);
    }
    CodeDescription2.is = is;
  })(CodeDescription || (CodeDescription = {}));
  var Diagnostic;
  (function(Diagnostic2) {
    function create(range, message, severity, code, source, relatedInformation) {
      var result = { range, message };
      if (Is.defined(severity)) {
        result.severity = severity;
      }
      if (Is.defined(code)) {
        result.code = code;
      }
      if (Is.defined(source)) {
        result.source = source;
      }
      if (Is.defined(relatedInformation)) {
        result.relatedInformation = relatedInformation;
      }
      return result;
    }
    Diagnostic2.create = create;
    function is(value) {
      var _a;
      var candidate = value;
      return Is.defined(candidate) && Range.is(candidate.range) && Is.string(candidate.message) && (Is.number(candidate.severity) || Is.undefined(candidate.severity)) && (Is.integer(candidate.code) || Is.string(candidate.code) || Is.undefined(candidate.code)) && (Is.undefined(candidate.codeDescription) || Is.string((_a = candidate.codeDescription) === null || _a === void 0 ? void 0 : _a.href)) && (Is.string(candidate.source) || Is.undefined(candidate.source)) && (Is.undefined(candidate.relatedInformation) || Is.typedArray(candidate.relatedInformation, DiagnosticRelatedInformation.is));
    }
    Diagnostic2.is = is;
  })(Diagnostic || (Diagnostic = {}));
  var Command;
  (function(Command2) {
    function create(title, command) {
      var args = [];
      for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
      }
      var result = { title, command };
      if (Is.defined(args) && args.length > 0) {
        result.arguments = args;
      }
      return result;
    }
    Command2.create = create;
    function is(value) {
      var candidate = value;
      return Is.defined(candidate) && Is.string(candidate.title) && Is.string(candidate.command);
    }
    Command2.is = is;
  })(Command || (Command = {}));
  var TextEdit;
  (function(TextEdit2) {
    function replace(range, newText) {
      return { range, newText };
    }
    TextEdit2.replace = replace;
    function insert(position, newText) {
      return { range: { start: position, end: position }, newText };
    }
    TextEdit2.insert = insert;
    function del(range) {
      return { range, newText: "" };
    }
    TextEdit2.del = del;
    function is(value) {
      var candidate = value;
      return Is.objectLiteral(candidate) && Is.string(candidate.newText) && Range.is(candidate.range);
    }
    TextEdit2.is = is;
  })(TextEdit || (TextEdit = {}));
  var ChangeAnnotation;
  (function(ChangeAnnotation2) {
    function create(label, needsConfirmation, description) {
      var result = { label };
      if (needsConfirmation !== void 0) {
        result.needsConfirmation = needsConfirmation;
      }
      if (description !== void 0) {
        result.description = description;
      }
      return result;
    }
    ChangeAnnotation2.create = create;
    function is(value) {
      var candidate = value;
      return candidate !== void 0 && Is.objectLiteral(candidate) && Is.string(candidate.label) && (Is.boolean(candidate.needsConfirmation) || candidate.needsConfirmation === void 0) && (Is.string(candidate.description) || candidate.description === void 0);
    }
    ChangeAnnotation2.is = is;
  })(ChangeAnnotation || (ChangeAnnotation = {}));
  var ChangeAnnotationIdentifier;
  (function(ChangeAnnotationIdentifier2) {
    function is(value) {
      var candidate = value;
      return typeof candidate === "string";
    }
    ChangeAnnotationIdentifier2.is = is;
  })(ChangeAnnotationIdentifier || (ChangeAnnotationIdentifier = {}));
  var AnnotatedTextEdit;
  (function(AnnotatedTextEdit2) {
    function replace(range, newText, annotation) {
      return { range, newText, annotationId: annotation };
    }
    AnnotatedTextEdit2.replace = replace;
    function insert(position, newText, annotation) {
      return { range: { start: position, end: position }, newText, annotationId: annotation };
    }
    AnnotatedTextEdit2.insert = insert;
    function del(range, annotation) {
      return { range, newText: "", annotationId: annotation };
    }
    AnnotatedTextEdit2.del = del;
    function is(value) {
      var candidate = value;
      return TextEdit.is(candidate) && (ChangeAnnotation.is(candidate.annotationId) || ChangeAnnotationIdentifier.is(candidate.annotationId));
    }
    AnnotatedTextEdit2.is = is;
  })(AnnotatedTextEdit || (AnnotatedTextEdit = {}));
  var TextDocumentEdit;
  (function(TextDocumentEdit2) {
    function create(textDocument, edits) {
      return { textDocument, edits };
    }
    TextDocumentEdit2.create = create;
    function is(value) {
      var candidate = value;
      return Is.defined(candidate) && OptionalVersionedTextDocumentIdentifier.is(candidate.textDocument) && Array.isArray(candidate.edits);
    }
    TextDocumentEdit2.is = is;
  })(TextDocumentEdit || (TextDocumentEdit = {}));
  var CreateFile;
  (function(CreateFile2) {
    function create(uri, options, annotation) {
      var result = {
        kind: "create",
        uri
      };
      if (options !== void 0 && (options.overwrite !== void 0 || options.ignoreIfExists !== void 0)) {
        result.options = options;
      }
      if (annotation !== void 0) {
        result.annotationId = annotation;
      }
      return result;
    }
    CreateFile2.create = create;
    function is(value) {
      var candidate = value;
      return candidate && candidate.kind === "create" && Is.string(candidate.uri) && (candidate.options === void 0 || (candidate.options.overwrite === void 0 || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === void 0 || Is.boolean(candidate.options.ignoreIfExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
    }
    CreateFile2.is = is;
  })(CreateFile || (CreateFile = {}));
  var RenameFile;
  (function(RenameFile2) {
    function create(oldUri, newUri, options, annotation) {
      var result = {
        kind: "rename",
        oldUri,
        newUri
      };
      if (options !== void 0 && (options.overwrite !== void 0 || options.ignoreIfExists !== void 0)) {
        result.options = options;
      }
      if (annotation !== void 0) {
        result.annotationId = annotation;
      }
      return result;
    }
    RenameFile2.create = create;
    function is(value) {
      var candidate = value;
      return candidate && candidate.kind === "rename" && Is.string(candidate.oldUri) && Is.string(candidate.newUri) && (candidate.options === void 0 || (candidate.options.overwrite === void 0 || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === void 0 || Is.boolean(candidate.options.ignoreIfExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
    }
    RenameFile2.is = is;
  })(RenameFile || (RenameFile = {}));
  var DeleteFile;
  (function(DeleteFile2) {
    function create(uri, options, annotation) {
      var result = {
        kind: "delete",
        uri
      };
      if (options !== void 0 && (options.recursive !== void 0 || options.ignoreIfNotExists !== void 0)) {
        result.options = options;
      }
      if (annotation !== void 0) {
        result.annotationId = annotation;
      }
      return result;
    }
    DeleteFile2.create = create;
    function is(value) {
      var candidate = value;
      return candidate && candidate.kind === "delete" && Is.string(candidate.uri) && (candidate.options === void 0 || (candidate.options.recursive === void 0 || Is.boolean(candidate.options.recursive)) && (candidate.options.ignoreIfNotExists === void 0 || Is.boolean(candidate.options.ignoreIfNotExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
    }
    DeleteFile2.is = is;
  })(DeleteFile || (DeleteFile = {}));
  var WorkspaceEdit;
  (function(WorkspaceEdit2) {
    function is(value) {
      var candidate = value;
      return candidate && (candidate.changes !== void 0 || candidate.documentChanges !== void 0) && (candidate.documentChanges === void 0 || candidate.documentChanges.every(function(change) {
        if (Is.string(change.kind)) {
          return CreateFile.is(change) || RenameFile.is(change) || DeleteFile.is(change);
        } else {
          return TextDocumentEdit.is(change);
        }
      }));
    }
    WorkspaceEdit2.is = is;
  })(WorkspaceEdit || (WorkspaceEdit = {}));
  var TextEditChangeImpl = function() {
    function TextEditChangeImpl2(edits, changeAnnotations) {
      this.edits = edits;
      this.changeAnnotations = changeAnnotations;
    }
    TextEditChangeImpl2.prototype.insert = function(position, newText, annotation) {
      var edit;
      var id;
      if (annotation === void 0) {
        edit = TextEdit.insert(position, newText);
      } else if (ChangeAnnotationIdentifier.is(annotation)) {
        id = annotation;
        edit = AnnotatedTextEdit.insert(position, newText, annotation);
      } else {
        this.assertChangeAnnotations(this.changeAnnotations);
        id = this.changeAnnotations.manage(annotation);
        edit = AnnotatedTextEdit.insert(position, newText, id);
      }
      this.edits.push(edit);
      if (id !== void 0) {
        return id;
      }
    };
    TextEditChangeImpl2.prototype.replace = function(range, newText, annotation) {
      var edit;
      var id;
      if (annotation === void 0) {
        edit = TextEdit.replace(range, newText);
      } else if (ChangeAnnotationIdentifier.is(annotation)) {
        id = annotation;
        edit = AnnotatedTextEdit.replace(range, newText, annotation);
      } else {
        this.assertChangeAnnotations(this.changeAnnotations);
        id = this.changeAnnotations.manage(annotation);
        edit = AnnotatedTextEdit.replace(range, newText, id);
      }
      this.edits.push(edit);
      if (id !== void 0) {
        return id;
      }
    };
    TextEditChangeImpl2.prototype.delete = function(range, annotation) {
      var edit;
      var id;
      if (annotation === void 0) {
        edit = TextEdit.del(range);
      } else if (ChangeAnnotationIdentifier.is(annotation)) {
        id = annotation;
        edit = AnnotatedTextEdit.del(range, annotation);
      } else {
        this.assertChangeAnnotations(this.changeAnnotations);
        id = this.changeAnnotations.manage(annotation);
        edit = AnnotatedTextEdit.del(range, id);
      }
      this.edits.push(edit);
      if (id !== void 0) {
        return id;
      }
    };
    TextEditChangeImpl2.prototype.add = function(edit) {
      this.edits.push(edit);
    };
    TextEditChangeImpl2.prototype.all = function() {
      return this.edits;
    };
    TextEditChangeImpl2.prototype.clear = function() {
      this.edits.splice(0, this.edits.length);
    };
    TextEditChangeImpl2.prototype.assertChangeAnnotations = function(value) {
      if (value === void 0) {
        throw new Error("Text edit change is not configured to manage change annotations.");
      }
    };
    return TextEditChangeImpl2;
  }();
  var ChangeAnnotations = function() {
    function ChangeAnnotations2(annotations) {
      this._annotations = annotations === void 0 ? /* @__PURE__ */ Object.create(null) : annotations;
      this._counter = 0;
      this._size = 0;
    }
    ChangeAnnotations2.prototype.all = function() {
      return this._annotations;
    };
    Object.defineProperty(ChangeAnnotations2.prototype, "size", {
      get: function() {
        return this._size;
      },
      enumerable: false,
      configurable: true
    });
    ChangeAnnotations2.prototype.manage = function(idOrAnnotation, annotation) {
      var id;
      if (ChangeAnnotationIdentifier.is(idOrAnnotation)) {
        id = idOrAnnotation;
      } else {
        id = this.nextId();
        annotation = idOrAnnotation;
      }
      if (this._annotations[id] !== void 0) {
        throw new Error("Id " + id + " is already in use.");
      }
      if (annotation === void 0) {
        throw new Error("No annotation provided for id " + id);
      }
      this._annotations[id] = annotation;
      this._size++;
      return id;
    };
    ChangeAnnotations2.prototype.nextId = function() {
      this._counter++;
      return this._counter.toString();
    };
    return ChangeAnnotations2;
  }();
  var WorkspaceChange = function() {
    function WorkspaceChange2(workspaceEdit) {
      var _this = this;
      this._textEditChanges = /* @__PURE__ */ Object.create(null);
      if (workspaceEdit !== void 0) {
        this._workspaceEdit = workspaceEdit;
        if (workspaceEdit.documentChanges) {
          this._changeAnnotations = new ChangeAnnotations(workspaceEdit.changeAnnotations);
          workspaceEdit.changeAnnotations = this._changeAnnotations.all();
          workspaceEdit.documentChanges.forEach(function(change) {
            if (TextDocumentEdit.is(change)) {
              var textEditChange = new TextEditChangeImpl(change.edits, _this._changeAnnotations);
              _this._textEditChanges[change.textDocument.uri] = textEditChange;
            }
          });
        } else if (workspaceEdit.changes) {
          Object.keys(workspaceEdit.changes).forEach(function(key) {
            var textEditChange = new TextEditChangeImpl(workspaceEdit.changes[key]);
            _this._textEditChanges[key] = textEditChange;
          });
        }
      } else {
        this._workspaceEdit = {};
      }
    }
    Object.defineProperty(WorkspaceChange2.prototype, "edit", {
      get: function() {
        this.initDocumentChanges();
        if (this._changeAnnotations !== void 0) {
          if (this._changeAnnotations.size === 0) {
            this._workspaceEdit.changeAnnotations = void 0;
          } else {
            this._workspaceEdit.changeAnnotations = this._changeAnnotations.all();
          }
        }
        return this._workspaceEdit;
      },
      enumerable: false,
      configurable: true
    });
    WorkspaceChange2.prototype.getTextEditChange = function(key) {
      if (OptionalVersionedTextDocumentIdentifier.is(key)) {
        this.initDocumentChanges();
        if (this._workspaceEdit.documentChanges === void 0) {
          throw new Error("Workspace edit is not configured for document changes.");
        }
        var textDocument = { uri: key.uri, version: key.version };
        var result = this._textEditChanges[textDocument.uri];
        if (!result) {
          var edits = [];
          var textDocumentEdit = {
            textDocument,
            edits
          };
          this._workspaceEdit.documentChanges.push(textDocumentEdit);
          result = new TextEditChangeImpl(edits, this._changeAnnotations);
          this._textEditChanges[textDocument.uri] = result;
        }
        return result;
      } else {
        this.initChanges();
        if (this._workspaceEdit.changes === void 0) {
          throw new Error("Workspace edit is not configured for normal text edit changes.");
        }
        var result = this._textEditChanges[key];
        if (!result) {
          var edits = [];
          this._workspaceEdit.changes[key] = edits;
          result = new TextEditChangeImpl(edits);
          this._textEditChanges[key] = result;
        }
        return result;
      }
    };
    WorkspaceChange2.prototype.initDocumentChanges = function() {
      if (this._workspaceEdit.documentChanges === void 0 && this._workspaceEdit.changes === void 0) {
        this._changeAnnotations = new ChangeAnnotations();
        this._workspaceEdit.documentChanges = [];
        this._workspaceEdit.changeAnnotations = this._changeAnnotations.all();
      }
    };
    WorkspaceChange2.prototype.initChanges = function() {
      if (this._workspaceEdit.documentChanges === void 0 && this._workspaceEdit.changes === void 0) {
        this._workspaceEdit.changes = /* @__PURE__ */ Object.create(null);
      }
    };
    WorkspaceChange2.prototype.createFile = function(uri, optionsOrAnnotation, options) {
      this.initDocumentChanges();
      if (this._workspaceEdit.documentChanges === void 0) {
        throw new Error("Workspace edit is not configured for document changes.");
      }
      var annotation;
      if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
        annotation = optionsOrAnnotation;
      } else {
        options = optionsOrAnnotation;
      }
      var operation;
      var id;
      if (annotation === void 0) {
        operation = CreateFile.create(uri, options);
      } else {
        id = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
        operation = CreateFile.create(uri, options, id);
      }
      this._workspaceEdit.documentChanges.push(operation);
      if (id !== void 0) {
        return id;
      }
    };
    WorkspaceChange2.prototype.renameFile = function(oldUri, newUri, optionsOrAnnotation, options) {
      this.initDocumentChanges();
      if (this._workspaceEdit.documentChanges === void 0) {
        throw new Error("Workspace edit is not configured for document changes.");
      }
      var annotation;
      if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
        annotation = optionsOrAnnotation;
      } else {
        options = optionsOrAnnotation;
      }
      var operation;
      var id;
      if (annotation === void 0) {
        operation = RenameFile.create(oldUri, newUri, options);
      } else {
        id = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
        operation = RenameFile.create(oldUri, newUri, options, id);
      }
      this._workspaceEdit.documentChanges.push(operation);
      if (id !== void 0) {
        return id;
      }
    };
    WorkspaceChange2.prototype.deleteFile = function(uri, optionsOrAnnotation, options) {
      this.initDocumentChanges();
      if (this._workspaceEdit.documentChanges === void 0) {
        throw new Error("Workspace edit is not configured for document changes.");
      }
      var annotation;
      if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
        annotation = optionsOrAnnotation;
      } else {
        options = optionsOrAnnotation;
      }
      var operation;
      var id;
      if (annotation === void 0) {
        operation = DeleteFile.create(uri, options);
      } else {
        id = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
        operation = DeleteFile.create(uri, options, id);
      }
      this._workspaceEdit.documentChanges.push(operation);
      if (id !== void 0) {
        return id;
      }
    };
    return WorkspaceChange2;
  }();
  var TextDocumentIdentifier;
  (function(TextDocumentIdentifier2) {
    function create(uri) {
      return { uri };
    }
    TextDocumentIdentifier2.create = create;
    function is(value) {
      var candidate = value;
      return Is.defined(candidate) && Is.string(candidate.uri);
    }
    TextDocumentIdentifier2.is = is;
  })(TextDocumentIdentifier || (TextDocumentIdentifier = {}));
  var VersionedTextDocumentIdentifier;
  (function(VersionedTextDocumentIdentifier2) {
    function create(uri, version) {
      return { uri, version };
    }
    VersionedTextDocumentIdentifier2.create = create;
    function is(value) {
      var candidate = value;
      return Is.defined(candidate) && Is.string(candidate.uri) && Is.integer(candidate.version);
    }
    VersionedTextDocumentIdentifier2.is = is;
  })(VersionedTextDocumentIdentifier || (VersionedTextDocumentIdentifier = {}));
  var OptionalVersionedTextDocumentIdentifier;
  (function(OptionalVersionedTextDocumentIdentifier2) {
    function create(uri, version) {
      return { uri, version };
    }
    OptionalVersionedTextDocumentIdentifier2.create = create;
    function is(value) {
      var candidate = value;
      return Is.defined(candidate) && Is.string(candidate.uri) && (candidate.version === null || Is.integer(candidate.version));
    }
    OptionalVersionedTextDocumentIdentifier2.is = is;
  })(OptionalVersionedTextDocumentIdentifier || (OptionalVersionedTextDocumentIdentifier = {}));
  var TextDocumentItem;
  (function(TextDocumentItem2) {
    function create(uri, languageId, version, text) {
      return { uri, languageId, version, text };
    }
    TextDocumentItem2.create = create;
    function is(value) {
      var candidate = value;
      return Is.defined(candidate) && Is.string(candidate.uri) && Is.string(candidate.languageId) && Is.integer(candidate.version) && Is.string(candidate.text);
    }
    TextDocumentItem2.is = is;
  })(TextDocumentItem || (TextDocumentItem = {}));
  var MarkupKind;
  (function(MarkupKind2) {
    MarkupKind2.PlainText = "plaintext";
    MarkupKind2.Markdown = "markdown";
  })(MarkupKind || (MarkupKind = {}));
  (function(MarkupKind2) {
    function is(value) {
      var candidate = value;
      return candidate === MarkupKind2.PlainText || candidate === MarkupKind2.Markdown;
    }
    MarkupKind2.is = is;
  })(MarkupKind || (MarkupKind = {}));
  var MarkupContent;
  (function(MarkupContent2) {
    function is(value) {
      var candidate = value;
      return Is.objectLiteral(value) && MarkupKind.is(candidate.kind) && Is.string(candidate.value);
    }
    MarkupContent2.is = is;
  })(MarkupContent || (MarkupContent = {}));
  var CompletionItemKind;
  (function(CompletionItemKind2) {
    CompletionItemKind2.Text = 1;
    CompletionItemKind2.Method = 2;
    CompletionItemKind2.Function = 3;
    CompletionItemKind2.Constructor = 4;
    CompletionItemKind2.Field = 5;
    CompletionItemKind2.Variable = 6;
    CompletionItemKind2.Class = 7;
    CompletionItemKind2.Interface = 8;
    CompletionItemKind2.Module = 9;
    CompletionItemKind2.Property = 10;
    CompletionItemKind2.Unit = 11;
    CompletionItemKind2.Value = 12;
    CompletionItemKind2.Enum = 13;
    CompletionItemKind2.Keyword = 14;
    CompletionItemKind2.Snippet = 15;
    CompletionItemKind2.Color = 16;
    CompletionItemKind2.File = 17;
    CompletionItemKind2.Reference = 18;
    CompletionItemKind2.Folder = 19;
    CompletionItemKind2.EnumMember = 20;
    CompletionItemKind2.Constant = 21;
    CompletionItemKind2.Struct = 22;
    CompletionItemKind2.Event = 23;
    CompletionItemKind2.Operator = 24;
    CompletionItemKind2.TypeParameter = 25;
  })(CompletionItemKind || (CompletionItemKind = {}));
  var InsertTextFormat;
  (function(InsertTextFormat2) {
    InsertTextFormat2.PlainText = 1;
    InsertTextFormat2.Snippet = 2;
  })(InsertTextFormat || (InsertTextFormat = {}));
  var CompletionItemTag;
  (function(CompletionItemTag2) {
    CompletionItemTag2.Deprecated = 1;
  })(CompletionItemTag || (CompletionItemTag = {}));
  var InsertReplaceEdit;
  (function(InsertReplaceEdit2) {
    function create(newText, insert, replace) {
      return { newText, insert, replace };
    }
    InsertReplaceEdit2.create = create;
    function is(value) {
      var candidate = value;
      return candidate && Is.string(candidate.newText) && Range.is(candidate.insert) && Range.is(candidate.replace);
    }
    InsertReplaceEdit2.is = is;
  })(InsertReplaceEdit || (InsertReplaceEdit = {}));
  var InsertTextMode;
  (function(InsertTextMode2) {
    InsertTextMode2.asIs = 1;
    InsertTextMode2.adjustIndentation = 2;
  })(InsertTextMode || (InsertTextMode = {}));
  var CompletionItem;
  (function(CompletionItem2) {
    function create(label) {
      return { label };
    }
    CompletionItem2.create = create;
  })(CompletionItem || (CompletionItem = {}));
  var CompletionList;
  (function(CompletionList2) {
    function create(items, isIncomplete) {
      return { items: items ? items : [], isIncomplete: !!isIncomplete };
    }
    CompletionList2.create = create;
  })(CompletionList || (CompletionList = {}));
  var MarkedString;
  (function(MarkedString2) {
    function fromPlainText(plainText) {
      return plainText.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
    }
    MarkedString2.fromPlainText = fromPlainText;
    function is(value) {
      var candidate = value;
      return Is.string(candidate) || Is.objectLiteral(candidate) && Is.string(candidate.language) && Is.string(candidate.value);
    }
    MarkedString2.is = is;
  })(MarkedString || (MarkedString = {}));
  var Hover;
  (function(Hover2) {
    function is(value) {
      var candidate = value;
      return !!candidate && Is.objectLiteral(candidate) && (MarkupContent.is(candidate.contents) || MarkedString.is(candidate.contents) || Is.typedArray(candidate.contents, MarkedString.is)) && (value.range === void 0 || Range.is(value.range));
    }
    Hover2.is = is;
  })(Hover || (Hover = {}));
  var ParameterInformation;
  (function(ParameterInformation2) {
    function create(label, documentation) {
      return documentation ? { label, documentation } : { label };
    }
    ParameterInformation2.create = create;
  })(ParameterInformation || (ParameterInformation = {}));
  var SignatureInformation;
  (function(SignatureInformation2) {
    function create(label, documentation) {
      var parameters = [];
      for (var _i = 2; _i < arguments.length; _i++) {
        parameters[_i - 2] = arguments[_i];
      }
      var result = { label };
      if (Is.defined(documentation)) {
        result.documentation = documentation;
      }
      if (Is.defined(parameters)) {
        result.parameters = parameters;
      } else {
        result.parameters = [];
      }
      return result;
    }
    SignatureInformation2.create = create;
  })(SignatureInformation || (SignatureInformation = {}));
  var DocumentHighlightKind;
  (function(DocumentHighlightKind2) {
    DocumentHighlightKind2.Text = 1;
    DocumentHighlightKind2.Read = 2;
    DocumentHighlightKind2.Write = 3;
  })(DocumentHighlightKind || (DocumentHighlightKind = {}));
  var DocumentHighlight;
  (function(DocumentHighlight2) {
    function create(range, kind) {
      var result = { range };
      if (Is.number(kind)) {
        result.kind = kind;
      }
      return result;
    }
    DocumentHighlight2.create = create;
  })(DocumentHighlight || (DocumentHighlight = {}));
  var SymbolKind;
  (function(SymbolKind2) {
    SymbolKind2.File = 1;
    SymbolKind2.Module = 2;
    SymbolKind2.Namespace = 3;
    SymbolKind2.Package = 4;
    SymbolKind2.Class = 5;
    SymbolKind2.Method = 6;
    SymbolKind2.Property = 7;
    SymbolKind2.Field = 8;
    SymbolKind2.Constructor = 9;
    SymbolKind2.Enum = 10;
    SymbolKind2.Interface = 11;
    SymbolKind2.Function = 12;
    SymbolKind2.Variable = 13;
    SymbolKind2.Constant = 14;
    SymbolKind2.String = 15;
    SymbolKind2.Number = 16;
    SymbolKind2.Boolean = 17;
    SymbolKind2.Array = 18;
    SymbolKind2.Object = 19;
    SymbolKind2.Key = 20;
    SymbolKind2.Null = 21;
    SymbolKind2.EnumMember = 22;
    SymbolKind2.Struct = 23;
    SymbolKind2.Event = 24;
    SymbolKind2.Operator = 25;
    SymbolKind2.TypeParameter = 26;
  })(SymbolKind || (SymbolKind = {}));
  var SymbolTag;
  (function(SymbolTag2) {
    SymbolTag2.Deprecated = 1;
  })(SymbolTag || (SymbolTag = {}));
  var SymbolInformation;
  (function(SymbolInformation2) {
    function create(name, kind, range, uri, containerName) {
      var result = {
        name,
        kind,
        location: { uri, range }
      };
      if (containerName) {
        result.containerName = containerName;
      }
      return result;
    }
    SymbolInformation2.create = create;
  })(SymbolInformation || (SymbolInformation = {}));
  var DocumentSymbol;
  (function(DocumentSymbol2) {
    function create(name, detail, kind, range, selectionRange, children) {
      var result = {
        name,
        detail,
        kind,
        range,
        selectionRange
      };
      if (children !== void 0) {
        result.children = children;
      }
      return result;
    }
    DocumentSymbol2.create = create;
    function is(value) {
      var candidate = value;
      return candidate && Is.string(candidate.name) && Is.number(candidate.kind) && Range.is(candidate.range) && Range.is(candidate.selectionRange) && (candidate.detail === void 0 || Is.string(candidate.detail)) && (candidate.deprecated === void 0 || Is.boolean(candidate.deprecated)) && (candidate.children === void 0 || Array.isArray(candidate.children)) && (candidate.tags === void 0 || Array.isArray(candidate.tags));
    }
    DocumentSymbol2.is = is;
  })(DocumentSymbol || (DocumentSymbol = {}));
  var CodeActionKind;
  (function(CodeActionKind2) {
    CodeActionKind2.Empty = "";
    CodeActionKind2.QuickFix = "quickfix";
    CodeActionKind2.Refactor = "refactor";
    CodeActionKind2.RefactorExtract = "refactor.extract";
    CodeActionKind2.RefactorInline = "refactor.inline";
    CodeActionKind2.RefactorRewrite = "refactor.rewrite";
    CodeActionKind2.Source = "source";
    CodeActionKind2.SourceOrganizeImports = "source.organizeImports";
    CodeActionKind2.SourceFixAll = "source.fixAll";
  })(CodeActionKind || (CodeActionKind = {}));
  var CodeActionContext;
  (function(CodeActionContext2) {
    function create(diagnostics, only) {
      var result = { diagnostics };
      if (only !== void 0 && only !== null) {
        result.only = only;
      }
      return result;
    }
    CodeActionContext2.create = create;
    function is(value) {
      var candidate = value;
      return Is.defined(candidate) && Is.typedArray(candidate.diagnostics, Diagnostic.is) && (candidate.only === void 0 || Is.typedArray(candidate.only, Is.string));
    }
    CodeActionContext2.is = is;
  })(CodeActionContext || (CodeActionContext = {}));
  var CodeAction;
  (function(CodeAction2) {
    function create(title, kindOrCommandOrEdit, kind) {
      var result = { title };
      var checkKind = true;
      if (typeof kindOrCommandOrEdit === "string") {
        checkKind = false;
        result.kind = kindOrCommandOrEdit;
      } else if (Command.is(kindOrCommandOrEdit)) {
        result.command = kindOrCommandOrEdit;
      } else {
        result.edit = kindOrCommandOrEdit;
      }
      if (checkKind && kind !== void 0) {
        result.kind = kind;
      }
      return result;
    }
    CodeAction2.create = create;
    function is(value) {
      var candidate = value;
      return candidate && Is.string(candidate.title) && (candidate.diagnostics === void 0 || Is.typedArray(candidate.diagnostics, Diagnostic.is)) && (candidate.kind === void 0 || Is.string(candidate.kind)) && (candidate.edit !== void 0 || candidate.command !== void 0) && (candidate.command === void 0 || Command.is(candidate.command)) && (candidate.isPreferred === void 0 || Is.boolean(candidate.isPreferred)) && (candidate.edit === void 0 || WorkspaceEdit.is(candidate.edit));
    }
    CodeAction2.is = is;
  })(CodeAction || (CodeAction = {}));
  var CodeLens;
  (function(CodeLens2) {
    function create(range, data) {
      var result = { range };
      if (Is.defined(data)) {
        result.data = data;
      }
      return result;
    }
    CodeLens2.create = create;
    function is(value) {
      var candidate = value;
      return Is.defined(candidate) && Range.is(candidate.range) && (Is.undefined(candidate.command) || Command.is(candidate.command));
    }
    CodeLens2.is = is;
  })(CodeLens || (CodeLens = {}));
  var FormattingOptions;
  (function(FormattingOptions2) {
    function create(tabSize, insertSpaces) {
      return { tabSize, insertSpaces };
    }
    FormattingOptions2.create = create;
    function is(value) {
      var candidate = value;
      return Is.defined(candidate) && Is.uinteger(candidate.tabSize) && Is.boolean(candidate.insertSpaces);
    }
    FormattingOptions2.is = is;
  })(FormattingOptions || (FormattingOptions = {}));
  var DocumentLink;
  (function(DocumentLink2) {
    function create(range, target, data) {
      return { range, target, data };
    }
    DocumentLink2.create = create;
    function is(value) {
      var candidate = value;
      return Is.defined(candidate) && Range.is(candidate.range) && (Is.undefined(candidate.target) || Is.string(candidate.target));
    }
    DocumentLink2.is = is;
  })(DocumentLink || (DocumentLink = {}));
  var SelectionRange;
  (function(SelectionRange2) {
    function create(range, parent) {
      return { range, parent };
    }
    SelectionRange2.create = create;
    function is(value) {
      var candidate = value;
      return candidate !== void 0 && Range.is(candidate.range) && (candidate.parent === void 0 || SelectionRange2.is(candidate.parent));
    }
    SelectionRange2.is = is;
  })(SelectionRange || (SelectionRange = {}));
  var TextDocument;
  (function(TextDocument2) {
    function create(uri, languageId, version, content) {
      return new FullTextDocument(uri, languageId, version, content);
    }
    TextDocument2.create = create;
    function is(value) {
      var candidate = value;
      return Is.defined(candidate) && Is.string(candidate.uri) && (Is.undefined(candidate.languageId) || Is.string(candidate.languageId)) && Is.uinteger(candidate.lineCount) && Is.func(candidate.getText) && Is.func(candidate.positionAt) && Is.func(candidate.offsetAt) ? true : false;
    }
    TextDocument2.is = is;
    function applyEdits(document, edits) {
      var text = document.getText();
      var sortedEdits = mergeSort(edits, function(a, b) {
        var diff = a.range.start.line - b.range.start.line;
        if (diff === 0) {
          return a.range.start.character - b.range.start.character;
        }
        return diff;
      });
      var lastModifiedOffset = text.length;
      for (var i = sortedEdits.length - 1; i >= 0; i--) {
        var e = sortedEdits[i];
        var startOffset = document.offsetAt(e.range.start);
        var endOffset = document.offsetAt(e.range.end);
        if (endOffset <= lastModifiedOffset) {
          text = text.substring(0, startOffset) + e.newText + text.substring(endOffset, text.length);
        } else {
          throw new Error("Overlapping edit");
        }
        lastModifiedOffset = startOffset;
      }
      return text;
    }
    TextDocument2.applyEdits = applyEdits;
    function mergeSort(data, compare) {
      if (data.length <= 1) {
        return data;
      }
      var p = data.length / 2 | 0;
      var left = data.slice(0, p);
      var right = data.slice(p);
      mergeSort(left, compare);
      mergeSort(right, compare);
      var leftIdx = 0;
      var rightIdx = 0;
      var i = 0;
      while (leftIdx < left.length && rightIdx < right.length) {
        var ret = compare(left[leftIdx], right[rightIdx]);
        if (ret <= 0) {
          data[i++] = left[leftIdx++];
        } else {
          data[i++] = right[rightIdx++];
        }
      }
      while (leftIdx < left.length) {
        data[i++] = left[leftIdx++];
      }
      while (rightIdx < right.length) {
        data[i++] = right[rightIdx++];
      }
      return data;
    }
  })(TextDocument || (TextDocument = {}));
  var FullTextDocument = function() {
    function FullTextDocument2(uri, languageId, version, content) {
      this._uri = uri;
      this._languageId = languageId;
      this._version = version;
      this._content = content;
      this._lineOffsets = void 0;
    }
    Object.defineProperty(FullTextDocument2.prototype, "uri", {
      get: function() {
        return this._uri;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(FullTextDocument2.prototype, "languageId", {
      get: function() {
        return this._languageId;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(FullTextDocument2.prototype, "version", {
      get: function() {
        return this._version;
      },
      enumerable: false,
      configurable: true
    });
    FullTextDocument2.prototype.getText = function(range) {
      if (range) {
        var start = this.offsetAt(range.start);
        var end = this.offsetAt(range.end);
        return this._content.substring(start, end);
      }
      return this._content;
    };
    FullTextDocument2.prototype.update = function(event, version) {
      this._content = event.text;
      this._version = version;
      this._lineOffsets = void 0;
    };
    FullTextDocument2.prototype.getLineOffsets = function() {
      if (this._lineOffsets === void 0) {
        var lineOffsets = [];
        var text = this._content;
        var isLineStart = true;
        for (var i = 0; i < text.length; i++) {
          if (isLineStart) {
            lineOffsets.push(i);
            isLineStart = false;
          }
          var ch = text.charAt(i);
          isLineStart = ch === "\r" || ch === "\n";
          if (ch === "\r" && i + 1 < text.length && text.charAt(i + 1) === "\n") {
            i++;
          }
        }
        if (isLineStart && text.length > 0) {
          lineOffsets.push(text.length);
        }
        this._lineOffsets = lineOffsets;
      }
      return this._lineOffsets;
    };
    FullTextDocument2.prototype.positionAt = function(offset) {
      offset = Math.max(Math.min(offset, this._content.length), 0);
      var lineOffsets = this.getLineOffsets();
      var low = 0, high = lineOffsets.length;
      if (high === 0) {
        return Position.create(0, offset);
      }
      while (low < high) {
        var mid = Math.floor((low + high) / 2);
        if (lineOffsets[mid] > offset) {
          high = mid;
        } else {
          low = mid + 1;
        }
      }
      var line = low - 1;
      return Position.create(line, offset - lineOffsets[line]);
    };
    FullTextDocument2.prototype.offsetAt = function(position) {
      var lineOffsets = this.getLineOffsets();
      if (position.line >= lineOffsets.length) {
        return this._content.length;
      } else if (position.line < 0) {
        return 0;
      }
      var lineOffset = lineOffsets[position.line];
      var nextLineOffset = position.line + 1 < lineOffsets.length ? lineOffsets[position.line + 1] : this._content.length;
      return Math.max(Math.min(lineOffset + position.character, nextLineOffset), lineOffset);
    };
    Object.defineProperty(FullTextDocument2.prototype, "lineCount", {
      get: function() {
        return this.getLineOffsets().length;
      },
      enumerable: false,
      configurable: true
    });
    return FullTextDocument2;
  }();
  var Is;
  (function(Is2) {
    var toString = Object.prototype.toString;
    function defined(value) {
      return typeof value !== "undefined";
    }
    Is2.defined = defined;
    function undefined2(value) {
      return typeof value === "undefined";
    }
    Is2.undefined = undefined2;
    function boolean(value) {
      return value === true || value === false;
    }
    Is2.boolean = boolean;
    function string(value) {
      return toString.call(value) === "[object String]";
    }
    Is2.string = string;
    function number(value) {
      return toString.call(value) === "[object Number]";
    }
    Is2.number = number;
    function numberRange(value, min, max) {
      return toString.call(value) === "[object Number]" && min <= value && value <= max;
    }
    Is2.numberRange = numberRange;
    function integer2(value) {
      return toString.call(value) === "[object Number]" && -2147483648 <= value && value <= 2147483647;
    }
    Is2.integer = integer2;
    function uinteger2(value) {
      return toString.call(value) === "[object Number]" && 0 <= value && value <= 2147483647;
    }
    Is2.uinteger = uinteger2;
    function func(value) {
      return toString.call(value) === "[object Function]";
    }
    Is2.func = func;
    function objectLiteral(value) {
      return value !== null && typeof value === "object";
    }
    Is2.objectLiteral = objectLiteral;
    function typedArray(value, check) {
      return Array.isArray(value) && value.every(check);
    }
    Is2.typedArray = typedArray;
  })(Is || (Is = {}));

  // src/language/common/lspLanguageFeatures.ts
  var DiagnosticsAdapter = class {
    constructor(_languageId, _worker, configChangeEvent) {
      this._languageId = _languageId;
      this._worker = _worker;
      const onModelAdd = (model) => {
        let modeId = model.getLanguageId();
        if (modeId !== this._languageId) {
          return;
        }
        let handle;
        this._listener[model.uri.toString()] = model.onDidChangeContent(() => {
          window.clearTimeout(handle);
          handle = window.setTimeout(() => this._doValidate(model.uri, modeId), 500);
        });
        this._doValidate(model.uri, modeId);
      };
      const onModelRemoved = (model) => {
        monaco_editor_core_exports.editor.setModelMarkers(model, this._languageId, []);
        let uriStr = model.uri.toString();
        let listener = this._listener[uriStr];
        if (listener) {
          listener.dispose();
          delete this._listener[uriStr];
        }
      };
      this._disposables.push(monaco_editor_core_exports.editor.onDidCreateModel(onModelAdd));
      this._disposables.push(monaco_editor_core_exports.editor.onWillDisposeModel(onModelRemoved));
      this._disposables.push(monaco_editor_core_exports.editor.onDidChangeModelLanguage((event) => {
        onModelRemoved(event.model);
        onModelAdd(event.model);
      }));
      this._disposables.push(configChangeEvent((_) => {
        monaco_editor_core_exports.editor.getModels().forEach((model) => {
          if (model.getLanguageId() === this._languageId) {
            onModelRemoved(model);
            onModelAdd(model);
          }
        });
      }));
      this._disposables.push({
        dispose: () => {
          monaco_editor_core_exports.editor.getModels().forEach(onModelRemoved);
          for (let key in this._listener) {
            this._listener[key].dispose();
          }
        }
      });
      monaco_editor_core_exports.editor.getModels().forEach(onModelAdd);
    }
    _disposables = [];
    _listener = /* @__PURE__ */ Object.create(null);
    dispose() {
      this._disposables.forEach((d) => d && d.dispose());
      this._disposables.length = 0;
    }
    _doValidate(resource, languageId) {
      this._worker(resource).then((worker) => {
        return worker.doValidation(resource.toString());
      }).then((diagnostics) => {
        const markers = diagnostics.map((d) => toDiagnostics(resource, d));
        let model = monaco_editor_core_exports.editor.getModel(resource);
        if (model && model.getLanguageId() === languageId) {
          monaco_editor_core_exports.editor.setModelMarkers(model, languageId, markers);
        }
      }).then(void 0, (err) => {
        console.error(err);
      });
    }
  };
  function toSeverity(lsSeverity) {
    switch (lsSeverity) {
      case DiagnosticSeverity.Error:
        return monaco_editor_core_exports.MarkerSeverity.Error;
      case DiagnosticSeverity.Warning:
        return monaco_editor_core_exports.MarkerSeverity.Warning;
      case DiagnosticSeverity.Information:
        return monaco_editor_core_exports.MarkerSeverity.Info;
      case DiagnosticSeverity.Hint:
        return monaco_editor_core_exports.MarkerSeverity.Hint;
      default:
        return monaco_editor_core_exports.MarkerSeverity.Info;
    }
  }
  function toDiagnostics(resource, diag) {
    let code = typeof diag.code === "number" ? String(diag.code) : diag.code;
    return {
      severity: toSeverity(diag.severity),
      startLineNumber: diag.range.start.line + 1,
      startColumn: diag.range.start.character + 1,
      endLineNumber: diag.range.end.line + 1,
      endColumn: diag.range.end.character + 1,
      message: diag.message,
      code,
      source: diag.source
    };
  }
  var CompletionAdapter = class {
    constructor(_worker, _triggerCharacters) {
      this._worker = _worker;
      this._triggerCharacters = _triggerCharacters;
    }
    get triggerCharacters() {
      return this._triggerCharacters;
    }
    provideCompletionItems(model, position, context, token) {
      const resource = model.uri;
      return this._worker(resource).then((worker) => {
        return worker.doComplete(resource.toString(), fromPosition(position));
      }).then((info) => {
        if (!info) {
          return;
        }
        const wordInfo = model.getWordUntilPosition(position);
        const wordRange = new monaco_editor_core_exports.Range(position.lineNumber, wordInfo.startColumn, position.lineNumber, wordInfo.endColumn);
        const items = info.items.map((entry) => {
          const item = {
            label: entry.label,
            insertText: entry.insertText || entry.label,
            sortText: entry.sortText,
            filterText: entry.filterText,
            documentation: entry.documentation,
            detail: entry.detail,
            command: toCommand(entry.command),
            range: wordRange,
            kind: toCompletionItemKind(entry.kind)
          };
          if (entry.textEdit) {
            if (isInsertReplaceEdit(entry.textEdit)) {
              item.range = {
                insert: toRange(entry.textEdit.insert),
                replace: toRange(entry.textEdit.replace)
              };
            } else {
              item.range = toRange(entry.textEdit.range);
            }
            item.insertText = entry.textEdit.newText;
          }
          if (entry.additionalTextEdits) {
            item.additionalTextEdits = entry.additionalTextEdits.map(toTextEdit);
          }
          if (entry.insertTextFormat === InsertTextFormat.Snippet) {
            item.insertTextRules = monaco_editor_core_exports.languages.CompletionItemInsertTextRule.InsertAsSnippet;
          }
          return item;
        });
        return {
          isIncomplete: info.isIncomplete,
          suggestions: items
        };
      });
    }
  };
  function fromPosition(position) {
    if (!position) {
      return void 0;
    }
    return { character: position.column - 1, line: position.lineNumber - 1 };
  }
  function fromRange(range) {
    if (!range) {
      return void 0;
    }
    return {
      start: {
        line: range.startLineNumber - 1,
        character: range.startColumn - 1
      },
      end: { line: range.endLineNumber - 1, character: range.endColumn - 1 }
    };
  }
  function toRange(range) {
    if (!range) {
      return void 0;
    }
    return new monaco_editor_core_exports.Range(range.start.line + 1, range.start.character + 1, range.end.line + 1, range.end.character + 1);
  }
  function isInsertReplaceEdit(edit) {
    return typeof edit.insert !== "undefined" && typeof edit.replace !== "undefined";
  }
  function toCompletionItemKind(kind) {
    const mItemKind = monaco_editor_core_exports.languages.CompletionItemKind;
    switch (kind) {
      case CompletionItemKind.Text:
        return mItemKind.Text;
      case CompletionItemKind.Method:
        return mItemKind.Method;
      case CompletionItemKind.Function:
        return mItemKind.Function;
      case CompletionItemKind.Constructor:
        return mItemKind.Constructor;
      case CompletionItemKind.Field:
        return mItemKind.Field;
      case CompletionItemKind.Variable:
        return mItemKind.Variable;
      case CompletionItemKind.Class:
        return mItemKind.Class;
      case CompletionItemKind.Interface:
        return mItemKind.Interface;
      case CompletionItemKind.Module:
        return mItemKind.Module;
      case CompletionItemKind.Property:
        return mItemKind.Property;
      case CompletionItemKind.Unit:
        return mItemKind.Unit;
      case CompletionItemKind.Value:
        return mItemKind.Value;
      case CompletionItemKind.Enum:
        return mItemKind.Enum;
      case CompletionItemKind.Keyword:
        return mItemKind.Keyword;
      case CompletionItemKind.Snippet:
        return mItemKind.Snippet;
      case CompletionItemKind.Color:
        return mItemKind.Color;
      case CompletionItemKind.File:
        return mItemKind.File;
      case CompletionItemKind.Reference:
        return mItemKind.Reference;
    }
    return mItemKind.Property;
  }
  function toTextEdit(textEdit) {
    if (!textEdit) {
      return void 0;
    }
    return {
      range: toRange(textEdit.range),
      text: textEdit.newText
    };
  }
  function toCommand(c) {
    return c && c.command === "editor.action.triggerSuggest" ? { id: c.command, title: c.title, arguments: c.arguments } : void 0;
  }
  var HoverAdapter = class {
    constructor(_worker) {
      this._worker = _worker;
    }
    provideHover(model, position, token) {
      let resource = model.uri;
      return this._worker(resource).then((worker) => {
        return worker.doHover(resource.toString(), fromPosition(position));
      }).then((info) => {
        if (!info) {
          return;
        }
        return {
          range: toRange(info.range),
          contents: toMarkedStringArray(info.contents)
        };
      });
    }
  };
  function isMarkupContent(thing) {
    return thing && typeof thing === "object" && typeof thing.kind === "string";
  }
  function toMarkdownString(entry) {
    if (typeof entry === "string") {
      return {
        value: entry
      };
    }
    if (isMarkupContent(entry)) {
      if (entry.kind === "plaintext") {
        return {
          value: entry.value.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&")
        };
      }
      return {
        value: entry.value
      };
    }
    return { value: "```" + entry.language + "\n" + entry.value + "\n```\n" };
  }
  function toMarkedStringArray(contents) {
    if (!contents) {
      return void 0;
    }
    if (Array.isArray(contents)) {
      return contents.map(toMarkdownString);
    }
    return [toMarkdownString(contents)];
  }
  var DocumentHighlightAdapter = class {
    constructor(_worker) {
      this._worker = _worker;
    }
    provideDocumentHighlights(model, position, token) {
      const resource = model.uri;
      return this._worker(resource).then((worker) => worker.findDocumentHighlights(resource.toString(), fromPosition(position))).then((entries) => {
        if (!entries) {
          return;
        }
        return entries.map((entry) => {
          return {
            range: toRange(entry.range),
            kind: toDocumentHighlightKind(entry.kind)
          };
        });
      });
    }
  };
  function toDocumentHighlightKind(kind) {
    switch (kind) {
      case DocumentHighlightKind.Read:
        return monaco_editor_core_exports.languages.DocumentHighlightKind.Read;
      case DocumentHighlightKind.Write:
        return monaco_editor_core_exports.languages.DocumentHighlightKind.Write;
      case DocumentHighlightKind.Text:
        return monaco_editor_core_exports.languages.DocumentHighlightKind.Text;
    }
    return monaco_editor_core_exports.languages.DocumentHighlightKind.Text;
  }
  var DefinitionAdapter = class {
    constructor(_worker) {
      this._worker = _worker;
    }
    provideDefinition(model, position, token) {
      const resource = model.uri;
      return this._worker(resource).then((worker) => {
        return worker.findDefinition(resource.toString(), fromPosition(position));
      }).then((definition) => {
        if (!definition) {
          return;
        }
        return [toLocation(definition)];
      });
    }
  };
  function toLocation(location) {
    return {
      uri: monaco_editor_core_exports.Uri.parse(location.uri),
      range: toRange(location.range)
    };
  }
  var ReferenceAdapter = class {
    constructor(_worker) {
      this._worker = _worker;
    }
    provideReferences(model, position, context, token) {
      const resource = model.uri;
      return this._worker(resource).then((worker) => {
        return worker.findReferences(resource.toString(), fromPosition(position));
      }).then((entries) => {
        if (!entries) {
          return;
        }
        return entries.map(toLocation);
      });
    }
  };
  var RenameAdapter = class {
    constructor(_worker) {
      this._worker = _worker;
    }
    provideRenameEdits(model, position, newName, token) {
      const resource = model.uri;
      return this._worker(resource).then((worker) => {
        return worker.doRename(resource.toString(), fromPosition(position), newName);
      }).then((edit) => {
        return toWorkspaceEdit(edit);
      });
    }
  };
  function toWorkspaceEdit(edit) {
    if (!edit || !edit.changes) {
      return void 0;
    }
    let resourceEdits = [];
    for (let uri in edit.changes) {
      const _uri = monaco_editor_core_exports.Uri.parse(uri);
      for (let e of edit.changes[uri]) {
        resourceEdits.push({
          resource: _uri,
          versionId: void 0,
          textEdit: {
            range: toRange(e.range),
            text: e.newText
          }
        });
      }
    }
    return {
      edits: resourceEdits
    };
  }
  var DocumentSymbolAdapter = class {
    constructor(_worker) {
      this._worker = _worker;
    }
    provideDocumentSymbols(model, token) {
      const resource = model.uri;
      return this._worker(resource).then((worker) => worker.findDocumentSymbols(resource.toString())).then((items) => {
        if (!items) {
          return;
        }
        return items.map((item) => ({
          name: item.name,
          detail: "",
          containerName: item.containerName,
          kind: toSymbolKind(item.kind),
          range: toRange(item.location.range),
          selectionRange: toRange(item.location.range),
          tags: []
        }));
      });
    }
  };
  function toSymbolKind(kind) {
    let mKind = monaco_editor_core_exports.languages.SymbolKind;
    switch (kind) {
      case SymbolKind.File:
        return mKind.Array;
      case SymbolKind.Module:
        return mKind.Module;
      case SymbolKind.Namespace:
        return mKind.Namespace;
      case SymbolKind.Package:
        return mKind.Package;
      case SymbolKind.Class:
        return mKind.Class;
      case SymbolKind.Method:
        return mKind.Method;
      case SymbolKind.Property:
        return mKind.Property;
      case SymbolKind.Field:
        return mKind.Field;
      case SymbolKind.Constructor:
        return mKind.Constructor;
      case SymbolKind.Enum:
        return mKind.Enum;
      case SymbolKind.Interface:
        return mKind.Interface;
      case SymbolKind.Function:
        return mKind.Function;
      case SymbolKind.Variable:
        return mKind.Variable;
      case SymbolKind.Constant:
        return mKind.Constant;
      case SymbolKind.String:
        return mKind.String;
      case SymbolKind.Number:
        return mKind.Number;
      case SymbolKind.Boolean:
        return mKind.Boolean;
      case SymbolKind.Array:
        return mKind.Array;
    }
    return mKind.Function;
  }
  var DocumentLinkAdapter = class {
    constructor(_worker) {
      this._worker = _worker;
    }
    provideLinks(model, token) {
      const resource = model.uri;
      return this._worker(resource).then((worker) => worker.findDocumentLinks(resource.toString())).then((items) => {
        if (!items) {
          return;
        }
        return {
          links: items.map((item) => ({
            range: toRange(item.range),
            url: item.target
          }))
        };
      });
    }
  };
  var DocumentFormattingEditProvider = class {
    constructor(_worker) {
      this._worker = _worker;
    }
    provideDocumentFormattingEdits(model, options, token) {
      const resource = model.uri;
      return this._worker(resource).then((worker) => {
        return worker.format(resource.toString(), null, fromFormattingOptions(options)).then((edits) => {
          if (!edits || edits.length === 0) {
            return;
          }
          return edits.map(toTextEdit);
        });
      });
    }
  };
  var DocumentRangeFormattingEditProvider = class {
    constructor(_worker) {
      this._worker = _worker;
    }
    canFormatMultipleRanges = false;
    provideDocumentRangeFormattingEdits(model, range, options, token) {
      const resource = model.uri;
      return this._worker(resource).then((worker) => {
        return worker.format(resource.toString(), fromRange(range), fromFormattingOptions(options)).then((edits) => {
          if (!edits || edits.length === 0) {
            return;
          }
          return edits.map(toTextEdit);
        });
      });
    }
  };
  function fromFormattingOptions(options) {
    return {
      tabSize: options.tabSize,
      insertSpaces: options.insertSpaces
    };
  }
  var DocumentColorAdapter = class {
    constructor(_worker) {
      this._worker = _worker;
    }
    provideDocumentColors(model, token) {
      const resource = model.uri;
      return this._worker(resource).then((worker) => worker.findDocumentColors(resource.toString())).then((infos) => {
        if (!infos) {
          return;
        }
        return infos.map((item) => ({
          color: item.color,
          range: toRange(item.range)
        }));
      });
    }
    provideColorPresentations(model, info, token) {
      const resource = model.uri;
      return this._worker(resource).then((worker) => worker.getColorPresentations(resource.toString(), info.color, fromRange(info.range))).then((presentations) => {
        if (!presentations) {
          return;
        }
        return presentations.map((presentation) => {
          let item = {
            label: presentation.label
          };
          if (presentation.textEdit) {
            item.textEdit = toTextEdit(presentation.textEdit);
          }
          if (presentation.additionalTextEdits) {
            item.additionalTextEdits = presentation.additionalTextEdits.map(toTextEdit);
          }
          return item;
        });
      });
    }
  };
  var FoldingRangeAdapter = class {
    constructor(_worker) {
      this._worker = _worker;
    }
    provideFoldingRanges(model, context, token) {
      const resource = model.uri;
      return this._worker(resource).then((worker) => worker.getFoldingRanges(resource.toString(), context)).then((ranges) => {
        if (!ranges) {
          return;
        }
        return ranges.map((range) => {
          const result = {
            start: range.startLine + 1,
            end: range.endLine + 1
          };
          if (typeof range.kind !== "undefined") {
            result.kind = toFoldingRangeKind(range.kind);
          }
          return result;
        });
      });
    }
  };
  function toFoldingRangeKind(kind) {
    switch (kind) {
      case FoldingRangeKind.Comment:
        return monaco_editor_core_exports.languages.FoldingRangeKind.Comment;
      case FoldingRangeKind.Imports:
        return monaco_editor_core_exports.languages.FoldingRangeKind.Imports;
      case FoldingRangeKind.Region:
        return monaco_editor_core_exports.languages.FoldingRangeKind.Region;
    }
    return void 0;
  }
  var SelectionRangeAdapter = class {
    constructor(_worker) {
      this._worker = _worker;
    }
    provideSelectionRanges(model, positions, token) {
      const resource = model.uri;
      return this._worker(resource).then((worker) => worker.getSelectionRanges(resource.toString(), positions.map(fromPosition))).then((selectionRanges) => {
        if (!selectionRanges) {
          return;
        }
        return selectionRanges.map((selectionRange) => {
          const result = [];
          while (selectionRange) {
            result.push({ range: toRange(selectionRange.range) });
            selectionRange = selectionRange.parent;
          }
          return result;
        });
      });
    }
  };

  // node_modules/jsonc-parser/lib/esm/impl/scanner.js
  function createScanner(text, ignoreTrivia) {
    if (ignoreTrivia === void 0) {
      ignoreTrivia = false;
    }
    var len = text.length;
    var pos = 0, value = "", tokenOffset = 0, token = 16, lineNumber = 0, lineStartOffset = 0, tokenLineStartOffset = 0, prevTokenLineStartOffset = 0, scanError = 0;
    function scanHexDigits(count, exact) {
      var digits = 0;
      var value2 = 0;
      while (digits < count || !exact) {
        var ch = text.charCodeAt(pos);
        if (ch >= 48 && ch <= 57) {
          value2 = value2 * 16 + ch - 48;
        } else if (ch >= 65 && ch <= 70) {
          value2 = value2 * 16 + ch - 65 + 10;
        } else if (ch >= 97 && ch <= 102) {
          value2 = value2 * 16 + ch - 97 + 10;
        } else {
          break;
        }
        pos++;
        digits++;
      }
      if (digits < count) {
        value2 = -1;
      }
      return value2;
    }
    function setPosition(newPosition) {
      pos = newPosition;
      value = "";
      tokenOffset = 0;
      token = 16;
      scanError = 0;
    }
    function scanNumber() {
      var start = pos;
      if (text.charCodeAt(pos) === 48) {
        pos++;
      } else {
        pos++;
        while (pos < text.length && isDigit(text.charCodeAt(pos))) {
          pos++;
        }
      }
      if (pos < text.length && text.charCodeAt(pos) === 46) {
        pos++;
        if (pos < text.length && isDigit(text.charCodeAt(pos))) {
          pos++;
          while (pos < text.length && isDigit(text.charCodeAt(pos))) {
            pos++;
          }
        } else {
          scanError = 3;
          return text.substring(start, pos);
        }
      }
      var end = pos;
      if (pos < text.length && (text.charCodeAt(pos) === 69 || text.charCodeAt(pos) === 101)) {
        pos++;
        if (pos < text.length && text.charCodeAt(pos) === 43 || text.charCodeAt(pos) === 45) {
          pos++;
        }
        if (pos < text.length && isDigit(text.charCodeAt(pos))) {
          pos++;
          while (pos < text.length && isDigit(text.charCodeAt(pos))) {
            pos++;
          }
          end = pos;
        } else {
          scanError = 3;
        }
      }
      return text.substring(start, end);
    }
    function scanString() {
      var result = "", start = pos;
      while (true) {
        if (pos >= len) {
          result += text.substring(start, pos);
          scanError = 2;
          break;
        }
        var ch = text.charCodeAt(pos);
        if (ch === 34) {
          result += text.substring(start, pos);
          pos++;
          break;
        }
        if (ch === 92) {
          result += text.substring(start, pos);
          pos++;
          if (pos >= len) {
            scanError = 2;
            break;
          }
          var ch2 = text.charCodeAt(pos++);
          switch (ch2) {
            case 34:
              result += '"';
              break;
            case 92:
              result += "\\";
              break;
            case 47:
              result += "/";
              break;
            case 98:
              result += "\b";
              break;
            case 102:
              result += "\f";
              break;
            case 110:
              result += "\n";
              break;
            case 114:
              result += "\r";
              break;
            case 116:
              result += "	";
              break;
            case 117:
              var ch3 = scanHexDigits(4, true);
              if (ch3 >= 0) {
                result += String.fromCharCode(ch3);
              } else {
                scanError = 4;
              }
              break;
            default:
              scanError = 5;
          }
          start = pos;
          continue;
        }
        if (ch >= 0 && ch <= 31) {
          if (isLineBreak(ch)) {
            result += text.substring(start, pos);
            scanError = 2;
            break;
          } else {
            scanError = 6;
          }
        }
        pos++;
      }
      return result;
    }
    function scanNext() {
      value = "";
      scanError = 0;
      tokenOffset = pos;
      lineStartOffset = lineNumber;
      prevTokenLineStartOffset = tokenLineStartOffset;
      if (pos >= len) {
        tokenOffset = len;
        return token = 17;
      }
      var code = text.charCodeAt(pos);
      if (isWhiteSpace(code)) {
        do {
          pos++;
          value += String.fromCharCode(code);
          code = text.charCodeAt(pos);
        } while (isWhiteSpace(code));
        return token = 15;
      }
      if (isLineBreak(code)) {
        pos++;
        value += String.fromCharCode(code);
        if (code === 13 && text.charCodeAt(pos) === 10) {
          pos++;
          value += "\n";
        }
        lineNumber++;
        tokenLineStartOffset = pos;
        return token = 14;
      }
      switch (code) {
        case 123:
          pos++;
          return token = 1;
        case 125:
          pos++;
          return token = 2;
        case 91:
          pos++;
          return token = 3;
        case 93:
          pos++;
          return token = 4;
        case 58:
          pos++;
          return token = 6;
        case 44:
          pos++;
          return token = 5;
        case 34:
          pos++;
          value = scanString();
          return token = 10;
        case 47:
          var start = pos - 1;
          if (text.charCodeAt(pos + 1) === 47) {
            pos += 2;
            while (pos < len) {
              if (isLineBreak(text.charCodeAt(pos))) {
                break;
              }
              pos++;
            }
            value = text.substring(start, pos);
            return token = 12;
          }
          if (text.charCodeAt(pos + 1) === 42) {
            pos += 2;
            var safeLength = len - 1;
            var commentClosed = false;
            while (pos < safeLength) {
              var ch = text.charCodeAt(pos);
              if (ch === 42 && text.charCodeAt(pos + 1) === 47) {
                pos += 2;
                commentClosed = true;
                break;
              }
              pos++;
              if (isLineBreak(ch)) {
                if (ch === 13 && text.charCodeAt(pos) === 10) {
                  pos++;
                }
                lineNumber++;
                tokenLineStartOffset = pos;
              }
            }
            if (!commentClosed) {
              pos++;
              scanError = 1;
            }
            value = text.substring(start, pos);
            return token = 13;
          }
          value += String.fromCharCode(code);
          pos++;
          return token = 16;
        case 45:
          value += String.fromCharCode(code);
          pos++;
          if (pos === len || !isDigit(text.charCodeAt(pos))) {
            return token = 16;
          }
        case 48:
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
          value += scanNumber();
          return token = 11;
        default:
          while (pos < len && isUnknownContentCharacter(code)) {
            pos++;
            code = text.charCodeAt(pos);
          }
          if (tokenOffset !== pos) {
            value = text.substring(tokenOffset, pos);
            switch (value) {
              case "true":
                return token = 8;
              case "false":
                return token = 9;
              case "null":
                return token = 7;
            }
            return token = 16;
          }
          value += String.fromCharCode(code);
          pos++;
          return token = 16;
      }
    }
    function isUnknownContentCharacter(code) {
      if (isWhiteSpace(code) || isLineBreak(code)) {
        return false;
      }
      switch (code) {
        case 125:
        case 93:
        case 123:
        case 91:
        case 34:
        case 58:
        case 44:
        case 47:
          return false;
      }
      return true;
    }
    function scanNextNonTrivia() {
      var result;
      do {
        result = scanNext();
      } while (result >= 12 && result <= 15);
      return result;
    }
    return {
      setPosition,
      getPosition: function() {
        return pos;
      },
      scan: ignoreTrivia ? scanNextNonTrivia : scanNext,
      getToken: function() {
        return token;
      },
      getTokenValue: function() {
        return value;
      },
      getTokenOffset: function() {
        return tokenOffset;
      },
      getTokenLength: function() {
        return pos - tokenOffset;
      },
      getTokenStartLine: function() {
        return lineStartOffset;
      },
      getTokenStartCharacter: function() {
        return tokenOffset - prevTokenLineStartOffset;
      },
      getTokenError: function() {
        return scanError;
      }
    };
  }
  function isWhiteSpace(ch) {
    return ch === 32 || ch === 9 || ch === 11 || ch === 12 || ch === 160 || ch === 5760 || ch >= 8192 && ch <= 8203 || ch === 8239 || ch === 8287 || ch === 12288 || ch === 65279;
  }
  function isLineBreak(ch) {
    return ch === 10 || ch === 13 || ch === 8232 || ch === 8233;
  }
  function isDigit(ch) {
    return ch >= 48 && ch <= 57;
  }

  // node_modules/jsonc-parser/lib/esm/impl/parser.js
  var ParseOptions;
  (function(ParseOptions2) {
    ParseOptions2.DEFAULT = {
      allowTrailingComma: false
    };
  })(ParseOptions || (ParseOptions = {}));

  // node_modules/jsonc-parser/lib/esm/main.js
  var createScanner2 = createScanner;

  // src/language/json/tokenization.ts
  function createTokenizationSupport(supportComments) {
    return {
      getInitialState: () => new JSONState(null, null, false, null),
      tokenize: (line, state) => tokenize(supportComments, line, state)
    };
  }
  var TOKEN_DELIM_OBJECT = "delimiter.bracket.json";
  var TOKEN_DELIM_ARRAY = "delimiter.array.json";
  var TOKEN_DELIM_COLON = "delimiter.colon.json";
  var TOKEN_DELIM_COMMA = "delimiter.comma.json";
  var TOKEN_VALUE_BOOLEAN = "keyword.json";
  var TOKEN_VALUE_NULL = "keyword.json";
  var TOKEN_VALUE_STRING = "string.value.json";
  var TOKEN_VALUE_NUMBER = "number.json";
  var TOKEN_PROPERTY_NAME = "string.key.json";
  var TOKEN_COMMENT_BLOCK = "comment.block.json";
  var TOKEN_COMMENT_LINE = "comment.line.json";
  var ParentsStack = class {
    constructor(parent, type) {
      this.parent = parent;
      this.type = type;
    }
    static pop(parents) {
      if (parents) {
        return parents.parent;
      }
      return null;
    }
    static push(parents, type) {
      return new ParentsStack(parents, type);
    }
    static equals(a, b) {
      if (!a && !b) {
        return true;
      }
      if (!a || !b) {
        return false;
      }
      while (a && b) {
        if (a === b) {
          return true;
        }
        if (a.type !== b.type) {
          return false;
        }
        a = a.parent;
        b = b.parent;
      }
      return true;
    }
  };
  var JSONState = class {
    _state;
    scanError;
    lastWasColon;
    parents;
    constructor(state, scanError, lastWasColon, parents) {
      this._state = state;
      this.scanError = scanError;
      this.lastWasColon = lastWasColon;
      this.parents = parents;
    }
    clone() {
      return new JSONState(this._state, this.scanError, this.lastWasColon, this.parents);
    }
    equals(other) {
      if (other === this) {
        return true;
      }
      if (!other || !(other instanceof JSONState)) {
        return false;
      }
      return this.scanError === other.scanError && this.lastWasColon === other.lastWasColon && ParentsStack.equals(this.parents, other.parents);
    }
    getStateData() {
      return this._state;
    }
    setStateData(state) {
      this._state = state;
    }
  };
  function tokenize(comments, line, state, offsetDelta = 0) {
    let numberOfInsertedCharacters = 0;
    let adjustOffset = false;
    switch (state.scanError) {
      case 2 /* UnexpectedEndOfString */:
        line = '"' + line;
        numberOfInsertedCharacters = 1;
        break;
      case 1 /* UnexpectedEndOfComment */:
        line = "/*" + line;
        numberOfInsertedCharacters = 2;
        break;
    }
    const scanner = createScanner2(line);
    let lastWasColon = state.lastWasColon;
    let parents = state.parents;
    const ret = {
      tokens: [],
      endState: state.clone()
    };
    while (true) {
      let offset = offsetDelta + scanner.getPosition();
      let type = "";
      const kind = scanner.scan();
      if (kind === 17 /* EOF */) {
        break;
      }
      if (offset === offsetDelta + scanner.getPosition()) {
        throw new Error("Scanner did not advance, next 3 characters are: " + line.substr(scanner.getPosition(), 3));
      }
      if (adjustOffset) {
        offset -= numberOfInsertedCharacters;
      }
      adjustOffset = numberOfInsertedCharacters > 0;
      switch (kind) {
        case 1 /* OpenBraceToken */:
          parents = ParentsStack.push(parents, 0 /* Object */);
          type = TOKEN_DELIM_OBJECT;
          lastWasColon = false;
          break;
        case 2 /* CloseBraceToken */:
          parents = ParentsStack.pop(parents);
          type = TOKEN_DELIM_OBJECT;
          lastWasColon = false;
          break;
        case 3 /* OpenBracketToken */:
          parents = ParentsStack.push(parents, 1 /* Array */);
          type = TOKEN_DELIM_ARRAY;
          lastWasColon = false;
          break;
        case 4 /* CloseBracketToken */:
          parents = ParentsStack.pop(parents);
          type = TOKEN_DELIM_ARRAY;
          lastWasColon = false;
          break;
        case 6 /* ColonToken */:
          type = TOKEN_DELIM_COLON;
          lastWasColon = true;
          break;
        case 5 /* CommaToken */:
          type = TOKEN_DELIM_COMMA;
          lastWasColon = false;
          break;
        case 8 /* TrueKeyword */:
        case 9 /* FalseKeyword */:
          type = TOKEN_VALUE_BOOLEAN;
          lastWasColon = false;
          break;
        case 7 /* NullKeyword */:
          type = TOKEN_VALUE_NULL;
          lastWasColon = false;
          break;
        case 10 /* StringLiteral */:
          const currentParent = parents ? parents.type : 0 /* Object */;
          const inArray = currentParent === 1 /* Array */;
          type = lastWasColon || inArray ? TOKEN_VALUE_STRING : TOKEN_PROPERTY_NAME;
          lastWasColon = false;
          break;
        case 11 /* NumericLiteral */:
          type = TOKEN_VALUE_NUMBER;
          lastWasColon = false;
          break;
      }
      if (comments) {
        switch (kind) {
          case 12 /* LineCommentTrivia */:
            type = TOKEN_COMMENT_LINE;
            break;
          case 13 /* BlockCommentTrivia */:
            type = TOKEN_COMMENT_BLOCK;
            break;
        }
      }
      ret.endState = new JSONState(state.getStateData(), scanner.getTokenError(), lastWasColon, parents);
      ret.tokens.push({
        startIndex: offset,
        scopes: type
      });
    }
    return ret;
  }

  // src/language/json/jsonMode.ts
  var JSONDiagnosticsAdapter = class extends DiagnosticsAdapter {
    constructor(languageId, worker, defaults) {
      super(languageId, worker, defaults.onDidChange);
      this._disposables.push(monaco_editor_core_exports.editor.onWillDisposeModel((model) => {
        this._resetSchema(model.uri);
      }));
      this._disposables.push(monaco_editor_core_exports.editor.onDidChangeModelLanguage((event) => {
        this._resetSchema(event.model.uri);
      }));
    }
    _resetSchema(resource) {
      this._worker().then((worker) => {
        worker.resetSchema(resource.toString());
      });
    }
  };
  function setupMode(defaults) {
    const disposables = [];
    const providers = [];
    const client = new WorkerManager(defaults);
    disposables.push(client);
    const worker = (...uris) => {
      return client.getLanguageServiceWorker(...uris);
    };
    function registerProviders() {
      const { languageId, modeConfiguration: modeConfiguration2 } = defaults;
      disposeAll(providers);
      if (modeConfiguration2.documentFormattingEdits) {
        providers.push(monaco_editor_core_exports.languages.registerDocumentFormattingEditProvider(languageId, new DocumentFormattingEditProvider(worker)));
      }
      if (modeConfiguration2.documentRangeFormattingEdits) {
        providers.push(monaco_editor_core_exports.languages.registerDocumentRangeFormattingEditProvider(languageId, new DocumentRangeFormattingEditProvider(worker)));
      }
      if (modeConfiguration2.completionItems) {
        providers.push(monaco_editor_core_exports.languages.registerCompletionItemProvider(languageId, new CompletionAdapter(worker, [" ", ":", '"'])));
      }
      if (modeConfiguration2.hovers) {
        providers.push(monaco_editor_core_exports.languages.registerHoverProvider(languageId, new HoverAdapter(worker)));
      }
      if (modeConfiguration2.documentSymbols) {
        providers.push(monaco_editor_core_exports.languages.registerDocumentSymbolProvider(languageId, new DocumentSymbolAdapter(worker)));
      }
      if (modeConfiguration2.tokens) {
        providers.push(monaco_editor_core_exports.languages.setTokensProvider(languageId, createTokenizationSupport(true)));
      }
      if (modeConfiguration2.colors) {
        providers.push(monaco_editor_core_exports.languages.registerColorProvider(languageId, new DocumentColorAdapter(worker)));
      }
      if (modeConfiguration2.foldingRanges) {
        providers.push(monaco_editor_core_exports.languages.registerFoldingRangeProvider(languageId, new FoldingRangeAdapter(worker)));
      }
      if (modeConfiguration2.diagnostics) {
        providers.push(new JSONDiagnosticsAdapter(languageId, worker, defaults));
      }
      if (modeConfiguration2.selectionRanges) {
        providers.push(monaco_editor_core_exports.languages.registerSelectionRangeProvider(languageId, new SelectionRangeAdapter(worker)));
      }
    }
    registerProviders();
    disposables.push(monaco_editor_core_exports.languages.setLanguageConfiguration(defaults.languageId, richEditConfiguration));
    let modeConfiguration = defaults.modeConfiguration;
    defaults.onDidChange((newDefaults) => {
      if (newDefaults.modeConfiguration !== modeConfiguration) {
        modeConfiguration = newDefaults.modeConfiguration;
        registerProviders();
      }
    });
    disposables.push(asDisposable(providers));
    return asDisposable(disposables);
  }
  function asDisposable(disposables) {
    return { dispose: () => disposeAll(disposables) };
  }
  function disposeAll(disposables) {
    while (disposables.length) {
      disposables.pop().dispose();
    }
  }
  var richEditConfiguration = {
    wordPattern: /(-?\d*\.\d\w*)|([^\[\{\]\}\:\"\,\s]+)/g,
    comments: {
      lineComment: "//",
      blockComment: ["/*", "*/"]
    },
    brackets: [
      ["{", "}"],
      ["[", "]"]
    ],
    autoClosingPairs: [
      { open: "{", close: "}", notIn: ["string"] },
      { open: "[", close: "]", notIn: ["string"] },
      { open: '"', close: '"', notIn: ["string"] }
    ]
  };
  return __toCommonJS(jsonMode_exports);
})();
return moduleExports;
});
