define(['dart_sdk', 'packages/flutter_facebook_responsive_ui/main.dart'], (function load__web_entrypoint_dart(dart_sdk, packages__flutter_facebook_responsive_ui__main$46dart) {
  'use strict';
  const core = dart_sdk.core;
  const ui = dart_sdk.ui;
  const _interceptors = dart_sdk._interceptors;
  const async = dart_sdk.async;
  const dart = dart_sdk.dart;
  const dartx = dart_sdk.dartx;
  const main = packages__flutter_facebook_responsive_ui__main$46dart.main;
  var web_entrypoint = Object.create(dart.library);
  dart._checkModuleNullSafetyMode(false);
  var T = {
    VoidTovoid: () => (T.VoidTovoid = dart.constFn(dart.fnType(dart.void, [])))(),
    StringL: () => (T.StringL = dart.constFn(dart.legacy(core.String)))(),
    ListOfStringL: () => (T.ListOfStringL = dart.constFn(core.List$(T.StringL())))(),
    ListLOfStringL: () => (T.ListLOfStringL = dart.constFn(dart.legacy(T.ListOfStringL())))(),
    ListLOfStringLTodynamic: () => (T.ListLOfStringLTodynamic = dart.constFn(dart.fnType(dart.dynamic, [T.ListLOfStringL()])))(),
    ListLOfStringLToLdynamic: () => (T.ListLOfStringLToLdynamic = dart.constFn(dart.legacy(T.ListLOfStringLTodynamic())))(),
    JSArrayOfStringL: () => (T.JSArrayOfStringL = dart.constFn(_interceptors.JSArray$(T.StringL())))()
  };
  const CT = Object.create({
    _: () => (C, CT)
  });
  dart.defineLazy(CT, {
    get C0() {
      return C[0] = dart.fn(main.main, T.VoidTovoid());
    }
  }, false);
  var C = [void 0];
  web_entrypoint.main = function main$() {
    return async.async(dart.void, function* main() {
      yield ui.webOnlyInitializePlatform();
      if (T.ListLOfStringLToLdynamic().is(C[0] || CT.C0)) {
        return T.ListLOfStringLToLdynamic().as(C[0] || CT.C0)(T.JSArrayOfStringL().of([]));
      }
      return (C[0] || CT.C0)();
    });
  };
  dart.trackLibraries("web_entrypoint.dart", {
    "org-dartlang-app:/web_entrypoint.dart": web_entrypoint
  }, {
  }, '{"version":3,"sourceRoot":"","sources":["web_entrypoint.dart"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;AAUiB;AACqB,MAApC,MAAM;AACN,UAAoB,gCAGI;AAFtB,cAAwB,AAAkB,iCAEpB,eAF6B;;AAErD,YAA4C,EAApB;IAC1B","file":"web_entrypoint.dart.lib.js"}');
  // Exports:
  return {
    web_entrypoint: web_entrypoint
  };
}));

