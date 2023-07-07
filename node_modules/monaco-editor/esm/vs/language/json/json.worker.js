/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.40.0(83b3cf23ca80c94cccca7c5b3e48351b220f8e35)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/

// src/language/json/json.worker.ts
import * as worker from "../../editor/editor.worker.js";

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

// node_modules/jsonc-parser/lib/esm/impl/format.js
function format(documentText, range, options) {
  var initialIndentLevel;
  var formatText;
  var formatTextStart;
  var rangeStart;
  var rangeEnd;
  if (range) {
    rangeStart = range.offset;
    rangeEnd = rangeStart + range.length;
    formatTextStart = rangeStart;
    while (formatTextStart > 0 && !isEOL(documentText, formatTextStart - 1)) {
      formatTextStart--;
    }
    var endOffset = rangeEnd;
    while (endOffset < documentText.length && !isEOL(documentText, endOffset)) {
      endOffset++;
    }
    formatText = documentText.substring(formatTextStart, endOffset);
    initialIndentLevel = computeIndentLevel(formatText, options);
  } else {
    formatText = documentText;
    initialIndentLevel = 0;
    formatTextStart = 0;
    rangeStart = 0;
    rangeEnd = documentText.length;
  }
  var eol = getEOL(options, documentText);
  var lineBreak = false;
  var indentLevel = 0;
  var indentValue;
  if (options.insertSpaces) {
    indentValue = repeat(" ", options.tabSize || 4);
  } else {
    indentValue = "	";
  }
  var scanner = createScanner(formatText, false);
  var hasError = false;
  function newLineAndIndent() {
    return eol + repeat(indentValue, initialIndentLevel + indentLevel);
  }
  function scanNext() {
    var token = scanner.scan();
    lineBreak = false;
    while (token === 15 || token === 14) {
      lineBreak = lineBreak || token === 14;
      token = scanner.scan();
    }
    hasError = token === 16 || scanner.getTokenError() !== 0;
    return token;
  }
  var editOperations = [];
  function addEdit(text, startOffset, endOffset2) {
    if (!hasError && (!range || startOffset < rangeEnd && endOffset2 > rangeStart) && documentText.substring(startOffset, endOffset2) !== text) {
      editOperations.push({ offset: startOffset, length: endOffset2 - startOffset, content: text });
    }
  }
  var firstToken = scanNext();
  if (firstToken !== 17) {
    var firstTokenStart = scanner.getTokenOffset() + formatTextStart;
    var initialIndent = repeat(indentValue, initialIndentLevel);
    addEdit(initialIndent, formatTextStart, firstTokenStart);
  }
  while (firstToken !== 17) {
    var firstTokenEnd = scanner.getTokenOffset() + scanner.getTokenLength() + formatTextStart;
    var secondToken = scanNext();
    var replaceContent = "";
    var needsLineBreak = false;
    while (!lineBreak && (secondToken === 12 || secondToken === 13)) {
      var commentTokenStart = scanner.getTokenOffset() + formatTextStart;
      addEdit(" ", firstTokenEnd, commentTokenStart);
      firstTokenEnd = scanner.getTokenOffset() + scanner.getTokenLength() + formatTextStart;
      needsLineBreak = secondToken === 12;
      replaceContent = needsLineBreak ? newLineAndIndent() : "";
      secondToken = scanNext();
    }
    if (secondToken === 2) {
      if (firstToken !== 1) {
        indentLevel--;
        replaceContent = newLineAndIndent();
      }
    } else if (secondToken === 4) {
      if (firstToken !== 3) {
        indentLevel--;
        replaceContent = newLineAndIndent();
      }
    } else {
      switch (firstToken) {
        case 3:
        case 1:
          indentLevel++;
          replaceContent = newLineAndIndent();
          break;
        case 5:
        case 12:
          replaceContent = newLineAndIndent();
          break;
        case 13:
          if (lineBreak) {
            replaceContent = newLineAndIndent();
          } else if (!needsLineBreak) {
            replaceContent = " ";
          }
          break;
        case 6:
          if (!needsLineBreak) {
            replaceContent = " ";
          }
          break;
        case 10:
          if (secondToken === 6) {
            if (!needsLineBreak) {
              replaceContent = "";
            }
            break;
          }
        case 7:
        case 8:
        case 9:
        case 11:
        case 2:
        case 4:
          if (secondToken === 12 || secondToken === 13) {
            if (!needsLineBreak) {
              replaceContent = " ";
            }
          } else if (secondToken !== 5 && secondToken !== 17) {
            hasError = true;
          }
          break;
        case 16:
          hasError = true;
          break;
      }
      if (lineBreak && (secondToken === 12 || secondToken === 13)) {
        replaceContent = newLineAndIndent();
      }
    }
    if (secondToken === 17) {
      replaceContent = options.insertFinalNewline ? eol : "";
    }
    var secondTokenStart = scanner.getTokenOffset() + formatTextStart;
    addEdit(replaceContent, firstTokenEnd, secondTokenStart);
    firstToken = secondToken;
  }
  return editOperations;
}
function repeat(s, count) {
  var result = "";
  for (var i = 0; i < count; i++) {
    result += s;
  }
  return result;
}
function computeIndentLevel(content, options) {
  var i = 0;
  var nChars = 0;
  var tabSize = options.tabSize || 4;
  while (i < content.length) {
    var ch = content.charAt(i);
    if (ch === " ") {
      nChars++;
    } else if (ch === "	") {
      nChars += tabSize;
    } else {
      break;
    }
    i++;
  }
  return Math.floor(nChars / tabSize);
}
function getEOL(options, text) {
  for (var i = 0; i < text.length; i++) {
    var ch = text.charAt(i);
    if (ch === "\r") {
      if (i + 1 < text.length && text.charAt(i + 1) === "\n") {
        return "\r\n";
      }
      return "\r";
    } else if (ch === "\n") {
      return "\n";
    }
  }
  return options && options.eol || "\n";
}
function isEOL(text, offset) {
  return "\r\n".indexOf(text.charAt(offset)) !== -1;
}

// node_modules/jsonc-parser/lib/esm/impl/parser.js
var ParseOptions;
(function(ParseOptions2) {
  ParseOptions2.DEFAULT = {
    allowTrailingComma: false
  };
})(ParseOptions || (ParseOptions = {}));
function parse(text, errors, options) {
  if (errors === void 0) {
    errors = [];
  }
  if (options === void 0) {
    options = ParseOptions.DEFAULT;
  }
  var currentProperty = null;
  var currentParent = [];
  var previousParents = [];
  function onValue(value) {
    if (Array.isArray(currentParent)) {
      currentParent.push(value);
    } else if (currentProperty !== null) {
      currentParent[currentProperty] = value;
    }
  }
  var visitor = {
    onObjectBegin: function() {
      var object = {};
      onValue(object);
      previousParents.push(currentParent);
      currentParent = object;
      currentProperty = null;
    },
    onObjectProperty: function(name) {
      currentProperty = name;
    },
    onObjectEnd: function() {
      currentParent = previousParents.pop();
    },
    onArrayBegin: function() {
      var array = [];
      onValue(array);
      previousParents.push(currentParent);
      currentParent = array;
      currentProperty = null;
    },
    onArrayEnd: function() {
      currentParent = previousParents.pop();
    },
    onLiteralValue: onValue,
    onError: function(error, offset, length) {
      errors.push({ error, offset, length });
    }
  };
  visit(text, visitor, options);
  return currentParent[0];
}
function getNodePath(node) {
  if (!node.parent || !node.parent.children) {
    return [];
  }
  var path = getNodePath(node.parent);
  if (node.parent.type === "property") {
    var key = node.parent.children[0].value;
    path.push(key);
  } else if (node.parent.type === "array") {
    var index = node.parent.children.indexOf(node);
    if (index !== -1) {
      path.push(index);
    }
  }
  return path;
}
function getNodeValue(node) {
  switch (node.type) {
    case "array":
      return node.children.map(getNodeValue);
    case "object":
      var obj = /* @__PURE__ */ Object.create(null);
      for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
        var prop = _a[_i];
        var valueNode = prop.children[1];
        if (valueNode) {
          obj[prop.children[0].value] = getNodeValue(valueNode);
        }
      }
      return obj;
    case "null":
    case "string":
    case "number":
    case "boolean":
      return node.value;
    default:
      return void 0;
  }
}
function contains(node, offset, includeRightBound) {
  if (includeRightBound === void 0) {
    includeRightBound = false;
  }
  return offset >= node.offset && offset < node.offset + node.length || includeRightBound && offset === node.offset + node.length;
}
function findNodeAtOffset(node, offset, includeRightBound) {
  if (includeRightBound === void 0) {
    includeRightBound = false;
  }
  if (contains(node, offset, includeRightBound)) {
    var children = node.children;
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length && children[i].offset <= offset; i++) {
        var item = findNodeAtOffset(children[i], offset, includeRightBound);
        if (item) {
          return item;
        }
      }
    }
    return node;
  }
  return void 0;
}
function visit(text, visitor, options) {
  if (options === void 0) {
    options = ParseOptions.DEFAULT;
  }
  var _scanner = createScanner(text, false);
  function toNoArgVisit(visitFunction) {
    return visitFunction ? function() {
      return visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter());
    } : function() {
      return true;
    };
  }
  function toOneArgVisit(visitFunction) {
    return visitFunction ? function(arg) {
      return visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter());
    } : function() {
      return true;
    };
  }
  var onObjectBegin = toNoArgVisit(visitor.onObjectBegin), onObjectProperty = toOneArgVisit(visitor.onObjectProperty), onObjectEnd = toNoArgVisit(visitor.onObjectEnd), onArrayBegin = toNoArgVisit(visitor.onArrayBegin), onArrayEnd = toNoArgVisit(visitor.onArrayEnd), onLiteralValue = toOneArgVisit(visitor.onLiteralValue), onSeparator = toOneArgVisit(visitor.onSeparator), onComment = toNoArgVisit(visitor.onComment), onError = toOneArgVisit(visitor.onError);
  var disallowComments = options && options.disallowComments;
  var allowTrailingComma = options && options.allowTrailingComma;
  function scanNext() {
    while (true) {
      var token = _scanner.scan();
      switch (_scanner.getTokenError()) {
        case 4:
          handleError(14);
          break;
        case 5:
          handleError(15);
          break;
        case 3:
          handleError(13);
          break;
        case 1:
          if (!disallowComments) {
            handleError(11);
          }
          break;
        case 2:
          handleError(12);
          break;
        case 6:
          handleError(16);
          break;
      }
      switch (token) {
        case 12:
        case 13:
          if (disallowComments) {
            handleError(10);
          } else {
            onComment();
          }
          break;
        case 16:
          handleError(1);
          break;
        case 15:
        case 14:
          break;
        default:
          return token;
      }
    }
  }
  function handleError(error, skipUntilAfter, skipUntil) {
    if (skipUntilAfter === void 0) {
      skipUntilAfter = [];
    }
    if (skipUntil === void 0) {
      skipUntil = [];
    }
    onError(error);
    if (skipUntilAfter.length + skipUntil.length > 0) {
      var token = _scanner.getToken();
      while (token !== 17) {
        if (skipUntilAfter.indexOf(token) !== -1) {
          scanNext();
          break;
        } else if (skipUntil.indexOf(token) !== -1) {
          break;
        }
        token = scanNext();
      }
    }
  }
  function parseString(isValue) {
    var value = _scanner.getTokenValue();
    if (isValue) {
      onLiteralValue(value);
    } else {
      onObjectProperty(value);
    }
    scanNext();
    return true;
  }
  function parseLiteral() {
    switch (_scanner.getToken()) {
      case 11:
        var tokenValue = _scanner.getTokenValue();
        var value = Number(tokenValue);
        if (isNaN(value)) {
          handleError(2);
          value = 0;
        }
        onLiteralValue(value);
        break;
      case 7:
        onLiteralValue(null);
        break;
      case 8:
        onLiteralValue(true);
        break;
      case 9:
        onLiteralValue(false);
        break;
      default:
        return false;
    }
    scanNext();
    return true;
  }
  function parseProperty() {
    if (_scanner.getToken() !== 10) {
      handleError(3, [], [2, 5]);
      return false;
    }
    parseString(false);
    if (_scanner.getToken() === 6) {
      onSeparator(":");
      scanNext();
      if (!parseValue()) {
        handleError(4, [], [2, 5]);
      }
    } else {
      handleError(5, [], [2, 5]);
    }
    return true;
  }
  function parseObject() {
    onObjectBegin();
    scanNext();
    var needsComma = false;
    while (_scanner.getToken() !== 2 && _scanner.getToken() !== 17) {
      if (_scanner.getToken() === 5) {
        if (!needsComma) {
          handleError(4, [], []);
        }
        onSeparator(",");
        scanNext();
        if (_scanner.getToken() === 2 && allowTrailingComma) {
          break;
        }
      } else if (needsComma) {
        handleError(6, [], []);
      }
      if (!parseProperty()) {
        handleError(4, [], [2, 5]);
      }
      needsComma = true;
    }
    onObjectEnd();
    if (_scanner.getToken() !== 2) {
      handleError(7, [2], []);
    } else {
      scanNext();
    }
    return true;
  }
  function parseArray() {
    onArrayBegin();
    scanNext();
    var needsComma = false;
    while (_scanner.getToken() !== 4 && _scanner.getToken() !== 17) {
      if (_scanner.getToken() === 5) {
        if (!needsComma) {
          handleError(4, [], []);
        }
        onSeparator(",");
        scanNext();
        if (_scanner.getToken() === 4 && allowTrailingComma) {
          break;
        }
      } else if (needsComma) {
        handleError(6, [], []);
      }
      if (!parseValue()) {
        handleError(4, [], [4, 5]);
      }
      needsComma = true;
    }
    onArrayEnd();
    if (_scanner.getToken() !== 4) {
      handleError(8, [4], []);
    } else {
      scanNext();
    }
    return true;
  }
  function parseValue() {
    switch (_scanner.getToken()) {
      case 3:
        return parseArray();
      case 1:
        return parseObject();
      case 10:
        return parseString(true);
      default:
        return parseLiteral();
    }
  }
  scanNext();
  if (_scanner.getToken() === 17) {
    if (options.allowEmptyContent) {
      return true;
    }
    handleError(4, [], []);
    return false;
  }
  if (!parseValue()) {
    handleError(4, [], []);
    return false;
  }
  if (_scanner.getToken() !== 17) {
    handleError(9, [], []);
  }
  return true;
}

// node_modules/jsonc-parser/lib/esm/main.js
var createScanner2 = createScanner;
var parse2 = parse;
var findNodeAtOffset2 = findNodeAtOffset;
var getNodePath2 = getNodePath;
var getNodeValue2 = getNodeValue;
function format2(documentText, range, options) {
  return format(documentText, range, options);
}

// node_modules/vscode-json-languageservice/lib/esm/utils/objects.js
function equals(one, other) {
  if (one === other) {
    return true;
  }
  if (one === null || one === void 0 || other === null || other === void 0) {
    return false;
  }
  if (typeof one !== typeof other) {
    return false;
  }
  if (typeof one !== "object") {
    return false;
  }
  if (Array.isArray(one) !== Array.isArray(other)) {
    return false;
  }
  var i, key;
  if (Array.isArray(one)) {
    if (one.length !== other.length) {
      return false;
    }
    for (i = 0; i < one.length; i++) {
      if (!equals(one[i], other[i])) {
        return false;
      }
    }
  } else {
    var oneKeys = [];
    for (key in one) {
      oneKeys.push(key);
    }
    oneKeys.sort();
    var otherKeys = [];
    for (key in other) {
      otherKeys.push(key);
    }
    otherKeys.sort();
    if (!equals(oneKeys, otherKeys)) {
      return false;
    }
    for (i = 0; i < oneKeys.length; i++) {
      if (!equals(one[oneKeys[i]], other[oneKeys[i]])) {
        return false;
      }
    }
  }
  return true;
}
function isNumber(val) {
  return typeof val === "number";
}
function isDefined(val) {
  return typeof val !== "undefined";
}
function isBoolean(val) {
  return typeof val === "boolean";
}
function isString(val) {
  return typeof val === "string";
}

