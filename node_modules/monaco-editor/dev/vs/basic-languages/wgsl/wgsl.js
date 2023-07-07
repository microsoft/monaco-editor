"use strict";
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.40.0(83b3cf23ca80c94cccca7c5b3e48351b220f8e35)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/wgsl/wgsl", ["require"],(require)=>{
var moduleExports = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/basic-languages/wgsl/wgsl.ts
  var wgsl_exports = {};
  __export(wgsl_exports, {
    conf: () => conf,
    language: () => language
  });
  var conf = {
    comments: {
      lineComment: "//",
      blockComment: ["/*", "*/"]
    },
    brackets: [
      ["{", "}"],
      ["[", "]"],
      ["(", ")"]
    ],
    autoClosingPairs: [
      { open: "[", close: "]" },
      { open: "{", close: "}" },
      { open: "(", close: ")" }
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" }
    ]
  };
  function qw(str) {
    let result = [];
    const words = str.split(/\t+|\r+|\n+| +/);
    for (let i = 0; i < words.length; ++i) {
      if (words[i].length > 0) {
        result.push(words[i]);
      }
    }
    return result;
  }
  var atoms = qw("true false");
  var keywords = qw(`
			  alias
			  break
			  case
			  const
			  const_assert
			  continue
			  continuing
			  default
			  diagnostic
			  discard
			  else
			  enable
			  fn
			  for
			  if
			  let
			  loop
			  override
			  requires
			  return
			  struct
			  switch
			  var
			  while
			  `);
  var reserved = qw(`
			  NULL
			  Self
			  abstract
			  active
			  alignas
			  alignof
			  as
			  asm
			  asm_fragment
			  async
			  attribute
			  auto
			  await
			  become
			  binding_array
			  cast
			  catch
			  class
			  co_await
			  co_return
			  co_yield
			  coherent
			  column_major
			  common
			  compile
			  compile_fragment
			  concept
			  const_cast
			  consteval
			  constexpr
			  constinit
			  crate
			  debugger
			  decltype
			  delete
			  demote
			  demote_to_helper
			  do
			  dynamic_cast
			  enum
			  explicit
			  export
			  extends
			  extern
			  external
			  fallthrough
			  filter
			  final
			  finally
			  friend
			  from
			  fxgroup
			  get
			  goto
			  groupshared
			  highp
			  impl
			  implements
			  import
			  inline
			  instanceof
			  interface
			  layout
			  lowp
			  macro
			  macro_rules
			  match
			  mediump
			  meta
			  mod
			  module
			  move
			  mut
			  mutable
			  namespace
			  new
			  nil
			  noexcept
			  noinline
			  nointerpolation
			  noperspective
			  null
			  nullptr
			  of
			  operator
			  package
			  packoffset
			  partition
			  pass
			  patch
			  pixelfragment
			  precise
			  precision
			  premerge
			  priv
			  protected
			  pub
			  public
			  readonly
			  ref
			  regardless
			  register
			  reinterpret_cast
			  require
			  resource
			  restrict
			  self
			  set
			  shared
			  sizeof
			  smooth
			  snorm
			  static
			  static_assert
			  static_cast
			  std
			  subroutine
			  super
			  target
			  template
			  this
			  thread_local
			  throw
			  trait
			  try
			  type
			  typedef
			  typeid
			  typename
			  typeof
			  union
			  unless
			  unorm
			  unsafe
			  unsized
			  use
			  using
			  varying
			  virtual
			  volatile
			  wgsl
			  where
			  with
			  writeonly
			  yield
			  `);
  var predeclared_enums = qw(`
		read write read_write
		function private workgroup uniform storage
		perspective linear flat
		center centroid sample
		vertex_index instance_index position front_facing frag_depth
			local_invocation_id local_invocation_index
			global_invocation_id workgroup_id num_workgroups
			sample_index sample_mask
		rgba8unorm
		rgba8snorm
		rgba8uint
		rgba8sint
		rgba16uint
		rgba16sint
		rgba16float
		r32uint
		r32sint
		r32float
		rg32uint
		rg32sint
		rg32float
		rgba32uint
		rgba32sint
		rgba32float
		bgra8unorm
`);
  var predeclared_types = qw(`
		bool
		f16
		f32
		i32
		sampler sampler_comparison
		texture_depth_2d
		texture_depth_2d_array
		texture_depth_cube
		texture_depth_cube_array
		texture_depth_multisampled_2d
		texture_external
		texture_external
		u32
		`);
  var predeclared_type_generators = qw(`
		array
		atomic
		mat2x2
		mat2x3
		mat2x4
		mat3x2
		mat3x3
		mat3x4
		mat4x2
		mat4x3
		mat4x4
		ptr
		texture_1d
		texture_2d
		texture_2d_array
		texture_3d
		texture_cube
		texture_cube_array
		texture_multisampled_2d
		texture_storage_1d
		texture_storage_2d
		texture_storage_2d_array
		texture_storage_3d
		vec2
		vec3
		vec4
		`);
  var predeclared_type_aliases = qw(`
		vec2i vec3i vec4i
		vec2u vec3u vec4u
		vec2f vec3f vec4f
		vec2h vec3h vec4h
		mat2x2f mat2x3f mat2x4f
		mat3x2f mat3x3f mat3x4f
		mat4x2f mat4x3f mat4x4f
		mat2x2h mat2x3h mat2x4h
		mat3x2h mat3x3h mat3x4h
		mat4x2h mat4x3h mat4x4h
		`);
  var predeclared_intrinsics = qw(`
  bitcast all any select arrayLength abs acos acosh asin asinh atan atanh atan2
  ceil clamp cos cosh countLeadingZeros countOneBits countTrailingZeros cross
  degrees determinant distance dot exp exp2 extractBits faceForward firstLeadingBit
  firstTrailingBit floor fma fract frexp inverseBits inverseSqrt ldexp length
  log log2 max min mix modf normalize pow quantizeToF16 radians reflect refract
  reverseBits round saturate sign sin sinh smoothstep sqrt step tan tanh transpose
  trunc dpdx dpdxCoarse dpdxFine dpdy dpdyCoarse dpdyFine fwidth fwidthCoarse fwidthFine
  textureDimensions textureGather textureGatherCompare textureLoad textureNumLayers
  textureNumLevels textureNumSamples textureSample textureSampleBias textureSampleCompare
  textureSampleCompareLevel textureSampleGrad textureSampleLevel textureSampleBaseClampToEdge
  textureStore atomicLoad atomicStore atomicAdd atomicSub atomicMax atomicMin
  atomicAnd atomicOr atomicXor atomicExchange atomicCompareExchangeWeak pack4x8snorm
  pack4x8unorm pack2x16snorm pack2x16unorm pack2x16float unpack4x8snorm unpack4x8unorm
  unpack2x16snorm unpack2x16unorm unpack2x16float storageBarrier workgroupBarrier
  workgroupUniformLoad
`);
  var operators = qw(`
					 &
					 &&
					 ->
					 /
					 =
					 ==
					 !=
					 >
					 >=
					 <
					 <=
					 %
					 -
					 --
					 +
					 ++
					 |
					 ||
					 *
					 <<
					 >>
					 +=
					 -=
					 *=
					 /=
					 %=
					 &=
					 |=
					 ^=
					 >>=
					 <<=
					 `);
  var directive_re = /enable|requires|diagnostic/;
  var ident_re = /[_\p{XID_Start}]\p{XID_Continue}*/u;
  var predefined_token = "variable.predefined";
  var language = {
    tokenPostfix: ".wgsl",
    defaultToken: "invalid",
    unicode: true,
    atoms,
    keywords,
    reserved,
    predeclared_enums,
    predeclared_types,
    predeclared_type_generators,
    predeclared_type_aliases,
    predeclared_intrinsics,
    operators,
    symbols: /[!%&*+\-\.\/:;<=>^|_~,]+/,
    tokenizer: {
      root: [
        [directive_re, "keyword", "@directive"],
        [
          ident_re,
          {
            cases: {
              "@atoms": predefined_token,
              "@keywords": "keyword",
              "@reserved": "invalid",
              "@predeclared_enums": predefined_token,
              "@predeclared_types": predefined_token,
              "@predeclared_type_generators": predefined_token,
              "@predeclared_type_aliases": predefined_token,
              "@predeclared_intrinsics": predefined_token,
              "@default": "identifier"
            }
          }
        ],
        { include: "@commentOrSpace" },
        { include: "@numbers" },
        [/[{}()\[\]]/, "@brackets"],
        ["@", "annotation", "@attribute"],
        [
          /@symbols/,
          {
            cases: {
              "@operators": "operator",
              "@default": "delimiter"
            }
          }
        ],
        [/./, "invalid"]
      ],
      commentOrSpace: [
        [/\s+/, "white"],
        [/\/\*/, "comment", "@blockComment"],
        [/\/\/.*$/, "comment"]
      ],
      blockComment: [
        [/[^\/*]+/, "comment"],
        [/\/\*/, "comment", "@push"],
        [/\*\//, "comment", "@pop"],
        [/[\/*]/, "comment"]
      ],
      attribute: [
        { include: "@commentOrSpace" },
        [/\w+/, "annotation", "@pop"]
      ],
      directive: [
        { include: "@commentOrSpace" },
        [/[()]/, "@brackets"],
        [/,/, "delimiter"],
        [ident_re, "meta.content"],
        [/;/, "delimiter", "@pop"]
      ],
      numbers: [
        [/0[fh]/, "number.float"],
        [/[1-9][0-9]*[fh]/, "number.float"],
        [/[0-9]*\.[0-9]+([eE][+-]?[0-9]+)?[fh]?/, "number.float"],
        [/[0-9]+\.[0-9]*([eE][+-]?[0-9]+)?[fh]?/, "number.float"],
        [/[0-9]+[eE][+-]?[0-9]+[fh]?/, "number.float"],
        [/0[xX][0-9a-fA-F]*\.[0-9a-fA-F]+(?:[pP][+-]?[0-9]+[fh]?)?/, "number.hex"],
        [/0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*(?:[pP][+-]?[0-9]+[fh]?)?/, "number.hex"],
        [/0[xX][0-9a-fA-F]+[pP][+-]?[0-9]+[fh]?/, "number.hex"],
        [/0[xX][0-9a-fA-F]+[iu]?/, "number.hex"],
        [/[1-9][0-9]*[iu]?/, "number"],
        [/0[iu]?/, "number"]
      ]
    }
  };
  return __toCommonJS(wgsl_exports);
})();
return moduleExports;
});
