
// https://github.com/TypeStrong/typedoc/blob/master/src/lib/models/reflections/abstract.ts#L37
var ReflectionKind = {
    Global: 0,
    ExternalModule: 1,
    Module: 2,
    Enum: 4,
    EnumMember: 16,
    Variable: 32,
    Function: 64,
    Class: 128,
    Interface: 256,
    Constructor: 512,
    Property: 1024,
    Method: 2048,
    CallSignature: 4096,
    IndexSignature: 8192,
    ConstructorSignature: 16384,
    Parameter: 32768,
    TypeLiteral: 65536,
    TypeParameter: 131072,
    Accessor: 262144,
    GetSignature: 524288,
    SetSignature: 1048576,
    ObjectLiteral: 2097152,
    TypeAlias: 4194304,
    Event: 8388608,
}
// https://github.com/TypeStrong/typedoc/blob/master/src/lib/converter/plugins/GroupPlugin.ts#L20
var WEIGHTS = [
    ReflectionKind.Global,
    ReflectionKind.ExternalModule,
    ReflectionKind.Module,

    ReflectionKind.Function,
    ReflectionKind.Variable,

    ReflectionKind.Enum,
    ReflectionKind.EnumMember,
    ReflectionKind.Class,
    ReflectionKind.Interface,
    ReflectionKind.TypeAlias,

    ReflectionKind.Constructor,
    ReflectionKind.Event,
    ReflectionKind.Property,
    ReflectionKind.Accessor,
    ReflectionKind.Method,
    ReflectionKind.ObjectLiteral,

    ReflectionKind.Parameter,
    ReflectionKind.TypeParameter,
    ReflectionKind.TypeLiteral,
    ReflectionKind.CallSignature,
    ReflectionKind.ConstructorSignature,
    ReflectionKind.IndexSignature,
    ReflectionKind.GetSignature,
    ReflectionKind.SetSignature,
];

// https://github.com/TypeStrong/typedoc/blob/master/src/lib/converter/plugins/GroupPlugin.ts#L235
function sortFunc(a, b) {
    var aWeight = WEIGHTS.indexOf(a.kind);
    var bWeight = WEIGHTS.indexOf(b.kind);
    if (aWeight == bWeight) {
        if (a.flags.isStatic && !b.flags.isStatic) return 1;
        if (!a.flags.isStatic && b.flags.isStatic) return -1;
        if (a.name == b.name) return 0;
        return a.name > b.name ? 1 : -1;
    } else return aWeight - bWeight;
}
module.exports = {
  sortModelGroups: function ( model ) {
    if (model.groups) {
      model.groups.sort(sortFunc);
    }
  }
}