// node_modules/vscode-json-languageservice/lib/esm/utils/strings.js
function startsWith(haystack, needle) {
  if (haystack.length < needle.length) {
    return false;
  }
  for (var i = 0; i < needle.length; i++) {
    if (haystack[i] !== needle[i]) {
      return false;
    }
  }
  return true;
}
function endsWith(haystack, needle) {
  var diff = haystack.length - needle.length;
  if (diff > 0) {
    return haystack.lastIndexOf(needle) === diff;
  } else if (diff === 0) {
    return haystack === needle;
  } else {
    return false;
  }
}
function extendedRegExp(pattern) {
  var flags = "";
  if (startsWith(pattern, "(?i)")) {
    pattern = pattern.substring(4);
    flags = "i";
  }
  try {
    return new RegExp(pattern, flags + "u");
  } catch (e) {
    try {
      return new RegExp(pattern, flags);
    } catch (e2) {
      return void 0;
    }
  }
}

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
(function(Position2) {
  function create(line, character) {
    if (line === Number.MAX_VALUE) {
      line = uinteger.MAX_VALUE;
    }
    if (character === Number.MAX_VALUE) {
      character = uinteger.MAX_VALUE;
    }
    return { line, character };
  }
  Position2.create = create;
  function is(value) {
    var candidate = value;
    return Is.objectLiteral(candidate) && Is.uinteger(candidate.line) && Is.uinteger(candidate.character);
  }
  Position2.is = is;
})(Position || (Position = {}));
var Range;
(function(Range2) {
  function create(one, two, three, four) {
    if (Is.uinteger(one) && Is.uinteger(two) && Is.uinteger(three) && Is.uinteger(four)) {
      return { start: Position.create(one, two), end: Position.create(three, four) };
    } else if (Position.is(one) && Position.is(two)) {
      return { start: one, end: two };
    } else {
      throw new Error("Range#create called with invalid arguments[" + one + ", " + two + ", " + three + ", " + four + "]");
    }
  }
  Range2.create = create;
  function is(value) {
    var candidate = value;
    return Is.objectLiteral(candidate) && Position.is(candidate.start) && Position.is(candidate.end);
  }
  Range2.is = is;
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
(function(TextDocument3) {
  function create(uri, languageId, version, content) {
    return new FullTextDocument(uri, languageId, version, content);
  }
  TextDocument3.create = create;
  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Is.string(candidate.uri) && (Is.undefined(candidate.languageId) || Is.string(candidate.languageId)) && Is.uinteger(candidate.lineCount) && Is.func(candidate.getText) && Is.func(candidate.positionAt) && Is.func(candidate.offsetAt) ? true : false;
  }
  TextDocument3.is = is;
  function applyEdits(document, edits) {
    var text = document.getText();
    var sortedEdits = mergeSort2(edits, function(a2, b) {
      var diff = a2.range.start.line - b.range.start.line;
      if (diff === 0) {
        return a2.range.start.character - b.range.start.character;
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
  TextDocument3.applyEdits = applyEdits;
  function mergeSort2(data, compare) {
    if (data.length <= 1) {
      return data;
    }
    var p = data.length / 2 | 0;
    var left = data.slice(0, p);
    var right = data.slice(p);
    mergeSort2(left, compare);
    mergeSort2(right, compare);
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
  function FullTextDocument3(uri, languageId, version, content) {
    this._uri = uri;
    this._languageId = languageId;
    this._version = version;
    this._content = content;
    this._lineOffsets = void 0;
  }
  Object.defineProperty(FullTextDocument3.prototype, "uri", {
    get: function() {
      return this._uri;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(FullTextDocument3.prototype, "languageId", {
    get: function() {
      return this._languageId;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(FullTextDocument3.prototype, "version", {
    get: function() {
      return this._version;
    },
    enumerable: false,
    configurable: true
  });
  FullTextDocument3.prototype.getText = function(range) {
    if (range) {
      var start = this.offsetAt(range.start);
      var end = this.offsetAt(range.end);
      return this._content.substring(start, end);
    }
    return this._content;
  };
  FullTextDocument3.prototype.update = function(event, version) {
    this._content = event.text;
    this._version = version;
    this._lineOffsets = void 0;
  };
  FullTextDocument3.prototype.getLineOffsets = function() {
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
  FullTextDocument3.prototype.positionAt = function(offset) {
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
  FullTextDocument3.prototype.offsetAt = function(position) {
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
  Object.defineProperty(FullTextDocument3.prototype, "lineCount", {
    get: function() {
      return this.getLineOffsets().length;
    },
    enumerable: false,
    configurable: true
  });
  return FullTextDocument3;
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

// node_modules/vscode-languageserver-textdocument/lib/esm/main.js
var FullTextDocument2 = class {
  constructor(uri, languageId, version, content) {
    this._uri = uri;
    this._languageId = languageId;
    this._version = version;
    this._content = content;
    this._lineOffsets = void 0;
  }
  get uri() {
    return this._uri;
  }
  get languageId() {
    return this._languageId;
  }
  get version() {
    return this._version;
  }
  getText(range) {
    if (range) {
      const start = this.offsetAt(range.start);
      const end = this.offsetAt(range.end);
      return this._content.substring(start, end);
    }
    return this._content;
  }
  update(changes, version) {
    for (let change of changes) {
      if (FullTextDocument2.isIncremental(change)) {
        const range = getWellformedRange(change.range);
        const startOffset = this.offsetAt(range.start);
        const endOffset = this.offsetAt(range.end);
        this._content = this._content.substring(0, startOffset) + change.text + this._content.substring(endOffset, this._content.length);
        const startLine = Math.max(range.start.line, 0);
        const endLine = Math.max(range.end.line, 0);
        let lineOffsets = this._lineOffsets;
        const addedLineOffsets = computeLineOffsets(change.text, false, startOffset);
        if (endLine - startLine === addedLineOffsets.length) {
          for (let i = 0, len = addedLineOffsets.length; i < len; i++) {
            lineOffsets[i + startLine + 1] = addedLineOffsets[i];
          }
        } else {
          if (addedLineOffsets.length < 1e4) {
            lineOffsets.splice(startLine + 1, endLine - startLine, ...addedLineOffsets);
          } else {
            this._lineOffsets = lineOffsets = lineOffsets.slice(0, startLine + 1).concat(addedLineOffsets, lineOffsets.slice(endLine + 1));
          }
        }
        const diff = change.text.length - (endOffset - startOffset);
        if (diff !== 0) {
          for (let i = startLine + 1 + addedLineOffsets.length, len = lineOffsets.length; i < len; i++) {
            lineOffsets[i] = lineOffsets[i] + diff;
          }
        }
      } else if (FullTextDocument2.isFull(change)) {
        this._content = change.text;
        this._lineOffsets = void 0;
      } else {
        throw new Error("Unknown change event received");
      }
    }
    this._version = version;
  }
  getLineOffsets() {
    if (this._lineOffsets === void 0) {
      this._lineOffsets = computeLineOffsets(this._content, true);
    }
    return this._lineOffsets;
  }
  positionAt(offset) {
    offset = Math.max(Math.min(offset, this._content.length), 0);
    let lineOffsets = this.getLineOffsets();
    let low = 0, high = lineOffsets.length;
    if (high === 0) {
      return { line: 0, character: offset };
    }
    while (low < high) {
      let mid = Math.floor((low + high) / 2);
      if (lineOffsets[mid] > offset) {
        high = mid;
      } else {
        low = mid + 1;
      }
    }
    let line = low - 1;
    return { line, character: offset - lineOffsets[line] };
  }
  offsetAt(position) {
    let lineOffsets = this.getLineOffsets();
    if (position.line >= lineOffsets.length) {
      return this._content.length;
    } else if (position.line < 0) {
      return 0;
    }
    let lineOffset = lineOffsets[position.line];
    let nextLineOffset = position.line + 1 < lineOffsets.length ? lineOffsets[position.line + 1] : this._content.length;
    return Math.max(Math.min(lineOffset + position.character, nextLineOffset), lineOffset);
  }
  get lineCount() {
    return this.getLineOffsets().length;
  }
  static isIncremental(event) {
    let candidate = event;
    return candidate !== void 0 && candidate !== null && typeof candidate.text === "string" && candidate.range !== void 0 && (candidate.rangeLength === void 0 || typeof candidate.rangeLength === "number");
  }
  static isFull(event) {
    let candidate = event;
    return candidate !== void 0 && candidate !== null && typeof candidate.text === "string" && candidate.range === void 0 && candidate.rangeLength === void 0;
  }
};
var TextDocument2;
(function(TextDocument3) {
  function create(uri, languageId, version, content) {
    return new FullTextDocument2(uri, languageId, version, content);
  }
  TextDocument3.create = create;
  function update(document, changes, version) {
    if (document instanceof FullTextDocument2) {
      document.update(changes, version);
      return document;
    } else {
      throw new Error("TextDocument.update: document must be created by TextDocument.create");
    }
  }
  TextDocument3.update = update;
  function applyEdits(document, edits) {
    let text = document.getText();
    let sortedEdits = mergeSort(edits.map(getWellformedEdit), (a2, b) => {
      let diff = a2.range.start.line - b.range.start.line;
      if (diff === 0) {
        return a2.range.start.character - b.range.start.character;
      }
      return diff;
    });
    let lastModifiedOffset = 0;
    const spans = [];
    for (const e of sortedEdits) {
      let startOffset = document.offsetAt(e.range.start);
      if (startOffset < lastModifiedOffset) {
        throw new Error("Overlapping edit");
      } else if (startOffset > lastModifiedOffset) {
        spans.push(text.substring(lastModifiedOffset, startOffset));
      }
      if (e.newText.length) {
        spans.push(e.newText);
      }
      lastModifiedOffset = document.offsetAt(e.range.end);
    }
    spans.push(text.substr(lastModifiedOffset));
    return spans.join("");
  }
  TextDocument3.applyEdits = applyEdits;
})(TextDocument2 || (TextDocument2 = {}));
function mergeSort(data, compare) {
  if (data.length <= 1) {
    return data;
  }
  const p = data.length / 2 | 0;
  const left = data.slice(0, p);
  const right = data.slice(p);
  mergeSort(left, compare);
  mergeSort(right, compare);
  let leftIdx = 0;
  let rightIdx = 0;
  let i = 0;
  while (leftIdx < left.length && rightIdx < right.length) {
    let ret = compare(left[leftIdx], right[rightIdx]);
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
function computeLineOffsets(text, isAtLineStart, textOffset = 0) {
  const result = isAtLineStart ? [textOffset] : [];
  for (let i = 0; i < text.length; i++) {
    let ch = text.charCodeAt(i);
    if (ch === 13 || ch === 10) {
      if (ch === 13 && i + 1 < text.length && text.charCodeAt(i + 1) === 10) {
        i++;
      }
      result.push(textOffset + i + 1);
    }
  }
  return result;
}
function getWellformedRange(range) {
  const start = range.start;
  const end = range.end;
  if (start.line > end.line || start.line === end.line && start.character > end.character) {
    return { start: end, end: start };
  }
  return range;
}
function getWellformedEdit(textEdit) {
  const range = getWellformedRange(textEdit.range);
  if (range !== textEdit.range) {
    return { newText: textEdit.newText, range };
  }
  return textEdit;
}

// node_modules/vscode-json-languageservice/lib/esm/jsonLanguageTypes.js
var ErrorCode;
(function(ErrorCode2) {
  ErrorCode2[ErrorCode2["Undefined"] = 0] = "Undefined";
  ErrorCode2[ErrorCode2["EnumValueMismatch"] = 1] = "EnumValueMismatch";
  ErrorCode2[ErrorCode2["Deprecated"] = 2] = "Deprecated";
  ErrorCode2[ErrorCode2["UnexpectedEndOfComment"] = 257] = "UnexpectedEndOfComment";
  ErrorCode2[ErrorCode2["UnexpectedEndOfString"] = 258] = "UnexpectedEndOfString";
  ErrorCode2[ErrorCode2["UnexpectedEndOfNumber"] = 259] = "UnexpectedEndOfNumber";
  ErrorCode2[ErrorCode2["InvalidUnicode"] = 260] = "InvalidUnicode";
  ErrorCode2[ErrorCode2["InvalidEscapeCharacter"] = 261] = "InvalidEscapeCharacter";
  ErrorCode2[ErrorCode2["InvalidCharacter"] = 262] = "InvalidCharacter";
  ErrorCode2[ErrorCode2["PropertyExpected"] = 513] = "PropertyExpected";
  ErrorCode2[ErrorCode2["CommaExpected"] = 514] = "CommaExpected";
  ErrorCode2[ErrorCode2["ColonExpected"] = 515] = "ColonExpected";
  ErrorCode2[ErrorCode2["ValueExpected"] = 516] = "ValueExpected";
  ErrorCode2[ErrorCode2["CommaOrCloseBacketExpected"] = 517] = "CommaOrCloseBacketExpected";
  ErrorCode2[ErrorCode2["CommaOrCloseBraceExpected"] = 518] = "CommaOrCloseBraceExpected";
  ErrorCode2[ErrorCode2["TrailingComma"] = 519] = "TrailingComma";
  ErrorCode2[ErrorCode2["DuplicateKey"] = 520] = "DuplicateKey";
  ErrorCode2[ErrorCode2["CommentNotPermitted"] = 521] = "CommentNotPermitted";
  ErrorCode2[ErrorCode2["SchemaResolveError"] = 768] = "SchemaResolveError";
})(ErrorCode || (ErrorCode = {}));
var ClientCapabilities;
(function(ClientCapabilities2) {
  ClientCapabilities2.LATEST = {
    textDocument: {
      completion: {
        completionItem: {
          documentationFormat: [MarkupKind.Markdown, MarkupKind.PlainText],
          commitCharactersSupport: true
        }
      }
    }
  };
})(ClientCapabilities || (ClientCapabilities = {}));

// build/fillers/vscode-nls.ts
function format3(message, args) {
  let result;
  if (args.length === 0) {
    result = message;
  } else {
    result = message.replace(/\{(\d+)\}/g, (match, rest) => {
      let index = rest[0];
      return typeof args[index] !== "undefined" ? args[index] : match;
    });
  }
  return result;
}
function localize(key, message, ...args) {
  return format3(message, args);
}
function loadMessageBundle(file) {
  return localize;
}

// node_modules/vscode-json-languageservice/lib/esm/parser/jsonParser.js
var __extends = function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p))
          d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var localize2 = loadMessageBundle();
var formats = {
  "color-hex": { errorMessage: localize2("colorHexFormatWarning", "Invalid color format. Use #RGB, #RGBA, #RRGGBB or #RRGGBBAA."), pattern: /^#([0-9A-Fa-f]{3,4}|([0-9A-Fa-f]{2}){3,4})$/ },
  "date-time": { errorMessage: localize2("dateTimeFormatWarning", "String is not a RFC3339 date-time."), pattern: /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60)(\.[0-9]+)?(Z|(\+|-)([01][0-9]|2[0-3]):([0-5][0-9]))$/i },
  "date": { errorMessage: localize2("dateFormatWarning", "String is not a RFC3339 date."), pattern: /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/i },
  "time": { errorMessage: localize2("timeFormatWarning", "String is not a RFC3339 time."), pattern: /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60)(\.[0-9]+)?(Z|(\+|-)([01][0-9]|2[0-3]):([0-5][0-9]))$/i },
  "email": { errorMessage: localize2("emailFormatWarning", "String is not an e-mail address."), pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/ },
  "hostname": { errorMessage: localize2("hostnameFormatWarning", "String is not a hostname."), pattern: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i },
  "ipv4": { errorMessage: localize2("ipv4FormatWarning", "String is not an IPv4 address."), pattern: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/ },
  "ipv6": { errorMessage: localize2("ipv6FormatWarning", "String is not an IPv6 address."), pattern: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i }
};
var ASTNodeImpl = function() {
  function ASTNodeImpl2(parent, offset, length) {
    if (length === void 0) {
      length = 0;
    }
    this.offset = offset;
    this.length = length;
    this.parent = parent;
  }
  Object.defineProperty(ASTNodeImpl2.prototype, "children", {
    get: function() {
      return [];
    },
    enumerable: false,
    configurable: true
  });
  ASTNodeImpl2.prototype.toString = function() {
    return "type: " + this.type + " (" + this.offset + "/" + this.length + ")" + (this.parent ? " parent: {" + this.parent.toString() + "}" : "");
  };
  return ASTNodeImpl2;
}();
var NullASTNodeImpl = function(_super) {
  __extends(NullASTNodeImpl2, _super);
  function NullASTNodeImpl2(parent, offset) {
    var _this = _super.call(this, parent, offset) || this;
    _this.type = "null";
    _this.value = null;
    return _this;
  }
  return NullASTNodeImpl2;
}(ASTNodeImpl);
var BooleanASTNodeImpl = function(_super) {
  __extends(BooleanASTNodeImpl2, _super);
  function BooleanASTNodeImpl2(parent, boolValue, offset) {
    var _this = _super.call(this, parent, offset) || this;
    _this.type = "boolean";
    _this.value = boolValue;
    return _this;
  }
  return BooleanASTNodeImpl2;
}(ASTNodeImpl);
var ArrayASTNodeImpl = function(_super) {
  __extends(ArrayASTNodeImpl2, _super);
  function ArrayASTNodeImpl2(parent, offset) {
    var _this = _super.call(this, parent, offset) || this;
    _this.type = "array";
    _this.items = [];
    return _this;
  }
  Object.defineProperty(ArrayASTNodeImpl2.prototype, "children", {
    get: function() {
      return this.items;
    },
    enumerable: false,
    configurable: true
  });
  return ArrayASTNodeImpl2;
}(ASTNodeImpl);
var NumberASTNodeImpl = function(_super) {
  __extends(NumberASTNodeImpl2, _super);
  function NumberASTNodeImpl2(parent, offset) {
    var _this = _super.call(this, parent, offset) || this;
    _this.type = "number";
    _this.isInteger = true;
    _this.value = Number.NaN;
    return _this;
  }
  return NumberASTNodeImpl2;
}(ASTNodeImpl);
var StringASTNodeImpl = function(_super) {
  __extends(StringASTNodeImpl2, _super);
  function StringASTNodeImpl2(parent, offset, length) {
    var _this = _super.call(this, parent, offset, length) || this;
    _this.type = "string";
    _this.value = "";
    return _this;
  }
  return StringASTNodeImpl2;
}(ASTNodeImpl);
var PropertyASTNodeImpl = function(_super) {
  __extends(PropertyASTNodeImpl2, _super);
  function PropertyASTNodeImpl2(parent, offset, keyNode) {
    var _this = _super.call(this, parent, offset) || this;
    _this.type = "property";
    _this.colonOffset = -1;
    _this.keyNode = keyNode;
    return _this;
  }
  Object.defineProperty(PropertyASTNodeImpl2.prototype, "children", {
    get: function() {
      return this.valueNode ? [this.keyNode, this.valueNode] : [this.keyNode];
    },
    enumerable: false,
    configurable: true
  });
  return PropertyASTNodeImpl2;
}(ASTNodeImpl);
var ObjectASTNodeImpl = function(_super) {
  __extends(ObjectASTNodeImpl2, _super);
  function ObjectASTNodeImpl2(parent, offset) {
    var _this = _super.call(this, parent, offset) || this;
    _this.type = "object";
    _this.properties = [];
    return _this;
  }
  Object.defineProperty(ObjectASTNodeImpl2.prototype, "children", {
    get: function() {
      return this.properties;
    },
    enumerable: false,
    configurable: true
  });
  return ObjectASTNodeImpl2;
}(ASTNodeImpl);
function asSchema(schema) {
  if (isBoolean(schema)) {
    return schema ? {} : { "not": {} };
  }
  return schema;
}
var EnumMatch;
(function(EnumMatch2) {
  EnumMatch2[EnumMatch2["Key"] = 0] = "Key";
  EnumMatch2[EnumMatch2["Enum"] = 1] = "Enum";
})(EnumMatch || (EnumMatch = {}));
var SchemaCollector = function() {
  function SchemaCollector2(focusOffset, exclude) {
    if (focusOffset === void 0) {
      focusOffset = -1;
    }
    this.focusOffset = focusOffset;
    this.exclude = exclude;
    this.schemas = [];
  }
  SchemaCollector2.prototype.add = function(schema) {
    this.schemas.push(schema);
  };
  SchemaCollector2.prototype.merge = function(other) {
    Array.prototype.push.apply(this.schemas, other.schemas);
  };
  SchemaCollector2.prototype.include = function(node) {
    return (this.focusOffset === -1 || contains2(node, this.focusOffset)) && node !== this.exclude;
  };
  SchemaCollector2.prototype.newSub = function() {
    return new SchemaCollector2(-1, this.exclude);
  };
  return SchemaCollector2;
}();
var NoOpSchemaCollector = function() {
  function NoOpSchemaCollector2() {
  }
  Object.defineProperty(NoOpSchemaCollector2.prototype, "schemas", {
    get: function() {
      return [];
    },
    enumerable: false,
    configurable: true
  });
  NoOpSchemaCollector2.prototype.add = function(schema) {
  };
  NoOpSchemaCollector2.prototype.merge = function(other) {
  };
  NoOpSchemaCollector2.prototype.include = function(node) {
    return true;
  };
  NoOpSchemaCollector2.prototype.newSub = function() {
    return this;
  };
  NoOpSchemaCollector2.instance = new NoOpSchemaCollector2();
  return NoOpSchemaCollector2;
}();
var ValidationResult = function() {
  function ValidationResult2() {
    this.problems = [];
    this.propertiesMatches = 0;
    this.propertiesValueMatches = 0;
    this.primaryValueMatches = 0;
    this.enumValueMatch = false;
    this.enumValues = void 0;
  }
  ValidationResult2.prototype.hasProblems = function() {
    return !!this.problems.length;
  };
  ValidationResult2.prototype.mergeAll = function(validationResults) {
    for (var _i = 0, validationResults_1 = validationResults; _i < validationResults_1.length; _i++) {
      var validationResult = validationResults_1[_i];
      this.merge(validationResult);
    }
  };
  ValidationResult2.prototype.merge = function(validationResult) {
    this.problems = this.problems.concat(validationResult.problems);
  };
  ValidationResult2.prototype.mergeEnumValues = function(validationResult) {
    if (!this.enumValueMatch && !validationResult.enumValueMatch && this.enumValues && validationResult.enumValues) {
      this.enumValues = this.enumValues.concat(validationResult.enumValues);
      for (var _i = 0, _a = this.problems; _i < _a.length; _i++) {
        var error = _a[_i];
        if (error.code === ErrorCode.EnumValueMismatch) {
          error.message = localize2("enumWarning", "Value is not accepted. Valid values: {0}.", this.enumValues.map(function(v) {
            return JSON.stringify(v);
          }).join(", "));
        }
      }
    }
  };
  ValidationResult2.prototype.mergePropertyMatch = function(propertyValidationResult) {
    this.merge(propertyValidationResult);
    this.propertiesMatches++;
    if (propertyValidationResult.enumValueMatch || !propertyValidationResult.hasProblems() && propertyValidationResult.propertiesMatches) {
      this.propertiesValueMatches++;
    }
    if (propertyValidationResult.enumValueMatch && propertyValidationResult.enumValues && propertyValidationResult.enumValues.length === 1) {
      this.primaryValueMatches++;
    }
  };
  ValidationResult2.prototype.compare = function(other) {
    var hasProblems = this.hasProblems();
    if (hasProblems !== other.hasProblems()) {
      return hasProblems ? -1 : 1;
    }
    if (this.enumValueMatch !== other.enumValueMatch) {
      return other.enumValueMatch ? -1 : 1;
    }
    if (this.primaryValueMatches !== other.primaryValueMatches) {
      return this.primaryValueMatches - other.primaryValueMatches;
    }
    if (this.propertiesValueMatches !== other.propertiesValueMatches) {
      return this.propertiesValueMatches - other.propertiesValueMatches;
    }
    return this.propertiesMatches - other.propertiesMatches;
  };
  return ValidationResult2;
}();
function newJSONDocument(root, diagnostics) {
  if (diagnostics === void 0) {
    diagnostics = [];
  }
  return new JSONDocument(root, diagnostics, []);
}
function getNodeValue3(node) {
  return getNodeValue2(node);
}
function getNodePath3(node) {
  return getNodePath2(node);
}
function contains2(node, offset, includeRightBound) {
  if (includeRightBound === void 0) {
    includeRightBound = false;
  }
  return offset >= node.offset && offset < node.offset + node.length || includeRightBound && offset === node.offset + node.length;
}
var JSONDocument = function() {
  function JSONDocument2(root, syntaxErrors, comments) {
    if (syntaxErrors === void 0) {
      syntaxErrors = [];
    }
    if (comments === void 0) {
      comments = [];
    }
    this.root = root;
    this.syntaxErrors = syntaxErrors;
    this.comments = comments;
  }
  JSONDocument2.prototype.getNodeFromOffset = function(offset, includeRightBound) {
    if (includeRightBound === void 0) {
      includeRightBound = false;
    }
    if (this.root) {
      return findNodeAtOffset2(this.root, offset, includeRightBound);
    }
    return void 0;
  };
  JSONDocument2.prototype.visit = function(visitor) {
    if (this.root) {
      var doVisit_1 = function(node) {
        var ctn = visitor(node);
        var children = node.children;
        if (Array.isArray(children)) {
          for (var i = 0; i < children.length && ctn; i++) {
            ctn = doVisit_1(children[i]);
          }
        }
        return ctn;
      };
      doVisit_1(this.root);
    }
  };
  JSONDocument2.prototype.validate = function(textDocument, schema, severity) {
    if (severity === void 0) {
      severity = DiagnosticSeverity.Warning;
    }
    if (this.root && schema) {
      var validationResult = new ValidationResult();
      validate(this.root, schema, validationResult, NoOpSchemaCollector.instance);
      return validationResult.problems.map(function(p) {
        var _a;
        var range = Range.create(textDocument.positionAt(p.location.offset), textDocument.positionAt(p.location.offset + p.location.length));
        return Diagnostic.create(range, p.message, (_a = p.severity) !== null && _a !== void 0 ? _a : severity, p.code);
      });
    }
    return void 0;
  };
  JSONDocument2.prototype.getMatchingSchemas = function(schema, focusOffset, exclude) {
    if (focusOffset === void 0) {
      focusOffset = -1;
    }
    var matchingSchemas = new SchemaCollector(focusOffset, exclude);
    if (this.root && schema) {
      validate(this.root, schema, new ValidationResult(), matchingSchemas);
    }
    return matchingSchemas.schemas;
  };
  return JSONDocument2;
}();
function validate(n, schema, validationResult, matchingSchemas) {
  if (!n || !matchingSchemas.include(n)) {
    return;
  }
  var node = n;
  switch (node.type) {
    case "object":
      _validateObjectNode(node, schema, validationResult, matchingSchemas);
      break;
    case "array":
      _validateArrayNode(node, schema, validationResult, matchingSchemas);
      break;
    case "string":
      _validateStringNode(node, schema, validationResult, matchingSchemas);
      break;
    case "number":
      _validateNumberNode(node, schema, validationResult, matchingSchemas);
      break;
    case "property":
      return validate(node.valueNode, schema, validationResult, matchingSchemas);
  }
  _validateNode();
  matchingSchemas.add({ node, schema });
  function _validateNode() {
    function matchesType(type) {
      return node.type === type || type === "integer" && node.type === "number" && node.isInteger;
    }
    if (Array.isArray(schema.type)) {
      if (!schema.type.some(matchesType)) {
        validationResult.problems.push({
          location: { offset: node.offset, length: node.length },
          message: schema.errorMessage || localize2("typeArrayMismatchWarning", "Incorrect type. Expected one of {0}.", schema.type.join(", "))
        });
      }
    } else if (schema.type) {
      if (!matchesType(schema.type)) {
        validationResult.problems.push({
          location: { offset: node.offset, length: node.length },
          message: schema.errorMessage || localize2("typeMismatchWarning", 'Incorrect type. Expected "{0}".', schema.type)
        });
      }
    }
    if (Array.isArray(schema.allOf)) {
      for (var _i = 0, _a = schema.allOf; _i < _a.length; _i++) {
        var subSchemaRef = _a[_i];
        validate(node, asSchema(subSchemaRef), validationResult, matchingSchemas);
      }
    }
    var notSchema = asSchema(schema.not);
    if (notSchema) {
      var subValidationResult = new ValidationResult();
      var subMatchingSchemas = matchingSchemas.newSub();
      validate(node, notSchema, subValidationResult, subMatchingSchemas);
      if (!subValidationResult.hasProblems()) {
        validationResult.problems.push({
          location: { offset: node.offset, length: node.length },
          message: localize2("notSchemaWarning", "Matches a schema that is not allowed.")
        });
      }
      for (var _b = 0, _c = subMatchingSchemas.schemas; _b < _c.length; _b++) {
        var ms = _c[_b];
        ms.inverted = !ms.inverted;
        matchingSchemas.add(ms);
      }
    }
    var testAlternatives = function(alternatives, maxOneMatch) {
      var matches = [];
      var bestMatch = void 0;
      for (var _i2 = 0, alternatives_1 = alternatives; _i2 < alternatives_1.length; _i2++) {
        var subSchemaRef2 = alternatives_1[_i2];
        var subSchema = asSchema(subSchemaRef2);
        var subValidationResult2 = new ValidationResult();
        var subMatchingSchemas2 = matchingSchemas.newSub();
        validate(node, subSchema, subValidationResult2, subMatchingSchemas2);
        if (!subValidationResult2.hasProblems()) {
          matches.push(subSchema);
        }
        if (!bestMatch) {
          bestMatch = { schema: subSchema, validationResult: subValidationResult2, matchingSchemas: subMatchingSchemas2 };
        } else {
          if (!maxOneMatch && !subValidationResult2.hasProblems() && !bestMatch.validationResult.hasProblems()) {
            bestMatch.matchingSchemas.merge(subMatchingSchemas2);
            bestMatch.validationResult.propertiesMatches += subValidationResult2.propertiesMatches;
            bestMatch.validationResult.propertiesValueMatches += subValidationResult2.propertiesValueMatches;
          } else {
            var compareResult = subValidationResult2.compare(bestMatch.validationResult);
            if (compareResult > 0) {
              bestMatch = { schema: subSchema, validationResult: subValidationResult2, matchingSchemas: subMatchingSchemas2 };
            } else if (compareResult === 0) {
              bestMatch.matchingSchemas.merge(subMatchingSchemas2);
              bestMatch.validationResult.mergeEnumValues(subValidationResult2);
            }
          }
        }
      }
      if (matches.length > 1 && maxOneMatch) {
        validationResult.problems.push({
          location: { offset: node.offset, length: 1 },
          message: localize2("oneOfWarning", "Matches multiple schemas when only one must validate.")
        });
      }
      if (bestMatch) {
        validationResult.merge(bestMatch.validationResult);
        validationResult.propertiesMatches += bestMatch.validationResult.propertiesMatches;
        validationResult.propertiesValueMatches += bestMatch.validationResult.propertiesValueMatches;
        matchingSchemas.merge(bestMatch.matchingSchemas);
      }
      return matches.length;
    };
    if (Array.isArray(schema.anyOf)) {
      testAlternatives(schema.anyOf, false);
    }
    if (Array.isArray(schema.oneOf)) {
      testAlternatives(schema.oneOf, true);
    }
    var testBranch = function(schema2) {
      var subValidationResult2 = new ValidationResult();
      var subMatchingSchemas2 = matchingSchemas.newSub();
      validate(node, asSchema(schema2), subValidationResult2, subMatchingSchemas2);
      validationResult.merge(subValidationResult2);
      validationResult.propertiesMatches += subValidationResult2.propertiesMatches;
      validationResult.propertiesValueMatches += subValidationResult2.propertiesValueMatches;
      matchingSchemas.merge(subMatchingSchemas2);
    };
    var testCondition = function(ifSchema2, thenSchema, elseSchema) {
      var subSchema = asSchema(ifSchema2);
      var subValidationResult2 = new ValidationResult();
      var subMatchingSchemas2 = matchingSchemas.newSub();
      validate(node, subSchema, subValidationResult2, subMatchingSchemas2);
      matchingSchemas.merge(subMatchingSchemas2);
      if (!subValidationResult2.hasProblems()) {
        if (thenSchema) {
          testBranch(thenSchema);
        }
      } else if (elseSchema) {
        testBranch(elseSchema);
      }
    };
    var ifSchema = asSchema(schema.if);
    if (ifSchema) {
      testCondition(ifSchema, asSchema(schema.then), asSchema(schema.else));
    }
    if (Array.isArray(schema.enum)) {
      var val = getNodeValue3(node);
      var enumValueMatch = false;
      for (var _d = 0, _e = schema.enum; _d < _e.length; _d++) {
        var e = _e[_d];
        if (equals(val, e)) {
          enumValueMatch = true;
          break;
        }
      }
      validationResult.enumValues = schema.enum;
      validationResult.enumValueMatch = enumValueMatch;
      if (!enumValueMatch) {
        validationResult.problems.push({
          location: { offset: node.offset, length: node.length },
          code: ErrorCode.EnumValueMismatch,
          message: schema.errorMessage || localize2("enumWarning", "Value is not accepted. Valid values: {0}.", schema.enum.map(function(v) {
            return JSON.stringify(v);
          }).join(", "))
        });
      }
    }
    if (isDefined(schema.const)) {
      var val = getNodeValue3(node);
      if (!equals(val, schema.const)) {
        validationResult.problems.push({
          location: { offset: node.offset, length: node.length },
          code: ErrorCode.EnumValueMismatch,
          message: schema.errorMessage || localize2("constWarning", "Value must be {0}.", JSON.stringify(schema.const))
        });
        validationResult.enumValueMatch = false;
      } else {
        validationResult.enumValueMatch = true;
      }
      validationResult.enumValues = [schema.const];
    }
    if (schema.deprecationMessage && node.parent) {
      validationResult.problems.push({
        location: { offset: node.parent.offset, length: node.parent.length },
        severity: DiagnosticSeverity.Warning,
        message: schema.deprecationMessage,
        code: ErrorCode.Deprecated
      });
    }
  }
  function _validateNumberNode(node2, schema2, validationResult2, matchingSchemas2) {
    var val = node2.value;
    function normalizeFloats(float) {
      var _a;
      var parts = /^(-?\d+)(?:\.(\d+))?(?:e([-+]\d+))?$/.exec(float.toString());
      return parts && {
        value: Number(parts[1] + (parts[2] || "")),
        multiplier: (((_a = parts[2]) === null || _a === void 0 ? void 0 : _a.length) || 0) - (parseInt(parts[3]) || 0)
      };
    }
    ;
    if (isNumber(schema2.multipleOf)) {
      var remainder = -1;
      if (Number.isInteger(schema2.multipleOf)) {
        remainder = val % schema2.multipleOf;
      } else {
        var normMultipleOf = normalizeFloats(schema2.multipleOf);
        var normValue = normalizeFloats(val);
        if (normMultipleOf && normValue) {
          var multiplier = Math.pow(10, Math.abs(normValue.multiplier - normMultipleOf.multiplier));
          if (normValue.multiplier < normMultipleOf.multiplier) {
            normValue.value *= multiplier;
          } else {
            normMultipleOf.value *= multiplier;
          }
          remainder = normValue.value % normMultipleOf.value;
        }
      }
      if (remainder !== 0) {
        validationResult2.problems.push({
          location: { offset: node2.offset, length: node2.length },
          message: localize2("multipleOfWarning", "Value is not divisible by {0}.", schema2.multipleOf)
        });
      }
    }
    function getExclusiveLimit(limit, exclusive) {
      if (isNumber(exclusive)) {
        return exclusive;
      }
      if (isBoolean(exclusive) && exclusive) {
        return limit;
      }
      return void 0;
    }
    function getLimit(limit, exclusive) {
      if (!isBoolean(exclusive) || !exclusive) {
        return limit;
      }
      return void 0;
    }
    var exclusiveMinimum = getExclusiveLimit(schema2.minimum, schema2.exclusiveMinimum);
    if (isNumber(exclusiveMinimum) && val <= exclusiveMinimum) {
      validationResult2.problems.push({
        location: { offset: node2.offset, length: node2.length },
        message: localize2("exclusiveMinimumWarning", "Value is below the exclusive minimum of {0}.", exclusiveMinimum)
      });
    }
    var exclusiveMaximum = getExclusiveLimit(schema2.maximum, schema2.exclusiveMaximum);
    if (isNumber(exclusiveMaximum) && val >= exclusiveMaximum) {
      validationResult2.problems.push({
        location: { offset: node2.offset, length: node2.length },
        message: localize2("exclusiveMaximumWarning", "Value is above the exclusive maximum of {0}.", exclusiveMaximum)
      });
    }
    var minimum = getLimit(schema2.minimum, schema2.exclusiveMinimum);
    if (isNumber(minimum) && val < minimum) {
      validationResult2.problems.push({
        location: { offset: node2.offset, length: node2.length },
        message: localize2("minimumWarning", "Value is below the minimum of {0}.", minimum)
      });
    }
    var maximum = getLimit(schema2.maximum, schema2.exclusiveMaximum);
    if (isNumber(maximum) && val > maximum) {
      validationResult2.problems.push({
        location: { offset: node2.offset, length: node2.length },
        message: localize2("maximumWarning", "Value is above the maximum of {0}.", maximum)
      });
    }
  }
  function _validateStringNode(node2, schema2, validationResult2, matchingSchemas2) {
    if (isNumber(schema2.minLength) && node2.value.length < schema2.minLength) {
      validationResult2.problems.push({
        location: { offset: node2.offset, length: node2.length },
        message: localize2("minLengthWarning", "String is shorter than the minimum length of {0}.", schema2.minLength)
      });
    }
    if (isNumber(schema2.maxLength) && node2.value.length > schema2.maxLength) {
      validationResult2.problems.push({
        location: { offset: node2.offset, length: node2.length },
        message: localize2("maxLengthWarning", "String is longer than the maximum length of {0}.", schema2.maxLength)
      });
    }
    if (isString(schema2.pattern)) {
      var regex = extendedRegExp(schema2.pattern);
      if (!(regex === null || regex === void 0 ? void 0 : regex.test(node2.value))) {
        validationResult2.problems.push({
          location: { offset: node2.offset, length: node2.length },
          message: schema2.patternErrorMessage || schema2.errorMessage || localize2("patternWarning", 'String does not match the pattern of "{0}".', schema2.pattern)
        });
      }
    }
    if (schema2.format) {
      switch (schema2.format) {
        case "uri":
        case "uri-reference":
          {
            var errorMessage = void 0;
            if (!node2.value) {
              errorMessage = localize2("uriEmpty", "URI expected.");
            } else {
              var match = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/.exec(node2.value);
              if (!match) {
                errorMessage = localize2("uriMissing", "URI is expected.");
              } else if (!match[2] && schema2.format === "uri") {
                errorMessage = localize2("uriSchemeMissing", "URI with a scheme is expected.");
              }
            }
            if (errorMessage) {
              validationResult2.problems.push({
                location: { offset: node2.offset, length: node2.length },
                message: schema2.patternErrorMessage || schema2.errorMessage || localize2("uriFormatWarning", "String is not a URI: {0}", errorMessage)
              });
            }
          }
          break;
        case "color-hex":
        case "date-time":
        case "date":
        case "time":
        case "email":
        case "hostname":
        case "ipv4":
        case "ipv6":
          var format4 = formats[schema2.format];
          if (!node2.value || !format4.pattern.exec(node2.value)) {
            validationResult2.problems.push({
              location: { offset: node2.offset, length: node2.length },
              message: schema2.patternErrorMessage || schema2.errorMessage || format4.errorMessage
            });
          }
        default:
      }
    }
  }
  function _validateArrayNode(node2, schema2, validationResult2, matchingSchemas2) {
    if (Array.isArray(schema2.items)) {
      var subSchemas = schema2.items;
      for (var index = 0; index < subSchemas.length; index++) {
        var subSchemaRef = subSchemas[index];
        var subSchema = asSchema(subSchemaRef);
        var itemValidationResult = new ValidationResult();
        var item = node2.items[index];
        if (item) {
          validate(item, subSchema, itemValidationResult, matchingSchemas2);
          validationResult2.mergePropertyMatch(itemValidationResult);
        } else if (node2.items.length >= subSchemas.length) {
          validationResult2.propertiesValueMatches++;
        }
      }
      if (node2.items.length > subSchemas.length) {
        if (typeof schema2.additionalItems === "object") {
          for (var i = subSchemas.length; i < node2.items.length; i++) {
            var itemValidationResult = new ValidationResult();
            validate(node2.items[i], schema2.additionalItems, itemValidationResult, matchingSchemas2);
            validationResult2.mergePropertyMatch(itemValidationResult);
          }
        } else if (schema2.additionalItems === false) {
          validationResult2.problems.push({
            location: { offset: node2.offset, length: node2.length },
            message: localize2("additionalItemsWarning", "Array has too many items according to schema. Expected {0} or fewer.", subSchemas.length)
          });
        }
      }
    } else {
      var itemSchema = asSchema(schema2.items);
      if (itemSchema) {
        for (var _i = 0, _a = node2.items; _i < _a.length; _i++) {
          var item = _a[_i];
          var itemValidationResult = new ValidationResult();
          validate(item, itemSchema, itemValidationResult, matchingSchemas2);
          validationResult2.mergePropertyMatch(itemValidationResult);
        }
      }
    }
    var containsSchema = asSchema(schema2.contains);
    if (containsSchema) {
      var doesContain = node2.items.some(function(item2) {
        var itemValidationResult2 = new ValidationResult();
        validate(item2, containsSchema, itemValidationResult2, NoOpSchemaCollector.instance);
        return !itemValidationResult2.hasProblems();
      });
      if (!doesContain) {
        validationResult2.problems.push({
          location: { offset: node2.offset, length: node2.length },
          message: schema2.errorMessage || localize2("requiredItemMissingWarning", "Array does not contain required item.")
        });
      }
    }
    if (isNumber(schema2.minItems) && node2.items.length < schema2.minItems) {
      validationResult2.problems.push({
        location: { offset: node2.offset, length: node2.length },
        message: localize2("minItemsWarning", "Array has too few items. Expected {0} or more.", schema2.minItems)
      });
    }
    if (isNumber(schema2.maxItems) && node2.items.length > schema2.maxItems) {
      validationResult2.problems.push({
        location: { offset: node2.offset, length: node2.length },
        message: localize2("maxItemsWarning", "Array has too many items. Expected {0} or fewer.", schema2.maxItems)
      });
    }
    if (schema2.uniqueItems === true) {
      var values_1 = getNodeValue3(node2);
      var duplicates = values_1.some(function(value, index2) {
        return index2 !== values_1.lastIndexOf(value);
      });
      if (duplicates) {
        validationResult2.problems.push({
          location: { offset: node2.offset, length: node2.length },
          message: localize2("uniqueItemsWarning", "Array has duplicate items.")
        });
      }
    }
  }
  function _validateObjectNode(node2, schema2, validationResult2, matchingSchemas2) {
    var seenKeys = /* @__PURE__ */ Object.create(null);
    var unprocessedProperties = [];
    for (var _i = 0, _a = node2.properties; _i < _a.length; _i++) {
      var propertyNode = _a[_i];
      var key = propertyNode.keyNode.value;
      seenKeys[key] = propertyNode.valueNode;
      unprocessedProperties.push(key);
    }
    if (Array.isArray(schema2.required)) {
      for (var _b = 0, _c = schema2.required; _b < _c.length; _b++) {
        var propertyName = _c[_b];
        if (!seenKeys[propertyName]) {
          var keyNode = node2.parent && node2.parent.type === "property" && node2.parent.keyNode;
          var location = keyNode ? { offset: keyNode.offset, length: keyNode.length } : { offset: node2.offset, length: 1 };
          validationResult2.problems.push({
            location,
            message: localize2("MissingRequiredPropWarning", 'Missing property "{0}".', propertyName)
          });
        }
      }
    }
    var propertyProcessed = function(prop2) {
      var index = unprocessedProperties.indexOf(prop2);
      while (index >= 0) {
        unprocessedProperties.splice(index, 1);
        index = unprocessedProperties.indexOf(prop2);
      }
    };
    if (schema2.properties) {
      for (var _d = 0, _e = Object.keys(schema2.properties); _d < _e.length; _d++) {
        var propertyName = _e[_d];
        propertyProcessed(propertyName);
        var propertySchema = schema2.properties[propertyName];
        var child = seenKeys[propertyName];
        if (child) {
          if (isBoolean(propertySchema)) {
            if (!propertySchema) {
              var propertyNode = child.parent;
              validationResult2.problems.push({
                location: { offset: propertyNode.keyNode.offset, length: propertyNode.keyNode.length },
                message: schema2.errorMessage || localize2("DisallowedExtraPropWarning", "Property {0} is not allowed.", propertyName)
              });
            } else {
              validationResult2.propertiesMatches++;
              validationResult2.propertiesValueMatches++;
            }
          } else {
            var propertyValidationResult = new ValidationResult();
            validate(child, propertySchema, propertyValidationResult, matchingSchemas2);
            validationResult2.mergePropertyMatch(propertyValidationResult);
          }
        }
      }
    }
    if (schema2.patternProperties) {
      for (var _f = 0, _g = Object.keys(schema2.patternProperties); _f < _g.length; _f++) {
        var propertyPattern = _g[_f];
        var regex = extendedRegExp(propertyPattern);
        for (var _h = 0, _j = unprocessedProperties.slice(0); _h < _j.length; _h++) {
          var propertyName = _j[_h];
          if (regex === null || regex === void 0 ? void 0 : regex.test(propertyName)) {
            propertyProcessed(propertyName);
            var child = seenKeys[propertyName];
            if (child) {
              var propertySchema = schema2.patternProperties[propertyPattern];
              if (isBoolean(propertySchema)) {
                if (!propertySchema) {
                  var propertyNode = child.parent;
                  validationResult2.problems.push({
                    location: { offset: propertyNode.keyNode.offset, length: propertyNode.keyNode.length },
                    message: schema2.errorMessage || localize2("DisallowedExtraPropWarning", "Property {0} is not allowed.", propertyName)
                  });
                } else {
                  validationResult2.propertiesMatches++;
                  validationResult2.propertiesValueMatches++;
                }
              } else {
                var propertyValidationResult = new ValidationResult();
                validate(child, propertySchema, propertyValidationResult, matchingSchemas2);
                validationResult2.mergePropertyMatch(propertyValidationResult);
              }
            }
          }
        }
      }
    }
    if (typeof schema2.additionalProperties === "object") {
      for (var _k = 0, unprocessedProperties_1 = unprocessedProperties; _k < unprocessedProperties_1.length; _k++) {
        var propertyName = unprocessedProperties_1[_k];
        var child = seenKeys[propertyName];
        if (child) {
          var propertyValidationResult = new ValidationResult();
          validate(child, schema2.additionalProperties, propertyValidationResult, matchingSchemas2);
          validationResult2.mergePropertyMatch(propertyValidationResult);
        }
      }
    } else if (schema2.additionalProperties === false) {
      if (unprocessedProperties.length > 0) {
        for (var _l = 0, unprocessedProperties_2 = unprocessedProperties; _l < unprocessedProperties_2.length; _l++) {
          var propertyName = unprocessedProperties_2[_l];
          var child = seenKeys[propertyName];
          if (child) {
            var propertyNode = child.parent;
            validationResult2.problems.push({
              location: { offset: propertyNode.keyNode.offset, length: propertyNode.keyNode.length },
              message: schema2.errorMessage || localize2("DisallowedExtraPropWarning", "Property {0} is not allowed.", propertyName)
            });
          }
        }
      }
    }
    if (isNumber(schema2.maxProperties)) {
      if (node2.properties.length > schema2.maxProperties) {
        validationResult2.problems.push({
          location: { offset: node2.offset, length: node2.length },
          message: localize2("MaxPropWarning", "Object has more properties than limit of {0}.", schema2.maxProperties)
        });
      }
    }
    if (isNumber(schema2.minProperties)) {
      if (node2.properties.length < schema2.minProperties) {
        validationResult2.problems.push({
          location: { offset: node2.offset, length: node2.length },
          message: localize2("MinPropWarning", "Object has fewer properties than the required number of {0}", schema2.minProperties)
        });
      }
    }
    if (schema2.dependencies) {
      for (var _m = 0, _o = Object.keys(schema2.dependencies); _m < _o.length; _m++) {
        var key = _o[_m];
        var prop = seenKeys[key];
        if (prop) {
          var propertyDep = schema2.dependencies[key];
          if (Array.isArray(propertyDep)) {
            for (var _p = 0, propertyDep_1 = propertyDep; _p < propertyDep_1.length; _p++) {
              var requiredProp = propertyDep_1[_p];
              if (!seenKeys[requiredProp]) {
                validationResult2.problems.push({
                  location: { offset: node2.offset, length: node2.length },
                  message: localize2("RequiredDependentPropWarning", "Object is missing property {0} required by property {1}.", requiredProp, key)
                });
              } else {
                validationResult2.propertiesValueMatches++;
              }
            }
          } else {
            var propertySchema = asSchema(propertyDep);
            if (propertySchema) {
              var propertyValidationResult = new ValidationResult();
              validate(node2, propertySchema, propertyValidationResult, matchingSchemas2);
              validationResult2.mergePropertyMatch(propertyValidationResult);
            }
          }
        }
      }
    }
    var propertyNames = asSchema(schema2.propertyNames);
    if (propertyNames) {
      for (var _q = 0, _r = node2.properties; _q < _r.length; _q++) {
        var f2 = _r[_q];
        var key = f2.keyNode;
        if (key) {
          validate(key, propertyNames, validationResult2, NoOpSchemaCollector.instance);
        }
      }
    }
  }
}
function parse3(textDocument, config) {
  var problems = [];
  var lastProblemOffset = -1;
  var text = textDocument.getText();
  var scanner = createScanner2(text, false);
  var commentRanges = config && config.collectComments ? [] : void 0;
  function _scanNext() {
    while (true) {
      var token_1 = scanner.scan();
      _checkScanError();
      switch (token_1) {
        case 12:
        case 13:
          if (Array.isArray(commentRanges)) {
            commentRanges.push(Range.create(textDocument.positionAt(scanner.getTokenOffset()), textDocument.positionAt(scanner.getTokenOffset() + scanner.getTokenLength())));
          }
          break;
        case 15:
        case 14:
          break;
        default:
          return token_1;
      }
    }
  }
  function _accept(token2) {
    if (scanner.getToken() === token2) {
      _scanNext();
      return true;
    }
    return false;
  }
  function _errorAtRange(message, code, startOffset, endOffset, severity) {
    if (severity === void 0) {
      severity = DiagnosticSeverity.Error;
    }
    if (problems.length === 0 || startOffset !== lastProblemOffset) {
      var range = Range.create(textDocument.positionAt(startOffset), textDocument.positionAt(endOffset));
      problems.push(Diagnostic.create(range, message, severity, code, textDocument.languageId));
      lastProblemOffset = startOffset;
    }
  }
  function _error(message, code, node, skipUntilAfter, skipUntil) {
    if (node === void 0) {
      node = void 0;
    }
    if (skipUntilAfter === void 0) {
      skipUntilAfter = [];
    }
    if (skipUntil === void 0) {
      skipUntil = [];
    }
    var start = scanner.getTokenOffset();
    var end = scanner.getTokenOffset() + scanner.getTokenLength();
    if (start === end && start > 0) {
      start--;
      while (start > 0 && /\s/.test(text.charAt(start))) {
        start--;
      }
      end = start + 1;
    }
    _errorAtRange(message, code, start, end);
    if (node) {
      _finalize(node, false);
    }
    if (skipUntilAfter.length + skipUntil.length > 0) {
      var token_2 = scanner.getToken();
      while (token_2 !== 17) {
        if (skipUntilAfter.indexOf(token_2) !== -1) {
          _scanNext();
          break;
        } else if (skipUntil.indexOf(token_2) !== -1) {
          break;
        }
        token_2 = _scanNext();
      }
    }
    return node;
  }
  function _checkScanError() {
    switch (scanner.getTokenError()) {
      case 4:
        _error(localize2("InvalidUnicode", "Invalid unicode sequence in string."), ErrorCode.InvalidUnicode);
        return true;
      case 5:
        _error(localize2("InvalidEscapeCharacter", "Invalid escape character in string."), ErrorCode.InvalidEscapeCharacter);
        return true;
      case 3:
        _error(localize2("UnexpectedEndOfNumber", "Unexpected end of number."), ErrorCode.UnexpectedEndOfNumber);
        return true;
      case 1:
        _error(localize2("UnexpectedEndOfComment", "Unexpected end of comment."), ErrorCode.UnexpectedEndOfComment);
        return true;
      case 2:
        _error(localize2("UnexpectedEndOfString", "Unexpected end of string."), ErrorCode.UnexpectedEndOfString);
        return true;
      case 6:
        _error(localize2("InvalidCharacter", "Invalid characters in string. Control characters must be escaped."), ErrorCode.InvalidCharacter);
        return true;
    }
    return false;
  }
  function _finalize(node, scanNext) {
    node.length = scanner.getTokenOffset() + scanner.getTokenLength() - node.offset;
    if (scanNext) {
      _scanNext();
    }
    return node;
  }
  function _parseArray(parent) {
    if (scanner.getToken() !== 3) {
      return void 0;
    }
    var node = new ArrayASTNodeImpl(parent, scanner.getTokenOffset());
    _scanNext();
    var count = 0;
    var needsComma = false;
    while (scanner.getToken() !== 4 && scanner.getToken() !== 17) {
      if (scanner.getToken() === 5) {
        if (!needsComma) {
          _error(localize2("ValueExpected", "Value expected"), ErrorCode.ValueExpected);
        }
        var commaOffset = scanner.getTokenOffset();
        _scanNext();
        if (scanner.getToken() === 4) {
          if (needsComma) {
            _errorAtRange(localize2("TrailingComma", "Trailing comma"), ErrorCode.TrailingComma, commaOffset, commaOffset + 1);
          }
          continue;
        }
      } else if (needsComma) {
        _error(localize2("ExpectedComma", "Expected comma"), ErrorCode.CommaExpected);
      }
      var item = _parseValue(node);
      if (!item) {
        _error(localize2("PropertyExpected", "Value expected"), ErrorCode.ValueExpected, void 0, [], [4, 5]);
      } else {
        node.items.push(item);
      }
      needsComma = true;
    }
    if (scanner.getToken() !== 4) {
      return _error(localize2("ExpectedCloseBracket", "Expected comma or closing bracket"), ErrorCode.CommaOrCloseBacketExpected, node);
    }
    return _finalize(node, true);
  }
  var keyPlaceholder = new StringASTNodeImpl(void 0, 0, 0);
  function _parseProperty(parent, keysSeen) {
    var node = new PropertyASTNodeImpl(parent, scanner.getTokenOffset(), keyPlaceholder);
    var key = _parseString(node);
    if (!key) {
      if (scanner.getToken() === 16) {
        _error(localize2("DoubleQuotesExpected", "Property keys must be doublequoted"), ErrorCode.Undefined);
        var keyNode = new StringASTNodeImpl(node, scanner.getTokenOffset(), scanner.getTokenLength());
        keyNode.value = scanner.getTokenValue();
        key = keyNode;
        _scanNext();
      } else {
        return void 0;
      }
    }
    node.keyNode = key;
    var seen = keysSeen[key.value];
    if (seen) {
      _errorAtRange(localize2("DuplicateKeyWarning", "Duplicate object key"), ErrorCode.DuplicateKey, node.keyNode.offset, node.keyNode.offset + node.keyNode.length, DiagnosticSeverity.Warning);
      if (typeof seen === "object") {
        _errorAtRange(localize2("DuplicateKeyWarning", "Duplicate object key"), ErrorCode.DuplicateKey, seen.keyNode.offset, seen.keyNode.offset + seen.keyNode.length, DiagnosticSeverity.Warning);
      }
      keysSeen[key.value] = true;
    } else {
      keysSeen[key.value] = node;
    }
    if (scanner.getToken() === 6) {
      node.colonOffset = scanner.getTokenOffset();
      _scanNext();
    } else {
      _error(localize2("ColonExpected", "Colon expected"), ErrorCode.ColonExpected);
      if (scanner.getToken() === 10 && textDocument.positionAt(key.offset + key.length).line < textDocument.positionAt(scanner.getTokenOffset()).line) {
        node.length = key.length;
        return node;
      }
    }
    var value = _parseValue(node);
    if (!value) {
      return _error(localize2("ValueExpected", "Value expected"), ErrorCode.ValueExpected, node, [], [2, 5]);
    }
    node.valueNode = value;
    node.length = value.offset + value.length - node.offset;
    return node;
  }
  function _parseObject(parent) {
    if (scanner.getToken() !== 1) {
      return void 0;
    }
    var node = new ObjectASTNodeImpl(parent, scanner.getTokenOffset());
    var keysSeen = /* @__PURE__ */ Object.create(null);
    _scanNext();
    var needsComma = false;
    while (scanner.getToken() !== 2 && scanner.getToken() !== 17) {
      if (scanner.getToken() === 5) {
        if (!needsComma) {
          _error(localize2("PropertyExpected", "Property expected"), ErrorCode.PropertyExpected);
        }
        var commaOffset = scanner.getTokenOffset();
        _scanNext();
        if (scanner.getToken() === 2) {
          if (needsComma) {
            _errorAtRange(localize2("TrailingComma", "Trailing comma"), ErrorCode.TrailingComma, commaOffset, commaOffset + 1);
          }
          continue;
        }
      } else if (needsComma) {
        _error(localize2("ExpectedComma", "Expected comma"), ErrorCode.CommaExpected);
      }
      var property = _parseProperty(node, keysSeen);
      if (!property) {
        _error(localize2("PropertyExpected", "Property expected"), ErrorCode.PropertyExpected, void 0, [], [2, 5]);
      } else {
        node.properties.push(property);
      }
      needsComma = true;
    }
    if (scanner.getToken() !== 2) {
      return _error(localize2("ExpectedCloseBrace", "Expected comma or closing brace"), ErrorCode.CommaOrCloseBraceExpected, node);
    }
    return _finalize(node, true);
  }
  function _parseString(parent) {
    if (scanner.getToken() !== 10) {
      return void 0;
    }
    var node = new StringASTNodeImpl(parent, scanner.getTokenOffset());
    node.value = scanner.getTokenValue();
    return _finalize(node, true);
  }
  function _parseNumber(parent) {
    if (scanner.getToken() !== 11) {
      return void 0;
    }
    var node = new NumberASTNodeImpl(parent, scanner.getTokenOffset());
    if (scanner.getTokenError() === 0) {
      var tokenValue = scanner.getTokenValue();
      try {
        var numberValue = JSON.parse(tokenValue);
        if (!isNumber(numberValue)) {
          return _error(localize2("InvalidNumberFormat", "Invalid number format."), ErrorCode.Undefined, node);
        }
        node.value = numberValue;
      } catch (e) {
        return _error(localize2("InvalidNumberFormat", "Invalid number format."), ErrorCode.Undefined, node);
      }
      node.isInteger = tokenValue.indexOf(".") === -1;
    }
    return _finalize(node, true);
  }
  function _parseLiteral(parent) {
    var node;
    switch (scanner.getToken()) {
      case 7:
        return _finalize(new NullASTNodeImpl(parent, scanner.getTokenOffset()), true);
      case 8:
        return _finalize(new BooleanASTNodeImpl(parent, true, scanner.getTokenOffset()), true);
      case 9:
        return _finalize(new BooleanASTNodeImpl(parent, false, scanner.getTokenOffset()), true);
      default:
        return void 0;
    }
  }
  function _parseValue(parent) {
    return _parseArray(parent) || _parseObject(parent) || _parseString(parent) || _parseNumber(parent) || _parseLiteral(parent);
  }
  var _root = void 0;
  var token = _scanNext();
  if (token !== 17) {
    _root = _parseValue(_root);
    if (!_root) {
      _error(localize2("Invalid symbol", "Expected a JSON object, array or literal."), ErrorCode.Undefined);
    } else if (scanner.getToken() !== 17) {
      _error(localize2("End of file expected", "End of file expected."), ErrorCode.Undefined);
    }
  }
  return new JSONDocument(_root, problems, commentRanges);
}

// node_modules/vscode-json-languageservice/lib/esm/utils/json.js
function stringifyObject(obj, indent, stringifyLiteral) {
  if (obj !== null && typeof obj === "object") {
    var newIndent = indent + "	";
    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return "[]";
      }
      var result = "[\n";
      for (var i = 0; i < obj.length; i++) {
        result += newIndent + stringifyObject(obj[i], newIndent, stringifyLiteral);
        if (i < obj.length - 1) {
          result += ",";
        }
        result += "\n";
      }
      result += indent + "]";
      return result;
    } else {
      var keys = Object.keys(obj);
      if (keys.length === 0) {
        return "{}";
      }
      var result = "{\n";
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        result += newIndent + JSON.stringify(key) + ": " + stringifyObject(obj[key], newIndent, stringifyLiteral);
        if (i < keys.length - 1) {
          result += ",";
        }
        result += "\n";
      }
      result += indent + "}";
      return result;
    }
  }
  return stringifyLiteral(obj);
}

// node_modules/vscode-json-languageservice/lib/esm/services/jsonCompletion.js
var localize3 = loadMessageBundle();
var valueCommitCharacters = [",", "}", "]"];
var propertyCommitCharacters = [":"];
var JSONCompletion = function() {
  function JSONCompletion2(schemaService, contributions, promiseConstructor, clientCapabilities) {
    if (contributions === void 0) {
      contributions = [];
    }
    if (promiseConstructor === void 0) {
      promiseConstructor = Promise;
    }
    if (clientCapabilities === void 0) {
      clientCapabilities = {};
    }
    this.schemaService = schemaService;
    this.contributions = contributions;
    this.promiseConstructor = promiseConstructor;
    this.clientCapabilities = clientCapabilities;
  }
  JSONCompletion2.prototype.doResolve = function(item) {
    for (var i = this.contributions.length - 1; i >= 0; i--) {
      var resolveCompletion = this.contributions[i].resolveCompletion;
      if (resolveCompletion) {
        var resolver = resolveCompletion(item);
        if (resolver) {
          return resolver;
        }
      }
    }
    return this.promiseConstructor.resolve(item);
  };
  JSONCompletion2.prototype.doComplete = function(document, position, doc) {
    var _this = this;
    var result = {
      items: [],
      isIncomplete: false
    };
    var text = document.getText();
    var offset = document.offsetAt(position);
    var node = doc.getNodeFromOffset(offset, true);
    if (this.isInComment(document, node ? node.offset : 0, offset)) {
      return Promise.resolve(result);
    }
    if (node && offset === node.offset + node.length && offset > 0) {
      var ch = text[offset - 1];
      if (node.type === "object" && ch === "}" || node.type === "array" && ch === "]") {
        node = node.parent;
      }
    }
    var currentWord = this.getCurrentWord(document, offset);
    var overwriteRange;
    if (node && (node.type === "string" || node.type === "number" || node.type === "boolean" || node.type === "null")) {
      overwriteRange = Range.create(document.positionAt(node.offset), document.positionAt(node.offset + node.length));
    } else {
      var overwriteStart = offset - currentWord.length;
      if (overwriteStart > 0 && text[overwriteStart - 1] === '"') {
        overwriteStart--;
      }
      overwriteRange = Range.create(document.positionAt(overwriteStart), position);
    }
    var supportsCommitCharacters = false;
    var proposed = {};
    var collector = {
      add: function(suggestion) {
        var label = suggestion.label;
        var existing = proposed[label];
        if (!existing) {
          label = label.replace(/[\n]/g, "\u21B5");
          if (label.length > 60) {
            var shortendedLabel = label.substr(0, 57).trim() + "...";
            if (!proposed[shortendedLabel]) {
              label = shortendedLabel;
            }
          }
          if (overwriteRange && suggestion.insertText !== void 0) {
            suggestion.textEdit = TextEdit.replace(overwriteRange, suggestion.insertText);
          }
          if (supportsCommitCharacters) {
            suggestion.commitCharacters = suggestion.kind === CompletionItemKind.Property ? propertyCommitCharacters : valueCommitCharacters;
          }
          suggestion.label = label;
          proposed[label] = suggestion;
          result.items.push(suggestion);
        } else {
          if (!existing.documentation) {
            existing.documentation = suggestion.documentation;
          }
          if (!existing.detail) {
            existing.detail = suggestion.detail;
          }
        }
      },
      setAsIncomplete: function() {
        result.isIncomplete = true;
      },
      error: function(message) {
        console.error(message);
      },
      log: function(message) {
        console.log(message);
      },
      getNumberOfProposals: function() {
        return result.items.length;
      }
    };
    return this.schemaService.getSchemaForResource(document.uri, doc).then(function(schema) {
      var collectionPromises = [];
      var addValue = true;
      var currentKey = "";
      var currentProperty = void 0;
      if (node) {
        if (node.type === "string") {
          var parent = node.parent;
          if (parent && parent.type === "property" && parent.keyNode === node) {
            addValue = !parent.valueNode;
            currentProperty = parent;
            currentKey = text.substr(node.offset + 1, node.length - 2);
            if (parent) {
              node = parent.parent;
            }
          }
        }
      }
      if (node && node.type === "object") {
        if (node.offset === offset) {
          return result;
        }
        var properties = node.properties;
        properties.forEach(function(p) {
          if (!currentProperty || currentProperty !== p) {
            proposed[p.keyNode.value] = CompletionItem.create("__");
          }
        });
        var separatorAfter_1 = "";
        if (addValue) {
          separatorAfter_1 = _this.evaluateSeparatorAfter(document, document.offsetAt(overwriteRange.end));
        }
        if (schema) {
          _this.getPropertyCompletions(schema, doc, node, addValue, separatorAfter_1, collector);
        } else {
          _this.getSchemaLessPropertyCompletions(doc, node, currentKey, collector);
        }
        var location_1 = getNodePath3(node);
        _this.contributions.forEach(function(contribution) {
          var collectPromise = contribution.collectPropertyCompletions(document.uri, location_1, currentWord, addValue, separatorAfter_1 === "", collector);
          if (collectPromise) {
            collectionPromises.push(collectPromise);
          }
        });
        if (!schema && currentWord.length > 0 && text.charAt(offset - currentWord.length - 1) !== '"') {
          collector.add({
            kind: CompletionItemKind.Property,
            label: _this.getLabelForValue(currentWord),
            insertText: _this.getInsertTextForProperty(currentWord, void 0, false, separatorAfter_1),
            insertTextFormat: InsertTextFormat.Snippet,
            documentation: ""
          });
          collector.setAsIncomplete();
        }
      }
      var types = {};
      if (schema) {
        _this.getValueCompletions(schema, doc, node, offset, document, collector, types);
      } else {
        _this.getSchemaLessValueCompletions(doc, node, offset, document, collector);
      }
      if (_this.contributions.length > 0) {
        _this.getContributedValueCompletions(doc, node, offset, document, collector, collectionPromises);
      }
      return _this.promiseConstructor.all(collectionPromises).then(function() {
        if (collector.getNumberOfProposals() === 0) {
          var offsetForSeparator = offset;
          if (node && (node.type === "string" || node.type === "number" || node.type === "boolean" || node.type === "null")) {
            offsetForSeparator = node.offset + node.length;
          }
          var separatorAfter = _this.evaluateSeparatorAfter(document, offsetForSeparator);
          _this.addFillerValueCompletions(types, separatorAfter, collector);
        }
        return result;
      });
    });
  };
  JSONCompletion2.prototype.getPropertyCompletions = function(schema, doc, node, addValue, separatorAfter, collector) {
    var _this = this;
    var matchingSchemas = doc.getMatchingSchemas(schema.schema, node.offset);
    matchingSchemas.forEach(function(s) {
      if (s.node === node && !s.inverted) {
        var schemaProperties_1 = s.schema.properties;
        if (schemaProperties_1) {
          Object.keys(schemaProperties_1).forEach(function(key) {
            var propertySchema = schemaProperties_1[key];
            if (typeof propertySchema === "object" && !propertySchema.deprecationMessage && !propertySchema.doNotSuggest) {
              var proposal = {
                kind: CompletionItemKind.Property,
                label: key,
                insertText: _this.getInsertTextForProperty(key, propertySchema, addValue, separatorAfter),
                insertTextFormat: InsertTextFormat.Snippet,
                filterText: _this.getFilterTextForValue(key),
                documentation: _this.fromMarkup(propertySchema.markdownDescription) || propertySchema.description || ""
              };
              if (propertySchema.suggestSortText !== void 0) {
                proposal.sortText = propertySchema.suggestSortText;
              }
              if (proposal.insertText && endsWith(proposal.insertText, "$1".concat(separatorAfter))) {
                proposal.command = {
                  title: "Suggest",
                  command: "editor.action.triggerSuggest"
                };
              }
              collector.add(proposal);
            }
          });
        }
        var schemaPropertyNames_1 = s.schema.propertyNames;
        if (typeof schemaPropertyNames_1 === "object" && !schemaPropertyNames_1.deprecationMessage && !schemaPropertyNames_1.doNotSuggest) {
          var propertyNameCompletionItem = function(name, enumDescription2) {
            if (enumDescription2 === void 0) {
              enumDescription2 = void 0;
            }
            var proposal = {
              kind: CompletionItemKind.Property,
              label: name,
              insertText: _this.getInsertTextForProperty(name, void 0, addValue, separatorAfter),
              insertTextFormat: InsertTextFormat.Snippet,
              filterText: _this.getFilterTextForValue(name),
              documentation: enumDescription2 || _this.fromMarkup(schemaPropertyNames_1.markdownDescription) || schemaPropertyNames_1.description || ""
            };
            if (schemaPropertyNames_1.suggestSortText !== void 0) {
              proposal.sortText = schemaPropertyNames_1.suggestSortText;
            }
            if (proposal.insertText && endsWith(proposal.insertText, "$1".concat(separatorAfter))) {
              proposal.command = {
                title: "Suggest",
                command: "editor.action.triggerSuggest"
              };
            }
            collector.add(proposal);
          };
          if (schemaPropertyNames_1.enum) {
            for (var i = 0; i < schemaPropertyNames_1.enum.length; i++) {
              var enumDescription = void 0;
              if (schemaPropertyNames_1.markdownEnumDescriptions && i < schemaPropertyNames_1.markdownEnumDescriptions.length) {
                enumDescription = _this.fromMarkup(schemaPropertyNames_1.markdownEnumDescriptions[i]);
              } else if (schemaPropertyNames_1.enumDescriptions && i < schemaPropertyNames_1.enumDescriptions.length) {
                enumDescription = schemaPropertyNames_1.enumDescriptions[i];
              }
              propertyNameCompletionItem(schemaPropertyNames_1.enum[i], enumDescription);
            }
          }
          if (schemaPropertyNames_1.const) {
            propertyNameCompletionItem(schemaPropertyNames_1.const);
          }
        }
      }
    });
  };
  JSONCompletion2.prototype.getSchemaLessPropertyCompletions = function(doc, node, currentKey, collector) {
    var _this = this;
    var collectCompletionsForSimilarObject = function(obj) {
      obj.properties.forEach(function(p) {
        var key = p.keyNode.value;
        collector.add({
          kind: CompletionItemKind.Property,
          label: key,
          insertText: _this.getInsertTextForValue(key, ""),
          insertTextFormat: InsertTextFormat.Snippet,
          filterText: _this.getFilterTextForValue(key),
          documentation: ""
        });
      });
    };
    if (node.parent) {
      if (node.parent.type === "property") {
        var parentKey_1 = node.parent.keyNode.value;
        doc.visit(function(n) {
          if (n.type === "property" && n !== node.parent && n.keyNode.value === parentKey_1 && n.valueNode && n.valueNode.type === "object") {
            collectCompletionsForSimilarObject(n.valueNode);
          }
          return true;
        });
      } else if (node.parent.type === "array") {
        node.parent.items.forEach(function(n) {
          if (n.type === "object" && n !== node) {
            collectCompletionsForSimilarObject(n);
          }
        });
      }
    } else if (node.type === "object") {
      collector.add({
        kind: CompletionItemKind.Property,
        label: "$schema",
        insertText: this.getInsertTextForProperty("$schema", void 0, true, ""),
        insertTextFormat: InsertTextFormat.Snippet,
        documentation: "",
        filterText: this.getFilterTextForValue("$schema")
      });
    }
  };
  JSONCompletion2.prototype.getSchemaLessValueCompletions = function(doc, node, offset, document, collector) {
    var _this = this;
    var offsetForSeparator = offset;
    if (node && (node.type === "string" || node.type === "number" || node.type === "boolean" || node.type === "null")) {
      offsetForSeparator = node.offset + node.length;
      node = node.parent;
    }
    if (!node) {
      collector.add({
        kind: this.getSuggestionKind("object"),
        label: "Empty object",
        insertText: this.getInsertTextForValue({}, ""),
        insertTextFormat: InsertTextFormat.Snippet,
        documentation: ""
      });
      collector.add({
        kind: this.getSuggestionKind("array"),
        label: "Empty array",
        insertText: this.getInsertTextForValue([], ""),
        insertTextFormat: InsertTextFormat.Snippet,
        documentation: ""
      });
      return;
    }
    var separatorAfter = this.evaluateSeparatorAfter(document, offsetForSeparator);
    var collectSuggestionsForValues = function(value) {
      if (value.parent && !contains2(value.parent, offset, true)) {
        collector.add({
          kind: _this.getSuggestionKind(value.type),
          label: _this.getLabelTextForMatchingNode(value, document),
          insertText: _this.getInsertTextForMatchingNode(value, document, separatorAfter),
          insertTextFormat: InsertTextFormat.Snippet,
          documentation: ""
        });
      }
      if (value.type === "boolean") {
        _this.addBooleanValueCompletion(!value.value, separatorAfter, collector);
      }
    };
    if (node.type === "property") {
      if (offset > (node.colonOffset || 0)) {
        var valueNode = node.valueNode;
        if (valueNode && (offset > valueNode.offset + valueNode.length || valueNode.type === "object" || valueNode.type === "array")) {
          return;
        }
        var parentKey_2 = node.keyNode.value;
        doc.visit(function(n) {
          if (n.type === "property" && n.keyNode.value === parentKey_2 && n.valueNode) {
            collectSuggestionsForValues(n.valueNode);
          }
          return true;
        });
        if (parentKey_2 === "$schema" && node.parent && !node.parent.parent) {
          this.addDollarSchemaCompletions(separatorAfter, collector);
        }
      }
    }
    if (node.type === "array") {
      if (node.parent && node.parent.type === "property") {
        var parentKey_3 = node.parent.keyNode.value;
        doc.visit(function(n) {
          if (n.type === "property" && n.keyNode.value === parentKey_3 && n.valueNode && n.valueNode.type === "array") {
            n.valueNode.items.forEach(collectSuggestionsForValues);
          }
          return true;
        });
      } else {
        node.items.forEach(collectSuggestionsForValues);
      }
    }
  };
  JSONCompletion2.prototype.getValueCompletions = function(schema, doc, node, offset, document, collector, types) {
    var offsetForSeparator = offset;
    var parentKey = void 0;
    var valueNode = void 0;
    if (node && (node.type === "string" || node.type === "number" || node.type === "boolean" || node.type === "null")) {
      offsetForSeparator = node.offset + node.length;
      valueNode = node;
      node = node.parent;
    }
    if (!node) {
      this.addSchemaValueCompletions(schema.schema, "", collector, types);
      return;
    }
    if (node.type === "property" && offset > (node.colonOffset || 0)) {
      var valueNode_1 = node.valueNode;
      if (valueNode_1 && offset > valueNode_1.offset + valueNode_1.length) {
        return;
      }
      parentKey = node.keyNode.value;
      node = node.parent;
    }
    if (node && (parentKey !== void 0 || node.type === "array")) {
      var separatorAfter = this.evaluateSeparatorAfter(document, offsetForSeparator);
      var matchingSchemas = doc.getMatchingSchemas(schema.schema, node.offset, valueNode);
      for (var _i = 0, matchingSchemas_1 = matchingSchemas; _i < matchingSchemas_1.length; _i++) {
        var s = matchingSchemas_1[_i];
        if (s.node === node && !s.inverted && s.schema) {
          if (node.type === "array" && s.schema.items) {
            if (Array.isArray(s.schema.items)) {
              var index = this.findItemAtOffset(node, document, offset);
              if (index < s.schema.items.length) {
                this.addSchemaValueCompletions(s.schema.items[index], separatorAfter, collector, types);
              }
            } else {
              this.addSchemaValueCompletions(s.schema.items, separatorAfter, collector, types);
            }
          }
          if (parentKey !== void 0) {
            var propertyMatched = false;
            if (s.schema.properties) {
              var propertySchema = s.schema.properties[parentKey];
              if (propertySchema) {
                propertyMatched = true;
                this.addSchemaValueCompletions(propertySchema, separatorAfter, collector, types);
              }
            }
            if (s.schema.patternProperties && !propertyMatched) {
              for (var _a = 0, _b = Object.keys(s.schema.patternProperties); _a < _b.length; _a++) {
                var pattern = _b[_a];
                var regex = extendedRegExp(pattern);
                if (regex === null || regex === void 0 ? void 0 : regex.test(parentKey)) {
                  propertyMatched = true;
                  var propertySchema = s.schema.patternProperties[pattern];
                  this.addSchemaValueCompletions(propertySchema, separatorAfter, collector, types);
                }
              }
            }
            if (s.schema.additionalProperties && !propertyMatched) {
              var propertySchema = s.schema.additionalProperties;
              this.addSchemaValueCompletions(propertySchema, separatorAfter, collector, types);
            }
          }
        }
      }
      if (parentKey === "$schema" && !node.parent) {
        this.addDollarSchemaCompletions(separatorAfter, collector);
      }
      if (types["boolean"]) {
        this.addBooleanValueCompletion(true, separatorAfter, collector);
        this.addBooleanValueCompletion(false, separatorAfter, collector);
      }
      if (types["null"]) {
        this.addNullValueCompletion(separatorAfter, collector);
      }
    }
  };
  JSONCompletion2.prototype.getContributedValueCompletions = function(doc, node, offset, document, collector, collectionPromises) {
    if (!node) {
      this.contributions.forEach(function(contribution) {
        var collectPromise = contribution.collectDefaultCompletions(document.uri, collector);
        if (collectPromise) {
          collectionPromises.push(collectPromise);
        }
      });
    } else {
      if (node.type === "string" || node.type === "number" || node.type === "boolean" || node.type === "null") {
        node = node.parent;
      }
      if (node && node.type === "property" && offset > (node.colonOffset || 0)) {
        var parentKey_4 = node.keyNode.value;
        var valueNode = node.valueNode;
        if ((!valueNode || offset <= valueNode.offset + valueNode.length) && node.parent) {
          var location_2 = getNodePath3(node.parent);
          this.contributions.forEach(function(contribution) {
            var collectPromise = contribution.collectValueCompletions(document.uri, location_2, parentKey_4, collector);
            if (collectPromise) {
              collectionPromises.push(collectPromise);
            }
          });
        }
      }
    }
  };
  JSONCompletion2.prototype.addSchemaValueCompletions = function(schema, separatorAfter, collector, types) {
    var _this = this;
    if (typeof schema === "object") {
      this.addEnumValueCompletions(schema, separatorAfter, collector);
      this.addDefaultValueCompletions(schema, separatorAfter, collector);
      this.collectTypes(schema, types);
      if (Array.isArray(schema.allOf)) {
        schema.allOf.forEach(function(s) {
          return _this.addSchemaValueCompletions(s, separatorAfter, collector, types);
        });
      }
      if (Array.isArray(schema.anyOf)) {
        schema.anyOf.forEach(function(s) {
          return _this.addSchemaValueCompletions(s, separatorAfter, collector, types);
        });
      }
      if (Array.isArray(schema.oneOf)) {
        schema.oneOf.forEach(function(s) {
          return _this.addSchemaValueCompletions(s, separatorAfter, collector, types);
        });
      }
    }
  };
  JSONCompletion2.prototype.addDefaultValueCompletions = function(schema, separatorAfter, collector, arrayDepth) {
    var _this = this;
    if (arrayDepth === void 0) {
      arrayDepth = 0;
    }
    var hasProposals = false;
    if (isDefined(schema.default)) {
      var type = schema.type;
      var value = schema.default;
      for (var i = arrayDepth; i > 0; i--) {
        value = [value];
        type = "array";
      }
      collector.add({
        kind: this.getSuggestionKind(type),
        label: this.getLabelForValue(value),
        insertText: this.getInsertTextForValue(value, separatorAfter),
        insertTextFormat: InsertTextFormat.Snippet,
        detail: localize3("json.suggest.default", "Default value")
      });
      hasProposals = true;
    }
    if (Array.isArray(schema.examples)) {
      schema.examples.forEach(function(example) {
        var type2 = schema.type;
        var value2 = example;
        for (var i2 = arrayDepth; i2 > 0; i2--) {
          value2 = [value2];
          type2 = "array";
        }
        collector.add({
          kind: _this.getSuggestionKind(type2),
          label: _this.getLabelForValue(value2),
          insertText: _this.getInsertTextForValue(value2, separatorAfter),
          insertTextFormat: InsertTextFormat.Snippet
        });
        hasProposals = true;
      });
    }
    if (Array.isArray(schema.defaultSnippets)) {
      schema.defaultSnippets.forEach(function(s) {
        var type2 = schema.type;
        var value2 = s.body;
        var label = s.label;
        var insertText;
        var filterText;
        if (isDefined(value2)) {
          var type_1 = schema.type;
          for (var i2 = arrayDepth; i2 > 0; i2--) {
            value2 = [value2];
            type_1 = "array";
          }
          insertText = _this.getInsertTextForSnippetValue(value2, separatorAfter);
          filterText = _this.getFilterTextForSnippetValue(value2);
          label = label || _this.getLabelForSnippetValue(value2);
        } else if (typeof s.bodyText === "string") {
          var prefix = "", suffix = "", indent = "";
          for (var i2 = arrayDepth; i2 > 0; i2--) {
            prefix = prefix + indent + "[\n";
            suffix = suffix + "\n" + indent + "]";
            indent += "	";
            type2 = "array";
          }
          insertText = prefix + indent + s.bodyText.split("\n").join("\n" + indent) + suffix + separatorAfter;
          label = label || insertText, filterText = insertText.replace(/[\n]/g, "");
        } else {
          return;
        }
        collector.add({
          kind: _this.getSuggestionKind(type2),
          label,
          documentation: _this.fromMarkup(s.markdownDescription) || s.description,
          insertText,
          insertTextFormat: InsertTextFormat.Snippet,
          filterText
        });
        hasProposals = true;
      });
    }
    if (!hasProposals && typeof schema.items === "object" && !Array.isArray(schema.items) && arrayDepth < 5) {
      this.addDefaultValueCompletions(schema.items, separatorAfter, collector, arrayDepth + 1);
    }
  };
  JSONCompletion2.prototype.addEnumValueCompletions = function(schema, separatorAfter, collector) {
    if (isDefined(schema.const)) {
      collector.add({
        kind: this.getSuggestionKind(schema.type),
        label: this.getLabelForValue(schema.const),
        insertText: this.getInsertTextForValue(schema.const, separatorAfter),
        insertTextFormat: InsertTextFormat.Snippet,
        documentation: this.fromMarkup(schema.markdownDescription) || schema.description
      });
    }
    if (Array.isArray(schema.enum)) {
      for (var i = 0, length = schema.enum.length; i < length; i++) {
        var enm = schema.enum[i];
        var documentation = this.fromMarkup(schema.markdownDescription) || schema.description;
        if (schema.markdownEnumDescriptions && i < schema.markdownEnumDescriptions.length && this.doesSupportMarkdown()) {
          documentation = this.fromMarkup(schema.markdownEnumDescriptions[i]);
        } else if (schema.enumDescriptions && i < schema.enumDescriptions.length) {
          documentation = schema.enumDescriptions[i];
        }
        collector.add({
          kind: this.getSuggestionKind(schema.type),
          label: this.getLabelForValue(enm),
          insertText: this.getInsertTextForValue(enm, separatorAfter),
          insertTextFormat: InsertTextFormat.Snippet,
          documentation
        });
      }
    }
  };
  JSONCompletion2.prototype.collectTypes = function(schema, types) {
    if (Array.isArray(schema.enum) || isDefined(schema.const)) {
      return;
    }
    var type = schema.type;
    if (Array.isArray(type)) {
      type.forEach(function(t) {
        return types[t] = true;
      });
    } else if (type) {
      types[type] = true;
    }
  };
  JSONCompletion2.prototype.addFillerValueCompletions = function(types, separatorAfter, collector) {
    if (types["object"]) {
      collector.add({
        kind: this.getSuggestionKind("object"),
        label: "{}",
        insertText: this.getInsertTextForGuessedValue({}, separatorAfter),
        insertTextFormat: InsertTextFormat.Snippet,
        detail: localize3("defaults.object", "New object"),
        documentation: ""
      });
    }
    if (types["array"]) {
      collector.add({
        kind: this.getSuggestionKind("array"),
        label: "[]",
        insertText: this.getInsertTextForGuessedValue([], separatorAfter),
        insertTextFormat: InsertTextFormat.Snippet,
        detail: localize3("defaults.array", "New array"),
        documentation: ""
      });
    }
  };
  JSONCompletion2.prototype.addBooleanValueCompletion = function(value, separatorAfter, collector) {
    collector.add({
      kind: this.getSuggestionKind("boolean"),
      label: value ? "true" : "false",
      insertText: this.getInsertTextForValue(value, separatorAfter),
      insertTextFormat: InsertTextFormat.Snippet,
      documentation: ""
    });
  };
  JSONCompletion2.prototype.addNullValueCompletion = function(separatorAfter, collector) {
    collector.add({
      kind: this.getSuggestionKind("null"),
      label: "null",
      insertText: "null" + separatorAfter,
      insertTextFormat: InsertTextFormat.Snippet,
      documentation: ""
    });
  };
  JSONCompletion2.prototype.addDollarSchemaCompletions = function(separatorAfter, collector) {
    var _this = this;
    var schemaIds = this.schemaService.getRegisteredSchemaIds(function(schema) {
      return schema === "http" || schema === "https";
    });
    schemaIds.forEach(function(schemaId) {
      return collector.add({
        kind: CompletionItemKind.Module,
        label: _this.getLabelForValue(schemaId),
        filterText: _this.getFilterTextForValue(schemaId),
        insertText: _this.getInsertTextForValue(schemaId, separatorAfter),
        insertTextFormat: InsertTextFormat.Snippet,
        documentation: ""
      });
    });
  };
  JSONCompletion2.prototype.getLabelForValue = function(value) {
    return JSON.stringify(value);
  };
  JSONCompletion2.prototype.getFilterTextForValue = function(value) {
    return JSON.stringify(value);
  };
  JSONCompletion2.prototype.getFilterTextForSnippetValue = function(value) {
    return JSON.stringify(value).replace(/\$\{\d+:([^}]+)\}|\$\d+/g, "$1");
  };
  JSONCompletion2.prototype.getLabelForSnippetValue = function(value) {
    var label = JSON.stringify(value);
    return label.replace(/\$\{\d+:([^}]+)\}|\$\d+/g, "$1");
  };
  JSONCompletion2.prototype.getInsertTextForPlainText = function(text) {
    return text.replace(/[\\\$\}]/g, "\\$&");
  };
  JSONCompletion2.prototype.getInsertTextForValue = function(value, separatorAfter) {
    var text = JSON.stringify(value, null, "	");
    if (text === "{}") {
      return "{$1}" + separatorAfter;
    } else if (text === "[]") {
      return "[$1]" + separatorAfter;
    }
    return this.getInsertTextForPlainText(text + separatorAfter);
  };
  JSONCompletion2.prototype.getInsertTextForSnippetValue = function(value, separatorAfter) {
    var replacer = function(value2) {
      if (typeof value2 === "string") {
        if (value2[0] === "^") {
          return value2.substr(1);
        }
      }
      return JSON.stringify(value2);
    };
    return stringifyObject(value, "", replacer) + separatorAfter;
  };
  JSONCompletion2.prototype.getInsertTextForGuessedValue = function(value, separatorAfter) {
    switch (typeof value) {
      case "object":
        if (value === null) {
          return "${1:null}" + separatorAfter;
        }
        return this.getInsertTextForValue(value, separatorAfter);
      case "string":
        var snippetValue = JSON.stringify(value);
        snippetValue = snippetValue.substr(1, snippetValue.length - 2);
        snippetValue = this.getInsertTextForPlainText(snippetValue);
        return '"${1:' + snippetValue + '}"' + separatorAfter;
      case "number":
      case "boolean":
        return "${1:" + JSON.stringify(value) + "}" + separatorAfter;
    }
    return this.getInsertTextForValue(value, separatorAfter);
  };
  JSONCompletion2.prototype.getSuggestionKind = function(type) {
    if (Array.isArray(type)) {
      var array = type;
      type = array.length > 0 ? array[0] : void 0;
    }
    if (!type) {
      return CompletionItemKind.Value;
    }
    switch (type) {
      case "string":
        return CompletionItemKind.Value;
      case "object":
        return CompletionItemKind.Module;
      case "property":
        return CompletionItemKind.Property;
      default:
        return CompletionItemKind.Value;
    }
  };
  JSONCompletion2.prototype.getLabelTextForMatchingNode = function(node, document) {
    switch (node.type) {
      case "array":
        return "[]";
      case "object":
        return "{}";
      default:
        var content = document.getText().substr(node.offset, node.length);
        return content;
    }
  };
  JSONCompletion2.prototype.getInsertTextForMatchingNode = function(node, document, separatorAfter) {
    switch (node.type) {
      case "array":
        return this.getInsertTextForValue([], separatorAfter);
      case "object":
        return this.getInsertTextForValue({}, separatorAfter);
      default:
        var content = document.getText().substr(node.offset, node.length) + separatorAfter;
        return this.getInsertTextForPlainText(content);
    }
  };
  JSONCompletion2.prototype.getInsertTextForProperty = function(key, propertySchema, addValue, separatorAfter) {
    var propertyText = this.getInsertTextForValue(key, "");
    if (!addValue) {
      return propertyText;
    }
    var resultText = propertyText + ": ";
    var value;
    var nValueProposals = 0;
    if (propertySchema) {
      if (Array.isArray(propertySchema.defaultSnippets)) {
        if (propertySchema.defaultSnippets.length === 1) {
          var body = propertySchema.defaultSnippets[0].body;
          if (isDefined(body)) {
            value = this.getInsertTextForSnippetValue(body, "");
          }
        }
        nValueProposals += propertySchema.defaultSnippets.length;
      }
      if (propertySchema.enum) {
        if (!value && propertySchema.enum.length === 1) {
          value = this.getInsertTextForGuessedValue(propertySchema.enum[0], "");
        }
        nValueProposals += propertySchema.enum.length;
      }
      if (isDefined(propertySchema.default)) {
        if (!value) {
          value = this.getInsertTextForGuessedValue(propertySchema.default, "");
        }
        nValueProposals++;
      }
      if (Array.isArray(propertySchema.examples) && propertySchema.examples.length) {
        if (!value) {
          value = this.getInsertTextForGuessedValue(propertySchema.examples[0], "");
        }
        nValueProposals += propertySchema.examples.length;
      }
      if (nValueProposals === 0) {
        var type = Array.isArray(propertySchema.type) ? propertySchema.type[0] : propertySchema.type;
        if (!type) {
          if (propertySchema.properties) {
            type = "object";
          } else if (propertySchema.items) {
            type = "array";
          }
        }
        switch (type) {
          case "boolean":
            value = "$1";
            break;
          case "string":
            value = '"$1"';
            break;
          case "object":
            value = "{$1}";
            break;
          case "array":
            value = "[$1]";
            break;
          case "number":
          case "integer":
            value = "${1:0}";
            break;
          case "null":
            value = "${1:null}";
            break;
          default:
            return propertyText;
        }
      }
    }
    if (!value || nValueProposals > 1) {
      value = "$1";
    }
    return resultText + value + separatorAfter;
  };
  JSONCompletion2.prototype.getCurrentWord = function(document, offset) {
    var i = offset - 1;
    var text = document.getText();
    while (i >= 0 && ' 	\n\r\v":{[,]}'.indexOf(text.charAt(i)) === -1) {
      i--;
    }
    return text.substring(i + 1, offset);
  };
  JSONCompletion2.prototype.evaluateSeparatorAfter = function(document, offset) {
    var scanner = createScanner2(document.getText(), true);
    scanner.setPosition(offset);
    var token = scanner.scan();
    switch (token) {
      case 5:
      case 2:
      case 4:
      case 17:
        return "";
      default:
        return ",";
    }
  };
  JSONCompletion2.prototype.findItemAtOffset = function(node, document, offset) {
    var scanner = createScanner2(document.getText(), true);
    var children = node.items;
    for (var i = children.length - 1; i >= 0; i--) {
      var child = children[i];
      if (offset > child.offset + child.length) {
        scanner.setPosition(child.offset + child.length);
        var token = scanner.scan();
        if (token === 5 && offset >= scanner.getTokenOffset() + scanner.getTokenLength()) {
          return i + 1;
        }
        return i;
      } else if (offset >= child.offset) {
        return i;
      }
    }
    return 0;
  };
  JSONCompletion2.prototype.isInComment = function(document, start, offset) {
    var scanner = createScanner2(document.getText(), false);
    scanner.setPosition(start);
    var token = scanner.scan();
    while (token !== 17 && scanner.getTokenOffset() + scanner.getTokenLength() < offset) {
      token = scanner.scan();
    }
    return (token === 12 || token === 13) && scanner.getTokenOffset() <= offset;
  };
  JSONCompletion2.prototype.fromMarkup = function(markupString) {
    if (markupString && this.doesSupportMarkdown()) {
      return {
        kind: MarkupKind.Markdown,
        value: markupString
      };
    }
    return void 0;
  };
  JSONCompletion2.prototype.doesSupportMarkdown = function() {
    if (!isDefined(this.supportsMarkdown)) {
      var completion = this.clientCapabilities.textDocument && this.clientCapabilities.textDocument.completion;
      this.supportsMarkdown = completion && completion.completionItem && Array.isArray(completion.completionItem.documentationFormat) && completion.completionItem.documentationFormat.indexOf(MarkupKind.Markdown) !== -1;
    }
    return this.supportsMarkdown;
  };
  JSONCompletion2.prototype.doesSupportsCommitCharacters = function() {
    if (!isDefined(this.supportsCommitCharacters)) {
      var completion = this.clientCapabilities.textDocument && this.clientCapabilities.textDocument.completion;
      this.supportsCommitCharacters = completion && completion.completionItem && !!completion.completionItem.commitCharactersSupport;
    }
    return this.supportsCommitCharacters;
  };
  return JSONCompletion2;
}();

// node_modules/vscode-json-languageservice/lib/esm/services/jsonHover.js
var JSONHover = function() {
  function JSONHover2(schemaService, contributions, promiseConstructor) {
    if (contributions === void 0) {
      contributions = [];
    }
    this.schemaService = schemaService;
    this.contributions = contributions;
    this.promise = promiseConstructor || Promise;
  }
  JSONHover2.prototype.doHover = function(document, position, doc) {
    var offset = document.offsetAt(position);
    var node = doc.getNodeFromOffset(offset);
    if (!node || (node.type === "object" || node.type === "array") && offset > node.offset + 1 && offset < node.offset + node.length - 1) {
      return this.promise.resolve(null);
    }
    var hoverRangeNode = node;
    if (node.type === "string") {
      var parent = node.parent;
      if (parent && parent.type === "property" && parent.keyNode === node) {
        node = parent.valueNode;
        if (!node) {
          return this.promise.resolve(null);
        }
      }
    }
    var hoverRange = Range.create(document.positionAt(hoverRangeNode.offset), document.positionAt(hoverRangeNode.offset + hoverRangeNode.length));
    var createHover = function(contents) {
      var result = {
        contents,
        range: hoverRange
      };
      return result;
    };
    var location = getNodePath3(node);
    for (var i = this.contributions.length - 1; i >= 0; i--) {
      var contribution = this.contributions[i];
      var promise = contribution.getInfoContribution(document.uri, location);
      if (promise) {
        return promise.then(function(htmlContent) {
          return createHover(htmlContent);
        });
      }
    }
    return this.schemaService.getSchemaForResource(document.uri, doc).then(function(schema) {
      if (schema && node) {
        var matchingSchemas = doc.getMatchingSchemas(schema.schema, node.offset);
        var title_1 = void 0;
        var markdownDescription_1 = void 0;
        var markdownEnumValueDescription_1 = void 0, enumValue_1 = void 0;
        matchingSchemas.every(function(s) {
          if (s.node === node && !s.inverted && s.schema) {
            title_1 = title_1 || s.schema.title;
            markdownDescription_1 = markdownDescription_1 || s.schema.markdownDescription || toMarkdown(s.schema.description);
            if (s.schema.enum) {
              var idx = s.schema.enum.indexOf(getNodeValue3(node));
              if (s.schema.markdownEnumDescriptions) {
                markdownEnumValueDescription_1 = s.schema.markdownEnumDescriptions[idx];
              } else if (s.schema.enumDescriptions) {
                markdownEnumValueDescription_1 = toMarkdown(s.schema.enumDescriptions[idx]);
              }
              if (markdownEnumValueDescription_1) {
                enumValue_1 = s.schema.enum[idx];
                if (typeof enumValue_1 !== "string") {
                  enumValue_1 = JSON.stringify(enumValue_1);
                }
              }
            }
          }
          return true;
        });
        var result = "";
        if (title_1) {
          result = toMarkdown(title_1);
        }
        if (markdownDescription_1) {
          if (result.length > 0) {
            result += "\n\n";
          }
          result += markdownDescription_1;
        }
        if (markdownEnumValueDescription_1) {
          if (result.length > 0) {
            result += "\n\n";
          }
          result += "`".concat(toMarkdownCodeBlock(enumValue_1), "`: ").concat(markdownEnumValueDescription_1);
        }
        return createHover([result]);
      }
      return null;
    });
  };
  return JSONHover2;
}();
function toMarkdown(plain) {
  if (plain) {
    var res = plain.replace(/([^\n\r])(\r?\n)([^\n\r])/gm, "$1\n\n$3");
    return res.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
  }
  return void 0;
}
function toMarkdownCodeBlock(content) {
  if (content.indexOf("`") !== -1) {
    return "`` " + content + " ``";
  }
  return content;
}

// node_modules/vscode-json-languageservice/lib/esm/services/jsonValidation.js
var localize4 = loadMessageBundle();
var JSONValidation = function() {
  function JSONValidation2(jsonSchemaService, promiseConstructor) {
    this.jsonSchemaService = jsonSchemaService;
    this.promise = promiseConstructor;
    this.validationEnabled = true;
  }
  JSONValidation2.prototype.configure = function(raw) {
    if (raw) {
      this.validationEnabled = raw.validate !== false;
      this.commentSeverity = raw.allowComments ? void 0 : DiagnosticSeverity.Error;
    }
  };
  JSONValidation2.prototype.doValidation = function(textDocument, jsonDocument, documentSettings, schema) {
    var _this = this;
    if (!this.validationEnabled) {
      return this.promise.resolve([]);
    }
    var diagnostics = [];
    var added = {};
    var addProblem = function(problem) {
      var signature = problem.range.start.line + " " + problem.range.start.character + " " + problem.message;
      if (!added[signature]) {
        added[signature] = true;
        diagnostics.push(problem);
      }
    };
    var getDiagnostics = function(schema2) {
      var trailingCommaSeverity = (documentSettings === null || documentSettings === void 0 ? void 0 : documentSettings.trailingCommas) ? toDiagnosticSeverity(documentSettings.trailingCommas) : DiagnosticSeverity.Error;
      var commentSeverity = (documentSettings === null || documentSettings === void 0 ? void 0 : documentSettings.comments) ? toDiagnosticSeverity(documentSettings.comments) : _this.commentSeverity;
      var schemaValidation = (documentSettings === null || documentSettings === void 0 ? void 0 : documentSettings.schemaValidation) ? toDiagnosticSeverity(documentSettings.schemaValidation) : DiagnosticSeverity.Warning;
      var schemaRequest = (documentSettings === null || documentSettings === void 0 ? void 0 : documentSettings.schemaRequest) ? toDiagnosticSeverity(documentSettings.schemaRequest) : DiagnosticSeverity.Warning;
      if (schema2) {
        if (schema2.errors.length && jsonDocument.root && schemaRequest) {
          var astRoot = jsonDocument.root;
          var property = astRoot.type === "object" ? astRoot.properties[0] : void 0;
          if (property && property.keyNode.value === "$schema") {
            var node = property.valueNode || property;
            var range = Range.create(textDocument.positionAt(node.offset), textDocument.positionAt(node.offset + node.length));
            addProblem(Diagnostic.create(range, schema2.errors[0], schemaRequest, ErrorCode.SchemaResolveError));
          } else {
            var range = Range.create(textDocument.positionAt(astRoot.offset), textDocument.positionAt(astRoot.offset + 1));
            addProblem(Diagnostic.create(range, schema2.errors[0], schemaRequest, ErrorCode.SchemaResolveError));
          }
        } else if (schemaValidation) {
          var semanticErrors = jsonDocument.validate(textDocument, schema2.schema, schemaValidation);
          if (semanticErrors) {
            semanticErrors.forEach(addProblem);
          }
        }
        if (schemaAllowsComments(schema2.schema)) {
          commentSeverity = void 0;
        }
        if (schemaAllowsTrailingCommas(schema2.schema)) {
          trailingCommaSeverity = void 0;
        }
      }
      for (var _i = 0, _a = jsonDocument.syntaxErrors; _i < _a.length; _i++) {
        var p = _a[_i];
        if (p.code === ErrorCode.TrailingComma) {
          if (typeof trailingCommaSeverity !== "number") {
            continue;
          }
          p.severity = trailingCommaSeverity;
        }
        addProblem(p);
      }
      if (typeof commentSeverity === "number") {
        var message_1 = localize4("InvalidCommentToken", "Comments are not permitted in JSON.");
        jsonDocument.comments.forEach(function(c) {
          addProblem(Diagnostic.create(c, message_1, commentSeverity, ErrorCode.CommentNotPermitted));
        });
      }
      return diagnostics;
    };
    if (schema) {
      var id = schema.id || "schemaservice://untitled/" + idCounter++;
      var handle = this.jsonSchemaService.registerExternalSchema(id, [], schema);
      return handle.getResolvedSchema().then(function(resolvedSchema) {
        return getDiagnostics(resolvedSchema);
      });
    }
    return this.jsonSchemaService.getSchemaForResource(textDocument.uri, jsonDocument).then(function(schema2) {
      return getDiagnostics(schema2);
    });
  };
  JSONValidation2.prototype.getLanguageStatus = function(textDocument, jsonDocument) {
    return { schemas: this.jsonSchemaService.getSchemaURIsForResource(textDocument.uri, jsonDocument) };
  };
  return JSONValidation2;
}();
var idCounter = 0;
function schemaAllowsComments(schemaRef) {
  if (schemaRef && typeof schemaRef === "object") {
    if (isBoolean(schemaRef.allowComments)) {
      return schemaRef.allowComments;
    }
    if (schemaRef.allOf) {
      for (var _i = 0, _a = schemaRef.allOf; _i < _a.length; _i++) {
        var schema = _a[_i];
        var allow = schemaAllowsComments(schema);
        if (isBoolean(allow)) {
          return allow;
        }
      }
    }
  }
  return void 0;
}
function schemaAllowsTrailingCommas(schemaRef) {
  if (schemaRef && typeof schemaRef === "object") {
    if (isBoolean(schemaRef.allowTrailingCommas)) {
      return schemaRef.allowTrailingCommas;
    }
    var deprSchemaRef = schemaRef;
    if (isBoolean(deprSchemaRef["allowsTrailingCommas"])) {
      return deprSchemaRef["allowsTrailingCommas"];
    }
    if (schemaRef.allOf) {
      for (var _i = 0, _a = schemaRef.allOf; _i < _a.length; _i++) {
        var schema = _a[_i];
        var allow = schemaAllowsTrailingCommas(schema);
        if (isBoolean(allow)) {
          return allow;
        }
      }
    }
  }
  return void 0;
}
function toDiagnosticSeverity(severityLevel) {
  switch (severityLevel) {
    case "error":
      return DiagnosticSeverity.Error;
    case "warning":
      return DiagnosticSeverity.Warning;
    case "ignore":
      return void 0;
  }
  return void 0;
}

// node_modules/vscode-json-languageservice/lib/esm/utils/colors.js
var Digit0 = 48;
var Digit9 = 57;
var A = 65;
var a = 97;
var f = 102;
function hexDigit(charCode) {
  if (charCode < Digit0) {
    return 0;
  }
  if (charCode <= Digit9) {
    return charCode - Digit0;
  }
  if (charCode < a) {
    charCode += a - A;
  }
  if (charCode >= a && charCode <= f) {
    return charCode - a + 10;
  }
  return 0;
}
function colorFromHex(text) {
  if (text[0] !== "#") {
    return void 0;
  }
  switch (text.length) {
    case 4:
      return {
        red: hexDigit(text.charCodeAt(1)) * 17 / 255,
        green: hexDigit(text.charCodeAt(2)) * 17 / 255,
        blue: hexDigit(text.charCodeAt(3)) * 17 / 255,
        alpha: 1
      };
    case 5:
      return {
        red: hexDigit(text.charCodeAt(1)) * 17 / 255,
        green: hexDigit(text.charCodeAt(2)) * 17 / 255,
        blue: hexDigit(text.charCodeAt(3)) * 17 / 255,
        alpha: hexDigit(text.charCodeAt(4)) * 17 / 255
      };
    case 7:
      return {
        red: (hexDigit(text.charCodeAt(1)) * 16 + hexDigit(text.charCodeAt(2))) / 255,
        green: (hexDigit(text.charCodeAt(3)) * 16 + hexDigit(text.charCodeAt(4))) / 255,
        blue: (hexDigit(text.charCodeAt(5)) * 16 + hexDigit(text.charCodeAt(6))) / 255,
        alpha: 1
      };
    case 9:
      return {
        red: (hexDigit(text.charCodeAt(1)) * 16 + hexDigit(text.charCodeAt(2))) / 255,
        green: (hexDigit(text.charCodeAt(3)) * 16 + hexDigit(text.charCodeAt(4))) / 255,
        blue: (hexDigit(text.charCodeAt(5)) * 16 + hexDigit(text.charCodeAt(6))) / 255,
        alpha: (hexDigit(text.charCodeAt(7)) * 16 + hexDigit(text.charCodeAt(8))) / 255
      };
  }
  return void 0;
}

// node_modules/vscode-json-languageservice/lib/esm/services/jsonDocumentSymbols.js
var JSONDocumentSymbols = function() {
  function JSONDocumentSymbols2(schemaService) {
    this.schemaService = schemaService;
  }
  JSONDocumentSymbols2.prototype.findDocumentSymbols = function(document, doc, context) {
    var _this = this;
    if (context === void 0) {
      context = { resultLimit: Number.MAX_VALUE };
    }
    var root = doc.root;
    if (!root) {
      return [];
    }
    var limit = context.resultLimit || Number.MAX_VALUE;
    var resourceString = document.uri;
    if (resourceString === "vscode://defaultsettings/keybindings.json" || endsWith(resourceString.toLowerCase(), "/user/keybindings.json")) {
      if (root.type === "array") {
        var result_1 = [];
        for (var _i = 0, _a = root.items; _i < _a.length; _i++) {
          var item = _a[_i];
          if (item.type === "object") {
            for (var _b = 0, _c = item.properties; _b < _c.length; _b++) {
              var property = _c[_b];
              if (property.keyNode.value === "key" && property.valueNode) {
                var location = Location.create(document.uri, getRange(document, item));
                result_1.push({ name: getNodeValue3(property.valueNode), kind: SymbolKind.Function, location });
                limit--;
                if (limit <= 0) {
                  if (context && context.onResultLimitExceeded) {
                    context.onResultLimitExceeded(resourceString);
                  }
                  return result_1;
                }
              }
            }
          }
        }
        return result_1;
      }
    }
    var toVisit = [
      { node: root, containerName: "" }
    ];
    var nextToVisit = 0;
    var limitExceeded = false;
    var result = [];
    var collectOutlineEntries = function(node, containerName) {
      if (node.type === "array") {
        node.items.forEach(function(node2) {
          if (node2) {
            toVisit.push({ node: node2, containerName });
          }
        });
      } else if (node.type === "object") {
        node.properties.forEach(function(property2) {
          var valueNode = property2.valueNode;
          if (valueNode) {
            if (limit > 0) {
              limit--;
              var location2 = Location.create(document.uri, getRange(document, property2));
              var childContainerName = containerName ? containerName + "." + property2.keyNode.value : property2.keyNode.value;
              result.push({ name: _this.getKeyLabel(property2), kind: _this.getSymbolKind(valueNode.type), location: location2, containerName });
              toVisit.push({ node: valueNode, containerName: childContainerName });
            } else {
              limitExceeded = true;
            }
          }
        });
      }
    };
    while (nextToVisit < toVisit.length) {
      var next = toVisit[nextToVisit++];
      collectOutlineEntries(next.node, next.containerName);
    }
    if (limitExceeded && context && context.onResultLimitExceeded) {
      context.onResultLimitExceeded(resourceString);
    }
    return result;
  };
  JSONDocumentSymbols2.prototype.findDocumentSymbols2 = function(document, doc, context) {
    var _this = this;
    if (context === void 0) {
      context = { resultLimit: Number.MAX_VALUE };
    }
    var root = doc.root;
    if (!root) {
      return [];
    }
    var limit = context.resultLimit || Number.MAX_VALUE;
    var resourceString = document.uri;
    if (resourceString === "vscode://defaultsettings/keybindings.json" || endsWith(resourceString.toLowerCase(), "/user/keybindings.json")) {
      if (root.type === "array") {
        var result_2 = [];
        for (var _i = 0, _a = root.items; _i < _a.length; _i++) {
          var item = _a[_i];
          if (item.type === "object") {
            for (var _b = 0, _c = item.properties; _b < _c.length; _b++) {
              var property = _c[_b];
              if (property.keyNode.value === "key" && property.valueNode) {
                var range = getRange(document, item);
                var selectionRange = getRange(document, property.keyNode);
                result_2.push({ name: getNodeValue3(property.valueNode), kind: SymbolKind.Function, range, selectionRange });
                limit--;
                if (limit <= 0) {
                  if (context && context.onResultLimitExceeded) {
                    context.onResultLimitExceeded(resourceString);
                  }
                  return result_2;
                }
              }
            }
          }
        }
        return result_2;
      }
    }
    var result = [];
    var toVisit = [
      { node: root, result }
    ];
    var nextToVisit = 0;
    var limitExceeded = false;
    var collectOutlineEntries = function(node, result2) {
      if (node.type === "array") {
        node.items.forEach(function(node2, index) {
          if (node2) {
            if (limit > 0) {
              limit--;
              var range2 = getRange(document, node2);
              var selectionRange2 = range2;
              var name = String(index);
              var symbol = { name, kind: _this.getSymbolKind(node2.type), range: range2, selectionRange: selectionRange2, children: [] };
              result2.push(symbol);
              toVisit.push({ result: symbol.children, node: node2 });
            } else {
              limitExceeded = true;
            }
          }
        });
      } else if (node.type === "object") {
        node.properties.forEach(function(property2) {
          var valueNode = property2.valueNode;
          if (valueNode) {
            if (limit > 0) {
              limit--;
              var range2 = getRange(document, property2);
              var selectionRange2 = getRange(document, property2.keyNode);
              var children = [];
              var symbol = { name: _this.getKeyLabel(property2), kind: _this.getSymbolKind(valueNode.type), range: range2, selectionRange: selectionRange2, children, detail: _this.getDetail(valueNode) };
              result2.push(symbol);
              toVisit.push({ result: children, node: valueNode });
            } else {
              limitExceeded = true;
            }
          }
        });
      }
    };
    while (nextToVisit < toVisit.length) {
      var next = toVisit[nextToVisit++];
      collectOutlineEntries(next.node, next.result);
    }
    if (limitExceeded && context && context.onResultLimitExceeded) {
      context.onResultLimitExceeded(resourceString);
    }
    return result;
  };
  JSONDocumentSymbols2.prototype.getSymbolKind = function(nodeType) {
    switch (nodeType) {
      case "object":
        return SymbolKind.Module;
      case "string":
        return SymbolKind.String;
      case "number":
        return SymbolKind.Number;
      case "array":
        return SymbolKind.Array;
      case "boolean":
        return SymbolKind.Boolean;
      default:
        return SymbolKind.Variable;
    }
  };
  JSONDocumentSymbols2.prototype.getKeyLabel = function(property) {
    var name = property.keyNode.value;
    if (name) {
      name = name.replace(/[\n]/g, "\u21B5");
    }
    if (name && name.trim()) {
      return name;
    }
    return '"'.concat(name, '"');
  };
  JSONDocumentSymbols2.prototype.getDetail = function(node) {
    if (!node) {
      return void 0;
    }
    if (node.type === "boolean" || node.type === "number" || node.type === "null" || node.type === "string") {
      return String(node.value);
    } else {
      if (node.type === "array") {
        return node.children.length ? void 0 : "[]";
      } else if (node.type === "object") {
        return node.children.length ? void 0 : "{}";
      }
    }
    return void 0;
  };
  JSONDocumentSymbols2.prototype.findDocumentColors = function(document, doc, context) {
    return this.schemaService.getSchemaForResource(document.uri, doc).then(function(schema) {
      var result = [];
      if (schema) {
        var limit = context && typeof context.resultLimit === "number" ? context.resultLimit : Number.MAX_VALUE;
        var matchingSchemas = doc.getMatchingSchemas(schema.schema);
        var visitedNode = {};
        for (var _i = 0, matchingSchemas_1 = matchingSchemas; _i < matchingSchemas_1.length; _i++) {
          var s = matchingSchemas_1[_i];
          if (!s.inverted && s.schema && (s.schema.format === "color" || s.schema.format === "color-hex") && s.node && s.node.type === "string") {
            var nodeId = String(s.node.offset);
            if (!visitedNode[nodeId]) {
              var color = colorFromHex(getNodeValue3(s.node));
              if (color) {
                var range = getRange(document, s.node);
                result.push({ color, range });
              }
              visitedNode[nodeId] = true;
              limit--;
              if (limit <= 0) {
                if (context && context.onResultLimitExceeded) {
                  context.onResultLimitExceeded(document.uri);
                }
                return result;
              }
            }
          }
        }
      }
      return result;
    });
  };
  JSONDocumentSymbols2.prototype.getColorPresentations = function(document, doc, color, range) {
    var result = [];
    var red256 = Math.round(color.red * 255), green256 = Math.round(color.green * 255), blue256 = Math.round(color.blue * 255);
    function toTwoDigitHex(n) {
      var r = n.toString(16);
      return r.length !== 2 ? "0" + r : r;
    }
    var label;
    if (color.alpha === 1) {
      label = "#".concat(toTwoDigitHex(red256)).concat(toTwoDigitHex(green256)).concat(toTwoDigitHex(blue256));
    } else {
      label = "#".concat(toTwoDigitHex(red256)).concat(toTwoDigitHex(green256)).concat(toTwoDigitHex(blue256)).concat(toTwoDigitHex(Math.round(color.alpha * 255)));
    }
    result.push({ label, textEdit: TextEdit.replace(range, JSON.stringify(label)) });
    return result;
  };
  return JSONDocumentSymbols2;
}();
function getRange(document, node) {
  return Range.create(document.positionAt(node.offset), document.positionAt(node.offset + node.length));
}

// node_modules/vscode-json-languageservice/lib/esm/services/configuration.js
var localize5 = loadMessageBundle();
var schemaContributions = {
  schemaAssociations: [],
  schemas: {
    "http://json-schema.org/schema#": {
      $ref: "http://json-schema.org/draft-07/schema#"
    },
    "http://json-schema.org/draft-04/schema#": {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "definitions": {
        "schemaArray": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#"
          }
        },
        "positiveInteger": {
          "type": "integer",
          "minimum": 0
        },
        "positiveIntegerDefault0": {
          "allOf": [
            {
              "$ref": "#/definitions/positiveInteger"
            },
            {
              "default": 0
            }
          ]
        },
        "simpleTypes": {
          "type": "string",
          "enum": [
            "array",
            "boolean",
            "integer",
            "null",
            "number",
            "object",
            "string"
          ]
        },
        "stringArray": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "minItems": 1,
          "uniqueItems": true
        }
      },
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "format": "uri"
        },
        "$schema": {
          "type": "string",
          "format": "uri"
        },
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "default": {},
        "multipleOf": {
          "type": "number",
          "minimum": 0,
          "exclusiveMinimum": true
        },
        "maximum": {
          "type": "number"
        },
        "exclusiveMaximum": {
          "type": "boolean",
          "default": false
        },
        "minimum": {
          "type": "number"
        },
        "exclusiveMinimum": {
          "type": "boolean",
          "default": false
        },
        "maxLength": {
          "allOf": [
            {
              "$ref": "#/definitions/positiveInteger"
            }
          ]
        },
        "minLength": {
          "allOf": [
            {
              "$ref": "#/definitions/positiveIntegerDefault0"
            }
          ]
        },
        "pattern": {
          "type": "string",
          "format": "regex"
        },
        "additionalItems": {
          "anyOf": [
            {
              "type": "boolean"
            },
            {
              "$ref": "#"
            }
          ],
          "default": {}
        },
        "items": {
          "anyOf": [
            {
              "$ref": "#"
            },
            {
              "$ref": "#/definitions/schemaArray"
            }
          ],
          "default": {}
        },
        "maxItems": {
          "allOf": [
            {
              "$ref": "#/definitions/positiveInteger"
            }
          ]
        },
        "minItems": {
          "allOf": [
            {
              "$ref": "#/definitions/positiveIntegerDefault0"
            }
          ]
        },
        "uniqueItems": {
          "type": "boolean",
          "default": false
        },
        "maxProperties": {
          "allOf": [
            {
              "$ref": "#/definitions/positiveInteger"
            }
          ]
        },
        "minProperties": {
          "allOf": [
            {
              "$ref": "#/definitions/positiveIntegerDefault0"
            }
          ]
        },
        "required": {
          "allOf": [
            {
              "$ref": "#/definitions/stringArray"
            }
          ]
        },
        "additionalProperties": {
          "anyOf": [
            {
              "type": "boolean"
            },
            {
              "$ref": "#"
            }
          ],
          "default": {}
        },
        "definitions": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#"
          },
          "default": {}
        },
        "properties": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#"
          },
          "default": {}
        },
        "patternProperties": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#"
          },
          "default": {}
        },
        "dependencies": {
          "type": "object",
          "additionalProperties": {
            "anyOf": [
              {
                "$ref": "#"
              },
              {
                "$ref": "#/definitions/stringArray"
              }
            ]
          }
        },
        "enum": {
          "type": "array",
          "minItems": 1,
          "uniqueItems": true
        },
        "type": {
          "anyOf": [
            {
              "$ref": "#/definitions/simpleTypes"
            },
            {
              "type": "array",
              "items": {
                "$ref": "#/definitions/simpleTypes"
              },
              "minItems": 1,
              "uniqueItems": true
            }
          ]
        },
        "format": {
          "anyOf": [
            {
              "type": "string",
              "enum": [
                "date-time",
                "uri",
                "email",
                "hostname",
                "ipv4",
                "ipv6",
                "regex"
              ]
            },
            {
              "type": "string"
            }
          ]
        },
        "allOf": {
          "allOf": [
            {
              "$ref": "#/definitions/schemaArray"
            }
          ]
        },
        "anyOf": {
          "allOf": [
            {
              "$ref": "#/definitions/schemaArray"
            }
          ]
        },
        "oneOf": {
          "allOf": [
            {
              "$ref": "#/definitions/schemaArray"
            }
          ]
        },
        "not": {
          "allOf": [
            {
              "$ref": "#"
            }
          ]
        }
      },
      "dependencies": {
        "exclusiveMaximum": [
          "maximum"
        ],
        "exclusiveMinimum": [
          "minimum"
        ]
      },
      "default": {}
    },
    "http://json-schema.org/draft-07/schema#": {
      "definitions": {
        "schemaArray": {
          "type": "array",
          "minItems": 1,
          "items": { "$ref": "#" }
        },
        "nonNegativeInteger": {
          "type": "integer",
          "minimum": 0
        },
        "nonNegativeIntegerDefault0": {
          "allOf": [
            { "$ref": "#/definitions/nonNegativeInteger" },
            { "default": 0 }
          ]
        },
        "simpleTypes": {
          "enum": [
            "array",
            "boolean",
            "integer",
            "null",
            "number",
            "object",
            "string"
          ]
        },
        "stringArray": {
          "type": "array",
          "items": { "type": "string" },
          "uniqueItems": true,
          "default": []
        }
      },
      "type": ["object", "boolean"],
      "properties": {
        "$id": {
          "type": "string",
          "format": "uri-reference"
        },
        "$schema": {
          "type": "string",
          "format": "uri"
        },
        "$ref": {
          "type": "string",
          "format": "uri-reference"
        },
        "$comment": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "default": true,
        "readOnly": {
          "type": "boolean",
          "default": false
        },
        "examples": {
          "type": "array",
          "items": true
        },
        "multipleOf": {
          "type": "number",
          "exclusiveMinimum": 0
        },
        "maximum": {
          "type": "number"
        },
        "exclusiveMaximum": {
          "type": "number"
        },
        "minimum": {
          "type": "number"
        },
        "exclusiveMinimum": {
          "type": "number"
        },
        "maxLength": { "$ref": "#/definitions/nonNegativeInteger" },
        "minLength": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
        "pattern": {
          "type": "string",
          "format": "regex"
        },
        "additionalItems": { "$ref": "#" },
        "items": {
          "anyOf": [
            { "$ref": "#" },
            { "$ref": "#/definitions/schemaArray" }
          ],
          "default": true
        },
        "maxItems": { "$ref": "#/definitions/nonNegativeInteger" },
        "minItems": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
        "uniqueItems": {
          "type": "boolean",
          "default": false
        },
        "contains": { "$ref": "#" },
        "maxProperties": { "$ref": "#/definitions/nonNegativeInteger" },
        "minProperties": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
        "required": { "$ref": "#/definitions/stringArray" },
        "additionalProperties": { "$ref": "#" },
        "definitions": {
          "type": "object",
          "additionalProperties": { "$ref": "#" },
          "default": {}
        },
        "properties": {
          "type": "object",
          "additionalProperties": { "$ref": "#" },
          "default": {}
        },
        "patternProperties": {
          "type": "object",
          "additionalProperties": { "$ref": "#" },
          "propertyNames": { "format": "regex" },
          "default": {}
        },
        "dependencies": {
          "type": "object",
          "additionalProperties": {
            "anyOf": [
              { "$ref": "#" },
              { "$ref": "#/definitions/stringArray" }
            ]
          }
        },
        "propertyNames": { "$ref": "#" },
        "const": true,
        "enum": {
          "type": "array",
          "items": true,
          "minItems": 1,
          "uniqueItems": true
        },
        "type": {
          "anyOf": [
            { "$ref": "#/definitions/simpleTypes" },
            {
              "type": "array",
              "items": { "$ref": "#/definitions/simpleTypes" },
              "minItems": 1,
              "uniqueItems": true
            }
          ]
        },
        "format": { "type": "string" },
        "contentMediaType": { "type": "string" },
        "contentEncoding": { "type": "string" },
        "if": { "$ref": "#" },
        "then": { "$ref": "#" },
        "else": { "$ref": "#" },
        "allOf": { "$ref": "#/definitions/schemaArray" },
        "anyOf": { "$ref": "#/definitions/schemaArray" },
        "oneOf": { "$ref": "#/definitions/schemaArray" },
        "not": { "$ref": "#" }
      },
      "default": true
    }
  }
};
var descriptions = {
  id: localize5("schema.json.id", "A unique identifier for the schema."),
  $schema: localize5("schema.json.$schema", "The schema to verify this document against."),
  title: localize5("schema.json.title", "A descriptive title of the element."),
  description: localize5("schema.json.description", "A long description of the element. Used in hover menus and suggestions."),
  default: localize5("schema.json.default", "A default value. Used by suggestions."),
  multipleOf: localize5("schema.json.multipleOf", "A number that should cleanly divide the current value (i.e. have no remainder)."),
  maximum: localize5("schema.json.maximum", "The maximum numerical value, inclusive by default."),
  exclusiveMaximum: localize5("schema.json.exclusiveMaximum", "Makes the maximum property exclusive."),
  minimum: localize5("schema.json.minimum", "The minimum numerical value, inclusive by default."),
  exclusiveMinimum: localize5("schema.json.exclusiveMininum", "Makes the minimum property exclusive."),
  maxLength: localize5("schema.json.maxLength", "The maximum length of a string."),
  minLength: localize5("schema.json.minLength", "The minimum length of a string."),
  pattern: localize5("schema.json.pattern", "A regular expression to match the string against. It is not implicitly anchored."),
  additionalItems: localize5("schema.json.additionalItems", "For arrays, only when items is set as an array. If it is a schema, then this schema validates items after the ones specified by the items array. If it is false, then additional items will cause validation to fail."),
  items: localize5("schema.json.items", "For arrays. Can either be a schema to validate every element against or an array of schemas to validate each item against in order (the first schema will validate the first element, the second schema will validate the second element, and so on."),
  maxItems: localize5("schema.json.maxItems", "The maximum number of items that can be inside an array. Inclusive."),
  minItems: localize5("schema.json.minItems", "The minimum number of items that can be inside an array. Inclusive."),
  uniqueItems: localize5("schema.json.uniqueItems", "If all of the items in the array must be unique. Defaults to false."),
  maxProperties: localize5("schema.json.maxProperties", "The maximum number of properties an object can have. Inclusive."),
  minProperties: localize5("schema.json.minProperties", "The minimum number of properties an object can have. Inclusive."),
  required: localize5("schema.json.required", "An array of strings that lists the names of all properties required on this object."),
  additionalProperties: localize5("schema.json.additionalProperties", "Either a schema or a boolean. If a schema, then used to validate all properties not matched by 'properties' or 'patternProperties'. If false, then any properties not matched by either will cause this schema to fail."),
  definitions: localize5("schema.json.definitions", "Not used for validation. Place subschemas here that you wish to reference inline with $ref."),
  properties: localize5("schema.json.properties", "A map of property names to schemas for each property."),
  patternProperties: localize5("schema.json.patternProperties", "A map of regular expressions on property names to schemas for matching properties."),
  dependencies: localize5("schema.json.dependencies", "A map of property names to either an array of property names or a schema. An array of property names means the property named in the key depends on the properties in the array being present in the object in order to be valid. If the value is a schema, then the schema is only applied to the object if the property in the key exists on the object."),
  enum: localize5("schema.json.enum", "The set of literal values that are valid."),
  type: localize5("schema.json.type", "Either a string of one of the basic schema types (number, integer, null, array, object, boolean, string) or an array of strings specifying a subset of those types."),
  format: localize5("schema.json.format", "Describes the format expected for the value."),
  allOf: localize5("schema.json.allOf", "An array of schemas, all of which must match."),
  anyOf: localize5("schema.json.anyOf", "An array of schemas, where at least one must match."),
  oneOf: localize5("schema.json.oneOf", "An array of schemas, exactly one of which must match."),
  not: localize5("schema.json.not", "A schema which must not match."),
  $id: localize5("schema.json.$id", "A unique identifier for the schema."),
  $ref: localize5("schema.json.$ref", "Reference a definition hosted on any location."),
  $comment: localize5("schema.json.$comment", "Comments from schema authors to readers or maintainers of the schema."),
  readOnly: localize5("schema.json.readOnly", "Indicates that the value of the instance is managed exclusively by the owning authority."),
  examples: localize5("schema.json.examples", "Sample JSON values associated with a particular schema, for the purpose of illustrating usage."),
  contains: localize5("schema.json.contains", 'An array instance is valid against "contains" if at least one of its elements is valid against the given schema.'),
  propertyNames: localize5("schema.json.propertyNames", "If the instance is an object, this keyword validates if every property name in the instance validates against the provided schema."),
  const: localize5("schema.json.const", "An instance validates successfully against this keyword if its value is equal to the value of the keyword."),
  contentMediaType: localize5("schema.json.contentMediaType", "Describes the media type of a string property."),
  contentEncoding: localize5("schema.json.contentEncoding", "Describes the content encoding of a string property."),
  if: localize5("schema.json.if", 'The validation outcome of the "if" subschema controls which of the "then" or "else" keywords are evaluated.'),
  then: localize5("schema.json.then", 'The "if" subschema is used for validation when the "if" subschema succeeds.'),
  else: localize5("schema.json.else", 'The "else" subschema is used for validation when the "if" subschema fails.')
};
for (schemaName in schemaContributions.schemas) {
  schema = schemaContributions.schemas[schemaName];
  for (property in schema.properties) {
    propertyObject = schema.properties[property];
    if (typeof propertyObject === "boolean") {
      propertyObject = schema.properties[property] = {};
    }
    description = descriptions[property];
    if (description) {
      propertyObject["description"] = description;
    } else {
      console.log("".concat(property, ": localize('schema.json.").concat(property, `', "")`));
    }
  }
}
var schema;
var propertyObject;
var description;
var property;
var schemaName;

// node_modules/vscode-uri/lib/esm/index.js
var LIB;
LIB = (() => {
  "use strict";
  var t = { 470: (t2) => {
    function e2(t3) {
      if ("string" != typeof t3)
        throw new TypeError("Path must be a string. Received " + JSON.stringify(t3));
    }
    function r2(t3, e3) {
      for (var r3, n2 = "", o = 0, i = -1, a2 = 0, h = 0; h <= t3.length; ++h) {
        if (h < t3.length)
          r3 = t3.charCodeAt(h);
        else {
          if (47 === r3)
            break;
          r3 = 47;
        }
        if (47 === r3) {
          if (i === h - 1 || 1 === a2)
            ;
          else if (i !== h - 1 && 2 === a2) {
            if (n2.length < 2 || 2 !== o || 46 !== n2.charCodeAt(n2.length - 1) || 46 !== n2.charCodeAt(n2.length - 2)) {
              if (n2.length > 2) {
                var s = n2.lastIndexOf("/");
                if (s !== n2.length - 1) {
                  -1 === s ? (n2 = "", o = 0) : o = (n2 = n2.slice(0, s)).length - 1 - n2.lastIndexOf("/"), i = h, a2 = 0;
                  continue;
                }
              } else if (2 === n2.length || 1 === n2.length) {
                n2 = "", o = 0, i = h, a2 = 0;
                continue;
              }
            }
            e3 && (n2.length > 0 ? n2 += "/.." : n2 = "..", o = 2);
          } else
            n2.length > 0 ? n2 += "/" + t3.slice(i + 1, h) : n2 = t3.slice(i + 1, h), o = h - i - 1;
          i = h, a2 = 0;
        } else
          46 === r3 && -1 !== a2 ? ++a2 : a2 = -1;
      }
      return n2;
    }
    var n = { resolve: function() {
      for (var t3, n2 = "", o = false, i = arguments.length - 1; i >= -1 && !o; i--) {
        var a2;
        i >= 0 ? a2 = arguments[i] : (void 0 === t3 && (t3 = process.cwd()), a2 = t3), e2(a2), 0 !== a2.length && (n2 = a2 + "/" + n2, o = 47 === a2.charCodeAt(0));
      }
      return n2 = r2(n2, !o), o ? n2.length > 0 ? "/" + n2 : "/" : n2.length > 0 ? n2 : ".";
    }, normalize: function(t3) {
      if (e2(t3), 0 === t3.length)
        return ".";
      var n2 = 47 === t3.charCodeAt(0), o = 47 === t3.charCodeAt(t3.length - 1);
      return 0 !== (t3 = r2(t3, !n2)).length || n2 || (t3 = "."), t3.length > 0 && o && (t3 += "/"), n2 ? "/" + t3 : t3;
    }, isAbsolute: function(t3) {
      return e2(t3), t3.length > 0 && 47 === t3.charCodeAt(0);
    }, join: function() {
      if (0 === arguments.length)
        return ".";
      for (var t3, r3 = 0; r3 < arguments.length; ++r3) {
        var o = arguments[r3];
        e2(o), o.length > 0 && (void 0 === t3 ? t3 = o : t3 += "/" + o);
      }
      return void 0 === t3 ? "." : n.normalize(t3);
    }, relative: function(t3, r3) {
      if (e2(t3), e2(r3), t3 === r3)
        return "";
      if ((t3 = n.resolve(t3)) === (r3 = n.resolve(r3)))
        return "";
      for (var o = 1; o < t3.length && 47 === t3.charCodeAt(o); ++o)
        ;
      for (var i = t3.length, a2 = i - o, h = 1; h < r3.length && 47 === r3.charCodeAt(h); ++h)
        ;
      for (var s = r3.length - h, c = a2 < s ? a2 : s, f2 = -1, u = 0; u <= c; ++u) {
        if (u === c) {
          if (s > c) {
            if (47 === r3.charCodeAt(h + u))
              return r3.slice(h + u + 1);
            if (0 === u)
              return r3.slice(h + u);
          } else
            a2 > c && (47 === t3.charCodeAt(o + u) ? f2 = u : 0 === u && (f2 = 0));
          break;
        }
        var l = t3.charCodeAt(o + u);
        if (l !== r3.charCodeAt(h + u))
          break;
        47 === l && (f2 = u);
      }
      var p = "";
      for (u = o + f2 + 1; u <= i; ++u)
        u !== i && 47 !== t3.charCodeAt(u) || (0 === p.length ? p += ".." : p += "/..");
      return p.length > 0 ? p + r3.slice(h + f2) : (h += f2, 47 === r3.charCodeAt(h) && ++h, r3.slice(h));
    }, _makeLong: function(t3) {
      return t3;
    }, dirname: function(t3) {
      if (e2(t3), 0 === t3.length)
        return ".";
      for (var r3 = t3.charCodeAt(0), n2 = 47 === r3, o = -1, i = true, a2 = t3.length - 1; a2 >= 1; --a2)
        if (47 === (r3 = t3.charCodeAt(a2))) {
          if (!i) {
            o = a2;
            break;
          }
        } else
          i = false;
      return -1 === o ? n2 ? "/" : "." : n2 && 1 === o ? "//" : t3.slice(0, o);
    }, basename: function(t3, r3) {
      if (void 0 !== r3 && "string" != typeof r3)
        throw new TypeError('"ext" argument must be a string');
      e2(t3);
      var n2, o = 0, i = -1, a2 = true;
      if (void 0 !== r3 && r3.length > 0 && r3.length <= t3.length) {
        if (r3.length === t3.length && r3 === t3)
          return "";
        var h = r3.length - 1, s = -1;
        for (n2 = t3.length - 1; n2 >= 0; --n2) {
          var c = t3.charCodeAt(n2);
          if (47 === c) {
            if (!a2) {
              o = n2 + 1;
              break;
            }
          } else
            -1 === s && (a2 = false, s = n2 + 1), h >= 0 && (c === r3.charCodeAt(h) ? -1 == --h && (i = n2) : (h = -1, i = s));
        }
        return o === i ? i = s : -1 === i && (i = t3.length), t3.slice(o, i);
      }
      for (n2 = t3.length - 1; n2 >= 0; --n2)
        if (47 === t3.charCodeAt(n2)) {
          if (!a2) {
            o = n2 + 1;
            break;
          }
        } else
          -1 === i && (a2 = false, i = n2 + 1);
      return -1 === i ? "" : t3.slice(o, i);
    }, extname: function(t3) {
      e2(t3);
      for (var r3 = -1, n2 = 0, o = -1, i = true, a2 = 0, h = t3.length - 1; h >= 0; --h) {
        var s = t3.charCodeAt(h);
        if (47 !== s)
          -1 === o && (i = false, o = h + 1), 46 === s ? -1 === r3 ? r3 = h : 1 !== a2 && (a2 = 1) : -1 !== r3 && (a2 = -1);
        else if (!i) {
          n2 = h + 1;
          break;
        }
      }
      return -1 === r3 || -1 === o || 0 === a2 || 1 === a2 && r3 === o - 1 && r3 === n2 + 1 ? "" : t3.slice(r3, o);
    }, format: function(t3) {
      if (null === t3 || "object" != typeof t3)
        throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof t3);
      return function(t4, e3) {
        var r3 = e3.dir || e3.root, n2 = e3.base || (e3.name || "") + (e3.ext || "");
        return r3 ? r3 === e3.root ? r3 + n2 : r3 + "/" + n2 : n2;
      }(0, t3);
    }, parse: function(t3) {
      e2(t3);
      var r3 = { root: "", dir: "", base: "", ext: "", name: "" };
      if (0 === t3.length)
        return r3;
      var n2, o = t3.charCodeAt(0), i = 47 === o;
      i ? (r3.root = "/", n2 = 1) : n2 = 0;
      for (var a2 = -1, h = 0, s = -1, c = true, f2 = t3.length - 1, u = 0; f2 >= n2; --f2)
        if (47 !== (o = t3.charCodeAt(f2)))
          -1 === s && (c = false, s = f2 + 1), 46 === o ? -1 === a2 ? a2 = f2 : 1 !== u && (u = 1) : -1 !== a2 && (u = -1);
        else if (!c) {
          h = f2 + 1;
          break;
        }
      return -1 === a2 || -1 === s || 0 === u || 1 === u && a2 === s - 1 && a2 === h + 1 ? -1 !== s && (r3.base = r3.name = 0 === h && i ? t3.slice(1, s) : t3.slice(h, s)) : (0 === h && i ? (r3.name = t3.slice(1, a2), r3.base = t3.slice(1, s)) : (r3.name = t3.slice(h, a2), r3.base = t3.slice(h, s)), r3.ext = t3.slice(a2, s)), h > 0 ? r3.dir = t3.slice(0, h - 1) : i && (r3.dir = "/"), r3;
    }, sep: "/", delimiter: ":", win32: null, posix: null };
    n.posix = n, t2.exports = n;
  }, 447: (t2, e2, r2) => {
    var n;
    if (r2.r(e2), r2.d(e2, { URI: () => d, Utils: () => P }), "object" == typeof process)
      n = "win32" === process.platform;
    else if ("object" == typeof navigator) {
      var o = navigator.userAgent;
      n = o.indexOf("Windows") >= 0;
    }
    var i, a2, h = (i = function(t3, e3) {
      return (i = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t4, e4) {
        t4.__proto__ = e4;
      } || function(t4, e4) {
        for (var r3 in e4)
          Object.prototype.hasOwnProperty.call(e4, r3) && (t4[r3] = e4[r3]);
      })(t3, e3);
    }, function(t3, e3) {
      if ("function" != typeof e3 && null !== e3)
        throw new TypeError("Class extends value " + String(e3) + " is not a constructor or null");
      function r3() {
        this.constructor = t3;
      }
      i(t3, e3), t3.prototype = null === e3 ? Object.create(e3) : (r3.prototype = e3.prototype, new r3());
    }), s = /^\w[\w\d+.-]*$/, c = /^\//, f2 = /^\/\//;
    function u(t3, e3) {
      if (!t3.scheme && e3)
        throw new Error('[UriError]: Scheme is missing: {scheme: "", authority: "'.concat(t3.authority, '", path: "').concat(t3.path, '", query: "').concat(t3.query, '", fragment: "').concat(t3.fragment, '"}'));
      if (t3.scheme && !s.test(t3.scheme))
        throw new Error("[UriError]: Scheme contains illegal characters.");
      if (t3.path) {
        if (t3.authority) {
          if (!c.test(t3.path))
            throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character');
        } else if (f2.test(t3.path))
          throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")');
      }
    }
    var l = "", p = "/", g = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/, d = function() {
      function t3(t4, e3, r3, n2, o2, i2) {
        void 0 === i2 && (i2 = false), "object" == typeof t4 ? (this.scheme = t4.scheme || l, this.authority = t4.authority || l, this.path = t4.path || l, this.query = t4.query || l, this.fragment = t4.fragment || l) : (this.scheme = function(t5, e4) {
          return t5 || e4 ? t5 : "file";
        }(t4, i2), this.authority = e3 || l, this.path = function(t5, e4) {
          switch (t5) {
            case "https":
            case "http":
            case "file":
              e4 ? e4[0] !== p && (e4 = p + e4) : e4 = p;
          }
          return e4;
        }(this.scheme, r3 || l), this.query = n2 || l, this.fragment = o2 || l, u(this, i2));
      }
      return t3.isUri = function(e3) {
        return e3 instanceof t3 || !!e3 && "string" == typeof e3.authority && "string" == typeof e3.fragment && "string" == typeof e3.path && "string" == typeof e3.query && "string" == typeof e3.scheme && "string" == typeof e3.fsPath && "function" == typeof e3.with && "function" == typeof e3.toString;
      }, Object.defineProperty(t3.prototype, "fsPath", { get: function() {
        return A2(this, false);
      }, enumerable: false, configurable: true }), t3.prototype.with = function(t4) {
        if (!t4)
          return this;
        var e3 = t4.scheme, r3 = t4.authority, n2 = t4.path, o2 = t4.query, i2 = t4.fragment;
        return void 0 === e3 ? e3 = this.scheme : null === e3 && (e3 = l), void 0 === r3 ? r3 = this.authority : null === r3 && (r3 = l), void 0 === n2 ? n2 = this.path : null === n2 && (n2 = l), void 0 === o2 ? o2 = this.query : null === o2 && (o2 = l), void 0 === i2 ? i2 = this.fragment : null === i2 && (i2 = l), e3 === this.scheme && r3 === this.authority && n2 === this.path && o2 === this.query && i2 === this.fragment ? this : new y(e3, r3, n2, o2, i2);
      }, t3.parse = function(t4, e3) {
        void 0 === e3 && (e3 = false);
        var r3 = g.exec(t4);
        return r3 ? new y(r3[2] || l, O(r3[4] || l), O(r3[5] || l), O(r3[7] || l), O(r3[9] || l), e3) : new y(l, l, l, l, l);
      }, t3.file = function(t4) {
        var e3 = l;
        if (n && (t4 = t4.replace(/\\/g, p)), t4[0] === p && t4[1] === p) {
          var r3 = t4.indexOf(p, 2);
          -1 === r3 ? (e3 = t4.substring(2), t4 = p) : (e3 = t4.substring(2, r3), t4 = t4.substring(r3) || p);
        }
        return new y("file", e3, t4, l, l);
      }, t3.from = function(t4) {
        var e3 = new y(t4.scheme, t4.authority, t4.path, t4.query, t4.fragment);
        return u(e3, true), e3;
      }, t3.prototype.toString = function(t4) {
        return void 0 === t4 && (t4 = false), w(this, t4);
      }, t3.prototype.toJSON = function() {
        return this;
      }, t3.revive = function(e3) {
        if (e3) {
          if (e3 instanceof t3)
            return e3;
          var r3 = new y(e3);
          return r3._formatted = e3.external, r3._fsPath = e3._sep === v ? e3.fsPath : null, r3;
        }
        return e3;
      }, t3;
    }(), v = n ? 1 : void 0, y = function(t3) {
      function e3() {
        var e4 = null !== t3 && t3.apply(this, arguments) || this;
        return e4._formatted = null, e4._fsPath = null, e4;
      }
      return h(e3, t3), Object.defineProperty(e3.prototype, "fsPath", { get: function() {
        return this._fsPath || (this._fsPath = A2(this, false)), this._fsPath;
      }, enumerable: false, configurable: true }), e3.prototype.toString = function(t4) {
        return void 0 === t4 && (t4 = false), t4 ? w(this, true) : (this._formatted || (this._formatted = w(this, false)), this._formatted);
      }, e3.prototype.toJSON = function() {
        var t4 = { $mid: 1 };
        return this._fsPath && (t4.fsPath = this._fsPath, t4._sep = v), this._formatted && (t4.external = this._formatted), this.path && (t4.path = this.path), this.scheme && (t4.scheme = this.scheme), this.authority && (t4.authority = this.authority), this.query && (t4.query = this.query), this.fragment && (t4.fragment = this.fragment), t4;
      }, e3;
    }(d), m = ((a2 = {})[58] = "%3A", a2[47] = "%2F", a2[63] = "%3F", a2[35] = "%23", a2[91] = "%5B", a2[93] = "%5D", a2[64] = "%40", a2[33] = "%21", a2[36] = "%24", a2[38] = "%26", a2[39] = "%27", a2[40] = "%28", a2[41] = "%29", a2[42] = "%2A", a2[43] = "%2B", a2[44] = "%2C", a2[59] = "%3B", a2[61] = "%3D", a2[32] = "%20", a2);
    function b(t3, e3) {
      for (var r3 = void 0, n2 = -1, o2 = 0; o2 < t3.length; o2++) {
        var i2 = t3.charCodeAt(o2);
        if (i2 >= 97 && i2 <= 122 || i2 >= 65 && i2 <= 90 || i2 >= 48 && i2 <= 57 || 45 === i2 || 46 === i2 || 95 === i2 || 126 === i2 || e3 && 47 === i2)
          -1 !== n2 && (r3 += encodeURIComponent(t3.substring(n2, o2)), n2 = -1), void 0 !== r3 && (r3 += t3.charAt(o2));
        else {
          void 0 === r3 && (r3 = t3.substr(0, o2));
          var a3 = m[i2];
          void 0 !== a3 ? (-1 !== n2 && (r3 += encodeURIComponent(t3.substring(n2, o2)), n2 = -1), r3 += a3) : -1 === n2 && (n2 = o2);
        }
      }
      return -1 !== n2 && (r3 += encodeURIComponent(t3.substring(n2))), void 0 !== r3 ? r3 : t3;
    }
    function C(t3) {
      for (var e3 = void 0, r3 = 0; r3 < t3.length; r3++) {
        var n2 = t3.charCodeAt(r3);
        35 === n2 || 63 === n2 ? (void 0 === e3 && (e3 = t3.substr(0, r3)), e3 += m[n2]) : void 0 !== e3 && (e3 += t3[r3]);
      }
      return void 0 !== e3 ? e3 : t3;
    }
    function A2(t3, e3) {
      var r3;
      return r3 = t3.authority && t3.path.length > 1 && "file" === t3.scheme ? "//".concat(t3.authority).concat(t3.path) : 47 === t3.path.charCodeAt(0) && (t3.path.charCodeAt(1) >= 65 && t3.path.charCodeAt(1) <= 90 || t3.path.charCodeAt(1) >= 97 && t3.path.charCodeAt(1) <= 122) && 58 === t3.path.charCodeAt(2) ? e3 ? t3.path.substr(1) : t3.path[1].toLowerCase() + t3.path.substr(2) : t3.path, n && (r3 = r3.replace(/\//g, "\\")), r3;
    }
    function w(t3, e3) {
      var r3 = e3 ? C : b, n2 = "", o2 = t3.scheme, i2 = t3.authority, a3 = t3.path, h2 = t3.query, s2 = t3.fragment;
      if (o2 && (n2 += o2, n2 += ":"), (i2 || "file" === o2) && (n2 += p, n2 += p), i2) {
        var c2 = i2.indexOf("@");
        if (-1 !== c2) {
          var f3 = i2.substr(0, c2);
          i2 = i2.substr(c2 + 1), -1 === (c2 = f3.indexOf(":")) ? n2 += r3(f3, false) : (n2 += r3(f3.substr(0, c2), false), n2 += ":", n2 += r3(f3.substr(c2 + 1), false)), n2 += "@";
        }
        -1 === (c2 = (i2 = i2.toLowerCase()).indexOf(":")) ? n2 += r3(i2, false) : (n2 += r3(i2.substr(0, c2), false), n2 += i2.substr(c2));
      }
      if (a3) {
        if (a3.length >= 3 && 47 === a3.charCodeAt(0) && 58 === a3.charCodeAt(2))
          (u2 = a3.charCodeAt(1)) >= 65 && u2 <= 90 && (a3 = "/".concat(String.fromCharCode(u2 + 32), ":").concat(a3.substr(3)));
        else if (a3.length >= 2 && 58 === a3.charCodeAt(1)) {
          var u2;
          (u2 = a3.charCodeAt(0)) >= 65 && u2 <= 90 && (a3 = "".concat(String.fromCharCode(u2 + 32), ":").concat(a3.substr(2)));
        }
        n2 += r3(a3, true);
      }
      return h2 && (n2 += "?", n2 += r3(h2, false)), s2 && (n2 += "#", n2 += e3 ? s2 : b(s2, false)), n2;
    }
    function x(t3) {
      try {
        return decodeURIComponent(t3);
      } catch (e3) {
        return t3.length > 3 ? t3.substr(0, 3) + x(t3.substr(3)) : t3;
      }
    }
    var _ = /(%[0-9A-Za-z][0-9A-Za-z])+/g;
    function O(t3) {
      return t3.match(_) ? t3.replace(_, function(t4) {
        return x(t4);
      }) : t3;
    }
    var P, j = r2(470), U = function(t3, e3, r3) {
      if (r3 || 2 === arguments.length)
        for (var n2, o2 = 0, i2 = e3.length; o2 < i2; o2++)
          !n2 && o2 in e3 || (n2 || (n2 = Array.prototype.slice.call(e3, 0, o2)), n2[o2] = e3[o2]);
      return t3.concat(n2 || Array.prototype.slice.call(e3));
    }, I = j.posix || j;
    !function(t3) {
      t3.joinPath = function(t4) {
        for (var e3 = [], r3 = 1; r3 < arguments.length; r3++)
          e3[r3 - 1] = arguments[r3];
        return t4.with({ path: I.join.apply(I, U([t4.path], e3, false)) });
      }, t3.resolvePath = function(t4) {
        for (var e3 = [], r3 = 1; r3 < arguments.length; r3++)
          e3[r3 - 1] = arguments[r3];
        var n2 = t4.path || "/";
        return t4.with({ path: I.resolve.apply(I, U([n2], e3, false)) });
      }, t3.dirname = function(t4) {
        var e3 = I.dirname(t4.path);
        return 1 === e3.length && 46 === e3.charCodeAt(0) ? t4 : t4.with({ path: e3 });
      }, t3.basename = function(t4) {
        return I.basename(t4.path);
      }, t3.extname = function(t4) {
        return I.extname(t4.path);
      };
    }(P || (P = {}));
  } }, e = {};
  function r(n) {
    if (e[n])
      return e[n].exports;
    var o = e[n] = { exports: {} };
    return t[n](o, o.exports, r), o.exports;
  }
  return r.d = (t2, e2) => {
    for (var n in e2)
      r.o(e2, n) && !r.o(t2, n) && Object.defineProperty(t2, n, { enumerable: true, get: e2[n] });
  }, r.o = (t2, e2) => Object.prototype.hasOwnProperty.call(t2, e2), r.r = (t2) => {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t2, "__esModule", { value: true });
  }, r(447);
})();
var { URI, Utils } = LIB;

// node_modules/vscode-json-languageservice/lib/esm/utils/glob.js
function createRegex(glob, opts) {
  if (typeof glob !== "string") {
    throw new TypeError("Expected a string");
  }
  var str = String(glob);
  var reStr = "";
  var extended = opts ? !!opts.extended : false;
  var globstar = opts ? !!opts.globstar : false;
  var inGroup = false;
  var flags = opts && typeof opts.flags === "string" ? opts.flags : "";
  var c;
  for (var i = 0, len = str.length; i < len; i++) {
    c = str[i];
    switch (c) {
      case "/":
      case "$":
      case "^":
      case "+":
      case ".":
      case "(":
      case ")":
      case "=":
      case "!":
      case "|":
        reStr += "\\" + c;
        break;
      case "?":
        if (extended) {
          reStr += ".";
          break;
        }
      case "[":
      case "]":
        if (extended) {
          reStr += c;
          break;
        }
      case "{":
        if (extended) {
          inGroup = true;
          reStr += "(";
          break;
        }
      case "}":
        if (extended) {
          inGroup = false;
          reStr += ")";
          break;
        }
      case ",":
        if (inGroup) {
          reStr += "|";
          break;
        }
        reStr += "\\" + c;
        break;
      case "*":
        var prevChar = str[i - 1];
        var starCount = 1;
        while (str[i + 1] === "*") {
          starCount++;
          i++;
        }
        var nextChar = str[i + 1];
        if (!globstar) {
          reStr += ".*";
        } else {
          var isGlobstar = starCount > 1 && (prevChar === "/" || prevChar === void 0 || prevChar === "{" || prevChar === ",") && (nextChar === "/" || nextChar === void 0 || nextChar === "," || nextChar === "}");
          if (isGlobstar) {
            if (nextChar === "/") {
              i++;
            } else if (prevChar === "/" && reStr.endsWith("\\/")) {
              reStr = reStr.substr(0, reStr.length - 2);
            }
            reStr += "((?:[^/]*(?:/|$))*)";
          } else {
            reStr += "([^/]*)";
          }
        }
        break;
      default:
        reStr += c;
    }
  }
  if (!flags || !~flags.indexOf("g")) {
    reStr = "^" + reStr + "$";
  }
  return new RegExp(reStr, flags);
}

// node_modules/vscode-json-languageservice/lib/esm/services/jsonSchemaService.js
var localize6 = loadMessageBundle();
var BANG = "!";
var PATH_SEP = "/";
var FilePatternAssociation = function() {
  function FilePatternAssociation2(pattern, uris) {
    this.globWrappers = [];
    try {
      for (var _i = 0, pattern_1 = pattern; _i < pattern_1.length; _i++) {
        var patternString = pattern_1[_i];
        var include = patternString[0] !== BANG;
        if (!include) {
          patternString = patternString.substring(1);
        }
        if (patternString.length > 0) {
          if (patternString[0] === PATH_SEP) {
            patternString = patternString.substring(1);
          }
          this.globWrappers.push({
            regexp: createRegex("**/" + patternString, { extended: true, globstar: true }),
            include
          });
        }
      }
      ;
      this.uris = uris;
    } catch (e) {
      this.globWrappers.length = 0;
      this.uris = [];
    }
  }
  FilePatternAssociation2.prototype.matchesPattern = function(fileName) {
    var match = false;
    for (var _i = 0, _a = this.globWrappers; _i < _a.length; _i++) {
      var _b = _a[_i], regexp = _b.regexp, include = _b.include;
      if (regexp.test(fileName)) {
        match = include;
      }
    }
    return match;
  };
  FilePatternAssociation2.prototype.getURIs = function() {
    return this.uris;
  };
  return FilePatternAssociation2;
}();
var SchemaHandle = function() {
  function SchemaHandle2(service, uri, unresolvedSchemaContent) {
    this.service = service;
    this.uri = uri;
    this.dependencies = /* @__PURE__ */ new Set();
    this.anchors = void 0;
    if (unresolvedSchemaContent) {
      this.unresolvedSchema = this.service.promise.resolve(new UnresolvedSchema(unresolvedSchemaContent));
    }
  }
  SchemaHandle2.prototype.getUnresolvedSchema = function() {
    if (!this.unresolvedSchema) {
      this.unresolvedSchema = this.service.loadSchema(this.uri);
    }
    return this.unresolvedSchema;
  };
  SchemaHandle2.prototype.getResolvedSchema = function() {
    var _this = this;
    if (!this.resolvedSchema) {
      this.resolvedSchema = this.getUnresolvedSchema().then(function(unresolved) {
        return _this.service.resolveSchemaContent(unresolved, _this);
      });
    }
    return this.resolvedSchema;
  };
  SchemaHandle2.prototype.clearSchema = function() {
    var hasChanges = !!this.unresolvedSchema;
    this.resolvedSchema = void 0;
    this.unresolvedSchema = void 0;
    this.dependencies.clear();
    this.anchors = void 0;
    return hasChanges;
  };
  return SchemaHandle2;
}();
var UnresolvedSchema = function() {
  function UnresolvedSchema2(schema, errors) {
    if (errors === void 0) {
      errors = [];
    }
    this.schema = schema;
    this.errors = errors;
  }
  return UnresolvedSchema2;
}();
var ResolvedSchema = function() {
  function ResolvedSchema2(schema, errors) {
    if (errors === void 0) {
      errors = [];
    }
    this.schema = schema;
    this.errors = errors;
  }
  ResolvedSchema2.prototype.getSection = function(path) {
    var schemaRef = this.getSectionRecursive(path, this.schema);
    if (schemaRef) {
      return asSchema(schemaRef);
    }
    return void 0;
  };
  ResolvedSchema2.prototype.getSectionRecursive = function(path, schema) {
    if (!schema || typeof schema === "boolean" || path.length === 0) {
      return schema;
    }
    var next = path.shift();
    if (schema.properties && typeof schema.properties[next]) {
      return this.getSectionRecursive(path, schema.properties[next]);
    } else if (schema.patternProperties) {
      for (var _i = 0, _a = Object.keys(schema.patternProperties); _i < _a.length; _i++) {
        var pattern = _a[_i];
        var regex = extendedRegExp(pattern);
        if (regex === null || regex === void 0 ? void 0 : regex.test(next)) {
          return this.getSectionRecursive(path, schema.patternProperties[pattern]);
        }
      }
    } else if (typeof schema.additionalProperties === "object") {
      return this.getSectionRecursive(path, schema.additionalProperties);
    } else if (next.match("[0-9]+")) {
      if (Array.isArray(schema.items)) {
        var index = parseInt(next, 10);
        if (!isNaN(index) && schema.items[index]) {
          return this.getSectionRecursive(path, schema.items[index]);
        }
      } else if (schema.items) {
        return this.getSectionRecursive(path, schema.items);
      }
    }
    return void 0;
  };
  return ResolvedSchema2;
}();
var JSONSchemaService = function() {
  function JSONSchemaService2(requestService, contextService, promiseConstructor) {
    this.contextService = contextService;
    this.requestService = requestService;
    this.promiseConstructor = promiseConstructor || Promise;
    this.callOnDispose = [];
    this.contributionSchemas = {};
    this.contributionAssociations = [];
    this.schemasById = {};
    this.filePatternAssociations = [];
    this.registeredSchemasIds = {};
  }
  JSONSchemaService2.prototype.getRegisteredSchemaIds = function(filter) {
    return Object.keys(this.registeredSchemasIds).filter(function(id) {
      var scheme = URI.parse(id).scheme;
      return scheme !== "schemaservice" && (!filter || filter(scheme));
    });
  };
  Object.defineProperty(JSONSchemaService2.prototype, "promise", {
    get: function() {
      return this.promiseConstructor;
    },
    enumerable: false,
    configurable: true
  });
  JSONSchemaService2.prototype.dispose = function() {
    while (this.callOnDispose.length > 0) {
      this.callOnDispose.pop()();
    }
  };
  JSONSchemaService2.prototype.onResourceChange = function(uri) {
    var _this = this;
    this.cachedSchemaForResource = void 0;
    var hasChanges = false;
    uri = normalizeId(uri);
    var toWalk = [uri];
    var all = Object.keys(this.schemasById).map(function(key) {
      return _this.schemasById[key];
    });
    while (toWalk.length) {
      var curr = toWalk.pop();
      for (var i = 0; i < all.length; i++) {
        var handle = all[i];
        if (handle && (handle.uri === curr || handle.dependencies.has(curr))) {
          if (handle.uri !== curr) {
            toWalk.push(handle.uri);
          }
          if (handle.clearSchema()) {
            hasChanges = true;
          }
          all[i] = void 0;
        }
      }
    }
    return hasChanges;
  };
  JSONSchemaService2.prototype.setSchemaContributions = function(schemaContributions2) {
    if (schemaContributions2.schemas) {
      var schemas = schemaContributions2.schemas;
      for (var id in schemas) {
        var normalizedId = normalizeId(id);
        this.contributionSchemas[normalizedId] = this.addSchemaHandle(normalizedId, schemas[id]);
      }
    }
    if (Array.isArray(schemaContributions2.schemaAssociations)) {
      var schemaAssociations = schemaContributions2.schemaAssociations;
      for (var _i = 0, schemaAssociations_1 = schemaAssociations; _i < schemaAssociations_1.length; _i++) {
        var schemaAssociation = schemaAssociations_1[_i];
        var uris = schemaAssociation.uris.map(normalizeId);
        var association = this.addFilePatternAssociation(schemaAssociation.pattern, uris);
        this.contributionAssociations.push(association);
      }
    }
  };
  JSONSchemaService2.prototype.addSchemaHandle = function(id, unresolvedSchemaContent) {
    var schemaHandle = new SchemaHandle(this, id, unresolvedSchemaContent);
    this.schemasById[id] = schemaHandle;
    return schemaHandle;
  };
  JSONSchemaService2.prototype.getOrAddSchemaHandle = function(id, unresolvedSchemaContent) {
    return this.schemasById[id] || this.addSchemaHandle(id, unresolvedSchemaContent);
  };
  JSONSchemaService2.prototype.addFilePatternAssociation = function(pattern, uris) {
    var fpa = new FilePatternAssociation(pattern, uris);
    this.filePatternAssociations.push(fpa);
    return fpa;
  };
  JSONSchemaService2.prototype.registerExternalSchema = function(uri, filePatterns, unresolvedSchemaContent) {
    var id = normalizeId(uri);
    this.registeredSchemasIds[id] = true;
    this.cachedSchemaForResource = void 0;
    if (filePatterns) {
      this.addFilePatternAssociation(filePatterns, [id]);
    }
    return unresolvedSchemaContent ? this.addSchemaHandle(id, unresolvedSchemaContent) : this.getOrAddSchemaHandle(id);
  };
  JSONSchemaService2.prototype.clearExternalSchemas = function() {
    this.schemasById = {};
    this.filePatternAssociations = [];
    this.registeredSchemasIds = {};
    this.cachedSchemaForResource = void 0;
    for (var id in this.contributionSchemas) {
      this.schemasById[id] = this.contributionSchemas[id];
      this.registeredSchemasIds[id] = true;
    }
    for (var _i = 0, _a = this.contributionAssociations; _i < _a.length; _i++) {
      var contributionAssociation = _a[_i];
      this.filePatternAssociations.push(contributionAssociation);
    }
  };
  JSONSchemaService2.prototype.getResolvedSchema = function(schemaId) {
    var id = normalizeId(schemaId);
    var schemaHandle = this.schemasById[id];
    if (schemaHandle) {
      return schemaHandle.getResolvedSchema();
    }
    return this.promise.resolve(void 0);
  };
  JSONSchemaService2.prototype.loadSchema = function(url) {
    if (!this.requestService) {
      var errorMessage = localize6("json.schema.norequestservice", "Unable to load schema from '{0}'. No schema request service available", toDisplayString(url));
      return this.promise.resolve(new UnresolvedSchema({}, [errorMessage]));
    }
    return this.requestService(url).then(function(content) {
      if (!content) {
        var errorMessage2 = localize6("json.schema.nocontent", "Unable to load schema from '{0}': No content.", toDisplayString(url));
        return new UnresolvedSchema({}, [errorMessage2]);
      }
      var schemaContent = {};
      var jsonErrors = [];
      schemaContent = parse2(content, jsonErrors);
      var errors = jsonErrors.length ? [localize6("json.schema.invalidFormat", "Unable to parse content from '{0}': Parse error at offset {1}.", toDisplayString(url), jsonErrors[0].offset)] : [];
      return new UnresolvedSchema(schemaContent, errors);
    }, function(error) {
      var errorMessage2 = error.toString();
      var errorSplit = error.toString().split("Error: ");
      if (errorSplit.length > 1) {
        errorMessage2 = errorSplit[1];
      }
      if (endsWith(errorMessage2, ".")) {
        errorMessage2 = errorMessage2.substr(0, errorMessage2.length - 1);
      }
      return new UnresolvedSchema({}, [localize6("json.schema.nocontent", "Unable to load schema from '{0}': {1}.", toDisplayString(url), errorMessage2)]);
    });
  };
  JSONSchemaService2.prototype.resolveSchemaContent = function(schemaToResolve, handle) {
    var _this = this;
    var resolveErrors = schemaToResolve.errors.slice(0);
    var schema = schemaToResolve.schema;
    if (schema.$schema) {
      var id = normalizeId(schema.$schema);
      if (id === "http://json-schema.org/draft-03/schema") {
        return this.promise.resolve(new ResolvedSchema({}, [localize6("json.schema.draft03.notsupported", "Draft-03 schemas are not supported.")]));
      } else if (id === "https://json-schema.org/draft/2019-09/schema") {
        resolveErrors.push(localize6("json.schema.draft201909.notsupported", "Draft 2019-09 schemas are not yet fully supported."));
      } else if (id === "https://json-schema.org/draft/2020-12/schema") {
        resolveErrors.push(localize6("json.schema.draft202012.notsupported", "Draft 2020-12 schemas are not yet fully supported."));
      }
    }
    var contextService = this.contextService;
    var findSectionByJSONPointer = function(schema2, path) {
      path = decodeURIComponent(path);
      var current = schema2;
      if (path[0] === "/") {
        path = path.substring(1);
      }
      path.split("/").some(function(part) {
        part = part.replace(/~1/g, "/").replace(/~0/g, "~");
        current = current[part];
        return !current;
      });
      return current;
    };
    var findSchemaById = function(schema2, handle2, id2) {
      if (!handle2.anchors) {
        handle2.anchors = collectAnchors(schema2);
      }
      return handle2.anchors.get(id2);
    };
    var merge = function(target, section) {
      for (var key in section) {
        if (section.hasOwnProperty(key) && !target.hasOwnProperty(key) && key !== "id" && key !== "$id") {
          target[key] = section[key];
        }
      }
    };
    var mergeRef = function(target, sourceRoot, sourceHandle, refSegment) {
      var section;
      if (refSegment === void 0 || refSegment.length === 0) {
        section = sourceRoot;
      } else if (refSegment.charAt(0) === "/") {
        section = findSectionByJSONPointer(sourceRoot, refSegment);
      } else {
        section = findSchemaById(sourceRoot, sourceHandle, refSegment);
      }
      if (section) {
        merge(target, section);
      } else {
        resolveErrors.push(localize6("json.schema.invalidid", "$ref '{0}' in '{1}' can not be resolved.", refSegment, sourceHandle.uri));
      }
    };
    var resolveExternalLink = function(node, uri, refSegment, parentHandle) {
      if (contextService && !/^[A-Za-z][A-Za-z0-9+\-.+]*:\/\/.*/.test(uri)) {
        uri = contextService.resolveRelativePath(uri, parentHandle.uri);
      }
      uri = normalizeId(uri);
      var referencedHandle = _this.getOrAddSchemaHandle(uri);
      return referencedHandle.getUnresolvedSchema().then(function(unresolvedSchema) {
        parentHandle.dependencies.add(uri);
        if (unresolvedSchema.errors.length) {
          var loc = refSegment ? uri + "#" + refSegment : uri;
          resolveErrors.push(localize6("json.schema.problemloadingref", "Problems loading reference '{0}': {1}", loc, unresolvedSchema.errors[0]));
        }
        mergeRef(node, unresolvedSchema.schema, referencedHandle, refSegment);
        return resolveRefs(node, unresolvedSchema.schema, referencedHandle);
      });
    };
    var resolveRefs = function(node, parentSchema, parentHandle) {
      var openPromises = [];
      _this.traverseNodes(node, function(next) {
        var seenRefs = /* @__PURE__ */ new Set();
        while (next.$ref) {
          var ref = next.$ref;
          var segments = ref.split("#", 2);
          delete next.$ref;
          if (segments[0].length > 0) {
            openPromises.push(resolveExternalLink(next, segments[0], segments[1], parentHandle));
            return;
          } else {
            if (!seenRefs.has(ref)) {
              var id2 = segments[1];
              mergeRef(next, parentSchema, parentHandle, id2);
              seenRefs.add(ref);
            }
          }
        }
      });
      return _this.promise.all(openPromises);
    };
    var collectAnchors = function(root) {
      var result = /* @__PURE__ */ new Map();
      _this.traverseNodes(root, function(next) {
        var id2 = next.$id || next.id;
        if (typeof id2 === "string" && id2.charAt(0) === "#") {
          var anchor = id2.substring(1);
          if (result.has(anchor)) {
            resolveErrors.push(localize6("json.schema.duplicateid", "Duplicate id declaration: '{0}'", id2));
          } else {
            result.set(anchor, next);
          }
        }
      });
      return result;
    };
    return resolveRefs(schema, schema, handle).then(function(_) {
      return new ResolvedSchema(schema, resolveErrors);
    });
  };
  JSONSchemaService2.prototype.traverseNodes = function(root, handle) {
    if (!root || typeof root !== "object") {
      return Promise.resolve(null);
    }
    var seen = /* @__PURE__ */ new Set();
    var collectEntries = function() {
      var entries = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        entries[_i] = arguments[_i];
      }
      for (var _a = 0, entries_1 = entries; _a < entries_1.length; _a++) {
        var entry = entries_1[_a];
        if (typeof entry === "object") {
          toWalk.push(entry);
        }
      }
    };
    var collectMapEntries = function() {
      var maps = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        maps[_i] = arguments[_i];
      }
      for (var _a = 0, maps_1 = maps; _a < maps_1.length; _a++) {
        var map = maps_1[_a];
        if (typeof map === "object") {
          for (var k in map) {
            var key = k;
            var entry = map[key];
            if (typeof entry === "object") {
              toWalk.push(entry);
            }
          }
        }
      }
    };
    var collectArrayEntries = function() {
      var arrays = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        arrays[_i] = arguments[_i];
      }
      for (var _a = 0, arrays_1 = arrays; _a < arrays_1.length; _a++) {
        var array = arrays_1[_a];
        if (Array.isArray(array)) {
          for (var _b = 0, array_1 = array; _b < array_1.length; _b++) {
            var entry = array_1[_b];
            if (typeof entry === "object") {
              toWalk.push(entry);
            }
          }
        }
      }
    };
    var toWalk = [root];
    var next = toWalk.pop();
    while (next) {
      if (!seen.has(next)) {
        seen.add(next);
        handle(next);
        collectEntries(next.items, next.additionalItems, next.additionalProperties, next.not, next.contains, next.propertyNames, next.if, next.then, next.else);
        collectMapEntries(next.definitions, next.properties, next.patternProperties, next.dependencies);
        collectArrayEntries(next.anyOf, next.allOf, next.oneOf, next.items);
      }
      next = toWalk.pop();
    }
  };
  ;
  JSONSchemaService2.prototype.getSchemaFromProperty = function(resource, document) {
    var _a, _b;
    if (((_a = document.root) === null || _a === void 0 ? void 0 : _a.type) === "object") {
      for (var _i = 0, _c = document.root.properties; _i < _c.length; _i++) {
        var p = _c[_i];
        if (p.keyNode.value === "$schema" && ((_b = p.valueNode) === null || _b === void 0 ? void 0 : _b.type) === "string") {
          var schemaId = p.valueNode.value;
          if (this.contextService && !/^\w[\w\d+.-]*:/.test(schemaId)) {
            schemaId = this.contextService.resolveRelativePath(schemaId, resource);
          }
          return schemaId;
        }
      }
    }
    return void 0;
  };
  JSONSchemaService2.prototype.getAssociatedSchemas = function(resource) {
    var seen = /* @__PURE__ */ Object.create(null);
    var schemas = [];
    var normalizedResource = normalizeResourceForMatching(resource);
    for (var _i = 0, _a = this.filePatternAssociations; _i < _a.length; _i++) {
      var entry = _a[_i];
      if (entry.matchesPattern(normalizedResource)) {
        for (var _b = 0, _c = entry.getURIs(); _b < _c.length; _b++) {
          var schemaId = _c[_b];
          if (!seen[schemaId]) {
            schemas.push(schemaId);
            seen[schemaId] = true;
          }
        }
      }
    }
    return schemas;
  };
  JSONSchemaService2.prototype.getSchemaURIsForResource = function(resource, document) {
    var schemeId = document && this.getSchemaFromProperty(resource, document);
    if (schemeId) {
      return [schemeId];
    }
    return this.getAssociatedSchemas(resource);
  };
  JSONSchemaService2.prototype.getSchemaForResource = function(resource, document) {
    if (document) {
      var schemeId = this.getSchemaFromProperty(resource, document);
      if (schemeId) {
        var id = normalizeId(schemeId);
        return this.getOrAddSchemaHandle(id).getResolvedSchema();
      }
    }
    if (this.cachedSchemaForResource && this.cachedSchemaForResource.resource === resource) {
      return this.cachedSchemaForResource.resolvedSchema;
    }
    var schemas = this.getAssociatedSchemas(resource);
    var resolvedSchema = schemas.length > 0 ? this.createCombinedSchema(resource, schemas).getResolvedSchema() : this.promise.resolve(void 0);
    this.cachedSchemaForResource = { resource, resolvedSchema };
    return resolvedSchema;
  };
  JSONSchemaService2.prototype.createCombinedSchema = function(resource, schemaIds) {
    if (schemaIds.length === 1) {
      return this.getOrAddSchemaHandle(schemaIds[0]);
    } else {
      var combinedSchemaId = "schemaservice://combinedSchema/" + encodeURIComponent(resource);
      var combinedSchema = {
        allOf: schemaIds.map(function(schemaId) {
          return { $ref: schemaId };
        })
      };
      return this.addSchemaHandle(combinedSchemaId, combinedSchema);
    }
  };
  JSONSchemaService2.prototype.getMatchingSchemas = function(document, jsonDocument, schema) {
    if (schema) {
      var id = schema.id || "schemaservice://untitled/matchingSchemas/" + idCounter2++;
      var handle = this.addSchemaHandle(id, schema);
      return handle.getResolvedSchema().then(function(resolvedSchema) {
        return jsonDocument.getMatchingSchemas(resolvedSchema.schema).filter(function(s) {
          return !s.inverted;
        });
      });
    }
    return this.getSchemaForResource(document.uri, jsonDocument).then(function(schema2) {
      if (schema2) {
        return jsonDocument.getMatchingSchemas(schema2.schema).filter(function(s) {
          return !s.inverted;
        });
      }
      return [];
    });
  };
  return JSONSchemaService2;
}();
var idCounter2 = 0;
function normalizeId(id) {
  try {
    return URI.parse(id).toString(true);
  } catch (e) {
    return id;
  }
}
function normalizeResourceForMatching(resource) {
  try {
    return URI.parse(resource).with({ fragment: null, query: null }).toString(true);
  } catch (e) {
    return resource;
  }
}
function toDisplayString(url) {
  try {
    var uri = URI.parse(url);
    if (uri.scheme === "file") {
      return uri.fsPath;
    }
  } catch (e) {
  }
  return url;
}

// node_modules/vscode-json-languageservice/lib/esm/services/jsonFolding.js
function getFoldingRanges(document, context) {
  var ranges = [];
  var nestingLevels = [];
  var stack = [];
  var prevStart = -1;
  var scanner = createScanner2(document.getText(), false);
  var token = scanner.scan();
  function addRange(range2) {
    ranges.push(range2);
    nestingLevels.push(stack.length);
  }
  while (token !== 17) {
    switch (token) {
      case 1:
      case 3: {
        var startLine = document.positionAt(scanner.getTokenOffset()).line;
        var range = { startLine, endLine: startLine, kind: token === 1 ? "object" : "array" };
        stack.push(range);
        break;
      }
      case 2:
      case 4: {
        var kind = token === 2 ? "object" : "array";
        if (stack.length > 0 && stack[stack.length - 1].kind === kind) {
          var range = stack.pop();
          var line = document.positionAt(scanner.getTokenOffset()).line;
          if (range && line > range.startLine + 1 && prevStart !== range.startLine) {
            range.endLine = line - 1;
            addRange(range);
            prevStart = range.startLine;
          }
        }
        break;
      }
      case 13: {
        var startLine = document.positionAt(scanner.getTokenOffset()).line;
        var endLine = document.positionAt(scanner.getTokenOffset() + scanner.getTokenLength()).line;
        if (scanner.getTokenError() === 1 && startLine + 1 < document.lineCount) {
          scanner.setPosition(document.offsetAt(Position.create(startLine + 1, 0)));
        } else {
          if (startLine < endLine) {
            addRange({ startLine, endLine, kind: FoldingRangeKind.Comment });
            prevStart = startLine;
          }
        }
        break;
      }
      case 12: {
        var text = document.getText().substr(scanner.getTokenOffset(), scanner.getTokenLength());
        var m = text.match(/^\/\/\s*#(region\b)|(endregion\b)/);
        if (m) {
          var line = document.positionAt(scanner.getTokenOffset()).line;
          if (m[1]) {
            var range = { startLine: line, endLine: line, kind: FoldingRangeKind.Region };
            stack.push(range);
          } else {
            var i = stack.length - 1;
            while (i >= 0 && stack[i].kind !== FoldingRangeKind.Region) {
              i--;
            }
            if (i >= 0) {
              var range = stack[i];
              stack.length = i;
              if (line > range.startLine && prevStart !== range.startLine) {
                range.endLine = line;
                addRange(range);
                prevStart = range.startLine;
              }
            }
          }
        }
        break;
      }
    }
    token = scanner.scan();
  }
  var rangeLimit = context && context.rangeLimit;
  if (typeof rangeLimit !== "number" || ranges.length <= rangeLimit) {
    return ranges;
  }
  if (context && context.onRangeLimitExceeded) {
    context.onRangeLimitExceeded(document.uri);
  }
  var counts = [];
  for (var _i = 0, nestingLevels_1 = nestingLevels; _i < nestingLevels_1.length; _i++) {
    var level = nestingLevels_1[_i];
    if (level < 30) {
      counts[level] = (counts[level] || 0) + 1;
    }
  }
  var entries = 0;
  var maxLevel = 0;
  for (var i = 0; i < counts.length; i++) {
    var n = counts[i];
    if (n) {
      if (n + entries > rangeLimit) {
        maxLevel = i;
        break;
      }
      entries += n;
    }
  }
  var result = [];
  for (var i = 0; i < ranges.length; i++) {
    var level = nestingLevels[i];
    if (typeof level === "number") {
      if (level < maxLevel || level === maxLevel && entries++ < rangeLimit) {
        result.push(ranges[i]);
      }
    }
  }
  return result;
}

// node_modules/vscode-json-languageservice/lib/esm/services/jsonSelectionRanges.js
function getSelectionRanges(document, positions, doc) {
  function getSelectionRange(position) {
    var offset = document.offsetAt(position);
    var node = doc.getNodeFromOffset(offset, true);
    var result = [];
    while (node) {
      switch (node.type) {
        case "string":
        case "object":
        case "array":
          var cStart = node.offset + 1, cEnd = node.offset + node.length - 1;
          if (cStart < cEnd && offset >= cStart && offset <= cEnd) {
            result.push(newRange(cStart, cEnd));
          }
          result.push(newRange(node.offset, node.offset + node.length));
          break;
        case "number":
        case "boolean":
        case "null":
        case "property":
          result.push(newRange(node.offset, node.offset + node.length));
          break;
      }
      if (node.type === "property" || node.parent && node.parent.type === "array") {
        var afterCommaOffset = getOffsetAfterNextToken(node.offset + node.length, 5);
        if (afterCommaOffset !== -1) {
          result.push(newRange(node.offset, afterCommaOffset));
        }
      }
      node = node.parent;
    }
    var current = void 0;
    for (var index = result.length - 1; index >= 0; index--) {
      current = SelectionRange.create(result[index], current);
    }
    if (!current) {
      current = SelectionRange.create(Range.create(position, position));
    }
    return current;
  }
  function newRange(start, end) {
    return Range.create(document.positionAt(start), document.positionAt(end));
  }
  var scanner = createScanner2(document.getText(), true);
  function getOffsetAfterNextToken(offset, expectedToken) {
    scanner.setPosition(offset);
    var token = scanner.scan();
    if (token === expectedToken) {
      return scanner.getTokenOffset() + scanner.getTokenLength();
    }
    return -1;
  }
  return positions.map(getSelectionRange);
}

// node_modules/vscode-json-languageservice/lib/esm/services/jsonLinks.js
function findLinks(document, doc) {
  var links = [];
  doc.visit(function(node) {
    var _a;
    if (node.type === "property" && node.keyNode.value === "$ref" && ((_a = node.valueNode) === null || _a === void 0 ? void 0 : _a.type) === "string") {
      var path = node.valueNode.value;
      var targetNode = findTargetNode(doc, path);
      if (targetNode) {
        var targetPos = document.positionAt(targetNode.offset);
        links.push({
          target: "".concat(document.uri, "#").concat(targetPos.line + 1, ",").concat(targetPos.character + 1),
          range: createRange(document, node.valueNode)
        });
      }
    }
    return true;
  });
  return Promise.resolve(links);
}
function createRange(document, node) {
  return Range.create(document.positionAt(node.offset + 1), document.positionAt(node.offset + node.length - 1));
}
function findTargetNode(doc, path) {
  var tokens = parseJSONPointer(path);
  if (!tokens) {
    return null;
  }
  return findNode(tokens, doc.root);
}
function findNode(pointer, node) {
  if (!node) {
    return null;
  }
  if (pointer.length === 0) {
    return node;
  }
  var token = pointer.shift();
  if (node && node.type === "object") {
    var propertyNode = node.properties.find(function(propertyNode2) {
      return propertyNode2.keyNode.value === token;
    });
    if (!propertyNode) {
      return null;
    }
    return findNode(pointer, propertyNode.valueNode);
  } else if (node && node.type === "array") {
    if (token.match(/^(0|[1-9][0-9]*)$/)) {
      var index = Number.parseInt(token);
      var arrayItem = node.items[index];
      if (!arrayItem) {
        return null;
      }
      return findNode(pointer, arrayItem);
    }
  }
  return null;
}
function parseJSONPointer(path) {
  if (path === "#") {
    return [];
  }
  if (path[0] !== "#" || path[1] !== "/") {
    return null;
  }
  return path.substring(2).split(/\//).map(unescape);
}
function unescape(str) {
  return str.replace(/~1/g, "/").replace(/~0/g, "~");
}

// node_modules/vscode-json-languageservice/lib/esm/jsonLanguageService.js
function getLanguageService(params) {
  var promise = params.promiseConstructor || Promise;
  var jsonSchemaService = new JSONSchemaService(params.schemaRequestService, params.workspaceContext, promise);
  jsonSchemaService.setSchemaContributions(schemaContributions);
  var jsonCompletion = new JSONCompletion(jsonSchemaService, params.contributions, promise, params.clientCapabilities);
  var jsonHover = new JSONHover(jsonSchemaService, params.contributions, promise);
  var jsonDocumentSymbols = new JSONDocumentSymbols(jsonSchemaService);
  var jsonValidation = new JSONValidation(jsonSchemaService, promise);
  return {
    configure: function(settings) {
      jsonSchemaService.clearExternalSchemas();
      if (settings.schemas) {
        settings.schemas.forEach(function(settings2) {
          jsonSchemaService.registerExternalSchema(settings2.uri, settings2.fileMatch, settings2.schema);
        });
      }
      jsonValidation.configure(settings);
    },
    resetSchema: function(uri) {
      return jsonSchemaService.onResourceChange(uri);
    },
    doValidation: jsonValidation.doValidation.bind(jsonValidation),
    getLanguageStatus: jsonValidation.getLanguageStatus.bind(jsonValidation),
    parseJSONDocument: function(document) {
      return parse3(document, { collectComments: true });
    },
    newJSONDocument: function(root, diagnostics) {
      return newJSONDocument(root, diagnostics);
    },
    getMatchingSchemas: jsonSchemaService.getMatchingSchemas.bind(jsonSchemaService),
    doResolve: jsonCompletion.doResolve.bind(jsonCompletion),
    doComplete: jsonCompletion.doComplete.bind(jsonCompletion),
    findDocumentSymbols: jsonDocumentSymbols.findDocumentSymbols.bind(jsonDocumentSymbols),
    findDocumentSymbols2: jsonDocumentSymbols.findDocumentSymbols2.bind(jsonDocumentSymbols),
    findDocumentColors: jsonDocumentSymbols.findDocumentColors.bind(jsonDocumentSymbols),
    getColorPresentations: jsonDocumentSymbols.getColorPresentations.bind(jsonDocumentSymbols),
    doHover: jsonHover.doHover.bind(jsonHover),
    getFoldingRanges,
    getSelectionRanges,
    findDefinition: function() {
      return Promise.resolve([]);
    },
    findLinks,
    format: function(d, r, o) {
      var range = void 0;
      if (r) {
        var offset = d.offsetAt(r.start);
        var length = d.offsetAt(r.end) - offset;
        range = { offset, length };
      }
      var options = { tabSize: o ? o.tabSize : 4, insertSpaces: (o === null || o === void 0 ? void 0 : o.insertSpaces) === true, insertFinalNewline: (o === null || o === void 0 ? void 0 : o.insertFinalNewline) === true, eol: "\n" };
      return format2(d.getText(), range, options).map(function(e) {
        return TextEdit.replace(Range.create(d.positionAt(e.offset), d.positionAt(e.offset + e.length)), e.content);
      });
    }
  };
}

// src/language/json/jsonWorker.ts
var defaultSchemaRequestService;
if (typeof fetch !== "undefined") {
  defaultSchemaRequestService = function(url) {
    return fetch(url).then((response) => response.text());
  };
}
var JSONWorker = class {
  _ctx;
  _languageService;
  _languageSettings;
  _languageId;
  constructor(ctx, createData) {
    this._ctx = ctx;
    this._languageSettings = createData.languageSettings;
    this._languageId = createData.languageId;
    this._languageService = getLanguageService({
      workspaceContext: {
        resolveRelativePath: (relativePath, resource) => {
          const base = resource.substr(0, resource.lastIndexOf("/") + 1);
          return resolvePath(base, relativePath);
        }
      },
      schemaRequestService: createData.enableSchemaRequest ? defaultSchemaRequestService : void 0
    });
    this._languageService.configure(this._languageSettings);
  }
  async doValidation(uri) {
    let document = this._getTextDocument(uri);
    if (document) {
      let jsonDocument = this._languageService.parseJSONDocument(document);
      return this._languageService.doValidation(document, jsonDocument, this._languageSettings);
    }
    return Promise.resolve([]);
  }
  async doComplete(uri, position) {
    let document = this._getTextDocument(uri);
    if (!document) {
      return null;
    }
    let jsonDocument = this._languageService.parseJSONDocument(document);
    return this._languageService.doComplete(document, position, jsonDocument);
  }
  async doResolve(item) {
    return this._languageService.doResolve(item);
  }
  async doHover(uri, position) {
    let document = this._getTextDocument(uri);
    if (!document) {
      return null;
    }
    let jsonDocument = this._languageService.parseJSONDocument(document);
    return this._languageService.doHover(document, position, jsonDocument);
  }
  async format(uri, range, options) {
    let document = this._getTextDocument(uri);
    if (!document) {
      return [];
    }
    let textEdits = this._languageService.format(document, range, options);
    return Promise.resolve(textEdits);
  }
  async resetSchema(uri) {
    return Promise.resolve(this._languageService.resetSchema(uri));
  }
  async findDocumentSymbols(uri) {
    let document = this._getTextDocument(uri);
    if (!document) {
      return [];
    }
    let jsonDocument = this._languageService.parseJSONDocument(document);
    let symbols = this._languageService.findDocumentSymbols(document, jsonDocument);
    return Promise.resolve(symbols);
  }
  async findDocumentColors(uri) {
    let document = this._getTextDocument(uri);
    if (!document) {
      return [];
    }
    let jsonDocument = this._languageService.parseJSONDocument(document);
    let colorSymbols = this._languageService.findDocumentColors(document, jsonDocument);
    return Promise.resolve(colorSymbols);
  }
  async getColorPresentations(uri, color, range) {
    let document = this._getTextDocument(uri);
    if (!document) {
      return [];
    }
    let jsonDocument = this._languageService.parseJSONDocument(document);
    let colorPresentations = this._languageService.getColorPresentations(document, jsonDocument, color, range);
    return Promise.resolve(colorPresentations);
  }
  async getFoldingRanges(uri, context) {
    let document = this._getTextDocument(uri);
    if (!document) {
      return [];
    }
    let ranges = this._languageService.getFoldingRanges(document, context);
    return Promise.resolve(ranges);
  }
  async getSelectionRanges(uri, positions) {
    let document = this._getTextDocument(uri);
    if (!document) {
      return [];
    }
    let jsonDocument = this._languageService.parseJSONDocument(document);
    let ranges = this._languageService.getSelectionRanges(document, positions, jsonDocument);
    return Promise.resolve(ranges);
  }
  _getTextDocument(uri) {
    let models = this._ctx.getMirrorModels();
    for (let model of models) {
      if (model.uri.toString() === uri) {
        return TextDocument2.create(uri, this._languageId, model.version, model.getValue());
      }
    }
    return null;
  }
};
var Slash = "/".charCodeAt(0);
var Dot = ".".charCodeAt(0);
function isAbsolutePath(path) {
  return path.charCodeAt(0) === Slash;
}
function resolvePath(uriString, path) {
  if (isAbsolutePath(path)) {
    const uri = URI.parse(uriString);
    const parts = path.split("/");
    return uri.with({ path: normalizePath(parts) }).toString();
  }
  return joinPath(uriString, path);
}
function normalizePath(parts) {
  const newParts = [];
  for (const part of parts) {
    if (part.length === 0 || part.length === 1 && part.charCodeAt(0) === Dot) {
    } else if (part.length === 2 && part.charCodeAt(0) === Dot && part.charCodeAt(1) === Dot) {
      newParts.pop();
    } else {
      newParts.push(part);
    }
  }
  if (parts.length > 1 && parts[parts.length - 1].length === 0) {
    newParts.push("");
  }
  let res = newParts.join("/");
  if (parts[0].length === 0) {
    res = "/" + res;
  }
  return res;
}
function joinPath(uriString, ...paths) {
  const uri = URI.parse(uriString);
  const parts = uri.path.split("/");
  for (let path of paths) {
    parts.push(...path.split("/"));
  }
  return uri.with({ path: normalizePath(parts) }).toString();
}

// src/language/json/json.worker.ts
self.onmessage = () => {
  worker.initialize((ctx, createData) => {
    return new JSONWorker(ctx, createData);
  });
};
