(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],{

/***/ 1:
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createApp = createApp;exports.createComponent = createComponent;exports.createPage = createPage;exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function';
}

function isStr(str) {
  return typeof str === 'string';
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

/**
                    * Create a cached version of a pure function.
                    */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
   * Camelize a hyphen-delimited string.
   */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {return c ? c.toUpperCase() : '';});
});

var HOOKS = [
'invoke',
'success',
'fail',
'complete',
'returnValue'];


var globalInterceptors = {};
var scopedInterceptors = {};

function mergeHook(parentVal, childVal) {
  var res = childVal ?
  parentVal ?
  parentVal.concat(childVal) :
  Array.isArray(childVal) ?
  childVal : [childVal] :
  parentVal;
  return res ?
  dedupeHooks(res) :
  res;
}

function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}

function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}

function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}

function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}

function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}

function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data;
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function queue(hooks, data) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.then(wrapperHook(hook));
    } else {
      var res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {} };

      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    } };

}

function wrapperOptions(interceptor) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}

function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}

function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}

function invokeApi(method, api, options) {for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {params[_key - 3] = arguments[_key];}
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}

var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return res.then(function (res) {
      return res[1];
    }).catch(function (res) {
      return res[0];
    });
  } };


var SYNC_API_RE =
/^\$|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64/;

var CONTEXT_API_RE = /^create|Manager$/;

var CALLBACK_API_RE = /^on/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name);
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name);
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name);
}

function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).
  catch(function (err) {return [err];});
}

function shouldPromise(name) {
  if (
  isContextApi(name) ||
  isSyncApi(name) ||
  isCallbackApi(name))
  {
    return false;
  }
  return true;
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  return function promiseApi() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {params[_key2 - 1] = arguments[_key2];}
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject })].concat(
      params));
      /* eslint-disable no-extend-native */
      if (!Promise.prototype.finally) {
        Promise.prototype.finally = function (callback) {
          var promise = this.constructor;
          return this.then(
          function (value) {return promise.resolve(callback()).then(function () {return value;});},
          function (reason) {return promise.resolve(callback()).then(function () {
              throw reason;
            });});

        };
      }
    })));
  };
}

var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;

function checkDeviceWidth() {var _wx$getSystemInfoSync =




  wx.getSystemInfoSync(),platform = _wx$getSystemInfoSync.platform,pixelRatio = _wx$getSystemInfoSync.pixelRatio,windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1;
    } else {
      return 0.5;
    }
  }
  return number < 0 ? -result : result;
}

var interceptors = {
  promiseInterceptor: promiseInterceptor };




var baseApi = /*#__PURE__*/Object.freeze({
  upx2px: upx2px,
  interceptors: interceptors,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor });


var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(
      function (item, index) {return index < currentIndex ? item !== urls[currentIndex] : true;});

    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false };

  } };


var protocols = {
  previewImage: previewImage };

var todos = [
'vibrate'];

var canIUses = [];

var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}

function processArgs(methodName, fromArgs) {var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {// 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {// 不支持的参数
          console.warn("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F ".concat(methodName, "\u6682\u4E0D\u652F\u6301").concat(key));
        } else if (isStr(keyOption)) {// 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {// {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}

function processReturnValue(methodName, res, returnValue) {var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {// 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}

function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {// 暂不支持的 api
      return function () {
        console.error("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301".concat(methodName));
      };
    }
    return function (arg1, arg2) {// 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      var returnValue = wx[options.name || methodName].apply(wx, args);
      if (isSyncApi(methodName)) {// 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}

var todoApis = Object.create(null);

var TODOS = [
'onTabBarMidButtonTap',
'subscribePush',
'unsubscribePush',
'onPush',
'offPush',
'share'];


function createTodoApi(name) {
  return function todoApi(_ref)


  {var fail = _ref.fail,complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail:\u6682\u4E0D\u652F\u6301 ").concat(name, " \u65B9\u6CD5") };

    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin'] };


function getProvider(_ref2)




{var service = _ref2.service,success = _ref2.success,fail = _ref2.fail,complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service] };

    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:服务[' + service + ']不存在' };

    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  getProvider: getProvider });


var getEmitter = function () {
  if (typeof getUniEmitter === 'function') {
    /* eslint-disable no-undef */
    return getUniEmitter;
  }
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();

function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}

function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}

var eventApi = /*#__PURE__*/Object.freeze({
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit });




var api = /*#__PURE__*/Object.freeze({});



var MPPage = Page;
var MPComponent = Component;

var customizeRE = /:/g;

var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});

function initTriggerEvent(mpInstance) {
  {
    if (!wx.canIUse('nextTick')) {
      return;
    }
  }
  var oldTriggerEvent = mpInstance.triggerEvent;
  mpInstance.triggerEvent = function (event) {for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {args[_key3 - 1] = arguments[_key3];}
    return oldTriggerEvent.apply(mpInstance, [customize(event)].concat(args));
  };
}

function initHook(name, options) {
  var oldHook = options[name];
  if (!oldHook) {
    options[name] = function () {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function () {
      initTriggerEvent(this);for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
      return oldHook.apply(this, args);
    };
  }
}

Page = function Page() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('onLoad', options);
  return MPPage(options);
};

Component = function Component() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('created', options);
  return MPComponent(options);
};

var PAGE_EVENT_HOOKS = [
'onPullDownRefresh',
'onReachBottom',
'onShareAppMessage',
'onPageScroll',
'onResize',
'onTabItemTap'];


function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}

function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }

  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }

  vueOptions = vueOptions.default || vueOptions;

  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super &&
    vueOptions.super.options &&
    Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }

  if (isFn(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {return hasHook(hook, mixin);});
  }
}

function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}

function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
    vueOptions = VueComponent.extendOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  return [VueComponent, vueOptions];
}

function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}

function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;

  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}

function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};

  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }

  if (!isPlainObject(data)) {
    data = {};
  }

  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });

  return data;
}

var PROP_TYPES = [String, Number, Boolean, Object, Array, null];

function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions['behaviors'];
  var vueExtends = vueOptions['extends'];
  var vueMixins = vueOptions['mixins'];

  var vueProps = vueOptions['props'];

  if (!vueProps) {
    vueOptions['props'] = vueProps = [];
  }

  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps['name'] = {
            type: String,
            default: '' };

          vueProps['value'] = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: '' };

        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(
    initBehavior({
      properties: initProperties(vueExtends.props, true) }));


  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(
        initBehavior({
          properties: initProperties(vueMixin.props, true) }));


      }
    });
  }
  return behaviors;
}

function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}

function initProperties(props) {var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: '' };

    properties.vueSlots = { // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots });

      } };

  }
  if (Array.isArray(props)) {// ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key) };

    });
  } else if (isPlainObject(props)) {// {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {// title:{type:String,default:''}
        var value = opts['default'];
        if (isFn(value)) {
          value = value();
        }

        opts.type = parsePropType(key, opts.type);

        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key) };

      } else {// content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key) };

      }
    });
  }
  return properties;
}

function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}

  event.stopPropagation = noop;
  event.preventDefault = noop;

  event.target = event.target || {};

  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }

  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }

  return event;
}

function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {// ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];

      var vFor = dataPath ? vm.__get_value(dataPath, context) : context;

      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }

      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}

function processEventExtra(vm, extra, event) {
  var extraObj = {};

  if (Array.isArray(extra) && extra.length) {
    /**
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *'test'
                                              */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {// model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {// $event
            extraObj['$' + index] = event;
          } else if (dataPath.indexOf('$event.') === 0) {// $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }

  return extraObj;
}

function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}

function processEventArgs(vm, event) {var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];var isCustom = arguments.length > 4 ? arguments[4] : undefined;var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象
  if (isCustom) {// 自定义事件
    isCustomMPEvent = event.currentTarget &&
    event.currentTarget.dataset &&
    event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {// 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return event.detail.__args__ || event.detail;
    }
  }

  var extraObj = processEventExtra(vm, extra, event);

  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {// input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(event.detail.__args__[0]);
        } else {// wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });

  return ret;
}

var ONCE = '~';
var CUSTOM = '^';

function isMatchEventType(eventType, optType) {
  return eventType === optType ||

  optType === 'regionchange' && (

  eventType === 'begin' ||
  eventType === 'end');


}

function handleEvent(event) {var _this = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;

  var ret = [];

  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];

    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;

    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this.$vm;
          if (
          handlerCtx.$options.generic &&
          handlerCtx.$parent &&
          handlerCtx.$parent.$parent)
          {// mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = handlerCtx.$parent.$parent;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            throw new Error(" _vm.".concat(methodName, " is not a function"));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          ret.push(handler.apply(handlerCtx, processEventArgs(
          _this.$vm,
          event,
          eventArray[1],
          eventArray[2],
          isCustom,
          methodName)));

        }
      });
    }
  });

  if (
  eventType === 'input' &&
  ret.length === 1 &&
  typeof ret[0] !== 'undefined')
  {
    return ret[0];
  }
}

var hooks = [
'onShow',
'onHide',
'onError',
'onPageNotFound'];


function parseBaseApp(vm, _ref3)


{var mocks = _ref3.mocks,initRefs = _ref3.initRefs;
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }

  _vue.default.prototype.mpHost = "mp-weixin";

  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }

      this.mpType = this.$options.mpType;

      this.$mp = _defineProperty({
        data: {} },
      this.mpType, this.$options.mpInstance);


      this.$scope = this.$options.mpInstance;

      delete this.$options.mpType;
      delete this.$options.mpInstance;

      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    } });


  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {// 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (!wx.canIUse('nextTick')) {// 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }

      this.$vm = vm;

      this.$vm.$mp = {
        app: this };


      this.$vm.$scope = this;
      // vm 上也挂载 globalData
      this.$vm.globalData = this.globalData;

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);

      this.$vm.__call_hook('onLaunch', args);
    } };


  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};

  initHooks(appOptions, hooks);

  return appOptions;
}

var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];

function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属
  var parentVm = $children.find(function (childVm) {return childVm.$scope._$vueId === vuePid;});
  if (parentVm) {
    return parentVm;
  }
  // 反向递归查找
  for (var i = $children.length - 1; i >= 0; i--) {
    parentVm = findVmByVueId($children[i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}

function initBehavior(options) {
  return Behavior(options);
}

function isPage() {
  return !!this.route;
}

function initRelation(detail) {
  this.triggerEvent('__l', detail);
}

function initRefs(vm) {
  var mpInstance = vm.$scope;
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      var components = mpInstance.selectAllComponents('.vue-ref');
      components.forEach(function (component) {
        var ref = component.dataset.ref;
        $refs[ref] = component.$vm || component;
      });
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for');
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || component);
      });
      return $refs;
    } });

}

function handleLink(event) {var _ref4 =



  event.detail || event.value,vuePid = _ref4.vuePid,vueOptions = _ref4.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;

  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }

  if (!parentVm) {
    parentVm = this.$vm;
  }

  vueOptions.parent = parentVm;
}

function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs });

}

function createApp(vm) {
  App(parseApp(vm));
  return vm;
}

function parseBaseComponent(vueComponentOptions)


{var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},isPage = _ref5.isPage,initRelation = _ref5.initRelation;var _initVueComponent =
  initVueComponent(_vue.default, vueComponentOptions),_initVueComponent2 = _slicedToArray(_initVueComponent, 2),VueComponent = _initVueComponent2[0],vueOptions = _initVueComponent2[1];

  var componentOptions = {
    options: {
      multipleSlots: true,
      addGlobalClass: true },

    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;

        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties };


        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options });


        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm.$destroy();
      } },

    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      } },

    methods: {
      __l: handleLink,
      __e: handleEvent } };



  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }

  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}

function parseComponent(vueComponentOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

var hooks$1 = [
'onShow',
'onHide',
'onUnload'];


hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);

function parseBasePage(vuePageOptions, _ref6)


{var isPage = _ref6.isPage,initRelation = _ref6.initRelation;
  var pageOptions = parseComponent(vuePageOptions);

  initHooks(pageOptions.methods, hooks$1, vuePageOptions);

  pageOptions.methods.onLoad = function (args) {
    this.$vm.$mp.query = args; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', args);
  };

  return pageOptions;
}

function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}

function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}

todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});

canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name :
  canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});

var uni = {};

if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      if (!hasOwn(wx, name) && !hasOwn(protocols, name)) {
        return;
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    } });

} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });

  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });

  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}

wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;

var uni$1 = uni;var _default =

uni$1;exports.default = _default;

/***/ }),

/***/ 14:
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ 15:
/*!********************************************************!*\
  !*** C:/Users/Admin/Desktop/evc.app/common/js/base.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {module.exports = {
  _cacheWallet: "evc_wallet", //钱包的缓存名字
  _cacheCoin: "evc_coin", //币种缓存名称
  _des3pwd: "ioqXdfdHfbSZaLeBQhLgxBNG", //des3加密秘钥
  _platCoin: function _platCoin() {//平台币
    return '';
  },
  _prePage: function _prePage() {//获取上一个页面
    var pages = getCurrentPages();
    var prePage = pages[pages.length - 2];
    return prePage;
  },
  _toast: function _toast(msg) {//自动消失的提示窗
    uni.showToast({
      icon: 'none',
      title: msg,
      duration: 2000 });

  },
  /**
      * 时间戳格式化
      * @param {String} 内容
      */
  _formatDate: function _formatDate(inputTime) {
    var date = new Date(parseInt(inputTime * 1000));
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? '0' + d : d;
    var h = date.getHours();
    h = h < 10 ? '0' + h : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? '0' + second : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  },
  /**
      * 小数截取
      */
  _toFixed: function _toFixed(str1, num) {
    var str = String(str1);

    function hanZeo(z) {
      var zeo = '';
      for (var i = 0; i < z; i++) {
        zeo += '0';
      }
      return zeo;
    }
    var arr = str.split('.');
    if (arr[1]) {
      if (arr[1].length >= num) {
        return arr[0] + '.' + arr[1].slice(0, num);
      } else {
        return arr[0] + '.' + arr[1] + hanZeo(num - arr[1].length);
      }
    } else {
      return str + '.' + hanZeo(num);
    }
  },
  _addressMethod: function _addressMethod(address) {//钱包地址中间用……代替
    var frontLen = 10,endLen = 10;
    var len = address.length - frontLen - endLen;
    var temp = '......';
    return address.substring(0, frontLen) + temp + address.substring(address.length - endLen);
  },
  _phoneMethod: function _phoneMethod(cellValue) {//电话号码中间用*代替
    if (Number(cellValue) && String(cellValue).length === 11) {
      var mobile = String(cellValue);
      var reg = /^(\d{3})\d{4}(\d{4})$/;
      return mobile.replace(reg, '$1****$2');
    } else {
      return cellValue;
    }
  },
  _checkPwd: function _checkPwd(pwd) {//验证密码，必须8-20字母数字组成
    if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/.test(pwd)) {
      return false;
    } else {
      return true;
    }
  },
  _networkMethod: function _networkMethod() {//网络监听
    uni.getNetworkType({
      success: function success(res) {
        console.log(res.networkType);
        if (res.networkType == 'none') {
          uni.showModal({
            title: "提示",
            content: "您当前处于无网络状态，请链接网络后操作",
            showCancel: false,
            confirmText: "确定" });

        }
      } });

    uni.onNetworkStatusChange(function (res) {
      console.log(res.isConnected);
      console.log(res.networkType);
      if (!res.isConnected) {
        uni.showModal({
          title: "提示",
          content: "您当前处于无网络状态，请链接网络后操作",
          showCancel: false,
          confirmText: "确定" });

      }
    });
  },
  _accMul: function _accMul(arg1, arg2) {//乘法
    var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length;
    } catch (e) {}
    try {
      m += s2.split(".")[1].length;
    } catch (e) {}
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
  },
  _accDiv: function _accDiv(arg1, arg2) {//除法
    var t1 = 0,t2 = 0,r1,r2;
    try {t1 = arg1.toString().split(".")[1].length;} catch (e) {}
    try {t2 = arg2.toString().split(".")[1].length;} catch (e) {}
    r1 = Number(arg1.toString().replace(".", ""));
    r2 = Number(arg2.toString().replace(".", ""));
    return r1 / r2 * Math.pow(10, t2 - t1);
  },
  _datediff: function _datediff(date) {// 时间减去8小时
    date = date.substring(0, 19);
    date = date.replace(/-/g, '/');
    var timestamp = new Date(date).getTime() - 8 * 60 * 60 * 1000;
    return this._formatDate(timestamp / 1000);
  },
  _checkLoginStatus: function _checkLoginStatus(status) {//检查登录状态
    if (status == 1004 || status == 1003 || status == 1002 || status == 1001 || status == 2001 || status == 20002 || status == 20003 || status == 20004) {
      uni.clearStorageSync();
      plus.nativeUI.toast("您的登录已过期，请重新登录", {
        verticalAlign: 'center' });

      uni.reLaunch({
        url: '/pages/account/login' });

    }
  } };
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 16:
/*!*********************************************************!*\
  !*** C:/Users/Admin/Desktop/evc.app/common/js/base1.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = {
  /**
                                                                                                                      * 时间戳格式化
                                                                                                                      * @param {String} 内容
                                                                                                                      */
  _formatDate: function _formatDate(inputTime) {
    var date = new Date(parseInt(inputTime * 1000));
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? '0' + d : d;
    var h = date.getHours();
    h = h < 10 ? '0' + h : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? '0' + second : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  },
  /**
      * 小数截取
      */
  _toFixed: function _toFixed(str1, num) {
    var str = String(str1);

    function hanZeo(z) {
      var zeo = '';
      for (var i = 0; i < z; i++) {
        zeo += '0';
      }
      return zeo;
    }
    var arr = str.split('.');
    if (arr[1]) {
      if (arr[1].length >= num) {
        return arr[0] + '.' + arr[1].slice(0, num);
      } else {
        return arr[0] + '.' + arr[1] + hanZeo(num - arr[1].length);
      }
    } else {
      return str + '.' + hanZeo(num);
    }
  },
  /**
      * 检查登录状态
      * @param {String} 内容
      */
  _isLogin: function _isLogin(status) {
    if (!status) {
      uni.showModal({
        content: "您还未登录，请先登录",
        showCancel: false,
        confirmText: "确定",
        success: function success(res) {
          if (res.confirm) {
            uni.navigateTo({
              url: "/pages/pagesB/login/login" });

          }
        } });

      return;
    };
  },
  // 判断返回值以2开头为未登录跳转到登录信息
  _indexOf: function _indexOf(status) {
    var reg = new RegExp(/^2\d/);
    return reg.test(status);
  },
  //返回值为空，不存在，null，undefine时显示为0
  _showZero: function _showZero(number) {
    if (number == "null" || number == "" || number == 0 || number == null || number == undefined || number == "undefined") {
      return "0";
    } else {
      return number;
    }
  } };exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 2:
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.10
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    {
      if(vm.$scope && vm.$scope.is){
        return vm.$scope.is
      }
    }
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = typeof SharedObject !== 'undefined' ? SharedObject : {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Techinically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length));
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i);
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a speical value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack becaues all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu'){//百度 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    vm.mpHost !== 'mp-toutiao' && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    vm.mpHost !== 'mp-toutiao' && initProvide(vm); // resolve provide after data/props
    vm.mpHost !== 'mp-toutiao' && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.10';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);
  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  vm.mpHost !== 'mp-toutiao' && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err) {
    console.error(err);
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      this.$scope['triggerEvent'](event, {
        __args__: toArray(arguments, 1)
      });
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope) {
        return this.$scope[method](args)
      }
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string,number
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onError',
    //Page
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),

/***/ 23:
/*!**********************************************************!*\
  !*** C:/Users/Admin/Desktop/evc.app/common/js/wallet.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));
var _base = _interopRequireDefault(__webpack_require__(/*! ./base.js */ 15));
var _DES = _interopRequireDefault(__webpack_require__(/*! ./DES3.js */ 24));
var _eth = _interopRequireDefault(__webpack_require__(/*! ./eth.js */ 25));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
var wallet = {
  ecodeDes3JSON: function ecodeDes3JSON(data) {// des3加密json
    console.log('原没加密的json: ' + JSON.stringify(data));
    var list = {};
    for (var key in data) {
      var val = null;
      if (typeof data[key] == 'object' || typeof data[key] == 'number') {
        val = JSON.stringify(data[key]);
      } else {
        val = data[key];
      }
      list[_DES.default.encrypt(_base.default._des3pwd, key)] = _DES.default.encrypt(_base.default._des3pwd, val);
    }
    console.log('加密后的json: ' + JSON.stringify(list));
    return list;
  },
  decodeDes3JSON: function decodeDes3JSON(data) {// des3解密json
    var list = {};
    for (var key in data) {
      var val = null;
      if (typeof data[key] == 'object' || typeof data[key] == 'number') {
        val = JSON.stringify(data[key]);
      } else {
        val = data[key];
      }
      list[_DES.default.decrypt(_base.default._des3pwd, key)] = _DES.default.decrypt(_base.default._des3pwd, val);
    }
    return list;
  },
  create: function create(pin, callback) {//创建钱包
    var data = _eth.default.create();
    if (data.status == 1) {
      this.walletSuccess(pin, data);
      callback();
    } else {
      _base.default._toast('钱包创建失败，请稍后再试');
    }
  },
  getCurrentWallet: function getCurrentWallet() {//获取当前正在使用钱包解密后的信息
    var walletList = this.getWalletList();
    return walletList.filter(function (item) {
      return item.isDefault == 1;
    })[0];
  },
  getWalletList: function getWalletList() {//获取解密后所有钱包信息
    var temp = uni.getStorageSync(_base.default._cacheWallet);
    var walletList = [];
    for (var index in temp) {
      walletList.push(this.decodeDes3JSON(temp[index]));
    }
    return walletList;
  },
  importByPrivateKey: function importByPrivateKey(privateKey, pin, callback) {//通过私钥导入钱包
    var wallet = _eth.default.importByPrivateKey(privateKey);
    var currentWallet = this.getCurrentWallet() || [];
    console.log(JSON.stringify(currentWallet));
    if (wallet.status == 2) {
      _base.default._toast('私钥输入错误，请检查');
    } else if (currentWallet.address === wallet.address) {
      _base.default._toast('钱包已经存在，不需再次导入');
    } else if (wallet.status == 1) {
      this.walletSuccess(pin, wallet);
      callback();
    }
  },
  importByMnemonic: function importByMnemonic(mnemonic, pin, callback) {//通过助记词导入钱包
    var wallet = _eth.default.importByMnemonic(mnemonic.replace(/,/g, " "));
    var currentWallet = this.getCurrentWallet() || [];
    console.log(JSON.stringify(wallet));
    if (wallet.status == 3) {
      _base.default._toast('助记词输入错误，请检查');
    } else if (currentWallet.address === wallet.address) {
      _base.default._toast('钱包已经存在，不需再次导入');
    } else if (wallet.status == 1) {
      this.walletSuccess(pin, wallet);
      callback();
    }
  },
  walletSuccess: function walletSuccess(pin, data) {
    var walletArray = this.getWalletList(),ecodeWalletList = [];
    walletArray.forEach(function (item) {
      item.isDefault = 0;
    });
    for (var i in walletArray) {
      ecodeWalletList.push(this.ecodeDes3JSON(walletArray[i]));
    }
    var temp = this.ecodeDes3JSON({
      privateKey: data.privateKey,
      mnemonic: data.mnemonic,
      address: data.address,
      pin: pin,
      isDefault: 1 //1：当前正在使用的钱包
    });
    ecodeWalletList.push(temp);
    uni.setStorageSync(_base.default._cacheWallet, ecodeWalletList); //缓存多个钱包
  },
  getBalance: function getBalance(address, ctaddress, length, callback) {//获取余额
    if (ctaddress.length > 10) {//获取合约币余额
      _eth.default.getBalance({
        address: address,
        contactAddress: ctaddress,
        length: length,
        success: function success(balance) {
          console.log(JSON.stringify(balance));
          callback(balance);
        },
        error: function error(err) {
          console.log(err);
        } });

    } else {//获取ETH余额
      _eth.default.getBalance({
        address: address,
        contactAddress: '',
        contactAbi: [],
        length: 18,
        success: function success(balance) {
          console.log(JSON.stringify(balance));
          callback(balance);
        } });

    }
  },
  trasfer: function trasfer(data, suc, err) {//转账
    _eth.default.transfer({
      privateKey: data.privateKey,
      to: data.toaddress,
      money: data.money,
      gas: data.gasNum,
      gasPrice: data.gasPrice,
      contactAddress: data.contractAddress,
      length: data.contractLength,
      success: function success(hash) {
        console.log(hash);
        if (hash) {
          suc();
        }
        uni.hideLoading();
      },
      error: function error(status, msg) {
        console.log(msg);
        uni.hideLoading();
        _base.default._toast(msg);
        err();
      } });

  },
  getCNY: function getCNY(name) {// 获取币种人民币价格
    if (!name) return 0;
    var cnyPrice = this.getUsdtPrice();
    if (name.toUpperCase() == "USDT") {
      return cnyPrice;
    }
    var namePrice = getUsdt(name);
    if (cnyPrice == 0 || namePrice == 0) {
      return 0;
    }
    var price = cnyPrice * namePrice;
    return Ceil(price, 2);
  },
  getUsdtPrice: function getUsdtPrice() {
    var list = uni.getStorageSync(_base.default._cacheCoin) || [];
    if (list.length > 0) {
      var coin = list.filter(function (a) {
        return a.Name.toUpperCase() == "USDT";
      });
      if (coin.length > 0) {
        return coin[0].Price;
      }
    }
    return 6.91;
  },
  getUsdt: function getUsdt(name) {
    if (name == "USDT") return 1;
    var list = uni.getStorageSync(_base.default._cacheCoin) || [];
    if (list.length > 0) {
      var coin = list.filter(function (a) {
        return a.Name == name;
      });
      if (coin.length > 0) {
        return coin[0].Price;
      }
    }
    return 0;
  } };

_vue.default.prototype.$Wallet = wallet;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 24:
/*!********************************************************!*\
  !*** C:/Users/Admin/Desktop/evc.app/common/js/DES3.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; /** 
                                                                                                      * DES 加密算法 
                                                                                                      * 
                                                                                                      * 该函数接受一个 8 字节字符串作为普通 DES 算法的密钥（也就是 64 位，但是算法只使用 56 位），或者接受一个 24 字节字符串作为 3DES 
                                                                                                      * 算法的密钥；第二个参数是要加密或解密的信息字符串；第三个布尔值参数用来说明信息是加密还是解密；接下来的可选参数 mode 如果是 0 表示 ECB 
                                                                                                      * 模式，1 表示 CBC 模式，默认是 ECB 模式；最后一个可选项是一个 8 字节的输入向量字符串（在 ECB 模式下不使用）。返回的密文是字符串。 
                                                                                                      * 
                                                                                                      * 参数： <br> 
                                                                                                      * key: 8字节字符串作为普通 DES 算法的密钥,或 24 字节字符串作为 3DES <br> 
                                                                                                      * message： 加密或解密的信息字符串<br> 
                                                                                                      * encrypt: 布尔值参数用来说明信息是加密还是解密<br> 
                                                                                                      * mode: 1:CBC模式，0:ECB模式(默认)<br> 
                                                                                                      * iv:<br> 
                                                                                                      * padding: 可选项, 8字节的输入向量字符串（在 ECB 模式下不使用） 
                                                                                                      */
//this takes the key, the message, and whether to encrypt or decrypt
function des(key, message, encrypt, mode, iv, padding) {
  if (encrypt) //如果是加密的话，首先转换编码
    message = unescape(encodeURIComponent(message));
  //declaring this locally speeds things up a bit
  var spfunction1 = new Array(0x1010400, 0, 0x10000, 0x1010404, 0x1010004, 0x10404, 0x4, 0x10000, 0x400, 0x1010400, 0x1010404, 0x400, 0x1000404, 0x1010004, 0x1000000, 0x4, 0x404, 0x1000400, 0x1000400, 0x10400, 0x10400, 0x1010000, 0x1010000, 0x1000404, 0x10004, 0x1000004, 0x1000004, 0x10004, 0, 0x404, 0x10404, 0x1000000, 0x10000, 0x1010404, 0x4, 0x1010000, 0x1010400, 0x1000000, 0x1000000, 0x400, 0x1010004, 0x10000, 0x10400, 0x1000004, 0x400, 0x4, 0x1000404, 0x10404, 0x1010404, 0x10004, 0x1010000, 0x1000404, 0x1000004, 0x404, 0x10404, 0x1010400, 0x404, 0x1000400, 0x1000400, 0, 0x10004, 0x10400, 0, 0x1010004);
  var spfunction2 = new Array(-0x7fef7fe0, -0x7fff8000, 0x8000, 0x108020, 0x100000, 0x20, -0x7fefffe0, -0x7fff7fe0, -0x7fffffe0, -0x7fef7fe0, -0x7fef8000, -0x80000000, -0x7fff8000, 0x100000, 0x20, -0x7fefffe0, 0x108000, 0x100020, -0x7fff7fe0, 0, -0x80000000, 0x8000, 0x108020, -0x7ff00000, 0x100020, -0x7fffffe0, 0, 0x108000, 0x8020, -0x7fef8000, -0x7ff00000, 0x8020, 0, 0x108020, -0x7fefffe0, 0x100000, -0x7fff7fe0, -0x7ff00000, -0x7fef8000, 0x8000, -0x7ff00000, -0x7fff8000, 0x20, -0x7fef7fe0, 0x108020, 0x20, 0x8000, -0x80000000, 0x8020, -0x7fef8000, 0x100000, -0x7fffffe0, 0x100020, -0x7fff7fe0, -0x7fffffe0, 0x100020, 0x108000, 0, -0x7fff8000, 0x8020, -0x80000000, -0x7fefffe0, -0x7fef7fe0, 0x108000);
  var spfunction3 = new Array(0x208, 0x8020200, 0, 0x8020008, 0x8000200, 0, 0x20208, 0x8000200, 0x20008, 0x8000008, 0x8000008, 0x20000, 0x8020208, 0x20008, 0x8020000, 0x208, 0x8000000, 0x8, 0x8020200, 0x200, 0x20200, 0x8020000, 0x8020008, 0x20208, 0x8000208, 0x20200, 0x20000, 0x8000208, 0x8, 0x8020208, 0x200, 0x8000000, 0x8020200, 0x8000000, 0x20008, 0x208, 0x20000, 0x8020200, 0x8000200, 0, 0x200, 0x20008, 0x8020208, 0x8000200, 0x8000008, 0x200, 0, 0x8020008, 0x8000208, 0x20000, 0x8000000, 0x8020208, 0x8, 0x20208, 0x20200, 0x8000008, 0x8020000, 0x8000208, 0x208, 0x8020000, 0x20208, 0x8, 0x8020008, 0x20200);
  var spfunction4 = new Array(0x802001, 0x2081, 0x2081, 0x80, 0x802080, 0x800081, 0x800001, 0x2001, 0, 0x802000, 0x802000, 0x802081, 0x81, 0, 0x800080, 0x800001, 0x1, 0x2000, 0x800000, 0x802001, 0x80, 0x800000, 0x2001, 0x2080, 0x800081, 0x1, 0x2080, 0x800080, 0x2000, 0x802080, 0x802081, 0x81, 0x800080, 0x800001, 0x802000, 0x802081, 0x81, 0, 0, 0x802000, 0x2080, 0x800080, 0x800081, 0x1, 0x802001, 0x2081, 0x2081, 0x80, 0x802081, 0x81, 0x1, 0x2000, 0x800001, 0x2001, 0x802080, 0x800081, 0x2001, 0x2080, 0x800000, 0x802001, 0x80, 0x800000, 0x2000, 0x802080);
  var spfunction5 = new Array(0x100, 0x2080100, 0x2080000, 0x42000100, 0x80000, 0x100, 0x40000000, 0x2080000, 0x40080100, 0x80000, 0x2000100, 0x40080100, 0x42000100, 0x42080000, 0x80100, 0x40000000, 0x2000000, 0x40080000, 0x40080000, 0, 0x40000100, 0x42080100, 0x42080100, 0x2000100, 0x42080000, 0x40000100, 0, 0x42000000, 0x2080100, 0x2000000, 0x42000000, 0x80100, 0x80000, 0x42000100, 0x100, 0x2000000, 0x40000000, 0x2080000, 0x42000100, 0x40080100, 0x2000100, 0x40000000, 0x42080000, 0x2080100, 0x40080100, 0x100, 0x2000000, 0x42080000, 0x42080100, 0x80100, 0x42000000, 0x42080100, 0x2080000, 0, 0x40080000, 0x42000000, 0x80100, 0x2000100, 0x40000100, 0x80000, 0, 0x40080000, 0x2080100, 0x40000100);
  var spfunction6 = new Array(0x20000010, 0x20400000, 0x4000, 0x20404010, 0x20400000, 0x10, 0x20404010, 0x400000, 0x20004000, 0x404010, 0x400000, 0x20000010, 0x400010, 0x20004000, 0x20000000, 0x4010, 0, 0x400010, 0x20004010, 0x4000, 0x404000, 0x20004010, 0x10, 0x20400010, 0x20400010, 0, 0x404010, 0x20404000, 0x4010, 0x404000, 0x20404000, 0x20000000, 0x20004000, 0x10, 0x20400010, 0x404000, 0x20404010, 0x400000, 0x4010, 0x20000010, 0x400000, 0x20004000, 0x20000000, 0x4010, 0x20000010, 0x20404010, 0x404000, 0x20400000, 0x404010, 0x20404000, 0, 0x20400010, 0x10, 0x4000, 0x20400000, 0x404010, 0x4000, 0x400010, 0x20004010, 0, 0x20404000, 0x20000000, 0x400010, 0x20004010);
  var spfunction7 = new Array(0x200000, 0x4200002, 0x4000802, 0, 0x800, 0x4000802, 0x200802, 0x4200800, 0x4200802, 0x200000, 0, 0x4000002, 0x2, 0x4000000, 0x4200002, 0x802, 0x4000800, 0x200802, 0x200002, 0x4000800, 0x4000002, 0x4200000, 0x4200800, 0x200002, 0x4200000, 0x800, 0x802, 0x4200802, 0x200800, 0x2, 0x4000000, 0x200800, 0x4000000, 0x200800, 0x200000, 0x4000802, 0x4000802, 0x4200002, 0x4200002, 0x2, 0x200002, 0x4000000, 0x4000800, 0x200000, 0x4200800, 0x802, 0x200802, 0x4200800, 0x802, 0x4000002, 0x4200802, 0x4200000, 0x200800, 0, 0x2, 0x4200802, 0, 0x200802, 0x4200000, 0x800, 0x4000002, 0x4000800, 0x800, 0x200002);
  var spfunction8 = new Array(0x10001040, 0x1000, 0x40000, 0x10041040, 0x10000000, 0x10001040, 0x40, 0x10000000, 0x40040, 0x10040000, 0x10041040, 0x41000, 0x10041000, 0x41040, 0x1000, 0x40, 0x10040000, 0x10000040, 0x10001000, 0x1040, 0x41000, 0x40040, 0x10040040, 0x10041000, 0x1040, 0, 0, 0x10040040, 0x10000040, 0x10001000, 0x41040, 0x40000, 0x41040, 0x40000, 0x10041000, 0x1000, 0x40, 0x10040040, 0x1000, 0x41040, 0x10001000, 0x40, 0x10000040, 0x10040000, 0x10040040, 0x10000000, 0x40000, 0x10001040, 0, 0x10041040, 0x40040, 0x10000040, 0x10040000, 0x10001000, 0x10001040, 0, 0x10041040, 0x41000, 0x41000, 0x1040, 0x1040, 0x40040, 0x10000000, 0x10041000);
  //create the 16 or 48 subkeys we will need
  var keys = des_createKeys(key);
  var m = 0,i,j,temp,temp2,right1,right2,left,right,looping;
  var cbcleft, cbcleft2, cbcright, cbcright2;
  var endloop, loopinc;
  var len = message.length;
  var chunk = 0;
  //set up the loops for single and triple des
  var iterations = keys.length == 32 ? 3 : 9; //single or triple des
  if (iterations == 3) {looping = encrypt ? new Array(0, 32, 2) : new Array(30, -2, -2);} else
  {looping = encrypt ? new Array(0, 32, 2, 62, 30, -2, 64, 96, 2) : new Array(94, 62, -2, 32, 64, 2, 30, -2, -2);}
  //pad the message depending on the padding parameter
  if (padding == 2) message += "    "; //pad the message with spaces
  else if (padding == 1) {
      if (encrypt) {
        temp = 8 - len % 8;
        message += String.fromCharCode(temp, temp, temp, temp, temp, temp, temp, temp);
        if (temp === 8) len += 8;
      }
    } //PKCS7 padding
    else if (!padding) message += "\0\0\0\0\0\0\0\0"; //pad the message out with null bytes
  //store the result here
  var result = "";
  var tempresult = "";
  if (mode == 1) {//CBC mode
    cbcleft = iv.charCodeAt(m++) << 24 | iv.charCodeAt(m++) << 16 | iv.charCodeAt(m++) << 8 | iv.charCodeAt(m++);
    cbcright = iv.charCodeAt(m++) << 24 | iv.charCodeAt(m++) << 16 | iv.charCodeAt(m++) << 8 | iv.charCodeAt(m++);
    m = 0;
  }
  //loop through each 64 bit chunk of the message
  while (m < len) {
    left = message.charCodeAt(m++) << 24 | message.charCodeAt(m++) << 16 | message.charCodeAt(m++) << 8 | message.charCodeAt(m++);
    right = message.charCodeAt(m++) << 24 | message.charCodeAt(m++) << 16 | message.charCodeAt(m++) << 8 | message.charCodeAt(m++);
    //for Cipher Block Chaining mode, xor the message with the previous result
    if (mode == 1) {if (encrypt) {left ^= cbcleft;right ^= cbcright;} else {cbcleft2 = cbcleft;cbcright2 = cbcright;cbcleft = left;cbcright = right;}}
    //first each 64 but chunk of the message must be permuted according to IP
    temp = (left >>> 4 ^ right) & 0x0f0f0f0f;right ^= temp;left ^= temp << 4;
    temp = (left >>> 16 ^ right) & 0x0000ffff;right ^= temp;left ^= temp << 16;
    temp = (right >>> 2 ^ left) & 0x33333333;left ^= temp;right ^= temp << 2;
    temp = (right >>> 8 ^ left) & 0x00ff00ff;left ^= temp;right ^= temp << 8;
    temp = (left >>> 1 ^ right) & 0x55555555;right ^= temp;left ^= temp << 1;
    left = left << 1 | left >>> 31;
    right = right << 1 | right >>> 31;
    //do this either 1 or 3 times for each chunk of the message
    for (j = 0; j < iterations; j += 3) {
      endloop = looping[j + 1];
      loopinc = looping[j + 2];
      //now go through and perform the encryption or decryption
      for (i = looping[j]; i != endloop; i += loopinc) {//for efficiency
        right1 = right ^ keys[i];
        right2 = (right >>> 4 | right << 28) ^ keys[i + 1];
        //the result is attained by passing these bytes through the S selection functions
        temp = left;
        left = right;
        right = temp ^ (spfunction2[right1 >>> 24 & 0x3f] | spfunction4[right1 >>> 16 & 0x3f] |
        spfunction6[right1 >>> 8 & 0x3f] | spfunction8[right1 & 0x3f] |
        spfunction1[right2 >>> 24 & 0x3f] | spfunction3[right2 >>> 16 & 0x3f] |
        spfunction5[right2 >>> 8 & 0x3f] | spfunction7[right2 & 0x3f]);
      }
      temp = left;left = right;right = temp; //unreverse left and right
    } //for either 1 or 3 iterations
    //move then each one bit to the right
    left = left >>> 1 | left << 31;
    right = right >>> 1 | right << 31;
    //now perform IP-1, which is IP in the opposite direction
    temp = (left >>> 1 ^ right) & 0x55555555;right ^= temp;left ^= temp << 1;
    temp = (right >>> 8 ^ left) & 0x00ff00ff;left ^= temp;right ^= temp << 8;
    temp = (right >>> 2 ^ left) & 0x33333333;left ^= temp;right ^= temp << 2;
    temp = (left >>> 16 ^ right) & 0x0000ffff;right ^= temp;left ^= temp << 16;
    temp = (left >>> 4 ^ right) & 0x0f0f0f0f;right ^= temp;left ^= temp << 4;
    //for Cipher Block Chaining mode, xor the message with the previous result
    if (mode == 1) {if (encrypt) {cbcleft = left;cbcright = right;} else {left ^= cbcleft2;right ^= cbcright2;}}
    tempresult += String.fromCharCode(left >>> 24, left >>> 16 & 0xff, left >>> 8 & 0xff, left & 0xff, right >>> 24, right >>> 16 & 0xff, right >>> 8 & 0xff, right & 0xff);
    chunk += 8;
    if (chunk == 512) {result += tempresult;tempresult = "";chunk = 0;}
  } //for every 8 characters, or 64 bits in the message
  //return the result as an array
  result += tempresult;
  result = result.replace(/\0*$/g, "");
  if (!encrypt) {//如果是解密的话，解密结束后对PKCS7 padding进行解码，并转换成utf-8编码
    if (padding === 1) {//PKCS7 padding解码
      var len = result.length,paddingChars = 0;
      len && (paddingChars = result.charCodeAt(len - 1));
      paddingChars <= 8 && (result = result.substring(0, len - paddingChars));
    }
    //转换成UTF-8编码
    result = decodeURIComponent(escape(result));
  }
  return result;
} //end of des
//des_createKeys
//this takes as input a 64 bit key (even though only 56 bits are used)
//as an array of 2 integers, and returns 16 48 bit keys
function des_createKeys(key) {
  //declaring this locally speeds things up a bit
  var pc2bytes0 = new Array(0, 0x4, 0x20000000, 0x20000004, 0x10000, 0x10004, 0x20010000, 0x20010004, 0x200, 0x204, 0x20000200, 0x20000204, 0x10200, 0x10204, 0x20010200, 0x20010204);
  var pc2bytes1 = new Array(0, 0x1, 0x100000, 0x100001, 0x4000000, 0x4000001, 0x4100000, 0x4100001, 0x100, 0x101, 0x100100, 0x100101, 0x4000100, 0x4000101, 0x4100100, 0x4100101);
  var pc2bytes2 = new Array(0, 0x8, 0x800, 0x808, 0x1000000, 0x1000008, 0x1000800, 0x1000808, 0, 0x8, 0x800, 0x808, 0x1000000, 0x1000008, 0x1000800, 0x1000808);
  var pc2bytes3 = new Array(0, 0x200000, 0x8000000, 0x8200000, 0x2000, 0x202000, 0x8002000, 0x8202000, 0x20000, 0x220000, 0x8020000, 0x8220000, 0x22000, 0x222000, 0x8022000, 0x8222000);
  var pc2bytes4 = new Array(0, 0x40000, 0x10, 0x40010, 0, 0x40000, 0x10, 0x40010, 0x1000, 0x41000, 0x1010, 0x41010, 0x1000, 0x41000, 0x1010, 0x41010);
  var pc2bytes5 = new Array(0, 0x400, 0x20, 0x420, 0, 0x400, 0x20, 0x420, 0x2000000, 0x2000400, 0x2000020, 0x2000420, 0x2000000, 0x2000400, 0x2000020, 0x2000420);
  var pc2bytes6 = new Array(0, 0x10000000, 0x80000, 0x10080000, 0x2, 0x10000002, 0x80002, 0x10080002, 0, 0x10000000, 0x80000, 0x10080000, 0x2, 0x10000002, 0x80002, 0x10080002);
  var pc2bytes7 = new Array(0, 0x10000, 0x800, 0x10800, 0x20000000, 0x20010000, 0x20000800, 0x20010800, 0x20000, 0x30000, 0x20800, 0x30800, 0x20020000, 0x20030000, 0x20020800, 0x20030800);
  var pc2bytes8 = new Array(0, 0x40000, 0, 0x40000, 0x2, 0x40002, 0x2, 0x40002, 0x2000000, 0x2040000, 0x2000000, 0x2040000, 0x2000002, 0x2040002, 0x2000002, 0x2040002);
  var pc2bytes9 = new Array(0, 0x10000000, 0x8, 0x10000008, 0, 0x10000000, 0x8, 0x10000008, 0x400, 0x10000400, 0x408, 0x10000408, 0x400, 0x10000400, 0x408, 0x10000408);
  var pc2bytes10 = new Array(0, 0x20, 0, 0x20, 0x100000, 0x100020, 0x100000, 0x100020, 0x2000, 0x2020, 0x2000, 0x2020, 0x102000, 0x102020, 0x102000, 0x102020);
  var pc2bytes11 = new Array(0, 0x1000000, 0x200, 0x1000200, 0x200000, 0x1200000, 0x200200, 0x1200200, 0x4000000, 0x5000000, 0x4000200, 0x5000200, 0x4200000, 0x5200000, 0x4200200, 0x5200200);
  var pc2bytes12 = new Array(0, 0x1000, 0x8000000, 0x8001000, 0x80000, 0x81000, 0x8080000, 0x8081000, 0x10, 0x1010, 0x8000010, 0x8001010, 0x80010, 0x81010, 0x8080010, 0x8081010);
  var pc2bytes13 = new Array(0, 0x4, 0x100, 0x104, 0, 0x4, 0x100, 0x104, 0x1, 0x5, 0x101, 0x105, 0x1, 0x5, 0x101, 0x105);
  //how many iterations (1 for des, 3 for triple des)
  var iterations = key.length > 8 ? 3 : 1; //changed by Paul 16/6/2007 to use Triple DES for 9+ byte keys
  //stores the return keys
  var keys = new Array(32 * iterations);
  //now define the left shifts which need to be done
  var shifts = new Array(0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0);
  //other variables
  var lefttemp,righttemp,m = 0,n = 0,temp;
  for (var j = 0; j < iterations; j++) {//either 1 or 3 iterations
    var left = key.charCodeAt(m++) << 24 | key.charCodeAt(m++) << 16 | key.charCodeAt(m++) << 8 | key.charCodeAt(m++);
    var right = key.charCodeAt(m++) << 24 | key.charCodeAt(m++) << 16 | key.charCodeAt(m++) << 8 | key.charCodeAt(m++);
    temp = (left >>> 4 ^ right) & 0x0f0f0f0f;right ^= temp;left ^= temp << 4;
    temp = (right >>> -16 ^ left) & 0x0000ffff;left ^= temp;right ^= temp << -16;
    temp = (left >>> 2 ^ right) & 0x33333333;right ^= temp;left ^= temp << 2;
    temp = (right >>> -16 ^ left) & 0x0000ffff;left ^= temp;right ^= temp << -16;
    temp = (left >>> 1 ^ right) & 0x55555555;right ^= temp;left ^= temp << 1;
    temp = (right >>> 8 ^ left) & 0x00ff00ff;left ^= temp;right ^= temp << 8;
    temp = (left >>> 1 ^ right) & 0x55555555;right ^= temp;left ^= temp << 1;
    //the right side needs to be shifted and to get the last four bits of the left side
    temp = left << 8 | right >>> 20 & 0x000000f0;
    //left needs to be put upside down
    left = right << 24 | right << 8 & 0xff0000 | right >>> 8 & 0xff00 | right >>> 24 & 0xf0;
    right = temp;
    //now go through and perform these shifts on the left and right keys
    for (var i = 0; i < shifts.length; i++) {
      //shift the keys either one or two bits to the left
      if (shifts[i]) {left = left << 2 | left >>> 26;right = right << 2 | right >>> 26;} else
      {left = left << 1 | left >>> 27;right = right << 1 | right >>> 27;}
      left &= -0xf;right &= -0xf;
      //now apply PC-2, in such a way that E is easier when encrypting or decrypting
      //this conversion will look like PC-2 except only the last 6 bits of each byte are used
      //rather than 48 consecutive bits and the order of lines will be according to
      //how the S selection functions will be applied: S2, S4, S6, S8, S1, S3, S5, S7
      lefttemp = pc2bytes0[left >>> 28] | pc2bytes1[left >>> 24 & 0xf] |
      pc2bytes2[left >>> 20 & 0xf] | pc2bytes3[left >>> 16 & 0xf] |
      pc2bytes4[left >>> 12 & 0xf] | pc2bytes5[left >>> 8 & 0xf] |
      pc2bytes6[left >>> 4 & 0xf];
      righttemp = pc2bytes7[right >>> 28] | pc2bytes8[right >>> 24 & 0xf] |
      pc2bytes9[right >>> 20 & 0xf] | pc2bytes10[right >>> 16 & 0xf] |
      pc2bytes11[right >>> 12 & 0xf] | pc2bytes12[right >>> 8 & 0xf] |
      pc2bytes13[right >>> 4 & 0xf];
      temp = (righttemp >>> 16 ^ lefttemp) & 0x0000ffff;
      keys[n++] = lefttemp ^ temp;keys[n++] = righttemp ^ temp << 16;
    }
  } //for each iterations
  //return the keys we've created
  return keys;
} //end of des_createKeys
function genkey(key, start, end) {
  //8 byte / 64 bit Key (DES) or 192 bit Key
  return { key: pad(key.slice(start, end)), vector: 1 };
}
function pad(key) {
  for (var i = key.length; i < 24; i++) {
    key += "0";
  }
  return key;
}
var des3iv = '12345678';
var DES3 = {
  //3DES加密，CBC/PKCS5Padding
  encrypt: function encrypt(key, input) {
    console.log(key);
    var genKey = genkey(key, 0, 24);
    return btoa(des(genKey.key, input, 1, 1, des3iv, 1));
  },
  ////3DES解密，CBC/PKCS5Padding
  decrypt: function decrypt(key, input) {
    var genKey = genkey(key, 0, 24);
    return des(genKey.key, atob(input), 0, 1, des3iv, 1);
  } };var _default =

DES3;exports.default = _default;

/***/ }),

/***/ 25:
/*!*******************************************************!*\
  !*** C:/Users/Admin/Desktop/evc.app/common/js/eth.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var ethers = __webpack_require__(/*! @/common/js/ethers.min.js */ 26);
var shims = __webpack_require__(/*! @/common/js/shims.js */ 27);
var _defautAbi = [{
  "constant": true,
  "inputs": [],
  "name": "name",
  "outputs": [{
    "name": "",
    "type": "string" }],

  "payable": false,
  "stateMutability": "view",
  "type": "function" },
{
  "constant": false,
  "inputs": [],
  "name": "stop",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function" },
{
  "constant": false,
  "inputs": [{
    "name": "_spender",
    "type": "address" },
  {
    "name": "_value",
    "type": "uint256" }],

  "name": "approve",
  "outputs": [{
    "name": "success",
    "type": "bool" }],

  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function" },
{
  "constant": true,
  "inputs": [],
  "name": "totalSupply",
  "outputs": [{
    "name": "",
    "type": "uint256" }],

  "payable": false,
  "stateMutability": "view",
  "type": "function" },
{
  "constant": false,
  "inputs": [{
    "name": "_from",
    "type": "address" },
  {
    "name": "_to",
    "type": "address" },
  {
    "name": "_value",
    "type": "uint256" }],

  "name": "transferFrom",
  "outputs": [{
    "name": "success",
    "type": "bool" }],

  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function" },
{
  "constant": true,
  "inputs": [],
  "name": "decimals",
  "outputs": [{
    "name": "",
    "type": "uint256" }],

  "payable": false,
  "stateMutability": "view",
  "type": "function" },
{
  "constant": false,
  "inputs": [{
    "name": "_value",
    "type": "uint256" }],

  "name": "burn",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function" },
{
  "constant": true,
  "inputs": [{
    "name": "",
    "type": "address" }],

  "name": "balanceOf",
  "outputs": [{
    "name": "",
    "type": "uint256" }],

  "payable": false,
  "stateMutability": "view",
  "type": "function" },
{
  "constant": true,
  "inputs": [],
  "name": "stopped",
  "outputs": [{
    "name": "",
    "type": "bool" }],

  "payable": false,
  "stateMutability": "view",
  "type": "function" },
{
  "constant": true,
  "inputs": [],
  "name": "symbol",
  "outputs": [{
    "name": "",
    "type": "string" }],

  "payable": false,
  "stateMutability": "view",
  "type": "function" },
{
  "constant": false,
  "inputs": [{
    "name": "_to",
    "type": "address" },
  {
    "name": "_value",
    "type": "uint256" }],

  "name": "transfer",
  "outputs": [{
    "name": "success",
    "type": "bool" }],

  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function" },
{
  "constant": false,
  "inputs": [],
  "name": "start",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function" },
{
  "constant": false,
  "inputs": [{
    "name": "_name",
    "type": "string" }],

  "name": "setName",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function" },
{
  "constant": true,
  "inputs": [{
    "name": "",
    "type": "address" },
  {
    "name": "",
    "type": "address" }],

  "name": "allowance",
  "outputs": [{
    "name": "",
    "type": "uint256" }],

  "payable": false,
  "stateMutability": "view",
  "type": "function" },
{
  "inputs": [{
    "name": "_addressFounder",
    "type": "address" }],

  "payable": false,
  "stateMutability": "nonpayable",
  "type": "constructor" },
{
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "name": "_from",
    "type": "address" },
  {
    "indexed": true,
    "name": "_to",
    "type": "address" },
  {
    "indexed": false,
    "name": "_value",
    "type": "uint256" }],

  "name": "Transfer",
  "type": "event" },
{
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "name": "_owner",
    "type": "address" },
  {
    "indexed": true,
    "name": "_spender",
    "type": "address" },
  {
    "indexed": false,
    "name": "_value",
    "type": "uint256" }],

  "name": "Approval",
  "type": "event" }];

var ResultStatus = {
  Error: 0, //错误
  Success: 1,
  PrivateKeyError: 2, //私钥错误
  MnemonicError: 3, //助记词错误
  NotEnougth: 4, //余额不足
  NotEnougthFee: 5, //Eth手续费不足
  AddressError: 6, //地址无效
  ContactAddressError: 7, //合约地址无效
  LengthError: 8 //长度错误，3-18
};
var __wallet = {};
var _success = function _success() {};
var _error = function _error() {};
/**
                                    * 生成一个新地址，返回私钥，助记词及地址
                                    */
__wallet.create = function () {
  try {
    var wallet = ethers.Wallet.createRandom();
    var mnemonic = wallet.mnemonic;
    var path = wallet.path;
    var privateKey = wallet.privateKey;
    var address = wallet.address;
    return {
      status: ResultStatus.Success,
      msg: "success",
      privateKey: privateKey,
      mnemonic: mnemonic,
      address: address };

  } catch (e) {
    return {
      status: ResultStatus.Error,
      msg: e.message,
      privateKey: '',
      mnemonic: '',
      address: '' };

  }
};

/**
    * 根据私钥获取地址信息
    * @param {String} 私钥
    */
__wallet.importByPrivateKey = function (privateKey) {
  try {
    var wallet = new ethers.Wallet(privateKey);
    var privateKey = wallet.privateKey;
    var address = wallet.address;
    return {
      status: ResultStatus.Success,
      msg: "success",
      privateKey: privateKey,
      mnemonic: '',
      address: address };

  } catch (e) {
    return {
      status: ResultStatus.PrivateKeyError,
      msg: e.message,
      privateKey: '',
      mnemonic: '',
      address: '' };

  }
};

/**
    * 根据助记词获取地址信息
    * @param {String} 助记词
    */
__wallet.importByMnemonic = function (mnemonic) {
  try {
    var wallet = ethers.Wallet.fromMnemonic(mnemonic);
    var path = wallet.path;
    var privateKey = wallet.privateKey;
    var address = wallet.address;
    return {
      status: ResultStatus.Success,
      msg: "success",
      privateKey: privateKey,
      mnemonic: mnemonic,
      address: address };

  } catch (e) {

    return {
      status: ResultStatus.MnemonicError,
      msg: e.message,
      privateKey: '',
      mnemonic: '',
      address: '' };

  }
};

/**
    * 获取地址余额
    * @param {String} Eth地址
    * @param {JSON} 合约信息
    * @param {Function} 成功回调
    * @param {Function} 失败回调
    */
__wallet.getContactBalance = function (data) {
  if (data.contactAddress == "" || data.contactAddress.length != 42) {
    data.error(ResultStatus.ContactAddressError, "合约地址非法");
  }

  if (data.length < 3 || data.length > 18) {
    data.error(LengthError.LengthError, "请输入正确的合约币长度");
  }
  var provider = new ethers.providers.JsonRpcProvider("https://web3.token.im");
  //var provider = ethers.getDefaultProvider('ropsten');

  var contract = new ethers.Contract(data.contactAddress, data.contactAbi, provider);
  var balance = contract.balanceOf(data.address);
  balance.then(function (_balance) {
    _balance = ethers.utils.formatUnits(_balance, data.length);
    data.success(_balance);
  }, function (error) {
    console.log(error);
  });
};

/**
    * 获取地址余额
    * @param {String} Eth地址
    * @param {JSON} 合约信息，Eth直接用{},{address:'',abi:[],length:18}
    * @param {Function} 成功回调
    * @param {Function} 失败回调
    */
__wallet.getBalance = function (data) {
  data.address = data.address || "";
  data.success = data.success || _success;
  data.error = data.error || _error;
  data.contactAddress = data.contactAddress || "";
  data.contactAbi = data.contactAbi || _defautAbi;
  data.length = data.length || 18;
  if (data.contactAddress.length != 42 && data.contactAddress.length != 0) {
    data.error(ResultStatus.ContactAddressError, '请输入正确的合约地址');
    return;
  }
  var provider = new ethers.providers.JsonRpcProvider("https://web3.token.im");
  //var provider = ethers.getDefaultProvider('ropsten');
  var self = this;
  provider.getBalance(data.address).then(function (balance) {
    if (data.contactAddress == 'eth' || data.contactAddress == '') {
      balance = ethers.utils.formatEther(balance);
      data.success(balance);
    } else {
      self.getContactBalance(data);
    }
  }, function (error) {
    console.log(error);
  });
};

__wallet.transferEth = function (data, wallet) {

  var provider = ethers.getDefaultProvider();

  var balancePromise = provider.getBalance(wallet.address);
  var gasPricePromise = provider.getGasPrice();
  var transactionCountPromise = provider.getTransactionCount(wallet.address);

  var allPromises = Promise.all([
  gasPricePromise,
  balancePromise,
  transactionCountPromise]);


  var gasPriceWei = ethers.utils.parseUnits(data.gasPrice.toString(), 9);

  var fee = ethers.utils.formatEther(gasPriceWei.mul(data.gas));
  var sendPromise = allPromises.then(function (results) {
    var gasPrice = results[0];
    var balance = ethers.utils.formatEther(results[1]);
    var transactionCount = results[2];
    if (parseFloat(balance) < parseFloat(fee) + parseFloat(data.money)) {
      data.error(ResultStatus.NotEnougth, '手续费不足');
    } else {
      var transaction = {
        nonce: transactionCount,
        gasLimit: ethers.utils.bigNumberify(data.gas),
        gasPrice: gasPriceWei,
        to: data.to,
        value: ethers.utils.parseUnits(data.money.toString(), data.length),
        data: "0x",
        // This ensures the transaction cannot be replayed on different networks
        chainId: ethers.utils.getNetwork('homestead').chainId };

      var wallet = new ethers.Wallet(data.privateKey);
      var signPromise = wallet.sign(transaction);
      signPromise.then(function (signedTransaction) {
        provider.sendTransaction(signedTransaction).then(function (tx) {
          data.success(tx.hash);
        });
      });
    }
  });
};

/**
    * 发起一笔转帐
    * @param {JSON} 转帐数据
    */
__wallet.transfer = function (data) {
  try {
    data.privateKey = data.privateKey || "";
    data.to = data.to || "";
    data.money = data.money || 0;
    data.gas = data.gas || 80000;
    data.gasPrice = data.gasPrice || 10;
    data.length = data.length || 18;
    data.contactAddress = data.contactAddress || "";
    data.success = data.success || _success;
    data.error = data.error || _error;
    var wallet = this.importByPrivateKey(data.privateKey);
    if (data.to.length != 42) {
      data.error(ResultStatus.AddressError, "接收地址出错");
      return;
    }
    if (wallet.status == ResultStatus.PrivateKeyError) {
      data.error(ResultStatus.PrivateKeyError, "请输入正确的私钥");
      return;
    }
    if (data.contactAddress.length == 0 || data.contactAddress == "eth") {
      this.transferEth(data, wallet);
    } else {
      this.transferContact(data, wallet);
    }
  } catch (e) {
    data.error(ResultStatus.Error, e.message);
  }
};

__wallet.transferContact = function (data, wallet) {
  if (data.length < 3 || data.length > 18) {
    data.error(LengthError.LengthError, "请输入正确的合约币长度");
    return;
  }
  var provider = ethers.getDefaultProvider();

  var ethbalancePromise = provider.getBalance(wallet.address);
  var gasPricePromise = provider.getGasPrice();
  var transactionCountPromise = provider.getTransactionCount(wallet.address);

  data.abi = data.abi || _defautAbi;
  var contract = new ethers.Contract(data.contactAddress, data.abi, provider);
  var contractbalancePromise = contract.balanceOf(data.contactAddress);
  var allPromises = Promise.all([
  gasPricePromise,
  ethbalancePromise,
  transactionCountPromise,
  contractbalancePromise]);

  var gasPriceWei = ethers.utils.parseUnits(data.gasPrice.toString(), 9);
  var fee = ethers.utils.formatEther(gasPriceWei.mul(data.gas));
  var sendPromise = allPromises.then(function (results) {
    var gasPrice = results[0];
    var ethbalance = ethers.utils.formatEther(results[1]);
    var transactionCount = results[2];
    var contactbalance = ethers.utils.formatUnits(results[3], data.length);

    if (ethbalance < fee) {
      data.error(ResultStatus.NotEnougthFee, 'Eth手续费不足');
    } else {
      if (contactbalance < data.Money) {
        data.error(ResultStatus.NotEnougth, '余额不足');
      } else {
        var transaction = {
          nonce: transactionCount,
          gasLimit: ethers.utils.bigNumberify(data.gas),
          gasPrice: gasPriceWei,
          to: data.contactAddress,
          value: ethers.utils.bigNumberify("0"),
          data: "0xa9059cbb" + ethers.utils.hexZeroPad(ethers.utils.hexlify(data.to), 32).replace("0x", "") + ethers.utils.hexZeroPad(ethers.utils.hexlify(ethers.utils.parseUnits(data.money.toString(), data.length)), 32).replace("0x", ""),
          // This ensures the transaction cannot be replayed on different networks
          chainId: ethers.utils.getNetwork('homestead').chainId };


        var wallet = new ethers.Wallet(data.privateKey);
        var signPromise = wallet.sign(transaction);
        signPromise.then(function (signedTransaction) {
          provider.sendTransaction(signedTransaction).then(function (tx) {
            data.success(tx.hash);
          });
        }).catch(function () {

        });
      }
    }
  });
};var _default =
__wallet;exports.default = _default;

/***/ }),

/***/ 26:
/*!**************************************************************!*\
  !*** C:/Users/Admin/Desktop/evc.app/common/js/ethers.min.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {var require;var require;!function (e) {if (true) module.exports = e();else {}}(function () {return function o(s, a, u) {function l(t, e) {if (!a[t]) {if (!s[t]) {var r = "function" == typeof require && require;if (!e && r) return require(t, !0);if (h) return h(t, !0);var n = new Error("Cannot find module '" + t + "'");throw n.code = "MODULE_NOT_FOUND", n;}var i = a[t] = { exports: {} };s[t][0].call(i.exports, function (e) {return l(s[t][1][e] || e);}, i, i.exports, o, s, a, u);}return a[t].exports;}for (var h = "function" == typeof require && require, e = 0; e < u.length; e++) {l(u[e]);}return l;}({ 1: [function (e, t, r) {"use strict";Object.defineProperty(r, "__esModule", { value: !0 }), r.version = "4.0.37";}, {}], 2: [function (e, t, r) {"use strict";Object.defineProperty(r, "__esModule", { value: !0 });var n = e("./utils/properties"),i = (o.isSigner = function (e) {return n.isType(e, "Signer");}, o);function o() {n.setType(this, "Signer");}r.Signer = i;}, { "./utils/properties": 73 }], 3: [function (e, t, r) {"use strict";Object.defineProperty(r, "__esModule", { value: !0 });var n = e("./utils/bignumber");r.AddressZero = "0x0000000000000000000000000000000000000000";r.HashZero = "0x0000000000000000000000000000000000000000000000000000000000000000";r.EtherSymbol = "\u039E";var i = n.bigNumberify(-1);r.NegativeOne = i;var o = n.bigNumberify(0);r.Zero = o;var s = n.bigNumberify(1);r.One = s;var a = n.bigNumberify(2);r.Two = a;var u = n.bigNumberify("1000000000000000000");r.WeiPerEther = u;var l = n.bigNumberify("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");r.MaxUint256 = l;}, { "./utils/bignumber": 62 }], 4: [function (e, t, r) {"use strict";var n,i = this && this.__extends || (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (e, t) {e.__proto__ = t;} || function (e, t) {for (var r in t) {t.hasOwnProperty(r) && (e[r] = t[r]);}}, function (e, t) {function r() {this.constructor = e;}n(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());}),o = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });var s,u = e("./constants"),l = o(e("./errors")),h = e("./utils/abi-coder"),a = e("./utils/address"),f = e("./utils/bignumber"),c = e("./utils/bytes"),d = e("./utils/interface"),p = e("./utils/properties"),v = e("./providers/abstract-provider"),y = e("./abstract-signer"),m = (s = y.Signer, i(g, s), g.prototype.getAddress = function () {return Promise.resolve(this.address);}, g.prototype._fail = function (e, t) {return Promise.resolve().then(function () {l.throwError(e, l.UNSUPPORTED_OPERATION, { operation: t });});}, g.prototype.signMessage = function (e) {return this._fail("VoidSigner cannot sign messages", "signMessage");}, g.prototype.sendTransaction = function (e) {return this._fail("VoidSigner cannot sign transactions", "sendTransaction");}, g.prototype.connect = function (e) {return new g(this.address, e);}, g);function g(e, t) {var r = s.call(this) || this;return p.defineReadOnly(r, "address", e), p.defineReadOnly(r, "provider", t), r;}r.VoidSigner = m;var b = { chainId: !0, data: !0, from: !0, gasLimit: !0, gasPrice: !0, nonce: !0, to: !0, value: !0 };function w(o, e, s) {var a = o.interface.functions[e];return function () {for (var e = [], t = 0; t < arguments.length; t++) {e[t] = arguments[t];}var i = {},r = null;if (e.length === a.inputs.length + 1 && "object" == typeof e[e.length - 1]) for (var n in null != (i = p.shallowCopy(e.pop())).blockTag && (r = i.blockTag), delete i.blockTag, i) {if (!b[n]) throw new Error("unknown transaction override " + n);}if (e.length != a.inputs.length) throw new Error("incorrect number of arguments");return ["data", "to"].forEach(function (e) {null != i[e] && l.throwError("cannot override " + e, l.UNSUPPORTED_OPERATION, { operation: e });}), i.to = o._deployed(r).then(function () {return o.addressPromise;}), function n(i, o, e) {if (Array.isArray(e)) {var s = [];return e.forEach(function (e, t) {var r = null;r = Array.isArray(o) ? o[t] : o[e.name], s.push(n(i, r, e));}), Promise.all(s);}if ("address" === e.type) return i.resolveName(o);if ("tuple" === e.type) return n(i, o, e.components);var t = e.type.match(/(.*)(\[[0-9]*\]$)/);if (t) {if (!Array.isArray(o)) throw new Error("invalid value for array");var r = [],a = { components: e.components, type: t[1] };return o.forEach(function (e) {r.push(n(i, e, a));}), Promise.all(r);}return Promise.resolve(o);}(o.provider, e, a.inputs).then(function (n) {if (i.data = a.encode(n), "call" === a.type) return s ? Promise.resolve(u.Zero) : (o.provider || l.throwError("call (constant functions) require a provider or a signer with a provider", l.UNSUPPORTED_OPERATION, { operation: "call" }), ["gasLimit", "gasPrice", "value"].forEach(function (e) {if (null != i[e]) throw new Error("call cannot override " + e);}), null == i.from && o.signer && (i.from = o.signer.getAddress()), o.provider.call(i, r).then(function (t) {if (c.hexDataLength(t) % 32 == 4 && "0x08c379a0" === c.hexDataSlice(t, 0, 4)) {var e = h.defaultAbiCoder.decode(["string"], c.hexDataSlice(t, 4));l.throwError("call revert exception", l.CALL_EXCEPTION, { address: o.address, args: n, method: a.signature, errorSignature: "Error(string)", errorArgs: [e], reason: e, transaction: i });}try {var r = a.decode(t);return 1 === a.outputs.length && (r = r[0]), r;} catch (e) {throw "0x" === t && 0 < a.outputs.length && l.throwError("call exception", l.CALL_EXCEPTION, { address: o.address, method: a.signature, args: n }), e;}}));if ("transaction" === a.type) return s ? (o.provider || l.throwError("estimate gas require a provider or a signer with a provider", l.UNSUPPORTED_OPERATION, { operation: "estimateGas" }), null == i.from && o.signer && (i.from = o.signer.getAddress()), o.provider.estimateGas(i)) : (null == i.gasLimit && null != a.gas && (i.gasLimit = f.bigNumberify(a.gas).add(21e3)), o.signer || l.throwError("sending a transaction requires a signer", l.UNSUPPORTED_OPERATION, { operation: "sendTransaction" }), null != i.from && l.throwError("cannot override from in a transaction", l.UNSUPPORTED_OPERATION, { operation: "sendTransaction" }), o.signer.sendTransaction(i).then(function (e) {var t = e.wait.bind(e);return e.wait = function (e) {return t(e).then(function (n) {return n.events = n.logs.map(function (e) {var t = p.deepCopy(e),r = o.interface.parseLog(e);return r && (t.args = r.values, t.decode = r.decode, t.event = r.name, t.eventSignature = r.signature), t.removeListener = function () {return o.provider;}, t.getBlock = function () {return o.provider.getBlock(n.blockHash);}, t.getTransaction = function () {return o.provider.getTransaction(n.transactionHash);}, t.getTransactionReceipt = function () {return Promise.resolve(n);}, t;}), n;});}, e;}));throw new Error("invalid type - " + a.type);});};}function _(e) {return !e.address || null != e.topics && 0 !== e.topics.length ? (e.address || "*") + "@" + (e.topics ? e.topics.join(":") : "") : "*";}var M = (A.prototype.deployed = function () {return this._deployed();}, A.prototype._deployed = function (e) {var t = this;return this._deployedPromise || (this.deployTransaction ? this._deployedPromise = this.deployTransaction.wait().then(function () {return t;}) : this._deployedPromise = this.provider.getCode(this.address, e).then(function (e) {return "0x" === e && l.throwError("contract not deployed", l.UNSUPPORTED_OPERATION, { contractAddress: t.address, operation: "getDeployed" }), t;})), this._deployedPromise;}, A.prototype.fallback = function (e) {var t = this;this.signer || l.throwError("sending a transaction requires a signer", l.UNSUPPORTED_OPERATION, { operation: "sendTransaction(fallback)" });var r = p.shallowCopy(e || {});return ["from", "to"].forEach(function (e) {null != r[e] && l.throwError("cannot override " + e, l.UNSUPPORTED_OPERATION, { operation: e });}), r.to = this.addressPromise, this.deployed().then(function () {return t.signer.sendTransaction(r);});}, A.prototype.connect = function (e) {"string" == typeof e && (e = new m(e, this.provider));var t = new A(this.address, this.interface, e);return this.deployTransaction && p.defineReadOnly(t, "deployTransaction", this.deployTransaction), t;}, A.prototype.attach = function (e) {return new A(e, this.interface, this.signer || this.provider);}, A.isIndexed = function (e) {return d.Interface.isIndexed(e);}, A.prototype._getEventFilter = function (e) {var r = this;if ("string" == typeof e) {if ("*" === e) return { prepareEvent: function prepareEvent(e) {var t = r.interface.parseLog(e);return t && (e.args = t.values, e.decode = t.decode, e.event = t.name, e.eventSignature = t.signature), [e];}, eventTag: "*", filter: { address: this.address } };-1 !== e.indexOf("(") && (e = h.formatSignature(h.parseSignature("event " + e)));var n = this.interface.events[e];n || l.throwError("unknown event - " + e, l.INVALID_ARGUMENT, { argumnet: "eventName", value: e });var t = { address: this.address, topics: [n.topic] };return { prepareEvent: function prepareEvent(e) {var t = n.decode(e.data, e.topics);e.args = t;var r = Array.prototype.slice.call(t);return r.push(e), r;}, event: n, eventTag: _(t), filter: t };}var i = { address: this.address },o = null;if (e.topics && e.topics[0]) for (var s in i.topics = e.topics, this.interface.events) {if (-1 !== s.indexOf("(")) {var a = this.interface.events[s];if (a.topic === e.topics[0].toLowerCase()) {o = a;break;}}}return { prepareEvent: function prepareEvent(e) {if (!o) return [e];var t = o.decode(e.data, e.topics);e.args = t;var r = Array.prototype.slice.call(t);return r.push(e), r;}, event: o, eventTag: _(i), filter: i };}, A.prototype._addEventListener = function (n, i, e) {var o = this;function t(e) {var t = p.deepCopy(e),r = n.prepareEvent(t);n.event && (t.decode = n.event.decode, t.event = n.event.name, t.eventSignature = n.event.signature), t.removeListener = function () {o.removeListener(n.filter, i);}, t.getBlock = function () {return o.provider.getBlock(e.blockHash);}, t.getTransaction = function () {return o.provider.getTransaction(e.transactionHash);}, t.getTransactionReceipt = function () {return o.provider.getTransactionReceipt(e.transactionHash);}, o.emit.apply(o, [n.filter].concat(r));}this.provider || l.throwError("events require a provider or a signer with a provider", l.UNSUPPORTED_OPERATION, { operation: "once" }), this.provider.on(n.filter, t), this._events.push({ eventFilter: n, listener: i, wrappedListener: t, once: e });}, A.prototype.on = function (e, t) {return this._addEventListener(this._getEventFilter(e), t, !1), this;}, A.prototype.once = function (e, t) {return this._addEventListener(this._getEventFilter(e), t, !0), this;}, A.prototype.addListener = function (e, t) {return this.on(e, t);}, A.prototype.emit = function (e) {for (var t = this, r = [], n = 1; n < arguments.length; n++) {r[n - 1] = arguments[n];}if (!this.provider) return !1;var i = !1,o = this._getEventFilter(e);return this._events = this._events.filter(function (e) {return e.eventFilter.eventTag !== o.eventTag || (setTimeout(function () {e.listener.apply(t, r);}, 0), i = !0, !e.once);}), i;}, A.prototype.listenerCount = function (e) {if (!this.provider) return 0;var t = this._getEventFilter(e);return this._events.filter(function (e) {return e.eventFilter.eventTag === t.eventTag;}).length;}, A.prototype.listeners = function (e) {if (!this.provider) return [];var t = this._getEventFilter(e);return this._events.filter(function (e) {return e.eventFilter.eventTag === t.eventTag;}).map(function (e) {return e.listener;});}, A.prototype.removeAllListeners = function (e) {var t = this;if (!this.provider) return this;var r = this._getEventFilter(e);return this._events = this._events.filter(function (e) {return e.eventFilter.eventTag !== r.eventTag || (t.provider.removeListener(e.eventFilter.filter, e.wrappedListener), !1);}), this;}, A.prototype.removeListener = function (e, t) {var r = this;if (!this.provider) return this;var n = !1,i = this._getEventFilter(e);return this._events = this._events.filter(function (e) {return e.eventFilter.eventTag !== i.eventTag || e.listener !== t || (r.provider.removeListener(e.eventFilter.filter, e.wrappedListener), !!n || !(n = !0));}), this;}, A);function A(t, e, r) {var n = this;if (l.checkNew(this, A), d.Interface.isInterface(e) ? p.defineReadOnly(this, "interface", e) : p.defineReadOnly(this, "interface", new d.Interface(e)), y.Signer.isSigner(r) ? (p.defineReadOnly(this, "provider", r.provider), p.defineReadOnly(this, "signer", r)) : v.Provider.isProvider(r) ? (p.defineReadOnly(this, "provider", r), p.defineReadOnly(this, "signer", null)) : l.throwError("invalid signer or provider", l.INVALID_ARGUMENT, { arg: "signerOrProvider", value: r }), p.defineReadOnly(this, "estimate", {}), p.defineReadOnly(this, "functions", {}), p.defineReadOnly(this, "filters", {}), Object.keys(this.interface.events).forEach(function (e) {var r = n.interface.events[e];p.defineReadOnly(n.filters, e, function () {for (var e = [], t = 0; t < arguments.length; t++) {e[t] = arguments[t];}return { address: n.address, topics: r.encodeTopics(e) };});}), this._events = [], p.defineReadOnly(this, "address", t), this.provider) p.defineReadOnly(this, "addressPromise", this.provider.resolveName(t).then(function (e) {if (null == e) throw new Error("name not found");return e;}).catch(function (e) {throw e;}));else try {p.defineReadOnly(this, "addressPromise", Promise.resolve(a.getAddress(t)));} catch (e) {l.throwError("provider is required to use non-address contract address", l.INVALID_ARGUMENT, { argument: "addressOrName", value: t });}Object.keys(this.interface.functions).forEach(function (e) {var t = w(n, e, !1);null == n[e] ? p.defineReadOnly(n, e, t) : l.warn("WARNING: Multiple definitions for " + e), null == n.functions[e] && (p.defineReadOnly(n.functions, e, t), p.defineReadOnly(n.estimate, e, w(n, e, !0)));});}r.Contract = M;var E = (S.prototype.getDeployTransaction = function () {for (var e = [], t = 0; t < arguments.length; t++) {e[t] = arguments[t];}var r = {};if (e.length === this.interface.deployFunction.inputs.length + 1) for (var n in r = p.shallowCopy(e.pop())) {if (!b[n]) throw new Error("unknown transaction override " + n);}return ["data", "from", "to"].forEach(function (e) {null != r[e] && l.throwError("cannot override " + e, l.UNSUPPORTED_OPERATION, { operation: e });}), l.checkArgumentCount(e.length, this.interface.deployFunction.inputs.length, " in Contract constructor"), r.data = this.interface.deployFunction.encode(this.bytecode, e), r;}, S.prototype.deploy = function () {for (var r = this, e = [], t = 0; t < arguments.length; t++) {e[t] = arguments[t];}var n = this.getDeployTransaction.apply(this, e);return this.signer.sendTransaction(n).then(function (e) {var t = new M(a.getContractAddress(e), r.interface, r.signer);return p.defineReadOnly(t, "deployTransaction", e), t;});}, S.prototype.attach = function (e) {return new M(e, this.interface, this.signer);}, S.prototype.connect = function (e) {return new S(this.interface, this.bytecode, e);}, S.fromSolidity = function (e, t) {null == e && l.throwError("missing compiler output", l.MISSING_ARGUMENT, { argument: "compilerOutput" }), "string" == typeof e && (e = JSON.parse(e));var r = e.abi,n = null;return e.bytecode ? n = e.bytecode : e.evm && e.evm.bytecode && (n = e.evm.bytecode), new S(r, n, t);}, S);function S(e, t, r) {var n = null;"string" == typeof t ? n = t : c.isArrayish(t) ? n = c.hexlify(t) : "string" == typeof t.object ? n = t.object : l.throwError("bytecode must be a valid hex string", l.INVALID_ARGUMENT, { arg: "bytecode", value: t }), "0x" !== n.substring(0, 2) && (n = "0x" + n), c.isHexString(n) || l.throwError("bytecode must be a valid hex string", l.INVALID_ARGUMENT, { arg: "bytecode", value: t }), n.length % 2 != 0 && l.throwError("bytecode must be valid data (even length)", l.INVALID_ARGUMENT, { arg: "bytecode", value: t }), p.defineReadOnly(this, "bytecode", n), d.Interface.isInterface(e) ? p.defineReadOnly(this, "interface", e) : p.defineReadOnly(this, "interface", new d.Interface(e)), r && !y.Signer.isSigner(r) && l.throwError("invalid signer", l.INVALID_ARGUMENT, { arg: "signer", value: null }), p.defineReadOnly(this, "signer", r || null);}r.ContractFactory = E;}, { "./abstract-signer": 2, "./constants": 3, "./errors": 5, "./providers/abstract-provider": 49, "./utils/abi-coder": 58, "./utils/address": 59, "./utils/bignumber": 62, "./utils/bytes": 63, "./utils/interface": 68, "./utils/properties": 73 }], 5: [function (e, t, s) {"use strict";Object.defineProperty(s, "__esModule", { value: !0 });var a = e("./_version");s.UNKNOWN_ERROR = "UNKNOWN_ERROR", s.NOT_IMPLEMENTED = "NOT_IMPLEMENTED", s.MISSING_NEW = "MISSING_NEW", s.CALL_EXCEPTION = "CALL_EXCEPTION", s.INVALID_ARGUMENT = "INVALID_ARGUMENT", s.MISSING_ARGUMENT = "MISSING_ARGUMENT", s.UNEXPECTED_ARGUMENT = "UNEXPECTED_ARGUMENT", s.NUMERIC_FAULT = "NUMERIC_FAULT", s.INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS", s.NONCE_EXPIRED = "NONCE_EXPIRED", s.REPLACEMENT_UNDERPRICED = "REPLACEMENT_UNDERPRICED";var r = !(s.UNSUPPORTED_OPERATION = "UNSUPPORTED_OPERATION"),u = !1;function n(e, t, r) {if (u) throw new Error("unknown error");t = t || s.UNKNOWN_ERROR, r = r || {};var n = [];Object.keys(r).forEach(function (t) {try {n.push(t + "=" + JSON.stringify(r[t]));} catch (e) {n.push(t + "=" + JSON.stringify(r[t].toString()));}}), n.push("version=" + a.version);var i = e;n.length && (e += " (" + n.join(", ") + ")");var o = new Error(e);throw o.reason = i, o.code = t, Object.keys(r).forEach(function (e) {o[e] = r[e];}), o;}s.throwError = n, s.checkNew = function (e, t) {e instanceof t || n("missing new", s.MISSING_NEW, { name: t.name });}, s.checkArgumentCount = function (e, t, r) {r = r || "", e < t && n("missing argument" + r, s.MISSING_ARGUMENT, { count: e, expectedCount: t }), t < e && n("too many arguments" + r, s.UNEXPECTED_ARGUMENT, { count: e, expectedCount: t });}, s.setCensorship = function (e, t) {r && n("error censorship permanent", s.UNSUPPORTED_OPERATION, { operation: "setCensorship" }), u = !!e, r = !!t;}, s.checkNormalize = function () {try {if (["NFD", "NFC", "NFKD", "NFKC"].forEach(function (t) {try {"test".normalize(t);} catch (e) {throw new Error("missing " + t);}}), String.fromCharCode(233).normalize("NFD") !== String.fromCharCode(101, 769)) throw new Error("broken implementation");} catch (e) {n("platform missing String.prototype.normalize", s.UNSUPPORTED_OPERATION, { operation: "String.prototype.normalize", form: e.message });}};var i = { debug: 1, default: 2, info: 2, warn: 3, error: 4, off: 5 },o = i.default;function l(e, t) {o > i[e] || console.log.apply(console, t);}function h() {for (var e = [], t = 0; t < arguments.length; t++) {e[t] = arguments[t];}l("warn", e);}s.setLogLevel = function (e) {var t = i[e];null != t ? o = t : h("invliad log level - " + e);}, s.warn = h, s.info = function () {for (var e = [], t = 0; t < arguments.length; t++) {e[t] = arguments[t];}l("info", e);};}, { "./_version": 1 }], 6: [function (e, t, r) {"use strict";var n = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });var i = e("./contract");r.Contract = i.Contract, r.ContractFactory = i.ContractFactory, r.VoidSigner = i.VoidSigner;var o = e("./abstract-signer");r.Signer = o.Signer;var s = e("./wallet");r.Wallet = s.Wallet;var a = n(e("./constants"));r.constants = a;var u = n(e("./errors"));r.errors = u;var l = n(e("./providers"));r.providers = l;var h = n(e("./utils"));r.utils = h;var f = n(e("./wordlists"));r.wordlists = f;var c = e("./utils/shims");r.platform = c.platform;var d = e("./_version");r.version = d.version, r.getDefaultProvider = function (e) {null == e && (e = "homestead");var t = h.getNetwork(e);return t && t._defaultProvider || u.throwError("unsupported getDefaultProvider network", u.UNSUPPORTED_OPERATION, { operation: "getDefaultProvider", network: e }), t._defaultProvider(l);};}, { "./_version": 1, "./abstract-signer": 2, "./constants": 3, "./contract": 4, "./errors": 5, "./providers": 53, "./utils": 67, "./utils/shims": 79, "./wallet": 87, "./wordlists": 88 }], 7: [function (e, t, r) {"use strict";var n = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });var i = n(e("./ethers"));r.ethers = i, function (e) {for (var t in e) {r.hasOwnProperty(t) || (r[t] = e[t]);}}(e("./ethers"));}, { "./ethers": 6 }], 8: [function (e, C, B) {"use strict";!function (e) {function r(e) {return parseInt(e) === e;}function n(e) {if (!r(e.length)) return !1;for (var t = 0; t < e.length; t++) {if (!r(e[t]) || e[t] < 0 || 255 < e[t]) return !1;}return !0;}function o(e, t) {if (e.buffer && ArrayBuffer.isView(e) && "Uint8Array" === e.name) return t && (e = e.slice ? e.slice() : Array.prototype.slice.call(e)), e;if (Array.isArray(e)) {if (!n(e)) throw new Error("Array contains invalid value: " + e);return new Uint8Array(e);}if (r(e.length) && n(e)) return new Uint8Array(e);throw new Error("unsupported array-like object");}function u(e) {return new Uint8Array(e);}function s(e, t, r, n, i) {null == n && null == i || (e = e.slice ? e.slice(n, i) : Array.prototype.slice.call(e, n, i)), t.set(e, r);}var i,t = { toBytes: function toBytes(e) {var t = [],r = 0;for (e = encodeURI(e); r < e.length;) {var n = e.charCodeAt(r++);37 === n ? (t.push(parseInt(e.substr(r, 2), 16)), r += 2) : t.push(n);}return o(t);}, fromBytes: function fromBytes(e) {for (var t = [], r = 0; r < e.length;) {var n = e[r];n < 128 ? (t.push(String.fromCharCode(n)), r++) : 191 < n && n < 224 ? (t.push(String.fromCharCode((31 & n) << 6 | 63 & e[r + 1])), r += 2) : (t.push(String.fromCharCode((15 & n) << 12 | (63 & e[r + 1]) << 6 | 63 & e[r + 2])), r += 3);}return t.join("");} },a = (i = "0123456789abcdef", { toBytes: function toBytes(e) {for (var t = [], r = 0; r < e.length; r += 2) {t.push(parseInt(e.substr(r, 2), 16));}return t;}, fromBytes: function fromBytes(e) {for (var t = [], r = 0; r < e.length; r++) {var n = e[r];t.push(i[(240 & n) >> 4] + i[15 & n]);}return t.join("");} }),f = { 16: 10, 24: 12, 32: 14 },c = [1, 2, 4, 8, 16, 32, 64, 128, 27, 54, 108, 216, 171, 77, 154, 47, 94, 188, 99, 198, 151, 53, 106, 212, 179, 125, 250, 239, 197, 145],d = [99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22],l = [82, 9, 106, 213, 48, 54, 165, 56, 191, 64, 163, 158, 129, 243, 215, 251, 124, 227, 57, 130, 155, 47, 255, 135, 52, 142, 67, 68, 196, 222, 233, 203, 84, 123, 148, 50, 166, 194, 35, 61, 238, 76, 149, 11, 66, 250, 195, 78, 8, 46, 161, 102, 40, 217, 36, 178, 118, 91, 162, 73, 109, 139, 209, 37, 114, 248, 246, 100, 134, 104, 152, 22, 212, 164, 92, 204, 93, 101, 182, 146, 108, 112, 72, 80, 253, 237, 185, 218, 94, 21, 70, 87, 167, 141, 157, 132, 144, 216, 171, 0, 140, 188, 211, 10, 247, 228, 88, 5, 184, 179, 69, 6, 208, 44, 30, 143, 202, 63, 15, 2, 193, 175, 189, 3, 1, 19, 138, 107, 58, 145, 17, 65, 79, 103, 220, 234, 151, 242, 207, 206, 240, 180, 230, 115, 150, 172, 116, 34, 231, 173, 53, 133, 226, 249, 55, 232, 28, 117, 223, 110, 71, 241, 26, 113, 29, 41, 197, 137, 111, 183, 98, 14, 170, 24, 190, 27, 252, 86, 62, 75, 198, 210, 121, 32, 154, 219, 192, 254, 120, 205, 90, 244, 31, 221, 168, 51, 136, 7, 199, 49, 177, 18, 16, 89, 39, 128, 236, 95, 96, 81, 127, 169, 25, 181, 74, 13, 45, 229, 122, 159, 147, 201, 156, 239, 160, 224, 59, 77, 174, 42, 245, 176, 200, 235, 187, 60, 131, 83, 153, 97, 23, 43, 4, 126, 186, 119, 214, 38, 225, 105, 20, 99, 85, 33, 12, 125],h = [3328402341, 4168907908, 4000806809, 4135287693, 4294111757, 3597364157, 3731845041, 2445657428, 1613770832, 33620227, 3462883241, 1445669757, 3892248089, 3050821474, 1303096294, 3967186586, 2412431941, 528646813, 2311702848, 4202528135, 4026202645, 2992200171, 2387036105, 4226871307, 1101901292, 3017069671, 1604494077, 1169141738, 597466303, 1403299063, 3832705686, 2613100635, 1974974402, 3791519004, 1033081774, 1277568618, 1815492186, 2118074177, 4126668546, 2211236943, 1748251740, 1369810420, 3521504564, 4193382664, 3799085459, 2883115123, 1647391059, 706024767, 134480908, 2512897874, 1176707941, 2646852446, 806885416, 932615841, 168101135, 798661301, 235341577, 605164086, 461406363, 3756188221, 3454790438, 1311188841, 2142417613, 3933566367, 302582043, 495158174, 1479289972, 874125870, 907746093, 3698224818, 3025820398, 1537253627, 2756858614, 1983593293, 3084310113, 2108928974, 1378429307, 3722699582, 1580150641, 327451799, 2790478837, 3117535592, 0, 3253595436, 1075847264, 3825007647, 2041688520, 3059440621, 3563743934, 2378943302, 1740553945, 1916352843, 2487896798, 2555137236, 2958579944, 2244988746, 3151024235, 3320835882, 1336584933, 3992714006, 2252555205, 2588757463, 1714631509, 293963156, 2319795663, 3925473552, 67240454, 4269768577, 2689618160, 2017213508, 631218106, 1269344483, 2723238387, 1571005438, 2151694528, 93294474, 1066570413, 563977660, 1882732616, 4059428100, 1673313503, 2008463041, 2950355573, 1109467491, 537923632, 3858759450, 4260623118, 3218264685, 2177748300, 403442708, 638784309, 3287084079, 3193921505, 899127202, 2286175436, 773265209, 2479146071, 1437050866, 4236148354, 2050833735, 3362022572, 3126681063, 840505643, 3866325909, 3227541664, 427917720, 2655997905, 2749160575, 1143087718, 1412049534, 999329963, 193497219, 2353415882, 3354324521, 1807268051, 672404540, 2816401017, 3160301282, 369822493, 2916866934, 3688947771, 1681011286, 1949973070, 336202270, 2454276571, 201721354, 1210328172, 3093060836, 2680341085, 3184776046, 1135389935, 3294782118, 965841320, 831886756, 3554993207, 4068047243, 3588745010, 2345191491, 1849112409, 3664604599, 26054028, 2983581028, 2622377682, 1235855840, 3630984372, 2891339514, 4092916743, 3488279077, 3395642799, 4101667470, 1202630377, 268961816, 1874508501, 4034427016, 1243948399, 1546530418, 941366308, 1470539505, 1941222599, 2546386513, 3421038627, 2715671932, 3899946140, 1042226977, 2521517021, 1639824860, 227249030, 260737669, 3765465232, 2084453954, 1907733956, 3429263018, 2420656344, 100860677, 4160157185, 470683154, 3261161891, 1781871967, 2924959737, 1773779408, 394692241, 2579611992, 974986535, 664706745, 3655459128, 3958962195, 731420851, 571543859, 3530123707, 2849626480, 126783113, 865375399, 765172662, 1008606754, 361203602, 3387549984, 2278477385, 2857719295, 1344809080, 2782912378, 59542671, 1503764984, 160008576, 437062935, 1707065306, 3622233649, 2218934982, 3496503480, 2185314755, 697932208, 1512910199, 504303377, 2075177163, 2824099068, 1841019862, 739644986],p = [2781242211, 2230877308, 2582542199, 2381740923, 234877682, 3184946027, 2984144751, 1418839493, 1348481072, 50462977, 2848876391, 2102799147, 434634494, 1656084439, 3863849899, 2599188086, 1167051466, 2636087938, 1082771913, 2281340285, 368048890, 3954334041, 3381544775, 201060592, 3963727277, 1739838676, 4250903202, 3930435503, 3206782108, 4149453988, 2531553906, 1536934080, 3262494647, 484572669, 2923271059, 1783375398, 1517041206, 1098792767, 49674231, 1334037708, 1550332980, 4098991525, 886171109, 150598129, 2481090929, 1940642008, 1398944049, 1059722517, 201851908, 1385547719, 1699095331, 1587397571, 674240536, 2704774806, 252314885, 3039795866, 151914247, 908333586, 2602270848, 1038082786, 651029483, 1766729511, 3447698098, 2682942837, 454166793, 2652734339, 1951935532, 775166490, 758520603, 3000790638, 4004797018, 4217086112, 4137964114, 1299594043, 1639438038, 3464344499, 2068982057, 1054729187, 1901997871, 2534638724, 4121318227, 1757008337, 0, 750906861, 1614815264, 535035132, 3363418545, 3988151131, 3201591914, 1183697867, 3647454910, 1265776953, 3734260298, 3566750796, 3903871064, 1250283471, 1807470800, 717615087, 3847203498, 384695291, 3313910595, 3617213773, 1432761139, 2484176261, 3481945413, 283769337, 100925954, 2180939647, 4037038160, 1148730428, 3123027871, 3813386408, 4087501137, 4267549603, 3229630528, 2315620239, 2906624658, 3156319645, 1215313976, 82966005, 3747855548, 3245848246, 1974459098, 1665278241, 807407632, 451280895, 251524083, 1841287890, 1283575245, 337120268, 891687699, 801369324, 3787349855, 2721421207, 3431482436, 959321879, 1469301956, 4065699751, 2197585534, 1199193405, 2898814052, 3887750493, 724703513, 2514908019, 2696962144, 2551808385, 3516813135, 2141445340, 1715741218, 2119445034, 2872807568, 2198571144, 3398190662, 700968686, 3547052216, 1009259540, 2041044702, 3803995742, 487983883, 1991105499, 1004265696, 1449407026, 1316239930, 504629770, 3683797321, 168560134, 1816667172, 3837287516, 1570751170, 1857934291, 4014189740, 2797888098, 2822345105, 2754712981, 936633572, 2347923833, 852879335, 1133234376, 1500395319, 3084545389, 2348912013, 1689376213, 3533459022, 3762923945, 3034082412, 4205598294, 133428468, 634383082, 2949277029, 2398386810, 3913789102, 403703816, 3580869306, 2297460856, 1867130149, 1918643758, 607656988, 4049053350, 3346248884, 1368901318, 600565992, 2090982877, 2632479860, 557719327, 3717614411, 3697393085, 2249034635, 2232388234, 2430627952, 1115438654, 3295786421, 2865522278, 3633334344, 84280067, 33027830, 303828494, 2747425121, 1600795957, 4188952407, 3496589753, 2434238086, 1486471617, 658119965, 3106381470, 953803233, 334231800, 3005978776, 857870609, 3151128937, 1890179545, 2298973838, 2805175444, 3056442267, 574365214, 2450884487, 550103529, 1233637070, 4289353045, 2018519080, 2057691103, 2399374476, 4166623649, 2148108681, 387583245, 3664101311, 836232934, 3330556482, 3100665960, 3280093505, 2955516313, 2002398509, 287182607, 3413881008, 4238890068, 3597515707, 975967766],v = [1671808611, 2089089148, 2006576759, 2072901243, 4061003762, 1807603307, 1873927791, 3310653893, 810573872, 16974337, 1739181671, 729634347, 4263110654, 3613570519, 2883997099, 1989864566, 3393556426, 2191335298, 3376449993, 2106063485, 4195741690, 1508618841, 1204391495, 4027317232, 2917941677, 3563566036, 2734514082, 2951366063, 2629772188, 2767672228, 1922491506, 3227229120, 3082974647, 4246528509, 2477669779, 644500518, 911895606, 1061256767, 4144166391, 3427763148, 878471220, 2784252325, 3845444069, 4043897329, 1905517169, 3631459288, 827548209, 356461077, 67897348, 3344078279, 593839651, 3277757891, 405286936, 2527147926, 84871685, 2595565466, 118033927, 305538066, 2157648768, 3795705826, 3945188843, 661212711, 2999812018, 1973414517, 152769033, 2208177539, 745822252, 439235610, 455947803, 1857215598, 1525593178, 2700827552, 1391895634, 994932283, 3596728278, 3016654259, 695947817, 3812548067, 795958831, 2224493444, 1408607827, 3513301457, 0, 3979133421, 543178784, 4229948412, 2982705585, 1542305371, 1790891114, 3410398667, 3201918910, 961245753, 1256100938, 1289001036, 1491644504, 3477767631, 3496721360, 4012557807, 2867154858, 4212583931, 1137018435, 1305975373, 861234739, 2241073541, 1171229253, 4178635257, 33948674, 2139225727, 1357946960, 1011120188, 2679776671, 2833468328, 1374921297, 2751356323, 1086357568, 2408187279, 2460827538, 2646352285, 944271416, 4110742005, 3168756668, 3066132406, 3665145818, 560153121, 271589392, 4279952895, 4077846003, 3530407890, 3444343245, 202643468, 322250259, 3962553324, 1608629855, 2543990167, 1154254916, 389623319, 3294073796, 2817676711, 2122513534, 1028094525, 1689045092, 1575467613, 422261273, 1939203699, 1621147744, 2174228865, 1339137615, 3699352540, 577127458, 712922154, 2427141008, 2290289544, 1187679302, 3995715566, 3100863416, 339486740, 3732514782, 1591917662, 186455563, 3681988059, 3762019296, 844522546, 978220090, 169743370, 1239126601, 101321734, 611076132, 1558493276, 3260915650, 3547250131, 2901361580, 1655096418, 2443721105, 2510565781, 3828863972, 2039214713, 3878868455, 3359869896, 928607799, 1840765549, 2374762893, 3580146133, 1322425422, 2850048425, 1823791212, 1459268694, 4094161908, 3928346602, 1706019429, 2056189050, 2934523822, 135794696, 3134549946, 2022240376, 628050469, 779246638, 472135708, 2800834470, 3032970164, 3327236038, 3894660072, 3715932637, 1956440180, 522272287, 1272813131, 3185336765, 2340818315, 2323976074, 1888542832, 1044544574, 3049550261, 1722469478, 1222152264, 50660867, 4127324150, 236067854, 1638122081, 895445557, 1475980887, 3117443513, 2257655686, 3243809217, 489110045, 2662934430, 3778599393, 4162055160, 2561878936, 288563729, 1773916777, 3648039385, 2391345038, 2493985684, 2612407707, 505560094, 2274497927, 3911240169, 3460925390, 1442818645, 678973480, 3749357023, 2358182796, 2717407649, 2306869641, 219617805, 3218761151, 3862026214, 1120306242, 1756942440, 1103331905, 2578459033, 762796589, 252780047, 2966125488, 1425844308, 3151392187, 372911126],y = [1667474886, 2088535288, 2004326894, 2071694838, 4075949567, 1802223062, 1869591006, 3318043793, 808472672, 16843522, 1734846926, 724270422, 4278065639, 3621216949, 2880169549, 1987484396, 3402253711, 2189597983, 3385409673, 2105378810, 4210693615, 1499065266, 1195886990, 4042263547, 2913856577, 3570689971, 2728590687, 2947541573, 2627518243, 2762274643, 1920112356, 3233831835, 3082273397, 4261223649, 2475929149, 640051788, 909531756, 1061110142, 4160160501, 3435941763, 875846760, 2779116625, 3857003729, 4059105529, 1903268834, 3638064043, 825316194, 353713962, 67374088, 3351728789, 589522246, 3284360861, 404236336, 2526454071, 84217610, 2593830191, 117901582, 303183396, 2155911963, 3806477791, 3958056653, 656894286, 2998062463, 1970642922, 151591698, 2206440989, 741110872, 437923380, 454765878, 1852748508, 1515908788, 2694904667, 1381168804, 993742198, 3604373943, 3014905469, 690584402, 3823320797, 791638366, 2223281939, 1398011302, 3520161977, 0, 3991743681, 538992704, 4244381667, 2981218425, 1532751286, 1785380564, 3419096717, 3200178535, 960056178, 1246420628, 1280103576, 1482221744, 3486468741, 3503319995, 4025428677, 2863326543, 4227536621, 1128514950, 1296947098, 859002214, 2240123921, 1162203018, 4193849577, 33687044, 2139062782, 1347481760, 1010582648, 2678045221, 2829640523, 1364325282, 2745433693, 1077985408, 2408548869, 2459086143, 2644360225, 943212656, 4126475505, 3166494563, 3065430391, 3671750063, 555836226, 269496352, 4294908645, 4092792573, 3537006015, 3452783745, 202118168, 320025894, 3974901699, 1600119230, 2543297077, 1145359496, 387397934, 3301201811, 2812801621, 2122220284, 1027426170, 1684319432, 1566435258, 421079858, 1936954854, 1616945344, 2172753945, 1330631070, 3705438115, 572679748, 707427924, 2425400123, 2290647819, 1179044492, 4008585671, 3099120491, 336870440, 3739122087, 1583276732, 185277718, 3688593069, 3772791771, 842159716, 976899700, 168435220, 1229577106, 101059084, 606366792, 1549591736, 3267517855, 3553849021, 2897014595, 1650632388, 2442242105, 2509612081, 3840161747, 2038008818, 3890688725, 3368567691, 926374254, 1835907034, 2374863873, 3587531953, 1313788572, 2846482505, 1819063512, 1448540844, 4109633523, 3941213647, 1701162954, 2054852340, 2930698567, 134748176, 3132806511, 2021165296, 623210314, 774795868, 471606328, 2795958615, 3031746419, 3334885783, 3907527627, 3722280097, 1953799400, 522133822, 1263263126, 3183336545, 2341176845, 2324333839, 1886425312, 1044267644, 3048588401, 1718004428, 1212733584, 50529542, 4143317495, 235803164, 1633788866, 892690282, 1465383342, 3115962473, 2256965911, 3250673817, 488449850, 2661202215, 3789633753, 4177007595, 2560144171, 286339874, 1768537042, 3654906025, 2391705863, 2492770099, 2610673197, 505291324, 2273808917, 3924369609, 3469625735, 1431699370, 673740880, 3755965093, 2358021891, 2711746649, 2307489801, 218961690, 3217021541, 3873845719, 1111672452, 1751693520, 1094828930, 2576986153, 757954394, 252645662, 2964376443, 1414855848, 3149649517, 370555436],m = [1374988112, 2118214995, 437757123, 975658646, 1001089995, 530400753, 2902087851, 1273168787, 540080725, 2910219766, 2295101073, 4110568485, 1340463100, 3307916247, 641025152, 3043140495, 3736164937, 632953703, 1172967064, 1576976609, 3274667266, 2169303058, 2370213795, 1809054150, 59727847, 361929877, 3211623147, 2505202138, 3569255213, 1484005843, 1239443753, 2395588676, 1975683434, 4102977912, 2572697195, 666464733, 3202437046, 4035489047, 3374361702, 2110667444, 1675577880, 3843699074, 2538681184, 1649639237, 2976151520, 3144396420, 4269907996, 4178062228, 1883793496, 2403728665, 2497604743, 1383856311, 2876494627, 1917518562, 3810496343, 1716890410, 3001755655, 800440835, 2261089178, 3543599269, 807962610, 599762354, 33778362, 3977675356, 2328828971, 2809771154, 4077384432, 1315562145, 1708848333, 101039829, 3509871135, 3299278474, 875451293, 2733856160, 92987698, 2767645557, 193195065, 1080094634, 1584504582, 3178106961, 1042385657, 2531067453, 3711829422, 1306967366, 2438237621, 1908694277, 67556463, 1615861247, 429456164, 3602770327, 2302690252, 1742315127, 2968011453, 126454664, 3877198648, 2043211483, 2709260871, 2084704233, 4169408201, 0, 159417987, 841739592, 504459436, 1817866830, 4245618683, 260388950, 1034867998, 908933415, 168810852, 1750902305, 2606453969, 607530554, 202008497, 2472011535, 3035535058, 463180190, 2160117071, 1641816226, 1517767529, 470948374, 3801332234, 3231722213, 1008918595, 303765277, 235474187, 4069246893, 766945465, 337553864, 1475418501, 2943682380, 4003061179, 2743034109, 4144047775, 1551037884, 1147550661, 1543208500, 2336434550, 3408119516, 3069049960, 3102011747, 3610369226, 1113818384, 328671808, 2227573024, 2236228733, 3535486456, 2935566865, 3341394285, 496906059, 3702665459, 226906860, 2009195472, 733156972, 2842737049, 294930682, 1206477858, 2835123396, 2700099354, 1451044056, 573804783, 2269728455, 3644379585, 2362090238, 2564033334, 2801107407, 2776292904, 3669462566, 1068351396, 742039012, 1350078989, 1784663195, 1417561698, 4136440770, 2430122216, 775550814, 2193862645, 2673705150, 1775276924, 1876241833, 3475313331, 3366754619, 270040487, 3902563182, 3678124923, 3441850377, 1851332852, 3969562369, 2203032232, 3868552805, 2868897406, 566021896, 4011190502, 3135740889, 1248802510, 3936291284, 699432150, 832877231, 708780849, 3332740144, 899835584, 1951317047, 4236429990, 3767586992, 866637845, 4043610186, 1106041591, 2144161806, 395441711, 1984812685, 1139781709, 3433712980, 3835036895, 2664543715, 1282050075, 3240894392, 1181045119, 2640243204, 25965917, 4203181171, 4211818798, 3009879386, 2463879762, 3910161971, 1842759443, 2597806476, 933301370, 1509430414, 3943906441, 3467192302, 3076639029, 3776767469, 2051518780, 2631065433, 1441952575, 404016761, 1942435775, 1408749034, 1610459739, 3745345300, 2017778566, 3400528769, 3110650942, 941896748, 3265478751, 371049330, 3168937228, 675039627, 4279080257, 967311729, 135050206, 3635733660, 1683407248, 2076935265, 3576870512, 1215061108, 3501741890],g = [1347548327, 1400783205, 3273267108, 2520393566, 3409685355, 4045380933, 2880240216, 2471224067, 1428173050, 4138563181, 2441661558, 636813900, 4233094615, 3620022987, 2149987652, 2411029155, 1239331162, 1730525723, 2554718734, 3781033664, 46346101, 310463728, 2743944855, 3328955385, 3875770207, 2501218972, 3955191162, 3667219033, 768917123, 3545789473, 692707433, 1150208456, 1786102409, 2029293177, 1805211710, 3710368113, 3065962831, 401639597, 1724457132, 3028143674, 409198410, 2196052529, 1620529459, 1164071807, 3769721975, 2226875310, 486441376, 2499348523, 1483753576, 428819965, 2274680428, 3075636216, 598438867, 3799141122, 1474502543, 711349675, 129166120, 53458370, 2592523643, 2782082824, 4063242375, 2988687269, 3120694122, 1559041666, 730517276, 2460449204, 4042459122, 2706270690, 3446004468, 3573941694, 533804130, 2328143614, 2637442643, 2695033685, 839224033, 1973745387, 957055980, 2856345839, 106852767, 1371368976, 4181598602, 1033297158, 2933734917, 1179510461, 3046200461, 91341917, 1862534868, 4284502037, 605657339, 2547432937, 3431546947, 2003294622, 3182487618, 2282195339, 954669403, 3682191598, 1201765386, 3917234703, 3388507166, 0, 2198438022, 1211247597, 2887651696, 1315723890, 4227665663, 1443857720, 507358933, 657861945, 1678381017, 560487590, 3516619604, 975451694, 2970356327, 261314535, 3535072918, 2652609425, 1333838021, 2724322336, 1767536459, 370938394, 182621114, 3854606378, 1128014560, 487725847, 185469197, 2918353863, 3106780840, 3356761769, 2237133081, 1286567175, 3152976349, 4255350624, 2683765030, 3160175349, 3309594171, 878443390, 1988838185, 3704300486, 1756818940, 1673061617, 3403100636, 272786309, 1075025698, 545572369, 2105887268, 4174560061, 296679730, 1841768865, 1260232239, 4091327024, 3960309330, 3497509347, 1814803222, 2578018489, 4195456072, 575138148, 3299409036, 446754879, 3629546796, 4011996048, 3347532110, 3252238545, 4270639778, 915985419, 3483825537, 681933534, 651868046, 2755636671, 3828103837, 223377554, 2607439820, 1649704518, 3270937875, 3901806776, 1580087799, 4118987695, 3198115200, 2087309459, 2842678573, 3016697106, 1003007129, 2802849917, 1860738147, 2077965243, 164439672, 4100872472, 32283319, 2827177882, 1709610350, 2125135846, 136428751, 3874428392, 3652904859, 3460984630, 3572145929, 3593056380, 2939266226, 824852259, 818324884, 3224740454, 930369212, 2801566410, 2967507152, 355706840, 1257309336, 4148292826, 243256656, 790073846, 2373340630, 1296297904, 1422699085, 3756299780, 3818836405, 457992840, 3099667487, 2135319889, 77422314, 1560382517, 1945798516, 788204353, 1521706781, 1385356242, 870912086, 325965383, 2358957921, 2050466060, 2388260884, 2313884476, 4006521127, 901210569, 3990953189, 1014646705, 1503449823, 1062597235, 2031621326, 3212035895, 3931371469, 1533017514, 350174575, 2256028891, 2177544179, 1052338372, 741876788, 1606591296, 1914052035, 213705253, 2334669897, 1107234197, 1899603969, 3725069491, 2631447780, 2422494913, 1635502980, 1893020342, 1950903388, 1120974935],b = [2807058932, 1699970625, 2764249623, 1586903591, 1808481195, 1173430173, 1487645946, 59984867, 4199882800, 1844882806, 1989249228, 1277555970, 3623636965, 3419915562, 1149249077, 2744104290, 1514790577, 459744698, 244860394, 3235995134, 1963115311, 4027744588, 2544078150, 4190530515, 1608975247, 2627016082, 2062270317, 1507497298, 2200818878, 567498868, 1764313568, 3359936201, 2305455554, 2037970062, 1047239e3, 1910319033, 1337376481, 2904027272, 2892417312, 984907214, 1243112415, 830661914, 861968209, 2135253587, 2011214180, 2927934315, 2686254721, 731183368, 1750626376, 4246310725, 1820824798, 4172763771, 3542330227, 48394827, 2404901663, 2871682645, 671593195, 3254988725, 2073724613, 145085239, 2280796200, 2779915199, 1790575107, 2187128086, 472615631, 3029510009, 4075877127, 3802222185, 4107101658, 3201631749, 1646252340, 4270507174, 1402811438, 1436590835, 3778151818, 3950355702, 3963161475, 4020912224, 2667994737, 273792366, 2331590177, 104699613, 95345982, 3175501286, 2377486676, 1560637892, 3564045318, 369057872, 4213447064, 3919042237, 1137477952, 2658625497, 1119727848, 2340947849, 1530455833, 4007360968, 172466556, 266959938, 516552836, 0, 2256734592, 3980931627, 1890328081, 1917742170, 4294704398, 945164165, 3575528878, 958871085, 3647212047, 2787207260, 1423022939, 775562294, 1739656202, 3876557655, 2530391278, 2443058075, 3310321856, 547512796, 1265195639, 437656594, 3121275539, 719700128, 3762502690, 387781147, 218828297, 3350065803, 2830708150, 2848461854, 428169201, 122466165, 3720081049, 1627235199, 648017665, 4122762354, 1002783846, 2117360635, 695634755, 3336358691, 4234721005, 4049844452, 3704280881, 2232435299, 574624663, 287343814, 612205898, 1039717051, 840019705, 2708326185, 793451934, 821288114, 1391201670, 3822090177, 376187827, 3113855344, 1224348052, 1679968233, 2361698556, 1058709744, 752375421, 2431590963, 1321699145, 3519142200, 2734591178, 188127444, 2177869557, 3727205754, 2384911031, 3215212461, 2648976442, 2450346104, 3432737375, 1180849278, 331544205, 3102249176, 4150144569, 2952102595, 2159976285, 2474404304, 766078933, 313773861, 2570832044, 2108100632, 1668212892, 3145456443, 2013908262, 418672217, 3070356634, 2594734927, 1852171925, 3867060991, 3473416636, 3907448597, 2614737639, 919489135, 164948639, 2094410160, 2997825956, 590424639, 2486224549, 1723872674, 3157750862, 3399941250, 3501252752, 3625268135, 2555048196, 3673637356, 1343127501, 4130281361, 3599595085, 2957853679, 1297403050, 81781910, 3051593425, 2283490410, 532201772, 1367295589, 3926170974, 895287692, 1953757831, 1093597963, 492483431, 3528626907, 1446242576, 1192455638, 1636604631, 209336225, 344873464, 1015671571, 669961897, 3375740769, 3857572124, 2973530695, 3747192018, 1933530610, 3464042516, 935293895, 3454686199, 2858115069, 1863638845, 3683022916, 4085369519, 3292445032, 875313188, 1080017571, 3279033885, 621591778, 1233856572, 2504130317, 24197544, 3017672716, 3835484340, 3247465558, 2220981195, 3060847922, 1551124588, 1463996600],w = [4104605777, 1097159550, 396673818, 660510266, 2875968315, 2638606623, 4200115116, 3808662347, 821712160, 1986918061, 3430322568, 38544885, 3856137295, 718002117, 893681702, 1654886325, 2975484382, 3122358053, 3926825029, 4274053469, 796197571, 1290801793, 1184342925, 3556361835, 2405426947, 2459735317, 1836772287, 1381620373, 3196267988, 1948373848, 3764988233, 3385345166, 3263785589, 2390325492, 1480485785, 3111247143, 3780097726, 2293045232, 548169417, 3459953789, 3746175075, 439452389, 1362321559, 1400849762, 1685577905, 1806599355, 2174754046, 137073913, 1214797936, 1174215055, 3731654548, 2079897426, 1943217067, 1258480242, 529487843, 1437280870, 3945269170, 3049390895, 3313212038, 923313619, 679998e3, 3215307299, 57326082, 377642221, 3474729866, 2041877159, 133361907, 1776460110, 3673476453, 96392454, 878845905, 2801699524, 777231668, 4082475170, 2330014213, 4142626212, 2213296395, 1626319424, 1906247262, 1846563261, 562755902, 3708173718, 1040559837, 3871163981, 1418573201, 3294430577, 114585348, 1343618912, 2566595609, 3186202582, 1078185097, 3651041127, 3896688048, 2307622919, 425408743, 3371096953, 2081048481, 1108339068, 2216610296, 0, 2156299017, 736970802, 292596766, 1517440620, 251657213, 2235061775, 2933202493, 758720310, 265905162, 1554391400, 1532285339, 908999204, 174567692, 1474760595, 4002861748, 2610011675, 3234156416, 3693126241, 2001430874, 303699484, 2478443234, 2687165888, 585122620, 454499602, 151849742, 2345119218, 3064510765, 514443284, 4044981591, 1963412655, 2581445614, 2137062819, 19308535, 1928707164, 1715193156, 4219352155, 1126790795, 600235211, 3992742070, 3841024952, 836553431, 1669664834, 2535604243, 3323011204, 1243905413, 3141400786, 4180808110, 698445255, 2653899549, 2989552604, 2253581325, 3252932727, 3004591147, 1891211689, 2487810577, 3915653703, 4237083816, 4030667424, 2100090966, 865136418, 1229899655, 953270745, 3399679628, 3557504664, 4118925222, 2061379749, 3079546586, 2915017791, 983426092, 2022837584, 1607244650, 2118541908, 2366882550, 3635996816, 972512814, 3283088770, 1568718495, 3499326569, 3576539503, 621982671, 2895723464, 410887952, 2623762152, 1002142683, 645401037, 1494807662, 2595684844, 1335535747, 2507040230, 4293295786, 3167684641, 367585007, 3885750714, 1865862730, 2668221674, 2960971305, 2763173681, 1059270954, 2777952454, 2724642869, 1320957812, 2194319100, 2429595872, 2815956275, 77089521, 3973773121, 3444575871, 2448830231, 1305906550, 4021308739, 2857194700, 2516901860, 3518358430, 1787304780, 740276417, 1699839814, 1592394909, 2352307457, 2272556026, 188821243, 1729977011, 3687994002, 274084841, 3594982253, 3613494426, 2701949495, 4162096729, 322734571, 2837966542, 1640576439, 484830689, 1202797690, 3537852828, 4067639125, 349075736, 3342319475, 4157467219, 4255800159, 1030690015, 1155237496, 2951971274, 1757691577, 607398968, 2738905026, 499347990, 3794078908, 1011452712, 227885567, 2818666809, 213114376, 3034881240, 1455525988, 3414450555, 850817237, 1817998408, 3092726480],_ = [0, 235474187, 470948374, 303765277, 941896748, 908933415, 607530554, 708780849, 1883793496, 2118214995, 1817866830, 1649639237, 1215061108, 1181045119, 1417561698, 1517767529, 3767586992, 4003061179, 4236429990, 4069246893, 3635733660, 3602770327, 3299278474, 3400528769, 2430122216, 2664543715, 2362090238, 2193862645, 2835123396, 2801107407, 3035535058, 3135740889, 3678124923, 3576870512, 3341394285, 3374361702, 3810496343, 3977675356, 4279080257, 4043610186, 2876494627, 2776292904, 3076639029, 3110650942, 2472011535, 2640243204, 2403728665, 2169303058, 1001089995, 899835584, 666464733, 699432150, 59727847, 226906860, 530400753, 294930682, 1273168787, 1172967064, 1475418501, 1509430414, 1942435775, 2110667444, 1876241833, 1641816226, 2910219766, 2743034109, 2976151520, 3211623147, 2505202138, 2606453969, 2302690252, 2269728455, 3711829422, 3543599269, 3240894392, 3475313331, 3843699074, 3943906441, 4178062228, 4144047775, 1306967366, 1139781709, 1374988112, 1610459739, 1975683434, 2076935265, 1775276924, 1742315127, 1034867998, 866637845, 566021896, 800440835, 92987698, 193195065, 429456164, 395441711, 1984812685, 2017778566, 1784663195, 1683407248, 1315562145, 1080094634, 1383856311, 1551037884, 101039829, 135050206, 437757123, 337553864, 1042385657, 807962610, 573804783, 742039012, 2531067453, 2564033334, 2328828971, 2227573024, 2935566865, 2700099354, 3001755655, 3168937228, 3868552805, 3902563182, 4203181171, 4102977912, 3736164937, 3501741890, 3265478751, 3433712980, 1106041591, 1340463100, 1576976609, 1408749034, 2043211483, 2009195472, 1708848333, 1809054150, 832877231, 1068351396, 766945465, 599762354, 159417987, 126454664, 361929877, 463180190, 2709260871, 2943682380, 3178106961, 3009879386, 2572697195, 2538681184, 2236228733, 2336434550, 3509871135, 3745345300, 3441850377, 3274667266, 3910161971, 3877198648, 4110568485, 4211818798, 2597806476, 2497604743, 2261089178, 2295101073, 2733856160, 2902087851, 3202437046, 2968011453, 3936291284, 3835036895, 4136440770, 4169408201, 3535486456, 3702665459, 3467192302, 3231722213, 2051518780, 1951317047, 1716890410, 1750902305, 1113818384, 1282050075, 1584504582, 1350078989, 168810852, 67556463, 371049330, 404016761, 841739592, 1008918595, 775550814, 540080725, 3969562369, 3801332234, 4035489047, 4269907996, 3569255213, 3669462566, 3366754619, 3332740144, 2631065433, 2463879762, 2160117071, 2395588676, 2767645557, 2868897406, 3102011747, 3069049960, 202008497, 33778362, 270040487, 504459436, 875451293, 975658646, 675039627, 641025152, 2084704233, 1917518562, 1615861247, 1851332852, 1147550661, 1248802510, 1484005843, 1451044056, 933301370, 967311729, 733156972, 632953703, 260388950, 25965917, 328671808, 496906059, 1206477858, 1239443753, 1543208500, 1441952575, 2144161806, 1908694277, 1675577880, 1842759443, 3610369226, 3644379585, 3408119516, 3307916247, 4011190502, 3776767469, 4077384432, 4245618683, 2809771154, 2842737049, 3144396420, 3043140495, 2673705150, 2438237621, 2203032232, 2370213795],M = [0, 185469197, 370938394, 487725847, 741876788, 657861945, 975451694, 824852259, 1483753576, 1400783205, 1315723890, 1164071807, 1950903388, 2135319889, 1649704518, 1767536459, 2967507152, 3152976349, 2801566410, 2918353863, 2631447780, 2547432937, 2328143614, 2177544179, 3901806776, 3818836405, 4270639778, 4118987695, 3299409036, 3483825537, 3535072918, 3652904859, 2077965243, 1893020342, 1841768865, 1724457132, 1474502543, 1559041666, 1107234197, 1257309336, 598438867, 681933534, 901210569, 1052338372, 261314535, 77422314, 428819965, 310463728, 3409685355, 3224740454, 3710368113, 3593056380, 3875770207, 3960309330, 4045380933, 4195456072, 2471224067, 2554718734, 2237133081, 2388260884, 3212035895, 3028143674, 2842678573, 2724322336, 4138563181, 4255350624, 3769721975, 3955191162, 3667219033, 3516619604, 3431546947, 3347532110, 2933734917, 2782082824, 3099667487, 3016697106, 2196052529, 2313884476, 2499348523, 2683765030, 1179510461, 1296297904, 1347548327, 1533017514, 1786102409, 1635502980, 2087309459, 2003294622, 507358933, 355706840, 136428751, 53458370, 839224033, 957055980, 605657339, 790073846, 2373340630, 2256028891, 2607439820, 2422494913, 2706270690, 2856345839, 3075636216, 3160175349, 3573941694, 3725069491, 3273267108, 3356761769, 4181598602, 4063242375, 4011996048, 3828103837, 1033297158, 915985419, 730517276, 545572369, 296679730, 446754879, 129166120, 213705253, 1709610350, 1860738147, 1945798516, 2029293177, 1239331162, 1120974935, 1606591296, 1422699085, 4148292826, 4233094615, 3781033664, 3931371469, 3682191598, 3497509347, 3446004468, 3328955385, 2939266226, 2755636671, 3106780840, 2988687269, 2198438022, 2282195339, 2501218972, 2652609425, 1201765386, 1286567175, 1371368976, 1521706781, 1805211710, 1620529459, 2105887268, 1988838185, 533804130, 350174575, 164439672, 46346101, 870912086, 954669403, 636813900, 788204353, 2358957921, 2274680428, 2592523643, 2441661558, 2695033685, 2880240216, 3065962831, 3182487618, 3572145929, 3756299780, 3270937875, 3388507166, 4174560061, 4091327024, 4006521127, 3854606378, 1014646705, 930369212, 711349675, 560487590, 272786309, 457992840, 106852767, 223377554, 1678381017, 1862534868, 1914052035, 2031621326, 1211247597, 1128014560, 1580087799, 1428173050, 32283319, 182621114, 401639597, 486441376, 768917123, 651868046, 1003007129, 818324884, 1503449823, 1385356242, 1333838021, 1150208456, 1973745387, 2125135846, 1673061617, 1756818940, 2970356327, 3120694122, 2802849917, 2887651696, 2637442643, 2520393566, 2334669897, 2149987652, 3917234703, 3799141122, 4284502037, 4100872472, 3309594171, 3460984630, 3545789473, 3629546796, 2050466060, 1899603969, 1814803222, 1730525723, 1443857720, 1560382517, 1075025698, 1260232239, 575138148, 692707433, 878443390, 1062597235, 243256656, 91341917, 409198410, 325965383, 3403100636, 3252238545, 3704300486, 3620022987, 3874428392, 3990953189, 4042459122, 4227665663, 2460449204, 2578018489, 2226875310, 2411029155, 3198115200, 3046200461, 2827177882, 2743944855],A = [0, 218828297, 437656594, 387781147, 875313188, 958871085, 775562294, 590424639, 1750626376, 1699970625, 1917742170, 2135253587, 1551124588, 1367295589, 1180849278, 1265195639, 3501252752, 3720081049, 3399941250, 3350065803, 3835484340, 3919042237, 4270507174, 4085369519, 3102249176, 3051593425, 2734591178, 2952102595, 2361698556, 2177869557, 2530391278, 2614737639, 3145456443, 3060847922, 2708326185, 2892417312, 2404901663, 2187128086, 2504130317, 2555048196, 3542330227, 3727205754, 3375740769, 3292445032, 3876557655, 3926170974, 4246310725, 4027744588, 1808481195, 1723872674, 1910319033, 2094410160, 1608975247, 1391201670, 1173430173, 1224348052, 59984867, 244860394, 428169201, 344873464, 935293895, 984907214, 766078933, 547512796, 1844882806, 1627235199, 2011214180, 2062270317, 1507497298, 1423022939, 1137477952, 1321699145, 95345982, 145085239, 532201772, 313773861, 830661914, 1015671571, 731183368, 648017665, 3175501286, 2957853679, 2807058932, 2858115069, 2305455554, 2220981195, 2474404304, 2658625497, 3575528878, 3625268135, 3473416636, 3254988725, 3778151818, 3963161475, 4213447064, 4130281361, 3599595085, 3683022916, 3432737375, 3247465558, 3802222185, 4020912224, 4172763771, 4122762354, 3201631749, 3017672716, 2764249623, 2848461854, 2331590177, 2280796200, 2431590963, 2648976442, 104699613, 188127444, 472615631, 287343814, 840019705, 1058709744, 671593195, 621591778, 1852171925, 1668212892, 1953757831, 2037970062, 1514790577, 1463996600, 1080017571, 1297403050, 3673637356, 3623636965, 3235995134, 3454686199, 4007360968, 3822090177, 4107101658, 4190530515, 2997825956, 3215212461, 2830708150, 2779915199, 2256734592, 2340947849, 2627016082, 2443058075, 172466556, 122466165, 273792366, 492483431, 1047239e3, 861968209, 612205898, 695634755, 1646252340, 1863638845, 2013908262, 1963115311, 1446242576, 1530455833, 1277555970, 1093597963, 1636604631, 1820824798, 2073724613, 1989249228, 1436590835, 1487645946, 1337376481, 1119727848, 164948639, 81781910, 331544205, 516552836, 1039717051, 821288114, 669961897, 719700128, 2973530695, 3157750862, 2871682645, 2787207260, 2232435299, 2283490410, 2667994737, 2450346104, 3647212047, 3564045318, 3279033885, 3464042516, 3980931627, 3762502690, 4150144569, 4199882800, 3070356634, 3121275539, 2904027272, 2686254721, 2200818878, 2384911031, 2570832044, 2486224549, 3747192018, 3528626907, 3310321856, 3359936201, 3950355702, 3867060991, 4049844452, 4234721005, 1739656202, 1790575107, 2108100632, 1890328081, 1402811438, 1586903591, 1233856572, 1149249077, 266959938, 48394827, 369057872, 418672217, 1002783846, 919489135, 567498868, 752375421, 209336225, 24197544, 376187827, 459744698, 945164165, 895287692, 574624663, 793451934, 1679968233, 1764313568, 2117360635, 1933530610, 1343127501, 1560637892, 1243112415, 1192455638, 3704280881, 3519142200, 3336358691, 3419915562, 3907448597, 3857572124, 4075877127, 4294704398, 3029510009, 3113855344, 2927934315, 2744104290, 2159976285, 2377486676, 2594734927, 2544078150],E = [0, 151849742, 303699484, 454499602, 607398968, 758720310, 908999204, 1059270954, 1214797936, 1097159550, 1517440620, 1400849762, 1817998408, 1699839814, 2118541908, 2001430874, 2429595872, 2581445614, 2194319100, 2345119218, 3034881240, 3186202582, 2801699524, 2951971274, 3635996816, 3518358430, 3399679628, 3283088770, 4237083816, 4118925222, 4002861748, 3885750714, 1002142683, 850817237, 698445255, 548169417, 529487843, 377642221, 227885567, 77089521, 1943217067, 2061379749, 1640576439, 1757691577, 1474760595, 1592394909, 1174215055, 1290801793, 2875968315, 2724642869, 3111247143, 2960971305, 2405426947, 2253581325, 2638606623, 2487810577, 3808662347, 3926825029, 4044981591, 4162096729, 3342319475, 3459953789, 3576539503, 3693126241, 1986918061, 2137062819, 1685577905, 1836772287, 1381620373, 1532285339, 1078185097, 1229899655, 1040559837, 923313619, 740276417, 621982671, 439452389, 322734571, 137073913, 19308535, 3871163981, 4021308739, 4104605777, 4255800159, 3263785589, 3414450555, 3499326569, 3651041127, 2933202493, 2815956275, 3167684641, 3049390895, 2330014213, 2213296395, 2566595609, 2448830231, 1305906550, 1155237496, 1607244650, 1455525988, 1776460110, 1626319424, 2079897426, 1928707164, 96392454, 213114376, 396673818, 514443284, 562755902, 679998e3, 865136418, 983426092, 3708173718, 3557504664, 3474729866, 3323011204, 4180808110, 4030667424, 3945269170, 3794078908, 2507040230, 2623762152, 2272556026, 2390325492, 2975484382, 3092726480, 2738905026, 2857194700, 3973773121, 3856137295, 4274053469, 4157467219, 3371096953, 3252932727, 3673476453, 3556361835, 2763173681, 2915017791, 3064510765, 3215307299, 2156299017, 2307622919, 2459735317, 2610011675, 2081048481, 1963412655, 1846563261, 1729977011, 1480485785, 1362321559, 1243905413, 1126790795, 878845905, 1030690015, 645401037, 796197571, 274084841, 425408743, 38544885, 188821243, 3613494426, 3731654548, 3313212038, 3430322568, 4082475170, 4200115116, 3780097726, 3896688048, 2668221674, 2516901860, 2366882550, 2216610296, 3141400786, 2989552604, 2837966542, 2687165888, 1202797690, 1320957812, 1437280870, 1554391400, 1669664834, 1787304780, 1906247262, 2022837584, 265905162, 114585348, 499347990, 349075736, 736970802, 585122620, 972512814, 821712160, 2595684844, 2478443234, 2293045232, 2174754046, 3196267988, 3079546586, 2895723464, 2777952454, 3537852828, 3687994002, 3234156416, 3385345166, 4142626212, 4293295786, 3841024952, 3992742070, 174567692, 57326082, 410887952, 292596766, 777231668, 660510266, 1011452712, 893681702, 1108339068, 1258480242, 1343618912, 1494807662, 1715193156, 1865862730, 1948373848, 2100090966, 2701949495, 2818666809, 3004591147, 3122358053, 2235061775, 2352307457, 2535604243, 2653899549, 3915653703, 3764988233, 4219352155, 4067639125, 3444575871, 3294430577, 3746175075, 3594982253, 836553431, 953270745, 600235211, 718002117, 367585007, 484830689, 133361907, 251657213, 2041877159, 1891211689, 1806599355, 1654886325, 1568718495, 1418573201, 1335535747, 1184342925];function S(e) {for (var t = [], r = 0; r < e.length; r += 4) {t.push(e[r] << 24 | e[r + 1] << 16 | e[r + 2] << 8 | e[r + 3]);}return t;}var k = function k(e) {if (!(this instanceof k)) throw Error("AES must be instanitated with `new`");Object.defineProperty(this, "key", { value: o(e, !0) }), this._prepare();};k.prototype._prepare = function () {var e = f[this.key.length];if (null == e) throw new Error("invalid key size (must be 16, 24 or 32 bytes)");this._Ke = [], this._Kd = [];for (var t = 0; t <= e; t++) {this._Ke.push([0, 0, 0, 0]), this._Kd.push([0, 0, 0, 0]);}var r,n = 4 * (e + 1),i = this.key.length / 4,o = S(this.key);for (t = 0; t < i; t++) {r = t >> 2, this._Ke[r][t % 4] = o[t], this._Kd[e - r][t % 4] = o[t];}for (var s, a = 0, u = i; u < n;) {if (s = o[i - 1], o[0] ^= d[s >> 16 & 255] << 24 ^ d[s >> 8 & 255] << 16 ^ d[255 & s] << 8 ^ d[s >> 24 & 255] ^ c[a] << 24, a += 1, 8 != i) for (t = 1; t < i; t++) {o[t] ^= o[t - 1];} else {for (t = 1; t < i / 2; t++) {o[t] ^= o[t - 1];}s = o[i / 2 - 1], o[i / 2] ^= d[255 & s] ^ d[s >> 8 & 255] << 8 ^ d[s >> 16 & 255] << 16 ^ d[s >> 24 & 255] << 24;for (t = i / 2 + 1; t < i; t++) {o[t] ^= o[t - 1];}}for (t = 0; t < i && u < n;) {l = u >> 2, h = u % 4, this._Ke[l][h] = o[t], this._Kd[e - l][h] = o[t++], u++;}}for (var l = 1; l < e; l++) {for (var h = 0; h < 4; h++) {s = this._Kd[l][h], this._Kd[l][h] = _[s >> 24 & 255] ^ M[s >> 16 & 255] ^ A[s >> 8 & 255] ^ E[255 & s];}}}, k.prototype.encrypt = function (e) {if (16 != e.length) throw new Error("invalid plaintext size (must be 16 bytes)");for (var t = this._Ke.length - 1, r = [0, 0, 0, 0], n = S(e), i = 0; i < 4; i++) {n[i] ^= this._Ke[0][i];}for (var o = 1; o < t; o++) {for (i = 0; i < 4; i++) {r[i] = h[n[i] >> 24 & 255] ^ p[n[(i + 1) % 4] >> 16 & 255] ^ v[n[(i + 2) % 4] >> 8 & 255] ^ y[255 & n[(i + 3) % 4]] ^ this._Ke[o][i];}n = r.slice();}var s,a = u(16);for (i = 0; i < 4; i++) {s = this._Ke[t][i], a[4 * i] = 255 & (d[n[i] >> 24 & 255] ^ s >> 24), a[4 * i + 1] = 255 & (d[n[(i + 1) % 4] >> 16 & 255] ^ s >> 16), a[4 * i + 2] = 255 & (d[n[(i + 2) % 4] >> 8 & 255] ^ s >> 8), a[4 * i + 3] = 255 & (d[255 & n[(i + 3) % 4]] ^ s);}return a;}, k.prototype.decrypt = function (e) {if (16 != e.length) throw new Error("invalid ciphertext size (must be 16 bytes)");for (var t = this._Kd.length - 1, r = [0, 0, 0, 0], n = S(e), i = 0; i < 4; i++) {n[i] ^= this._Kd[0][i];}for (var o = 1; o < t; o++) {for (i = 0; i < 4; i++) {r[i] = m[n[i] >> 24 & 255] ^ g[n[(i + 3) % 4] >> 16 & 255] ^ b[n[(i + 2) % 4] >> 8 & 255] ^ w[255 & n[(i + 1) % 4]] ^ this._Kd[o][i];}n = r.slice();}var s,a = u(16);for (i = 0; i < 4; i++) {s = this._Kd[t][i], a[4 * i] = 255 & (l[n[i] >> 24 & 255] ^ s >> 24), a[4 * i + 1] = 255 & (l[n[(i + 3) % 4] >> 16 & 255] ^ s >> 16), a[4 * i + 2] = 255 & (l[n[(i + 2) % 4] >> 8 & 255] ^ s >> 8), a[4 * i + 3] = 255 & (l[255 & n[(i + 1) % 4]] ^ s);}return a;};var N = function N(e) {if (!(this instanceof N)) throw Error("AES must be instanitated with `new`");this.description = "Electronic Code Block", this.name = "ecb", this._aes = new k(e);};N.prototype.encrypt = function (e) {if ((e = o(e)).length % 16 != 0) throw new Error("invalid plaintext size (must be multiple of 16 bytes)");for (var t = u(e.length), r = u(16), n = 0; n < e.length; n += 16) {s(e, r, 0, n, n + 16), s(r = this._aes.encrypt(r), t, n);}return t;}, N.prototype.decrypt = function (e) {if ((e = o(e)).length % 16 != 0) throw new Error("invalid ciphertext size (must be multiple of 16 bytes)");for (var t = u(e.length), r = u(16), n = 0; n < e.length; n += 16) {s(e, r, 0, n, n + 16), s(r = this._aes.decrypt(r), t, n);}return t;};var P = function P(e, t) {if (!(this instanceof P)) throw Error("AES must be instanitated with `new`");if (this.description = "Cipher Block Chaining", this.name = "cbc", t) {if (16 != t.length) throw new Error("invalid initialation vector size (must be 16 bytes)");} else t = u(16);this._lastCipherblock = o(t, !0), this._aes = new k(e);};P.prototype.encrypt = function (e) {if ((e = o(e)).length % 16 != 0) throw new Error("invalid plaintext size (must be multiple of 16 bytes)");for (var t = u(e.length), r = u(16), n = 0; n < e.length; n += 16) {s(e, r, 0, n, n + 16);for (var i = 0; i < 16; i++) {r[i] ^= this._lastCipherblock[i];}this._lastCipherblock = this._aes.encrypt(r), s(this._lastCipherblock, t, n);}return t;}, P.prototype.decrypt = function (e) {if ((e = o(e)).length % 16 != 0) throw new Error("invalid ciphertext size (must be multiple of 16 bytes)");for (var t = u(e.length), r = u(16), n = 0; n < e.length; n += 16) {s(e, r, 0, n, n + 16), r = this._aes.decrypt(r);for (var i = 0; i < 16; i++) {t[n + i] = r[i] ^ this._lastCipherblock[i];}s(e, this._lastCipherblock, 0, n, n + 16);}return t;};var x = function x(e, t, r) {if (!(this instanceof x)) throw Error("AES must be instanitated with `new`");if (this.description = "Cipher Feedback", this.name = "cfb", t) {if (16 != t.length) throw new Error("invalid initialation vector size (must be 16 size)");} else t = u(16);r = r || 1, this.segmentSize = r, this._shiftRegister = o(t, !0), this._aes = new k(e);};x.prototype.encrypt = function (e) {if (e.length % this.segmentSize != 0) throw new Error("invalid plaintext size (must be segmentSize bytes)");for (var t, r = o(e, !0), n = 0; n < r.length; n += this.segmentSize) {t = this._aes.encrypt(this._shiftRegister);for (var i = 0; i < this.segmentSize; i++) {r[n + i] ^= t[i];}s(this._shiftRegister, this._shiftRegister, 0, this.segmentSize), s(r, this._shiftRegister, 16 - this.segmentSize, n, n + this.segmentSize);}return r;}, x.prototype.decrypt = function (e) {if (e.length % this.segmentSize != 0) throw new Error("invalid ciphertext size (must be segmentSize bytes)");for (var t, r = o(e, !0), n = 0; n < r.length; n += this.segmentSize) {t = this._aes.encrypt(this._shiftRegister);for (var i = 0; i < this.segmentSize; i++) {r[n + i] ^= t[i];}s(this._shiftRegister, this._shiftRegister, 0, this.segmentSize), s(e, this._shiftRegister, 16 - this.segmentSize, n, n + this.segmentSize);}return r;};var I = function I(e, t) {if (!(this instanceof I)) throw Error("AES must be instanitated with `new`");if (this.description = "Output Feedback", this.name = "ofb", t) {if (16 != t.length) throw new Error("invalid initialation vector size (must be 16 bytes)");} else t = u(16);this._lastPrecipher = o(t, !0), this._lastPrecipherIndex = 16, this._aes = new k(e);};I.prototype.encrypt = function (e) {for (var t = o(e, !0), r = 0; r < t.length; r++) {16 === this._lastPrecipherIndex && (this._lastPrecipher = this._aes.encrypt(this._lastPrecipher), this._lastPrecipherIndex = 0), t[r] ^= this._lastPrecipher[this._lastPrecipherIndex++];}return t;}, I.prototype.decrypt = I.prototype.encrypt;var T = function T(e) {if (!(this instanceof T)) throw Error("Counter must be instanitated with `new`");0 === e || e || (e = 1), "number" == typeof e ? (this._counter = u(16), this.setValue(e)) : this.setBytes(e);};T.prototype.setValue = function (e) {if ("number" != typeof e || parseInt(e) != e) throw new Error("invalid counter value (must be an integer)");for (var t = 15; 0 <= t; --t) {this._counter[t] = e % 256, e >>= 8;}}, T.prototype.setBytes = function (e) {if (16 != (e = o(e, !0)).length) throw new Error("invalid counter bytes size (must be 16 bytes)");this._counter = e;}, T.prototype.increment = function () {for (var e = 15; 0 <= e; e--) {if (255 !== this._counter[e]) {this._counter[e]++;break;}this._counter[e] = 0;}};var R = function R(e, t) {if (!(this instanceof R)) throw Error("AES must be instanitated with `new`");this.description = "Counter", this.name = "ctr", t instanceof T || (t = new T(t)), this._counter = t, this._remainingCounter = null, this._remainingCounterIndex = 16, this._aes = new k(e);};R.prototype.encrypt = function (e) {for (var t = o(e, !0), r = 0; r < t.length; r++) {16 === this._remainingCounterIndex && (this._remainingCounter = this._aes.encrypt(this._counter._counter), this._remainingCounterIndex = 0, this._counter.increment()), t[r] ^= this._remainingCounter[this._remainingCounterIndex++];}return t;}, R.prototype.decrypt = R.prototype.encrypt;var O = { AES: k, Counter: T, ModeOfOperation: { ecb: N, cbc: P, cfb: x, ofb: I, ctr: R }, utils: { hex: a, utf8: t }, padding: { pkcs7: { pad: function pad(e) {var t = 16 - (e = o(e, !0)).length % 16,r = u(e.length + t);s(e, r);for (var n = e.length; n < r.length; n++) {r[n] = t;}return r;}, strip: function strip(e) {if ((e = o(e, !0)).length < 16) throw new Error("PKCS#7 invalid length");var t = e[e.length - 1];if (16 < t) throw new Error("PKCS#7 padding byte out of range");for (var r = e.length - t, n = 0; n < t; n++) {if (e[r + n] !== t) throw new Error("PKCS#7 invalid padding byte");}var i = u(r);return s(e, i, 0, 0, r), i;} } }, _arrayTest: { coerceArray: o, createArray: u, copyArray: s } };void 0 !== B ? C.exports = O : (e.aesjs && (O._aesjs = e.aesjs), e.aesjs = O);}(this);}, {}], 9: [function (A, e, t) {!function (e, t) {"use strict";function y(e, t) {if (!e) throw new Error(t || "Assertion failed");}function r(e, t) {e.super_ = t;function r() {}r.prototype = t.prototype, e.prototype = new r(), e.prototype.constructor = e;}function m(e, t, r) {if (m.isBN(e)) return e;this.negative = 0, this.words = null, this.length = 0, (this.red = null) !== e && ("le" !== t && "be" !== t || (r = t, t = 10), this._init(e || 0, t || 10, r || "be"));}var n;"object" == typeof e ? e.exports = m : t.BN = m, (m.BN = m).wordSize = 26;try {n = A("buffer").Buffer;} catch (e) {}function s(e, t, r) {for (var n = 0, i = Math.min(e.length, r), o = t; o < i; o++) {var s = e.charCodeAt(o) - 48;n <<= 4, n |= 49 <= s && s <= 54 ? s - 49 + 10 : 17 <= s && s <= 22 ? s - 17 + 10 : 15 & s;}return n;}function f(e, t, r, n) {for (var i = 0, o = Math.min(e.length, r), s = t; s < o; s++) {var a = e.charCodeAt(s) - 48;i *= n, i += 49 <= a ? a - 49 + 10 : 17 <= a ? a - 17 + 10 : a;}return i;}m.isBN = function (e) {return e instanceof m || null !== e && "object" == typeof e && e.constructor.wordSize === m.wordSize && Array.isArray(e.words);}, m.max = function (e, t) {return 0 < e.cmp(t) ? e : t;}, m.min = function (e, t) {return e.cmp(t) < 0 ? e : t;}, m.prototype._init = function (e, t, r) {if ("number" == typeof e) return this._initNumber(e, t, r);if ("object" == typeof e) return this._initArray(e, t, r);"hex" === t && (t = 16), y(t === (0 | t) && 2 <= t && t <= 36);var n = 0;"-" === (e = e.toString().replace(/\s+/g, ""))[0] && n++, 16 === t ? this._parseHex(e, n) : this._parseBase(e, t, n), "-" === e[0] && (this.negative = 1), this.strip(), "le" === r && this._initArray(this.toArray(), t, r);}, m.prototype._initNumber = function (e, t, r) {e < 0 && (this.negative = 1, e = -e), e < 67108864 ? (this.words = [67108863 & e], this.length = 1) : e < 4503599627370496 ? (this.words = [67108863 & e, e / 67108864 & 67108863], this.length = 2) : (y(e < 9007199254740992), this.words = [67108863 & e, e / 67108864 & 67108863, 1], this.length = 3), "le" === r && this._initArray(this.toArray(), t, r);}, m.prototype._initArray = function (e, t, r) {if (y("number" == typeof e.length), e.length <= 0) return this.words = [0], this.length = 1, this;this.length = Math.ceil(e.length / 3), this.words = new Array(this.length);for (var n = 0; n < this.length; n++) {this.words[n] = 0;}var i,o,s = 0;if ("be" === r) for (n = e.length - 1, i = 0; 0 <= n; n -= 3) {o = e[n] | e[n - 1] << 8 | e[n - 2] << 16, this.words[i] |= o << s & 67108863, this.words[i + 1] = o >>> 26 - s & 67108863, 26 <= (s += 24) && (s -= 26, i++);} else if ("le" === r) for (i = n = 0; n < e.length; n += 3) {o = e[n] | e[n + 1] << 8 | e[n + 2] << 16, this.words[i] |= o << s & 67108863, this.words[i + 1] = o >>> 26 - s & 67108863, 26 <= (s += 24) && (s -= 26, i++);}return this.strip();}, m.prototype._parseHex = function (e, t) {this.length = Math.ceil((e.length - t) / 6), this.words = new Array(this.length);for (var r = 0; r < this.length; r++) {this.words[r] = 0;}var n,i,o = 0;for (r = e.length - 6, n = 0; t <= r; r -= 6) {i = s(e, r, r + 6), this.words[n] |= i << o & 67108863, this.words[n + 1] |= i >>> 26 - o & 4194303, 26 <= (o += 24) && (o -= 26, n++);}r + 6 !== t && (i = s(e, t, r + 6), this.words[n] |= i << o & 67108863, this.words[n + 1] |= i >>> 26 - o & 4194303), this.strip();}, m.prototype._parseBase = function (e, t, r) {this.words = [0];for (var n = 0, i = this.length = 1; i <= 67108863; i *= t) {n++;}n--, i = i / t | 0;for (var o = e.length - r, s = o % n, a = Math.min(o, o - s) + r, u = 0, l = r; l < a; l += n) {u = f(e, l, l + n, t), this.imuln(i), this.words[0] + u < 67108864 ? this.words[0] += u : this._iaddn(u);}if (0 != s) {var h = 1;for (u = f(e, l, e.length, t), l = 0; l < s; l++) {h *= t;}this.imuln(h), this.words[0] + u < 67108864 ? this.words[0] += u : this._iaddn(u);}}, m.prototype.copy = function (e) {e.words = new Array(this.length);for (var t = 0; t < this.length; t++) {e.words[t] = this.words[t];}e.length = this.length, e.negative = this.negative, e.red = this.red;}, m.prototype.clone = function () {var e = new m(null);return this.copy(e), e;}, m.prototype._expand = function (e) {for (; this.length < e;) {this.words[this.length++] = 0;}return this;}, m.prototype.strip = function () {for (; 1 < this.length && 0 === this.words[this.length - 1];) {this.length--;}return this._normSign();}, m.prototype._normSign = function () {return 1 === this.length && 0 === this.words[0] && (this.negative = 0), this;}, m.prototype.inspect = function () {return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";};var c = ["", "0", "00", "000", "0000", "00000", "000000", "0000000", "00000000", "000000000", "0000000000", "00000000000", "000000000000", "0000000000000", "00000000000000", "000000000000000", "0000000000000000", "00000000000000000", "000000000000000000", "0000000000000000000", "00000000000000000000", "000000000000000000000", "0000000000000000000000", "00000000000000000000000", "000000000000000000000000", "0000000000000000000000000"],d = [0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],p = [0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176];function i(e, t, r) {r.negative = t.negative ^ e.negative;var n = e.length + t.length | 0;n = (r.length = n) - 1 | 0;var i = 0 | e.words[0],o = 0 | t.words[0],s = i * o,a = 67108863 & s,u = s / 67108864 | 0;r.words[0] = a;for (var l = 1; l < n; l++) {for (var h = u >>> 26, f = 67108863 & u, c = Math.min(l, t.length - 1), d = Math.max(0, l - e.length + 1); d <= c; d++) {var p = l - d | 0;h += (s = (i = 0 | e.words[p]) * (o = 0 | t.words[d]) + f) / 67108864 | 0, f = 67108863 & s;}r.words[l] = 0 | f, u = 0 | h;}return 0 !== u ? r.words[l] = 0 | u : r.length--, r.strip();}m.prototype.toString = function (e, t) {var r;if (t = 0 | t || 1, 16 === (e = e || 10) || "hex" === e) {r = "";for (var n = 0, i = 0, o = 0; o < this.length; o++) {var s = this.words[o],a = (16777215 & (s << n | i)).toString(16);r = 0 !== (i = s >>> 24 - n & 16777215) || o !== this.length - 1 ? c[6 - a.length] + a + r : a + r, 26 <= (n += 2) && (n -= 26, o--);}for (0 !== i && (r = i.toString(16) + r); r.length % t != 0;) {r = "0" + r;}return 0 !== this.negative && (r = "-" + r), r;}if (e === (0 | e) && 2 <= e && e <= 36) {var u = d[e],l = p[e];r = "";var h = this.clone();for (h.negative = 0; !h.isZero();) {var f = h.modn(l).toString(e);r = (h = h.idivn(l)).isZero() ? f + r : c[u - f.length] + f + r;}for (this.isZero() && (r = "0" + r); r.length % t != 0;) {r = "0" + r;}return 0 !== this.negative && (r = "-" + r), r;}y(!1, "Base should be between 2 and 36");}, m.prototype.toNumber = function () {var e = this.words[0];return 2 === this.length ? e += 67108864 * this.words[1] : 3 === this.length && 1 === this.words[2] ? e += 4503599627370496 + 67108864 * this.words[1] : 2 < this.length && y(!1, "Number can only safely store up to 53 bits"), 0 !== this.negative ? -e : e;}, m.prototype.toJSON = function () {return this.toString(16);}, m.prototype.toBuffer = function (e, t) {return y(void 0 !== n), this.toArrayLike(n, e, t);}, m.prototype.toArray = function (e, t) {return this.toArrayLike(Array, e, t);}, m.prototype.toArrayLike = function (e, t, r) {var n = this.byteLength(),i = r || Math.max(1, n);y(n <= i, "byte array longer than desired length"), y(0 < i, "Requested array length <= 0"), this.strip();var o,s,a = "le" === t,u = new e(i),l = this.clone();if (a) {for (s = 0; !l.isZero(); s++) {o = l.andln(255), l.iushrn(8), u[s] = o;}for (; s < i; s++) {u[s] = 0;}} else {for (s = 0; s < i - n; s++) {u[s] = 0;}for (s = 0; !l.isZero(); s++) {o = l.andln(255), l.iushrn(8), u[i - s - 1] = o;}}return u;}, m.prototype._countBits = Math.clz32 ? function (e) {return 32 - Math.clz32(e);} : function (e) {var t = e,r = 0;return 4096 <= t && (r += 13, t >>>= 13), 64 <= t && (r += 7, t >>>= 7), 8 <= t && (r += 4, t >>>= 4), 2 <= t && (r += 2, t >>>= 2), r + t;}, m.prototype._zeroBits = function (e) {if (0 === e) return 26;var t = e,r = 0;return 0 == (8191 & t) && (r += 13, t >>>= 13), 0 == (127 & t) && (r += 7, t >>>= 7), 0 == (15 & t) && (r += 4, t >>>= 4), 0 == (3 & t) && (r += 2, t >>>= 2), 0 == (1 & t) && r++, r;}, m.prototype.bitLength = function () {var e = this.words[this.length - 1],t = this._countBits(e);return 26 * (this.length - 1) + t;}, m.prototype.zeroBits = function () {if (this.isZero()) return 0;for (var e = 0, t = 0; t < this.length; t++) {var r = this._zeroBits(this.words[t]);if (e += r, 26 !== r) break;}return e;}, m.prototype.byteLength = function () {return Math.ceil(this.bitLength() / 8);}, m.prototype.toTwos = function (e) {return 0 !== this.negative ? this.abs().inotn(e).iaddn(1) : this.clone();}, m.prototype.fromTwos = function (e) {return this.testn(e - 1) ? this.notn(e).iaddn(1).ineg() : this.clone();}, m.prototype.isNeg = function () {return 0 !== this.negative;}, m.prototype.neg = function () {return this.clone().ineg();}, m.prototype.ineg = function () {return this.isZero() || (this.negative ^= 1), this;}, m.prototype.iuor = function (e) {for (; this.length < e.length;) {this.words[this.length++] = 0;}for (var t = 0; t < e.length; t++) {this.words[t] = this.words[t] | e.words[t];}return this.strip();}, m.prototype.ior = function (e) {return y(0 == (this.negative | e.negative)), this.iuor(e);}, m.prototype.or = function (e) {return this.length > e.length ? this.clone().ior(e) : e.clone().ior(this);}, m.prototype.uor = function (e) {return this.length > e.length ? this.clone().iuor(e) : e.clone().iuor(this);}, m.prototype.iuand = function (e) {var t;t = this.length > e.length ? e : this;for (var r = 0; r < t.length; r++) {this.words[r] = this.words[r] & e.words[r];}return this.length = t.length, this.strip();}, m.prototype.iand = function (e) {return y(0 == (this.negative | e.negative)), this.iuand(e);}, m.prototype.and = function (e) {return this.length > e.length ? this.clone().iand(e) : e.clone().iand(this);}, m.prototype.uand = function (e) {return this.length > e.length ? this.clone().iuand(e) : e.clone().iuand(this);}, m.prototype.iuxor = function (e) {var t, r;r = this.length > e.length ? (t = this, e) : (t = e, this);for (var n = 0; n < r.length; n++) {this.words[n] = t.words[n] ^ r.words[n];}if (this !== t) for (; n < t.length; n++) {this.words[n] = t.words[n];}return this.length = t.length, this.strip();}, m.prototype.ixor = function (e) {return y(0 == (this.negative | e.negative)), this.iuxor(e);}, m.prototype.xor = function (e) {return this.length > e.length ? this.clone().ixor(e) : e.clone().ixor(this);}, m.prototype.uxor = function (e) {return this.length > e.length ? this.clone().iuxor(e) : e.clone().iuxor(this);}, m.prototype.inotn = function (e) {y("number" == typeof e && 0 <= e);var t = 0 | Math.ceil(e / 26),r = e % 26;this._expand(t), 0 < r && t--;for (var n = 0; n < t; n++) {this.words[n] = 67108863 & ~this.words[n];}return 0 < r && (this.words[n] = ~this.words[n] & 67108863 >> 26 - r), this.strip();}, m.prototype.notn = function (e) {return this.clone().inotn(e);}, m.prototype.setn = function (e, t) {y("number" == typeof e && 0 <= e);var r = e / 26 | 0,n = e % 26;return this._expand(1 + r), this.words[r] = t ? this.words[r] | 1 << n : this.words[r] & ~(1 << n), this.strip();}, m.prototype.iadd = function (e) {var t, r, n;if (0 !== this.negative && 0 === e.negative) return this.negative = 0, t = this.isub(e), this.negative ^= 1, this._normSign();if (0 === this.negative && 0 !== e.negative) return e.negative = 0, t = this.isub(e), e.negative = 1, t._normSign();n = this.length > e.length ? (r = this, e) : (r = e, this);for (var i = 0, o = 0; o < n.length; o++) {t = (0 | r.words[o]) + (0 | n.words[o]) + i, this.words[o] = 67108863 & t, i = t >>> 26;}for (; 0 !== i && o < r.length; o++) {t = (0 | r.words[o]) + i, this.words[o] = 67108863 & t, i = t >>> 26;}if (this.length = r.length, 0 !== i) this.words[this.length] = i, this.length++;else if (r !== this) for (; o < r.length; o++) {this.words[o] = r.words[o];}return this;}, m.prototype.add = function (e) {var t;return 0 !== e.negative && 0 === this.negative ? (e.negative = 0, t = this.sub(e), e.negative ^= 1, t) : 0 === e.negative && 0 !== this.negative ? (this.negative = 0, t = e.sub(this), this.negative = 1, t) : this.length > e.length ? this.clone().iadd(e) : e.clone().iadd(this);}, m.prototype.isub = function (e) {if (0 !== e.negative) {e.negative = 0;var t = this.iadd(e);return e.negative = 1, t._normSign();}if (0 !== this.negative) return this.negative = 0, this.iadd(e), this.negative = 1, this._normSign();var r,n,i = this.cmp(e);if (0 === i) return this.negative = 0, this.length = 1, this.words[0] = 0, this;n = 0 < i ? (r = this, e) : (r = e, this);for (var o = 0, s = 0; s < n.length; s++) {o = (t = (0 | r.words[s]) - (0 | n.words[s]) + o) >> 26, this.words[s] = 67108863 & t;}for (; 0 !== o && s < r.length; s++) {o = (t = (0 | r.words[s]) + o) >> 26, this.words[s] = 67108863 & t;}if (0 === o && s < r.length && r !== this) for (; s < r.length; s++) {this.words[s] = r.words[s];}return this.length = Math.max(this.length, s), r !== this && (this.negative = 1), this.strip();}, m.prototype.sub = function (e) {return this.clone().isub(e);};var o = function o(e, t, r) {var n,i,o,s = e.words,a = t.words,u = r.words,l = 0,h = 0 | s[0],f = 8191 & h,c = h >>> 13,d = 0 | s[1],p = 8191 & d,v = d >>> 13,y = 0 | s[2],m = 8191 & y,g = y >>> 13,b = 0 | s[3],w = 8191 & b,_ = b >>> 13,M = 0 | s[4],A = 8191 & M,E = M >>> 13,S = 0 | s[5],k = 8191 & S,N = S >>> 13,P = 0 | s[6],x = 8191 & P,I = P >>> 13,T = 0 | s[7],R = 8191 & T,O = T >>> 13,C = 0 | s[8],B = 8191 & C,D = C >>> 13,L = 0 | s[9],U = 8191 & L,F = L >>> 13,j = 0 | a[0],G = 8191 & j,H = j >>> 13,z = 0 | a[1],V = 8191 & z,K = z >>> 13,q = 0 | a[2],W = 8191 & q,Z = q >>> 13,J = 0 | a[3],X = 8191 & J,$ = J >>> 13,Q = 0 | a[4],Y = 8191 & Q,ee = Q >>> 13,te = 0 | a[5],re = 8191 & te,ne = te >>> 13,ie = 0 | a[6],oe = 8191 & ie,se = ie >>> 13,ae = 0 | a[7],ue = 8191 & ae,le = ae >>> 13,he = 0 | a[8],fe = 8191 & he,ce = he >>> 13,de = 0 | a[9],pe = 8191 & de,ve = de >>> 13;r.negative = e.negative ^ t.negative, r.length = 19;var ye = (l + (n = Math.imul(f, G)) | 0) + ((8191 & (i = (i = Math.imul(f, H)) + Math.imul(c, G) | 0)) << 13) | 0;l = ((o = Math.imul(c, H)) + (i >>> 13) | 0) + (ye >>> 26) | 0, ye &= 67108863, n = Math.imul(p, G), i = (i = Math.imul(p, H)) + Math.imul(v, G) | 0, o = Math.imul(v, H);var me = (l + (n = n + Math.imul(f, V) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(f, K) | 0) + Math.imul(c, V) | 0)) << 13) | 0;l = ((o = o + Math.imul(c, K) | 0) + (i >>> 13) | 0) + (me >>> 26) | 0, me &= 67108863, n = Math.imul(m, G), i = (i = Math.imul(m, H)) + Math.imul(g, G) | 0, o = Math.imul(g, H), n = n + Math.imul(p, V) | 0, i = (i = i + Math.imul(p, K) | 0) + Math.imul(v, V) | 0, o = o + Math.imul(v, K) | 0;var ge = (l + (n = n + Math.imul(f, W) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(f, Z) | 0) + Math.imul(c, W) | 0)) << 13) | 0;l = ((o = o + Math.imul(c, Z) | 0) + (i >>> 13) | 0) + (ge >>> 26) | 0, ge &= 67108863, n = Math.imul(w, G), i = (i = Math.imul(w, H)) + Math.imul(_, G) | 0, o = Math.imul(_, H), n = n + Math.imul(m, V) | 0, i = (i = i + Math.imul(m, K) | 0) + Math.imul(g, V) | 0, o = o + Math.imul(g, K) | 0, n = n + Math.imul(p, W) | 0, i = (i = i + Math.imul(p, Z) | 0) + Math.imul(v, W) | 0, o = o + Math.imul(v, Z) | 0;var be = (l + (n = n + Math.imul(f, X) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(f, $) | 0) + Math.imul(c, X) | 0)) << 13) | 0;l = ((o = o + Math.imul(c, $) | 0) + (i >>> 13) | 0) + (be >>> 26) | 0, be &= 67108863, n = Math.imul(A, G), i = (i = Math.imul(A, H)) + Math.imul(E, G) | 0, o = Math.imul(E, H), n = n + Math.imul(w, V) | 0, i = (i = i + Math.imul(w, K) | 0) + Math.imul(_, V) | 0, o = o + Math.imul(_, K) | 0, n = n + Math.imul(m, W) | 0, i = (i = i + Math.imul(m, Z) | 0) + Math.imul(g, W) | 0, o = o + Math.imul(g, Z) | 0, n = n + Math.imul(p, X) | 0, i = (i = i + Math.imul(p, $) | 0) + Math.imul(v, X) | 0, o = o + Math.imul(v, $) | 0;var we = (l + (n = n + Math.imul(f, Y) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(f, ee) | 0) + Math.imul(c, Y) | 0)) << 13) | 0;l = ((o = o + Math.imul(c, ee) | 0) + (i >>> 13) | 0) + (we >>> 26) | 0, we &= 67108863, n = Math.imul(k, G), i = (i = Math.imul(k, H)) + Math.imul(N, G) | 0, o = Math.imul(N, H), n = n + Math.imul(A, V) | 0, i = (i = i + Math.imul(A, K) | 0) + Math.imul(E, V) | 0, o = o + Math.imul(E, K) | 0, n = n + Math.imul(w, W) | 0, i = (i = i + Math.imul(w, Z) | 0) + Math.imul(_, W) | 0, o = o + Math.imul(_, Z) | 0, n = n + Math.imul(m, X) | 0, i = (i = i + Math.imul(m, $) | 0) + Math.imul(g, X) | 0, o = o + Math.imul(g, $) | 0, n = n + Math.imul(p, Y) | 0, i = (i = i + Math.imul(p, ee) | 0) + Math.imul(v, Y) | 0, o = o + Math.imul(v, ee) | 0;var _e = (l + (n = n + Math.imul(f, re) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(f, ne) | 0) + Math.imul(c, re) | 0)) << 13) | 0;l = ((o = o + Math.imul(c, ne) | 0) + (i >>> 13) | 0) + (_e >>> 26) | 0, _e &= 67108863, n = Math.imul(x, G), i = (i = Math.imul(x, H)) + Math.imul(I, G) | 0, o = Math.imul(I, H), n = n + Math.imul(k, V) | 0, i = (i = i + Math.imul(k, K) | 0) + Math.imul(N, V) | 0, o = o + Math.imul(N, K) | 0, n = n + Math.imul(A, W) | 0, i = (i = i + Math.imul(A, Z) | 0) + Math.imul(E, W) | 0, o = o + Math.imul(E, Z) | 0, n = n + Math.imul(w, X) | 0, i = (i = i + Math.imul(w, $) | 0) + Math.imul(_, X) | 0, o = o + Math.imul(_, $) | 0, n = n + Math.imul(m, Y) | 0, i = (i = i + Math.imul(m, ee) | 0) + Math.imul(g, Y) | 0, o = o + Math.imul(g, ee) | 0, n = n + Math.imul(p, re) | 0, i = (i = i + Math.imul(p, ne) | 0) + Math.imul(v, re) | 0, o = o + Math.imul(v, ne) | 0;var Me = (l + (n = n + Math.imul(f, oe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(f, se) | 0) + Math.imul(c, oe) | 0)) << 13) | 0;l = ((o = o + Math.imul(c, se) | 0) + (i >>> 13) | 0) + (Me >>> 26) | 0, Me &= 67108863, n = Math.imul(R, G), i = (i = Math.imul(R, H)) + Math.imul(O, G) | 0, o = Math.imul(O, H), n = n + Math.imul(x, V) | 0, i = (i = i + Math.imul(x, K) | 0) + Math.imul(I, V) | 0, o = o + Math.imul(I, K) | 0, n = n + Math.imul(k, W) | 0, i = (i = i + Math.imul(k, Z) | 0) + Math.imul(N, W) | 0, o = o + Math.imul(N, Z) | 0, n = n + Math.imul(A, X) | 0, i = (i = i + Math.imul(A, $) | 0) + Math.imul(E, X) | 0, o = o + Math.imul(E, $) | 0, n = n + Math.imul(w, Y) | 0, i = (i = i + Math.imul(w, ee) | 0) + Math.imul(_, Y) | 0, o = o + Math.imul(_, ee) | 0, n = n + Math.imul(m, re) | 0, i = (i = i + Math.imul(m, ne) | 0) + Math.imul(g, re) | 0, o = o + Math.imul(g, ne) | 0, n = n + Math.imul(p, oe) | 0, i = (i = i + Math.imul(p, se) | 0) + Math.imul(v, oe) | 0, o = o + Math.imul(v, se) | 0;var Ae = (l + (n = n + Math.imul(f, ue) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(f, le) | 0) + Math.imul(c, ue) | 0)) << 13) | 0;l = ((o = o + Math.imul(c, le) | 0) + (i >>> 13) | 0) + (Ae >>> 26) | 0, Ae &= 67108863, n = Math.imul(B, G), i = (i = Math.imul(B, H)) + Math.imul(D, G) | 0, o = Math.imul(D, H), n = n + Math.imul(R, V) | 0, i = (i = i + Math.imul(R, K) | 0) + Math.imul(O, V) | 0, o = o + Math.imul(O, K) | 0, n = n + Math.imul(x, W) | 0, i = (i = i + Math.imul(x, Z) | 0) + Math.imul(I, W) | 0, o = o + Math.imul(I, Z) | 0, n = n + Math.imul(k, X) | 0, i = (i = i + Math.imul(k, $) | 0) + Math.imul(N, X) | 0, o = o + Math.imul(N, $) | 0, n = n + Math.imul(A, Y) | 0, i = (i = i + Math.imul(A, ee) | 0) + Math.imul(E, Y) | 0, o = o + Math.imul(E, ee) | 0, n = n + Math.imul(w, re) | 0, i = (i = i + Math.imul(w, ne) | 0) + Math.imul(_, re) | 0, o = o + Math.imul(_, ne) | 0, n = n + Math.imul(m, oe) | 0, i = (i = i + Math.imul(m, se) | 0) + Math.imul(g, oe) | 0, o = o + Math.imul(g, se) | 0, n = n + Math.imul(p, ue) | 0, i = (i = i + Math.imul(p, le) | 0) + Math.imul(v, ue) | 0, o = o + Math.imul(v, le) | 0;var Ee = (l + (n = n + Math.imul(f, fe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(f, ce) | 0) + Math.imul(c, fe) | 0)) << 13) | 0;l = ((o = o + Math.imul(c, ce) | 0) + (i >>> 13) | 0) + (Ee >>> 26) | 0, Ee &= 67108863, n = Math.imul(U, G), i = (i = Math.imul(U, H)) + Math.imul(F, G) | 0, o = Math.imul(F, H), n = n + Math.imul(B, V) | 0, i = (i = i + Math.imul(B, K) | 0) + Math.imul(D, V) | 0, o = o + Math.imul(D, K) | 0, n = n + Math.imul(R, W) | 0, i = (i = i + Math.imul(R, Z) | 0) + Math.imul(O, W) | 0, o = o + Math.imul(O, Z) | 0, n = n + Math.imul(x, X) | 0, i = (i = i + Math.imul(x, $) | 0) + Math.imul(I, X) | 0, o = o + Math.imul(I, $) | 0, n = n + Math.imul(k, Y) | 0, i = (i = i + Math.imul(k, ee) | 0) + Math.imul(N, Y) | 0, o = o + Math.imul(N, ee) | 0, n = n + Math.imul(A, re) | 0, i = (i = i + Math.imul(A, ne) | 0) + Math.imul(E, re) | 0, o = o + Math.imul(E, ne) | 0, n = n + Math.imul(w, oe) | 0, i = (i = i + Math.imul(w, se) | 0) + Math.imul(_, oe) | 0, o = o + Math.imul(_, se) | 0, n = n + Math.imul(m, ue) | 0, i = (i = i + Math.imul(m, le) | 0) + Math.imul(g, ue) | 0, o = o + Math.imul(g, le) | 0, n = n + Math.imul(p, fe) | 0, i = (i = i + Math.imul(p, ce) | 0) + Math.imul(v, fe) | 0, o = o + Math.imul(v, ce) | 0;var Se = (l + (n = n + Math.imul(f, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(f, ve) | 0) + Math.imul(c, pe) | 0)) << 13) | 0;l = ((o = o + Math.imul(c, ve) | 0) + (i >>> 13) | 0) + (Se >>> 26) | 0, Se &= 67108863, n = Math.imul(U, V), i = (i = Math.imul(U, K)) + Math.imul(F, V) | 0, o = Math.imul(F, K), n = n + Math.imul(B, W) | 0, i = (i = i + Math.imul(B, Z) | 0) + Math.imul(D, W) | 0, o = o + Math.imul(D, Z) | 0, n = n + Math.imul(R, X) | 0, i = (i = i + Math.imul(R, $) | 0) + Math.imul(O, X) | 0, o = o + Math.imul(O, $) | 0, n = n + Math.imul(x, Y) | 0, i = (i = i + Math.imul(x, ee) | 0) + Math.imul(I, Y) | 0, o = o + Math.imul(I, ee) | 0, n = n + Math.imul(k, re) | 0, i = (i = i + Math.imul(k, ne) | 0) + Math.imul(N, re) | 0, o = o + Math.imul(N, ne) | 0, n = n + Math.imul(A, oe) | 0, i = (i = i + Math.imul(A, se) | 0) + Math.imul(E, oe) | 0, o = o + Math.imul(E, se) | 0, n = n + Math.imul(w, ue) | 0, i = (i = i + Math.imul(w, le) | 0) + Math.imul(_, ue) | 0, o = o + Math.imul(_, le) | 0, n = n + Math.imul(m, fe) | 0, i = (i = i + Math.imul(m, ce) | 0) + Math.imul(g, fe) | 0, o = o + Math.imul(g, ce) | 0;var ke = (l + (n = n + Math.imul(p, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(p, ve) | 0) + Math.imul(v, pe) | 0)) << 13) | 0;l = ((o = o + Math.imul(v, ve) | 0) + (i >>> 13) | 0) + (ke >>> 26) | 0, ke &= 67108863, n = Math.imul(U, W), i = (i = Math.imul(U, Z)) + Math.imul(F, W) | 0, o = Math.imul(F, Z), n = n + Math.imul(B, X) | 0, i = (i = i + Math.imul(B, $) | 0) + Math.imul(D, X) | 0, o = o + Math.imul(D, $) | 0, n = n + Math.imul(R, Y) | 0, i = (i = i + Math.imul(R, ee) | 0) + Math.imul(O, Y) | 0, o = o + Math.imul(O, ee) | 0, n = n + Math.imul(x, re) | 0, i = (i = i + Math.imul(x, ne) | 0) + Math.imul(I, re) | 0, o = o + Math.imul(I, ne) | 0, n = n + Math.imul(k, oe) | 0, i = (i = i + Math.imul(k, se) | 0) + Math.imul(N, oe) | 0, o = o + Math.imul(N, se) | 0, n = n + Math.imul(A, ue) | 0, i = (i = i + Math.imul(A, le) | 0) + Math.imul(E, ue) | 0, o = o + Math.imul(E, le) | 0, n = n + Math.imul(w, fe) | 0, i = (i = i + Math.imul(w, ce) | 0) + Math.imul(_, fe) | 0, o = o + Math.imul(_, ce) | 0;var Ne = (l + (n = n + Math.imul(m, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(m, ve) | 0) + Math.imul(g, pe) | 0)) << 13) | 0;l = ((o = o + Math.imul(g, ve) | 0) + (i >>> 13) | 0) + (Ne >>> 26) | 0, Ne &= 67108863, n = Math.imul(U, X), i = (i = Math.imul(U, $)) + Math.imul(F, X) | 0, o = Math.imul(F, $), n = n + Math.imul(B, Y) | 0, i = (i = i + Math.imul(B, ee) | 0) + Math.imul(D, Y) | 0, o = o + Math.imul(D, ee) | 0, n = n + Math.imul(R, re) | 0, i = (i = i + Math.imul(R, ne) | 0) + Math.imul(O, re) | 0, o = o + Math.imul(O, ne) | 0, n = n + Math.imul(x, oe) | 0, i = (i = i + Math.imul(x, se) | 0) + Math.imul(I, oe) | 0, o = o + Math.imul(I, se) | 0, n = n + Math.imul(k, ue) | 0, i = (i = i + Math.imul(k, le) | 0) + Math.imul(N, ue) | 0, o = o + Math.imul(N, le) | 0, n = n + Math.imul(A, fe) | 0, i = (i = i + Math.imul(A, ce) | 0) + Math.imul(E, fe) | 0, o = o + Math.imul(E, ce) | 0;var Pe = (l + (n = n + Math.imul(w, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(w, ve) | 0) + Math.imul(_, pe) | 0)) << 13) | 0;l = ((o = o + Math.imul(_, ve) | 0) + (i >>> 13) | 0) + (Pe >>> 26) | 0, Pe &= 67108863, n = Math.imul(U, Y), i = (i = Math.imul(U, ee)) + Math.imul(F, Y) | 0, o = Math.imul(F, ee), n = n + Math.imul(B, re) | 0, i = (i = i + Math.imul(B, ne) | 0) + Math.imul(D, re) | 0, o = o + Math.imul(D, ne) | 0, n = n + Math.imul(R, oe) | 0, i = (i = i + Math.imul(R, se) | 0) + Math.imul(O, oe) | 0, o = o + Math.imul(O, se) | 0, n = n + Math.imul(x, ue) | 0, i = (i = i + Math.imul(x, le) | 0) + Math.imul(I, ue) | 0, o = o + Math.imul(I, le) | 0, n = n + Math.imul(k, fe) | 0, i = (i = i + Math.imul(k, ce) | 0) + Math.imul(N, fe) | 0, o = o + Math.imul(N, ce) | 0;var xe = (l + (n = n + Math.imul(A, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(A, ve) | 0) + Math.imul(E, pe) | 0)) << 13) | 0;l = ((o = o + Math.imul(E, ve) | 0) + (i >>> 13) | 0) + (xe >>> 26) | 0, xe &= 67108863, n = Math.imul(U, re), i = (i = Math.imul(U, ne)) + Math.imul(F, re) | 0, o = Math.imul(F, ne), n = n + Math.imul(B, oe) | 0, i = (i = i + Math.imul(B, se) | 0) + Math.imul(D, oe) | 0, o = o + Math.imul(D, se) | 0, n = n + Math.imul(R, ue) | 0, i = (i = i + Math.imul(R, le) | 0) + Math.imul(O, ue) | 0, o = o + Math.imul(O, le) | 0, n = n + Math.imul(x, fe) | 0, i = (i = i + Math.imul(x, ce) | 0) + Math.imul(I, fe) | 0, o = o + Math.imul(I, ce) | 0;var Ie = (l + (n = n + Math.imul(k, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(k, ve) | 0) + Math.imul(N, pe) | 0)) << 13) | 0;l = ((o = o + Math.imul(N, ve) | 0) + (i >>> 13) | 0) + (Ie >>> 26) | 0, Ie &= 67108863, n = Math.imul(U, oe), i = (i = Math.imul(U, se)) + Math.imul(F, oe) | 0, o = Math.imul(F, se), n = n + Math.imul(B, ue) | 0, i = (i = i + Math.imul(B, le) | 0) + Math.imul(D, ue) | 0, o = o + Math.imul(D, le) | 0, n = n + Math.imul(R, fe) | 0, i = (i = i + Math.imul(R, ce) | 0) + Math.imul(O, fe) | 0, o = o + Math.imul(O, ce) | 0;var Te = (l + (n = n + Math.imul(x, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(x, ve) | 0) + Math.imul(I, pe) | 0)) << 13) | 0;l = ((o = o + Math.imul(I, ve) | 0) + (i >>> 13) | 0) + (Te >>> 26) | 0, Te &= 67108863, n = Math.imul(U, ue), i = (i = Math.imul(U, le)) + Math.imul(F, ue) | 0, o = Math.imul(F, le), n = n + Math.imul(B, fe) | 0, i = (i = i + Math.imul(B, ce) | 0) + Math.imul(D, fe) | 0, o = o + Math.imul(D, ce) | 0;var Re = (l + (n = n + Math.imul(R, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(R, ve) | 0) + Math.imul(O, pe) | 0)) << 13) | 0;l = ((o = o + Math.imul(O, ve) | 0) + (i >>> 13) | 0) + (Re >>> 26) | 0, Re &= 67108863, n = Math.imul(U, fe), i = (i = Math.imul(U, ce)) + Math.imul(F, fe) | 0, o = Math.imul(F, ce);var Oe = (l + (n = n + Math.imul(B, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(B, ve) | 0) + Math.imul(D, pe) | 0)) << 13) | 0;l = ((o = o + Math.imul(D, ve) | 0) + (i >>> 13) | 0) + (Oe >>> 26) | 0, Oe &= 67108863;var Ce = (l + (n = Math.imul(U, pe)) | 0) + ((8191 & (i = (i = Math.imul(U, ve)) + Math.imul(F, pe) | 0)) << 13) | 0;return l = ((o = Math.imul(F, ve)) + (i >>> 13) | 0) + (Ce >>> 26) | 0, Ce &= 67108863, u[0] = ye, u[1] = me, u[2] = ge, u[3] = be, u[4] = we, u[5] = _e, u[6] = Me, u[7] = Ae, u[8] = Ee, u[9] = Se, u[10] = ke, u[11] = Ne, u[12] = Pe, u[13] = xe, u[14] = Ie, u[15] = Te, u[16] = Re, u[17] = Oe, u[18] = Ce, 0 !== l && (u[19] = l, r.length++), r;};function a(e, t, r) {return new u().mulp(e, t, r);}function u(e, t) {this.x = e, this.y = t;}Math.imul || (o = i), m.prototype.mulTo = function (e, t) {var r = this.length + e.length;return 10 === this.length && 10 === e.length ? o(this, e, t) : r < 63 ? i(this, e, t) : r < 1024 ? function (e, t, r) {r.negative = t.negative ^ e.negative, r.length = e.length + t.length;for (var n = 0, i = 0, o = 0; o < r.length - 1; o++) {var s = i;i = 0;for (var a = 67108863 & n, u = Math.min(o, t.length - 1), l = Math.max(0, o - e.length + 1); l <= u; l++) {var h = o - l,f = (0 | e.words[h]) * (0 | t.words[l]),c = 67108863 & f;a = 67108863 & (c = c + a | 0), i += (s = (s = s + (f / 67108864 | 0) | 0) + (c >>> 26) | 0) >>> 26, s &= 67108863;}r.words[o] = a, n = s, s = i;}return 0 !== n ? r.words[o] = n : r.length--, r.strip();}(this, e, t) : a(this, e, t);}, u.prototype.makeRBT = function (e) {for (var t = new Array(e), r = m.prototype._countBits(e) - 1, n = 0; n < e; n++) {t[n] = this.revBin(n, r, e);}return t;}, u.prototype.revBin = function (e, t, r) {if (0 === e || e === r - 1) return e;for (var n = 0, i = 0; i < t; i++) {n |= (1 & e) << t - i - 1, e >>= 1;}return n;}, u.prototype.permute = function (e, t, r, n, i, o) {for (var s = 0; s < o; s++) {n[s] = t[e[s]], i[s] = r[e[s]];}}, u.prototype.transform = function (e, t, r, n, i, o) {this.permute(o, e, t, r, n, i);for (var s = 1; s < i; s <<= 1) {for (var a = s << 1, u = Math.cos(2 * Math.PI / a), l = Math.sin(2 * Math.PI / a), h = 0; h < i; h += a) {for (var f = u, c = l, d = 0; d < s; d++) {var p = r[h + d],v = n[h + d],y = r[h + d + s],m = n[h + d + s],g = f * y - c * m;m = f * m + c * y, y = g, r[h + d] = p + y, n[h + d] = v + m, r[h + d + s] = p - y, n[h + d + s] = v - m, d !== a && (g = u * f - l * c, c = u * c + l * f, f = g);}}}}, u.prototype.guessLen13b = function (e, t) {var r = 1 | Math.max(t, e),n = 1 & r,i = 0;for (r = r / 2 | 0; r; r >>>= 1) {i++;}return 1 << i + 1 + n;}, u.prototype.conjugate = function (e, t, r) {if (!(r <= 1)) for (var n = 0; n < r / 2; n++) {var i = e[n];e[n] = e[r - n - 1], e[r - n - 1] = i, i = t[n], t[n] = -t[r - n - 1], t[r - n - 1] = -i;}}, u.prototype.normalize13b = function (e, t) {for (var r = 0, n = 0; n < t / 2; n++) {var i = 8192 * Math.round(e[2 * n + 1] / t) + Math.round(e[2 * n] / t) + r;e[n] = 67108863 & i, r = i < 67108864 ? 0 : i / 67108864 | 0;}return e;}, u.prototype.convert13b = function (e, t, r, n) {for (var i = 0, o = 0; o < t; o++) {i += 0 | e[o], r[2 * o] = 8191 & i, i >>>= 13, r[2 * o + 1] = 8191 & i, i >>>= 13;}for (o = 2 * t; o < n; ++o) {r[o] = 0;}y(0 === i), y(0 == (-8192 & i));}, u.prototype.stub = function (e) {for (var t = new Array(e), r = 0; r < e; r++) {t[r] = 0;}return t;}, u.prototype.mulp = function (e, t, r) {var n = 2 * this.guessLen13b(e.length, t.length),i = this.makeRBT(n),o = this.stub(n),s = new Array(n),a = new Array(n),u = new Array(n),l = new Array(n),h = new Array(n),f = new Array(n),c = r.words;c.length = n, this.convert13b(e.words, e.length, s, n), this.convert13b(t.words, t.length, l, n), this.transform(s, o, a, u, n, i), this.transform(l, o, h, f, n, i);for (var d = 0; d < n; d++) {var p = a[d] * h[d] - u[d] * f[d];u[d] = a[d] * f[d] + u[d] * h[d], a[d] = p;}return this.conjugate(a, u, n), this.transform(a, u, c, o, n, i), this.conjugate(c, o, n), this.normalize13b(c, n), r.negative = e.negative ^ t.negative, r.length = e.length + t.length, r.strip();}, m.prototype.mul = function (e) {var t = new m(null);return t.words = new Array(this.length + e.length), this.mulTo(e, t);}, m.prototype.mulf = function (e) {var t = new m(null);return t.words = new Array(this.length + e.length), a(this, e, t);}, m.prototype.imul = function (e) {return this.clone().mulTo(e, this);}, m.prototype.imuln = function (e) {y("number" == typeof e), y(e < 67108864);for (var t = 0, r = 0; r < this.length; r++) {var n = (0 | this.words[r]) * e,i = (67108863 & n) + (67108863 & t);t >>= 26, t += n / 67108864 | 0, t += i >>> 26, this.words[r] = 67108863 & i;}return 0 !== t && (this.words[r] = t, this.length++), this;}, m.prototype.muln = function (e) {return this.clone().imuln(e);}, m.prototype.sqr = function () {return this.mul(this);}, m.prototype.isqr = function () {return this.imul(this.clone());}, m.prototype.pow = function (e) {var t = function (e) {for (var t = new Array(e.bitLength()), r = 0; r < t.length; r++) {var n = r / 26 | 0,i = r % 26;t[r] = (e.words[n] & 1 << i) >>> i;}return t;}(e);if (0 === t.length) return new m(1);for (var r = this, n = 0; n < t.length && 0 === t[n]; n++, r = r.sqr()) {;}if (++n < t.length) for (var i = r.sqr(); n < t.length; n++, i = i.sqr()) {0 !== t[n] && (r = r.mul(i));}return r;}, m.prototype.iushln = function (e) {y("number" == typeof e && 0 <= e);var t,r = e % 26,n = (e - r) / 26,i = 67108863 >>> 26 - r << 26 - r;if (0 != r) {var o = 0;for (t = 0; t < this.length; t++) {var s = this.words[t] & i,a = (0 | this.words[t]) - s << r;this.words[t] = a | o, o = s >>> 26 - r;}o && (this.words[t] = o, this.length++);}if (0 != n) {for (t = this.length - 1; 0 <= t; t--) {this.words[t + n] = this.words[t];}for (t = 0; t < n; t++) {this.words[t] = 0;}this.length += n;}return this.strip();}, m.prototype.ishln = function (e) {return y(0 === this.negative), this.iushln(e);}, m.prototype.iushrn = function (e, t, r) {var n;y("number" == typeof e && 0 <= e), n = t ? (t - t % 26) / 26 : 0;var i = e % 26,o = Math.min((e - i) / 26, this.length),s = 67108863 ^ 67108863 >>> i << i,a = r;if (n -= o, n = Math.max(0, n), a) {for (var u = 0; u < o; u++) {a.words[u] = this.words[u];}a.length = o;}if (0 === o) ;else if (this.length > o) for (this.length -= o, u = 0; u < this.length; u++) {this.words[u] = this.words[u + o];} else this.words[0] = 0, this.length = 1;var l = 0;for (u = this.length - 1; 0 <= u && (0 !== l || n <= u); u--) {var h = 0 | this.words[u];this.words[u] = l << 26 - i | h >>> i, l = h & s;}return a && 0 !== l && (a.words[a.length++] = l), 0 === this.length && (this.words[0] = 0, this.length = 1), this.strip();}, m.prototype.ishrn = function (e, t, r) {return y(0 === this.negative), this.iushrn(e, t, r);}, m.prototype.shln = function (e) {return this.clone().ishln(e);}, m.prototype.ushln = function (e) {return this.clone().iushln(e);}, m.prototype.shrn = function (e) {return this.clone().ishrn(e);}, m.prototype.ushrn = function (e) {return this.clone().iushrn(e);}, m.prototype.testn = function (e) {y("number" == typeof e && 0 <= e);var t = e % 26,r = (e - t) / 26,n = 1 << t;return !(this.length <= r) && !!(this.words[r] & n);}, m.prototype.imaskn = function (e) {y("number" == typeof e && 0 <= e);var t = e % 26,r = (e - t) / 26;if (y(0 === this.negative, "imaskn works only with positive numbers"), this.length <= r) return this;if (0 != t && r++, this.length = Math.min(r, this.length), 0 != t) {var n = 67108863 ^ 67108863 >>> t << t;this.words[this.length - 1] &= n;}return this.strip();}, m.prototype.maskn = function (e) {return this.clone().imaskn(e);}, m.prototype.iaddn = function (e) {return y("number" == typeof e), y(e < 67108864), e < 0 ? this.isubn(-e) : 0 !== this.negative ? (1 === this.length && (0 | this.words[0]) < e ? (this.words[0] = e - (0 | this.words[0]), this.negative = 0) : (this.negative = 0, this.isubn(e), this.negative = 1), this) : this._iaddn(e);}, m.prototype._iaddn = function (e) {this.words[0] += e;for (var t = 0; t < this.length && 67108864 <= this.words[t]; t++) {this.words[t] -= 67108864, t === this.length - 1 ? this.words[t + 1] = 1 : this.words[t + 1]++;}return this.length = Math.max(this.length, t + 1), this;}, m.prototype.isubn = function (e) {if (y("number" == typeof e), y(e < 67108864), e < 0) return this.iaddn(-e);if (0 !== this.negative) return this.negative = 0, this.iaddn(e), this.negative = 1, this;if (this.words[0] -= e, 1 === this.length && this.words[0] < 0) this.words[0] = -this.words[0], this.negative = 1;else for (var t = 0; t < this.length && this.words[t] < 0; t++) {this.words[t] += 67108864, this.words[t + 1] -= 1;}return this.strip();}, m.prototype.addn = function (e) {return this.clone().iaddn(e);}, m.prototype.subn = function (e) {return this.clone().isubn(e);}, m.prototype.iabs = function () {return this.negative = 0, this;}, m.prototype.abs = function () {return this.clone().iabs();}, m.prototype._ishlnsubmul = function (e, t, r) {var n,i,o = e.length + r;this._expand(o);var s = 0;for (n = 0; n < e.length; n++) {i = (0 | this.words[n + r]) + s;var a = (0 | e.words[n]) * t;s = ((i -= 67108863 & a) >> 26) - (a / 67108864 | 0), this.words[n + r] = 67108863 & i;}for (; n < this.length - r; n++) {s = (i = (0 | this.words[n + r]) + s) >> 26, this.words[n + r] = 67108863 & i;}if (0 === s) return this.strip();for (y(-1 === s), n = s = 0; n < this.length; n++) {s = (i = -(0 | this.words[n]) + s) >> 26, this.words[n] = 67108863 & i;}return this.negative = 1, this.strip();}, m.prototype._wordDiv = function (e, t) {var r = (this.length, e.length),n = this.clone(),i = e,o = 0 | i.words[i.length - 1];0 != (r = 26 - this._countBits(o)) && (i = i.ushln(r), n.iushln(r), o = 0 | i.words[i.length - 1]);var s,a = n.length - i.length;if ("mod" !== t) {(s = new m(null)).length = 1 + a, s.words = new Array(s.length);for (var u = 0; u < s.length; u++) {s.words[u] = 0;}}var l = n.clone()._ishlnsubmul(i, 1, a);0 === l.negative && (n = l, s && (s.words[a] = 1));for (var h = a - 1; 0 <= h; h--) {var f = 67108864 * (0 | n.words[i.length + h]) + (0 | n.words[i.length + h - 1]);for (f = Math.min(f / o | 0, 67108863), n._ishlnsubmul(i, f, h); 0 !== n.negative;) {f--, n.negative = 0, n._ishlnsubmul(i, 1, h), n.isZero() || (n.negative ^= 1);}s && (s.words[h] = f);}return s && s.strip(), n.strip(), "div" !== t && 0 != r && n.iushrn(r), { div: s || null, mod: n };}, m.prototype.divmod = function (e, t, r) {return y(!e.isZero()), this.isZero() ? { div: new m(0), mod: new m(0) } : 0 !== this.negative && 0 === e.negative ? (o = this.neg().divmod(e, t), "mod" !== t && (n = o.div.neg()), "div" !== t && (i = o.mod.neg(), r && 0 !== i.negative && i.iadd(e)), { div: n, mod: i }) : 0 === this.negative && 0 !== e.negative ? (o = this.divmod(e.neg(), t), "mod" !== t && (n = o.div.neg()), { div: n, mod: o.mod }) : 0 != (this.negative & e.negative) ? (o = this.neg().divmod(e.neg(), t), "div" !== t && (i = o.mod.neg(), r && 0 !== i.negative && i.isub(e)), { div: o.div, mod: i }) : e.length > this.length || this.cmp(e) < 0 ? { div: new m(0), mod: this } : 1 === e.length ? "div" === t ? { div: this.divn(e.words[0]), mod: null } : "mod" === t ? { div: null, mod: new m(this.modn(e.words[0])) } : { div: this.divn(e.words[0]), mod: new m(this.modn(e.words[0])) } : this._wordDiv(e, t);var n, i, o;}, m.prototype.div = function (e) {return this.divmod(e, "div", !1).div;}, m.prototype.mod = function (e) {return this.divmod(e, "mod", !1).mod;}, m.prototype.umod = function (e) {return this.divmod(e, "mod", !0).mod;}, m.prototype.divRound = function (e) {var t = this.divmod(e);if (t.mod.isZero()) return t.div;var r = 0 !== t.div.negative ? t.mod.isub(e) : t.mod,n = e.ushrn(1),i = e.andln(1),o = r.cmp(n);return o < 0 || 1 === i && 0 === o ? t.div : 0 !== t.div.negative ? t.div.isubn(1) : t.div.iaddn(1);}, m.prototype.modn = function (e) {y(e <= 67108863);for (var t = (1 << 26) % e, r = 0, n = this.length - 1; 0 <= n; n--) {r = (t * r + (0 | this.words[n])) % e;}return r;}, m.prototype.idivn = function (e) {y(e <= 67108863);for (var t = 0, r = this.length - 1; 0 <= r; r--) {var n = (0 | this.words[r]) + 67108864 * t;this.words[r] = n / e | 0, t = n % e;}return this.strip();}, m.prototype.divn = function (e) {return this.clone().idivn(e);}, m.prototype.egcd = function (e) {y(0 === e.negative), y(!e.isZero());var t = this,r = e.clone();t = 0 !== t.negative ? t.umod(e) : t.clone();for (var n = new m(1), i = new m(0), o = new m(0), s = new m(1), a = 0; t.isEven() && r.isEven();) {t.iushrn(1), r.iushrn(1), ++a;}for (var u = r.clone(), l = t.clone(); !t.isZero();) {for (var h = 0, f = 1; 0 == (t.words[0] & f) && h < 26; ++h, f <<= 1) {;}if (0 < h) for (t.iushrn(h); 0 < h--;) {(n.isOdd() || i.isOdd()) && (n.iadd(u), i.isub(l)), n.iushrn(1), i.iushrn(1);}for (var c = 0, d = 1; 0 == (r.words[0] & d) && c < 26; ++c, d <<= 1) {;}if (0 < c) for (r.iushrn(c); 0 < c--;) {(o.isOdd() || s.isOdd()) && (o.iadd(u), s.isub(l)), o.iushrn(1), s.iushrn(1);}0 <= t.cmp(r) ? (t.isub(r), n.isub(o), i.isub(s)) : (r.isub(t), o.isub(n), s.isub(i));}return { a: o, b: s, gcd: r.iushln(a) };}, m.prototype._invmp = function (e) {y(0 === e.negative), y(!e.isZero());var t = this,r = e.clone();t = 0 !== t.negative ? t.umod(e) : t.clone();for (var n, i = new m(1), o = new m(0), s = r.clone(); 0 < t.cmpn(1) && 0 < r.cmpn(1);) {for (var a = 0, u = 1; 0 == (t.words[0] & u) && a < 26; ++a, u <<= 1) {;}if (0 < a) for (t.iushrn(a); 0 < a--;) {i.isOdd() && i.iadd(s), i.iushrn(1);}for (var l = 0, h = 1; 0 == (r.words[0] & h) && l < 26; ++l, h <<= 1) {;}if (0 < l) for (r.iushrn(l); 0 < l--;) {o.isOdd() && o.iadd(s), o.iushrn(1);}0 <= t.cmp(r) ? (t.isub(r), i.isub(o)) : (r.isub(t), o.isub(i));}return (n = 0 === t.cmpn(1) ? i : o).cmpn(0) < 0 && n.iadd(e), n;}, m.prototype.gcd = function (e) {if (this.isZero()) return e.abs();if (e.isZero()) return this.abs();var t = this.clone(),r = e.clone();t.negative = 0;for (var n = r.negative = 0; t.isEven() && r.isEven(); n++) {t.iushrn(1), r.iushrn(1);}for (;;) {for (; t.isEven();) {t.iushrn(1);}for (; r.isEven();) {r.iushrn(1);}var i = t.cmp(r);if (i < 0) {var o = t;t = r, r = o;} else if (0 === i || 0 === r.cmpn(1)) break;t.isub(r);}return r.iushln(n);}, m.prototype.invm = function (e) {return this.egcd(e).a.umod(e);}, m.prototype.isEven = function () {return 0 == (1 & this.words[0]);}, m.prototype.isOdd = function () {return 1 == (1 & this.words[0]);}, m.prototype.andln = function (e) {return this.words[0] & e;}, m.prototype.bincn = function (e) {y("number" == typeof e);var t = e % 26,r = (e - t) / 26,n = 1 << t;if (this.length <= r) return this._expand(1 + r), this.words[r] |= n, this;for (var i = n, o = r; 0 !== i && o < this.length; o++) {var s = 0 | this.words[o];i = (s += i) >>> 26, s &= 67108863, this.words[o] = s;}return 0 !== i && (this.words[o] = i, this.length++), this;}, m.prototype.isZero = function () {return 1 === this.length && 0 === this.words[0];}, m.prototype.cmpn = function (e) {var t,r = e < 0;if (0 !== this.negative && !r) return -1;if (0 === this.negative && r) return 1;if (this.strip(), 1 < this.length) t = 1;else {r && (e = -e), y(e <= 67108863, "Number is too big");var n = 0 | this.words[0];t = n === e ? 0 : n < e ? -1 : 1;}return 0 !== this.negative ? 0 | -t : t;}, m.prototype.cmp = function (e) {if (0 !== this.negative && 0 === e.negative) return -1;if (0 === this.negative && 0 !== e.negative) return 1;var t = this.ucmp(e);return 0 !== this.negative ? 0 | -t : t;}, m.prototype.ucmp = function (e) {if (this.length > e.length) return 1;if (this.length < e.length) return -1;for (var t = 0, r = this.length - 1; 0 <= r; r--) {var n = 0 | this.words[r],i = 0 | e.words[r];if (n != i) {n < i ? t = -1 : i < n && (t = 1);break;}}return t;}, m.prototype.gtn = function (e) {return 1 === this.cmpn(e);}, m.prototype.gt = function (e) {return 1 === this.cmp(e);}, m.prototype.gten = function (e) {return 0 <= this.cmpn(e);}, m.prototype.gte = function (e) {return 0 <= this.cmp(e);}, m.prototype.ltn = function (e) {return -1 === this.cmpn(e);}, m.prototype.lt = function (e) {return -1 === this.cmp(e);}, m.prototype.lten = function (e) {return this.cmpn(e) <= 0;}, m.prototype.lte = function (e) {return this.cmp(e) <= 0;}, m.prototype.eqn = function (e) {return 0 === this.cmpn(e);}, m.prototype.eq = function (e) {return 0 === this.cmp(e);}, m.red = function (e) {return new _(e);}, m.prototype.toRed = function (e) {return y(!this.red, "Already a number in reduction context"), y(0 === this.negative, "red works only with positives"), e.convertTo(this)._forceRed(e);}, m.prototype.fromRed = function () {return y(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);}, m.prototype._forceRed = function (e) {return this.red = e, this;}, m.prototype.forceRed = function (e) {return y(!this.red, "Already a number in reduction context"), this._forceRed(e);}, m.prototype.redAdd = function (e) {return y(this.red, "redAdd works only with red numbers"), this.red.add(this, e);}, m.prototype.redIAdd = function (e) {return y(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, e);}, m.prototype.redSub = function (e) {return y(this.red, "redSub works only with red numbers"), this.red.sub(this, e);}, m.prototype.redISub = function (e) {return y(this.red, "redISub works only with red numbers"), this.red.isub(this, e);}, m.prototype.redShl = function (e) {return y(this.red, "redShl works only with red numbers"), this.red.shl(this, e);}, m.prototype.redMul = function (e) {return y(this.red, "redMul works only with red numbers"), this.red._verify2(this, e), this.red.mul(this, e);}, m.prototype.redIMul = function (e) {return y(this.red, "redMul works only with red numbers"), this.red._verify2(this, e), this.red.imul(this, e);}, m.prototype.redSqr = function () {return y(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);}, m.prototype.redISqr = function () {return y(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);}, m.prototype.redSqrt = function () {return y(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);}, m.prototype.redInvm = function () {return y(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);}, m.prototype.redNeg = function () {return y(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);}, m.prototype.redPow = function (e) {return y(this.red && !e.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, e);};var l = { k256: null, p224: null, p192: null, p25519: null };function h(e, t) {this.name = e, this.p = new m(t, 16), this.n = this.p.bitLength(), this.k = new m(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();}function v() {h.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f");}function g() {h.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001");}function b() {h.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff");}function w() {h.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed");}function _(e) {if ("string" == typeof e) {var t = m._prime(e);this.m = t.p, this.prime = t;} else y(e.gtn(1), "modulus must be greater than 1"), this.m = e, this.prime = null;}function M(e) {_.call(this, e), this.shift = this.m.bitLength(), this.shift % 26 != 0 && (this.shift += 26 - this.shift % 26), this.r = new m(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);}h.prototype._tmp = function () {var e = new m(null);return e.words = new Array(Math.ceil(this.n / 13)), e;}, h.prototype.ireduce = function (e) {for (var t, r = e; this.split(r, this.tmp), (t = (r = (r = this.imulK(r)).iadd(this.tmp)).bitLength()) > this.n;) {;}var n = t < this.n ? -1 : r.ucmp(this.p);return 0 === n ? (r.words[0] = 0, r.length = 1) : 0 < n ? r.isub(this.p) : r.strip(), r;}, h.prototype.split = function (e, t) {e.iushrn(this.n, 0, t);}, h.prototype.imulK = function (e) {return e.imul(this.k);}, r(v, h), v.prototype.split = function (e, t) {for (var r = Math.min(e.length, 9), n = 0; n < r; n++) {t.words[n] = e.words[n];}if (t.length = r, e.length <= 9) return e.words[0] = 0, void (e.length = 1);var i = e.words[9];for (t.words[t.length++] = 4194303 & i, n = 10; n < e.length; n++) {var o = 0 | e.words[n];e.words[n - 10] = (4194303 & o) << 4 | i >>> 22, i = o;}i >>>= 22, 0 === (e.words[n - 10] = i) && 10 < e.length ? e.length -= 10 : e.length -= 9;}, v.prototype.imulK = function (e) {e.words[e.length] = 0, e.words[e.length + 1] = 0, e.length += 2;for (var t = 0, r = 0; r < e.length; r++) {var n = 0 | e.words[r];t += 977 * n, e.words[r] = 67108863 & t, t = 64 * n + (t / 67108864 | 0);}return 0 === e.words[e.length - 1] && (e.length--, 0 === e.words[e.length - 1] && e.length--), e;}, r(g, h), r(b, h), r(w, h), w.prototype.imulK = function (e) {for (var t = 0, r = 0; r < e.length; r++) {var n = 19 * (0 | e.words[r]) + t,i = 67108863 & n;n >>>= 26, e.words[r] = i, t = n;}return 0 !== t && (e.words[e.length++] = t), e;}, m._prime = function (e) {if (l[e]) return l[e];var t;if ("k256" === e) t = new v();else if ("p224" === e) t = new g();else if ("p192" === e) t = new b();else {if ("p25519" !== e) throw new Error("Unknown prime " + e);t = new w();}return l[e] = t;}, _.prototype._verify1 = function (e) {y(0 === e.negative, "red works only with positives"), y(e.red, "red works only with red numbers");}, _.prototype._verify2 = function (e, t) {y(0 == (e.negative | t.negative), "red works only with positives"), y(e.red && e.red === t.red, "red works only with red numbers");}, _.prototype.imod = function (e) {return this.prime ? this.prime.ireduce(e)._forceRed(this) : e.umod(this.m)._forceRed(this);}, _.prototype.neg = function (e) {return e.isZero() ? e.clone() : this.m.sub(e)._forceRed(this);}, _.prototype.add = function (e, t) {this._verify2(e, t);var r = e.add(t);return 0 <= r.cmp(this.m) && r.isub(this.m), r._forceRed(this);}, _.prototype.iadd = function (e, t) {this._verify2(e, t);var r = e.iadd(t);return 0 <= r.cmp(this.m) && r.isub(this.m), r;}, _.prototype.sub = function (e, t) {this._verify2(e, t);var r = e.sub(t);return r.cmpn(0) < 0 && r.iadd(this.m), r._forceRed(this);}, _.prototype.isub = function (e, t) {this._verify2(e, t);var r = e.isub(t);return r.cmpn(0) < 0 && r.iadd(this.m), r;}, _.prototype.shl = function (e, t) {return this._verify1(e), this.imod(e.ushln(t));}, _.prototype.imul = function (e, t) {return this._verify2(e, t), this.imod(e.imul(t));}, _.prototype.mul = function (e, t) {return this._verify2(e, t), this.imod(e.mul(t));}, _.prototype.isqr = function (e) {return this.imul(e, e.clone());}, _.prototype.sqr = function (e) {return this.mul(e, e);}, _.prototype.sqrt = function (e) {if (e.isZero()) return e.clone();var t = this.m.andln(3);if (y(t % 2 == 1), 3 === t) {var r = this.m.add(new m(1)).iushrn(2);return this.pow(e, r);}for (var n = this.m.subn(1), i = 0; !n.isZero() && 0 === n.andln(1);) {i++, n.iushrn(1);}y(!n.isZero());var o = new m(1).toRed(this),s = o.redNeg(),a = this.m.subn(1).iushrn(1),u = this.m.bitLength();for (u = new m(2 * u * u).toRed(this); 0 !== this.pow(u, a).cmp(s);) {u.redIAdd(s);}for (var l = this.pow(u, n), h = this.pow(e, n.addn(1).iushrn(1)), f = this.pow(e, n), c = i; 0 !== f.cmp(o);) {for (var d = f, p = 0; 0 !== d.cmp(o); p++) {d = d.redSqr();}y(p < c);var v = this.pow(l, new m(1).iushln(c - p - 1));h = h.redMul(v), l = v.redSqr(), f = f.redMul(l), c = p;}return h;}, _.prototype.invm = function (e) {var t = e._invmp(this.m);return 0 !== t.negative ? (t.negative = 0, this.imod(t).redNeg()) : this.imod(t);}, _.prototype.pow = function (e, t) {if (t.isZero()) return new m(1).toRed(this);if (0 === t.cmpn(1)) return e.clone();var r = new Array(16);r[0] = new m(1).toRed(this), r[1] = e;for (var n = 2; n < r.length; n++) {r[n] = this.mul(r[n - 1], e);}var i = r[0],o = 0,s = 0,a = t.bitLength() % 26;for (0 === a && (a = 26), n = t.length - 1; 0 <= n; n--) {for (var u = t.words[n], l = a - 1; 0 <= l; l--) {var h = u >> l & 1;i !== r[0] && (i = this.sqr(i)), 0 != h || 0 !== o ? (o <<= 1, o |= h, (4 === ++s || 0 === n && 0 === l) && (i = this.mul(i, r[o]), o = s = 0)) : s = 0;}a = 26;}return i;}, _.prototype.convertTo = function (e) {var t = e.umod(this.m);return t === e ? t.clone() : t;}, _.prototype.convertFrom = function (e) {var t = e.clone();return t.red = null, t;}, m.mont = function (e) {return new M(e);}, r(M, _), M.prototype.convertTo = function (e) {return this.imod(e.ushln(this.shift));}, M.prototype.convertFrom = function (e) {var t = this.imod(e.mul(this.rinv));return t.red = null, t;}, M.prototype.imul = function (e, t) {if (e.isZero() || t.isZero()) return e.words[0] = 0, e.length = 1, e;var r = e.imul(t),n = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),i = r.isub(n).iushrn(this.shift),o = i;return 0 <= i.cmp(this.m) ? o = i.isub(this.m) : i.cmpn(0) < 0 && (o = i.iadd(this.m)), o._forceRed(this);}, M.prototype.mul = function (e, t) {if (e.isZero() || t.isZero()) return new m(0)._forceRed(this);var r = e.mul(t),n = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),i = r.isub(n).iushrn(this.shift),o = i;return 0 <= i.cmp(this.m) ? o = i.isub(this.m) : i.cmpn(0) < 0 && (o = i.iadd(this.m)), o._forceRed(this);}, M.prototype.invm = function (e) {return this.imod(e._invmp(this.m).mul(this.r2))._forceRed(this);};}(void 0 === e || e, this);}, { buffer: 11 }], 10: [function (e, t, r) {(function (r) {t.exports = function (e) {var t = new Uint8Array(e);return (r.crypto || r.msCrypto).getRandomValues(t), t;};}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});}, {}], 11: [function (e, t, r) {}, {}], 12: [function (e, t, r) {"use strict";var n = r;n.version = e("../package.json").version, n.utils = e("./elliptic/utils"), n.rand = e("brorand"), n.hmacDRBG = e("./elliptic/hmac-drbg"), n.curve = e("./elliptic/curve"), n.curves = e("./elliptic/curves"), n.ec = e("./elliptic/ec"), n.eddsa = e("./elliptic/eddsa");}, { "../package.json": 26, "./elliptic/curve": 15, "./elliptic/curves": 18, "./elliptic/ec": 19, "./elliptic/eddsa": 22, "./elliptic/hmac-drbg": 23, "./elliptic/utils": 25, brorand: 10 }], 13: [function (e, t, r) {"use strict";var n = e("bn.js"),i = e("../../elliptic").utils,S = i.getNAF,k = i.getJSF,f = i.assert;function o(e, t) {this.type = e, this.p = new n(t.p, 16), this.red = t.prime ? n.red(t.prime) : n.mont(this.p), this.zero = new n(0).toRed(this.red), this.one = new n(1).toRed(this.red), this.two = new n(2).toRed(this.red), this.n = t.n && new n(t.n, 16), this.g = t.g && this.pointFromJSON(t.g, t.gRed), this._wnafT1 = new Array(4), this._wnafT2 = new Array(4), this._wnafT3 = new Array(4), this._wnafT4 = new Array(4);var r = this.n && this.p.div(this.n);!r || 0 < r.cmpn(100) ? this.redN = null : (this._maxwellTrick = !0, this.redN = this.n.toRed(this.red));}function s(e, t) {this.curve = e, this.type = t, this.precomputed = null;}(t.exports = o).prototype.point = function () {throw new Error("Not implemented");}, o.prototype.validate = function () {throw new Error("Not implemented");}, o.prototype._fixedNafMul = function (e, t) {f(e.precomputed);var r = e._getDoubles(),n = S(t, 1),i = (1 << r.step + 1) - (r.step % 2 == 0 ? 2 : 1);i /= 3;for (var o = [], s = 0; s < n.length; s += r.step) {var a = 0;for (t = s + r.step - 1; s <= t; t--) {a = (a << 1) + n[t];}o.push(a);}for (var u = this.jpoint(null, null, null), l = this.jpoint(null, null, null), h = i; 0 < h; h--) {for (s = 0; s < o.length; s++) {(a = o[s]) === h ? l = l.mixedAdd(r.points[s]) : a === -h && (l = l.mixedAdd(r.points[s].neg()));}u = u.add(l);}return u.toP();}, o.prototype._wnafMul = function (e, t) {var r = 4,n = e._getNAFPoints(r);r = n.wnd;for (var i = n.points, o = S(t, r), s = this.jpoint(null, null, null), a = o.length - 1; 0 <= a; a--) {for (t = 0; 0 <= a && 0 === o[a]; a--) {t++;}if (0 <= a && t++, s = s.dblp(t), a < 0) break;var u = o[a];f(0 !== u), s = "affine" === e.type ? 0 < u ? s.mixedAdd(i[u - 1 >> 1]) : s.mixedAdd(i[-u - 1 >> 1].neg()) : 0 < u ? s.add(i[u - 1 >> 1]) : s.add(i[-u - 1 >> 1].neg());}return "affine" === e.type ? s.toP() : s;}, o.prototype._wnafMulAdd = function (e, t, r, n, i) {for (var o = this._wnafT1, s = this._wnafT2, a = this._wnafT3, u = 0, l = 0; l < n; l++) {var h = (A = t[l])._getNAFPoints(e);o[l] = h.wnd, s[l] = h.points;}for (l = n - 1; 1 <= l; l -= 2) {var f = l - 1,c = l;if (1 === o[f] && 1 === o[c]) {var d = [t[f], null, null, t[c]];0 === t[f].y.cmp(t[c].y) ? (d[1] = t[f].add(t[c]), d[2] = t[f].toJ().mixedAdd(t[c].neg())) : 0 === t[f].y.cmp(t[c].y.redNeg()) ? (d[1] = t[f].toJ().mixedAdd(t[c]), d[2] = t[f].add(t[c].neg())) : (d[1] = t[f].toJ().mixedAdd(t[c]), d[2] = t[f].toJ().mixedAdd(t[c].neg()));var p = [-3, -1, -5, -7, 0, 7, 5, 1, 3],v = k(r[f], r[c]);u = Math.max(v[0].length, u), a[f] = new Array(u), a[c] = new Array(u);for (var y = 0; y < u; y++) {var m = 0 | v[0][y],g = 0 | v[1][y];a[f][y] = p[3 * (1 + m) + (1 + g)], a[c][y] = 0, s[f] = d;}} else a[f] = S(r[f], o[f]), a[c] = S(r[c], o[c]), u = Math.max(a[f].length, u), u = Math.max(a[c].length, u);}var b = this.jpoint(null, null, null),w = this._wnafT4;for (l = u; 0 <= l; l--) {for (var _ = 0; 0 <= l;) {var M = !0;for (y = 0; y < n; y++) {w[y] = 0 | a[y][l], 0 !== w[y] && (M = !1);}if (!M) break;_++, l--;}if (0 <= l && _++, b = b.dblp(_), l < 0) break;for (y = 0; y < n; y++) {var A,E = w[y];0 !== E && (0 < E ? A = s[y][E - 1 >> 1] : E < 0 && (A = s[y][-E - 1 >> 1].neg()), b = "affine" === A.type ? b.mixedAdd(A) : b.add(A));}}for (l = 0; l < n; l++) {s[l] = null;}return i ? b : b.toP();}, (o.BasePoint = s).prototype.eq = function () {throw new Error("Not implemented");}, s.prototype.validate = function () {return this.curve.validate(this);}, o.prototype.decodePoint = function (e, t) {e = i.toArray(e, t);var r = this.p.byteLength();if ((4 === e[0] || 6 === e[0] || 7 === e[0]) && e.length - 1 == 2 * r) return 6 === e[0] ? f(e[e.length - 1] % 2 == 0) : 7 === e[0] && f(e[e.length - 1] % 2 == 1), this.point(e.slice(1, 1 + r), e.slice(1 + r, 1 + 2 * r));if ((2 === e[0] || 3 === e[0]) && e.length - 1 === r) return this.pointFromX(e.slice(1, 1 + r), 3 === e[0]);throw new Error("Unknown point format");}, s.prototype.encodeCompressed = function (e) {return this.encode(e, !0);}, s.prototype._encode = function (e) {var t = this.curve.p.byteLength(),r = this.getX().toArray("be", t);return e ? [this.getY().isEven() ? 2 : 3].concat(r) : [4].concat(r, this.getY().toArray("be", t));}, s.prototype.encode = function (e, t) {return i.encode(this._encode(t), e);}, s.prototype.precompute = function (e) {if (this.precomputed) return this;var t = { doubles: null, naf: null, beta: null };return t.naf = this._getNAFPoints(8), t.doubles = this._getDoubles(4, e), t.beta = this._getBeta(), this.precomputed = t, this;}, s.prototype._hasDoubles = function (e) {if (!this.precomputed) return !1;var t = this.precomputed.doubles;return !!t && t.points.length >= Math.ceil((e.bitLength() + 1) / t.step);}, s.prototype._getDoubles = function (e, t) {if (this.precomputed && this.precomputed.doubles) return this.precomputed.doubles;for (var r = [this], n = this, i = 0; i < t; i += e) {for (var o = 0; o < e; o++) {n = n.dbl();}r.push(n);}return { step: e, points: r };}, s.prototype._getNAFPoints = function (e) {if (this.precomputed && this.precomputed.naf) return this.precomputed.naf;for (var t = [this], r = (1 << e) - 1, n = 1 == r ? null : this.dbl(), i = 1; i < r; i++) {t[i] = t[i - 1].add(n);}return { wnd: e, points: t };}, s.prototype._getBeta = function () {return null;}, s.prototype.dblp = function (e) {for (var t = this, r = 0; r < e; r++) {t = t.dbl();}return t;};}, { "../../elliptic": 12, "bn.js": 9 }], 14: [function (e, t, r) {t.exports = {};}, {}], 15: [function (e, t, r) {"use strict";var n = r;n.base = e("./base"), n.short = e("./short"), n.mont = e("./mont"), n.edwards = e("./edwards");}, { "./base": 13, "./edwards": 14, "./mont": 16, "./short": 17 }], 16: [function (e, t, r) {arguments[4][14][0].apply(r, arguments);}, { dup: 14 }], 17: [function (e, t, r) {"use strict";var n = e("../curve"),i = e("../../elliptic"),_ = e("bn.js"),o = e("inherits"),s = n.base,a = i.utils.assert;function u(e) {s.call(this, "short", e), this.a = new _(e.a, 16).toRed(this.red), this.b = new _(e.b, 16).toRed(this.red), this.tinv = this.two.redInvm(), this.zeroA = 0 === this.a.fromRed().cmpn(0), this.threeA = 0 === this.a.fromRed().sub(this.p).cmpn(-3), this.endo = this._getEndomorphism(e), this._endoWnafT1 = new Array(4), this._endoWnafT2 = new Array(4);}function l(e, t, r, n) {s.BasePoint.call(this, e, "affine"), null === t && null === r ? (this.x = null, this.y = null, this.inf = !0) : (this.x = new _(t, 16), this.y = new _(r, 16), n && (this.x.forceRed(this.curve.red), this.y.forceRed(this.curve.red)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.inf = !1);}function h(e, t, r, n) {s.BasePoint.call(this, e, "jacobian"), null === t && null === r && null === n ? (this.x = this.curve.one, this.y = this.curve.one, this.z = new _(0)) : (this.x = new _(t, 16), this.y = new _(r, 16), this.z = new _(n, 16)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.zOne = this.z === this.curve.one;}o(u, s), (t.exports = u).prototype._getEndomorphism = function (e) {if (this.zeroA && this.g && this.n && 1 === this.p.modn(3)) {var t, r;if (e.beta) t = new _(e.beta, 16).toRed(this.red);else {var n = this._getEndoRoots(this.p);t = (t = n[0].cmp(n[1]) < 0 ? n[0] : n[1]).toRed(this.red);}if (e.lambda) r = new _(e.lambda, 16);else {var i = this._getEndoRoots(this.n);0 === this.g.mul(i[0]).x.cmp(this.g.x.redMul(t)) ? r = i[0] : (r = i[1], a(0 === this.g.mul(r).x.cmp(this.g.x.redMul(t))));}return { beta: t, lambda: r, basis: e.basis ? e.basis.map(function (e) {return { a: new _(e.a, 16), b: new _(e.b, 16) };}) : this._getEndoBasis(r) };}}, u.prototype._getEndoRoots = function (e) {var t = e === this.p ? this.red : _.mont(e),r = new _(2).toRed(t).redInvm(),n = r.redNeg(),i = new _(3).toRed(t).redNeg().redSqrt().redMul(r);return [n.redAdd(i).fromRed(), n.redSub(i).fromRed()];}, u.prototype._getEndoBasis = function (e) {for (var t, r, n, i, o, s, a, u, l, h = this.n.ushrn(Math.floor(this.n.bitLength() / 2)), f = e, c = this.n.clone(), d = new _(1), p = new _(0), v = new _(0), y = new _(1), m = 0; 0 !== f.cmpn(0);) {var g = c.div(f);u = c.sub(g.mul(f)), l = v.sub(g.mul(d));var b = y.sub(g.mul(p));if (!n && u.cmp(h) < 0) t = a.neg(), r = d, n = u.neg(), i = l;else if (n && 2 == ++m) break;c = f, f = a = u, v = d, d = l, y = p, p = b;}o = u.neg(), s = l;var w = n.sqr().add(i.sqr());return 0 <= o.sqr().add(s.sqr()).cmp(w) && (o = t, s = r), n.negative && (n = n.neg(), i = i.neg()), o.negative && (o = o.neg(), s = s.neg()), [{ a: n, b: i }, { a: o, b: s }];}, u.prototype._endoSplit = function (e) {var t = this.endo.basis,r = t[0],n = t[1],i = n.b.mul(e).divRound(this.n),o = r.b.neg().mul(e).divRound(this.n),s = i.mul(r.a),a = o.mul(n.a),u = i.mul(r.b),l = o.mul(n.b);return { k1: e.sub(s).sub(a), k2: u.add(l).neg() };}, u.prototype.pointFromX = function (e, t) {(e = new _(e, 16)).red || (e = e.toRed(this.red));var r = e.redSqr().redMul(e).redIAdd(e.redMul(this.a)).redIAdd(this.b),n = r.redSqrt();if (0 !== n.redSqr().redSub(r).cmp(this.zero)) throw new Error("invalid point");var i = n.fromRed().isOdd();return (t && !i || !t && i) && (n = n.redNeg()), this.point(e, n);}, u.prototype.validate = function (e) {if (e.inf) return !0;var t = e.x,r = e.y,n = this.a.redMul(t),i = t.redSqr().redMul(t).redIAdd(n).redIAdd(this.b);return 0 === r.redSqr().redISub(i).cmpn(0);}, u.prototype._endoWnafMulAdd = function (e, t, r) {for (var n = this._endoWnafT1, i = this._endoWnafT2, o = 0; o < e.length; o++) {var s = this._endoSplit(t[o]),a = e[o],u = a._getBeta();s.k1.negative && (s.k1.ineg(), a = a.neg(!0)), s.k2.negative && (s.k2.ineg(), u = u.neg(!0)), n[2 * o] = a, n[2 * o + 1] = u, i[2 * o] = s.k1, i[2 * o + 1] = s.k2;}for (var l = this._wnafMulAdd(1, n, i, 2 * o, r), h = 0; h < 2 * o; h++) {n[h] = null, i[h] = null;}return l;}, o(l, s.BasePoint), u.prototype.point = function (e, t, r) {return new l(this, e, t, r);}, u.prototype.pointFromJSON = function (e, t) {return l.fromJSON(this, e, t);}, l.prototype._getBeta = function () {if (this.curve.endo) {var e = this.precomputed;if (e && e.beta) return e.beta;var t = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);if (e) {var r = this.curve,n = function n(e) {return r.point(e.x.redMul(r.endo.beta), e.y);};(e.beta = t).precomputed = { beta: null, naf: e.naf && { wnd: e.naf.wnd, points: e.naf.points.map(n) }, doubles: e.doubles && { step: e.doubles.step, points: e.doubles.points.map(n) } };}return t;}}, l.prototype.toJSON = function () {return this.precomputed ? [this.x, this.y, this.precomputed && { doubles: this.precomputed.doubles && { step: this.precomputed.doubles.step, points: this.precomputed.doubles.points.slice(1) }, naf: this.precomputed.naf && { wnd: this.precomputed.naf.wnd, points: this.precomputed.naf.points.slice(1) } }] : [this.x, this.y];}, l.fromJSON = function (t, e, r) {"string" == typeof e && (e = JSON.parse(e));var n = t.point(e[0], e[1], r);if (!e[2]) return n;function i(e) {return t.point(e[0], e[1], r);}var o = e[2];return n.precomputed = { beta: null, doubles: o.doubles && { step: o.doubles.step, points: [n].concat(o.doubles.points.map(i)) }, naf: o.naf && { wnd: o.naf.wnd, points: [n].concat(o.naf.points.map(i)) } }, n;}, l.prototype.inspect = function () {return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">";}, l.prototype.isInfinity = function () {return this.inf;}, l.prototype.add = function (e) {if (this.inf) return e;if (e.inf) return this;if (this.eq(e)) return this.dbl();if (this.neg().eq(e)) return this.curve.point(null, null);if (0 === this.x.cmp(e.x)) return this.curve.point(null, null);var t = this.y.redSub(e.y);0 !== t.cmpn(0) && (t = t.redMul(this.x.redSub(e.x).redInvm()));var r = t.redSqr().redISub(this.x).redISub(e.x),n = t.redMul(this.x.redSub(r)).redISub(this.y);return this.curve.point(r, n);}, l.prototype.dbl = function () {if (this.inf) return this;var e = this.y.redAdd(this.y);if (0 === e.cmpn(0)) return this.curve.point(null, null);var t = this.curve.a,r = this.x.redSqr(),n = e.redInvm(),i = r.redAdd(r).redIAdd(r).redIAdd(t).redMul(n),o = i.redSqr().redISub(this.x.redAdd(this.x)),s = i.redMul(this.x.redSub(o)).redISub(this.y);return this.curve.point(o, s);}, l.prototype.getX = function () {return this.x.fromRed();}, l.prototype.getY = function () {return this.y.fromRed();}, l.prototype.mul = function (e) {return e = new _(e, 16), this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve.endo ? this.curve._endoWnafMulAdd([this], [e]) : this.curve._wnafMul(this, e);}, l.prototype.mulAdd = function (e, t, r) {var n = [this, t],i = [e, r];return this.curve.endo ? this.curve._endoWnafMulAdd(n, i) : this.curve._wnafMulAdd(1, n, i, 2);}, l.prototype.jmulAdd = function (e, t, r) {var n = [this, t],i = [e, r];return this.curve.endo ? this.curve._endoWnafMulAdd(n, i, !0) : this.curve._wnafMulAdd(1, n, i, 2, !0);}, l.prototype.eq = function (e) {return this === e || this.inf === e.inf && (this.inf || 0 === this.x.cmp(e.x) && 0 === this.y.cmp(e.y));}, l.prototype.neg = function (e) {if (this.inf) return this;var t = this.curve.point(this.x, this.y.redNeg());if (e && this.precomputed) {var r = this.precomputed,n = function n(e) {return e.neg();};t.precomputed = { naf: r.naf && { wnd: r.naf.wnd, points: r.naf.points.map(n) }, doubles: r.doubles && { step: r.doubles.step, points: r.doubles.points.map(n) } };}return t;}, l.prototype.toJ = function () {return this.inf ? this.curve.jpoint(null, null, null) : this.curve.jpoint(this.x, this.y, this.curve.one);}, o(h, s.BasePoint), u.prototype.jpoint = function (e, t, r) {return new h(this, e, t, r);}, h.prototype.toP = function () {if (this.isInfinity()) return this.curve.point(null, null);var e = this.z.redInvm(),t = e.redSqr(),r = this.x.redMul(t),n = this.y.redMul(t).redMul(e);return this.curve.point(r, n);}, h.prototype.neg = function () {return this.curve.jpoint(this.x, this.y.redNeg(), this.z);}, h.prototype.add = function (e) {if (this.isInfinity()) return e;if (e.isInfinity()) return this;var t = e.z.redSqr(),r = this.z.redSqr(),n = this.x.redMul(t),i = e.x.redMul(r),o = this.y.redMul(t.redMul(e.z)),s = e.y.redMul(r.redMul(this.z)),a = n.redSub(i),u = o.redSub(s);if (0 === a.cmpn(0)) return 0 !== u.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();var l = a.redSqr(),h = l.redMul(a),f = n.redMul(l),c = u.redSqr().redIAdd(h).redISub(f).redISub(f),d = u.redMul(f.redISub(c)).redISub(o.redMul(h)),p = this.z.redMul(e.z).redMul(a);return this.curve.jpoint(c, d, p);}, h.prototype.mixedAdd = function (e) {if (this.isInfinity()) return e.toJ();if (e.isInfinity()) return this;var t = this.z.redSqr(),r = this.x,n = e.x.redMul(t),i = this.y,o = e.y.redMul(t).redMul(this.z),s = r.redSub(n),a = i.redSub(o);if (0 === s.cmpn(0)) return 0 !== a.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();var u = s.redSqr(),l = u.redMul(s),h = r.redMul(u),f = a.redSqr().redIAdd(l).redISub(h).redISub(h),c = a.redMul(h.redISub(f)).redISub(i.redMul(l)),d = this.z.redMul(s);return this.curve.jpoint(f, c, d);}, h.prototype.dblp = function (e) {if (0 === e) return this;if (this.isInfinity()) return this;if (!e) return this.dbl();if (this.curve.zeroA || this.curve.threeA) {for (var t = this, r = 0; r < e; r++) {t = t.dbl();}return t;}var n = this.curve.a,i = this.curve.tinv,o = this.x,s = this.y,a = this.z,u = a.redSqr().redSqr(),l = s.redAdd(s);for (r = 0; r < e; r++) {var h = o.redSqr(),f = l.redSqr(),c = f.redSqr(),d = h.redAdd(h).redIAdd(h).redIAdd(n.redMul(u)),p = o.redMul(f),v = d.redSqr().redISub(p.redAdd(p)),y = p.redISub(v),m = d.redMul(y);m = m.redIAdd(m).redISub(c);var g = l.redMul(a);r + 1 < e && (u = u.redMul(c)), o = v, a = g, l = m;}return this.curve.jpoint(o, l.redMul(i), a);}, h.prototype.dbl = function () {return this.isInfinity() ? this : this.curve.zeroA ? this._zeroDbl() : this.curve.threeA ? this._threeDbl() : this._dbl();}, h.prototype._zeroDbl = function () {var e, t, r;if (this.zOne) {var n = this.x.redSqr(),i = this.y.redSqr(),o = i.redSqr(),s = this.x.redAdd(i).redSqr().redISub(n).redISub(o);s = s.redIAdd(s);var a = n.redAdd(n).redIAdd(n),u = a.redSqr().redISub(s).redISub(s),l = o.redIAdd(o);l = (l = l.redIAdd(l)).redIAdd(l), e = u, t = a.redMul(s.redISub(u)).redISub(l), r = this.y.redAdd(this.y);} else {var h = this.x.redSqr(),f = this.y.redSqr(),c = f.redSqr(),d = this.x.redAdd(f).redSqr().redISub(h).redISub(c);d = d.redIAdd(d);var p = h.redAdd(h).redIAdd(h),v = p.redSqr(),y = c.redIAdd(c);y = (y = y.redIAdd(y)).redIAdd(y), e = v.redISub(d).redISub(d), t = p.redMul(d.redISub(e)).redISub(y), r = (r = this.y.redMul(this.z)).redIAdd(r);}return this.curve.jpoint(e, t, r);}, h.prototype._threeDbl = function () {var e, t, r;if (this.zOne) {var n = this.x.redSqr(),i = this.y.redSqr(),o = i.redSqr(),s = this.x.redAdd(i).redSqr().redISub(n).redISub(o);s = s.redIAdd(s);var a = n.redAdd(n).redIAdd(n).redIAdd(this.curve.a),u = a.redSqr().redISub(s).redISub(s);e = u;var l = o.redIAdd(o);l = (l = l.redIAdd(l)).redIAdd(l), t = a.redMul(s.redISub(u)).redISub(l), r = this.y.redAdd(this.y);} else {var h = this.z.redSqr(),f = this.y.redSqr(),c = this.x.redMul(f),d = this.x.redSub(h).redMul(this.x.redAdd(h));d = d.redAdd(d).redIAdd(d);var p = c.redIAdd(c),v = (p = p.redIAdd(p)).redAdd(p);e = d.redSqr().redISub(v), r = this.y.redAdd(this.z).redSqr().redISub(f).redISub(h);var y = f.redSqr();y = (y = (y = y.redIAdd(y)).redIAdd(y)).redIAdd(y), t = d.redMul(p.redISub(e)).redISub(y);}return this.curve.jpoint(e, t, r);}, h.prototype._dbl = function () {var e = this.curve.a,t = this.x,r = this.y,n = this.z,i = n.redSqr().redSqr(),o = t.redSqr(),s = r.redSqr(),a = o.redAdd(o).redIAdd(o).redIAdd(e.redMul(i)),u = t.redAdd(t),l = (u = u.redIAdd(u)).redMul(s),h = a.redSqr().redISub(l.redAdd(l)),f = l.redISub(h),c = s.redSqr();c = (c = (c = c.redIAdd(c)).redIAdd(c)).redIAdd(c);var d = a.redMul(f).redISub(c),p = r.redAdd(r).redMul(n);return this.curve.jpoint(h, d, p);}, h.prototype.trpl = function () {if (!this.curve.zeroA) return this.dbl().add(this);var e = this.x.redSqr(),t = this.y.redSqr(),r = this.z.redSqr(),n = t.redSqr(),i = e.redAdd(e).redIAdd(e),o = i.redSqr(),s = this.x.redAdd(t).redSqr().redISub(e).redISub(n),a = (s = (s = (s = s.redIAdd(s)).redAdd(s).redIAdd(s)).redISub(o)).redSqr(),u = n.redIAdd(n);u = (u = (u = u.redIAdd(u)).redIAdd(u)).redIAdd(u);var l = i.redIAdd(s).redSqr().redISub(o).redISub(a).redISub(u),h = t.redMul(l);h = (h = h.redIAdd(h)).redIAdd(h);var f = this.x.redMul(a).redISub(h);f = (f = f.redIAdd(f)).redIAdd(f);var c = this.y.redMul(l.redMul(u.redISub(l)).redISub(s.redMul(a)));c = (c = (c = c.redIAdd(c)).redIAdd(c)).redIAdd(c);var d = this.z.redAdd(s).redSqr().redISub(r).redISub(a);return this.curve.jpoint(f, c, d);}, h.prototype.mul = function (e, t) {return e = new _(e, t), this.curve._wnafMul(this, e);}, h.prototype.eq = function (e) {if ("affine" === e.type) return this.eq(e.toJ());if (this === e) return !0;var t = this.z.redSqr(),r = e.z.redSqr();if (0 !== this.x.redMul(r).redISub(e.x.redMul(t)).cmpn(0)) return !1;var n = t.redMul(this.z),i = r.redMul(e.z);return 0 === this.y.redMul(i).redISub(e.y.redMul(n)).cmpn(0);}, h.prototype.eqXToP = function (e) {var t = this.z.redSqr(),r = e.toRed(this.curve.red).redMul(t);if (0 === this.x.cmp(r)) return !0;for (var n = e.clone(), i = this.curve.redN.redMul(t);;) {if (n.iadd(this.curve.n), 0 <= n.cmp(this.curve.p)) return !1;if (r.redIAdd(i), 0 === this.x.cmp(r)) return !0;}return !1;}, h.prototype.inspect = function () {return this.isInfinity() ? "<EC JPoint Infinity>" : "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">";}, h.prototype.isInfinity = function () {return 0 === this.z.cmpn(0);};}, { "../../elliptic": 12, "../curve": 15, "bn.js": 9, inherits: 39 }], 18: [function (e, t, r) {"use strict";var n,i = r,o = e("hash.js"),s = e("../elliptic"),a = s.utils.assert;function u(e) {"short" === e.type ? this.curve = new s.curve.short(e) : "edwards" === e.type ? this.curve = new s.curve.edwards(e) : this.curve = new s.curve.mont(e), this.g = this.curve.g, this.n = this.curve.n, this.hash = e.hash, a(this.g.validate(), "Invalid curve"), a(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O");}function l(t, r) {Object.defineProperty(i, t, { configurable: !0, enumerable: !0, get: function get() {var e = new u(r);return Object.defineProperty(i, t, { configurable: !0, enumerable: !0, value: e }), e;} });}i.PresetCurve = u, l("p192", { type: "short", prime: "p192", p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff", a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc", b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1", n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831", hash: o.sha256, gRed: !1, g: ["188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012", "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"] }), l("p224", { type: "short", prime: "p224", p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001", a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe", b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4", n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d", hash: o.sha256, gRed: !1, g: ["b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21", "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34"] }), l("p256", { type: "short", prime: null, p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff", a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc", b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b", n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551", hash: o.sha256, gRed: !1, g: ["6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296", "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5"] }), l("p384", { type: "short", prime: null, p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff", a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc", b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef", n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973", hash: o.sha384, gRed: !1, g: ["aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7", "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f"] }), l("p521", { type: "short", prime: null, p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff", a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc", b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00", n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409", hash: o.sha512, gRed: !1, g: ["000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66", "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650"] }), l("curve25519", { type: "mont", prime: "p25519", p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed", a: "76d06", b: "1", n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed", hash: o.sha256, gRed: !1, g: ["9"] }), l("ed25519", { type: "edwards", prime: "p25519", p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed", a: "-1", c: "1", d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3", n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed", hash: o.sha256, gRed: !1, g: ["216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a", "6666666666666666666666666666666666666666666666666666666666666658"] });try {n = e("./precomputed/secp256k1");} catch (e) {n = void 0;}l("secp256k1", { type: "short", prime: "k256", p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f", a: "0", b: "7", n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141", h: "1", hash: o.sha256, beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee", lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72", basis: [{ a: "3086d221a7d46bcde86c90e49284eb15", b: "-e4437ed6010e88286f547fa90abfe4c3" }, { a: "114ca50f7a8e2f3f657c1108d9d44cfd8", b: "3086d221a7d46bcde86c90e49284eb15" }], gRed: !1, g: ["79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8", n] });}, { "../elliptic": 12, "./precomputed/secp256k1": 24, "hash.js": 27 }], 19: [function (e, t, r) {"use strict";var y = e("bn.js"),m = e("../../elliptic"),d = m.utils.assert,n = e("./key"),g = e("./signature");function i(e) {if (!(this instanceof i)) return new i(e);"string" == typeof e && (d(m.curves.hasOwnProperty(e), "Unknown curve " + e), e = m.curves[e]), e instanceof m.curves.PresetCurve && (e = { curve: e }), this.curve = e.curve.curve, this.n = this.curve.n, this.nh = this.n.ushrn(1), this.g = this.curve.g, this.g = e.curve.g, this.g.precompute(e.curve.n.bitLength() + 1), this.hash = e.hash || e.curve.hash;}(t.exports = i).prototype.keyPair = function (e) {return new n(this, e);}, i.prototype.keyFromPrivate = function (e, t) {return n.fromPrivate(this, e, t);}, i.prototype.keyFromPublic = function (e, t) {return n.fromPublic(this, e, t);}, i.prototype.genKeyPair = function (e) {e = e || {};for (var t = new m.hmacDRBG({ hash: this.hash, pers: e.pers, entropy: e.entropy || m.rand(this.hash.hmacStrength), nonce: this.n.toArray() }), r = this.n.byteLength(), n = this.n.sub(new y(2));;) {var i = new y(t.generate(r));if (!(0 < i.cmp(n))) return i.iaddn(1), this.keyFromPrivate(i);}}, i.prototype._truncateToN = function (e, t) {var r = 8 * e.byteLength() - this.n.bitLength();return 0 < r && (e = e.ushrn(r)), !t && 0 <= e.cmp(this.n) ? e.sub(this.n) : e;}, i.prototype.sign = function (e, t, r, n) {"object" == typeof r && (n = r, r = null), n = n || {}, t = this.keyFromPrivate(t, r), e = this._truncateToN(new y(e, 16));for (var i = this.n.byteLength(), o = t.getPrivate().toArray("be", i), s = e.toArray("be", i), a = new m.hmacDRBG({ hash: this.hash, entropy: o, nonce: s, pers: n.pers, persEnc: n.persEnc }), u = this.n.sub(new y(1)), l = 0;; l++) {var h = n.k ? n.k(l) : new y(a.generate(this.n.byteLength()));if (!((h = this._truncateToN(h, !0)).cmpn(1) <= 0 || 0 <= h.cmp(u))) {var f = this.g.mul(h);if (!f.isInfinity()) {var c = f.getX(),d = c.umod(this.n);if (0 !== d.cmpn(0)) {var p = h.invm(this.n).mul(d.mul(t.getPrivate()).iadd(e));if (0 !== (p = p.umod(this.n)).cmpn(0)) {var v = (f.getY().isOdd() ? 1 : 0) | (0 !== c.cmp(d) ? 2 : 0);return n.canonical && 0 < p.cmp(this.nh) && (p = this.n.sub(p), v ^= 1), new g({ r: d, s: p, recoveryParam: v });}}}}}}, i.prototype.verify = function (e, t, r, n) {e = this._truncateToN(new y(e, 16)), r = this.keyFromPublic(r, n);var i = (t = new g(t, "hex")).r,o = t.s;if (i.cmpn(1) < 0 || 0 <= i.cmp(this.n)) return !1;if (o.cmpn(1) < 0 || 0 <= o.cmp(this.n)) return !1;var s,a = o.invm(this.n),u = a.mul(e).umod(this.n),l = a.mul(i).umod(this.n);return this.curve._maxwellTrick ? !(s = this.g.jmulAdd(u, r.getPublic(), l)).isInfinity() && s.eqXToP(i) : !(s = this.g.mulAdd(u, r.getPublic(), l)).isInfinity() && 0 === s.getX().umod(this.n).cmp(i);}, i.prototype.recoverPubKey = function (e, t, r, n) {d((3 & r) === r, "The recovery param is more than two bits"), t = new g(t, n);var i = this.n,o = new y(e),s = t.r,a = t.s,u = 1 & r,l = r >> 1;if (0 <= s.cmp(this.curve.p.umod(this.curve.n)) && l) throw new Error("Unable to find sencond key candinate");s = l ? this.curve.pointFromX(s.add(this.curve.n), u) : this.curve.pointFromX(s, u);var h = t.r.invm(i),f = i.sub(o).mul(h).umod(i),c = a.mul(h).umod(i);return this.g.mulAdd(f, s, c);}, i.prototype.getKeyRecoveryParam = function (e, t, r, n) {if (null !== (t = new g(t, n)).recoveryParam) return t.recoveryParam;for (var i = 0; i < 4; i++) {var o;try {o = this.recoverPubKey(e, t, i);} catch (e) {continue;}if (o.eq(r)) return i;}throw new Error("Unable to find valid recovery factor");};}, { "../../elliptic": 12, "./key": 20, "./signature": 21, "bn.js": 9 }], 20: [function (e, t, r) {"use strict";var n = e("bn.js"),i = e("../../elliptic").utils.assert;function o(e, t) {this.ec = e, this.priv = null, this.pub = null, t.priv && this._importPrivate(t.priv, t.privEnc), t.pub && this._importPublic(t.pub, t.pubEnc);}(t.exports = o).fromPublic = function (e, t, r) {return t instanceof o ? t : new o(e, { pub: t, pubEnc: r });}, o.fromPrivate = function (e, t, r) {return t instanceof o ? t : new o(e, { priv: t, privEnc: r });}, o.prototype.validate = function () {var e = this.getPublic();return e.isInfinity() ? { result: !1, reason: "Invalid public key" } : e.validate() ? e.mul(this.ec.curve.n).isInfinity() ? { result: !0, reason: null } : { result: !1, reason: "Public key * N != O" } : { result: !1, reason: "Public key is not a point" };}, o.prototype.getPublic = function (e, t) {return "string" == typeof e && (t = e, e = null), this.pub || (this.pub = this.ec.g.mul(this.priv)), t ? this.pub.encode(t, e) : this.pub;}, o.prototype.getPrivate = function (e) {return "hex" === e ? this.priv.toString(16, 2) : this.priv;}, o.prototype._importPrivate = function (e, t) {this.priv = new n(e, t || 16), this.priv = this.priv.umod(this.ec.curve.n);}, o.prototype._importPublic = function (e, t) {if (e.x || e.y) return "mont" === this.ec.curve.type ? i(e.x, "Need x coordinate") : "short" !== this.ec.curve.type && "edwards" !== this.ec.curve.type || i(e.x && e.y, "Need both x and y coordinate"), void (this.pub = this.ec.curve.point(e.x, e.y));this.pub = this.ec.curve.decodePoint(e, t);}, o.prototype.derive = function (e) {return e.mul(this.priv).getX();}, o.prototype.sign = function (e, t, r) {return this.ec.sign(e, this, t, r);}, o.prototype.verify = function (e, t) {return this.ec.verify(e, t, this);}, o.prototype.inspect = function () {return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >";};}, { "../../elliptic": 12, "bn.js": 9 }], 21: [function (e, t, r) {"use strict";var a = e("bn.js"),u = e("../../elliptic").utils,n = u.assert;function i(e, t) {if (e instanceof i) return e;this._importDER(e, t) || (n(e.r && e.s, "Signature without r or s"), this.r = new a(e.r, 16), this.s = new a(e.s, 16), void 0 === e.recoveryParam ? this.recoveryParam = null : this.recoveryParam = e.recoveryParam);}function l() {this.place = 0;}function h(e, t) {var r = e[t.place++];if (!(128 & r)) return r;for (var n = 15 & r, i = 0, o = 0, s = t.place; o < n; o++, s++) {i <<= 8, i |= e[s];}return t.place = s, i;}function s(e) {for (var t = 0, r = e.length - 1; !e[t] && !(128 & e[t + 1]) && t < r;) {t++;}return 0 === t ? e : e.slice(t);}function f(e, t) {if (t < 128) e.push(t);else {var r = 1 + (Math.log(t) / Math.LN2 >>> 3);for (e.push(128 | r); --r;) {e.push(t >>> (r << 3) & 255);}e.push(t);}}(t.exports = i).prototype._importDER = function (e, t) {e = u.toArray(e, t);var r = new l();if (48 !== e[r.place++]) return !1;if (h(e, r) + r.place !== e.length) return !1;if (2 !== e[r.place++]) return !1;var n = h(e, r),i = e.slice(r.place, n + r.place);if (r.place += n, 2 !== e[r.place++]) return !1;var o = h(e, r);if (e.length !== o + r.place) return !1;var s = e.slice(r.place, o + r.place);return 0 === i[0] && 128 & i[1] && (i = i.slice(1)), 0 === s[0] && 128 & s[1] && (s = s.slice(1)), this.r = new a(i), this.s = new a(s), !(this.recoveryParam = null);}, i.prototype.toDER = function (e) {var t = this.r.toArray(),r = this.s.toArray();for (128 & t[0] && (t = [0].concat(t)), 128 & r[0] && (r = [0].concat(r)), t = s(t), r = s(r); !(r[0] || 128 & r[1]);) {r = r.slice(1);}var n = [2];f(n, t.length), (n = n.concat(t)).push(2), f(n, r.length);var i = n.concat(r),o = [48];return f(o, i.length), o = o.concat(i), u.encode(o, e);};}, { "../../elliptic": 12, "bn.js": 9 }], 22: [function (e, t, r) {arguments[4][14][0].apply(r, arguments);}, { dup: 14 }], 23: [function (e, t, r) {"use strict";var n = e("hash.js"),s = e("../elliptic").utils,i = s.assert;function o(e) {if (!(this instanceof o)) return new o(e);this.hash = e.hash, this.predResist = !!e.predResist, this.outLen = this.hash.outSize, this.minEntropy = e.minEntropy || this.hash.hmacStrength, this.reseed = null, this.reseedInterval = null, this.K = null, this.V = null;var t = s.toArray(e.entropy, e.entropyEnc),r = s.toArray(e.nonce, e.nonceEnc),n = s.toArray(e.pers, e.persEnc);i(t.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._init(t, r, n);}(t.exports = o).prototype._init = function (e, t, r) {var n = e.concat(t).concat(r);this.K = new Array(this.outLen / 8), this.V = new Array(this.outLen / 8);for (var i = 0; i < this.V.length; i++) {this.K[i] = 0, this.V[i] = 1;}this._update(n), this.reseed = 1, this.reseedInterval = 281474976710656;}, o.prototype._hmac = function () {return new n.hmac(this.hash, this.K);}, o.prototype._update = function (e) {var t = this._hmac().update(this.V).update([0]);e && (t = t.update(e)), this.K = t.digest(), this.V = this._hmac().update(this.V).digest(), e && (this.K = this._hmac().update(this.V).update([1]).update(e).digest(), this.V = this._hmac().update(this.V).digest());}, o.prototype.reseed = function (e, t, r, n) {"string" != typeof t && (n = r, r = t, t = null), e = s.toBuffer(e, t), r = s.toBuffer(r, n), i(e.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._update(e.concat(r || [])), this.reseed = 1;}, o.prototype.generate = function (e, t, r, n) {if (this.reseed > this.reseedInterval) throw new Error("Reseed is required");"string" != typeof t && (n = r, r = t, t = null), r && (r = s.toArray(r, n), this._update(r));for (var i = []; i.length < e;) {this.V = this._hmac().update(this.V).digest(), i = i.concat(this.V);}var o = i.slice(0, e);return this._update(r), this.reseed++, s.encode(o, t);};}, { "../elliptic": 12, "hash.js": 27 }], 24: [function (e, t, r) {t.exports = void 0;}, {}], 25: [function (e, t, r) {"use strict";var n = r,i = e("bn.js");function o(e) {return 1 === e.length ? "0" + e : e;}function s(e) {for (var t = "", r = 0; r < e.length; r++) {t += o(e[r].toString(16));}return t;}n.assert = function (e, t) {if (!e) throw new Error(t || "Assertion failed");}, n.toArray = function (e, t) {if (Array.isArray(e)) return e.slice();if (!e) return [];var r = [];if ("string" != typeof e) {for (var n = 0; n < e.length; n++) {r[n] = 0 | e[n];}return r;}if (t) {if ("hex" === t) {(e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e = "0" + e);for (n = 0; n < e.length; n += 2) {r.push(parseInt(e[n] + e[n + 1], 16));}}} else for (var n = 0; n < e.length; n++) {var i = e.charCodeAt(n),o = i >> 8,s = 255 & i;o ? r.push(o, s) : r.push(s);}return r;}, n.zero2 = o, n.toHex = s, n.encode = function (e, t) {return "hex" === t ? s(e) : e;}, n.getNAF = function (e, t) {for (var r = [], n = 1 << t + 1, i = e.clone(); 0 <= i.cmpn(1);) {var o;if (i.isOdd()) {var s = i.andln(n - 1);o = (n >> 1) - 1 < s ? (n >> 1) - s : s, i.isubn(o);} else o = 0;r.push(o);for (var a = 0 !== i.cmpn(0) && 0 === i.andln(n - 1) ? t + 1 : 1, u = 1; u < a; u++) {r.push(0);}i.iushrn(a);}return r;}, n.getJSF = function (e, t) {var r = [[], []];e = e.clone(), t = t.clone();for (var n = 0, i = 0; 0 < e.cmpn(-n) || 0 < t.cmpn(-i);) {var o,s,a,u = e.andln(3) + n & 3,l = t.andln(3) + i & 3;if (3 === u && (u = -1), 3 === l && (l = -1), 0 == (1 & u)) o = 0;else o = 3 !== (a = e.andln(7) + n & 7) && 5 !== a || 2 !== l ? u : -u;if (r[0].push(o), 0 == (1 & l)) s = 0;else s = 3 !== (a = t.andln(7) + i & 7) && 5 !== a || 2 !== u ? l : -l;r[1].push(s), 2 * n === o + 1 && (n = 1 - n), 2 * i === s + 1 && (i = 1 - i), e.iushrn(1), t.iushrn(1);}return r;}, n.cachedProperty = function (e, t, r) {var n = "_" + t;e.prototype[t] = function () {return void 0 !== this[n] ? this[n] : this[n] = r.call(this);};}, n.parseBytes = function (e) {return "string" == typeof e ? n.toArray(e, "hex") : e;}, n.intFromLE = function (e) {return new i(e, "hex", "le");};}, { "bn.js": 9 }], 26: [function (e, t, r) {t.exports = { version: "6.3.3" };}, {}], 27: [function (e, t, r) {var n = r;n.utils = e("./hash/utils"), n.common = e("./hash/common"), n.sha = e("./hash/sha"), n.ripemd = e("./hash/ripemd"), n.hmac = e("./hash/hmac"), n.sha1 = n.sha.sha1, n.sha256 = n.sha.sha256, n.sha224 = n.sha.sha224, n.sha384 = n.sha.sha384, n.sha512 = n.sha.sha512, n.ripemd160 = n.ripemd.ripemd160;}, { "./hash/common": 28, "./hash/hmac": 29, "./hash/ripemd": 30, "./hash/sha": 31, "./hash/utils": 38 }], 28: [function (e, t, r) {"use strict";var i = e("./utils"),n = e("minimalistic-assert");function o() {this.pending = null, this.pendingTotal = 0, this.blockSize = this.constructor.blockSize, this.outSize = this.constructor.outSize, this.hmacStrength = this.constructor.hmacStrength, this.padLength = this.constructor.padLength / 8, this.endian = "big", this._delta8 = this.blockSize / 8, this._delta32 = this.blockSize / 32;}(r.BlockHash = o).prototype.update = function (e, t) {if (e = i.toArray(e, t), this.pending ? this.pending = this.pending.concat(e) : this.pending = e, this.pendingTotal += e.length, this.pending.length >= this._delta8) {var r = (e = this.pending).length % this._delta8;this.pending = e.slice(e.length - r, e.length), 0 === this.pending.length && (this.pending = null), e = i.join32(e, 0, e.length - r, this.endian);for (var n = 0; n < e.length; n += this._delta32) {this._update(e, n, n + this._delta32);}}return this;}, o.prototype.digest = function (e) {return this.update(this._pad()), n(null === this.pending), this._digest(e);}, o.prototype._pad = function () {var e = this.pendingTotal,t = this._delta8,r = t - (e + this.padLength) % t,n = new Array(r + this.padLength);n[0] = 128;for (var i = 1; i < r; i++) {n[i] = 0;}if (e <<= 3, "big" === this.endian) {for (var o = 8; o < this.padLength; o++) {n[i++] = 0;}n[i++] = 0, n[i++] = 0, n[i++] = 0, n[i++] = 0, n[i++] = e >>> 24 & 255, n[i++] = e >>> 16 & 255, n[i++] = e >>> 8 & 255, n[i++] = 255 & e;} else for (n[i++] = 255 & e, n[i++] = e >>> 8 & 255, n[i++] = e >>> 16 & 255, n[i++] = e >>> 24 & 255, n[i++] = 0, n[i++] = 0, n[i++] = 0, n[i++] = 0, o = 8; o < this.padLength; o++) {n[i++] = 0;}return n;};}, { "./utils": 38, "minimalistic-assert": 41 }], 29: [function (e, t, r) {"use strict";var n = e("./utils"),i = e("minimalistic-assert");function o(e, t, r) {if (!(this instanceof o)) return new o(e, t, r);this.Hash = e, this.blockSize = e.blockSize / 8, this.outSize = e.outSize / 8, this.inner = null, this.outer = null, this._init(n.toArray(t, r));}(t.exports = o).prototype._init = function (e) {e.length > this.blockSize && (e = new this.Hash().update(e).digest()), i(e.length <= this.blockSize);for (var t = e.length; t < this.blockSize; t++) {e.push(0);}for (t = 0; t < e.length; t++) {e[t] ^= 54;}for (this.inner = new this.Hash().update(e), t = 0; t < e.length; t++) {e[t] ^= 106;}this.outer = new this.Hash().update(e);}, o.prototype.update = function (e, t) {return this.inner.update(e, t), this;}, o.prototype.digest = function (e) {return this.outer.update(this.inner.digest()), this.outer.digest(e);};}, { "./utils": 38, "minimalistic-assert": 41 }], 30: [function (e, t, r) {"use strict";var n = e("./utils"),i = e("./common"),p = n.rotl32,v = n.sum32,y = n.sum32_3,m = n.sum32_4,o = i.BlockHash;function s() {if (!(this instanceof s)) return new s();o.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.endian = "little";}function g(e, t, r, n) {return e <= 15 ? t ^ r ^ n : e <= 31 ? t & r | ~t & n : e <= 47 ? (t | ~r) ^ n : e <= 63 ? t & n | r & ~n : t ^ (r | ~n);}function b(e) {return e <= 15 ? 0 : e <= 31 ? 1518500249 : e <= 47 ? 1859775393 : e <= 63 ? 2400959708 : 2840853838;}function w(e) {return e <= 15 ? 1352829926 : e <= 31 ? 1548603684 : e <= 47 ? 1836072691 : e <= 63 ? 2053994217 : 0;}n.inherits(s, o), (r.ripemd160 = s).blockSize = 512, s.outSize = 160, s.hmacStrength = 192, s.padLength = 64, s.prototype._update = function (e, t) {for (var r = this.h[0], n = this.h[1], i = this.h[2], o = this.h[3], s = this.h[4], a = r, u = n, l = i, h = o, f = s, c = 0; c < 80; c++) {var d = v(p(m(r, g(c, n, i, o), e[_[c] + t], b(c)), A[c]), s);r = s, s = o, o = p(i, 10), i = n, n = d, d = v(p(m(a, g(79 - c, u, l, h), e[M[c] + t], w(c)), E[c]), f), a = f, f = h, h = p(l, 10), l = u, u = d;}d = y(this.h[1], i, h), this.h[1] = y(this.h[2], o, f), this.h[2] = y(this.h[3], s, a), this.h[3] = y(this.h[4], r, u), this.h[4] = y(this.h[0], n, l), this.h[0] = d;}, s.prototype._digest = function (e) {return "hex" === e ? n.toHex32(this.h, "little") : n.split32(this.h, "little");};var _ = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13],M = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11],A = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6],E = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11];}, { "./common": 28, "./utils": 38 }], 31: [function (e, t, r) {"use strict";r.sha1 = e("./sha/1"), r.sha224 = e("./sha/224"), r.sha256 = e("./sha/256"), r.sha384 = e("./sha/384"), r.sha512 = e("./sha/512");}, { "./sha/1": 32, "./sha/224": 33, "./sha/256": 34, "./sha/384": 35, "./sha/512": 36 }], 32: [function (e, t, r) {arguments[4][14][0].apply(r, arguments);}, { dup: 14 }], 33: [function (e, t, r) {arguments[4][14][0].apply(r, arguments);}, { dup: 14 }], 34: [function (e, t, r) {"use strict";var n = e("../utils"),i = e("../common"),o = e("./common"),p = e("minimalistic-assert"),v = n.sum32,y = n.sum32_4,m = n.sum32_5,g = o.ch32,b = o.maj32,w = o.s0_256,_ = o.s1_256,M = o.g0_256,A = o.g1_256,s = i.BlockHash,a = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];function u() {if (!(this instanceof u)) return new u();s.call(this), this.h = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], this.k = a, this.W = new Array(64);}n.inherits(u, s), (t.exports = u).blockSize = 512, u.outSize = 256, u.hmacStrength = 192, u.padLength = 64, u.prototype._update = function (e, t) {for (var r = this.W, n = 0; n < 16; n++) {r[n] = e[t + n];}for (; n < r.length; n++) {r[n] = y(A(r[n - 2]), r[n - 7], M(r[n - 15]), r[n - 16]);}var i = this.h[0],o = this.h[1],s = this.h[2],a = this.h[3],u = this.h[4],l = this.h[5],h = this.h[6],f = this.h[7];for (p(this.k.length === r.length), n = 0; n < r.length; n++) {var c = m(f, _(u), g(u, l, h), this.k[n], r[n]),d = v(w(i), b(i, o, s));f = h, h = l, l = u, u = v(a, c), a = s, s = o, o = i, i = v(c, d);}this.h[0] = v(this.h[0], i), this.h[1] = v(this.h[1], o), this.h[2] = v(this.h[2], s), this.h[3] = v(this.h[3], a), this.h[4] = v(this.h[4], u), this.h[5] = v(this.h[5], l), this.h[6] = v(this.h[6], h), this.h[7] = v(this.h[7], f);}, u.prototype._digest = function (e) {return "hex" === e ? n.toHex32(this.h, "big") : n.split32(this.h, "big");};}, { "../common": 28, "../utils": 38, "./common": 37, "minimalistic-assert": 41 }], 35: [function (e, t, r) {arguments[4][14][0].apply(r, arguments);}, { dup: 14 }], 36: [function (e, t, r) {"use strict";var n = e("../utils"),i = e("../common"),C = e("minimalistic-assert"),o = n.rotr64_hi,s = n.rotr64_lo,a = n.shr64_hi,u = n.shr64_lo,B = n.sum64,D = n.sum64_hi,L = n.sum64_lo,c = n.sum64_4_hi,d = n.sum64_4_lo,U = n.sum64_5_hi,F = n.sum64_5_lo,l = i.BlockHash,h = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591];function f() {if (!(this instanceof f)) return new f();l.call(this), this.h = [1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209], this.k = h, this.W = new Array(160);}function j(e, t, r, n, i) {var o = e & r ^ ~e & i;return o < 0 && (o += 4294967296), o;}function G(e, t, r, n, i, o) {var s = t & n ^ ~t & o;return s < 0 && (s += 4294967296), s;}function H(e, t, r, n, i) {var o = e & r ^ e & i ^ r & i;return o < 0 && (o += 4294967296), o;}function z(e, t, r, n, i, o) {var s = t & n ^ t & o ^ n & o;return s < 0 && (s += 4294967296), s;}function V(e, t) {var r = o(e, t, 28) ^ o(t, e, 2) ^ o(t, e, 7);return r < 0 && (r += 4294967296), r;}function K(e, t) {var r = s(e, t, 28) ^ s(t, e, 2) ^ s(t, e, 7);return r < 0 && (r += 4294967296), r;}function q(e, t) {var r = o(e, t, 14) ^ o(e, t, 18) ^ o(t, e, 9);return r < 0 && (r += 4294967296), r;}function W(e, t) {var r = s(e, t, 14) ^ s(e, t, 18) ^ s(t, e, 9);return r < 0 && (r += 4294967296), r;}function p(e, t) {var r = o(e, t, 1) ^ o(e, t, 8) ^ a(e, t, 7);return r < 0 && (r += 4294967296), r;}function v(e, t) {var r = s(e, t, 1) ^ s(e, t, 8) ^ u(e, t, 7);return r < 0 && (r += 4294967296), r;}function y(e, t) {var r = o(e, t, 19) ^ o(t, e, 29) ^ a(e, t, 6);return r < 0 && (r += 4294967296), r;}function m(e, t) {var r = s(e, t, 19) ^ s(t, e, 29) ^ u(e, t, 6);return r < 0 && (r += 4294967296), r;}n.inherits(f, l), (t.exports = f).blockSize = 1024, f.outSize = 512, f.hmacStrength = 192, f.padLength = 128, f.prototype._prepareBlock = function (e, t) {for (var r = this.W, n = 0; n < 32; n++) {r[n] = e[t + n];}for (; n < r.length; n += 2) {var i = y(r[n - 4], r[n - 3]),o = m(r[n - 4], r[n - 3]),s = r[n - 14],a = r[n - 13],u = p(r[n - 30], r[n - 29]),l = v(r[n - 30], r[n - 29]),h = r[n - 32],f = r[n - 31];r[n] = c(i, o, s, a, u, l, h, f), r[n + 1] = d(i, o, s, a, u, l, h, f);}}, f.prototype._update = function (e, t) {this._prepareBlock(e, t);var r = this.W,n = this.h[0],i = this.h[1],o = this.h[2],s = this.h[3],a = this.h[4],u = this.h[5],l = this.h[6],h = this.h[7],f = this.h[8],c = this.h[9],d = this.h[10],p = this.h[11],v = this.h[12],y = this.h[13],m = this.h[14],g = this.h[15];C(this.k.length === r.length);for (var b = 0; b < r.length; b += 2) {var w = m,_ = g,M = q(f, c),A = W(f, c),E = j(f, c, d, p, v),S = G(f, c, d, p, v, y),k = this.k[b],N = this.k[b + 1],P = r[b],x = r[b + 1],I = U(w, _, M, A, E, S, k, N, P, x),T = F(w, _, M, A, E, S, k, N, P, x);w = V(n, i), _ = K(n, i), M = H(n, i, o, s, a), A = z(n, i, o, s, a, u);var R = D(w, _, M, A),O = L(w, _, M, A);m = v, g = y, v = d, y = p, d = f, p = c, f = D(l, h, I, T), c = L(h, h, I, T), l = a, h = u, a = o, u = s, o = n, s = i, n = D(I, T, R, O), i = L(I, T, R, O);}B(this.h, 0, n, i), B(this.h, 2, o, s), B(this.h, 4, a, u), B(this.h, 6, l, h), B(this.h, 8, f, c), B(this.h, 10, d, p), B(this.h, 12, v, y), B(this.h, 14, m, g);}, f.prototype._digest = function (e) {return "hex" === e ? n.toHex32(this.h, "big") : n.split32(this.h, "big");};}, { "../common": 28, "../utils": 38, "minimalistic-assert": 41 }], 37: [function (e, t, r) {"use strict";var n = e("../utils").rotr32;function i(e, t, r) {return e & t ^ ~e & r;}function o(e, t, r) {return e & t ^ e & r ^ t & r;}function s(e, t, r) {return e ^ t ^ r;}r.ft_1 = function (e, t, r, n) {return 0 === e ? i(t, r, n) : 1 === e || 3 === e ? s(t, r, n) : 2 === e ? o(t, r, n) : void 0;}, r.ch32 = i, r.maj32 = o, r.p32 = s, r.s0_256 = function (e) {return n(e, 2) ^ n(e, 13) ^ n(e, 22);}, r.s1_256 = function (e) {return n(e, 6) ^ n(e, 11) ^ n(e, 25);}, r.g0_256 = function (e) {return n(e, 7) ^ n(e, 18) ^ e >>> 3;}, r.g1_256 = function (e) {return n(e, 17) ^ n(e, 19) ^ e >>> 10;};}, { "../utils": 38 }], 38: [function (e, t, r) {"use strict";var l = e("minimalistic-assert"),n = e("inherits");function o(e) {return (e >>> 24 | e >>> 8 & 65280 | e << 8 & 16711680 | (255 & e) << 24) >>> 0;}function i(e) {return 1 === e.length ? "0" + e : e;}function s(e) {return 7 === e.length ? "0" + e : 6 === e.length ? "00" + e : 5 === e.length ? "000" + e : 4 === e.length ? "0000" + e : 3 === e.length ? "00000" + e : 2 === e.length ? "000000" + e : 1 === e.length ? "0000000" + e : e;}r.inherits = n, r.toArray = function (e, t) {if (Array.isArray(e)) return e.slice();if (!e) return [];var r = [];if ("string" == typeof e) {if (t) {if ("hex" === t) for ((e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e = "0" + e), n = 0; n < e.length; n += 2) {r.push(parseInt(e[n] + e[n + 1], 16));}} else for (var n = 0; n < e.length; n++) {var i = e.charCodeAt(n),o = i >> 8,s = 255 & i;o ? r.push(o, s) : r.push(s);}} else for (n = 0; n < e.length; n++) {r[n] = 0 | e[n];}return r;}, r.toHex = function (e) {for (var t = "", r = 0; r < e.length; r++) {t += i(e[r].toString(16));}return t;}, r.htonl = o, r.toHex32 = function (e, t) {for (var r = "", n = 0; n < e.length; n++) {var i = e[n];"little" === t && (i = o(i)), r += s(i.toString(16));}return r;}, r.zero2 = i, r.zero8 = s, r.join32 = function (e, t, r, n) {var i = r - t;l(i % 4 == 0);for (var o = new Array(i / 4), s = 0, a = t; s < o.length; s++, a += 4) {var u;u = "big" === n ? e[a] << 24 | e[a + 1] << 16 | e[a + 2] << 8 | e[a + 3] : e[a + 3] << 24 | e[a + 2] << 16 | e[a + 1] << 8 | e[a], o[s] = u >>> 0;}return o;}, r.split32 = function (e, t) {for (var r = new Array(4 * e.length), n = 0, i = 0; n < e.length; n++, i += 4) {var o = e[n];"big" === t ? (r[i] = o >>> 24, r[i + 1] = o >>> 16 & 255, r[i + 2] = o >>> 8 & 255, r[i + 3] = 255 & o) : (r[i + 3] = o >>> 24, r[i + 2] = o >>> 16 & 255, r[i + 1] = o >>> 8 & 255, r[i] = 255 & o);}return r;}, r.rotr32 = function (e, t) {return e >>> t | e << 32 - t;}, r.rotl32 = function (e, t) {return e << t | e >>> 32 - t;}, r.sum32 = function (e, t) {return e + t >>> 0;}, r.sum32_3 = function (e, t, r) {return e + t + r >>> 0;}, r.sum32_4 = function (e, t, r, n) {return e + t + r + n >>> 0;}, r.sum32_5 = function (e, t, r, n, i) {return e + t + r + n + i >>> 0;}, r.sum64 = function (e, t, r, n) {var i = e[t],o = n + e[t + 1] >>> 0,s = (o < n ? 1 : 0) + r + i;e[t] = s >>> 0, e[t + 1] = o;}, r.sum64_hi = function (e, t, r, n) {return (t + n >>> 0 < t ? 1 : 0) + e + r >>> 0;}, r.sum64_lo = function (e, t, r, n) {return t + n >>> 0;}, r.sum64_4_hi = function (e, t, r, n, i, o, s, a) {var u = 0,l = t;return u += (l = l + n >>> 0) < t ? 1 : 0, u += (l = l + o >>> 0) < o ? 1 : 0, e + r + i + s + (u += (l = l + a >>> 0) < a ? 1 : 0) >>> 0;}, r.sum64_4_lo = function (e, t, r, n, i, o, s, a) {return t + n + o + a >>> 0;}, r.sum64_5_hi = function (e, t, r, n, i, o, s, a, u, l) {var h = 0,f = t;return h += (f = f + n >>> 0) < t ? 1 : 0, h += (f = f + o >>> 0) < o ? 1 : 0, h += (f = f + a >>> 0) < a ? 1 : 0, e + r + i + s + u + (h += (f = f + l >>> 0) < l ? 1 : 0) >>> 0;}, r.sum64_5_lo = function (e, t, r, n, i, o, s, a, u, l) {return t + n + o + a + l >>> 0;}, r.rotr64_hi = function (e, t, r) {return (t << 32 - r | e >>> r) >>> 0;}, r.rotr64_lo = function (e, t, r) {return (e << 32 - r | t >>> r) >>> 0;}, r.shr64_hi = function (e, t, r) {return e >>> r;}, r.shr64_lo = function (e, t, r) {return (e << 32 - r | t >>> r) >>> 0;};}, { inherits: 39, "minimalistic-assert": 41 }], 39: [function (e, t, r) {"function" == typeof Object.create ? t.exports = function (e, t) {t && (e.super_ = t, e.prototype = Object.create(t.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } }));} : t.exports = function (e, t) {if (t) {var _r = function _r() {};e.super_ = t;_r.prototype = t.prototype, e.prototype = new _r(), e.prototype.constructor = e;}};}, {}], 40: [function (e, _, t) {(function (b, w) {!function () {"use strict";var e = "object" == typeof window ? window : {};!e.JS_SHA3_NO_NODE_JS && "object" == typeof b && b.versions && b.versions.node && (e = w);for (var t = !e.JS_SHA3_NO_COMMON_JS && "object" == typeof _ && _.exports, u = "0123456789abcdef".split(""), h = [0, 8, 16, 24], he = [1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648, 32907, 0, 2147483649, 0, 2147516545, 2147483648, 32777, 2147483648, 138, 0, 136, 0, 2147516425, 0, 2147483658, 0, 2147516555, 0, 139, 2147483648, 32905, 2147483648, 32771, 2147483648, 32770, 2147483648, 128, 2147483648, 32778, 0, 2147483658, 2147483648, 2147516545, 2147483648, 32896, 2147483648, 2147483649, 0, 2147516424, 2147483648], r = [224, 256, 384, 512], o = ["hex", "buffer", "arrayBuffer", "array"], s = function s(t, r, n) {return function (e) {return new m(t, r, t).update(e)[n]();};}, a = function a(r, n, i) {return function (e, t) {return new m(r, n, t).update(e)[i]();};}, n = function n(e, t) {var r = s(e, t, "hex");r.create = function () {return new m(e, t, e);}, r.update = function (e) {return r.create().update(e);};for (var n = 0; n < o.length; ++n) {var i = o[n];r[i] = s(e, t, i);}return r;}, i = [{ name: "keccak", padding: [1, 256, 65536, 16777216], bits: r, createMethod: n }, { name: "sha3", padding: [6, 1536, 393216, 100663296], bits: r, createMethod: n }, { name: "shake", padding: [31, 7936, 2031616, 520093696], bits: [128, 256], createMethod: function createMethod(t, r) {var n = a(t, r, "hex");n.create = function (e) {return new m(t, r, e);}, n.update = function (e, t) {return n.create(t).update(e);};for (var e = 0; e < o.length; ++e) {var i = o[e];n[i] = a(t, r, i);}return n;} }], l = {}, f = [], c = 0; c < i.length; ++c) {for (var d = i[c], p = d.bits, v = 0; v < p.length; ++v) {var y = d.name + "_" + p[v];f.push(y), l[y] = d.createMethod(p[v], d.padding);}}function m(e, t, r) {this.blocks = [], this.s = [], this.padding = t, this.outputBits = r, this.reset = !0, this.block = 0, this.start = 0, this.blockCount = 1600 - (e << 1) >> 5, this.byteCount = this.blockCount << 2, this.outputBlocks = r >> 5, this.extraBytes = (31 & r) >> 3;for (var n = 0; n < 50; ++n) {this.s[n] = 0;}}m.prototype.update = function (e) {var t = "string" != typeof e;t && e.constructor === ArrayBuffer && (e = new Uint8Array(e));for (var r, n, i = e.length, o = this.blocks, s = this.byteCount, a = this.blockCount, u = 0, l = this.s; u < i;) {if (this.reset) for (this.reset = !1, o[0] = this.block, r = 1; r < a + 1; ++r) {o[r] = 0;}if (t) for (r = this.start; u < i && r < s; ++u) {o[r >> 2] |= e[u] << h[3 & r++];} else for (r = this.start; u < i && r < s; ++u) {(n = e.charCodeAt(u)) < 128 ? o[r >> 2] |= n << h[3 & r++] : (n < 2048 ? o[r >> 2] |= (192 | n >> 6) << h[3 & r++] : (n < 55296 || 57344 <= n ? o[r >> 2] |= (224 | n >> 12) << h[3 & r++] : (n = 65536 + ((1023 & n) << 10 | 1023 & e.charCodeAt(++u)), o[r >> 2] |= (240 | n >> 18) << h[3 & r++], o[r >> 2] |= (128 | n >> 12 & 63) << h[3 & r++]), o[r >> 2] |= (128 | n >> 6 & 63) << h[3 & r++]), o[r >> 2] |= (128 | 63 & n) << h[3 & r++]);}if (s <= (this.lastByteIndex = r)) {for (this.start = r - s, this.block = o[a], r = 0; r < a; ++r) {l[r] ^= o[r];}g(l), this.reset = !0;} else this.start = r;}return this;}, m.prototype.finalize = function () {var e = this.blocks,t = this.lastByteIndex,r = this.blockCount,n = this.s;if (e[t >> 2] |= this.padding[3 & t], this.lastByteIndex === this.byteCount) for (e[0] = e[r], t = 1; t < r + 1; ++t) {e[t] = 0;}for (e[r - 1] |= 2147483648, t = 0; t < r; ++t) {n[t] ^= e[t];}g(n);}, m.prototype.toString = m.prototype.hex = function () {this.finalize();for (var e, t = this.blockCount, r = this.s, n = this.outputBlocks, i = this.extraBytes, o = 0, s = 0, a = ""; s < n;) {for (o = 0; o < t && s < n; ++o, ++s) {e = r[o], a += u[e >> 4 & 15] + u[15 & e] + u[e >> 12 & 15] + u[e >> 8 & 15] + u[e >> 20 & 15] + u[e >> 16 & 15] + u[e >> 28 & 15] + u[e >> 24 & 15];}s % t == 0 && (g(r), o = 0);}return i && (e = r[o], 0 < i && (a += u[e >> 4 & 15] + u[15 & e]), 1 < i && (a += u[e >> 12 & 15] + u[e >> 8 & 15]), 2 < i && (a += u[e >> 20 & 15] + u[e >> 16 & 15])), a;}, m.prototype.buffer = m.prototype.arrayBuffer = function () {this.finalize();var e,t = this.blockCount,r = this.s,n = this.outputBlocks,i = this.extraBytes,o = 0,s = 0,a = this.outputBits >> 3;e = i ? new ArrayBuffer(n + 1 << 2) : new ArrayBuffer(a);for (var u = new Uint32Array(e); s < n;) {for (o = 0; o < t && s < n; ++o, ++s) {u[s] = r[o];}s % t == 0 && g(r);}return i && (u[o] = r[o], e = e.slice(0, a)), e;}, m.prototype.digest = m.prototype.array = function () {this.finalize();for (var e, t, r = this.blockCount, n = this.s, i = this.outputBlocks, o = this.extraBytes, s = 0, a = 0, u = []; a < i;) {for (s = 0; s < r && a < i; ++s, ++a) {e = a << 2, t = n[s], u[e] = 255 & t, u[e + 1] = t >> 8 & 255, u[e + 2] = t >> 16 & 255, u[e + 3] = t >> 24 & 255;}a % r == 0 && g(n);}return o && (e = a << 2, t = n[s], 0 < o && (u[e] = 255 & t), 1 < o && (u[e + 1] = t >> 8 & 255), 2 < o && (u[e + 2] = t >> 16 & 255)), u;};var g = function g(e) {var t, r, n, i, o, s, a, u, l, h, f, c, d, p, v, y, m, g, b, w, _, M, A, E, S, k, N, P, x, I, T, R, O, C, B, D, L, U, F, j, G, H, z, V, K, q, W, Z, J, X, $, Q, Y, ee, te, re, ne, ie, oe, se, ae, ue, le;for (n = 0; n < 48; n += 2) {i = e[0] ^ e[10] ^ e[20] ^ e[30] ^ e[40], o = e[1] ^ e[11] ^ e[21] ^ e[31] ^ e[41], s = e[2] ^ e[12] ^ e[22] ^ e[32] ^ e[42], a = e[3] ^ e[13] ^ e[23] ^ e[33] ^ e[43], u = e[4] ^ e[14] ^ e[24] ^ e[34] ^ e[44], l = e[5] ^ e[15] ^ e[25] ^ e[35] ^ e[45], h = e[6] ^ e[16] ^ e[26] ^ e[36] ^ e[46], f = e[7] ^ e[17] ^ e[27] ^ e[37] ^ e[47], t = (c = e[8] ^ e[18] ^ e[28] ^ e[38] ^ e[48]) ^ (s << 1 | a >>> 31), r = (d = e[9] ^ e[19] ^ e[29] ^ e[39] ^ e[49]) ^ (a << 1 | s >>> 31), e[0] ^= t, e[1] ^= r, e[10] ^= t, e[11] ^= r, e[20] ^= t, e[21] ^= r, e[30] ^= t, e[31] ^= r, e[40] ^= t, e[41] ^= r, t = i ^ (u << 1 | l >>> 31), r = o ^ (l << 1 | u >>> 31), e[2] ^= t, e[3] ^= r, e[12] ^= t, e[13] ^= r, e[22] ^= t, e[23] ^= r, e[32] ^= t, e[33] ^= r, e[42] ^= t, e[43] ^= r, t = s ^ (h << 1 | f >>> 31), r = a ^ (f << 1 | h >>> 31), e[4] ^= t, e[5] ^= r, e[14] ^= t, e[15] ^= r, e[24] ^= t, e[25] ^= r, e[34] ^= t, e[35] ^= r, e[44] ^= t, e[45] ^= r, t = u ^ (c << 1 | d >>> 31), r = l ^ (d << 1 | c >>> 31), e[6] ^= t, e[7] ^= r, e[16] ^= t, e[17] ^= r, e[26] ^= t, e[27] ^= r, e[36] ^= t, e[37] ^= r, e[46] ^= t, e[47] ^= r, t = h ^ (i << 1 | o >>> 31), r = f ^ (o << 1 | i >>> 31), e[8] ^= t, e[9] ^= r, e[18] ^= t, e[19] ^= r, e[28] ^= t, e[29] ^= r, e[38] ^= t, e[39] ^= r, e[48] ^= t, e[49] ^= r, p = e[0], v = e[1], q = e[11] << 4 | e[10] >>> 28, W = e[10] << 4 | e[11] >>> 28, P = e[20] << 3 | e[21] >>> 29, x = e[21] << 3 | e[20] >>> 29, se = e[31] << 9 | e[30] >>> 23, ae = e[30] << 9 | e[31] >>> 23, H = e[40] << 18 | e[41] >>> 14, z = e[41] << 18 | e[40] >>> 14, C = e[2] << 1 | e[3] >>> 31, B = e[3] << 1 | e[2] >>> 31, y = e[13] << 12 | e[12] >>> 20, m = e[12] << 12 | e[13] >>> 20, Z = e[22] << 10 | e[23] >>> 22, J = e[23] << 10 | e[22] >>> 22, I = e[33] << 13 | e[32] >>> 19, T = e[32] << 13 | e[33] >>> 19, ue = e[42] << 2 | e[43] >>> 30, le = e[43] << 2 | e[42] >>> 30, ee = e[5] << 30 | e[4] >>> 2, te = e[4] << 30 | e[5] >>> 2, D = e[14] << 6 | e[15] >>> 26, L = e[15] << 6 | e[14] >>> 26, g = e[25] << 11 | e[24] >>> 21, b = e[24] << 11 | e[25] >>> 21, X = e[34] << 15 | e[35] >>> 17, $ = e[35] << 15 | e[34] >>> 17, R = e[45] << 29 | e[44] >>> 3, O = e[44] << 29 | e[45] >>> 3, E = e[6] << 28 | e[7] >>> 4, S = e[7] << 28 | e[6] >>> 4, re = e[17] << 23 | e[16] >>> 9, ne = e[16] << 23 | e[17] >>> 9, U = e[26] << 25 | e[27] >>> 7, F = e[27] << 25 | e[26] >>> 7, w = e[36] << 21 | e[37] >>> 11, _ = e[37] << 21 | e[36] >>> 11, Q = e[47] << 24 | e[46] >>> 8, Y = e[46] << 24 | e[47] >>> 8, V = e[8] << 27 | e[9] >>> 5, K = e[9] << 27 | e[8] >>> 5, k = e[18] << 20 | e[19] >>> 12, N = e[19] << 20 | e[18] >>> 12, ie = e[29] << 7 | e[28] >>> 25, oe = e[28] << 7 | e[29] >>> 25, j = e[38] << 8 | e[39] >>> 24, G = e[39] << 8 | e[38] >>> 24, M = e[48] << 14 | e[49] >>> 18, A = e[49] << 14 | e[48] >>> 18, e[0] = p ^ ~y & g, e[1] = v ^ ~m & b, e[10] = E ^ ~k & P, e[11] = S ^ ~N & x, e[20] = C ^ ~D & U, e[21] = B ^ ~L & F, e[30] = V ^ ~q & Z, e[31] = K ^ ~W & J, e[40] = ee ^ ~re & ie, e[41] = te ^ ~ne & oe, e[2] = y ^ ~g & w, e[3] = m ^ ~b & _, e[12] = k ^ ~P & I, e[13] = N ^ ~x & T, e[22] = D ^ ~U & j, e[23] = L ^ ~F & G, e[32] = q ^ ~Z & X, e[33] = W ^ ~J & $, e[42] = re ^ ~ie & se, e[43] = ne ^ ~oe & ae, e[4] = g ^ ~w & M, e[5] = b ^ ~_ & A, e[14] = P ^ ~I & R, e[15] = x ^ ~T & O, e[24] = U ^ ~j & H, e[25] = F ^ ~G & z, e[34] = Z ^ ~X & Q, e[35] = J ^ ~$ & Y, e[44] = ie ^ ~se & ue, e[45] = oe ^ ~ae & le, e[6] = w ^ ~M & p, e[7] = _ ^ ~A & v, e[16] = I ^ ~R & E, e[17] = T ^ ~O & S, e[26] = j ^ ~H & C, e[27] = G ^ ~z & B, e[36] = X ^ ~Q & V, e[37] = $ ^ ~Y & K, e[46] = se ^ ~ue & ee, e[47] = ae ^ ~le & te, e[8] = M ^ ~p & y, e[9] = A ^ ~v & m, e[18] = R ^ ~E & k, e[19] = O ^ ~S & N, e[28] = H ^ ~C & D, e[29] = z ^ ~B & L, e[38] = Q ^ ~V & q, e[39] = Y ^ ~K & W, e[48] = ue ^ ~ee & re, e[49] = le ^ ~te & ne, e[0] ^= he[n], e[1] ^= he[n + 1];}};if (t) _.exports = l;else for (c = 0; c < f.length; ++c) {e[f[c]] = l[f[c]];}}();}).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});}, { _process: 42 }], 41: [function (e, t, r) {function n(e, t) {if (!e) throw new Error(t || "Assertion failed");}(t.exports = n).equal = function (e, t, r) {if (e != t) throw new Error(r || "Assertion failed: " + e + " != " + t);};}, {}], 42: [function (e, t, r) {t.exports = { browser: !0 };}, {}], 43: [function (e, r, o) {(function (n) {"use strict";function l(e) {var y = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298],m = 1779033703,g = 3144134277,b = 1013904242,w = 2773480762,_ = 1359893119,M = 2600822924,A = 528734635,E = 1541459225,S = new Array(64);function t(e) {for (var t = 0, r = e.length; 64 <= r;) {var n,i,o,s,a,u = m,l = g,h = b,f = w,c = _,d = M,p = A,v = E;for (i = 0; i < 16; i++) {o = t + 4 * i, S[i] = (255 & e[o]) << 24 | (255 & e[o + 1]) << 16 | (255 & e[o + 2]) << 8 | 255 & e[o + 3];}for (i = 16; i < 64; i++) {s = ((n = S[i - 2]) >>> 17 | n << 15) ^ (n >>> 19 | n << 13) ^ n >>> 10, a = ((n = S[i - 15]) >>> 7 | n << 25) ^ (n >>> 18 | n << 14) ^ n >>> 3, S[i] = (s + S[i - 7] | 0) + (a + S[i - 16] | 0) | 0;}for (i = 0; i < 64; i++) {s = (((c >>> 6 | c << 26) ^ (c >>> 11 | c << 21) ^ (c >>> 25 | c << 7)) + (c & d ^ ~c & p) | 0) + (v + (y[i] + S[i] | 0) | 0) | 0, a = ((u >>> 2 | u << 30) ^ (u >>> 13 | u << 19) ^ (u >>> 22 | u << 10)) + (u & l ^ u & h ^ l & h) | 0, v = p, p = d, d = c, c = f + s | 0, f = h, h = l, l = u, u = s + a | 0;}m = m + u | 0, g = g + l | 0, b = b + h | 0, w = w + f | 0, _ = _ + c | 0, M = M + d | 0, A = A + p | 0, E = E + v | 0, t += 64, r -= 64;}}t(e);var r,n = e.length % 64,i = e.length / 536870912 | 0,o = e.length << 3,s = n < 56 ? 56 : 120,a = e.slice(e.length - n, e.length);for (a.push(128), r = 1 + n; r < s; r++) {a.push(0);}return a.push(i >>> 24 & 255), a.push(i >>> 16 & 255), a.push(i >>> 8 & 255), a.push(i >>> 0 & 255), a.push(o >>> 24 & 255), a.push(o >>> 16 & 255), a.push(o >>> 8 & 255), a.push(o >>> 0 & 255), t(a), [m >>> 24 & 255, m >>> 16 & 255, m >>> 8 & 255, m >>> 0 & 255, g >>> 24 & 255, g >>> 16 & 255, g >>> 8 & 255, g >>> 0 & 255, b >>> 24 & 255, b >>> 16 & 255, b >>> 8 & 255, b >>> 0 & 255, w >>> 24 & 255, w >>> 16 & 255, w >>> 8 & 255, w >>> 0 & 255, _ >>> 24 & 255, _ >>> 16 & 255, _ >>> 8 & 255, _ >>> 0 & 255, M >>> 24 & 255, M >>> 16 & 255, M >>> 8 & 255, M >>> 0 & 255, A >>> 24 & 255, A >>> 16 & 255, A >>> 8 & 255, A >>> 0 & 255, E >>> 24 & 255, E >>> 16 & 255, E >>> 8 & 255, E >>> 0 & 255];}function x(e, t, r) {var n;e = e.length <= 64 ? e : l(e);var i = 64 + t.length + 4,o = new Array(i),s = new Array(64),a = [];for (n = 0; n < 64; n++) {o[n] = 54;}for (n = 0; n < e.length; n++) {o[n] ^= e[n];}for (n = 0; n < t.length; n++) {o[64 + n] = t[n];}for (n = i - 4; n < i; n++) {o[n] = 0;}for (n = 0; n < 64; n++) {s[n] = 92;}for (n = 0; n < e.length; n++) {s[n] ^= e[n];}function u() {for (var e = i - 1; i - 4 <= e; e--) {if (o[e]++, o[e] <= 255) return;o[e] = 0;}}for (; 32 <= r;) {u(), a = a.concat(l(s.concat(l(o)))), r -= 32;}return 0 < r && (u(), a = a.concat(l(s.concat(l(o))).slice(0, r))), a;}function I(e, t, r, n, i) {var o;for (R(e, 16 * (2 * r - 1), i, 0, 16), o = 0; o < 2 * r; o++) {T(e, 16 * o, i, 16), s(i, n), R(i, 0, e, t + 16 * o, 16);}for (o = 0; o < r; o++) {R(e, t + 2 * o * 16, e, 16 * o, 16);}for (o = 0; o < r; o++) {R(e, t + 16 * (2 * o + 1), e, 16 * (o + r), 16);}}function i(e, t) {return e << t | e >>> 32 - t;}function s(e, t) {R(e, 0, t, 0, 16);for (var r = 8; 0 < r; r -= 2) {t[4] ^= i(t[0] + t[12], 7), t[8] ^= i(t[4] + t[0], 9), t[12] ^= i(t[8] + t[4], 13), t[0] ^= i(t[12] + t[8], 18), t[9] ^= i(t[5] + t[1], 7), t[13] ^= i(t[9] + t[5], 9), t[1] ^= i(t[13] + t[9], 13), t[5] ^= i(t[1] + t[13], 18), t[14] ^= i(t[10] + t[6], 7), t[2] ^= i(t[14] + t[10], 9), t[6] ^= i(t[2] + t[14], 13), t[10] ^= i(t[6] + t[2], 18), t[3] ^= i(t[15] + t[11], 7), t[7] ^= i(t[3] + t[15], 9), t[11] ^= i(t[7] + t[3], 13), t[15] ^= i(t[11] + t[7], 18), t[1] ^= i(t[0] + t[3], 7), t[2] ^= i(t[1] + t[0], 9), t[3] ^= i(t[2] + t[1], 13), t[0] ^= i(t[3] + t[2], 18), t[6] ^= i(t[5] + t[4], 7), t[7] ^= i(t[6] + t[5], 9), t[4] ^= i(t[7] + t[6], 13), t[5] ^= i(t[4] + t[7], 18), t[11] ^= i(t[10] + t[9], 7), t[8] ^= i(t[11] + t[10], 9), t[9] ^= i(t[8] + t[11], 13), t[10] ^= i(t[9] + t[8], 18), t[12] ^= i(t[15] + t[14], 7), t[13] ^= i(t[12] + t[15], 9), t[14] ^= i(t[13] + t[12], 13), t[15] ^= i(t[14] + t[13], 18);}for (r = 0; r < 16; ++r) {e[r] += t[r];}}function T(e, t, r, n) {for (var i = 0; i < n; i++) {r[i] ^= e[t + i];}}function R(e, t, r, n, i) {for (; i--;) {r[n++] = e[t++];}}function O(e) {if (!e || "number" != typeof e.length) return !1;for (var t = 0; t < e.length; t++) {if ("number" != typeof e[t]) return !1;var r = parseInt(e[t]);if (r != e[t] || r < 0 || 256 <= r) return !1;}return !0;}function C(e, t) {var r = parseInt(e);if (e != r) throw new Error("invalid " + t);return r;}function e(o, e, s, a, u, l, h) {if (!h) throw new Error("missing callback");if (s = C(s, "N"), a = C(a, "r"), u = C(u, "p"), l = C(l, "dkLen"), 0 === s || 0 != (s & s - 1)) throw new Error("N must be power of 2");if (B / 128 / a < s) throw new Error("N too large");if (B / 128 / u < a) throw new Error("r too large");if (!O(o)) throw new Error("password must be an array or buffer");if (o = Array.prototype.slice.call(o), !O(e)) throw new Error("salt must be an array or buffer");e = Array.prototype.slice.call(e);for (var f = x(o, e, 128 * u * a), c = new Uint32Array(32 * u * a), t = 0; t < c.length; t++) {var r = 4 * t;c[t] = (255 & f[3 + r]) << 24 | (255 & f[2 + r]) << 16 | (255 & f[1 + r]) << 8 | (255 & f[0 + r]) << 0;}var d,p,v = new Uint32Array(64 * a),y = new Uint32Array(32 * a * s),m = 32 * a,g = new Uint32Array(16),b = new Uint32Array(16),w = u * s * 2,_ = 0,M = null,A = !1,E = 0,S = 0,k = parseInt(1e3 / a),N = void 0 !== n ? n : setTimeout,P = function P() {if (A) return h(new Error("cancelled"), _ / w);switch (E) {case 0:R(c, p = 32 * S * a, v, 0, m), E = 1, d = 0;case 1:k < (t = s - d) && (t = k);for (var e = 0; e < t; e++) {R(v, 0, y, (d + e) * m, m), I(v, m, a, g, b);}if (d += t, _ += t, (r = parseInt(1e3 * _ / w)) !== M) {if (A = h(null, _ / w)) break;M = r;}if (d < s) break;d = 0, E = 2;case 2:var t, r;k < (t = s - d) && (t = k);for (e = 0; e < t; e++) {var n = v[16 * (2 * a - 1)] & s - 1;T(y, n * m, v, m), I(v, m, a, g, b);}if (d += t, _ += t, (r = parseInt(1e3 * _ / w)) !== M) {if (A = h(null, _ / w)) break;M = r;}if (d < s) break;if (R(v, 0, c, p, m), ++S < u) {E = 0;break;}f = [];for (e = 0; e < c.length; e++) {f.push(c[e] >> 0 & 255), f.push(c[e] >> 8 & 255), f.push(c[e] >> 16 & 255), f.push(c[e] >> 24 & 255);}var i = x(o, f, l);return h(null, 1, i);}N(P);};P();}var t, B;t = this, B = 2147483647, void 0 !== o ? r.exports = e : t && (t.scrypt && (t._scrypt = t.scrypt), t.scrypt = e);}).call(this, e("timers").setImmediate);}, { timers: 45 }], 44: [function (e, t, r) {(function (y, e, t) {!function (r, n) {"use strict";if (!r.setImmediate) {var e,i,t,o,s = 1,a = {},u = !1,l = r.document,h = Object.getPrototypeOf && Object.getPrototypeOf(r);h = h && h.setTimeout ? h : r, e = "[object process]" === {}.toString.call(r.process) ? function () {var e = f(arguments);return y.nextTick(c(d, e)), e;} : function () {if (r.postMessage && !r.importScripts) {var e = !0,t = r.onmessage;return r.onmessage = function () {e = !1;}, r.postMessage("", "*"), r.onmessage = t, e;}}() ? (o = "setImmediate$" + Math.random() + "$", r.addEventListener ? r.addEventListener("message", v, !1) : r.attachEvent("onmessage", v), function () {var e = f(arguments);return r.postMessage(o + e, "*"), e;}) : r.MessageChannel ? ((t = new MessageChannel()).port1.onmessage = function (e) {d(e.data);}, function () {var e = f(arguments);return t.port2.postMessage(e), e;}) : l && "onreadystatechange" in l.createElement("script") ? (i = l.documentElement, function () {var e = f(arguments),t = l.createElement("script");return t.onreadystatechange = function () {d(e), t.onreadystatechange = null, i.removeChild(t), t = null;}, i.appendChild(t), e;}) : function () {var e = f(arguments);return setTimeout(c(d, e), 0), e;}, h.setImmediate = e, h.clearImmediate = p;}function f(e) {return a[s] = c.apply(n, e), s++;}function c(e) {var t = [].slice.call(arguments, 1);return function () {"function" == typeof e ? e.apply(n, t) : new Function("" + e)();};}function d(e) {if (u) setTimeout(c(d, e), 0);else {var t = a[e];if (t) {u = !0;try {t();} finally {p(e), u = !1;}}}}function p(e) {delete a[e];}function v(e) {e.source === r && "string" == typeof e.data && 0 === e.data.indexOf(o) && d(+e.data.slice(o.length));}}("undefined" == typeof self ? void 0 === e ? this : e : self);}).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("timers").clearImmediate);}, { _process: 42, timers: 45 }], 45: [function (e, t, r) {(function (e) {t.exports = { setImmediate: e.setImmediate };}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});}, {}], 46: [function (e, i, t) {(function (e) {var t;if (e.crypto && crypto.getRandomValues) {var r = new Uint8Array(16);t = function t() {return crypto.getRandomValues(r), r;};}if (!t) {var n = new Array(16);t = function t() {for (var e, t = 0; t < 16; t++) {0 == (3 & t) && (e = 4294967296 * Math.random()), n[t] = e >>> ((3 & t) << 3) & 255;}return n;};}i.exports = t;}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});}, {}], 47: [function (e, t, r) {for (var s = e("./rng"), i = [], o = {}, n = 0; n < 256; n++) {i[n] = (n + 256).toString(16).substr(1), o[i[n]] = n;}function d(e, t) {var r = t || 0,n = i;return n[e[r++]] + n[e[r++]] + n[e[r++]] + n[e[r++]] + "-" + n[e[r++]] + n[e[r++]] + "-" + n[e[r++]] + n[e[r++]] + "-" + n[e[r++]] + n[e[r++]] + "-" + n[e[r++]] + n[e[r++]] + n[e[r++]] + n[e[r++]] + n[e[r++]] + n[e[r++]];}var a = s(),p = [1 | a[0], a[1], a[2], a[3], a[4], a[5]],v = 16383 & (a[6] << 8 | a[7]),y = 0,m = 0;function u(e, t, r) {var n = t && r || 0;"string" == typeof e && (t = "binary" == e ? new Array(16) : null, e = null);var i = (e = e || {}).random || (e.rng || s)();if (i[6] = 15 & i[6] | 64, i[8] = 63 & i[8] | 128, t) for (var o = 0; o < 16; o++) {t[n + o] = i[o];}return t || d(i);}var l = u;l.v1 = function (e, t, r) {var n = t && r || 0,i = t || [],o = void 0 !== (e = e || {}).clockseq ? e.clockseq : v,s = void 0 !== e.msecs ? e.msecs : new Date().getTime(),a = void 0 !== e.nsecs ? e.nsecs : m + 1,u = s - y + (a - m) / 1e4;if (u < 0 && void 0 === e.clockseq && (o = o + 1 & 16383), (u < 0 || y < s) && void 0 === e.nsecs && (a = 0), 1e4 <= a) throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");y = s, v = o;var l = (1e4 * (268435455 & (s += 122192928e5)) + (m = a)) % 4294967296;i[n++] = l >>> 24 & 255, i[n++] = l >>> 16 & 255, i[n++] = l >>> 8 & 255, i[n++] = 255 & l;var h = s / 4294967296 * 1e4 & 268435455;i[n++] = h >>> 8 & 255, i[n++] = 255 & h, i[n++] = h >>> 24 & 15 | 16, i[n++] = h >>> 16 & 255, i[n++] = o >>> 8 | 128, i[n++] = 255 & o;for (var f = e.node || p, c = 0; c < 6; c++) {i[n + c] = f[c];}return t || d(i);}, l.v4 = u, l.parse = function (e, t, r) {var n = t && r || 0,i = 0;for (t = t || [], e.toLowerCase().replace(/[0-9a-f]{2}/g, function (e) {i < 16 && (t[n + i++] = o[e]);}); i < 16;) {t[n + i++] = 0;}return t;}, l.unparse = d, t.exports = l;}, { "./rng": 46 }], 48: [function (e, t, r) {"use strict";Object.defineProperty(r, "__esModule", { value: !0 });try {t.exports.XMLHttpRequest = XMLHttpRequest;} catch (e) {console.log("Warning: XMLHttpRequest is not defined"), t.exports.XMLHttpRequest = null;}}, {}], 49: [function (e, t, r) {"use strict";Object.defineProperty(r, "__esModule", { value: !0 });var n = e("../utils/properties"),i = (o.isProvider = function (e) {return n.isType(e, "Provider");}, o);function o() {n.setType(this, "Provider");}r.Provider = i;}, { "../utils/properties": 73 }], 50: [function (e, t, r) {"use strict";var n,i = this && this.__extends || (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (e, t) {e.__proto__ = t;} || function (e, t) {for (var r in t) {t.hasOwnProperty(r) && (e[r] = t[r]);}}, function (e, t) {function r() {this.constructor = e;}n(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());}),o = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });var s = e("../utils/address"),a = e("../utils/bignumber"),u = e("../utils/bytes"),l = e("../constants"),h = e("../utils/hash"),f = e("../utils/networks"),c = e("../utils/properties"),d = e("../utils/rlp"),p = e("../utils/transaction"),v = e("../utils/utf8"),y = e("../utils/web"),m = o(e("../errors")),g = e("./abstract-provider");function b(e, t) {var r = {};for (var n in e) {try {var i = e[n](t[n]);void 0 !== i && (r[n] = i);} catch (e) {throw e.checkKey = n, e.checkValue = t[n], e;}}return r;}function w(t, r) {return function (e) {return null == e ? r : t(e);};}function _(r) {return function (e) {if (!Array.isArray(e)) throw new Error("not an array");var t = [];return e.forEach(function (e) {t.push(r(e));}), t;};}function M(e, t) {return "string" == typeof e && (t || "0x" === e.substring(0, 2) || (e = "0x" + e), 32 === u.hexDataLength(e)) ? e.toLowerCase() : (m.throwError("invalid hash", m.INVALID_ARGUMENT, { arg: "hash", value: e }), null);}function A(e) {return a.bigNumberify(e).toNumber();}function E(e) {if (!u.isHexString(e)) throw new Error("invalid uint256");for (; e.length < 66;) {e = "0x0" + e.substring(2);}return e;}function S(e) {if (null == e) return "latest";if ("earliest" === e) return "0x0";if ("latest" === e || "pending" === e) return e;if ("number" == typeof e) return u.hexStripZeros(u.hexlify(e));if (u.isHexString(e)) return u.hexStripZeros(e);throw new Error("invalid blockTag");}var k = { hash: M, blockHash: w(M, null), blockNumber: w(A, null), transactionIndex: w(A, null), confirmations: w(A, null), from: s.getAddress, gasPrice: a.bigNumberify, gasLimit: a.bigNumberify, to: w(s.getAddress, null), value: a.bigNumberify, nonce: A, data: u.hexlify, r: w(E), s: w(E), v: w(A), creates: w(s.getAddress, null), raw: w(u.hexlify) };function N(e) {if (null != e.gas && null == e.gasLimit && (e.gasLimit = e.gas), e.to && a.bigNumberify(e.to).isZero() && (e.to = "0x0000000000000000000000000000000000000000"), null != e.input && null == e.data && (e.data = e.input), null == e.to && null == e.creates && (e.creates = s.getContractAddress(e)), !e.raw && e.v && e.r && e.s) {var t = [u.stripZeros(u.hexlify(e.nonce)), u.stripZeros(u.hexlify(e.gasPrice)), u.stripZeros(u.hexlify(e.gasLimit)), e.to || "0x", u.stripZeros(u.hexlify(e.value || "0x")), u.hexlify(e.data || "0x"), u.stripZeros(u.hexlify(e.v || "0x")), u.stripZeros(u.hexlify(e.r)), u.stripZeros(u.hexlify(e.s))];e.raw = d.encode(t);}var r = b(k, e),n = e.networkId;return null != e.chainId && null == n && null == r.v && (n = e.chainId), u.isHexString(n) && (n = a.bigNumberify(n).toNumber()), "number" != typeof n && null != r.v && ((n = (r.v - 35) / 2) < 0 && (n = 0), n = parseInt(n)), "number" != typeof n && (n = 0), r.networkId = n, r.blockHash && "x" === r.blockHash.replace(/0/g, "") && (r.blockHash = null), r;}var P = { hash: M, parentHash: M, number: A, timestamp: A, nonce: w(u.hexlify), difficulty: function difficulty(e) {var t = a.bigNumberify(e);try {return t.toNumber();} catch (e) {}return null;}, gasLimit: a.bigNumberify, gasUsed: a.bigNumberify, miner: s.getAddress, extraData: u.hexlify, transactions: w(_(M)) },x = c.shallowCopy(P);function I(e, t) {return null != e.author && null == e.miner && (e.miner = e.author), b(t ? x : P, e);}x.transactions = w(_(N));var T = { from: w(s.getAddress), nonce: w(A), gasLimit: w(a.bigNumberify), gasPrice: w(a.bigNumberify), to: w(s.getAddress), value: w(a.bigNumberify), data: w(u.hexlify) };function R(e) {return b(T, e);}var O = { transactionLogIndex: w(A), transactionIndex: A, blockNumber: A, transactionHash: M, address: s.getAddress, topics: _(M), data: u.hexlify, logIndex: A, blockHash: M };var C = { to: w(s.getAddress, null), from: w(s.getAddress, null), contractAddress: w(s.getAddress, null), transactionIndex: A, root: w(M), gasUsed: a.bigNumberify, logsBloom: w(u.hexlify), blockHash: M, transactionHash: M, logs: _(function (e) {return b(O, e);}), blockNumber: A, confirmations: w(A, null), cumulativeGasUsed: a.bigNumberify, status: w(A) };function B(e) {return Array.isArray(e) ? e.forEach(function (e) {B(e);}) : null != e && M(e), e;}var D = { fromBlock: w(S, void 0), toBlock: w(S, void 0), address: w(s.getAddress, void 0), topics: w(B, void 0) },L = { blockHash: w(M, void 0), address: w(s.getAddress, void 0), topics: w(B, void 0) };var U,F,j = { blockNumber: w(A), blockHash: w(M), transactionIndex: A, removed: w(function (e) {if ("boolean" == typeof e) return e;if ("string" == typeof e) {if ("true" === e) return !0;if ("false" === e) return !1;}throw new Error("invaid boolean - " + e);}), address: s.getAddress, data: (U = u.hexlify, F = "0x", function (e) {return e ? U(e) : F;}), topics: _(M), transactionHash: M, logIndex: A };function G(e) {return b(j, e);}function H(e) {return e.map(function (e) {return "string" == typeof e ? e : Array.isArray(e) ? (e.forEach(function (e) {null !== e && 32 !== u.hexDataLength(e) && m.throwError("invalid topic", m.INVALID_ARGUMENT, { argument: "topic", value: e });}), e.join(",")) : null === e ? "" : m.throwError("invalid topic value", m.INVALID_ARGUMENT, { argument: "topic", value: e });}).join("&");}function z(e) {if ("string" == typeof e) {if (20 === u.hexDataLength(e)) return "address:" + s.getAddress(e);if (e = e.toLowerCase(), 32 === u.hexDataLength(e)) return "tx:" + e;if (-1 === e.indexOf(":")) return e;} else {if (Array.isArray(e)) return "filter::" + H(e);if (e && "object" == typeof e) return "filter:" + (e.address || "") + ":" + H(e.topics || []);}throw new Error("invalid event - " + e);}function V() {return new Date().getTime();}var K,q = (K = g.Provider, i(W, K), W.prototype._doPoll = function () {var u = this;this.getBlockNumber().then(function (s) {if (u._setFastBlockNumber(s), s !== u._lastBlockNumber) {-2 === u._emitted.block && (u._emitted.block = s - 1);for (var e = u._emitted.block + 1; e <= s; e++) {u.emit("block", e);}u._emitted.block !== s && (u._emitted.block = s, Object.keys(u._emitted).forEach(function (e) {if ("block" !== e) {var t = u._emitted[e];"pending" !== t && 12 < s - t && delete u._emitted[e];}})), -2 === u._lastBlockNumber && (u._lastBlockNumber = s - 1);var a = {},t = {};return u._events.forEach(function (e) {t[e.tag] = !0;}), Object.keys(t).forEach(function (e) {var t = e.split(":");switch (t[0]) {case "tx":var r = t[1];u.getTransactionReceipt(r).then(function (e) {return e && null != e.blockNumber && (u._emitted["t:" + r] = e.blockNumber, u.emit(r, e)), null;}).catch(function (e) {u.emit("error", e);});break;case "address":var n = t[1];u._balances[n] && (a[n] = u._balances[n]), u.getBalance(n, "latest").then(function (e) {var t = u._balances[n];if (!t || !e.eq(t)) return u._balances[n] = e, u.emit(n, e), null;}).catch(function (e) {u.emit("error", e);});break;case "filter":var i = function (e) {return e.split(/&/g).map(function (e) {var t = e.split(",");return 1 === t.length ? "" === t[0] ? null : e : t.map(function (e) {return "" === e ? null : e;});});}(t[2]),o = { address: t[1], fromBlock: u._lastBlockNumber + 1, toBlock: s, topics: i };o.address || delete o.address, u.getLogs(o).then(function (e) {if (0 !== e.length) return e.forEach(function (e) {u._emitted["b:" + e.blockHash] = e.blockNumber, u._emitted["t:" + e.transactionHash] = e.blockNumber, u.emit(o, e);}), null;}).catch(function (e) {u.emit("error", e);});}}), u._lastBlockNumber = s, u._balances = a, null;}}).catch(function (e) {}), this.doPoll();}, W.prototype.resetEventsBlock = function (e) {this._lastBlockNumber = e - 1, this.polling && this._doPoll();}, Object.defineProperty(W.prototype, "network", { get: function get() {return this._network;}, enumerable: !0, configurable: !0 }), W.prototype.getNetwork = function () {return this.ready;}, Object.defineProperty(W.prototype, "blockNumber", { get: function get() {return this._fastBlockNumber;}, enumerable: !0, configurable: !0 }), Object.defineProperty(W.prototype, "polling", { get: function get() {return null != this._poller;}, set: function set(e) {var t = this;setTimeout(function () {e && !t._poller ? t._poller = setInterval(t._doPoll.bind(t), t.pollingInterval) : !e && t._poller && (clearInterval(t._poller), t._poller = null);}, 0);}, enumerable: !0, configurable: !0 }), Object.defineProperty(W.prototype, "pollingInterval", { get: function get() {return this._pollingInterval;}, set: function set(e) {var t = this;if ("number" != typeof e || e <= 0 || parseInt(String(e)) != e) throw new Error("invalid polling interval");this._pollingInterval = e, this._poller && (clearInterval(this._poller), this._poller = setInterval(function () {t._doPoll();}, this._pollingInterval));}, enumerable: !0, configurable: !0 }), W.prototype._getFastBlockNumber = function () {var t = this,e = V();return e - this._fastQueryDate > 2 * this._pollingInterval && (this._fastQueryDate = e, this._fastBlockNumberPromise = this.getBlockNumber().then(function (e) {return (null == t._fastBlockNumber || e > t._fastBlockNumber) && (t._fastBlockNumber = e), t._fastBlockNumber;})), this._fastBlockNumberPromise;}, W.prototype._setFastBlockNumber = function (e) {null != this._fastBlockNumber && e < this._fastBlockNumber || (this._fastQueryDate = V(), (null == this._fastBlockNumber || e > this._fastBlockNumber) && (this._fastBlockNumber = e, this._fastBlockNumberPromise = Promise.resolve(e)));}, W.prototype.waitForTransaction = function (n, i) {var o = this;return null == i && (i = 1), this.getTransactionReceipt(n).then(function (e) {return 0 === i || e && e.confirmations >= i ? e : new Promise(function (t) {var r = function r(e) {e.confirmations < i || (o.removeListener(n, r), t(e));};o.on(n, r);});});}, W.prototype.getBlockNumber = function () {var r = this;return this.ready.then(function () {return r.perform("getBlockNumber", {}).then(function (e) {var t = parseInt(e);if (t != e) throw new Error("invalid response - getBlockNumber");return r._setFastBlockNumber(t), t;});});}, W.prototype.getGasPrice = function () {var e = this;return this.ready.then(function () {return e.perform("getGasPrice", {}).then(function (e) {return a.bigNumberify(e);});});}, W.prototype.getBalance = function (e, t) {var n = this;return this.ready.then(function () {return c.resolveProperties({ addressOrName: e, blockTag: t }).then(function (e) {var t = e.addressOrName,r = e.blockTag;return n._getAddress(t).then(function (e) {var t = { address: e, blockTag: S(r) };return n.perform("getBalance", t).then(function (e) {return a.bigNumberify(e);});});});});}, W.prototype.getTransactionCount = function (e, t) {var n = this;return this.ready.then(function () {return c.resolveProperties({ addressOrName: e, blockTag: t }).then(function (e) {var t = e.addressOrName,r = e.blockTag;return n._getAddress(t).then(function (e) {var t = { address: e, blockTag: S(r) };return n.perform("getTransactionCount", t).then(function (e) {return a.bigNumberify(e).toNumber();});});});});}, W.prototype.getCode = function (e, t) {var n = this;return this.ready.then(function () {return c.resolveProperties({ addressOrName: e, blockTag: t }).then(function (e) {var t = e.addressOrName,r = e.blockTag;return n._getAddress(t).then(function (e) {var t = { address: e, blockTag: S(r) };return n.perform("getCode", t).then(function (e) {return u.hexlify(e);});});});});}, W.prototype.getStorageAt = function (e, t, r) {var i = this;return this.ready.then(function () {return c.resolveProperties({ addressOrName: e, position: t, blockTag: r }).then(function (e) {var t = e.addressOrName,r = e.position,n = e.blockTag;return i._getAddress(t).then(function (e) {var t = { address: e, blockTag: S(n), position: u.hexStripZeros(u.hexlify(r)) };return i.perform("getStorageAt", t).then(function (e) {return u.hexlify(e);});});});});}, W.prototype.sendTransaction = function (e) {var n = this;return this.ready.then(function () {return c.resolveProperties({ signedTransaction: e }).then(function (e) {var t = e.signedTransaction,r = { signedTransaction: u.hexlify(t) };return n.perform("sendTransaction", r).then(function (e) {return n._wrapTransaction(p.parse(t), e);}, function (e) {throw e.transaction = p.parse(t), e.transaction.hash && (e.transactionHash = e.transaction.hash), e;});});});}, W.prototype._wrapTransaction = function (r, e) {var n = this;if (null != e && 32 !== u.hexDataLength(e)) throw new Error("invalid response - sendTransaction");var t = r;return null != e && r.hash !== e && m.throwError("Transaction hash mismatch from Provider.sendTransaction.", m.UNKNOWN_ERROR, { expectedHash: r.hash, returnedHash: e }), t.wait = function (t) {return 0 !== t && (n._emitted["t:" + r.hash] = "pending"), n.waitForTransaction(r.hash, t).then(function (e) {return null == e && 0 === t ? null : (n._emitted["t:" + r.hash] = e.blockNumber, 0 === e.status && m.throwError("transaction failed", m.CALL_EXCEPTION, { transactionHash: r.hash, transaction: r }), e);});}, t;}, W.prototype.call = function (e, t) {var n = this,r = c.shallowCopy(e);return this.ready.then(function () {return c.resolveProperties({ blockTag: t, tx: r }).then(function (e) {var r = e.blockTag,t = e.tx;return n._resolveNames(t, ["to", "from"]).then(function (e) {var t = { blockTag: S(r), transaction: R(e) };return n.perform("call", t).then(function (e) {return u.hexlify(e);});});});});}, W.prototype.estimateGas = function (e) {var r = this,t = { to: e.to, from: e.from, data: e.data, gasPrice: e.gasPrice, value: e.value };return this.ready.then(function () {return c.resolveProperties(t).then(function (e) {return r._resolveNames(e, ["to", "from"]).then(function (e) {var t = { transaction: R(e) };return r.perform("estimateGas", t).then(function (e) {return a.bigNumberify(e);});});});});}, W.prototype.getBlock = function (e, o) {var s = this;return this.ready.then(function () {return c.resolveProperties({ blockHashOrBlockTag: e }).then(function (e) {var t = e.blockHashOrBlockTag;try {var r = u.hexlify(t);if (32 === u.hexDataLength(r)) return y.poll(function () {return s.perform("getBlock", { blockHash: r, includeTransactions: !!o }).then(function (e) {return null == e ? null == s._emitted["b:" + r] ? null : void 0 : I(e, o);});}, { onceBlock: s });} catch (e) {}try {var n = -128,i = S(t);return u.isHexString(i) && (n = parseInt(i.substring(2), 16)), y.poll(function () {return s.perform("getBlock", { blockTag: i, includeTransactions: !!o }).then(function (e) {return null != e ? I(e, o) : n <= s._emitted.block ? void 0 : null;});}, { onceBlock: s });} catch (e) {}throw new Error("invalid block hash or block tag");});});}, W.prototype.getTransaction = function (e) {var n = this;return this.ready.then(function () {return c.resolveProperties({ transactionHash: e }).then(function (e) {var t = e.transactionHash,r = { transactionHash: M(t, !0) };return y.poll(function () {return n.perform("getTransaction", r).then(function (e) {if (null == e) return null == n._emitted["t:" + t] ? null : void 0;var r = W.checkTransactionResponse(e);if (null == r.blockNumber) r.confirmations = 0;else if (null == r.confirmations) return n._getFastBlockNumber().then(function (e) {var t = e - r.blockNumber + 1;return t <= 0 && (t = 1), r.confirmations = t, n._wrapTransaction(r);});return n._wrapTransaction(r);});}, { onceBlock: n });});});}, W.prototype.getTransactionReceipt = function (e) {var n = this;return this.ready.then(function () {return c.resolveProperties({ transactionHash: e }).then(function (e) {var t = e.transactionHash,r = { transactionHash: M(t, !0) };return y.poll(function () {return n.perform("getTransactionReceipt", r).then(function (e) {if (null == e) return null == n._emitted["t:" + t] ? null : void 0;if (null != e.blockHash) {var r = function (e) {var t = b(C, e);return t.logs.forEach(function (e, t) {null == e.transactionLogIndex && (e.transactionLogIndex = t);}), null != e.status && (t.byzantium = !0), t;}(e);if (null == r.blockNumber) r.confirmations = 0;else if (null == r.confirmations) return n._getFastBlockNumber().then(function (e) {var t = e - r.blockNumber + 1;return t <= 0 && (t = 1), r.confirmations = t, r;});return r;}});}, { onceBlock: n });});});}, W.prototype.getLogs = function (e) {var r = this;return this.ready.then(function () {return c.resolveProperties(e).then(function (e) {return r._resolveNames(e, ["address"]).then(function (e) {var t = { filter: function (e) {return e && e.blockHash ? b(L, e) : b(D, e);}(e) };return r.perform("getLogs", t).then(function (e) {return _(G)(e);});});});});}, W.prototype.getEtherPrice = function () {var e = this;return this.ready.then(function () {return e.perform("getEtherPrice", {}).then(function (e) {return e;});});}, W.prototype._getAddress = function (t) {return this.resolveName(t).then(function (e) {return null == e && m.throwError("ENS name not configured", m.UNSUPPORTED_OPERATION, { operation: "resolveName(" + JSON.stringify(t) + ")" }), e;});}, W.prototype._resolveNames = function (e, t) {var r = [],n = c.shallowCopy(e);return t.forEach(function (t) {null != n[t] && r.push(this._getAddress(n[t]).then(function (e) {n[t] = e;}));}, this), Promise.all(r).then(function () {return n;});}, W.prototype._getResolver = function (n) {var i = this;return this.getNetwork().then(function (e) {e.ensAddress || m.throwError("network does not support ENS", m.UNSUPPORTED_OPERATION, { operation: "ENS", network: e.name });var t = "0x0178b8bf" + h.namehash(n).substring(2),r = { to: e.ensAddress, data: t };return i.call(r).then(function (e) {if (32 !== u.hexDataLength(e)) return null;var t = s.getAddress(u.hexDataSlice(e, 12));return t === l.AddressZero ? null : t;});});}, W.prototype.resolveName = function (e) {var t = this;if (e instanceof Promise) return e.then(function (e) {return t.resolveName(e);});try {return Promise.resolve(s.getAddress(e));} catch (e) {}var r = this,n = h.namehash(e);return this._getResolver(e).then(function (e) {if (null == e) return null;var t = { to: e, data: "0x3b3b57de" + n.substring(2) };return r.call(t);}).then(function (e) {if (32 !== u.hexDataLength(e)) return null;var t = s.getAddress(u.hexDataSlice(e, 12));return t === l.AddressZero ? null : t;});}, W.prototype.lookupAddress = function (n) {var t = this;if (n instanceof Promise) return n.then(function (e) {return t.lookupAddress(e);});var e = (n = s.getAddress(n)).substring(2) + ".addr.reverse",r = h.namehash(e),i = this;return this._getResolver(e).then(function (e) {if (!e) return null;var t = { to: e, data: "0x691f3431" + r.substring(2) };return i.call(t);}).then(function (e) {if (null == e) return null;if ((e = e.substring(2)).length < 64) return null;if ((e = e.substring(64)).length < 64) return null;var t = a.bigNumberify("0x" + e.substring(0, 64)).toNumber();if (2 * t > (e = e.substring(64)).length) return null;var r = v.toUtf8String("0x" + e.substring(0, 2 * t));return i.resolveName(r).then(function (e) {return e != n ? null : r;});});}, W.checkTransactionResponse = function (e) {return N(e);}, W.prototype.doPoll = function () {}, W.prototype.perform = function (e, t) {return m.throwError(e + " not implemented", m.NOT_IMPLEMENTED, { operation: e }), null;}, W.prototype._startPending = function () {m.warn("WARNING: this provider does not support pending events");}, W.prototype._stopPending = function () {}, W.prototype._addEventListener = function (e, t, r) {this._events.push({ tag: z(e), listener: t, once: r }), "pending" === e && this._startPending(), this.polling = !0;}, W.prototype.on = function (e, t) {return this._addEventListener(e, t, !1), this;}, W.prototype.once = function (e, t) {return this._addEventListener(e, t, !0), this;}, W.prototype.addEventListener = function (e, t) {return this.on(e, t);}, W.prototype.emit = function (e) {for (var t = this, r = [], n = 1; n < arguments.length; n++) {r[n - 1] = arguments[n];}var i = !1,o = z(e);return this._events = this._events.filter(function (e) {return e.tag !== o || (setTimeout(function () {e.listener.apply(t, r);}, 0), i = !0, !e.once);}), 0 === this.listenerCount() && (this.polling = !1), i;}, W.prototype.listenerCount = function (e) {if (!e) return this._events.length;var t = z(e);return this._events.filter(function (e) {return e.tag === t;}).length;}, W.prototype.listeners = function (e) {var t = z(e);return this._events.filter(function (e) {return e.tag === t;}).map(function (e) {return e.listener;});}, W.prototype.removeAllListeners = function (e) {if (null == e) this._events = [], this._stopPending();else {var t = z(e);this._events = this._events.filter(function (e) {return e.tag !== t;}), "pending" === e && this._stopPending();}return 0 === this._events.length && (this.polling = !1), this;}, W.prototype.removeListener = function (e, t) {var r = !1,n = z(e);return this._events = this._events.filter(function (e) {return e.tag !== n || e.listener != t || !!r || !(r = !0);}), "pending" === e && 0 === this.listenerCount("pending") && this._stopPending(), 0 === this.listenerCount() && (this.polling = !1), this;}, W);function W(e) {var t = K.call(this) || this;if (m.checkNew(t, g.Provider), e instanceof Promise) c.defineReadOnly(t, "ready", e.then(function (e) {return c.defineReadOnly(t, "_network", e), e;})), t.ready.catch(function (e) {});else {var r = f.getNetwork(null == e ? "homestead" : e);r ? (c.defineReadOnly(t, "_network", r), c.defineReadOnly(t, "ready", Promise.resolve(t._network))) : m.throwError("invalid network", m.INVALID_ARGUMENT, { arg: "network", value: e });}return t._lastBlockNumber = -2, t._balances = {}, t._events = [], t._pollingInterval = 4e3, t._emitted = { block: -2 }, t._fastQueryDate = 0, t;}r.BaseProvider = q, c.defineReadOnly(g.Provider, "inherits", c.inheritable(g.Provider));}, { "../constants": 3, "../errors": 5, "../utils/address": 59, "../utils/bignumber": 62, "../utils/bytes": 63, "../utils/hash": 64, "../utils/networks": 71, "../utils/properties": 73, "../utils/rlp": 75, "../utils/transaction": 82, "../utils/utf8": 84, "../utils/web": 85, "./abstract-provider": 49 }], 51: [function (e, t, r) {"use strict";var n,i = this && this.__extends || (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (e, t) {e.__proto__ = t;} || function (e, t) {for (var r in t) {t.hasOwnProperty(r) && (e[r] = t[r]);}}, function (e, t) {function r() {this.constructor = e;}n(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());}),o = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });var s = e("./base-provider"),a = e("../utils/bytes"),u = e("../utils/properties"),l = e("../utils/web"),h = o(e("../errors"));function f(e) {var t = [];for (var r in e) {if (null != e[r]) {var n = a.hexlify(e[r]);!{ gasLimit: !0, gasPrice: !0, nonce: !0, value: !0 }[r] || (n = a.hexStripZeros(n)), t.push(r + "=" + n);}}return t.join("&");}function c(e) {if (0 == e.status && ("No records found" === e.message || "No transactions found" === e.message)) return e.result;if (1 == e.status && "OK" == e.message) return e.result;var t = new Error("invalid response");throw t.result = JSON.stringify(e), t;}function d(e) {if ("2.0" != e.jsonrpc) throw (t = new Error("invalid response")).result = JSON.stringify(e), t;if (e.error) {var t = new Error(e.error.message || "unknown error");throw e.error.code && (t.code = e.error.code), e.error.data && (t.data = e.error.data), t;}return e.result;}function p(e) {if ("pending" === e) throw new Error("pending not supported");return "latest" === e ? e : parseInt(e.substring(2), 16);}var v,y = (v = s.BaseProvider, i(m, v), m.prototype.perform = function (e, t) {var r = this,n = this.baseUrl,i = "";function o(t, e) {return l.fetchJson(t, null, e || d).then(function (e) {return r.emit("debug", { action: "perform", request: t, response: e, provider: r }), e;});}switch (this.apiKey && (i += "&apikey=" + this.apiKey), e) {case "getBlockNumber":return o(n += "/api?module=proxy&action=eth_blockNumber" + i);case "getGasPrice":return o(n += "/api?module=proxy&action=eth_gasPrice" + i);case "getBalance":return n += "/api?module=account&action=balance&address=" + t.address, o(n += "&tag=" + t.blockTag + i, c);case "getTransactionCount":return n += "/api?module=proxy&action=eth_getTransactionCount&address=" + t.address, o(n += "&tag=" + t.blockTag + i);case "getCode":return n += "/api?module=proxy&action=eth_getCode&address=" + t.address, o(n += "&tag=" + t.blockTag + i, d);case "getStorageAt":return n += "/api?module=proxy&action=eth_getStorageAt&address=" + t.address, n += "&position=" + t.position, o(n += "&tag=" + t.blockTag + i, d);case "sendTransaction":return n += "/api?module=proxy&action=eth_sendRawTransaction&hex=" + t.signedTransaction, o(n += i).catch(function (e) {throw e.responseText && (0 <= e.responseText.toLowerCase().indexOf("insufficient funds") && h.throwError("insufficient funds", h.INSUFFICIENT_FUNDS, {}), 0 <= e.responseText.indexOf("same hash was already imported") && h.throwError("nonce has already been used", h.NONCE_EXPIRED, {}), 0 <= e.responseText.indexOf("another transaction with same nonce") && h.throwError("replacement fee too low", h.REPLACEMENT_UNDERPRICED, {})), e;});case "getBlock":if (t.blockTag) return n += "/api?module=proxy&action=eth_getBlockByNumber&tag=" + t.blockTag, t.includeTransactions ? n += "&boolean=true" : n += "&boolean=false", o(n += i);throw new Error("getBlock by blockHash not implmeneted");case "getTransaction":return n += "/api?module=proxy&action=eth_getTransactionByHash&txhash=" + t.transactionHash, o(n += i);case "getTransactionReceipt":return n += "/api?module=proxy&action=eth_getTransactionReceipt&txhash=" + t.transactionHash, o(n += i);case "call":if (n += "/api?module=proxy&action=eth_call" + (s = (s = f(t.transaction)) && "&" + s), "latest" !== t.blockTag) throw new Error("EtherscanProvider does not support blockTag for call");return o(n += i);case "estimateGas":var s;return n += "/api?module=proxy&action=eth_estimateGas&" + (s = (s = f(t.transaction)) && "&" + s), o(n += i);case "getLogs":n += "/api?module=logs&action=getLogs";try {if (t.filter.fromBlock && (n += "&fromBlock=" + p(t.filter.fromBlock)), t.filter.toBlock && (n += "&toBlock=" + p(t.filter.toBlock)), t.filter.blockHash) try {h.throwError("Etherscan does not support blockHash filters", h.UNSUPPORTED_OPERATION, { operation: "getLogs(blockHash)" });} catch (e) {return Promise.reject(e);}if (t.filter.address && (n += "&address=" + t.filter.address), t.filter.topics && 0 < t.filter.topics.length) {if (1 < t.filter.topics.length) throw new Error("unsupported topic format");var a = t.filter.topics[0];if ("string" != typeof a || 66 !== a.length) throw new Error("unsupported topic0 format");n += "&topic0=" + a;}} catch (e) {return Promise.reject(e);}var u = this;return o(n += i, c).then(function (e) {var r = {},n = Promise.resolve();return e.forEach(function (t) {n = n.then(function () {return null != t.blockHash ? null : (t.blockHash = r[t.transactionHash], null == t.blockHash ? u.getTransaction(t.transactionHash).then(function (e) {return r[t.transactionHash] = e.blockHash, t.blockHash = e.blockHash, null;}) : null);});}), n.then(function () {return e;});});case "getEtherPrice":return "homestead" !== this.network.name ? Promise.resolve(0) : (n += "/api?module=stats&action=ethprice", o(n += i, c).then(function (e) {return parseFloat(e.ethusd);}));}return v.prototype.perform.call(this, e, t);}, m.prototype.getHistory = function (e, t, r) {var n = this,i = this.baseUrl,o = "";return this.apiKey && (o += "&apikey=" + this.apiKey), null == t && (t = 0), null == r && (r = 99999999), this.resolveName(e).then(function (e) {return i += "/api?module=account&action=txlist&address=" + e, i += "&startblock=" + t, i += "&endblock=" + r, i += "&sort=asc" + o, l.fetchJson(i, null, c).then(function (e) {n.emit("debug", { action: "getHistory", request: i, response: e, provider: n });var r = [];return e.forEach(function (t) {["contractAddress", "to"].forEach(function (e) {"" == t[e] && delete t[e];}), null == t.creates && null != t.contractAddress && (t.creates = t.contractAddress);var e = s.BaseProvider.checkTransactionResponse(t);t.timeStamp && (e.timestamp = parseInt(t.timeStamp)), r.push(e);}), r;});});}, m);function m(e, t) {var r = v.call(this, e) || this;h.checkNew(r, m);var n = "invalid";r.network && (n = r.network.name);var i = null;switch (n) {case "homestead":i = "https://api.etherscan.io";break;case "ropsten":i = "https://api-ropsten.etherscan.io";break;case "rinkeby":i = "https://api-rinkeby.etherscan.io";break;case "kovan":i = "https://api-kovan.etherscan.io";break;case "goerli":i = "https://api-goerli.etherscan.io";break;default:throw new Error("unsupported network");}return u.defineReadOnly(r, "baseUrl", i), u.defineReadOnly(r, "apiKey", t), r;}r.EtherscanProvider = y;}, { "../errors": 5, "../utils/bytes": 63, "../utils/properties": 73, "../utils/web": 85, "./base-provider": 50 }], 52: [function (e, t, r) {"use strict";var n,i = this && this.__extends || (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (e, t) {e.__proto__ = t;} || function (e, t) {for (var r in t) {t.hasOwnProperty(r) && (e[r] = t[r]);}}, function (e, t) {function r() {this.constructor = e;}n(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());}),o = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });var s = e("./base-provider"),a = o(e("../errors"));function u(t) {var r = !0,n = null;return t.forEach(function (e) {null != e ? null != n ? n.name === e.name && n.chainId === e.chainId && (n.ensAddress === e.ensAddress || null == n.ensAddress && null == e.ensAddress) || a.throwError("provider mismatch", a.INVALID_ARGUMENT, { arg: "networks", value: t }) : n = e : r = !1;}), r;}var l,h = (l = s.BaseProvider, i(f, l), Object.defineProperty(f.prototype, "providers", { get: function get() {return this._providers.slice(0);}, enumerable: !0, configurable: !0 }), f.prototype.perform = function (i, o) {var s = this.providers;return new Promise(function (r, e) {var n = null;!function t() {s.length ? s.shift().perform(i, o).then(function (e) {return r(e);}).catch(function (e) {n = n || e, setTimeout(t, 0);}) : e(n);}();});}, f);function f(e) {var t = this;if (0 === e.length) throw new Error("no providers");if (u(e.map(function (e) {return e.network;}))) t = l.call(this, e[0].network) || this;else {var r = Promise.all(e.map(function (e) {return e.getNetwork();})).then(function (e) {return u(e) || a.throwError("getNetwork returned null", a.UNKNOWN_ERROR, {}), e[0];});t = l.call(this, r) || this;}return a.checkNew(t, f), t._providers = e.slice(0), t;}r.FallbackProvider = h;}, { "../errors": 5, "./base-provider": 50 }], 53: [function (e, t, r) {"use strict";Object.defineProperty(r, "__esModule", { value: !0 });var n = e("./abstract-provider");r.Provider = n.Provider;var i = e("./base-provider");r.BaseProvider = i.BaseProvider;var o = e("./etherscan-provider");r.EtherscanProvider = o.EtherscanProvider;var s = e("./fallback-provider");r.FallbackProvider = s.FallbackProvider;var a = e("./ipc-provider");r.IpcProvider = a.IpcProvider;var u = e("./infura-provider");r.InfuraProvider = u.InfuraProvider;var l = e("./json-rpc-provider");r.JsonRpcProvider = l.JsonRpcProvider, r.JsonRpcSigner = l.JsonRpcSigner;var h = e("./web3-provider");r.Web3Provider = h.Web3Provider;}, { "./abstract-provider": 49, "./base-provider": 50, "./etherscan-provider": 51, "./fallback-provider": 52, "./infura-provider": 54, "./ipc-provider": 55, "./json-rpc-provider": 56, "./web3-provider": 57 }], 54: [function (e, t, r) {"use strict";var n,i = this && this.__extends || (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (e, t) {e.__proto__ = t;} || function (e, t) {for (var r in t) {t.hasOwnProperty(r) && (e[r] = t[r]);}}, function (e, t) {function r() {this.constructor = e;}n(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());}),o = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });var s,a = e("./json-rpc-provider"),u = e("../utils/bytes"),l = e("../utils/networks"),h = e("../utils/properties"),f = o(e("../errors")),c = (s = a.JsonRpcProvider, i(d, s), d.prototype._startPending = function () {f.warn("WARNING: INFURA does not support pending filters");}, d.prototype.getSigner = function (e) {return f.throwError("INFURA does not support signing", f.UNSUPPORTED_OPERATION, { operation: "getSigner" });}, d.prototype.listAccounts = function () {return Promise.resolve([]);}, d);function d(e, t) {var r = this,n = l.getNetwork(null == e ? "homestead" : e);null == t && (t = "7d0d81d0919f4f05b9ab6634be01ee73");var i = null;switch (n.name) {case "homestead":i = "mainnet.infura.io";break;case "ropsten":i = "ropsten.infura.io";break;case "rinkeby":i = "rinkeby.infura.io";break;case "goerli":i = "goerli.infura.io";break;case "kovan":i = "kovan.infura.io";break;default:f.throwError("unsupported network", f.INVALID_ARGUMENT, { argument: "network", value: e });}return u.isHexString("0x" + t, 16) ? (r = s.call(this, "https://" + i + "/v3/" + t, n) || this, h.defineReadOnly(r, "apiAccessToken", null), h.defineReadOnly(r, "projectId", t)) : (f.warn("The legacy INFURA apiAccesToken API is deprecated; please upgrade to a Project ID instead (see INFURA dshboard; https://infura.io)"), r = s.call(this, "https://" + i + "/" + t, n) || this, h.defineReadOnly(r, "apiAccessToken", t), h.defineReadOnly(r, "projectId", null)), f.checkNew(r, d), r;}r.InfuraProvider = c;}, { "../errors": 5, "../utils/bytes": 63, "../utils/networks": 71, "../utils/properties": 73, "./json-rpc-provider": 56 }], 55: [function (e, t, r) {"use strict";Object.defineProperty(r, "__esModule", { value: !0 });}, {}], 56: [function (e, t, r) {"use strict";var n,i = this && this.__extends || (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (e, t) {e.__proto__ = t;} || function (e, t) {for (var r in t) {t.hasOwnProperty(r) && (e[r] = t[r]);}}, function (e, t) {function r() {this.constructor = e;}n(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());}),o = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });var s = e("./base-provider"),a = e("../abstract-signer"),u = o(e("../errors")),l = e("../utils/address"),h = e("../utils/bytes"),f = e("../utils/networks"),c = e("../utils/properties"),d = e("../utils/utf8"),p = e("../utils/web");function v(e) {if (e.error) {var t = new Error(e.error.message);throw t.code = e.error.code, t.data = e.error.data, t;}return e.result;}function y(e) {return e ? e.toLowerCase() : e;}var m,g = {},b = 42,w = (m = a.Signer, i(_, m), _.prototype.getAddress = function () {var t = this;return this._address ? Promise.resolve(this._address) : this.provider.send("eth_accounts", []).then(function (e) {return e.length <= t._index && u.throwError("unknown account #" + t._index, u.UNSUPPORTED_OPERATION, { operation: "getAddress" }), t._address = l.getAddress(e[t._index]), t._address;});}, _.prototype.getBalance = function (e) {return this.provider.getBalance(this.getAddress(), e);}, _.prototype.getTransactionCount = function (e) {return this.provider.getTransactionCount(this.getAddress(), e);}, _.prototype.sendUncheckedTransaction = function (e) {var n = this;e = c.shallowCopy(e);var t = this.getAddress().then(function (e) {return e = e && e.toLowerCase();});if (null == e.gasLimit) {var r = c.shallowCopy(e);r.from = t, e.gasLimit = this.provider.estimateGas(r);}return Promise.all([c.resolveProperties(e), t]).then(function (e) {var t = e[0],r = E.hexlifyTransaction(t);return r.from = e[1], n.provider.send("eth_sendTransaction", [r]).then(function (e) {return e;}, function (e) {throw e.responseText && (0 <= e.responseText.indexOf("insufficient funds") && u.throwError("insufficient funds", u.INSUFFICIENT_FUNDS, { transaction: t }), 0 <= e.responseText.indexOf("nonce too low") && u.throwError("nonce has already been used", u.NONCE_EXPIRED, { transaction: t }), 0 <= e.responseText.indexOf("replacement transaction underpriced") && u.throwError("replacement fee too low", u.REPLACEMENT_UNDERPRICED, { transaction: t })), e;});});}, _.prototype.sendTransaction = function (e) {var r = this;return this.sendUncheckedTransaction(e).then(function (t) {return p.poll(function () {return r.provider.getTransaction(t).then(function (e) {if (null !== e) return r.provider._wrapTransaction(e, t);});}, { fastRetry: 250, onceBlock: r.provider }).catch(function (e) {throw e.transactionHash = t, e;});});}, _.prototype.signMessage = function (e) {var t = this,r = "string" == typeof e ? d.toUtf8Bytes(e) : e;return this.getAddress().then(function (e) {return t.provider.send("eth_sign", [e.toLowerCase(), h.hexlify(r)]);});}, _.prototype.unlock = function (t) {var r = this.provider;return this.getAddress().then(function (e) {return r.send("personal_unlockAccount", [e.toLowerCase(), t, null]);});}, _);function _(e, t, r) {var n = m.call(this) || this;if (u.checkNew(n, _), e !== g) throw new Error("do not call the JsonRpcSigner constructor directly; use provider.getSigner");return c.defineReadOnly(n, "provider", t), r ? "string" == typeof r ? c.defineReadOnly(n, "_address", l.getAddress(r)) : "number" == typeof r ? c.defineReadOnly(n, "_index", r) : u.throwError("invalid address or index", u.INVALID_ARGUMENT, { argument: "addressOrIndex", value: r }) : c.defineReadOnly(n, "_index", 0), n;}r.JsonRpcSigner = w;var M,A = { chainId: !0, data: !0, gasLimit: !0, gasPrice: !0, nonce: !0, to: !0, value: !0 },E = (M = s.BaseProvider, i(S, M), S.prototype.getSigner = function (e) {return new w(g, this, e);}, S.prototype.listAccounts = function () {return this.send("eth_accounts", []).then(function (e) {return e.map(function (e) {return l.getAddress(e);});});}, S.prototype.send = function (e, t) {var r = this,n = { method: e, params: t, id: b++, jsonrpc: "2.0" };return p.fetchJson(this.connection, JSON.stringify(n), v).then(function (e) {return r.emit("debug", { action: "send", request: n, response: e, provider: r }), e;});}, S.prototype.perform = function (e, t) {switch (e) {case "getBlockNumber":return this.send("eth_blockNumber", []);case "getGasPrice":return this.send("eth_gasPrice", []);case "getBalance":return this.send("eth_getBalance", [y(t.address), t.blockTag]);case "getTransactionCount":return this.send("eth_getTransactionCount", [y(t.address), t.blockTag]);case "getCode":return this.send("eth_getCode", [y(t.address), t.blockTag]);case "getStorageAt":return this.send("eth_getStorageAt", [y(t.address), t.position, t.blockTag]);case "sendTransaction":return this.send("eth_sendRawTransaction", [t.signedTransaction]).catch(function (e) {throw e.responseText && (0 < e.responseText.indexOf("insufficient funds") && u.throwError("insufficient funds", u.INSUFFICIENT_FUNDS, {}), 0 < e.responseText.indexOf("nonce too low") && u.throwError("nonce has already been used", u.NONCE_EXPIRED, {}), 0 < e.responseText.indexOf("replacement transaction underpriced") && u.throwError("replacement fee too low", u.REPLACEMENT_UNDERPRICED, {})), e;});case "getBlock":return t.blockTag ? this.send("eth_getBlockByNumber", [t.blockTag, !!t.includeTransactions]) : t.blockHash ? this.send("eth_getBlockByHash", [t.blockHash, !!t.includeTransactions]) : Promise.reject(new Error("invalid block tag or block hash"));case "getTransaction":return this.send("eth_getTransactionByHash", [t.transactionHash]);case "getTransactionReceipt":return this.send("eth_getTransactionReceipt", [t.transactionHash]);case "call":return this.send("eth_call", [S.hexlifyTransaction(t.transaction, { from: !0 }), t.blockTag]);case "estimateGas":return this.send("eth_estimateGas", [S.hexlifyTransaction(t.transaction, { from: !0 })]);case "getLogs":return t.filter && null != t.filter.address && (t.filter.address = y(t.filter.address)), this.send("eth_getLogs", [t.filter]);}return u.throwError(e + " not implemented", u.NOT_IMPLEMENTED, { operation: e }), null;}, S.prototype._startPending = function () {if (null == this._pendingFilter) {var r = this,n = this.send("eth_newPendingTransactionFilter", []);(this._pendingFilter = n).then(function (t) {return function e() {r.send("eth_getFilterChanges", [t]).then(function (e) {if (r._pendingFilter != n) return null;var t = Promise.resolve();return e.forEach(function (e) {r._emitted["t:" + e.toLowerCase()] = "pending", t = t.then(function () {return r.getTransaction(e).then(function (e) {return r.emit("pending", e), null;});});}), t.then(function () {return function (t) {return new Promise(function (e) {setTimeout(function () {e();}, t);});}(1e3);});}).then(function () {if (r._pendingFilter == n) return setTimeout(function () {e();}, 0), null;r.send("eth_uninstallFilter", [t]);}).catch(function (e) {});}(), t;}).catch(function (e) {});}}, S.prototype._stopPending = function () {this._pendingFilter = null;}, S.hexlifyTransaction = function (r, e) {var t = c.shallowCopy(A);if (e) for (var n in e) {e[n] && (t[n] = !0);}c.checkProperties(r, t);var i = {};return ["gasLimit", "gasPrice", "nonce", "value"].forEach(function (e) {if (null != r[e]) {var t = h.hexStripZeros(h.hexlify(r[e]));"gasLimit" === e && (e = "gas"), i[e] = t;}}), ["from", "to", "data"].forEach(function (e) {null != r[e] && (i[e] = h.hexlify(r[e]));}), i;}, S);function S(e, t) {var n = this;if ("string" == typeof e && null === t && f.getNetwork(e) && (t = e, e = null), t) n = M.call(this, t) || this;else {var r = new Promise(function (t, r) {setTimeout(function () {n.send("net_version", []).then(function (e) {return t(f.getNetwork(parseInt(e)));}).catch(function (e) {r(e);});});});n = M.call(this, r) || this;}return u.checkNew(n, S), e = e || "http://localhost:8545", n.connection = "string" == typeof e ? { url: e } : e, n;}r.JsonRpcProvider = E;}, { "../abstract-signer": 2, "../errors": 5, "../utils/address": 59, "../utils/bytes": 63, "../utils/networks": 71, "../utils/properties": 73, "../utils/utf8": 84, "../utils/web": 85, "./base-provider": 50 }], 57: [function (e, t, r) {"use strict";var n,i = this && this.__extends || (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (e, t) {e.__proto__ = t;} || function (e, t) {for (var r in t) {t.hasOwnProperty(r) && (e[r] = t[r]);}}, function (e, t) {function r() {this.constructor = e;}n(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());}),o = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });var s,a = e("./json-rpc-provider"),u = e("../utils/properties"),l = o(e("../errors")),h = 42,f = (s = a.JsonRpcProvider, i(c, s), c.prototype.send = function (t, r) {var o = this;return "eth_sign" == t && this._web3Provider.isMetaMask && (t = "personal_sign", r = [r[1], r[0]]), new Promise(function (n, i) {var e = { method: t, params: r, id: h++, jsonrpc: "2.0" };o._sendAsync(e, function (e, t) {if (e) i(e);else {if (t.error) {var r = new Error(t.error.message);return r.code = t.error.code, r.data = t.error.data, void i(r);}n(t.result);}});});}, c);function c(e, t) {var r = s.call(this, e.host || e.path || "", t) || this;return l.checkNew(r, c), e && (e.sendAsync ? r._sendAsync = e.sendAsync.bind(e) : e.send && (r._sendAsync = e.send.bind(e))), e && r._sendAsync || l.throwError("invalid web3Provider", l.INVALID_ARGUMENT, { arg: "web3Provider", value: e }), u.defineReadOnly(r, "_web3Provider", e), r;}r.Web3Provider = f;}, { "../errors": 5, "../utils/properties": 73, "./json-rpc-provider": 56 }], 58: [function (e, t, r) {"use strict";var n,i = this && this.__extends || (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (e, t) {e.__proto__ = t;} || function (e, t) {for (var r in t) {t.hasOwnProperty(r) && (e[r] = t[r]);}}, function (e, t) {function r() {this.constructor = e;}n(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());}),o = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });var s = e("../constants"),l = o(e("../errors")),a = e("./address"),u = e("./bignumber"),h = e("./bytes"),f = e("./utf8"),c = e("./properties"),d = new RegExp(/^bytes([0-9]*)$/),p = new RegExp(/^(u?int)([0-9]*)$/),v = new RegExp(/^(.*)\[([0-9]*)\]$/);r.defaultCoerceFunc = function (e, t) {var r = e.match(p);return r && parseInt(r[2]) <= 48 ? t.toNumber() : t;};var y = new RegExp("^([^)(]*)\\((.*)\\)([^)(]*)$"),m = new RegExp("^[A-Za-z_][A-Za-z0-9_]*$");function g(e) {return e.match(/^uint($|[^1-9])/) ? e = "uint256" + e.substring(4) : e.match(/^int($|[^1-9])/) && (e = "int256" + e.substring(3)), e;}function b(e, t) {var r = e;function n(e) {throw new Error('unexpected character "' + r[e] + '" at position ' + e + ' in "' + r + '"');}e = e.replace(/\s/g, " ");for (var i = { type: "", name: "", state: { allowType: !0 } }, o = i, s = 0; s < e.length; s++) {var a = e[s];switch (a) {case "(":o.state.allowParams || n(s), o.state.allowType = !1, o.type = g(o.type), o.components = [{ type: "", name: "", parent: o, state: { allowType: !0 } }], o = o.components[0];break;case ")":delete o.state, t && "indexed" === o.name && (o.indexed = !0, o.name = ""), o.type = g(o.type);var u = o;(o = o.parent) || n(s), delete u.parent, o.state.allowParams = !1, o.state.allowName = !0, o.state.allowArray = !0;break;case ",":delete o.state, t && "indexed" === o.name && (o.indexed = !0, o.name = ""), o.type = g(o.type);var l = { type: "", name: "", parent: o.parent, state: { allowType: !0 } };o.parent.components.push(l), delete o.parent, o = l;break;case " ":o.state.allowType && "" !== o.type && (o.type = g(o.type), delete o.state.allowType, o.state.allowName = !0, o.state.allowParams = !0), o.state.allowName && "" !== o.name && (t && "indexed" === o.name ? (o.indexed = !0, o.name = "") : o.state.allowName = !1);break;case "[":o.state.allowArray || n(s), o.type += a, o.state.allowArray = !1, o.state.allowName = !1, o.state.readArray = !0;break;case "]":o.state.readArray || n(s), o.type += a, o.state.readArray = !1, o.state.allowArray = !0, o.state.allowName = !0;break;default:o.state.allowType ? (o.type += a, o.state.allowParams = !0, o.state.allowArray = !0) : o.state.allowName ? (o.name += a, delete o.state.allowArray) : o.state.readArray ? o.type += a : n(s);}}if (o.parent) throw new Error("unexpected eof");return delete i.state, t && "indexed" === o.name && (o.indexed = !0, o.name = ""), i.type = g(i.type), i;}function w(e) {return se(r.defaultCoerceFunc, e).type;}r.parseParamType = function (e) {return b(e, !0);}, r.formatParamType = w, r.formatSignature = function (e) {return e.name + "(" + e.inputs.map(function (e) {return w(e);}).join(",") + ")";}, r.parseSignature = function (e) {if ("string" == typeof e) return "event " === (e = (e = (e = e.replace(/\s/g, " ")).replace(/\(/g, " (").replace(/\)/g, ") ").replace(/\s+/g, " ")).trim()).substring(0, 6) ? function (e) {var t = { anonymous: !1, inputs: [], name: "", type: "event" },r = e.match(y);if (!r) throw new Error("invalid event: " + e);if (t.name = r[1].trim(), ie(r[2]).forEach(function (e) {(e = b(e, !0)).indexed = !!e.indexed, t.inputs.push(e);}), r[3].split(" ").forEach(function (e) {switch (e) {case "anonymous":t.anonymous = !0;break;case "":break;default:l.info("unknown modifier: " + e);}}), t.name && !t.name.match(m)) throw new Error('invalid identifier: "' + t.name + '"');return t;}(e.substring(6).trim()) : ("function " === e.substring(0, 9) && (e = e.substring(9)), function (e) {var t = { constant: !1, gas: null, inputs: [], name: "", outputs: [], payable: !1, stateMutability: null, type: "function" },r = e.split("@");if (1 !== r.length) {if (2 < r.length) throw new Error("invalid signature");if (!r[1].match(/^[0-9]+$/)) throw new Error("invalid signature gas");t.gas = u.bigNumberify(r[1]), e = r[0];}var n = (r = e.split(" returns "))[0].match(y);if (!n) throw new Error("invalid signature");if (t.name = n[1].trim(), !t.name.match(m)) throw new Error('invalid identifier: "' + n[1] + '"');if (ie(n[2]).forEach(function (e) {t.inputs.push(b(e));}), n[3].split(" ").forEach(function (e) {switch (e) {case "constant":t.constant = !0;break;case "payable":t.payable = !0, t.stateMutability = "payable";break;case "pure":t.constant = !0, t.stateMutability = "pure";break;case "view":t.constant = !0, t.stateMutability = "view";break;case "external":case "public":case "":break;default:l.info("unknown modifier: " + e);}}), 1 < r.length) {var i = r[1].match(y);if ("" != i[1].trim() || "" != i[3].trim()) throw new Error("unexpected tokens");ie(i[2]).forEach(function (e) {t.outputs.push(b(e));});}if ("constructor" === t.name) {if (t.type = "constructor", t.outputs.length) throw new Error("constructor may not have outputs");delete t.name, delete t.outputs;}return t;}(e.trim()));throw new Error("unknown signature");};function _(e, t, r, n, i) {this.coerceFunc = e, this.name = t, this.type = r, this.localName = n, this.dynamic = i;}var M,A = (i(E, M = _), E.prototype.encode = function (e) {return this.coder.encode(e);}, E.prototype.decode = function (e, t) {return this.coder.decode(e, t);}, E);function E(e) {var t = M.call(this, e.coerceFunc, e.name, e.type, void 0, e.dynamic) || this;return c.defineReadOnly(t, "coder", e), t;}var S,k = (i(N, S = _), N.prototype.encode = function (e) {return h.arrayify([]);}, N.prototype.decode = function (e, t) {if (t > e.length) throw new Error("invalid null");return { consumed: 0, value: this.coerceFunc("null", void 0) };}, N);function N(e, t) {return S.call(this, e, "null", "", t, !1) || this;}var P,x = (i(I, P = _), I.prototype.encode = function (t) {try {var e = u.bigNumberify(t);if (this.signed) {var r = s.MaxUint256.maskn(8 * this.size - 1);if (e.gt(r)) throw new Error("out-of-bounds");if (r = r.add(s.One).mul(s.NegativeOne), e.lt(r)) throw new Error("out-of-bounds");} else if (e.lt(s.Zero) || e.gt(s.MaxUint256.maskn(8 * this.size))) throw new Error("out-of-bounds");return e = e.toTwos(8 * this.size).maskn(8 * this.size), this.signed && (e = e.fromTwos(8 * this.size).toTwos(256)), h.padZeros(h.arrayify(e), 32);} catch (e) {l.throwError("invalid number value", l.INVALID_ARGUMENT, { arg: this.localName, coderType: this.name, value: t });}return null;}, I.prototype.decode = function (e, t) {e.length < t + 32 && l.throwError("insufficient data for " + this.name + " type", l.INVALID_ARGUMENT, { arg: this.localName, coderType: this.name, value: h.hexlify(e.slice(t, t + 32)) });var r = 32 - this.size,n = u.bigNumberify(e.slice(t + r, t + 32));return n = this.signed ? n.fromTwos(8 * this.size) : n.maskn(8 * this.size), { consumed: 32, value: this.coerceFunc(this.name, n) };}, I);function I(e, t, r, n) {var i = this,o = (r ? "int" : "uint") + 8 * t;return (i = P.call(this, e, o, o, n, !1) || this).size = t, i.signed = r, i;}var T,R = new x(function (e, t) {return t;}, 32, !1, "none"),O = (i(C, T = _), C.prototype.encode = function (e) {return R.encode(e ? 1 : 0);}, C.prototype.decode = function (e, t) {try {var r = R.decode(e, t);} catch (e) {throw "insufficient data for uint256 type" === e.reason && l.throwError("insufficient data for boolean type", l.INVALID_ARGUMENT, { arg: this.localName, coderType: "boolean", value: e.value }), e;}return { consumed: r.consumed, value: this.coerceFunc("bool", !r.value.isZero()) };}, C);function C(e, t) {return T.call(this, e, "bool", "bool", t, !1) || this;}var B,D = (i(L, B = _), L.prototype.encode = function (t) {var e = new Uint8Array(32);try {var r = h.arrayify(t);if (r.length !== this.length) throw new Error("incorrect data length");e.set(r);} catch (e) {l.throwError("invalid " + this.name + " value", l.INVALID_ARGUMENT, { arg: this.localName, coderType: this.name, value: e.value || t });}return e;}, L.prototype.decode = function (e, t) {return e.length < t + 32 && l.throwError("insufficient data for " + this.name + " type", l.INVALID_ARGUMENT, { arg: this.localName, coderType: this.name, value: h.hexlify(e.slice(t, t + 32)) }), { consumed: 32, value: this.coerceFunc(this.name, h.hexlify(e.slice(t, t + this.length))) };}, L);function L(e, t, r) {var n = this,i = "bytes" + t;return (n = B.call(this, e, i, i, r, !1) || this).length = t, n;}var U,F = (i(j, U = _), j.prototype.encode = function (t) {var e = new Uint8Array(32);try {e.set(h.arrayify(a.getAddress(t)), 12);} catch (e) {l.throwError("invalid address", l.INVALID_ARGUMENT, { arg: this.localName, coderType: "address", value: t });}return e;}, j.prototype.decode = function (e, t) {return e.length < t + 32 && l.throwError("insufficuent data for address type", l.INVALID_ARGUMENT, { arg: this.localName, coderType: "address", value: h.hexlify(e.slice(t, t + 32)) }), { consumed: 32, value: this.coerceFunc("address", a.getAddress(h.hexlify(e.slice(t + 12, t + 32)))) };}, j);function j(e, t) {return U.call(this, e, "address", "address", t, !1) || this;}function G(e) {var t = 32 * Math.ceil(e.length / 32),r = new Uint8Array(t - e.length);return h.concat([R.encode(e.length), e, r]);}function H(e, t, r) {e.length < t + 32 && l.throwError("insufficient data for dynamicBytes length", l.INVALID_ARGUMENT, { arg: r, coderType: "dynamicBytes", value: h.hexlify(e.slice(t, t + 32)) });var n = R.decode(e, t).value;try {n = n.toNumber();} catch (e) {l.throwError("dynamic bytes count too large", l.INVALID_ARGUMENT, { arg: r, coderType: "dynamicBytes", value: n.toString() });}return e.length < t + 32 + n && l.throwError("insufficient data for dynamicBytes type", l.INVALID_ARGUMENT, { arg: r, coderType: "dynamicBytes", value: h.hexlify(e.slice(t, t + 32 + n)) }), { consumed: 32 + 32 * Math.ceil(n / 32), value: e.slice(t + 32, t + 32 + n) };}var z,V = (i(K, z = _), K.prototype.encode = function (e) {try {return G(h.arrayify(e));} catch (e) {l.throwError("invalid bytes value", l.INVALID_ARGUMENT, { arg: this.localName, coderType: "bytes", value: e.value });}return null;}, K.prototype.decode = function (e, t) {var r = H(e, t, this.localName);return r.value = this.coerceFunc("bytes", h.hexlify(r.value)), r;}, K);function K(e, t) {return z.call(this, e, "bytes", "bytes", t, !0) || this;}var q,W = (i(Z, q = _), Z.prototype.encode = function (e) {return "string" != typeof e && l.throwError("invalid string value", l.INVALID_ARGUMENT, { arg: this.localName, coderType: "string", value: e }), G(f.toUtf8Bytes(e));}, Z.prototype.decode = function (e, t) {var r = H(e, t, this.localName);return r.value = this.coerceFunc("string", f.toUtf8String(r.value)), r;}, Z);function Z(e, t) {return q.call(this, e, "string", "string", t, !0) || this;}function J(e) {return 32 * Math.ceil(e / 32);}function X(e, r) {if (Array.isArray(r)) ;else if (r && "object" == typeof r) {var t = [];e.forEach(function (e) {t.push(r[e.localName]);}), r = t;} else l.throwError("invalid tuple value", l.INVALID_ARGUMENT, { coderType: "tuple", value: r });e.length !== r.length && l.throwError("types/value length mismatch", l.INVALID_ARGUMENT, { coderType: "tuple", value: r });var n = [];e.forEach(function (e, t) {n.push({ dynamic: e.dynamic, value: e.encode(r[t]) });});var i = 0,o = 0;n.forEach(function (e) {e.dynamic ? (i += 32, o += J(e.value.length)) : i += J(e.value.length);});var s = 0,a = i,u = new Uint8Array(i + o);return n.forEach(function (e) {e.dynamic ? (u.set(R.encode(a), s), s += 32, u.set(e.value, a), a += J(e.value.length)) : (u.set(e.value, s), s += J(e.value.length));}), u;}function $(e, n, i) {var o = i,s = 0,a = [];return e.forEach(function (e) {if (e.dynamic) {var t = R.decode(n, i);(r = e.decode(n, o + t.value.toNumber())).consumed = t.consumed;} else var r = e.decode(n, i);null != r.value && a.push(r.value), i += r.consumed, s += r.consumed;}), e.forEach(function (e, t) {var r = e.localName;r && ("length" === r && (r = "_length"), null == a[r] && (a[r] = a[t]));}), { value: a, consumed: s };}var Q,Y = (i(ee, Q = _), ee.prototype.encode = function (e) {Array.isArray(e) || l.throwError("expected array value", l.INVALID_ARGUMENT, { arg: this.localName, coderType: "array", value: e });var t = this.length,r = new Uint8Array(0);-1 === t && (t = e.length, r = R.encode(t)), l.checkArgumentCount(t, e.length, " in coder array" + (this.localName ? " " + this.localName : ""));for (var n = [], i = 0; i < e.length; i++) {n.push(this.coder);}return h.concat([r, X(n, e)]);}, ee.prototype.decode = function (e, t) {var r = 0,n = this.length;if (-1 === n) {try {var i = R.decode(e, t);} catch (e) {l.throwError("insufficient data for dynamic array length", l.INVALID_ARGUMENT, { arg: this.localName, coderType: "array", value: e.value });}try {n = i.value.toNumber();} catch (e) {l.throwError("array count too large", l.INVALID_ARGUMENT, { arg: this.localName, coderType: "array", value: i.value.toString() });}r += i.consumed, t += i.consumed;}for (var o = [], s = 0; s < n; s++) {o.push(new A(this.coder));}var a = $(o, e, t);return a.consumed += r, a.value = this.coerceFunc(this.type, a.value), a;}, ee);function ee(e, t, r, n) {var i = this,o = t.type + "[" + (0 <= r ? r : "") + "]",s = -1 === r || t.dynamic;return (i = Q.call(this, e, "array", o, n, s) || this).coder = t, i.length = r, i;}var te,re = (i(ne, te = _), ne.prototype.encode = function (e) {return X(this.coders, e);}, ne.prototype.decode = function (e, t) {var r = $(this.coders, e, t);return r.value = this.coerceFunc(this.type, r.value), r;}, ne);function ne(e, t, r) {var n = this,i = !1,o = [];t.forEach(function (e) {e.dynamic && (i = !0), o.push(e.type);});var s = "tuple(" + o.join(",") + ")";return (n = te.call(this, e, "tuple", s, r, i) || this).coders = t, n;}function ie(e) {e = e.trim();for (var t = [], r = "", n = 0, i = 0; i < e.length; i++) {var o = e[i];if ("," === o && 0 === n) t.push(r), r = "";else if (r += o, "(" === o) n++;else if (")" === o && -1 === --n) throw new Error("unbalanced parenthsis");}return r && t.push(r), t;}var oe = { address: F, bool: O, string: W, bytes: V };function se(e, t) {var r,n = oe[t.type];if (n) return new n(e, t.name);if (r = t.type.match(p)) return (0 === (i = parseInt(r[2] || "256")) || 256 < i || i % 8 != 0) && l.throwError("invalid " + r[1] + " bit length", l.INVALID_ARGUMENT, { arg: "param", value: t }), new x(e, i / 8, "int" === r[1], t.name);if (r = t.type.match(d)) return (0 === (i = parseInt(r[1])) || 32 < i) && l.throwError("invalid bytes length", l.INVALID_ARGUMENT, { arg: "param", value: t }), new D(e, i, t.name);if (r = t.type.match(v)) {var i = parseInt(r[2] || "-1");return (t = c.shallowCopy(t)).type = r[1], t = c.deepCopy(t), new Y(e, se(e, t), i, t.name);}return "tuple" === t.type.substring(0, 5) ? function (t, e, r) {var n = [];return (e = e || []).forEach(function (e) {n.push(se(t, e));}), new re(t, n, r);}(e, t.components, t.name) : "" === t.type ? new k(e, t.name) : (l.throwError("invalid type", l.INVALID_ARGUMENT, { arg: "type", value: t.type }), null);}var ae = (ue.prototype.encode = function (e, t) {e.length !== t.length && l.throwError("types/values length mismatch", l.INVALID_ARGUMENT, { count: { types: e.length, values: t.length }, value: { types: e, values: t } });var r = [];return e.forEach(function (e) {var t = null;t = "string" == typeof e ? b(e) : e, r.push(se(this.coerceFunc, t));}, this), h.hexlify(new re(this.coerceFunc, r, "_").encode(t));}, ue.prototype.decode = function (e, t) {var r = [];return e.forEach(function (e) {var t = null;t = "string" == typeof e ? b(e) : c.deepCopy(e), r.push(se(this.coerceFunc, t));}, this), new re(this.coerceFunc, r, "_").decode(h.arrayify(t), 0).value;}, ue);function ue(e) {l.checkNew(this, ue), e = e || r.defaultCoerceFunc, c.defineReadOnly(this, "coerceFunc", e);}r.AbiCoder = ae, r.defaultAbiCoder = new ae();}, { "../constants": 3, "../errors": 5, "./address": 59, "./bignumber": 62, "./bytes": 63, "./properties": 73, "./utf8": 84 }], 59: [function (e, t, r) {"use strict";var n = this && this.__importDefault || function (e) {return e && e.__esModule ? e : { default: e };};Object.defineProperty(r, "__esModule", { value: !0 });var i = n(e("bn.js")),o = e("./bytes"),s = e("./keccak256"),a = e("./rlp"),u = e("../errors");function l(e) {"string" == typeof e && e.match(/^0x[0-9A-Fa-f]{40}$/) || u.throwError("invalid address", u.INVALID_ARGUMENT, { arg: "address", value: e });for (var t = (e = e.toLowerCase()).substring(2).split(""), r = new Uint8Array(40), n = 0; n < 40; n++) {r[n] = t[n].charCodeAt(0);}r = o.arrayify(s.keccak256(r));for (var i = 0; i < 40; i += 2) {8 <= r[i >> 1] >> 4 && (t[i] = t[i].toUpperCase()), 8 <= (15 & r[i >> 1]) && (t[i + 1] = t[i + 1].toUpperCase());}return "0x" + t.join("");}for (var h = {}, f = 0; f < 10; f++) {h[String(f)] = String(f);}for (f = 0; f < 26; f++) {h[String.fromCharCode(65 + f)] = String(10 + f);}var c,d = Math.floor((c = 9007199254740991, Math.log10 ? Math.log10(c) : Math.log(c) / Math.LN10));function p(e) {e = (e = e.toUpperCase()).substring(4) + e.substring(0, 2) + "00";var t = "";for (e.split("").forEach(function (e) {t += h[e];}); t.length >= d;) {var r = t.substring(0, d);t = parseInt(r, 10) % 97 + t.substring(r.length);}for (var n = String(98 - parseInt(t, 10) % 97); n.length < 2;) {n = "0" + n;}return n;}function v(e) {var t = null;if ("string" != typeof e && u.throwError("invalid address", u.INVALID_ARGUMENT, { arg: "address", value: e }), e.match(/^(0x)?[0-9a-fA-F]{40}$/)) "0x" !== e.substring(0, 2) && (e = "0x" + e), t = l(e), e.match(/([A-F].*[a-f])|([a-f].*[A-F])/) && t !== e && u.throwError("bad address checksum", u.INVALID_ARGUMENT, { arg: "address", value: e });else if (e.match(/^XE[0-9]{2}[0-9A-Za-z]{30,31}$/)) {for (e.substring(2, 4) !== p(e) && u.throwError("bad icap checksum", u.INVALID_ARGUMENT, { arg: "address", value: e }), t = new i.default.BN(e.substring(4), 36).toString(16); t.length < 40;) {t = "0" + t;}t = l("0x" + t);} else u.throwError("invalid address", u.INVALID_ARGUMENT, { arg: "address", value: e });return t;}r.getAddress = v, r.getIcapAddress = function (e) {for (var t = new i.default.BN(v(e).substring(2), 16).toString(36).toUpperCase(); t.length < 30;) {t = "0" + t;}return "XE" + p("XE00" + t) + t;}, r.getContractAddress = function (e) {if (!e.from) throw new Error("missing from address");var t = e.nonce;return v("0x" + s.keccak256(a.encode([v(e.from), o.stripZeros(o.hexlify(t))])).substring(26));};}, { "../errors": 5, "./bytes": 63, "./keccak256": 70, "./rlp": 75, "bn.js": 9 }], 60: [function (e, t, r) {"use strict";Object.defineProperty(r, "__esModule", { value: !0 });var n = e("../utils/bytes");t.exports = { decode: function decode(e) {e = atob(e);for (var t = [], r = 0; r < e.length; r++) {t.push(e.charCodeAt(r));}return n.arrayify(t);}, encode: function encode(e) {e = n.arrayify(e);for (var t = "", r = 0; r < e.length; r++) {t += String.fromCharCode(e[r]);}return btoa(t);} };}, { "../utils/bytes": 63 }], 61: [function (e, t, r) {"use strict";Object.defineProperty(r, "__esModule", { value: !0 });var l = e("./bytes"),n = e("./properties"),i = (o.prototype.encode = function (e) {var t = l.arrayify(e);if (0 === t.length) return "";for (var r = [0], n = 0; n < t.length; ++n) {for (var i = t[n], o = 0; o < r.length; ++o) {i += r[o] << 8, r[o] = i % this.base, i = i / this.base | 0;}for (; 0 < i;) {r.push(i % this.base), i = i / this.base | 0;}}for (var s = "", a = 0; 0 === t[a] && a < t.length - 1; ++a) {s += this._leader;}for (var u = r.length - 1; 0 <= u; --u) {s += this.alphabet[r[u]];}return s;}, o.prototype.decode = function (e) {if ("string" != typeof e) throw new TypeError("Expected String");var t = [];if (0 === e.length) return new Uint8Array(t);t.push(0);for (var r = 0; r < e.length; r++) {var n = this._alphabetMap[e[r]];if (void 0 === n) throw new Error("Non-base" + this.base + " character");for (var i = n, o = 0; o < t.length; ++o) {i += t[o] * this.base, t[o] = 255 & i, i >>= 8;}for (; 0 < i;) {t.push(255 & i), i >>= 8;}}for (var s = 0; e[s] === this._leader && s < e.length - 1; ++s) {t.push(0);}return l.arrayify(new Uint8Array(t.reverse()));}, o);function o(e) {n.defineReadOnly(this, "alphabet", e), n.defineReadOnly(this, "base", e.length), n.defineReadOnly(this, "_alphabetMap", {}), n.defineReadOnly(this, "_leader", e.charAt(0));for (var t = 0; t < e.length; t++) {this._alphabetMap[e.charAt(t)] = t;}}var s = new (r.BaseX = i)("abcdefghijklmnopqrstuvwxyz234567");r.Base32 = s;var a = new i("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");r.Base58 = a;}, { "./bytes": 63, "./properties": 73 }], 62: [function (e, t, r) {"use strict";var n = this && this.__importDefault || function (e) {return e && e.__esModule ? e : { default: e };},i = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });var o = n(e("bn.js")),s = e("./bytes"),a = e("./properties"),u = i(e("../errors")),l = new o.default.BN(-1);function h(e) {var t = e.toString(16);return "-" === t[0] ? t.length % 2 == 0 ? "-0x0" + t.substring(1) : "-0x" + t.substring(1) : t.length % 2 == 1 ? "0x0" + t : "0x" + t;}function f(e) {return d(y(e));}function c(e) {return new p(h(e));}function d(e) {var t = e._hex;return "-" === t[0] ? new o.default.BN(t.substring(3), 16).mul(l) : new o.default.BN(t.substring(2), 16);}var p = (v.prototype.fromTwos = function (e) {return c(d(this).fromTwos(e));}, v.prototype.toTwos = function (e) {return c(d(this).toTwos(e));}, v.prototype.abs = function () {return "-" === this._hex[0] ? c(d(this).mul(l)) : this;}, v.prototype.add = function (e) {return c(d(this).add(f(e)));}, v.prototype.sub = function (e) {return c(d(this).sub(f(e)));}, v.prototype.div = function (e) {return y(e).isZero() && u.throwError("division by zero", u.NUMERIC_FAULT, { operation: "divide", fault: "division by zero" }), c(d(this).div(f(e)));}, v.prototype.mul = function (e) {return c(d(this).mul(f(e)));}, v.prototype.mod = function (e) {return c(d(this).mod(f(e)));}, v.prototype.pow = function (e) {return c(d(this).pow(f(e)));}, v.prototype.maskn = function (e) {return c(d(this).maskn(e));}, v.prototype.eq = function (e) {return d(this).eq(f(e));}, v.prototype.lt = function (e) {return d(this).lt(f(e));}, v.prototype.lte = function (e) {return d(this).lte(f(e));}, v.prototype.gt = function (e) {return d(this).gt(f(e));}, v.prototype.gte = function (e) {return d(this).gte(f(e));}, v.prototype.isZero = function () {return d(this).isZero();}, v.prototype.toNumber = function () {try {return d(this).toNumber();} catch (e) {u.throwError("overflow", u.NUMERIC_FAULT, { operation: "setValue", fault: "overflow", details: e.message });}return null;}, v.prototype.toString = function () {return d(this).toString(10);}, v.prototype.toHexString = function () {return this._hex;}, v.isBigNumber = function (e) {return a.isType(e, "BigNumber");}, v);function v(e) {if (u.checkNew(this, v), a.setType(this, "BigNumber"), "string" == typeof e) s.isHexString(e) ? ("0x" == e && (e = "0x0"), a.defineReadOnly(this, "_hex", e)) : "-" === e[0] && s.isHexString(e.substring(1)) ? a.defineReadOnly(this, "_hex", e) : e.match(/^-?[0-9]*$/) ? ("" == e && (e = "0"), a.defineReadOnly(this, "_hex", h(new o.default.BN(e)))) : u.throwError("invalid BigNumber string value", u.INVALID_ARGUMENT, { arg: "value", value: e });else if ("number" == typeof e) {parseInt(String(e)) !== e && u.throwError("underflow", u.NUMERIC_FAULT, { operation: "setValue", fault: "underflow", value: e, outputValue: parseInt(String(e)) });try {a.defineReadOnly(this, "_hex", h(new o.default.BN(e)));} catch (e) {u.throwError("overflow", u.NUMERIC_FAULT, { operation: "setValue", fault: "overflow", details: e.message });}} else e instanceof v ? a.defineReadOnly(this, "_hex", e._hex) : e.toHexString ? a.defineReadOnly(this, "_hex", h(f(e.toHexString()))) : e._hex && s.isHexString(e._hex) ? a.defineReadOnly(this, "_hex", e._hex) : s.isArrayish(e) ? a.defineReadOnly(this, "_hex", h(new o.default.BN(s.hexlify(e).substring(2), 16))) : u.throwError("invalid BigNumber value", u.INVALID_ARGUMENT, { arg: "value", value: e });}function y(e) {return p.isBigNumber(e) ? e : new p(e);}r.BigNumber = p, r.bigNumberify = y;}, { "../errors": 5, "./bytes": 63, "./properties": 73, "bn.js": 9 }], 63: [function (e, t, r) {"use strict";var n = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });var s = n(e("../errors"));function a(e) {return !!e.toHexString;}function u(t) {return t.slice || (t.slice = function () {var e = Array.prototype.slice.call(arguments);return u(new Uint8Array(Array.prototype.slice.apply(t, e)));}), t;}function l(e) {if (!e || parseInt(String(e.length)) != e.length || "string" == typeof e) return !1;for (var t = 0; t < e.length; t++) {var r = e[t];if (r < 0 || 256 <= r || parseInt(String(r)) != r) return !1;}return !0;}function h(e) {if (null == e && s.throwError("cannot convert null value to array", s.INVALID_ARGUMENT, { arg: "value", value: e }), a(e) && (e = e.toHexString()), "string" != typeof e) return l(e) ? u(new Uint8Array(e)) : (s.throwError("invalid arrayify value", null, { arg: "value", value: e, type: typeof e }), null);var t = e.match(/^(0x)?[0-9a-fA-F]*$/);t || s.throwError("invalid hexidecimal string", s.INVALID_ARGUMENT, { arg: "value", value: e }), "0x" !== t[1] && s.throwError("hex string must have 0x prefix", s.INVALID_ARGUMENT, { arg: "value", value: e }), (e = e.substring(2)).length % 2 && (e = "0" + e);for (var r = [], n = 0; n < e.length; n += 2) {r.push(parseInt(e.substr(n, 2), 16));}return u(new Uint8Array(r));}function i(e) {for (var t = [], r = 0, n = 0; n < e.length; n++) {var i = h(e[n]);t.push(i), r += i.length;}var o = new Uint8Array(r),s = 0;for (n = 0; n < t.length; n++) {o.set(t[n], s), s += t[n].length;}return u(o);}function o(e, t) {return !("string" != typeof e || !e.match(/^0x[0-9A-Fa-f]*$/)) && (!t || e.length === 2 + 2 * t);}r.isHexable = a, r.isArrayish = l, r.arrayify = h, r.concat = i, r.stripZeros = function (e) {var t = h(e);if (0 === t.length) return t;for (var r = 0; 0 === t[r];) {r++;}return r && (t = t.slice(r)), t;}, r.padZeros = function (e, t) {if (t < (e = h(e)).length) throw new Error("cannot pad");var r = new Uint8Array(t);return r.set(e, t - e.length), u(r);}, r.isHexString = o;var f = "0123456789abcdef";function c(e) {if (a(e)) return e.toHexString();if ("number" == typeof e) {e < 0 && s.throwError("cannot hexlify negative value", s.INVALID_ARGUMENT, { arg: "value", value: e }), 9007199254740991 <= e && s.throwError("out-of-range", s.NUMERIC_FAULT, { operartion: "hexlify", fault: "out-of-safe-range" });for (var t = ""; e;) {t = f[15 & e] + t, e = Math.floor(e / 16);}return t.length ? (t.length % 2 && (t = "0" + t), "0x" + t) : "0x00";}if ("string" == typeof e) {var r = e.match(/^(0x)?[0-9a-fA-F]*$/);return r || s.throwError("invalid hexidecimal string", s.INVALID_ARGUMENT, { arg: "value", value: e }), "0x" !== r[1] && s.throwError("hex string must have 0x prefix", s.INVALID_ARGUMENT, { arg: "value", value: e }), e.length % 2 && (e = "0x0" + e.substring(2)), e;}if (l(e)) {for (var n = [], i = 0; i < e.length; i++) {var o = e[i];n.push(f[(240 & o) >> 4] + f[15 & o]);}return "0x" + n.join("");}return s.throwError("invalid hexlify value", null, { arg: "value", value: e }), "never";}function d(e, t) {for (o(e) || s.throwError("invalid hex string", s.INVALID_ARGUMENT, { arg: "value", value: e }); e.length < 2 * t + 2;) {e = "0x0" + e.substring(2);}return e;}function p(e) {var t = 0,r = "0x",n = "0x";if (function (e) {return e && null != e.r && null != e.s;}(e)) {null == e.v && null == e.recoveryParam && s.throwError("at least on of recoveryParam or v must be specified", s.INVALID_ARGUMENT, { argument: "signature", value: e }), r = d(e.r, 32), n = d(e.s, 32), "string" == typeof (t = e.v) && (t = parseInt(t, 16));var i = e.recoveryParam;null == i && null != e.v && (i = 1 - t % 2), t = 27 + i;} else {var o = h(e);if (65 !== o.length) throw new Error("invalid signature");r = c(o.slice(0, 32)), n = c(o.slice(32, 64)), 27 !== (t = o[64]) && 28 !== t && (t = 27 + t % 2);}return { r: r, s: n, recoveryParam: t - 27, v: t };}r.hexlify = c, r.hexDataLength = function (e) {return o(e) && e.length % 2 == 0 ? (e.length - 2) / 2 : null;}, r.hexDataSlice = function (e, t, r) {return o(e) || s.throwError("invalid hex data", s.INVALID_ARGUMENT, { arg: "value", value: e }), e.length % 2 != 0 && s.throwError("hex data length must be even", s.INVALID_ARGUMENT, { arg: "value", value: e }), t = 2 + 2 * t, null != r ? "0x" + e.substring(t, 2 + 2 * r) : "0x" + e.substring(t);}, r.hexStripZeros = function (e) {for (o(e) || s.throwError("invalid hex string", s.INVALID_ARGUMENT, { arg: "value", value: e }); 3 < e.length && "0x0" === e.substring(0, 3);) {e = "0x" + e.substring(3);}return e;}, r.hexZeroPad = d, r.splitSignature = p, r.joinSignature = function (e) {return c(i([(e = p(e)).r, e.s, e.recoveryParam ? "0x1c" : "0x1b"]));};}, { "../errors": 5 }], 64: [function (e, t, r) {"use strict";var n = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });var i = n(e("../errors")),o = e("./bytes"),s = e("./utf8"),a = e("./keccak256"),u = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),l = new RegExp("^((.*)\\.)?([^.]+)$"),h = new RegExp("^[a-z0-9.-]*$");r.namehash = function (e) {"string" != typeof e && i.throwError("invalid address - " + String(e), i.INVALID_ARGUMENT, { argument: "name", value: e }), (e = e.toLowerCase()).match(h) || i.throwError("contains invalid UseSTD3ASCIIRules characters", i.INVALID_ARGUMENT, { argument: "name", value: e });for (var t = u; e.length;) {var r = e.match(l),n = s.toUtf8Bytes(r[3]);t = a.keccak256(o.concat([t, a.keccak256(n)])), e = r[2] || "";}return o.hexlify(t);}, r.id = function (e) {return a.keccak256(s.toUtf8Bytes(e));}, r.hashMessage = function (e) {return a.keccak256(o.concat([s.toUtf8Bytes("\x19Ethereum Signed Message:\n"), s.toUtf8Bytes(String(e.length)), "string" == typeof e ? s.toUtf8Bytes(e) : e]));};}, { "../errors": 5, "./bytes": 63, "./keccak256": 70, "./utf8": 84 }], 65: [function (e, t, r) {"use strict";var n = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });var f = n(e("../errors")),c = e("../wordlists/lang-en"),a = e("./basex"),d = e("./bytes"),l = e("./bignumber"),i = e("./utf8"),o = e("./pbkdf2"),h = e("./hmac"),p = e("./properties"),v = e("./secp256k1"),y = e("./sha2"),m = l.bigNumberify("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),s = i.toUtf8Bytes("Bitcoin seed"),g = 2147483648;function b(e) {return (1 << e) - 1 << 8 - e;}function w(e) {return d.hexZeroPad(d.hexlify(e), 32);}function u(e) {var t = d.hexDataSlice(y.sha256(y.sha256(e)), 0, 4);return a.Base58.encode(d.concat([e, t]));}var _ = {};r.defaultPath = "m/44'/60'/0'/0/0";var M = (Object.defineProperty(A.prototype, "extendedKey", { get: function get() {if (256 <= this.depth) throw new Error("Depth too large!");return u(d.concat([null != this.privateKey ? "0x0488ADE4" : "0x0488B21E", d.hexlify(this.depth), this.parentFingerprint, d.hexZeroPad(d.hexlify(this.index), 4), this.chainCode, null != this.privateKey ? d.concat(["0x00", this.privateKey]) : this.publicKey]));}, enumerable: !0, configurable: !0 }), A.prototype.neuter = function () {return new A(_, null, this.publicKey, this.parentFingerprint, this.chainCode, this.index, this.depth, null, this.path);}, A.prototype._derive = function (e) {if (4294967295 < e) throw new Error("invalid index - " + String(e));var t = this.path;t && (t += "/" + (e & ~g));var r = new Uint8Array(37);if (e & g) {if (!this.privateKey) throw new Error("cannot derive child of neutered node");r.set(d.arrayify(this.privateKey), 1), t && (t += "'");} else r.set(d.arrayify(this.publicKey));for (var n = 24; 0 <= n; n -= 8) {r[33 + (n >> 3)] = e >> 24 - n & 255;}var i = h.computeHmac(h.SupportedAlgorithms.sha512, this.chainCode, r),o = i.slice(0, 32),s = i.slice(32),a = null,u = null;return this.privateKey ? a = w(l.bigNumberify(o).add(this.privateKey).mod(m)) : u = new v.KeyPair(d.hexlify(o))._addPoint(this.publicKey), new A(_, a, u, this.fingerprint, w(s), e, this.depth + 1, this.mnemonic, t);}, A.prototype.derivePath = function (e) {var t = e.split("/");if (0 === t.length || "m" === t[0] && 0 !== this.depth) throw new Error("invalid path - " + e);"m" === t[0] && t.shift();for (var r = this, n = 0; n < t.length; n++) {var i = t[n];if (i.match(/^[0-9]+'$/)) {var o = parseInt(i.substring(0, i.length - 1));if (g <= o) throw new Error("invalid path index - " + i);r = r._derive(g + o);} else {if (!i.match(/^[0-9]+$/)) throw new Error("invalid path component - " + i);if (o = parseInt(i), g <= o) throw new Error("invalid path index - " + i);r = r._derive(o);}}return r;}, A.isHDNode = function (e) {return p.isType(e, "HDNode");}, A);function A(e, t, r, n, i, o, s, a, u) {if (f.checkNew(this, A), e !== _) throw new Error("HDNode constructor cannot be called directly");if (t) {var l = new v.KeyPair(t);p.defineReadOnly(this, "privateKey", l.privateKey), p.defineReadOnly(this, "publicKey", l.compressedPublicKey);} else p.defineReadOnly(this, "privateKey", null), p.defineReadOnly(this, "publicKey", d.hexlify(r));p.defineReadOnly(this, "parentFingerprint", n), p.defineReadOnly(this, "fingerprint", d.hexDataSlice(y.ripemd160(y.sha256(this.publicKey)), 0, 4)), p.defineReadOnly(this, "address", v.computeAddress(this.publicKey)), p.defineReadOnly(this, "chainCode", i), p.defineReadOnly(this, "index", o), p.defineReadOnly(this, "depth", s), p.defineReadOnly(this, "mnemonic", a), p.defineReadOnly(this, "path", u), p.setType(this, "HDNode");}function E(e, t) {var r = d.arrayify(e);if (r.length < 16 || 64 < r.length) throw new Error("invalid seed");var n = d.arrayify(h.computeHmac(h.SupportedAlgorithms.sha512, s, r));return new M(_, w(n.slice(0, 32)), null, "0x00000000", w(n.slice(32)), 0, 0, t, "m");}function S(e, t) {t = t || "";var r = i.toUtf8Bytes("mnemonic" + t, i.UnicodeNormalizationForm.NFKD);return d.hexlify(o.pbkdf2(i.toUtf8Bytes(e, i.UnicodeNormalizationForm.NFKD), r, 2048, 64, "sha512"));}function k(e, t) {t = t || c.langEn, f.checkNormalize();var r = t.split(e);if (r.length % 3 != 0) throw new Error("invalid mnemonic");for (var n = d.arrayify(new Uint8Array(Math.ceil(11 * r.length / 8))), i = 0, o = 0; o < r.length; o++) {var s = t.getWordIndex(r[o].normalize("NFKD"));if (-1 === s) throw new Error("invalid mnemonic");for (var a = 0; a < 11; a++) {s & 1 << 10 - a && (n[i >> 3] |= 1 << 7 - i % 8), i++;}}var u = 32 * r.length / 3,l = b(r.length / 3),h = d.arrayify(y.sha256(n.slice(0, u / 8)))[0];if ((h &= l) != (n[n.length - 1] & l)) throw new Error("invalid checksum");return d.hexlify(n.slice(0, u / 8));}function N(e, t) {if ((e = d.arrayify(e)).length % 4 != 0 || e.length < 16 || 32 < e.length) throw new Error("invalid entropy");for (var r = [0], n = 11, i = 0; i < e.length; i++) {8 < n ? (r[r.length - 1] <<= 8, r[r.length - 1] |= e[i], n -= 8) : (r[r.length - 1] <<= n, r[r.length - 1] |= e[i] >> 8 - n, r.push(e[i] & (1 << 8 - n) - 1), n += 3);}var o = d.arrayify(y.sha256(e))[0],s = e.length / 4;return o &= b(s), r[r.length - 1] <<= s, r[r.length - 1] |= o >> 8 - s, (t = t || c.langEn).join(r.map(function (e) {return t.getWord(e);}));}r.HDNode = M, r.fromExtendedKey = function (e) {var t = a.Base58.decode(e);82 === t.length && u(t.slice(0, 78)) === e || f.throwError("invalid extended key", f.INVALID_ARGUMENT, { argument: "extendedKey", value: "[REDACTED]" });var r = t[4],n = d.hexlify(t.slice(5, 9)),i = parseInt(d.hexlify(t.slice(9, 13)).substring(2), 16),o = d.hexlify(t.slice(13, 45)),s = t.slice(45, 78);switch (d.hexlify(t.slice(0, 4))) {case "0x0488b21e":case "0x043587cf":return new M(_, null, d.hexlify(s), n, o, i, r, null, null);case "0x0488ade4":case "0x04358394":if (0 !== s[0]) break;return new M(_, d.hexlify(s.slice(1)), null, n, o, i, r, null, null);}return f.throwError("invalid extended key", f.INVALID_ARGUMENT, { argument: "extendedKey", value: "[REDACTED]" });}, r.fromMnemonic = function (e, t, r) {return E(S(e = N(k(e, t), t), r), e);}, r.fromSeed = function (e) {return E(e, null);}, r.mnemonicToSeed = S, r.mnemonicToEntropy = k, r.entropyToMnemonic = N, r.isValidMnemonic = function (e, t) {try {return k(e, t), !0;} catch (e) {}return !1;};}, { "../errors": 5, "../wordlists/lang-en": 89, "./basex": 61, "./bignumber": 62, "./bytes": 63, "./hmac": 66, "./pbkdf2": 72, "./properties": 73, "./secp256k1": 76, "./sha2": 78, "./utf8": 84 }], 66: [function (e, t, r) {"use strict";var n = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });var i,o,s = n(e("hash.js")),a = e("../utils/bytes"),u = n(e("../errors"));(o = i = r.SupportedAlgorithms || (r.SupportedAlgorithms = {})).sha256 = "sha256", o.sha512 = "sha512", r.computeHmac = function (e, t, r) {return i[e] || u.throwError("unsupported algorithm " + e, u.UNSUPPORTED_OPERATION, { operation: "hmac", algorithm: e }), a.arrayify(s.hmac(s[e], a.arrayify(t)).update(a.arrayify(r)).digest());};}, { "../errors": 5, "../utils/bytes": 63, "hash.js": 27 }], 67: [function (e, t, r) {"use strict";var n = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });var i = e("./abi-coder");r.AbiCoder = i.AbiCoder, r.defaultAbiCoder = i.defaultAbiCoder, r.formatSignature = i.formatSignature, r.formatParamType = i.formatParamType, r.parseSignature = i.parseSignature, r.parseParamType = i.parseParamType;var o = e("./address");r.getAddress = o.getAddress, r.getContractAddress = o.getContractAddress, r.getIcapAddress = o.getIcapAddress;var s = n(e("./base64"));r.base64 = s;var a = e("./bignumber");r.BigNumber = a.BigNumber, r.bigNumberify = a.bigNumberify;var u = e("./bytes");r.arrayify = u.arrayify, r.concat = u.concat, r.hexDataSlice = u.hexDataSlice, r.hexDataLength = u.hexDataLength, r.hexlify = u.hexlify, r.hexStripZeros = u.hexStripZeros, r.hexZeroPad = u.hexZeroPad, r.isHexString = u.isHexString, r.joinSignature = u.joinSignature, r.padZeros = u.padZeros, r.splitSignature = u.splitSignature, r.stripZeros = u.stripZeros;var l = e("./hash");r.hashMessage = l.hashMessage, r.id = l.id, r.namehash = l.namehash;var h = n(e("./hdnode"));r.HDNode = h;var f = e("./interface");r.Interface = f.Interface;var c = e("./json-wallet");r.getJsonWalletAddress = c.getJsonWalletAddress;var d = e("./keccak256");r.keccak256 = d.keccak256;var p = e("./sha2");r.sha256 = p.sha256;var v = e("./solidity");r.solidityKeccak256 = v.keccak256, r.solidityPack = v.pack, r.soliditySha256 = v.sha256;var y = e("./random-bytes");r.randomBytes = y.randomBytes;var m = e("./networks");r.getNetwork = m.getNetwork;var g = e("./properties");r.checkProperties = g.checkProperties, r.deepCopy = g.deepCopy, r.defineReadOnly = g.defineReadOnly, r.resolveProperties = g.resolveProperties, r.shallowCopy = g.shallowCopy;var b = n(e("./rlp"));r.RLP = b;var w = e("./secp256k1");r.computeAddress = w.computeAddress, r.computePublicKey = w.computePublicKey, r.recoverAddress = w.recoverAddress, r.recoverPublicKey = w.recoverPublicKey, r.verifyMessage = w.verifyMessage;var _ = e("./signing-key");r.SigningKey = _.SigningKey;var M = e("./transaction");r.populateTransaction = M.populateTransaction;var A = e("./transaction");r.parseTransaction = A.parse, r.serializeTransaction = A.serialize;var E = e("./utf8");r.formatBytes32String = E.formatBytes32String, r.parseBytes32String = E.parseBytes32String, r.toUtf8Bytes = E.toUtf8Bytes, r.toUtf8String = E.toUtf8String;var S = e("./units");r.commify = S.commify, r.formatEther = S.formatEther, r.parseEther = S.parseEther, r.formatUnits = S.formatUnits, r.parseUnits = S.parseUnits;var k = e("./web");r.fetchJson = k.fetchJson, r.poll = k.poll;var N = e("./hmac");r.SupportedAlgorithms = N.SupportedAlgorithms;var P = e("./utf8");r.UnicodeNormalizationForm = P.UnicodeNormalizationForm;var x = e("./wordlist");r.Wordlist = x.Wordlist;}, { "./abi-coder": 58, "./address": 59, "./base64": 60, "./bignumber": 62, "./bytes": 63, "./hash": 64, "./hdnode": 65, "./hmac": 66, "./interface": 68, "./json-wallet": 69, "./keccak256": 70, "./networks": 71, "./properties": 73, "./random-bytes": 74, "./rlp": 75, "./secp256k1": 76, "./sha2": 78, "./signing-key": 80, "./solidity": 81, "./transaction": 82, "./units": 83, "./utf8": 84, "./web": 85, "./wordlist": 86 }], 68: [function (e, t, r) {"use strict";var n,i = this && this.__extends || (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (e, t) {e.__proto__ = t;} || function (e, t) {for (var r in t) {t.hasOwnProperty(r) && (e[r] = t[r]);}}, function (e, t) {function r() {this.constructor = e;}n(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());}),o = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });function s(e) {for (var t in p.setType(this, "Description"), e) {p.defineReadOnly(this, t, p.deepCopy(e[t], !0));}Object.freeze(this);}var a,u = e("./address"),f = e("./abi-coder"),l = e("./bignumber"),c = e("./bytes"),h = e("./hash"),d = e("./keccak256"),p = e("./properties"),v = o(e("../errors")),y = function y(e) {p.setType(this, "Indexed"), p.defineReadOnly(this, "hash", e);},m = (i(g, a = s), g.prototype.encode = function (e, t) {c.isHexString(e) || v.throwError("invalid contract bytecode", v.INVALID_ARGUMENT, { arg: "bytecode", value: e }), v.checkArgumentCount(t.length, this.inputs.length, " in Interface constructor");try {return e + f.defaultAbiCoder.encode(this.inputs, t).substring(2);} catch (e) {v.throwError("invalid constructor argument", v.INVALID_ARGUMENT, { arg: e.arg, reason: e.reason, value: e.value });}return null;}, g);function g() {return null !== a && a.apply(this, arguments) || this;}var b,w = (i(_, b = s), _.prototype.encode = function (e) {v.checkArgumentCount(e.length, this.inputs.length, " in interface function " + this.name);try {return this.sighash + f.defaultAbiCoder.encode(this.inputs, e).substring(2);} catch (e) {v.throwError("invalid input argument", v.INVALID_ARGUMENT, { arg: e.arg, reason: e.reason, value: e.value });}return null;}, _.prototype.decode = function (t) {try {return f.defaultAbiCoder.decode(this.outputs, c.arrayify(t));} catch (e) {v.throwError("invalid data for function output", v.INVALID_ARGUMENT, { arg: "data", errorArg: e.arg, errorValue: e.value, value: t, reason: e.reason });}}, _);function _() {return null !== b && b.apply(this, arguments) || this;}var M,A = (i(E, M = s), E);function E() {return null !== M && M.apply(this, arguments) || this;}var S,k = (i(N, S = s), N.prototype.encodeTopics = function (e) {var n = this;e.length > this.inputs.length && v.throwError("too many arguments for " + this.name, v.UNEXPECTED_ARGUMENT, { maxCount: e.length, expectedCount: this.inputs.length });var i = [];for (this.anonymous || i.push(this.topic), e.forEach(function (e, t) {var r = n.inputs[t];r.indexed ? null == e ? i.push(null) : "string" === r.type ? i.push(h.id(e)) : "bytes" === r.type ? i.push(d.keccak256(e)) : -1 !== r.type.indexOf("[") || "tuple" === r.type.substring(0, 5) ? v.throwError("filtering with tuples or arrays not implemented yet; bug us on GitHub", v.NOT_IMPLEMENTED, { operation: "filter(array|tuple)" }) : ("address" === r.type && u.getAddress(e), i.push(c.hexZeroPad(c.hexlify(e), 32).toLowerCase())) : null != e && v.throwError("cannot filter non-indexed parameters; must be null", v.INVALID_ARGUMENT, { argument: r.name || t, value: e });}); i.length && null === i[i.length - 1];) {i.pop();}return i;}, N.prototype.decode = function (e, r) {null == r || this.anonymous || (r = r.slice(1));var n = [],i = [],o = [];if (this.inputs.forEach(function (e, t) {e.indexed ? "string" === e.type || "bytes" === e.type || 0 <= e.type.indexOf("[") || "tuple" === e.type.substring(0, 5) ? (n.push({ type: "bytes32", name: e.name || "" }), o.push(!0)) : (n.push(e), o.push(!1)) : (i.push(e), o.push(!1));}), null != r) var s = f.defaultAbiCoder.decode(n, c.concat(r));var a = f.defaultAbiCoder.decode(i, c.arrayify(e)),u = {},l = 0,h = 0;return this.inputs.forEach(function (e, t) {e.indexed ? null == r ? u[t] = new y(null) : o[t] ? u[t] = new y(s[h++]) : u[t] = s[h++] : u[t] = a[l++], e.name && (u[e.name] = u[t]);}), u.length = this.inputs.length, new A(u);}, N);function N() {return null !== S && S.apply(this, arguments) || this;}var P,x = (i(I, P = s), I);function I() {return null !== P && P.apply(this, arguments) || this;}var T,R = (i(O, T = s), O);function O() {return null !== T && T.apply(this, arguments) || this;}function C(e) {switch (e.type) {case "constructor":var t = new m({ inputs: e.inputs, payable: null == e.payable || !!e.payable });this.deployFunction || (this.deployFunction = t);break;case "function":var r = f.formatSignature(e).replace(/tuple/g, ""),n = h.id(r).substring(0, 10);t = new w({ inputs: e.inputs, outputs: e.outputs, gas: e.gas, payable: null == e.payable || !!e.payable, type: e.constant ? "call" : "transaction", name: e.name, signature: r, sighash: n });e.name && (null == this.functions[e.name] ? p.defineReadOnly(this.functions, e.name, t) : v.warn("WARNING: Multiple definitions for " + e.name)), null == this.functions[t.signature] && p.defineReadOnly(this.functions, t.signature, t);break;case "event":r = f.formatSignature(e).replace(/tuple/g, ""), t = new k({ name: e.name, signature: r, inputs: e.inputs, topic: h.id(r), anonymous: !!e.anonymous });e.name && null == this.events[e.name] && p.defineReadOnly(this.events, e.name, t), null == this.events[t.signature] && p.defineReadOnly(this.events, t.signature, t);break;case "fallback":break;default:v.warn("WARNING: unsupported ABI type - " + e.type);}}var B = (D.prototype.parseTransaction = function (e) {var t = e.data.substring(0, 10).toLowerCase();for (var r in this.functions) {if (-1 !== r.indexOf("(")) {var n = this.functions[r];if (n.sighash === t) {var i = f.defaultAbiCoder.decode(n.inputs, "0x" + e.data.substring(10));return new x({ args: i, decode: n.decode, name: n.name, signature: n.signature, sighash: n.sighash, value: l.bigNumberify(e.value || "0") });}}}return null;}, D.prototype.parseLog = function (e) {for (var t in this.events) {if (-1 !== t.indexOf("(")) {var r = this.events[t];if (!r.anonymous && r.topic === e.topics[0]) return new R({ decode: r.decode, name: r.name, signature: r.signature, topic: r.topic, values: r.decode(e.data, e.topics) });}}return null;}, D.isInterface = function (e) {return p.isType(e, "Interface");}, D.isIndexed = function (e) {return p.isType(e, "Indexed");}, D);function D(t) {if (v.checkNew(this, D), "string" == typeof t) {try {t = JSON.parse(t);} catch (e) {v.throwError("could not parse ABI JSON", v.INVALID_ARGUMENT, { arg: "abi", errorMessage: e.message, value: t });}if (!Array.isArray(t)) return v.throwError("invalid abi", v.INVALID_ARGUMENT, { arg: "abi", value: t }), null;}p.defineReadOnly(this, "functions", {}), p.defineReadOnly(this, "events", {});var r = [];t.forEach(function (e) {"string" == typeof e && (e = f.parseSignature(e)), r.push(e);}), p.defineReadOnly(this, "abi", p.deepCopy(r, !0)), r.forEach(C, this), this.deployFunction || C.call(this, { type: "constructor", inputs: [] }), p.setType(this, "Interface");}r.Interface = B;}, { "../errors": 5, "./abi-coder": 58, "./address": 59, "./bignumber": 62, "./bytes": 63, "./hash": 64, "./keccak256": 70, "./properties": 73 }], 69: [function (e, t, r) {"use strict";Object.defineProperty(r, "__esModule", { value: !0 });var n = e("./address");function i(e) {try {var t = JSON.parse(e);} catch (e) {return !1;}return t.encseed && t.ethaddr;}function o(e) {try {var t = JSON.parse(e);} catch (e) {return !1;}return !(!t.version || parseInt(t.version) !== t.version || 3 !== parseInt(t.version));}r.isCrowdsaleWallet = i, r.isSecretStorageWallet = o, r.getJsonWalletAddress = function (e) {if (i(e)) try {return n.getAddress(JSON.parse(e).ethaddr);} catch (e) {return null;}if (o(e)) try {return n.getAddress(JSON.parse(e).address);} catch (e) {return null;}return null;};}, { "./address": 59 }], 70: [function (e, t, r) {"use strict";Object.defineProperty(r, "__esModule", { value: !0 });var n = e("js-sha3"),i = e("./bytes");r.keccak256 = function (e) {return "0x" + n.keccak_256(i.arrayify(e));};}, { "./bytes": 63, "js-sha3": 40 }], 71: [function (e, t, r) {"use strict";var n = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });var o = n(e("../errors"));function i(r) {return function (e) {var t = [];return e.InfuraProvider && t.push(new e.InfuraProvider(r)), e.EtherscanProvider && t.push(new e.EtherscanProvider(r)), 0 === t.length ? null : e.FallbackProvider ? new e.FallbackProvider(t) : t[0];};}function s(t, r) {return function (e) {return e.JsonRpcProvider ? new e.JsonRpcProvider(t, r) : null;};}var a = { chainId: 1, ensAddress: "0x314159265dd8dbb310642f98f50c066173c1259b", name: "homestead", _defaultProvider: i("homestead") },u = { chainId: 3, ensAddress: "0x112234455c3a32fd11230c42e7bccd4a84e02010", name: "ropsten", _defaultProvider: i("ropsten") },l = { unspecified: { chainId: 0, name: "unspecified" }, homestead: a, mainnet: a, morden: { chainId: 2, name: "morden" }, ropsten: u, testnet: u, rinkeby: { chainId: 4, ensAddress: "0xe7410170f87102DF0055eB195163A03B7F2Bff4A", name: "rinkeby", _defaultProvider: i("rinkeby") }, goerli: { chainId: 5, ensAddress: "0x112234455c3a32fd11230c42e7bccd4a84e02010", name: "goerli", _defaultProvider: i("goerli") }, kovan: { chainId: 42, name: "kovan", _defaultProvider: i("kovan") }, classic: { chainId: 61, name: "classic", _defaultProvider: s("https://web3.gastracker.io", "classic") }, classicTestnet: { chainId: 62, name: "classicTestnet", _defaultProvider: s("https://web3.gastracker.io/morden", "classicTestnet") } };r.getNetwork = function (e) {if (null == e) return null;if ("number" == typeof e) {for (var t in l) {var r = l[t];if (r.chainId === e) return { name: r.name, chainId: r.chainId, ensAddress: r.ensAddress || null, _defaultProvider: r._defaultProvider || null };}return { chainId: e, name: "unknown" };}if ("string" == typeof e) {var n = l[e];return null == n ? null : { name: n.name, chainId: n.chainId, ensAddress: n.ensAddress, _defaultProvider: n._defaultProvider || null };}var i = l[e.name];return i ? (0 !== e.chainId && e.chainId !== i.chainId && o.throwError("network chainId mismatch", o.INVALID_ARGUMENT, { arg: "network", value: e }), { name: e.name, chainId: i.chainId, ensAddress: e.ensAddress || i.ensAddress || null, _defaultProvider: e._defaultProvider || i._defaultProvider || null }) : ("number" != typeof e.chainId && o.throwError("invalid network chainId", o.INVALID_ARGUMENT, { arg: "network", value: e }), e);};}, { "../errors": 5 }], 72: [function (e, t, r) {"use strict";Object.defineProperty(r, "__esModule", { value: !0 });var m = e("../utils/bytes"),g = e("./hmac");r.pbkdf2 = function (e, t, r, n, i) {var o;e = m.arrayify(e), t = m.arrayify(t);var s,a,u = 1,l = new Uint8Array(n),h = new Uint8Array(t.length + 4);h.set(t);for (var f = 1; f <= u; f++) {h[t.length] = f >> 24 & 255, h[t.length + 1] = f >> 16 & 255, h[t.length + 2] = f >> 8 & 255, h[t.length + 3] = 255 & f;var c = g.computeHmac(i, e, h);o || (o = c.length, a = new Uint8Array(o), s = n - ((u = Math.ceil(n / o)) - 1) * o), a.set(c);for (var d = 1; d < r; d++) {c = g.computeHmac(i, e, c);for (var p = 0; p < o; p++) {a[p] ^= c[p];}}var v = (f - 1) * o,y = f === u ? s : o;l.set(m.arrayify(a).slice(0, y), v);}return m.arrayify(l);};}, { "../utils/bytes": 63, "./hmac": 66 }], 73: [function (e, t, r) {"use strict";var n = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });var i = n(e("../errors"));function s(e, t, r) {Object.defineProperty(e, t, { enumerable: !0, value: r, writable: !1 });}function a(e, t) {return e && e._ethersType === t;}r.defineReadOnly = s, r.setType = function (e, t) {Object.defineProperty(e, "_ethersType", { configurable: !1, value: t, writable: !1 });}, r.isType = a, r.resolveProperties = function (r) {var n = {},i = [];return Object.keys(r).forEach(function (t) {var e = r[t];e instanceof Promise ? i.push(e.then(function (e) {return n[t] = e, null;})) : n[t] = e;}), Promise.all(i).then(function () {return n;});}, r.checkProperties = function (t, r) {t && "object" == typeof t || i.throwError("invalid object", i.INVALID_ARGUMENT, { argument: "object", value: t }), Object.keys(t).forEach(function (e) {r[e] || i.throwError("invalid object key - " + e, i.INVALID_ARGUMENT, { argument: "transaction", value: t, key: e });});}, r.shallowCopy = function (e) {var t = {};for (var r in e) {t[r] = e[r];}return t;};var u = { boolean: !0, number: !0, string: !0 };r.deepCopy = function t(e, r) {if (null == e || u[typeof e]) return e;if (Array.isArray(e)) {var n = e.map(function (e) {return t(e, r);});return r && Object.freeze(n), n;}if ("object" == typeof e) {if (a(e, "BigNumber")) return e;if (a(e, "Description")) return e;if (a(e, "Indexed")) return e;for (var i in n = {}, e) {var o = e[i];void 0 !== o && s(n, i, t(o, r));}return r && Object.freeze(n), n;}if ("function" == typeof e) return e;throw new Error("Cannot deepCopy " + typeof e);}, r.inheritable = function t(r) {return function (e) {!function (e, t) {e.super_ = t, e.prototype = Object.create(t.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } });}(e, r), s(e, "inherits", t(e));};};}, { "../errors": 5 }], 74: [function (o, e, s) {(function (e) {"use strict";Object.defineProperty(s, "__esModule", { value: !0 });var r = o("../utils/bytes"),t = o("../utils/properties"),n = e.crypto || e.msCrypto;function i(e) {if (e <= 0 || 1024 < e || parseInt(String(e)) != e) throw new Error("invalid length");var t = new Uint8Array(e);return n.getRandomValues(t), r.arrayify(t);}n && n.getRandomValues || (console.log("WARNING: Missing strong random number source; using weak randomBytes"), n = { getRandomValues: function getRandomValues(e) {for (var t = 0; t < 20; t++) {for (var r = 0; r < e.length; r++) {t ? e[r] ^= Math.trunc(256 * Math.random()) : e[r] = Math.trunc(256 * Math.random());}}return e;}, _weakCrypto: !0 }), s.randomBytes = i, !0 === n._weakCrypto && t.defineReadOnly(i, "_weakCrypto", !0);}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});}, { "../utils/bytes": 63, "../utils/properties": 73 }], 75: [function (e, t, r) {"use strict";Object.defineProperty(r, "__esModule", { value: !0 });var o = e("./bytes");function s(e) {for (var t = []; e;) {t.unshift(255 & e), e >>= 8;}return t;}function i(e, t, r) {for (var n = 0, i = 0; i < r; i++) {n = 256 * n + e[t + i];}return n;}function a(e, t, r, n) {for (var i = []; r < t + 1 + n;) {var o = u(e, r);if (i.push(o.result), t + 1 + n < (r += o.consumed)) throw new Error("invalid rlp");}return { consumed: 1 + n, result: i };}function u(e, t) {if (0 === e.length) throw new Error("invalid rlp data");if (248 <= e[t]) {if (t + 1 + (r = e[t] - 247) > e.length) throw new Error("too short");if (t + 1 + r + (n = i(e, t + 1, r)) > e.length) throw new Error("to short");return a(e, t, t + 1 + r, r + n);}if (192 <= e[t]) {if (t + 1 + (n = e[t] - 192) > e.length) throw new Error("invalid rlp data");return a(e, t, t + 1, n);}if (184 <= e[t]) {var r;if (t + 1 + (r = e[t] - 183) > e.length) throw new Error("invalid rlp data");if (t + 1 + r + (n = i(e, t + 1, r)) > e.length) throw new Error("invalid rlp data");return { consumed: 1 + r + n, result: o.hexlify(e.slice(t + 1 + r, t + 1 + r + n)) };}if (128 <= e[t]) {var n;if (t + 1 + (n = e[t] - 128) > e.length) throw new Error("invalid rlp data");return { consumed: 1 + n, result: o.hexlify(e.slice(t + 1, t + 1 + n)) };}return { consumed: 1, result: o.hexlify(e[t]) };}r.encode = function (e) {return o.hexlify(function t(e) {if (Array.isArray(e)) {var r = [];return e.forEach(function (e) {r = r.concat(t(e));}), r.length <= 55 ? (r.unshift(192 + r.length), r) : ((n = s(r.length)).unshift(247 + n.length), n.concat(r));}var n,i = Array.prototype.slice.call(o.arrayify(e));return 1 === i.length && i[0] <= 127 ? i : i.length <= 55 ? (i.unshift(128 + i.length), i) : ((n = s(i.length)).unshift(183 + n.length), n.concat(i));}(e));}, r.decode = function (e) {var t = o.arrayify(e),r = u(t, 0);if (r.consumed !== t.length) throw new Error("invalid rlp data");return r.result;};}, { "./bytes": 63 }], 76: [function (e, t, r) {"use strict";var n = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });var i = e("elliptic"),o = e("./address"),s = e("./bytes"),a = e("./hash"),u = e("./keccak256"),l = e("./properties"),h = n(e("../errors")),f = null;function c() {return f = f || new i.ec("secp256k1");}var d = (p.prototype.sign = function (e) {var t = c().keyFromPrivate(s.arrayify(this.privateKey)).sign(s.arrayify(e), { canonical: !0 });return { recoveryParam: t.recoveryParam, r: s.hexZeroPad("0x" + t.r.toString(16), 32), s: s.hexZeroPad("0x" + t.s.toString(16), 32), v: 27 + t.recoveryParam };}, p.prototype.computeSharedSecret = function (e) {var t = c().keyFromPrivate(s.arrayify(this.privateKey)),r = c().keyFromPublic(s.arrayify(v(e)));return s.hexZeroPad("0x" + t.derive(r.getPublic()).toString(16), 32);}, p.prototype._addPoint = function (e) {var t = c().keyFromPublic(s.arrayify(this.publicKey)),r = c().keyFromPublic(s.arrayify(e));return "0x" + t.pub.add(r.pub).encodeCompressed("hex");}, p);function p(e) {var t = c().keyFromPrivate(s.arrayify(e));l.defineReadOnly(this, "privateKey", s.hexlify(t.priv.toArray("be", 32))), l.defineReadOnly(this, "publicKey", "0x" + t.getPublic(!1, "hex")), l.defineReadOnly(this, "compressedPublicKey", "0x" + t.getPublic(!0, "hex")), l.defineReadOnly(this, "publicKeyBytes", t.getPublic().encode(null, !0));}function v(e, t) {var r = s.arrayify(e);if (32 !== r.length) return 33 === r.length ? t ? s.hexlify(r) : "0x" + c().keyFromPublic(r).getPublic(!1, "hex") : 65 === r.length ? t ? "0x" + c().keyFromPublic(r).getPublic(!0, "hex") : s.hexlify(r) : (h.throwError("invalid public or private key", h.INVALID_ARGUMENT, { arg: "key", value: "[REDACTED]" }), null);var n = new d(r);return t ? n.compressedPublicKey : n.publicKey;}function y(e) {var t = "0x" + v(e).slice(4);return o.getAddress("0x" + u.keccak256(t).substring(26));}function m(e, t) {var r = s.splitSignature(t),n = { r: s.arrayify(r.r), s: s.arrayify(r.s) };return "0x" + c().recoverPubKey(s.arrayify(e), n, r.recoveryParam).encode("hex", !1);}function g(e, t) {return y(m(s.arrayify(e), t));}r.KeyPair = d, r.computePublicKey = v, r.computeAddress = y, r.recoverPublicKey = m, r.recoverAddress = g, r.verifyMessage = function (e, t) {return g(a.hashMessage(e), t);};}, { "../errors": 5, "./address": 59, "./bytes": 63, "./hash": 64, "./keccak256": 70, "./properties": 73, elliptic: 12 }], 77: [function (e, t, r) {"use strict";var n = this && this.__importDefault || function (e) {return e && e.__esModule ? e : { default: e };},i = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });var T = n(e("aes-js")),m = n(e("scrypt-js")),R = n(e("uuid")),O = e("./signing-key"),g = i(e("./hdnode")),b = e("./address"),C = e("./bytes"),w = e("./pbkdf2"),B = e("./keccak256"),p = e("./utf8"),D = e("./random-bytes");function _(e) {return "string" == typeof e && "0x" !== e.substring(0, 2) && (e = "0x" + e), C.arrayify(e);}function L(e, t) {for (e = String(e); e.length < t;) {e = "0" + e;}return e;}function U(e) {return "string" == typeof e ? p.toUtf8Bytes(e, p.UnicodeNormalizationForm.NFKC) : C.arrayify(e);}function M(e, t) {for (var r = e, n = t.toLowerCase().split("/"), i = 0; i < n.length; i++) {var o = null;for (var s in r) {if (s.toLowerCase() === n[i]) {o = r[s];break;}}if (null === o) return null;r = o;}return r;}r.decryptCrowdsale = function (e, t) {var r = JSON.parse(e);t = U(t);var n = b.getAddress(M(r, "ethaddr")),i = _(M(r, "encseed"));if (!i || i.length % 16 != 0) throw new Error("invalid encseed");var o = w.pbkdf2(t, t, 2e3, 32, "sha256").slice(0, 16),s = i.slice(0, 16),a = i.slice(16),u = new T.default.ModeOfOperation.cbc(o, s),l = C.arrayify(u.decrypt(a));l = T.default.padding.pkcs7.strip(l);for (var h = "", f = 0; f < l.length; f++) {h += String.fromCharCode(l[f]);}var c = p.toUtf8Bytes(h),d = new O.SigningKey(B.keccak256(c));if (d.address !== n) throw new Error("corrupt crowdsale wallet");return d;}, r.decrypt = function (e, t, d) {function p(e, t) {var r = _(M(v, "crypto/ciphertext"));if (C.hexlify(function (e, t) {return B.keccak256(C.concat([e, t]));}(e.slice(16, 32), r)).substring(2) !== M(v, "crypto/mac").toLowerCase()) return t(new Error("invalid password")), null;var n = function (e, t) {if ("aes-128-ctr" !== M(v, "crypto/cipher")) return null;var r = _(M(v, "crypto/cipherparams/iv")),n = new T.default.Counter(r),i = new T.default.ModeOfOperation.ctr(e, n);return C.arrayify(i.decrypt(t));}(e.slice(0, 16), r),i = e.slice(32, 64);if (!n) return t(new Error("unsupported cipher")), null;var o = new O.SigningKey(n);if (v.address && o.address !== b.getAddress(v.address)) return t(new Error("address mismatch")), null;if ("0.1" === M(v, "x-ethers/version")) {var s = _(M(v, "x-ethers/mnemonicCiphertext")),a = _(M(v, "x-ethers/mnemonicCounter")),u = new T.default.Counter(a),l = new T.default.ModeOfOperation.ctr(i, u),h = M(v, "x-ethers/path") || g.defaultPath,f = C.arrayify(l.decrypt(s)),c = g.entropyToMnemonic(f),d = g.fromMnemonic(c).derivePath(h);if (d.privateKey != C.hexlify(n)) return t(new Error("mnemonic mismatch")), null;o = new O.SigningKey(d);}return o;}var v = JSON.parse(e),y = U(t);return new Promise(function (i, o) {var e = M(v, "crypto/kdf");if (e && "string" == typeof e) {if ("scrypt" === e.toLowerCase()) {var t = _(M(v, "crypto/kdfparams/salt")),r = parseInt(M(v, "crypto/kdfparams/n")),n = parseInt(M(v, "crypto/kdfparams/r")),s = parseInt(M(v, "crypto/kdfparams/p"));if (!r || !n || !s) return void o(new Error("unsupported key-derivation function parameters"));if (0 != (r & r - 1)) return void o(new Error("unsupported key-derivation function parameter value for N"));if (32 !== (l = parseInt(M(v, "crypto/kdfparams/dklen")))) return void o(new Error("unsupported key-derivation derived-key length"));d && d(0), m.default(y, t, r, n, s, 64, function (e, t, r) {if (e) e.progress = t, o(e);else if (r) {r = C.arrayify(r);var n = p(r, o);if (!n) return;d && d(1), i(n);} else if (d) return d(t);});} else if ("pbkdf2" === e.toLowerCase()) {t = _(M(v, "crypto/kdfparams/salt"));var a = null,u = M(v, "crypto/kdfparams/prf");if ("hmac-sha256" === u) a = "sha256";else {if ("hmac-sha512" !== u) return void o(new Error("unsupported prf"));a = "sha512";}var l,h = parseInt(M(v, "crypto/kdfparams/c"));if (32 !== (l = parseInt(M(v, "crypto/kdfparams/dklen")))) return void o(new Error("unsupported key-derivation derived-key length"));var f = w.pbkdf2(y, t, h, l, a),c = p(f, o);if (!c) return;i(c);} else o(new Error("unsupported key-derivation function"));} else o(new Error("unsupported key-derivation function"));});}, r.encrypt = function (e, t, r, w) {"function" != typeof r || w || (w = r, r = {}), r = r || {};var _ = null;if (32 !== (_ = O.SigningKey.isSigningKey(e) ? C.arrayify(e.privateKey) : C.arrayify(e)).length) throw new Error("invalid private key");var n = U(t),M = null;if (r.entropy && (M = C.arrayify(r.entropy)), r.mnemonic) if (M) {if (g.entropyToMnemonic(M) !== r.mnemonic) throw new Error("entropy and mnemonic mismatch");} else M = C.arrayify(g.mnemonicToEntropy(r.mnemonic));var A = r.path;M && !A && (A = g.defaultPath);var E = r.client;E = E || "ethers.js";var S = null;S = r.salt ? C.arrayify(r.salt) : D.randomBytes(32);var k = null;if (r.iv) {if (16 !== (k = C.arrayify(r.iv)).length) throw new Error("invalid iv");} else k = D.randomBytes(16);var N = null;if (r.uuid) {if (16 !== (N = C.arrayify(r.uuid)).length) throw new Error("invalid uuid");} else N = D.randomBytes(16);var P = 1 << 17,x = 8,I = 1;return r.scrypt && (r.scrypt.N && (P = r.scrypt.N), r.scrypt.r && (x = r.scrypt.r), r.scrypt.p && (I = r.scrypt.p)), new Promise(function (g, b) {w && w(0), m.default(n, S, P, x, I, 64, function (e, t, r) {if (e) e.progress = t, b(e);else if (r) {var n = (r = C.arrayify(r)).slice(0, 16),i = r.slice(16, 32),o = r.slice(32, 64),s = new O.SigningKey(_).address,a = new T.default.Counter(k),u = new T.default.ModeOfOperation.ctr(n, a),l = C.arrayify(u.encrypt(_)),h = B.keccak256(C.concat([i, l])),f = { address: s.substring(2).toLowerCase(), id: R.default.v4({ random: N }), version: 3, Crypto: { cipher: "aes-128-ctr", cipherparams: { iv: C.hexlify(k).substring(2) }, ciphertext: C.hexlify(l).substring(2), kdf: "scrypt", kdfparams: { salt: C.hexlify(S).substring(2), n: P, dklen: 32, p: I, r: x }, mac: h.substring(2) } };if (M) {var c = D.randomBytes(16),d = new T.default.Counter(c),p = new T.default.ModeOfOperation.ctr(o, d),v = C.arrayify(p.encrypt(M)),y = new Date(),m = y.getUTCFullYear() + "-" + L(y.getUTCMonth() + 1, 2) + "-" + L(y.getUTCDate(), 2) + "T" + L(y.getUTCHours(), 2) + "-" + L(y.getUTCMinutes(), 2) + "-" + L(y.getUTCSeconds(), 2) + ".0Z";f["x-ethers"] = { client: E, gethFilename: "UTC--" + m + "--" + f.address, mnemonicCounter: C.hexlify(c).substring(2), mnemonicCiphertext: C.hexlify(v).substring(2), path: A, version: "0.1" };}w && w(1), g(JSON.stringify(f));} else if (w) return w(t);});});};}, { "./address": 59, "./bytes": 63, "./hdnode": 65, "./keccak256": 70, "./pbkdf2": 72, "./random-bytes": 74, "./signing-key": 80, "./utf8": 84, "aes-js": 8, "scrypt-js": 43, uuid: 47 }], 78: [function (e, t, r) {"use strict";var n = this && this.__importDefault || function (e) {return e && e.__esModule ? e : { default: e };};Object.defineProperty(r, "__esModule", { value: !0 });var i = n(e("hash.js")),o = e("./bytes");r.ripemd160 = function (e) {return "0x" + i.default.ripemd160().update(o.arrayify(e)).digest("hex");}, r.sha256 = function (e) {return "0x" + i.default.sha256().update(o.arrayify(e)).digest("hex");}, r.sha512 = function (e) {return "0x" + i.default.sha512().update(o.arrayify(e)).digest("hex");};}, { "./bytes": 63, "hash.js": 27 }], 79: [function (e, t, r) {"use strict";Object.defineProperty(r, "__esModule", { value: !0 }), e("setimmediate"), r.platform = "browser";}, { setimmediate: 44 }], 80: [function (e, t, r) {"use strict";var n = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });var i = e("./hdnode"),o = e("./bytes"),s = e("./properties"),a = e("./secp256k1"),u = n(e("../errors")),l = (h.prototype.signDigest = function (e) {return this.keyPair.sign(e);}, h.prototype.computeSharedSecret = function (e) {return this.keyPair.computeSharedSecret(o.arrayify(e));}, h.isSigningKey = function (e) {return s.isType(e, "SigningKey");}, h);function h(e) {u.checkNew(this, h);var t = null;t = i.HDNode.isHDNode(e) ? (s.defineReadOnly(this, "mnemonic", e.mnemonic), s.defineReadOnly(this, "path", e.path), o.arrayify(e.privateKey)) : ("string" == typeof e && e.match(/^[0-9a-f]*$/i) && 64 === e.length && (e = "0x" + e), o.arrayify(e));try {32 !== t.length && u.throwError("exactly 32 bytes required", u.INVALID_ARGUMENT, { arg: "privateKey", value: "[REDACTED]" });} catch (e) {var r = { arg: "privateKey", reason: e.reason, value: "[REDACTED]" };e.value && ("number" == typeof e.value.length && (r.length = e.value.length), r.type = typeof e.value), u.throwError("invalid private key", e.code, r);}s.defineReadOnly(this, "privateKey", o.hexlify(t)), s.defineReadOnly(this, "keyPair", new a.KeyPair(t)), s.defineReadOnly(this, "publicKey", this.keyPair.publicKey), s.defineReadOnly(this, "address", a.computeAddress(this.keyPair.publicKey)), s.setType(this, "SigningKey");}r.SigningKey = l;}, { "../errors": 5, "./bytes": 63, "./hdnode": 65, "./properties": 73, "./secp256k1": 76 }], 81: [function (e, t, r) {"use strict";Object.defineProperty(r, "__esModule", { value: !0 });var u = e("./bignumber"),l = e("./bytes"),h = e("./utf8"),n = e("./keccak256"),i = e("./sha2"),f = new RegExp("^bytes([0-9]+)$"),c = new RegExp("^(u?int)([0-9]*)$"),d = new RegExp("^(.*)\\[([0-9]*)\\]$"),p = "0000000000000000000000000000000000000000000000000000000000000000";function o(e, r) {if (e.length != r.length) throw new Error("type/value count mismatch");var n = [];return e.forEach(function (e, t) {n.push(function t(e, r, n) {switch (e) {case "address":return n ? l.padZeros(r, 32) : l.arrayify(r);case "string":return h.toUtf8Bytes(r);case "bytes":return l.arrayify(r);case "bool":return r = r ? "0x01" : "0x00", n ? l.padZeros(r, 32) : l.arrayify(r);}var i = e.match(c);if (i) {if ((o = parseInt(i[2] || "256")) % 8 != 0 || 0 === o || 256 < o) throw new Error("invalid number type - " + e);return n && (o = 256), r = u.bigNumberify(r).toTwos(o), l.padZeros(r, o / 8);}if (i = e.match(f)) {var o = parseInt(i[1]);if (String(o) != i[1] || 0 === o || 32 < o) throw new Error("invalid number type - " + e);if (l.arrayify(r).byteLength !== o) throw new Error("invalid value for " + e);return n ? l.arrayify((r + p).substring(0, 66)) : r;}if ((i = e.match(d)) && Array.isArray(r)) {var s = i[1];if (parseInt(i[2] || String(r.length)) != r.length) throw new Error("invalid value for " + e);var a = [];return r.forEach(function (e) {a.push(t(s, e, !0));}), l.concat(a);}throw new Error("unknown type - " + e);}(e, r[t]));}), l.hexlify(l.concat(n));}r.pack = o, r.keccak256 = function (e, t) {return n.keccak256(o(e, t));}, r.sha256 = function (e, t) {return i.sha256(o(e, t));};}, { "./bignumber": 62, "./bytes": 63, "./keccak256": 70, "./sha2": 78, "./utf8": 84 }], 82: [function (e, t, r) {"use strict";var n = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });var i = e("../constants"),s = n(e("../errors")),a = e("./secp256k1"),u = e("./address"),l = e("./bignumber"),h = e("./bytes"),f = e("./keccak256"),c = e("./properties"),d = n(e("./rlp")),o = e("../providers/abstract-provider");function p(e) {return "0x" === e ? i.Zero : l.bigNumberify(e);}var v = [{ name: "nonce", maxLength: 32 }, { name: "gasPrice", maxLength: 32 }, { name: "gasLimit", maxLength: 32 }, { name: "to", length: 20 }, { name: "value", maxLength: 32 }, { name: "data" }],y = { chainId: !0, data: !0, gasLimit: !0, gasPrice: !0, nonce: !0, to: !0, value: !0 };r.serialize = function (r, e) {c.checkProperties(r, y);var n = [];v.forEach(function (e) {var t = r[e.name] || [];t = h.arrayify(h.hexlify(t)), e.length && t.length !== e.length && 0 < t.length && s.throwError("invalid length for " + e.name, s.INVALID_ARGUMENT, { arg: "transaction" + e.name, value: t }), e.maxLength && (t = h.stripZeros(t)).length > e.maxLength && s.throwError("invalid length for " + e.name, s.INVALID_ARGUMENT, { arg: "transaction" + e.name, value: t }), n.push(h.hexlify(t));}), null != r.chainId && 0 !== r.chainId && (n.push(h.hexlify(r.chainId)), n.push("0x"), n.push("0x"));var t = d.encode(n);if (!e) return t;var i = h.splitSignature(e),o = 27 + i.recoveryParam;return 9 === n.length && (n.pop(), n.pop(), n.pop(), o += 2 * r.chainId + 8), n.push(h.hexlify(o)), n.push(h.stripZeros(h.arrayify(i.r))), n.push(h.stripZeros(h.arrayify(i.s))), d.encode(n);}, r.parse = function (e) {var t = d.decode(e);9 !== t.length && 6 !== t.length && s.throwError("invalid raw transaction", s.INVALID_ARGUMENT, { arg: "rawTransactin", value: e });var r = { nonce: p(t[0]).toNumber(), gasPrice: p(t[1]), gasLimit: p(t[2]), to: function (e) {return "0x" === e ? null : u.getAddress(e);}(t[3]), value: p(t[4]), data: t[5], chainId: 0 };if (6 === t.length) return r;try {r.v = l.bigNumberify(t[6]).toNumber();} catch (e) {return s.info(e), r;}if (r.r = h.hexZeroPad(t[7], 32), r.s = h.hexZeroPad(t[8], 32), l.bigNumberify(r.r).isZero() && l.bigNumberify(r.s).isZero()) r.chainId = r.v, r.v = 0;else {r.chainId = Math.floor((r.v - 35) / 2), r.chainId < 0 && (r.chainId = 0);var n = r.v - 27,i = t.slice(0, 6);0 !== r.chainId && (i.push(h.hexlify(r.chainId)), i.push("0x"), i.push("0x"), n -= 2 * r.chainId + 8);var o = f.keccak256(d.encode(i));try {r.from = a.recoverAddress(o, { r: h.hexlify(r.r), s: h.hexlify(r.s), recoveryParam: n });} catch (e) {s.info(e);}r.hash = f.keccak256(e);}return r;}, r.populateTransaction = function (e, t, r) {o.Provider.isProvider(t) || s.throwError("missing provider", s.INVALID_ARGUMENT, { argument: "provider", value: t }), c.checkProperties(e, y);var n = c.shallowCopy(e);if (null != n.to && (n.to = t.resolveName(n.to)), null == n.gasPrice && (n.gasPrice = t.getGasPrice()), null == n.nonce && (n.nonce = t.getTransactionCount(r)), null == n.gasLimit) {var i = c.shallowCopy(n);i.from = r, n.gasLimit = t.estimateGas(i);}return null == n.chainId && (n.chainId = t.getNetwork().then(function (e) {return e.chainId;})), c.resolveProperties(n);};}, { "../constants": 3, "../errors": 5, "../providers/abstract-provider": 49, "./address": 59, "./bignumber": 62, "./bytes": 63, "./keccak256": 70, "./properties": 73, "./rlp": 75, "./secp256k1": 76 }], 83: [function (e, t, r) {"use strict";var n = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });var i,h = e("../constants"),f = n(e("../errors")),c = e("./bignumber"),o = {};function s(e) {return { decimals: e.length - 1, tenPower: c.bigNumberify(e) };}function d(e) {var t = o[String(e).toLowerCase()];if (!t && "number" == typeof e && parseInt(String(e)) == e && 0 <= e && e <= 256) {for (var r = "1", n = 0; n < e; n++) {r += "0";}t = s(r);}return t || f.throwError("invalid unitType", f.INVALID_ARGUMENT, { argument: "name", value: e }), t;}function a(e, t) {var r = d(t),n = (e = c.bigNumberify(e)).lt(h.Zero);n && (e = e.mul(h.NegativeOne));for (var i = e.mod(r.tenPower).toString(); i.length < r.decimals;) {i = "0" + i;}return i = i.match(/^([0-9]*[1-9]|0)(0*)/)[1], e = e.div(r.tenPower).toString() + "." + i, n && (e = "-" + e), e;}function u(e, t) {null == t && (t = 18);var r = d(t);if ("string" == typeof e && e.match(/^-?[0-9.,]+$/) || f.throwError("invalid decimal value", f.INVALID_ARGUMENT, { arg: "value", value: e }), 0 === r.decimals) return c.bigNumberify(e);var n = "-" === e.substring(0, 1);n && (e = e.substring(1)), "." === e && f.throwError("missing value", f.INVALID_ARGUMENT, { arg: "value", value: e });var i = e.split(".");2 < i.length && f.throwError("too many decimal points", f.INVALID_ARGUMENT, { arg: "value", value: e });var o = i[0],s = i[1];for (o = o || "0", (s = s || "0").length > r.decimals && f.throwError("underflow occurred", f.NUMERIC_FAULT, { operation: "division", fault: "underflow" }); s.length < r.decimals;) {s += "0";}var a = c.bigNumberify(o),u = c.bigNumberify(s),l = a.mul(r.tenPower).add(u);return n && (l = l.mul(h.NegativeOne)), l;}i = "1", ["wei", "kwei", "Mwei", "Gwei", "szabo", "finney", "ether"].forEach(function (e) {var t = s(i);o[e.toLowerCase()] = t, o[String(t.decimals)] = t, i += "000";}), r.commify = function (e) {var t = String(e).split(".");(2 < t.length || !t[0].match(/^-?[0-9]*$/) || t[1] && !t[1].match(/^[0-9]*$/) || "." === e || "-." === e) && f.throwError("invalid value", f.INVALID_ARGUMENT, { argument: "value", value: e });var r = t[0],n = "";for ("-" === r.substring(0, 1) && (n = "-", r = r.substring(1)); "0" === r.substring(0, 1);) {r = r.substring(1);}"" === r && (r = "0");var i = "";2 === t.length && (i = "." + (t[1] || "0"));for (var o = []; r.length;) {if (r.length <= 3) {o.unshift(r);break;}var s = r.length - 3;o.unshift(r.substring(s)), r = r.substring(0, s);}return n + o.join(",") + i;}, r.formatUnits = a, r.parseUnits = u, r.formatEther = function (e) {return a(e, 18);}, r.parseEther = function (e) {return u(e, 18);};}, { "../constants": 3, "../errors": 5, "./bignumber": 62 }], 84: [function (e, t, r) {"use strict";Object.defineProperty(r, "__esModule", { value: !0 });var s,n,i = e("../constants"),a = e("../errors"),h = e("./bytes");function o(e, t) {void 0 === t && (t = s.current), t != s.current && (a.checkNormalize(), e = e.normalize(t));for (var r = [], n = 0; n < e.length; n++) {var i = e.charCodeAt(n);if (i < 128) r.push(i);else if (i < 2048) r.push(i >> 6 | 192), r.push(63 & i | 128);else if (55296 == (64512 & i)) {n++;var o = e.charCodeAt(n);if (n >= e.length || 56320 != (64512 & o)) throw new Error("invalid utf-8 string");i = 65536 + ((1023 & i) << 10) + (1023 & o), r.push(i >> 18 | 240), r.push(i >> 12 & 63 | 128), r.push(i >> 6 & 63 | 128), r.push(63 & i | 128);} else r.push(i >> 12 | 224), r.push(i >> 6 & 63 | 128), r.push(63 & i | 128);}return h.arrayify(r);}function u(e, t) {e = h.arrayify(e);for (var r = "", n = 0; n < e.length;) {var i = e[n++];if (i >> 7 != 0) {var o = null,s = null;if (192 == (224 & i)) o = 1, s = 127;else if (224 == (240 & i)) o = 2, s = 2047;else {if (240 != (248 & i)) {if (t) continue;if (128 == (192 & i)) throw new Error("invalid utf8 byte sequence; unexpected continuation byte");throw new Error("invalid utf8 byte sequence; invalid prefix");}o = 3, s = 65535;}if (n + o > e.length) {if (!t) throw new Error("invalid utf8 byte sequence; too short");for (; n < e.length && e[n] >> 6 == 2; n++) {;}} else {for (var a = i & (1 << 8 - o - 1) - 1, u = 0; u < o; u++) {var l = e[n];if (128 != (192 & l)) {a = null;break;}a = a << 6 | 63 & l, n++;}if (null !== a) {if (a <= s) {if (!t) throw new Error("invalid utf8 byte sequence; overlong");} else if (1114111 < a) {if (!t) throw new Error("invalid utf8 byte sequence; out-of-range");} else if (55296 <= a && a <= 57343) {if (!t) throw new Error("invalid utf8 byte sequence; utf-16 surrogate");} else a <= 65535 ? r += String.fromCharCode(a) : (a -= 65536, r += String.fromCharCode(55296 + (a >> 10 & 1023), 56320 + (1023 & a)));} else if (!t) throw new Error("invalid utf8 byte sequence; invalid continuation byte");}} else r += String.fromCharCode(i);}return r;}(n = s = r.UnicodeNormalizationForm || (r.UnicodeNormalizationForm = {})).current = "", n.NFC = "NFC", n.NFD = "NFD", n.NFKC = "NFKC", n.NFKD = "NFKD", r.toUtf8Bytes = o, r.toUtf8String = u, r.formatBytes32String = function (e) {var t = o(e);if (31 < t.length) throw new Error("bytes32 string must be less than 32 bytes");return h.hexlify(h.concat([t, i.HashZero]).slice(0, 32));}, r.parseBytes32String = function (e) {var t = h.arrayify(e);if (32 !== t.length) throw new Error("invalid bytes32 - not 32 bytes long");if (0 !== t[31]) throw new Error("invalid bytes32 string - no null terminator");for (var r = 31; 0 === t[r - 1];) {r--;}return u(t.slice(0, r));};}, { "../constants": 3, "../errors": 5, "./bytes": 63 }], 85: [function (e, t, r) {"use strict";var n = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });
      var f = {},i = e("./base64"),o = e("./properties"),s = e("./utf8"),c = n(e("../errors"));
      f.XMLHttpRequest = plus.net.XMLHttpRequest;
      r.fetchJson = function (e, a, u) {var r = {},l = null,h = 12e4;if ("string" == typeof e) l = e;else if ("object" == typeof e) {if (null == e.url && c.throwError("missing URL", c.MISSING_ARGUMENT, { arg: "url" }), l = e.url, "number" == typeof e.timeout && 0 < e.timeout && (h = e.timeout), e.headers) for (var t in e.headers) {r[t.toLowerCase()] = { key: t, value: String(e.headers[t]) };}if (null != e.user && null != e.password) {"https:" !== l.substring(0, 6) && !0 !== e.allowInsecure && c.throwError("basic authentication requires a secure https url", c.INVALID_ARGUMENT, { arg: "url", url: l, user: e.user, password: "[REDACTED]" });var n = e.user + ":" + e.password;r.authorization = { key: "Authorization", value: "Basic " + i.encode(s.toUtf8Bytes(n)) };}}return new Promise(function (n, i) {var o = new f.XMLHttpRequest(),e = null;e = setTimeout(function () {null != e && (e = null, i(new Error("timeout")), setTimeout(function () {o.abort();}, 0));}, h);function s() {null != e && (clearTimeout(e), e = null);}a ? (o.open("POST", l, !0), r["content-type"] = { key: "Content-Type", value: "application/json" }) : o.open("GET", l, !0), Object.keys(r).forEach(function (e) {var t = r[e];o.setRequestHeader(t.key, t.value);}), o.onreadystatechange = function () {if (4 === o.readyState) {if (200 != o.status) {s();var e = new Error("invalid response - " + o.status);return e.statusCode = o.status, o.responseText && (e.responseText = o.responseText), void i(e);}var t = null;try {t = JSON.parse(o.responseText);} catch (e) {s();var r = new Error("invalid json response");return r.orginialError = e, r.responseText = o.responseText, null != a && (r.requestBody = a), r.url = l, void i(r);}if (u) try {t = u(t);} catch (e) {return s(), e.url = l, e.body = a, e.responseText = o.responseText, void i(e);}s(), n(t);}}, o.onerror = function (e) {s(), i(e);};try {null != a ? o.send(a) : o.send();} catch (e) {s();var t = new Error("connection error");t.error = e, i(t);}});}, r.poll = function (u, l) {return l = l || {}, null == (l = o.shallowCopy(l)).floor && (l.floor = 0), null == l.ceiling && (l.ceiling = 1e4), null == l.interval && (l.interval = 250), new Promise(function (n, t) {var e = null,i = !1,o = function o() {return !i && (i = !0, e && clearTimeout(e), !0);};l.timeout && (e = setTimeout(function () {o() && t(new Error("timeout"));}, l.timeout));var s = l.fastRetry || null,a = 0;!function r() {return u().then(function (e) {if (void 0 !== e) o() && n(e);else if (l.onceBlock) l.onceBlock.once("block", r);else if (!i) {a++;var t = l.interval * parseInt(String(Math.random() * Math.pow(2, a)));t < l.floor && (t = l.floor), t > l.ceiling && (t = l.ceiling), s && (a--, t = s, s = null), setTimeout(r, t);}return null;}, function (e) {o() && t(e);});}();});};}, { "../errors": 5, "./base64": 60, "./properties": 73, "./utf8": 84, xmlhttprequest: 48 }], 86: [function (o, e, s) {(function (e) {"use strict";Object.defineProperty(s, "__esModule", { value: !0 });var i = o("../utils/hash"),t = o("../utils/properties");s.check = function (e) {for (var t = [], r = 0; r < 2048; r++) {var n = e.getWord(r);if (r !== e.getWordIndex(n)) return "0x";t.push(n);}return i.id(t.join("\n") + "\n");};var r = (n.prototype.split = function (e) {return e.toLowerCase().split(/ +/g);}, n.prototype.join = function (e) {return e.join(" ");}, n);function n(e) {t.defineReadOnly(this, "locale", e);}s.Wordlist = r, s.register = function (e, t) {t = t || e.locale;};}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});}, { "../utils/hash": 64, "../utils/properties": 73 }], 87: [function (e, t, r) {"use strict";var n,i = this && this.__extends || (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (e, t) {e.__proto__ = t;} || function (e, t) {for (var r in t) {t.hasOwnProperty(r) && (e[r] = t[r]);}}, function (e, t) {function r() {this.constructor = e;}n(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());}),o = this && this.__importStar || function (e) {if (e && e.__esModule) return e;var t = {};if (null != e) for (var r in e) {Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);}return t.default = e, t;};Object.defineProperty(r, "__esModule", { value: !0 });var s,a = e("./utils/bytes"),u = e("./utils/hash"),l = e("./utils/hdnode"),h = e("./utils/json-wallet"),f = e("./utils/keccak256"),c = e("./utils/properties"),d = e("./utils/random-bytes"),p = o(e("./utils/secret-storage")),v = e("./utils/signing-key"),y = e("./utils/transaction"),m = e("./abstract-signer"),g = e("./providers/abstract-provider"),b = o(e("./errors")),w = (s = m.Signer, i(_, s), Object.defineProperty(_.prototype, "address", { get: function get() {return this.signingKey.address;}, enumerable: !0, configurable: !0 }), Object.defineProperty(_.prototype, "mnemonic", { get: function get() {return this.signingKey.mnemonic;}, enumerable: !0, configurable: !0 }), Object.defineProperty(_.prototype, "path", { get: function get() {return this.signingKey.path;}, enumerable: !0, configurable: !0 }), Object.defineProperty(_.prototype, "privateKey", { get: function get() {return this.signingKey.privateKey;}, enumerable: !0, configurable: !0 }), _.prototype.connect = function (e) {return g.Provider.isProvider(e) || b.throwError("invalid provider", b.INVALID_ARGUMENT, { argument: "provider", value: e }), new _(this.signingKey, e);}, _.prototype.getAddress = function () {return Promise.resolve(this.address);}, _.prototype.sign = function (e) {var n = this;return c.resolveProperties(e).then(function (e) {var t = y.serialize(e),r = n.signingKey.signDigest(f.keccak256(t));return y.serialize(e, r);});}, _.prototype.signMessage = function (e) {return Promise.resolve(a.joinSignature(this.signingKey.signDigest(u.hashMessage(e))));}, _.prototype.getBalance = function (e) {if (!this.provider) throw new Error("missing provider");return this.provider.getBalance(this.address, e);}, _.prototype.getTransactionCount = function (e) {if (!this.provider) throw new Error("missing provider");return this.provider.getTransactionCount(this.address, e);}, _.prototype.sendTransaction = function (e) {var t = this;if (!this.provider) throw new Error("missing provider");return null == e.nonce && ((e = c.shallowCopy(e)).nonce = this.getTransactionCount("pending")), y.populateTransaction(e, this.provider, this.address).then(function (e) {return t.sign(e).then(function (e) {return t.provider.sendTransaction(e);});});}, _.prototype.encrypt = function (e, t, r) {if ("function" != typeof t || r || (r = t, t = {}), r && "function" != typeof r) throw new Error("invalid callback");return t = t || {}, this.mnemonic && ((t = c.shallowCopy(t)).mnemonic = this.mnemonic, t.path = this.path), p.encrypt(this.privateKey, e, t, r);}, _.createRandom = function (e) {var t = d.randomBytes(16);(e = e || {}).extraEntropy && (t = a.arrayify(f.keccak256(a.concat([t, e.extraEntropy])).substring(0, 34)));var r = l.entropyToMnemonic(t, e.locale);return _.fromMnemonic(r, e.path, e.locale);}, _.fromEncryptedJson = function (e, t, r) {if (h.isCrowdsaleWallet(e)) try {r && r(0);var n = p.decryptCrowdsale(e, t);return r && r(1), Promise.resolve(new _(n));} catch (e) {return Promise.reject(e);} else if (h.isSecretStorageWallet(e)) return p.decrypt(e, t, r).then(function (e) {return new _(e);});return Promise.reject("invalid wallet JSON");}, _.fromMnemonic = function (e, t, r) {return t = t || l.defaultPath, new _(l.fromMnemonic(e, r).derivePath(t));}, _);function _(e, t) {var r = s.call(this) || this;return b.checkNew(r, _), v.SigningKey.isSigningKey(e) ? c.defineReadOnly(r, "signingKey", e) : c.defineReadOnly(r, "signingKey", new v.SigningKey(e)), c.defineReadOnly(r, "provider", t), r;}r.Wallet = w;}, { "./abstract-signer": 2, "./errors": 5, "./providers/abstract-provider": 49, "./utils/bytes": 63, "./utils/hash": 64, "./utils/hdnode": 65, "./utils/json-wallet": 69, "./utils/keccak256": 70, "./utils/properties": 73, "./utils/random-bytes": 74, "./utils/secret-storage": 77, "./utils/signing-key": 80, "./utils/transaction": 82 }], 88: [function (e, t, r) {"use strict";Object.defineProperty(r, "__esModule", { value: !0 });var n = e("../wordlists/lang-en").langEn;r.en = n;}, { "../wordlists/lang-en": 89 }], 89: [function (e, t, r) {"use strict";var n,i = this && this.__extends || (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (e, t) {e.__proto__ = t;} || function (e, t) {for (var r in t) {t.hasOwnProperty(r) && (e[r] = t[r]);}}, function (e, t) {function r() {this.constructor = e;}n(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());});Object.defineProperty(r, "__esModule", { value: !0 });var o,s = e("../utils/wordlist"),a = "AbandonAbilityAbleAboutAboveAbsentAbsorbAbstractAbsurdAbuseAccessAccidentAccountAccuseAchieveAcidAcousticAcquireAcrossActActionActorActressActualAdaptAddAddictAddressAdjustAdmitAdultAdvanceAdviceAerobicAffairAffordAfraidAgainAgeAgentAgreeAheadAimAirAirportAisleAlarmAlbumAlcoholAlertAlienAllAlleyAllowAlmostAloneAlphaAlreadyAlsoAlterAlwaysAmateurAmazingAmongAmountAmusedAnalystAnchorAncientAngerAngleAngryAnimalAnkleAnnounceAnnualAnotherAnswerAntennaAntiqueAnxietyAnyApartApologyAppearAppleApproveAprilArchArcticAreaArenaArgueArmArmedArmorArmyAroundArrangeArrestArriveArrowArtArtefactArtistArtworkAskAspectAssaultAssetAssistAssumeAsthmaAthleteAtomAttackAttendAttitudeAttractAuctionAuditAugustAuntAuthorAutoAutumnAverageAvocadoAvoidAwakeAwareAwayAwesomeAwfulAwkwardAxisBabyBachelorBaconBadgeBagBalanceBalconyBallBambooBananaBannerBarBarelyBargainBarrelBaseBasicBasketBattleBeachBeanBeautyBecauseBecomeBeefBeforeBeginBehaveBehindBelieveBelowBeltBenchBenefitBestBetrayBetterBetweenBeyondBicycleBidBikeBindBiologyBirdBirthBitterBlackBladeBlameBlanketBlastBleakBlessBlindBloodBlossomBlouseBlueBlurBlushBoardBoatBodyBoilBombBoneBonusBookBoostBorderBoringBorrowBossBottomBounceBoxBoyBracketBrainBrandBrassBraveBreadBreezeBrickBridgeBriefBrightBringBriskBroccoliBrokenBronzeBroomBrotherBrownBrushBubbleBuddyBudgetBuffaloBuildBulbBulkBulletBundleBunkerBurdenBurgerBurstBusBusinessBusyButterBuyerBuzzCabbageCabinCableCactusCageCakeCallCalmCameraCampCanCanalCancelCandyCannonCanoeCanvasCanyonCapableCapitalCaptainCarCarbonCardCargoCarpetCarryCartCaseCashCasinoCastleCasualCatCatalogCatchCategoryCattleCaughtCauseCautionCaveCeilingCeleryCementCensusCenturyCerealCertainChairChalkChampionChangeChaosChapterChargeChaseChatCheapCheckCheeseChefCherryChestChickenChiefChildChimneyChoiceChooseChronicChuckleChunkChurnCigarCinnamonCircleCitizenCityCivilClaimClapClarifyClawClayCleanClerkCleverClickClientCliffClimbClinicClipClockClogCloseClothCloudClownClubClumpClusterClutchCoachCoastCoconutCodeCoffeeCoilCoinCollectColorColumnCombineComeComfortComicCommonCompanyConcertConductConfirmCongressConnectConsiderControlConvinceCookCoolCopperCopyCoralCoreCornCorrectCostCottonCouchCountryCoupleCourseCousinCoverCoyoteCrackCradleCraftCramCraneCrashCraterCrawlCrazyCreamCreditCreekCrewCricketCrimeCrispCriticCropCrossCrouchCrowdCrucialCruelCruiseCrumbleCrunchCrushCryCrystalCubeCultureCupCupboardCuriousCurrentCurtainCurveCushionCustomCuteCycleDadDamageDampDanceDangerDaringDashDaughterDawnDayDealDebateDebrisDecadeDecemberDecideDeclineDecorateDecreaseDeerDefenseDefineDefyDegreeDelayDeliverDemandDemiseDenialDentistDenyDepartDependDepositDepthDeputyDeriveDescribeDesertDesignDeskDespairDestroyDetailDetectDevelopDeviceDevoteDiagramDialDiamondDiaryDiceDieselDietDifferDigitalDignityDilemmaDinnerDinosaurDirectDirtDisagreeDiscoverDiseaseDishDismissDisorderDisplayDistanceDivertDivideDivorceDizzyDoctorDocumentDogDollDolphinDomainDonateDonkeyDonorDoorDoseDoubleDoveDraftDragonDramaDrasticDrawDreamDressDriftDrillDrinkDripDriveDropDrumDryDuckDumbDuneDuringDustDutchDutyDwarfDynamicEagerEagleEarlyEarnEarthEasilyEastEasyEchoEcologyEconomyEdgeEditEducateEffortEggEightEitherElbowElderElectricElegantElementElephantElevatorEliteElseEmbarkEmbodyEmbraceEmergeEmotionEmployEmpowerEmptyEnableEnactEndEndlessEndorseEnemyEnergyEnforceEngageEngineEnhanceEnjoyEnlistEnoughEnrichEnrollEnsureEnterEntireEntryEnvelopeEpisodeEqualEquipEraEraseErodeErosionErrorEruptEscapeEssayEssenceEstateEternalEthicsEvidenceEvilEvokeEvolveExactExampleExcessExchangeExciteExcludeExcuseExecuteExerciseExhaustExhibitExileExistExitExoticExpandExpectExpireExplainExposeExpressExtendExtraEyeEyebrowFabricFaceFacultyFadeFaintFaithFallFalseFameFamilyFamousFanFancyFantasyFarmFashionFatFatalFatherFatigueFaultFavoriteFeatureFebruaryFederalFeeFeedFeelFemaleFenceFestivalFetchFeverFewFiberFictionFieldFigureFileFilmFilterFinalFindFineFingerFinishFireFirmFirstFiscalFishFitFitnessFixFlagFlameFlashFlatFlavorFleeFlightFlipFloatFlockFloorFlowerFluidFlushFlyFoamFocusFogFoilFoldFollowFoodFootForceForestForgetForkFortuneForumForwardFossilFosterFoundFoxFragileFrameFrequentFreshFriendFringeFrogFrontFrostFrownFrozenFruitFuelFunFunnyFurnaceFuryFutureGadgetGainGalaxyGalleryGameGapGarageGarbageGardenGarlicGarmentGasGaspGateGatherGaugeGazeGeneralGeniusGenreGentleGenuineGestureGhostGiantGiftGiggleGingerGiraffeGirlGiveGladGlanceGlareGlassGlideGlimpseGlobeGloomGloryGloveGlowGlueGoatGoddessGoldGoodGooseGorillaGospelGossipGovernGownGrabGraceGrainGrantGrapeGrassGravityGreatGreenGridGriefGritGroceryGroupGrowGruntGuardGuessGuideGuiltGuitarGunGymHabitHairHalfHammerHamsterHandHappyHarborHardHarshHarvestHatHaveHawkHazardHeadHealthHeartHeavyHedgehogHeightHelloHelmetHelpHenHeroHiddenHighHillHintHipHireHistoryHobbyHockeyHoldHoleHolidayHollowHomeHoneyHoodHopeHornHorrorHorseHospitalHostHotelHourHoverHubHugeHumanHumbleHumorHundredHungryHuntHurdleHurryHurtHusbandHybridIceIconIdeaIdentifyIdleIgnoreIllIllegalIllnessImageImitateImmenseImmuneImpactImposeImproveImpulseInchIncludeIncomeIncreaseIndexIndicateIndoorIndustryInfantInflictInformInhaleInheritInitialInjectInjuryInmateInnerInnocentInputInquiryInsaneInsectInsideInspireInstallIntactInterestIntoInvestInviteInvolveIronIslandIsolateIssueItemIvoryJacketJaguarJarJazzJealousJeansJellyJewelJobJoinJokeJourneyJoyJudgeJuiceJumpJungleJuniorJunkJustKangarooKeenKeepKetchupKeyKickKidKidneyKindKingdomKissKitKitchenKiteKittenKiwiKneeKnifeKnockKnowLabLabelLaborLadderLadyLakeLampLanguageLaptopLargeLaterLatinLaughLaundryLavaLawLawnLawsuitLayerLazyLeaderLeafLearnLeaveLectureLeftLegLegalLegendLeisureLemonLendLengthLensLeopardLessonLetterLevelLiarLibertyLibraryLicenseLifeLiftLightLikeLimbLimitLinkLionLiquidListLittleLiveLizardLoadLoanLobsterLocalLockLogicLonelyLongLoopLotteryLoudLoungeLoveLoyalLuckyLuggageLumberLunarLunchLuxuryLyricsMachineMadMagicMagnetMaidMailMainMajorMakeMammalManManageMandateMangoMansionManualMapleMarbleMarchMarginMarineMarketMarriageMaskMassMasterMatchMaterialMathMatrixMatterMaximumMazeMeadowMeanMeasureMeatMechanicMedalMediaMelodyMeltMemberMemoryMentionMenuMercyMergeMeritMerryMeshMessageMetalMethodMiddleMidnightMilkMillionMimicMindMinimumMinorMinuteMiracleMirrorMiseryMissMistakeMixMixedMixtureMobileModelModifyMomMomentMonitorMonkeyMonsterMonthMoonMoralMoreMorningMosquitoMotherMotionMotorMountainMouseMoveMovieMuchMuffinMuleMultiplyMuscleMuseumMushroomMusicMustMutualMyselfMysteryMythNaiveNameNapkinNarrowNastyNationNatureNearNeckNeedNegativeNeglectNeitherNephewNerveNestNetNetworkNeutralNeverNewsNextNiceNightNobleNoiseNomineeNoodleNormalNorthNoseNotableNoteNothingNoticeNovelNowNuclearNumberNurseNutOakObeyObjectObligeObscureObserveObtainObviousOccurOceanOctoberOdorOffOfferOfficeOftenOilOkayOldOliveOlympicOmitOnceOneOnionOnlineOnlyOpenOperaOpinionOpposeOptionOrangeOrbitOrchardOrderOrdinaryOrganOrientOriginalOrphanOstrichOtherOutdoorOuterOutputOutsideOvalOvenOverOwnOwnerOxygenOysterOzonePactPaddlePagePairPalacePalmPandaPanelPanicPantherPaperParadeParentParkParrotPartyPassPatchPathPatientPatrolPatternPausePavePaymentPeacePeanutPearPeasantPelicanPenPenaltyPencilPeoplePepperPerfectPermitPersonPetPhonePhotoPhrasePhysicalPianoPicnicPicturePiecePigPigeonPillPilotPinkPioneerPipePistolPitchPizzaPlacePlanetPlasticPlatePlayPleasePledgePluckPlugPlungePoemPoetPointPolarPolePolicePondPonyPoolPopularPortionPositionPossiblePostPotatoPotteryPovertyPowderPowerPracticePraisePredictPreferPreparePresentPrettyPreventPricePridePrimaryPrintPriorityPrisonPrivatePrizeProblemProcessProduceProfitProgramProjectPromoteProofPropertyProsperProtectProudProvidePublicPuddingPullPulpPulsePumpkinPunchPupilPuppyPurchasePurityPurposePursePushPutPuzzlePyramidQualityQuantumQuarterQuestionQuickQuitQuizQuoteRabbitRaccoonRaceRackRadarRadioRailRainRaiseRallyRampRanchRandomRangeRapidRareRateRatherRavenRawRazorReadyRealReasonRebelRebuildRecallReceiveRecipeRecordRecycleReduceReflectReformRefuseRegionRegretRegularRejectRelaxReleaseReliefRelyRemainRememberRemindRemoveRenderRenewRentReopenRepairRepeatReplaceReportRequireRescueResembleResistResourceResponseResultRetireRetreatReturnReunionRevealReviewRewardRhythmRibRibbonRiceRichRideRidgeRifleRightRigidRingRiotRippleRiskRitualRivalRiverRoadRoastRobotRobustRocketRomanceRoofRookieRoomRoseRotateRoughRoundRouteRoyalRubberRudeRugRuleRunRunwayRuralSadSaddleSadnessSafeSailSaladSalmonSalonSaltSaluteSameSampleSandSatisfySatoshiSauceSausageSaveSayScaleScanScareScatterSceneSchemeSchoolScienceScissorsScorpionScoutScrapScreenScriptScrubSeaSearchSeasonSeatSecondSecretSectionSecuritySeedSeekSegmentSelectSellSeminarSeniorSenseSentenceSeriesServiceSessionSettleSetupSevenShadowShaftShallowShareShedShellSheriffShieldShiftShineShipShiverShockShoeShootShopShortShoulderShoveShrimpShrugShuffleShySiblingSickSideSiegeSightSignSilentSilkSillySilverSimilarSimpleSinceSingSirenSisterSituateSixSizeSkateSketchSkiSkillSkinSkirtSkullSlabSlamSleepSlenderSliceSlideSlightSlimSloganSlotSlowSlushSmallSmartSmileSmokeSmoothSnackSnakeSnapSniffSnowSoapSoccerSocialSockSodaSoftSolarSoldierSolidSolutionSolveSomeoneSongSoonSorrySortSoulSoundSoupSourceSouthSpaceSpareSpatialSpawnSpeakSpecialSpeedSpellSpendSphereSpiceSpiderSpikeSpinSpiritSplitSpoilSponsorSpoonSportSpotSpraySpreadSpringSpySquareSqueezeSquirrelStableStadiumStaffStageStairsStampStandStartStateStaySteakSteelStemStepStereoStickStillStingStockStomachStoneStoolStoryStoveStrategyStreetStrikeStrongStruggleStudentStuffStumbleStyleSubjectSubmitSubwaySuccessSuchSuddenSufferSugarSuggestSuitSummerSunSunnySunsetSuperSupplySupremeSureSurfaceSurgeSurpriseSurroundSurveySuspectSustainSwallowSwampSwapSwarmSwearSweetSwiftSwimSwingSwitchSwordSymbolSymptomSyrupSystemTableTackleTagTailTalentTalkTankTapeTargetTaskTasteTattooTaxiTeachTeamTellTenTenantTennisTentTermTestTextThankThatThemeThenTheoryThereTheyThingThisThoughtThreeThriveThrowThumbThunderTicketTideTigerTiltTimberTimeTinyTipTiredTissueTitleToastTobaccoTodayToddlerToeTogetherToiletTokenTomatoTomorrowToneTongueTonightToolToothTopTopicToppleTorchTornadoTortoiseTossTotalTouristTowardTowerTownToyTrackTradeTrafficTragicTrainTransferTrapTrashTravelTrayTreatTreeTrendTrialTribeTrickTriggerTrimTripTrophyTroubleTruckTrueTrulyTrumpetTrustTruthTryTubeTuitionTumbleTunaTunnelTurkeyTurnTurtleTwelveTwentyTwiceTwinTwistTwoTypeTypicalUglyUmbrellaUnableUnawareUncleUncoverUnderUndoUnfairUnfoldUnhappyUniformUniqueUnitUniverseUnknownUnlockUntilUnusualUnveilUpdateUpgradeUpholdUponUpperUpsetUrbanUrgeUsageUseUsedUsefulUselessUsualUtilityVacantVacuumVagueValidValleyValveVanVanishVaporVariousVastVaultVehicleVelvetVendorVentureVenueVerbVerifyVersionVeryVesselVeteranViableVibrantViciousVictoryVideoViewVillageVintageViolinVirtualVirusVisaVisitVisualVitalVividVocalVoiceVoidVolcanoVolumeVoteVoyageWageWagonWaitWalkWallWalnutWantWarfareWarmWarriorWashWaspWasteWaterWaveWayWealthWeaponWearWeaselWeatherWebWeddingWeekendWeirdWelcomeWestWetWhaleWhatWheatWheelWhenWhereWhipWhisperWideWidthWifeWildWillWinWindowWineWingWinkWinnerWinterWireWisdomWiseWishWitnessWolfWomanWonderWoodWoolWordWorkWorldWorryWorthWrapWreckWrestleWristWriteWrongYardYearYellowYouYoungYouthZebraZeroZoneZoo",u = null;function l(e) {if (null == u && (u = a.replace(/([A-Z])/g, " $1").toLowerCase().substring(1).split(" "), "0x3c8acc1e7b08d8e76f9fda015ef48dc8c710a73cb7e0f77b2c18a9b5a7adde60" !== s.check(e))) throw u = null, new Error("BIP39 Wordlist for en (English) FAILED");}function h() {return o.call(this, "en") || this;}var f = new (o = s.Wordlist, i(h, o), h.prototype.getWord = function (e) {return l(this), u[e];}, h.prototype.getWordIndex = function (e) {return l(this), u.indexOf(e);}, h)();r.langEn = f, s.register(f);}, { "../utils/wordlist": 86 }] }, {}, [7])(7);});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../Downloads/HBuilderX/plugins/uniapp-cli/node_modules/webpack/buildin/global.js */ 3)))

/***/ }),

/***/ 262:
/*!*********************************************************!*\
  !*** C:/Users/Admin/Desktop/evc.app/common/wxqrcode.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 //---------------------------------------------------------------------
//
// QR Code Generator for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: [url=http://www.d-project.com/]http://www.d-project.com/[/url]
//
// Licensed under the MIT license:
//        [url=http://www.opensource.org/licenses/mit-license.php]http://www.opensource.org/licenses/mit-license.php[/url]
//
// The word 'QR Code' is registered trademark of
// DENSO WAVE INCORPORATED
//        [url=http://www.denso-wave.com/qrcode/faqpatent-e.html]http://www.denso-wave.com/qrcode/faqpatent-e.html[/url]
//
//---------------------------------------------------------------------

//---------------------------------------------------------------------
// qrcode
//代码第1588行为补充代码
//修改人：chenxing
//2017-02-27 16:21:32
//---------------------------------------------------------------------

/**
 * qrcode
 * @param typeNumber 1 to 40
 * @param errorCorrectLevel 'L','M','Q','H'
 */
var qrcode = function qrcode(typeNumber, errorCorrectLevel) {

  var PAD0 = 0xEC;
  var PAD1 = 0x11;

  var _typeNumber = typeNumber;
  var _errorCorrectLevel = QRErrorCorrectLevel[errorCorrectLevel];
  var _modules = null;
  var _moduleCount = 0;
  var _dataCache = null;
  var _dataList = new Array();

  var _this = {};

  var makeImpl = function makeImpl(test, maskPattern) {

    _moduleCount = _typeNumber * 4 + 17;
    _modules = function (moduleCount) {
      var modules = new Array(moduleCount);
      for (var row = 0; row < moduleCount; row += 1) {
        modules[row] = new Array(moduleCount);
        for (var col = 0; col < moduleCount; col += 1) {
          modules[row][col] = null;
        }
      }
      return modules;
    }(_moduleCount);

    setupPositionProbePattern(0, 0);
    setupPositionProbePattern(_moduleCount - 7, 0);
    setupPositionProbePattern(0, _moduleCount - 7);
    setupPositionAdjustPattern();
    setupTimingPattern();
    setupTypeInfo(test, maskPattern);

    if (_typeNumber >= 7) {
      setupTypeNumber(test);
    }

    if (_dataCache == null) {
      _dataCache = createData(_typeNumber, _errorCorrectLevel, _dataList);
    }

    mapData(_dataCache, maskPattern);
  };

  var setupPositionProbePattern = function setupPositionProbePattern(row, col) {

    for (var r = -1; r <= 7; r += 1) {

      if (row + r <= -1 || _moduleCount <= row + r) continue;

      for (var c = -1; c <= 7; c += 1) {

        if (col + c <= -1 || _moduleCount <= col + c) continue;

        if (0 <= r && r <= 6 && (c == 0 || c == 6) ||
        0 <= c && c <= 6 && (r == 0 || r == 6) ||
        2 <= r && r <= 4 && 2 <= c && c <= 4) {
          _modules[row + r][col + c] = true;
        } else {
          _modules[row + r][col + c] = false;
        }
      }
    }
  };

  var getBestMaskPattern = function getBestMaskPattern() {

    var minLostPoint = 0;
    var pattern = 0;

    for (var i = 0; i < 8; i += 1) {

      makeImpl(true, i);

      var lostPoint = QRUtil.getLostPoint(_this);

      if (i == 0 || minLostPoint > lostPoint) {
        minLostPoint = lostPoint;
        pattern = i;
      }
    }

    return pattern;
  };

  var setupTimingPattern = function setupTimingPattern() {

    for (var r = 8; r < _moduleCount - 8; r += 1) {
      if (_modules[r][6] != null) {
        continue;
      }
      _modules[r][6] = r % 2 == 0;
    }

    for (var c = 8; c < _moduleCount - 8; c += 1) {
      if (_modules[6][c] != null) {
        continue;
      }
      _modules[6][c] = c % 2 == 0;
    }
  };

  var setupPositionAdjustPattern = function setupPositionAdjustPattern() {

    var pos = QRUtil.getPatternPosition(_typeNumber);

    for (var i = 0; i < pos.length; i += 1) {

      for (var j = 0; j < pos.length; j += 1) {

        var row = pos[i];
        var col = pos[j];

        if (_modules[row][col] != null) {
          continue;
        }

        for (var r = -2; r <= 2; r += 1) {

          for (var c = -2; c <= 2; c += 1) {

            if (r == -2 || r == 2 || c == -2 || c == 2 ||
            r == 0 && c == 0) {
              _modules[row + r][col + c] = true;
            } else {
              _modules[row + r][col + c] = false;
            }
          }
        }
      }
    }
  };

  var setupTypeNumber = function setupTypeNumber(test) {

    var bits = QRUtil.getBCHTypeNumber(_typeNumber);

    for (var i = 0; i < 18; i += 1) {
      var mod = !test && (bits >> i & 1) == 1;
      _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
    }

    for (var i = 0; i < 18; i += 1) {
      var mod = !test && (bits >> i & 1) == 1;
      _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
    }
  };

  var setupTypeInfo = function setupTypeInfo(test, maskPattern) {

    var data = _errorCorrectLevel << 3 | maskPattern;
    var bits = QRUtil.getBCHTypeInfo(data);

    // vertical
    for (var i = 0; i < 15; i += 1) {

      var mod = !test && (bits >> i & 1) == 1;

      if (i < 6) {
        _modules[i][8] = mod;
      } else if (i < 8) {
        _modules[i + 1][8] = mod;
      } else {
        _modules[_moduleCount - 15 + i][8] = mod;
      }
    }

    // horizontal
    for (var i = 0; i < 15; i += 1) {

      var mod = !test && (bits >> i & 1) == 1;

      if (i < 8) {
        _modules[8][_moduleCount - i - 1] = mod;
      } else if (i < 9) {
        _modules[8][15 - i - 1 + 1] = mod;
      } else {
        _modules[8][15 - i - 1] = mod;
      }
    }

    // fixed module
    _modules[_moduleCount - 8][8] = !test;
  };

  var mapData = function mapData(data, maskPattern) {

    var inc = -1;
    var row = _moduleCount - 1;
    var bitIndex = 7;
    var byteIndex = 0;
    var maskFunc = QRUtil.getMaskFunction(maskPattern);

    for (var col = _moduleCount - 1; col > 0; col -= 2) {

      if (col == 6) col -= 1;

      while (true) {

        for (var c = 0; c < 2; c += 1) {

          if (_modules[row][col - c] == null) {

            var dark = false;

            if (byteIndex < data.length) {
              dark = (data[byteIndex] >>> bitIndex & 1) == 1;
            }

            var mask = maskFunc(row, col - c);

            if (mask) {
              dark = !dark;
            }

            _modules[row][col - c] = dark;
            bitIndex -= 1;

            if (bitIndex == -1) {
              byteIndex += 1;
              bitIndex = 7;
            }
          }
        }

        row += inc;

        if (row < 0 || _moduleCount <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }
  };

  var createBytes = function createBytes(buffer, rsBlocks) {

    var offset = 0;

    var maxDcCount = 0;
    var maxEcCount = 0;

    var dcdata = new Array(rsBlocks.length);
    var ecdata = new Array(rsBlocks.length);

    for (var r = 0; r < rsBlocks.length; r += 1) {

      var dcCount = rsBlocks[r].dataCount;
      var ecCount = rsBlocks[r].totalCount - dcCount;

      maxDcCount = Math.max(maxDcCount, dcCount);
      maxEcCount = Math.max(maxEcCount, ecCount);

      dcdata[r] = new Array(dcCount);

      for (var i = 0; i < dcdata[r].length; i += 1) {
        dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
      }
      offset += dcCount;

      var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
      var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);

      var modPoly = rawPoly.mod(rsPoly);
      ecdata[r] = new Array(rsPoly.getLength() - 1);
      for (var i = 0; i < ecdata[r].length; i += 1) {
        var modIndex = i + modPoly.getLength() - ecdata[r].length;
        ecdata[r][i] = modIndex >= 0 ? modPoly.getAt(modIndex) : 0;
      }
    }

    var totalCodeCount = 0;
    for (var i = 0; i < rsBlocks.length; i += 1) {
      totalCodeCount += rsBlocks[i].totalCount;
    }

    var data = new Array(totalCodeCount);
    var index = 0;

    for (var i = 0; i < maxDcCount; i += 1) {
      for (var r = 0; r < rsBlocks.length; r += 1) {
        if (i < dcdata[r].length) {
          data[index] = dcdata[r][i];
          index += 1;
        }
      }
    }

    for (var i = 0; i < maxEcCount; i += 1) {
      for (var r = 0; r < rsBlocks.length; r += 1) {
        if (i < ecdata[r].length) {
          data[index] = ecdata[r][i];
          index += 1;
        }
      }
    }

    return data;
  };

  var createData = function createData(typeNumber, errorCorrectLevel, dataList) {

    var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);

    var buffer = qrBitBuffer();

    for (var i = 0; i < dataList.length; i += 1) {
      var data = dataList[i];
      buffer.put(data.getMode(), 4);
      buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber));
      data.write(buffer);
    }

    // calc num max data.
    var totalDataCount = 0;
    for (var i = 0; i < rsBlocks.length; i += 1) {
      totalDataCount += rsBlocks[i].dataCount;
    }

    if (buffer.getLengthInBits() > totalDataCount * 8) {
      throw new Error('code length overflow. (' +
      buffer.getLengthInBits() +
      '>' +
      totalDataCount * 8 +
      ')');
    }

    // end code
    if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
      buffer.put(0, 4);
    }

    // padding
    while (buffer.getLengthInBits() % 8 != 0) {
      buffer.putBit(false);
    }

    // padding
    while (true) {

      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(PAD0, 8);

      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(PAD1, 8);
    }

    return createBytes(buffer, rsBlocks);
  };

  _this.addData = function (data) {
    var newData = qr8BitByte(data);
    _dataList.push(newData);
    _dataCache = null;
  };

  _this.isDark = function (row, col) {
    if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
      throw new Error(row + ',' + col);
    }
    return _modules[row][col];
  };

  _this.getModuleCount = function () {
    return _moduleCount;
  };

  _this.make = function () {
    makeImpl(false, getBestMaskPattern());
  };

  _this.createTableTag = function (cellSize, margin) {

    cellSize = cellSize || 2;
    margin = typeof margin == 'undefined' ? cellSize * 4 : margin;

    var qrHtml = '';

    qrHtml += '<table style="';
    qrHtml += ' border-width: 0px; border-style: none;';
    qrHtml += ' border-collapse: collapse;';
    qrHtml += ' padding: 0px; margin: ' + margin + 'px;';
    qrHtml += '">';
    qrHtml += '<tbody>';

    for (var r = 0; r < _this.getModuleCount(); r += 1) {

      qrHtml += '<tr>';

      for (var c = 0; c < _this.getModuleCount(); c += 1) {
        qrHtml += '<td style="';
        qrHtml += ' border-width: 0px; border-style: none;';
        qrHtml += ' border-collapse: collapse;';
        qrHtml += ' padding: 0px; margin: 0px;';
        qrHtml += ' width: ' + cellSize + 'px;';
        qrHtml += ' height: ' + cellSize + 'px;';
        qrHtml += ' background-color: ';
        qrHtml += _this.isDark(r, c) ? '#000000' : '#ffffff';
        qrHtml += ';';
        qrHtml += '"/>';
      }

      qrHtml += '</tr>';
    }

    qrHtml += '</tbody>';
    qrHtml += '</table>';

    return qrHtml;
  };

  _this.createImgTag = function (cellSize, margin, size) {

    cellSize = cellSize || 2;
    margin = typeof margin == 'undefined' ? cellSize * 4 : margin;

    var min = margin;
    var max = _this.getModuleCount() * cellSize + margin;

    return createImgTag(size, size, function (x, y) {
      if (min <= x && x < max && min <= y && y < max) {
        var c = Math.floor((x - min) / cellSize);
        var r = Math.floor((y - min) / cellSize);
        return _this.isDark(r, c) ? 0 : 1;
      } else {
        return 1;
      }
    });
  };

  return _this;
};

//---------------------------------------------------------------------
// qrcode.stringToBytes
//---------------------------------------------------------------------

qrcode.stringToBytes = function (s) {
  var bytes = new Array();
  for (var i = 0; i < s.length; i += 1) {
    var c = s.charCodeAt(i);
    bytes.push(c & 0xff);
  }
  return bytes;
};

//---------------------------------------------------------------------
// qrcode.createStringToBytes
//---------------------------------------------------------------------

/**
 * @param unicodeData base64 string of byte array.
 * [16bit Unicode],[16bit Bytes], ...
 * @param numChars
 */
qrcode.createStringToBytes = function (unicodeData, numChars) {

  // create conversion map.

  var unicodeMap = function () {

    var bin = base64DecodeInputStream(unicodeData);
    var read = function read() {
      var b = bin.read();
      if (b == -1) throw new Error();
      return b;
    };

    var count = 0;
    var unicodeMap = {};
    while (true) {
      var b0 = bin.read();
      if (b0 == -1) break;
      var b1 = read();
      var b2 = read();
      var b3 = read();
      var k = String.fromCharCode(b0 << 8 | b1);
      var v = b2 << 8 | b3;
      unicodeMap[k] = v;
      count += 1;
    }
    if (count != numChars) {
      throw new Error(count + ' != ' + numChars);
    }

    return unicodeMap;
  }();

  var unknownChar = '?'.charCodeAt(0);

  return function (s) {
    var bytes = new Array();
    for (var i = 0; i < s.length; i += 1) {
      var c = s.charCodeAt(i);
      if (c < 128) {
        bytes.push(c);
      } else {
        var b = unicodeMap[s.charAt(i)];
        if (typeof b == 'number') {
          if ((b & 0xff) == b) {
            // 1byte
            bytes.push(b);
          } else {
            // 2bytes
            bytes.push(b >>> 8);
            bytes.push(b & 0xff);
          }
        } else {
          bytes.push(unknownChar);
        }
      }
    }
    return bytes;
  };
};

//---------------------------------------------------------------------
// QRMode
//---------------------------------------------------------------------

var QRMode = {
  MODE_NUMBER: 1 << 0,
  MODE_ALPHA_NUM: 1 << 1,
  MODE_8BIT_BYTE: 1 << 2,
  MODE_KANJI: 1 << 3 };


//---------------------------------------------------------------------
// QRErrorCorrectLevel
//---------------------------------------------------------------------

var QRErrorCorrectLevel = {
  L: 1,
  M: 0,
  Q: 3,
  H: 2 };


//---------------------------------------------------------------------
// QRMaskPattern
//---------------------------------------------------------------------

var QRMaskPattern = {
  PATTERN000: 0,
  PATTERN001: 1,
  PATTERN010: 2,
  PATTERN011: 3,
  PATTERN100: 4,
  PATTERN101: 5,
  PATTERN110: 6,
  PATTERN111: 7 };


//---------------------------------------------------------------------
// QRUtil
//---------------------------------------------------------------------

var QRUtil = function () {

  var PATTERN_POSITION_TABLE = [
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
  [6, 30, 54],
  [6, 32, 58],
  [6, 34, 62],
  [6, 26, 46, 66],
  [6, 26, 48, 70],
  [6, 26, 50, 74],
  [6, 30, 54, 78],
  [6, 30, 56, 82],
  [6, 30, 58, 86],
  [6, 34, 62, 90],
  [6, 28, 50, 72, 94],
  [6, 26, 50, 74, 98],
  [6, 30, 54, 78, 102],
  [6, 28, 54, 80, 106],
  [6, 32, 58, 84, 110],
  [6, 30, 58, 86, 114],
  [6, 34, 62, 90, 118],
  [6, 26, 50, 74, 98, 122],
  [6, 30, 54, 78, 102, 126],
  [6, 26, 52, 78, 104, 130],
  [6, 30, 56, 82, 108, 134],
  [6, 34, 60, 86, 112, 138],
  [6, 30, 58, 86, 114, 142],
  [6, 34, 62, 90, 118, 146],
  [6, 30, 54, 78, 102, 126, 150],
  [6, 24, 50, 76, 102, 128, 154],
  [6, 28, 54, 80, 106, 132, 158],
  [6, 32, 58, 84, 110, 136, 162],
  [6, 26, 54, 82, 110, 138, 166],
  [6, 30, 58, 86, 114, 142, 170]];

  var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
  var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
  var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;

  var _this = {};

  var getBCHDigit = function getBCHDigit(data) {
    var digit = 0;
    while (data != 0) {
      digit += 1;
      data >>>= 1;
    }
    return digit;
  };

  _this.getBCHTypeInfo = function (data) {
    var d = data << 10;
    while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
      d ^= G15 << getBCHDigit(d) - getBCHDigit(G15);
    }
    return (data << 10 | d) ^ G15_MASK;
  };

  _this.getBCHTypeNumber = function (data) {
    var d = data << 12;
    while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
      d ^= G18 << getBCHDigit(d) - getBCHDigit(G18);
    }
    return data << 12 | d;
  };

  _this.getPatternPosition = function (typeNumber) {
    return PATTERN_POSITION_TABLE[typeNumber - 1];
  };

  _this.getMaskFunction = function (maskPattern) {

    switch (maskPattern) {

      case QRMaskPattern.PATTERN000:
        return function (i, j) {return (i + j) % 2 == 0;};
      case QRMaskPattern.PATTERN001:
        return function (i, j) {return i % 2 == 0;};
      case QRMaskPattern.PATTERN010:
        return function (i, j) {return j % 3 == 0;};
      case QRMaskPattern.PATTERN011:
        return function (i, j) {return (i + j) % 3 == 0;};
      case QRMaskPattern.PATTERN100:
        return function (i, j) {return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;};
      case QRMaskPattern.PATTERN101:
        return function (i, j) {return i * j % 2 + i * j % 3 == 0;};
      case QRMaskPattern.PATTERN110:
        return function (i, j) {return (i * j % 2 + i * j % 3) % 2 == 0;};
      case QRMaskPattern.PATTERN111:
        return function (i, j) {return (i * j % 3 + (i + j) % 2) % 2 == 0;};

      default:
        throw new Error('bad maskPattern:' + maskPattern);}

  };

  _this.getErrorCorrectPolynomial = function (errorCorrectLength) {
    var a = qrPolynomial([1], 0);
    for (var i = 0; i < errorCorrectLength; i += 1) {
      a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0));
    }
    return a;
  };

  _this.getLengthInBits = function (mode, type) {

    if (1 <= type && type < 10) {

      // 1 - 9

      switch (mode) {
        case QRMode.MODE_NUMBER:return 10;
        case QRMode.MODE_ALPHA_NUM:return 9;
        case QRMode.MODE_8BIT_BYTE:return 8;
        case QRMode.MODE_KANJI:return 8;
        default:
          throw new Error('mode:' + mode);}


    } else if (type < 27) {

      // 10 - 26

      switch (mode) {
        case QRMode.MODE_NUMBER:return 12;
        case QRMode.MODE_ALPHA_NUM:return 11;
        case QRMode.MODE_8BIT_BYTE:return 16;
        case QRMode.MODE_KANJI:return 10;
        default:
          throw new Error('mode:' + mode);}


    } else if (type < 41) {

      // 27 - 40

      switch (mode) {
        case QRMode.MODE_NUMBER:return 14;
        case QRMode.MODE_ALPHA_NUM:return 13;
        case QRMode.MODE_8BIT_BYTE:return 16;
        case QRMode.MODE_KANJI:return 12;
        default:
          throw new Error('mode:' + mode);}


    } else {
      throw new Error('type:' + type);
    }
  };

  _this.getLostPoint = function (qrcode) {

    var moduleCount = qrcode.getModuleCount();

    var lostPoint = 0;

    // LEVEL1

    for (var row = 0; row < moduleCount; row += 1) {
      for (var col = 0; col < moduleCount; col += 1) {

        var sameCount = 0;
        var dark = qrcode.isDark(row, col);

        for (var r = -1; r <= 1; r += 1) {

          if (row + r < 0 || moduleCount <= row + r) {
            continue;
          }

          for (var c = -1; c <= 1; c += 1) {

            if (col + c < 0 || moduleCount <= col + c) {
              continue;
            }

            if (r == 0 && c == 0) {
              continue;
            }

            if (dark == qrcode.isDark(row + r, col + c)) {
              sameCount += 1;
            }
          }
        }

        if (sameCount > 5) {
          lostPoint += 3 + sameCount - 5;
        }
      }
    };

    // LEVEL2

    for (var row = 0; row < moduleCount - 1; row += 1) {
      for (var col = 0; col < moduleCount - 1; col += 1) {
        var count = 0;
        if (qrcode.isDark(row, col)) count += 1;
        if (qrcode.isDark(row + 1, col)) count += 1;
        if (qrcode.isDark(row, col + 1)) count += 1;
        if (qrcode.isDark(row + 1, col + 1)) count += 1;
        if (count == 0 || count == 4) {
          lostPoint += 3;
        }
      }
    }

    // LEVEL3

    for (var row = 0; row < moduleCount; row += 1) {
      for (var col = 0; col < moduleCount - 6; col += 1) {
        if (qrcode.isDark(row, col) &&
        !qrcode.isDark(row, col + 1) &&
        qrcode.isDark(row, col + 2) &&
        qrcode.isDark(row, col + 3) &&
        qrcode.isDark(row, col + 4) &&
        !qrcode.isDark(row, col + 5) &&
        qrcode.isDark(row, col + 6)) {
          lostPoint += 40;
        }
      }
    }

    for (var col = 0; col < moduleCount; col += 1) {
      for (var row = 0; row < moduleCount - 6; row += 1) {
        if (qrcode.isDark(row, col) &&
        !qrcode.isDark(row + 1, col) &&
        qrcode.isDark(row + 2, col) &&
        qrcode.isDark(row + 3, col) &&
        qrcode.isDark(row + 4, col) &&
        !qrcode.isDark(row + 5, col) &&
        qrcode.isDark(row + 6, col)) {
          lostPoint += 40;
        }
      }
    }

    // LEVEL4

    var darkCount = 0;

    for (var col = 0; col < moduleCount; col += 1) {
      for (var row = 0; row < moduleCount; row += 1) {
        if (qrcode.isDark(row, col)) {
          darkCount += 1;
        }
      }
    }

    var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
    lostPoint += ratio * 10;

    return lostPoint;
  };

  return _this;
}();

//---------------------------------------------------------------------
// QRMath
//---------------------------------------------------------------------

var QRMath = function () {

  var EXP_TABLE = new Array(256);
  var LOG_TABLE = new Array(256);

  // initialize tables
  for (var i = 0; i < 8; i += 1) {
    EXP_TABLE[i] = 1 << i;
  }
  for (var i = 8; i < 256; i += 1) {
    EXP_TABLE[i] = EXP_TABLE[i - 4] ^
    EXP_TABLE[i - 5] ^
    EXP_TABLE[i - 6] ^
    EXP_TABLE[i - 8];
  }
  for (var i = 0; i < 255; i += 1) {
    LOG_TABLE[EXP_TABLE[i]] = i;
  }

  var _this = {};

  _this.glog = function (n) {

    if (n < 1) {
      throw new Error('glog(' + n + ')');
    }

    return LOG_TABLE[n];
  };

  _this.gexp = function (n) {

    while (n < 0) {
      n += 255;
    }

    while (n >= 256) {
      n -= 255;
    }

    return EXP_TABLE[n];
  };

  return _this;
}();

//---------------------------------------------------------------------
// qrPolynomial
//---------------------------------------------------------------------

function qrPolynomial(num, shift) {

  if (typeof num.length == 'undefined') {
    throw new Error(num.length + '/' + shift);
  }

  var _num = function () {
    var offset = 0;
    while (offset < num.length && num[offset] == 0) {
      offset += 1;
    }
    var _num = new Array(num.length - offset + shift);
    for (var i = 0; i < num.length - offset; i += 1) {
      _num[i] = num[i + offset];
    }
    return _num;
  }();

  var _this = {};

  _this.getAt = function (index) {
    return _num[index];
  };

  _this.getLength = function () {
    return _num.length;
  };

  _this.multiply = function (e) {

    var num = new Array(_this.getLength() + e.getLength() - 1);

    for (var i = 0; i < _this.getLength(); i += 1) {
      for (var j = 0; j < e.getLength(); j += 1) {
        num[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i)) + QRMath.glog(e.getAt(j)));
      }
    }

    return qrPolynomial(num, 0);
  };

  _this.mod = function (e) {

    if (_this.getLength() - e.getLength() < 0) {
      return _this;
    }

    var ratio = QRMath.glog(_this.getAt(0)) - QRMath.glog(e.getAt(0));

    var num = new Array(_this.getLength());
    for (var i = 0; i < _this.getLength(); i += 1) {
      num[i] = _this.getAt(i);
    }

    for (var i = 0; i < e.getLength(); i += 1) {
      num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i)) + ratio);
    }

    // recursive call
    return qrPolynomial(num, 0).mod(e);
  };

  return _this;
};

//---------------------------------------------------------------------
// QRRSBlock
//---------------------------------------------------------------------

var QRRSBlock = function () {


  // [1: [L, M, Q, H], ..]
  var RS_BLOCK_TABLE = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]];

  var qrRSBlock = function qrRSBlock(totalCount, dataCount) {
    var _this = {};
    _this.totalCount = totalCount;
    _this.dataCount = dataCount;
    return _this;
  };

  var _this = {};

  var getRsBlockTable = function getRsBlockTable(typeNumber, errorCorrectLevel) {

    switch (errorCorrectLevel) {
      case QRErrorCorrectLevel.L:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectLevel.M:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectLevel.Q:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectLevel.H:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default:
        return undefined;}

  };

  _this.getRSBlocks = function (typeNumber, errorCorrectLevel) {

    var rsBlock = getRsBlockTable(typeNumber, errorCorrectLevel);

    if (typeof rsBlock == 'undefined') {
      throw new Error('bad rs block [url=home.php?mod=space&uid=5302]@[/url] typeNumber:' + typeNumber +
      '/errorCorrectLevel:' + errorCorrectLevel);
    }

    var length = rsBlock.length / 3;

    var list = new Array();

    for (var i = 0; i < length; i += 1) {

      var count = rsBlock[i * 3 + 0];
      var totalCount = rsBlock[i * 3 + 1];
      var dataCount = rsBlock[i * 3 + 2];

      for (var j = 0; j < count; j += 1) {
        list.push(qrRSBlock(totalCount, dataCount));
      }
    }

    return list;
  };

  return _this;
}();

//---------------------------------------------------------------------
// qrBitBuffer
//---------------------------------------------------------------------

var qrBitBuffer = function qrBitBuffer() {

  var _buffer = new Array();
  var _length = 0;

  var _this = {};

  _this.getBuffer = function () {
    return _buffer;
  };

  _this.getAt = function (index) {
    var bufIndex = Math.floor(index / 8);
    return (_buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
  };

  _this.put = function (num, length) {
    for (var i = 0; i < length; i += 1) {
      _this.putBit((num >>> length - i - 1 & 1) == 1);
    }
  };

  _this.getLengthInBits = function () {
    return _length;
  };

  _this.putBit = function (bit) {

    var bufIndex = Math.floor(_length / 8);
    if (_buffer.length <= bufIndex) {
      _buffer.push(0);
    }

    if (bit) {
      _buffer[bufIndex] |= 0x80 >>> _length % 8;
    }

    _length += 1;
  };

  return _this;
};

//---------------------------------------------------------------------
// qr8BitByte
//---------------------------------------------------------------------

var qr8BitByte = function qr8BitByte(data) {

  var _mode = QRMode.MODE_8BIT_BYTE;
  var _data = data;
  var _parsedData = [];

  var _this = {};


  // Added to support UTF-8 Characters
  for (var i = 0, l = _data.length; i < l; i++) {
    var byteArray = [];
    var code = _data.charCodeAt(i);

    if (code > 0x10000) {
      byteArray[0] = 0xF0 | (code & 0x1C0000) >>> 18;
      byteArray[1] = 0x80 | (code & 0x3F000) >>> 12;
      byteArray[2] = 0x80 | (code & 0xFC0) >>> 6;
      byteArray[3] = 0x80 | code & 0x3F;
    } else if (code > 0x800) {
      byteArray[0] = 0xE0 | (code & 0xF000) >>> 12;
      byteArray[1] = 0x80 | (code & 0xFC0) >>> 6;
      byteArray[2] = 0x80 | code & 0x3F;
    } else if (code > 0x80) {
      byteArray[0] = 0xC0 | (code & 0x7C0) >>> 6;
      byteArray[1] = 0x80 | code & 0x3F;
    } else {
      byteArray[0] = code;
    }

    // Fix Unicode corruption bug
    _parsedData.push(byteArray);
  }

  _parsedData = Array.prototype.concat.apply([], _parsedData);

  if (_parsedData.length != _data.length) {
    _parsedData.unshift(191);
    _parsedData.unshift(187);
    _parsedData.unshift(239);
  }

  var _bytes = _parsedData;

  _this.getMode = function () {
    return _mode;
  };

  _this.getLength = function (buffer) {
    return _bytes.length;
  };

  _this.write = function (buffer) {
    for (var i = 0; i < _bytes.length; i += 1) {
      buffer.put(_bytes[i], 8);
    }
  };

  return _this;
};

//=====================================================================
// GIF Support etc.
//

//---------------------------------------------------------------------
// byteArrayOutputStream
//---------------------------------------------------------------------

var byteArrayOutputStream = function byteArrayOutputStream() {

  var _bytes = new Array();

  var _this = {};

  _this.writeByte = function (b) {
    _bytes.push(b & 0xff);
  };

  _this.writeShort = function (i) {
    _this.writeByte(i);
    _this.writeByte(i >>> 8);
  };

  _this.writeBytes = function (b, off, len) {
    off = off || 0;
    len = len || b.length;
    for (var i = 0; i < len; i += 1) {
      _this.writeByte(b[i + off]);
    }
  };

  _this.writeString = function (s) {
    for (var i = 0; i < s.length; i += 1) {
      _this.writeByte(s.charCodeAt(i));
    }
  };

  _this.toByteArray = function () {
    return _bytes;
  };

  _this.toString = function () {
    var s = '';
    s += '[';
    for (var i = 0; i < _bytes.length; i += 1) {
      if (i > 0) {
        s += ',';
      }
      s += _bytes[i];
    }
    s += ']';
    return s;
  };

  return _this;
};

//---------------------------------------------------------------------
// base64EncodeOutputStream
//---------------------------------------------------------------------

var base64EncodeOutputStream = function base64EncodeOutputStream() {

  var _buffer = 0;
  var _buflen = 0;
  var _length = 0;
  var _base64 = '';

  var _this = {};

  var writeEncoded = function writeEncoded(b) {
    _base64 += String.fromCharCode(encode(b & 0x3f));
  };

  var encode = function encode(n) {
    if (n < 0) {
      // error.
    } else if (n < 26) {
      return 0x41 + n;
    } else if (n < 52) {
      return 0x61 + (n - 26);
    } else if (n < 62) {
      return 0x30 + (n - 52);
    } else if (n == 62) {
      return 0x2b;
    } else if (n == 63) {
      return 0x2f;
    }
    throw new Error('n:' + n);
  };

  _this.writeByte = function (n) {

    _buffer = _buffer << 8 | n & 0xff;
    _buflen += 8;
    _length += 1;

    while (_buflen >= 6) {
      writeEncoded(_buffer >>> _buflen - 6);
      _buflen -= 6;
    }
  };

  _this.flush = function () {

    if (_buflen > 0) {
      writeEncoded(_buffer << 6 - _buflen);
      _buffer = 0;
      _buflen = 0;
    }

    if (_length % 3 != 0) {
      // padding
      var padlen = 3 - _length % 3;
      for (var i = 0; i < padlen; i += 1) {
        _base64 += '=';
      }
    }
  };

  _this.toString = function () {
    return _base64;
  };

  return _this;
};

//---------------------------------------------------------------------
// base64DecodeInputStream
//---------------------------------------------------------------------

var base64DecodeInputStream = function base64DecodeInputStream(str) {

  var _str = str;
  var _pos = 0;
  var _buffer = 0;
  var _buflen = 0;

  var _this = {};

  _this.read = function () {

    while (_buflen < 8) {

      if (_pos >= _str.length) {
        if (_buflen == 0) {
          return -1;
        }
        throw new Error('unexpected end of file./' + _buflen);
      }

      var c = _str.charAt(_pos);
      _pos += 1;

      if (c == '=') {
        _buflen = 0;
        return -1;
      } else if (c.match(/^\s$/)) {
        // ignore if whitespace.
        continue;
      }

      _buffer = _buffer << 6 | decode(c.charCodeAt(0));
      _buflen += 6;
    }

    var n = _buffer >>> _buflen - 8 & 0xff;
    _buflen -= 8;
    return n;
  };

  var decode = function decode(c) {
    if (0x41 <= c && c <= 0x5a) {
      return c - 0x41;
    } else if (0x61 <= c && c <= 0x7a) {
      return c - 0x61 + 26;
    } else if (0x30 <= c && c <= 0x39) {
      return c - 0x30 + 52;
    } else if (c == 0x2b) {
      return 62;
    } else if (c == 0x2f) {
      return 63;
    } else {
      throw new Error('c:' + c);
    }
  };

  return _this;
};

//---------------------------------------------------------------------
// gifImage (B/W)
//---------------------------------------------------------------------

var gifImage = function gifImage(width, height) {

  var _width = width;
  var _height = height;
  var _data = new Array(width * height);

  var _this = {};

  _this.setPixel = function (x, y, pixel) {
    _data[y * _width + x] = pixel;
  };

  _this.write = function (out) {

    //---------------------------------
    // GIF Signature

    out.writeString('GIF87a');

    //---------------------------------
    // Screen Descriptor

    out.writeShort(_width);
    out.writeShort(_height);

    out.writeByte(0x80); // 2bit
    out.writeByte(0);
    out.writeByte(0);

    //---------------------------------
    // Global Color Map

    // black
    out.writeByte(0x00);
    out.writeByte(0x00);
    out.writeByte(0x00);

    // white
    out.writeByte(0xff);
    out.writeByte(0xff);
    out.writeByte(0xff);

    //---------------------------------
    // Image Descriptor

    out.writeString(',');
    out.writeShort(0);
    out.writeShort(0);
    out.writeShort(_width);
    out.writeShort(_height);
    out.writeByte(0);

    //---------------------------------
    // Local Color Map

    //---------------------------------
    // Raster Data

    var lzwMinCodeSize = 2;
    var raster = getLZWRaster(lzwMinCodeSize);

    out.writeByte(lzwMinCodeSize);

    var offset = 0;

    while (raster.length - offset > 255) {
      out.writeByte(255);
      out.writeBytes(raster, offset, 255);
      offset += 255;
    }

    out.writeByte(raster.length - offset);
    out.writeBytes(raster, offset, raster.length - offset);
    out.writeByte(0x00);

    //---------------------------------
    // GIF Terminator
    out.writeString(';');
  };

  var bitOutputStream = function bitOutputStream(out) {

    var _out = out;
    var _bitLength = 0;
    var _bitBuffer = 0;

    var _this = {};

    _this.write = function (data, length) {

      if (data >>> length != 0) {
        throw new Error('length over');
      }

      while (_bitLength + length >= 8) {
        _out.writeByte(0xff & (data << _bitLength | _bitBuffer));
        length -= 8 - _bitLength;
        data >>>= 8 - _bitLength;
        _bitBuffer = 0;
        _bitLength = 0;
      }

      _bitBuffer = data << _bitLength | _bitBuffer;
      _bitLength = _bitLength + length;
    };

    _this.flush = function () {
      if (_bitLength > 0) {
        _out.writeByte(_bitBuffer);
      }
    };

    return _this;
  };

  var getLZWRaster = function getLZWRaster(lzwMinCodeSize) {

    var clearCode = 1 << lzwMinCodeSize;
    var endCode = (1 << lzwMinCodeSize) + 1;
    var bitLength = lzwMinCodeSize + 1;

    // Setup LZWTable
    var table = lzwTable();

    for (var i = 0; i < clearCode; i += 1) {
      table.add(String.fromCharCode(i));
    }
    table.add(String.fromCharCode(clearCode));
    table.add(String.fromCharCode(endCode));

    var byteOut = byteArrayOutputStream();
    var bitOut = bitOutputStream(byteOut);

    // clear code
    bitOut.write(clearCode, bitLength);

    var dataIndex = 0;

    var s = String.fromCharCode(_data[dataIndex]);
    dataIndex += 1;

    while (dataIndex < _data.length) {

      var c = String.fromCharCode(_data[dataIndex]);
      dataIndex += 1;

      if (table.contains(s + c)) {

        s = s + c;

      } else {

        bitOut.write(table.indexOf(s), bitLength);

        if (table.size() < 0xfff) {

          if (table.size() == 1 << bitLength) {
            bitLength += 1;
          }

          table.add(s + c);
        }

        s = c;
      }
    }

    bitOut.write(table.indexOf(s), bitLength);

    // end code
    bitOut.write(endCode, bitLength);

    bitOut.flush();

    return byteOut.toByteArray();
  };

  var lzwTable = function lzwTable() {

    var _map = {};
    var _size = 0;

    var _this = {};

    _this.add = function (key) {
      if (_this.contains(key)) {
        throw new Error('dup key:' + key);
      }
      _map[key] = _size;
      _size += 1;
    };

    _this.size = function () {
      return _size;
    };

    _this.indexOf = function (key) {
      return _map[key];
    };

    _this.contains = function (key) {
      return typeof _map[key] != 'undefined';
    };

    return _this;
  };

  return _this;
};

var createImgTag = function createImgTag(width, height, getPixel, alt) {

  var gif = gifImage(width, height);
  for (var y = 0; y < height; y += 1) {
    for (var x = 0; x < width; x += 1) {
      gif.setPixel(x, y, getPixel(x, y));
    }
  }

  var b = byteArrayOutputStream();
  gif.write(b);

  var base64 = base64EncodeOutputStream();
  var bytes = b.toByteArray();
  for (var i = 0; i < bytes.length; i += 1) {
    base64.writeByte(bytes[i]);
  }
  base64.flush();

  var img = '';
  img += 'data:image/gif;base64,';
  img += base64;

  return img;
};

//---------------------------------------------------------------------
// returns qrcode function.

var createQrCodeImg = function createQrCodeImg(text, options) {
  options = options || {};
  var typeNumber = options.typeNumber || 4;
  var errorCorrectLevel = options.errorCorrectLevel || 'M';
  var size = options.size || 500;

  var qr;

  try {
    qr = qrcode(typeNumber, errorCorrectLevel || 'M');
    qr.addData(text);
    qr.make();
  } catch (e) {
    if (typeNumber >= 40) {
      throw new Error('Text too long to encode');
    } else {
      return gen(text, {
        size: size,
        errorCorrectLevel: errorCorrectLevel,
        typeNumber: typeNumber + 1 });

    }
  }

  // calc cellsize and margin
  var cellsize = parseInt(size / qr.getModuleCount());
  var margin = parseInt((size - qr.getModuleCount() * cellsize) / 2);

  return qr.createImgTag(cellsize, margin, size);
};
// var module = {}; 需要注释这一行，否则微信小程序无法使用
module.exports = {
  createQrCodeImg: createQrCodeImg };

/***/ }),

/***/ 27:
/*!*********************************************************!*\
  !*** C:/Users/Admin/Desktop/evc.app/common/js/shims.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {var require;var require;!function (t) {if (true) module.exports = t();else {}}(function () {return function i(s, u, a) {function f(e, t) {if (!u[e]) {if (!s[e]) {var r = "function" == typeof require && require;if (!t && r) return require(e, !0);if (c) return c(e, !0);var n = new Error("Cannot find module '" + e + "'");throw n.code = "MODULE_NOT_FOUND", n;}var o = u[e] = { exports: {} };s[e][0].call(o.exports, function (t) {return f(s[e][1][t] || t);}, o, o.exports, i, s, u, a);}return u[e].exports;}for (var c = "function" == typeof require && require, t = 0; t < a.length; t++) {f(a[t]);}return f;}({ 1: [function (t, e, r) {(function (e) {if (e.atob) try {e.atob(" ");} catch (t) {e.atob = function (e) {function t(t) {return e(String(t).replace(/[\t\n\f\r ]+/g, ""));}return t.original = e, t;}(e.atob);} else {var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",s = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;e.btoa = function (t) {for (var e, r, n, o, i = "", s = 0, u = (t = String(t)).length % 3; s < t.length;) {if (255 < (r = t.charCodeAt(s++)) || 255 < (n = t.charCodeAt(s++)) || 255 < (o = t.charCodeAt(s++))) throw new TypeError("Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range.");i += a.charAt((e = r << 16 | n << 8 | o) >> 18 & 63) + a.charAt(e >> 12 & 63) + a.charAt(e >> 6 & 63) + a.charAt(63 & e);}return u ? i.slice(0, u - 3) + "===".substring(u) : i;}, e.atob = function (t) {if (t = String(t).replace(/[\t\n\f\r ]+/g, ""), !s.test(t)) throw new TypeError("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");t += "==".slice(2 - (3 & t.length));for (var e, r, n, o = "", i = 0; i < t.length;) {e = a.indexOf(t.charAt(i++)) << 18 | a.indexOf(t.charAt(i++)) << 12 | (r = a.indexOf(t.charAt(i++))) << 6 | (n = a.indexOf(t.charAt(i++))), o += 64 === r ? String.fromCharCode(e >> 16 & 255) : 64 === n ? String.fromCharCode(e >> 16 & 255, e >> 8 & 255) : String.fromCharCode(e >> 16 & 255, e >> 8 & 255, 255 & e);}return o;};}})(void 0 !== r ? r : this);}, {}], 2: [function (V, r, n) {(function (U) {var t, e;t = this, e = function e() {"use strict";function f(t) {return "function" == typeof t;}var r = Array.isArray ? Array.isArray : function (t) {return "[object Array]" === Object.prototype.toString.call(t);},n = 0,e = void 0,o = void 0,u = function u(t, e) {l[n] = t, l[n + 1] = e, 2 === (n += 2) && (o ? o(p) : y());};var t = "undefined" != typeof window ? window : void 0,i = t || {},s = i.MutationObserver || i.WebKitMutationObserver,a = "undefined" == typeof self && "undefined" != typeof process && "[object process]" === {}.toString.call(process),c = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel;function h() {var t = setTimeout;return function () {return t(p, 1);};}var l = new Array(1e3);function p() {for (var t = 0; t < n; t += 2) {(0, l[t])(l[t + 1]), l[t] = void 0, l[t + 1] = void 0;}n = 0;}var d,v,g,w,y = void 0;function m(t, e) {var r = arguments,n = this,o = new this.constructor(_);void 0 === o[C] && L(o);var i,s = n._state;return s ? (i = r[s - 1], u(function () {return K(s, o, i, n._result);})) : k(n, o, t, e), o;}function b(t) {if (t && "object" == typeof t && t.constructor === this) return t;var e = new this(_);return j(e, t), e;}y = a ? function () {return process.nextTick(p);} : s ? (v = 0, g = new s(p), w = document.createTextNode(""), g.observe(w, { characterData: !0 }), function () {w.data = v = ++v % 2;}) : c ? ((d = new MessageChannel()).port1.onmessage = p, function () {return d.port2.postMessage(0);}) : void 0 === t && "function" == typeof V ? function () {try {var t = V("vertx");return void 0 !== (e = t.runOnLoop || t.runOnContext) ? function () {e(p);} : h();} catch (t) {return h();}}() : h();var C = Math.random().toString(36).substring(16);function _() {}var A = void 0,S = 1,x = 2,F = new O();function B(t) {try {return t.then;} catch (t) {return F.error = t, F;}}function N(t, e, r) {e.constructor === t.constructor && r === m && e.constructor.resolve === b ? function (e, t) {t._state === S ? T(e, t._result) : t._state === x ? D(e, t._result) : k(t, void 0, function (t) {return j(e, t);}, function (t) {return D(e, t);});}(t, e) : r === F ? (D(t, F.error), F.error = null) : void 0 === r ? T(t, e) : f(r) ? function (t, n, o) {u(function (e) {var r = !1,t = function (t, e, r, n) {try {t.call(e, r, n);} catch (t) {return t;}}(o, n, function (t) {r || (r = !0, n !== t ? j(e, t) : T(e, t));}, function (t) {r || (r = !0, D(e, t));}, e._label);!r && t && (r = !0, D(e, t));}, t);}(t, e, r) : T(t, e);}function j(t, e) {t === e ? D(t, new TypeError("You cannot resolve a promise with itself")) : !function (t) {var e = typeof t;return null !== t && ("object" == e || "function" == e);}(e) ? T(t, e) : N(t, e, B(e));}function E(t) {t._onerror && t._onerror(t._result), z(t);}function T(t, e) {t._state === A && (t._result = e, t._state = S, 0 !== t._subscribers.length && u(z, t));}function D(t, e) {t._state === A && (t._state = x, t._result = e, u(E, t));}function k(t, e, r, n) {var o = t._subscribers,i = o.length;t._onerror = null, o[i] = e, o[i + S] = r, o[i + x] = n, 0 === i && t._state && u(z, t);}function z(t) {var e = t._subscribers,r = t._state;if (0 !== e.length) {for (var n = void 0, o = void 0, i = t._result, s = 0; s < e.length; s += 3) {n = e[s], o = e[s + r], n ? K(r, n, o, i) : o(i);}t._subscribers.length = 0;}}function O() {this.error = null;}var M = new O();function K(t, e, r, n) {var o = f(r),i = void 0,s = void 0,u = void 0,a = void 0;if (o) {if ((i = function (t, e) {try {return t(e);} catch (t) {return M.error = t, M;}}(r, n)) === M ? (a = !0, s = i.error, i.error = null) : u = !0, e === i) return void D(e, new TypeError("A promises callback cannot return that same promise."));} else i = n, u = !0;e._state !== A || (o && u ? j(e, i) : a ? D(e, s) : t === S ? T(e, i) : t === x && D(e, i));}var P = 0;function L(t) {t[C] = P++, t._state = void 0, t._result = void 0, t._subscribers = [];}function q(t, e) {this._instanceConstructor = t, this.promise = new t(_), this.promise[C] || L(this.promise), r(e) ? (this.length = e.length, this._remaining = e.length, this._result = new Array(this.length), 0 === this.length ? T(this.promise, this._result) : (this.length = this.length || 0, this._enumerate(e), 0 === this._remaining && T(this.promise, this._result))) : D(this.promise, new Error("Array Methods must be provided an Array"));}function R(t) {this[C] = P++, this._result = this._state = void 0, this._subscribers = [], _ !== t && ("function" != typeof t && function () {throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");}(), this instanceof R ? function (e, t) {try {t(function (t) {j(e, t);}, function (t) {D(e, t);});} catch (t) {D(e, t);}}(this, t) : function () {throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");}());}return q.prototype._enumerate = function (t) {for (var e = 0; this._state === A && e < t.length; e++) {this._eachEntry(t[e], e);}}, q.prototype._eachEntry = function (e, t) {var r = this._instanceConstructor,n = r.resolve;if (n === b) {var o = B(e);if (o === m && e._state !== A) this._settledAt(e._state, t, e._result);else if ("function" != typeof o) this._remaining--, this._result[t] = e;else if (r === R) {var i = new r(_);N(i, e, o), this._willSettleAt(i, t);} else this._willSettleAt(new r(function (t) {return t(e);}), t);} else this._willSettleAt(n(e), t);}, q.prototype._settledAt = function (t, e, r) {var n = this.promise;n._state === A && (this._remaining--, t === x ? D(n, r) : this._result[e] = r), 0 === this._remaining && T(n, this._result);}, q.prototype._willSettleAt = function (t, e) {var r = this;k(t, void 0, function (t) {return r._settledAt(S, e, t);}, function (t) {return r._settledAt(x, e, t);});}, R.all = function (t) {return new q(this, t).promise;}, R.race = function (o) {var i = this;return r(o) ? new i(function (t, e) {for (var r = o.length, n = 0; n < r; n++) {i.resolve(o[n]).then(t, e);}}) : new i(function (t, e) {return e(new TypeError("You must pass an array to race."));});}, R.resolve = b, R.reject = function (t) {var e = new this(_);return D(e, t), e;}, R._setScheduler = function (t) {o = t;}, R._setAsap = function (t) {u = t;}, R._asap = u, R.prototype = { constructor: R, then: m, catch: function _catch(t) {return this.then(null, t);} }, R.polyfill = function () {var t = void 0;if (void 0 !== U) t = U;else if ("undefined" != typeof self) t = self;else try {t = Function("return this")();} catch (t) {throw new Error("polyfill failed because global object is unavailable in this environment");}var e = t.Promise;if (e) {var r = null;try {r = Object.prototype.toString.call(e.resolve());} catch (t) {}if ("[object Promise]" === r && !e.cast) return;}t.Promise = R;}, (R.Promise = R).polyfill(), R;}, "object" == typeof n && void 0 !== r ? r.exports = e() : t.ES6Promise = e();}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});}, {}], 3: [function (u, t, e) {(function (t) {"use strict";var e = [];try {for (var r = [], n = ["NFD", "NFC", "NFKD", "NFKC"], o = 0; o < n.length; o++) {try {"test".normalize(n[o]);} catch (t) {r.push(n[o]);}}if (r.length) throw e.push("String.prototype.normalize (missing: " + r.join(", ") + ")"), new Error("bad normalize");if (String.fromCharCode(233).normalize("NFD") !== String.fromCharCode(101, 769)) throw e.push("String.prototype.normalize (broken)"), new Error("bad normalize");} catch (t) {var i = u("./unorm.js");String.prototype.normalize = function (t) {var e = i[(t || "NFC").toLowerCase()];if (!e) throw new RangeError("invalid form - " + t);return e(this);};}var s = u("./base64.js");t.atob || (e.push("atob"), t.atob = s.atob), t.btoa || (e.push("btoa"), t.btoa = s.btoa);u("./es6-promise.auto.js");if (ArrayBuffer.isView || (e.push("ArrayBuffer.isView"), ArrayBuffer.isView = function (t) {return !!t.buffer;}), t.nextTick || (e.push("nextTick"), t.nextTick = function (t) {setTimeout(t, 0);}), e.length) {console.log("Shims Injected:");for (o = 0; o < e.length; o++) {console.log("  - " + e[o]);}}}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});}, { "./base64.js": 1, "./es6-promise.auto.js": 2, "./unorm.js": 4 }], 4: [function (t, d, e) {!function (t) {"use strict";for (var o = [null, 0, {}], f = 44032, c = 4352, h = function h(t, e) {this.codepoint = t, this.feature = e;}, i = {}, s = [], e = 0; e <= 255; ++e) {s[e] = 0;}h.fromCharCode = [function (t, e, r) {return e < 60 || 13311 < e && e < 42607 ? new h(e, o) : t(e, r);}, function (t, e, r) {var n = i[e];return n || (n = t(e, r)).feature && 10 < ++s[e >> 8 & 255] && (i[e] = n), n;}, function (t, e, r) {return r ? t(e, r) : new h(e, null);}, function (t, e, r) {var n;if (e < c || 4371 <= e && e < f || 55204 < e) return t(e, r);if (c <= e && e < 4371) {var o = {},i = 21 * (e - c);for (n = 0; n < 21; ++n) {o[4449 + n] = f + 28 * (n + i);}return new h(e, [,, o]);}var s = e - f,u = s % 28,a = [];if (0 != u) a[0] = [f + s - u, 4519 + u];else for (a[0] = [c + Math.floor(s / 588), 4449 + Math.floor(s % 588 / 28)], a[2] = {}, n = 1; n < 28; ++n) {a[2][4519 + n] = e + n;}return new h(e, a);}, function (t, e, r) {var n = (h.udata[65280 & e] || {})[e];return new h(e, n || o);}].reduceRight(function (r, n) {return function (t, e) {return n(r, t, e);};}, null), h.isHighSurrogate = function (t) {return 55296 <= t && t <= 56319;}, h.isLowSurrogate = function (t) {return 56320 <= t && t <= 57343;}, h.prototype.prepFeature = function () {this.feature || (this.feature = h.fromCharCode(this.codepoint, !0).feature);}, h.prototype.toString = function () {if (this.codepoint < 65536) return String.fromCharCode(this.codepoint);var t = this.codepoint - 65536;return String.fromCharCode(Math.floor(t / 1024) + 55296, t % 1024 + 56320);}, h.prototype.getDecomp = function () {return this.prepFeature(), this.feature[0] || null;}, h.prototype.isCompatibility = function () {return this.prepFeature(), !!this.feature[1] && 256 & this.feature[1];}, h.prototype.isExclude = function () {return this.prepFeature(), !!this.feature[1] && 512 & this.feature[1];}, h.prototype.getCanonicalClass = function () {return this.prepFeature(), this.feature[1] ? 255 & this.feature[1] : 0;}, h.prototype.getComposite = function (t) {if (this.prepFeature(), !this.feature[2]) return null;var e = this.feature[2][t.codepoint];return e ? h.fromCharCode(e) : null;};function u(t) {this.str = t, this.cursor = 0;}u.prototype.next = function () {if (this.str && this.cursor < this.str.length) {var t,e = this.str.charCodeAt(this.cursor++);return h.isHighSurrogate(e) && this.cursor < this.str.length && h.isLowSurrogate(t = this.str.charCodeAt(this.cursor)) && (e = 1024 * (e - 55296) + (t - 56320) + 65536, ++this.cursor), h.fromCharCode(e);}return this.str = null;};function a(t, e) {this.it = t, this.canonical = e, this.resBuf = [];}a.prototype.next = function () {if (0 === this.resBuf.length) {var t = this.it.next();if (!t) return null;this.resBuf = function t(e, r) {var n = r.getDecomp();if (!n || e && r.isCompatibility()) return [r];for (var o = [], i = 0; i < n.length; ++i) {var s = t(e, h.fromCharCode(n[i]));o = o.concat(s);}return o;}(this.canonical, t);}return this.resBuf.shift();};function l(t) {this.it = t, this.resBuf = [];}l.prototype.next = function () {var t;if (0 === this.resBuf.length) do {var e = this.it.next();if (!e) break;t = e.getCanonicalClass();var r = this.resBuf.length;if (0 !== t) for (; 0 < r; --r) {if (this.resBuf[r - 1].getCanonicalClass() <= t) break;}this.resBuf.splice(r, 0, e);} while (0 !== t);return this.resBuf.shift();};function p(t) {this.it = t, this.procBuf = [], this.resBuf = [], this.lastClass = null;}p.prototype.next = function () {for (; 0 === this.resBuf.length;) {var t = this.it.next();if (!t) {this.resBuf = this.procBuf, this.procBuf = [];break;}if (0 === this.procBuf.length) this.lastClass = t.getCanonicalClass(), this.procBuf.push(t);else {var e = this.procBuf[0].getComposite(t),r = t.getCanonicalClass();e && (this.lastClass < r || 0 === this.lastClass) ? this.procBuf[0] = e : (0 === r && (this.resBuf = this.procBuf, this.procBuf = []), this.lastClass = r, this.procBuf.push(t));}}return this.resBuf.shift();};function r(t, e) {for (var r, n = function (t, e) {switch (t) {case "NFD":return new l(new a(new u(e), !0));case "NFKD":return new l(new a(new u(e), !1));case "NFC":return new p(new l(new a(new u(e), !0)));case "NFKC":return new p(new l(new a(new u(e), !1)));}throw t + " is invalid";}(t, e), o = ""; r = n.next();) {o += r.toString();}return o;}h.udata = { 0: { 60: [,, { 824: 8814 }], 61: [,, { 824: 8800 }], 62: [,, { 824: 8815 }], 65: [,, { 768: 192, 769: 193, 770: 194, 771: 195, 772: 256, 774: 258, 775: 550, 776: 196, 777: 7842, 778: 197, 780: 461, 783: 512, 785: 514, 803: 7840, 805: 7680, 808: 260 }], 66: [,, { 775: 7682, 803: 7684, 817: 7686 }], 67: [,, { 769: 262, 770: 264, 775: 266, 780: 268, 807: 199 }], 68: [,, { 775: 7690, 780: 270, 803: 7692, 807: 7696, 813: 7698, 817: 7694 }], 69: [,, { 768: 200, 769: 201, 770: 202, 771: 7868, 772: 274, 774: 276, 775: 278, 776: 203, 777: 7866, 780: 282, 783: 516, 785: 518, 803: 7864, 807: 552, 808: 280, 813: 7704, 816: 7706 }], 70: [,, { 775: 7710 }], 71: [,, { 769: 500, 770: 284, 772: 7712, 774: 286, 775: 288, 780: 486, 807: 290 }], 72: [,, { 770: 292, 775: 7714, 776: 7718, 780: 542, 803: 7716, 807: 7720, 814: 7722 }], 73: [,, { 768: 204, 769: 205, 770: 206, 771: 296, 772: 298, 774: 300, 775: 304, 776: 207, 777: 7880, 780: 463, 783: 520, 785: 522, 803: 7882, 808: 302, 816: 7724 }], 74: [,, { 770: 308 }], 75: [,, { 769: 7728, 780: 488, 803: 7730, 807: 310, 817: 7732 }], 76: [,, { 769: 313, 780: 317, 803: 7734, 807: 315, 813: 7740, 817: 7738 }], 77: [,, { 769: 7742, 775: 7744, 803: 7746 }], 78: [,, { 768: 504, 769: 323, 771: 209, 775: 7748, 780: 327, 803: 7750, 807: 325, 813: 7754, 817: 7752 }], 79: [,, { 768: 210, 769: 211, 770: 212, 771: 213, 772: 332, 774: 334, 775: 558, 776: 214, 777: 7886, 779: 336, 780: 465, 783: 524, 785: 526, 795: 416, 803: 7884, 808: 490 }], 80: [,, { 769: 7764, 775: 7766 }], 82: [,, { 769: 340, 775: 7768, 780: 344, 783: 528, 785: 530, 803: 7770, 807: 342, 817: 7774 }], 83: [,, { 769: 346, 770: 348, 775: 7776, 780: 352, 803: 7778, 806: 536, 807: 350 }], 84: [,, { 775: 7786, 780: 356, 803: 7788, 806: 538, 807: 354, 813: 7792, 817: 7790 }], 85: [,, { 768: 217, 769: 218, 770: 219, 771: 360, 772: 362, 774: 364, 776: 220, 777: 7910, 778: 366, 779: 368, 780: 467, 783: 532, 785: 534, 795: 431, 803: 7908, 804: 7794, 808: 370, 813: 7798, 816: 7796 }], 86: [,, { 771: 7804, 803: 7806 }], 87: [,, { 768: 7808, 769: 7810, 770: 372, 775: 7814, 776: 7812, 803: 7816 }], 88: [,, { 775: 7818, 776: 7820 }], 89: [,, { 768: 7922, 769: 221, 770: 374, 771: 7928, 772: 562, 775: 7822, 776: 376, 777: 7926, 803: 7924 }], 90: [,, { 769: 377, 770: 7824, 775: 379, 780: 381, 803: 7826, 817: 7828 }], 97: [,, { 768: 224, 769: 225, 770: 226, 771: 227, 772: 257, 774: 259, 775: 551, 776: 228, 777: 7843, 778: 229, 780: 462, 783: 513, 785: 515, 803: 7841, 805: 7681, 808: 261 }], 98: [,, { 775: 7683, 803: 7685, 817: 7687 }], 99: [,, { 769: 263, 770: 265, 775: 267, 780: 269, 807: 231 }], 100: [,, { 775: 7691, 780: 271, 803: 7693, 807: 7697, 813: 7699, 817: 7695 }], 101: [,, { 768: 232, 769: 233, 770: 234, 771: 7869, 772: 275, 774: 277, 775: 279, 776: 235, 777: 7867, 780: 283, 783: 517, 785: 519, 803: 7865, 807: 553, 808: 281, 813: 7705, 816: 7707 }], 102: [,, { 775: 7711 }], 103: [,, { 769: 501, 770: 285, 772: 7713, 774: 287, 775: 289, 780: 487, 807: 291 }], 104: [,, { 770: 293, 775: 7715, 776: 7719, 780: 543, 803: 7717, 807: 7721, 814: 7723, 817: 7830 }], 105: [,, { 768: 236, 769: 237, 770: 238, 771: 297, 772: 299, 774: 301, 776: 239, 777: 7881, 780: 464, 783: 521, 785: 523, 803: 7883, 808: 303, 816: 7725 }], 106: [,, { 770: 309, 780: 496 }], 107: [,, { 769: 7729, 780: 489, 803: 7731, 807: 311, 817: 7733 }], 108: [,, { 769: 314, 780: 318, 803: 7735, 807: 316, 813: 7741, 817: 7739 }], 109: [,, { 769: 7743, 775: 7745, 803: 7747 }], 110: [,, { 768: 505, 769: 324, 771: 241, 775: 7749, 780: 328, 803: 7751, 807: 326, 813: 7755, 817: 7753 }], 111: [,, { 768: 242, 769: 243, 770: 244, 771: 245, 772: 333, 774: 335, 775: 559, 776: 246, 777: 7887, 779: 337, 780: 466, 783: 525, 785: 527, 795: 417, 803: 7885, 808: 491 }], 112: [,, { 769: 7765, 775: 7767 }], 114: [,, { 769: 341, 775: 7769, 780: 345, 783: 529, 785: 531, 803: 7771, 807: 343, 817: 7775 }], 115: [,, { 769: 347, 770: 349, 775: 7777, 780: 353, 803: 7779, 806: 537, 807: 351 }], 116: [,, { 775: 7787, 776: 7831, 780: 357, 803: 7789, 806: 539, 807: 355, 813: 7793, 817: 7791 }], 117: [,, { 768: 249, 769: 250, 770: 251, 771: 361, 772: 363, 774: 365, 776: 252, 777: 7911, 778: 367, 779: 369, 780: 468, 783: 533, 785: 535, 795: 432, 803: 7909, 804: 7795, 808: 371, 813: 7799, 816: 7797 }], 118: [,, { 771: 7805, 803: 7807 }], 119: [,, { 768: 7809, 769: 7811, 770: 373, 775: 7815, 776: 7813, 778: 7832, 803: 7817 }], 120: [,, { 775: 7819, 776: 7821 }], 121: [,, { 768: 7923, 769: 253, 770: 375, 771: 7929, 772: 563, 775: 7823, 776: 255, 777: 7927, 778: 7833, 803: 7925 }], 122: [,, { 769: 378, 770: 7825, 775: 380, 780: 382, 803: 7827, 817: 7829 }], 160: [[32], 256], 168: [[32, 776], 256, { 768: 8173, 769: 901, 834: 8129 }], 170: [[97], 256], 175: [[32, 772], 256], 178: [[50], 256], 179: [[51], 256], 180: [[32, 769], 256], 181: [[956], 256], 184: [[32, 807], 256], 185: [[49], 256], 186: [[111], 256], 188: [[49, 8260, 52], 256], 189: [[49, 8260, 50], 256], 190: [[51, 8260, 52], 256], 192: [[65, 768]], 193: [[65, 769]], 194: [[65, 770],, { 768: 7846, 769: 7844, 771: 7850, 777: 7848 }], 195: [[65, 771]], 196: [[65, 776],, { 772: 478 }], 197: [[65, 778],, { 769: 506 }], 198: [,, { 769: 508, 772: 482 }], 199: [[67, 807],, { 769: 7688 }], 200: [[69, 768]], 201: [[69, 769]], 202: [[69, 770],, { 768: 7872, 769: 7870, 771: 7876, 777: 7874 }], 203: [[69, 776]], 204: [[73, 768]], 205: [[73, 769]], 206: [[73, 770]], 207: [[73, 776],, { 769: 7726 }], 209: [[78, 771]], 210: [[79, 768]], 211: [[79, 769]], 212: [[79, 770],, { 768: 7890, 769: 7888, 771: 7894, 777: 7892 }], 213: [[79, 771],, { 769: 7756, 772: 556, 776: 7758 }], 214: [[79, 776],, { 772: 554 }], 216: [,, { 769: 510 }], 217: [[85, 768]], 218: [[85, 769]], 219: [[85, 770]], 220: [[85, 776],, { 768: 475, 769: 471, 772: 469, 780: 473 }], 221: [[89, 769]], 224: [[97, 768]], 225: [[97, 769]], 226: [[97, 770],, { 768: 7847, 769: 7845, 771: 7851, 777: 7849 }], 227: [[97, 771]], 228: [[97, 776],, { 772: 479 }], 229: [[97, 778],, { 769: 507 }], 230: [,, { 769: 509, 772: 483 }], 231: [[99, 807],, { 769: 7689 }], 232: [[101, 768]], 233: [[101, 769]], 234: [[101, 770],, { 768: 7873, 769: 7871, 771: 7877, 777: 7875 }], 235: [[101, 776]], 236: [[105, 768]], 237: [[105, 769]], 238: [[105, 770]], 239: [[105, 776],, { 769: 7727 }], 241: [[110, 771]], 242: [[111, 768]], 243: [[111, 769]], 244: [[111, 770],, { 768: 7891, 769: 7889, 771: 7895, 777: 7893 }], 245: [[111, 771],, { 769: 7757, 772: 557, 776: 7759 }], 246: [[111, 776],, { 772: 555 }], 248: [,, { 769: 511 }], 249: [[117, 768]], 250: [[117, 769]], 251: [[117, 770]], 252: [[117, 776],, { 768: 476, 769: 472, 772: 470, 780: 474 }], 253: [[121, 769]], 255: [[121, 776]] }, 256: { 256: [[65, 772]], 257: [[97, 772]], 258: [[65, 774],, { 768: 7856, 769: 7854, 771: 7860, 777: 7858 }], 259: [[97, 774],, { 768: 7857, 769: 7855, 771: 7861, 777: 7859 }], 260: [[65, 808]], 261: [[97, 808]], 262: [[67, 769]], 263: [[99, 769]], 264: [[67, 770]], 265: [[99, 770]], 266: [[67, 775]], 267: [[99, 775]], 268: [[67, 780]], 269: [[99, 780]], 270: [[68, 780]], 271: [[100, 780]], 274: [[69, 772],, { 768: 7700, 769: 7702 }], 275: [[101, 772],, { 768: 7701, 769: 7703 }], 276: [[69, 774]], 277: [[101, 774]], 278: [[69, 775]], 279: [[101, 775]], 280: [[69, 808]], 281: [[101, 808]], 282: [[69, 780]], 283: [[101, 780]], 284: [[71, 770]], 285: [[103, 770]], 286: [[71, 774]], 287: [[103, 774]], 288: [[71, 775]], 289: [[103, 775]], 290: [[71, 807]], 291: [[103, 807]], 292: [[72, 770]], 293: [[104, 770]], 296: [[73, 771]], 297: [[105, 771]], 298: [[73, 772]], 299: [[105, 772]], 300: [[73, 774]], 301: [[105, 774]], 302: [[73, 808]], 303: [[105, 808]], 304: [[73, 775]], 306: [[73, 74], 256], 307: [[105, 106], 256], 308: [[74, 770]], 309: [[106, 770]], 310: [[75, 807]], 311: [[107, 807]], 313: [[76, 769]], 314: [[108, 769]], 315: [[76, 807]], 316: [[108, 807]], 317: [[76, 780]], 318: [[108, 780]], 319: [[76, 183], 256], 320: [[108, 183], 256], 323: [[78, 769]], 324: [[110, 769]], 325: [[78, 807]], 326: [[110, 807]], 327: [[78, 780]], 328: [[110, 780]], 329: [[700, 110], 256], 332: [[79, 772],, { 768: 7760, 769: 7762 }], 333: [[111, 772],, { 768: 7761, 769: 7763 }], 334: [[79, 774]], 335: [[111, 774]], 336: [[79, 779]], 337: [[111, 779]], 340: [[82, 769]], 341: [[114, 769]], 342: [[82, 807]], 343: [[114, 807]], 344: [[82, 780]], 345: [[114, 780]], 346: [[83, 769],, { 775: 7780 }], 347: [[115, 769],, { 775: 7781 }], 348: [[83, 770]], 349: [[115, 770]], 350: [[83, 807]], 351: [[115, 807]], 352: [[83, 780],, { 775: 7782 }], 353: [[115, 780],, { 775: 7783 }], 354: [[84, 807]], 355: [[116, 807]], 356: [[84, 780]], 357: [[116, 780]], 360: [[85, 771],, { 769: 7800 }], 361: [[117, 771],, { 769: 7801 }], 362: [[85, 772],, { 776: 7802 }], 363: [[117, 772],, { 776: 7803 }], 364: [[85, 774]], 365: [[117, 774]], 366: [[85, 778]], 367: [[117, 778]], 368: [[85, 779]], 369: [[117, 779]], 370: [[85, 808]], 371: [[117, 808]], 372: [[87, 770]], 373: [[119, 770]], 374: [[89, 770]], 375: [[121, 770]], 376: [[89, 776]], 377: [[90, 769]], 378: [[122, 769]], 379: [[90, 775]], 380: [[122, 775]], 381: [[90, 780]], 382: [[122, 780]], 383: [[115], 256, { 775: 7835 }], 416: [[79, 795],, { 768: 7900, 769: 7898, 771: 7904, 777: 7902, 803: 7906 }], 417: [[111, 795],, { 768: 7901, 769: 7899, 771: 7905, 777: 7903, 803: 7907 }], 431: [[85, 795],, { 768: 7914, 769: 7912, 771: 7918, 777: 7916, 803: 7920 }], 432: [[117, 795],, { 768: 7915, 769: 7913, 771: 7919, 777: 7917, 803: 7921 }], 439: [,, { 780: 494 }], 452: [[68, 381], 256], 453: [[68, 382], 256], 454: [[100, 382], 256], 455: [[76, 74], 256], 456: [[76, 106], 256], 457: [[108, 106], 256], 458: [[78, 74], 256], 459: [[78, 106], 256], 460: [[110, 106], 256], 461: [[65, 780]], 462: [[97, 780]], 463: [[73, 780]], 464: [[105, 780]], 465: [[79, 780]], 466: [[111, 780]], 467: [[85, 780]], 468: [[117, 780]], 469: [[220, 772]], 470: [[252, 772]], 471: [[220, 769]], 472: [[252, 769]], 473: [[220, 780]], 474: [[252, 780]], 475: [[220, 768]], 476: [[252, 768]], 478: [[196, 772]], 479: [[228, 772]], 480: [[550, 772]], 481: [[551, 772]], 482: [[198, 772]], 483: [[230, 772]], 486: [[71, 780]], 487: [[103, 780]], 488: [[75, 780]], 489: [[107, 780]], 490: [[79, 808],, { 772: 492 }], 491: [[111, 808],, { 772: 493 }], 492: [[490, 772]], 493: [[491, 772]], 494: [[439, 780]], 495: [[658, 780]], 496: [[106, 780]], 497: [[68, 90], 256], 498: [[68, 122], 256], 499: [[100, 122], 256], 500: [[71, 769]], 501: [[103, 769]], 504: [[78, 768]], 505: [[110, 768]], 506: [[197, 769]], 507: [[229, 769]], 508: [[198, 769]], 509: [[230, 769]], 510: [[216, 769]], 511: [[248, 769]], 66045: [, 220] }, 512: { 512: [[65, 783]], 513: [[97, 783]], 514: [[65, 785]], 515: [[97, 785]], 516: [[69, 783]], 517: [[101, 783]], 518: [[69, 785]], 519: [[101, 785]], 520: [[73, 783]], 521: [[105, 783]], 522: [[73, 785]], 523: [[105, 785]], 524: [[79, 783]], 525: [[111, 783]], 526: [[79, 785]], 527: [[111, 785]], 528: [[82, 783]], 529: [[114, 783]], 530: [[82, 785]], 531: [[114, 785]], 532: [[85, 783]], 533: [[117, 783]], 534: [[85, 785]], 535: [[117, 785]], 536: [[83, 806]], 537: [[115, 806]], 538: [[84, 806]], 539: [[116, 806]], 542: [[72, 780]], 543: [[104, 780]], 550: [[65, 775],, { 772: 480 }], 551: [[97, 775],, { 772: 481 }], 552: [[69, 807],, { 774: 7708 }], 553: [[101, 807],, { 774: 7709 }], 554: [[214, 772]], 555: [[246, 772]], 556: [[213, 772]], 557: [[245, 772]], 558: [[79, 775],, { 772: 560 }], 559: [[111, 775],, { 772: 561 }], 560: [[558, 772]], 561: [[559, 772]], 562: [[89, 772]], 563: [[121, 772]], 658: [,, { 780: 495 }], 688: [[104], 256], 689: [[614], 256], 690: [[106], 256], 691: [[114], 256], 692: [[633], 256], 693: [[635], 256], 694: [[641], 256], 695: [[119], 256], 696: [[121], 256], 728: [[32, 774], 256], 729: [[32, 775], 256], 730: [[32, 778], 256], 731: [[32, 808], 256], 732: [[32, 771], 256], 733: [[32, 779], 256], 736: [[611], 256], 737: [[108], 256], 738: [[115], 256], 739: [[120], 256], 740: [[661], 256], 66272: [, 220] }, 768: { 768: [, 230], 769: [, 230], 770: [, 230], 771: [, 230], 772: [, 230], 773: [, 230], 774: [, 230], 775: [, 230], 776: [, 230, { 769: 836 }], 777: [, 230], 778: [, 230], 779: [, 230], 780: [, 230], 781: [, 230], 782: [, 230], 783: [, 230], 784: [, 230], 785: [, 230], 786: [, 230], 787: [, 230], 788: [, 230], 789: [, 232], 790: [, 220], 791: [, 220], 792: [, 220], 793: [, 220], 794: [, 232], 795: [, 216], 796: [, 220], 797: [, 220], 798: [, 220], 799: [, 220], 800: [, 220], 801: [, 202], 802: [, 202], 803: [, 220], 804: [, 220], 805: [, 220], 806: [, 220], 807: [, 202], 808: [, 202], 809: [, 220], 810: [, 220], 811: [, 220], 812: [, 220], 813: [, 220], 814: [, 220], 815: [, 220], 816: [, 220], 817: [, 220], 818: [, 220], 819: [, 220], 820: [, 1], 821: [, 1], 822: [, 1], 823: [, 1], 824: [, 1], 825: [, 220], 826: [, 220], 827: [, 220], 828: [, 220], 829: [, 230], 830: [, 230], 831: [, 230], 832: [[768], 230], 833: [[769], 230], 834: [, 230], 835: [[787], 230], 836: [[776, 769], 230], 837: [, 240], 838: [, 230], 839: [, 220], 840: [, 220], 841: [, 220], 842: [, 230], 843: [, 230], 844: [, 230], 845: [, 220], 846: [, 220], 848: [, 230], 849: [, 230], 850: [, 230], 851: [, 220], 852: [, 220], 853: [, 220], 854: [, 220], 855: [, 230], 856: [, 232], 857: [, 220], 858: [, 220], 859: [, 230], 860: [, 233], 861: [, 234], 862: [, 234], 863: [, 233], 864: [, 234], 865: [, 234], 866: [, 233], 867: [, 230], 868: [, 230], 869: [, 230], 870: [, 230], 871: [, 230], 872: [, 230], 873: [, 230], 874: [, 230], 875: [, 230], 876: [, 230], 877: [, 230], 878: [, 230], 879: [, 230], 884: [[697]], 890: [[32, 837], 256], 894: [[59]], 900: [[32, 769], 256], 901: [[168, 769]], 902: [[913, 769]], 903: [[183]], 904: [[917, 769]], 905: [[919, 769]], 906: [[921, 769]], 908: [[927, 769]], 910: [[933, 769]], 911: [[937, 769]], 912: [[970, 769]], 913: [,, { 768: 8122, 769: 902, 772: 8121, 774: 8120, 787: 7944, 788: 7945, 837: 8124 }], 917: [,, { 768: 8136, 769: 904, 787: 7960, 788: 7961 }], 919: [,, { 768: 8138, 769: 905, 787: 7976, 788: 7977, 837: 8140 }], 921: [,, { 768: 8154, 769: 906, 772: 8153, 774: 8152, 776: 938, 787: 7992, 788: 7993 }], 927: [,, { 768: 8184, 769: 908, 787: 8008, 788: 8009 }], 929: [,, { 788: 8172 }], 933: [,, { 768: 8170, 769: 910, 772: 8169, 774: 8168, 776: 939, 788: 8025 }], 937: [,, { 768: 8186, 769: 911, 787: 8040, 788: 8041, 837: 8188 }], 938: [[921, 776]], 939: [[933, 776]], 940: [[945, 769],, { 837: 8116 }], 941: [[949, 769]], 942: [[951, 769],, { 837: 8132 }], 943: [[953, 769]], 944: [[971, 769]], 945: [,, { 768: 8048, 769: 940, 772: 8113, 774: 8112, 787: 7936, 788: 7937, 834: 8118, 837: 8115 }], 949: [,, { 768: 8050, 769: 941, 787: 7952, 788: 7953 }], 951: [,, { 768: 8052, 769: 942, 787: 7968, 788: 7969, 834: 8134, 837: 8131 }], 953: [,, { 768: 8054, 769: 943, 772: 8145, 774: 8144, 776: 970, 787: 7984, 788: 7985, 834: 8150 }], 959: [,, { 768: 8056, 769: 972, 787: 8e3, 788: 8001 }], 961: [,, { 787: 8164, 788: 8165 }], 965: [,, { 768: 8058, 769: 973, 772: 8161, 774: 8160, 776: 971, 787: 8016, 788: 8017, 834: 8166 }], 969: [,, { 768: 8060, 769: 974, 787: 8032, 788: 8033, 834: 8182, 837: 8179 }], 970: [[953, 776],, { 768: 8146, 769: 912, 834: 8151 }], 971: [[965, 776],, { 768: 8162, 769: 944, 834: 8167 }], 972: [[959, 769]], 973: [[965, 769]], 974: [[969, 769],, { 837: 8180 }], 976: [[946], 256], 977: [[952], 256], 978: [[933], 256, { 769: 979, 776: 980 }], 979: [[978, 769]], 980: [[978, 776]], 981: [[966], 256], 982: [[960], 256], 1008: [[954], 256], 1009: [[961], 256], 1010: [[962], 256], 1012: [[920], 256], 1013: [[949], 256], 1017: [[931], 256], 66422: [, 230], 66423: [, 230], 66424: [, 230], 66425: [, 230], 66426: [, 230] }, 1024: { 1024: [[1045, 768]], 1025: [[1045, 776]], 1027: [[1043, 769]], 1030: [,, { 776: 1031 }], 1031: [[1030, 776]], 1036: [[1050, 769]], 1037: [[1048, 768]], 1038: [[1059, 774]], 1040: [,, { 774: 1232, 776: 1234 }], 1043: [,, { 769: 1027 }], 1045: [,, { 768: 1024, 774: 1238, 776: 1025 }], 1046: [,, { 774: 1217, 776: 1244 }], 1047: [,, { 776: 1246 }], 1048: [,, { 768: 1037, 772: 1250, 774: 1049, 776: 1252 }], 1049: [[1048, 774]], 1050: [,, { 769: 1036 }], 1054: [,, { 776: 1254 }], 1059: [,, { 772: 1262, 774: 1038, 776: 1264, 779: 1266 }], 1063: [,, { 776: 1268 }], 1067: [,, { 776: 1272 }], 1069: [,, { 776: 1260 }], 1072: [,, { 774: 1233, 776: 1235 }], 1075: [,, { 769: 1107 }], 1077: [,, { 768: 1104, 774: 1239, 776: 1105 }], 1078: [,, { 774: 1218, 776: 1245 }], 1079: [,, { 776: 1247 }], 1080: [,, { 768: 1117, 772: 1251, 774: 1081, 776: 1253 }], 1081: [[1080, 774]], 1082: [,, { 769: 1116 }], 1086: [,, { 776: 1255 }], 1091: [,, { 772: 1263, 774: 1118, 776: 1265, 779: 1267 }], 1095: [,, { 776: 1269 }], 1099: [,, { 776: 1273 }], 1101: [,, { 776: 1261 }], 1104: [[1077, 768]], 1105: [[1077, 776]], 1107: [[1075, 769]], 1110: [,, { 776: 1111 }], 1111: [[1110, 776]], 1116: [[1082, 769]], 1117: [[1080, 768]], 1118: [[1091, 774]], 1140: [,, { 783: 1142 }], 1141: [,, { 783: 1143 }], 1142: [[1140, 783]], 1143: [[1141, 783]], 1155: [, 230], 1156: [, 230], 1157: [, 230], 1158: [, 230], 1159: [, 230], 1217: [[1046, 774]], 1218: [[1078, 774]], 1232: [[1040, 774]], 1233: [[1072, 774]], 1234: [[1040, 776]], 1235: [[1072, 776]], 1238: [[1045, 774]], 1239: [[1077, 774]], 1240: [,, { 776: 1242 }], 1241: [,, { 776: 1243 }], 1242: [[1240, 776]], 1243: [[1241, 776]], 1244: [[1046, 776]], 1245: [[1078, 776]], 1246: [[1047, 776]], 1247: [[1079, 776]], 1250: [[1048, 772]], 1251: [[1080, 772]], 1252: [[1048, 776]], 1253: [[1080, 776]], 1254: [[1054, 776]], 1255: [[1086, 776]], 1256: [,, { 776: 1258 }], 1257: [,, { 776: 1259 }], 1258: [[1256, 776]], 1259: [[1257, 776]], 1260: [[1069, 776]], 1261: [[1101, 776]], 1262: [[1059, 772]], 1263: [[1091, 772]], 1264: [[1059, 776]], 1265: [[1091, 776]], 1266: [[1059, 779]], 1267: [[1091, 779]], 1268: [[1063, 776]], 1269: [[1095, 776]], 1272: [[1067, 776]], 1273: [[1099, 776]] }, 1280: { 1415: [[1381, 1410], 256], 1425: [, 220], 1426: [, 230], 1427: [, 230], 1428: [, 230], 1429: [, 230], 1430: [, 220], 1431: [, 230], 1432: [, 230], 1433: [, 230], 1434: [, 222], 1435: [, 220], 1436: [, 230], 1437: [, 230], 1438: [, 230], 1439: [, 230], 1440: [, 230], 1441: [, 230], 1442: [, 220], 1443: [, 220], 1444: [, 220], 1445: [, 220], 1446: [, 220], 1447: [, 220], 1448: [, 230], 1449: [, 230], 1450: [, 220], 1451: [, 230], 1452: [, 230], 1453: [, 222], 1454: [, 228], 1455: [, 230], 1456: [, 10], 1457: [, 11], 1458: [, 12], 1459: [, 13], 1460: [, 14], 1461: [, 15], 1462: [, 16], 1463: [, 17], 1464: [, 18], 1465: [, 19], 1466: [, 19], 1467: [, 20], 1468: [, 21], 1469: [, 22], 1471: [, 23], 1473: [, 24], 1474: [, 25], 1476: [, 230], 1477: [, 220], 1479: [, 18] }, 1536: { 1552: [, 230], 1553: [, 230], 1554: [, 230], 1555: [, 230], 1556: [, 230], 1557: [, 230], 1558: [, 230], 1559: [, 230], 1560: [, 30], 1561: [, 31], 1562: [, 32], 1570: [[1575, 1619]], 1571: [[1575, 1620]], 1572: [[1608, 1620]], 1573: [[1575, 1621]], 1574: [[1610, 1620]], 1575: [,, { 1619: 1570, 1620: 1571, 1621: 1573 }], 1608: [,, { 1620: 1572 }], 1610: [,, { 1620: 1574 }], 1611: [, 27], 1612: [, 28], 1613: [, 29], 1614: [, 30], 1615: [, 31], 1616: [, 32], 1617: [, 33], 1618: [, 34], 1619: [, 230], 1620: [, 230], 1621: [, 220], 1622: [, 220], 1623: [, 230], 1624: [, 230], 1625: [, 230], 1626: [, 230], 1627: [, 230], 1628: [, 220], 1629: [, 230], 1630: [, 230], 1631: [, 220], 1648: [, 35], 1653: [[1575, 1652], 256], 1654: [[1608, 1652], 256], 1655: [[1735, 1652], 256], 1656: [[1610, 1652], 256], 1728: [[1749, 1620]], 1729: [,, { 1620: 1730 }], 1730: [[1729, 1620]], 1746: [,, { 1620: 1747 }], 1747: [[1746, 1620]], 1749: [,, { 1620: 1728 }], 1750: [, 230], 1751: [, 230], 1752: [, 230], 1753: [, 230], 1754: [, 230], 1755: [, 230], 1756: [, 230], 1759: [, 230], 1760: [, 230], 1761: [, 230], 1762: [, 230], 1763: [, 220], 1764: [, 230], 1767: [, 230], 1768: [, 230], 1770: [, 220], 1771: [, 230], 1772: [, 230], 1773: [, 220] }, 1792: { 1809: [, 36], 1840: [, 230], 1841: [, 220], 1842: [, 230], 1843: [, 230], 1844: [, 220], 1845: [, 230], 1846: [, 230], 1847: [, 220], 1848: [, 220], 1849: [, 220], 1850: [, 230], 1851: [, 220], 1852: [, 220], 1853: [, 230], 1854: [, 220], 1855: [, 230], 1856: [, 230], 1857: [, 230], 1858: [, 220], 1859: [, 230], 1860: [, 220], 1861: [, 230], 1862: [, 220], 1863: [, 230], 1864: [, 220], 1865: [, 230], 1866: [, 230], 2027: [, 230], 2028: [, 230], 2029: [, 230], 2030: [, 230], 2031: [, 230], 2032: [, 230], 2033: [, 230], 2034: [, 220], 2035: [, 230] }, 2048: { 2070: [, 230], 2071: [, 230], 2072: [, 230], 2073: [, 230], 2075: [, 230], 2076: [, 230], 2077: [, 230], 2078: [, 230], 2079: [, 230], 2080: [, 230], 2081: [, 230], 2082: [, 230], 2083: [, 230], 2085: [, 230], 2086: [, 230], 2087: [, 230], 2089: [, 230], 2090: [, 230], 2091: [, 230], 2092: [, 230], 2093: [, 230], 2137: [, 220], 2138: [, 220], 2139: [, 220], 2276: [, 230], 2277: [, 230], 2278: [, 220], 2279: [, 230], 2280: [, 230], 2281: [, 220], 2282: [, 230], 2283: [, 230], 2284: [, 230], 2285: [, 220], 2286: [, 220], 2287: [, 220], 2288: [, 27], 2289: [, 28], 2290: [, 29], 2291: [, 230], 2292: [, 230], 2293: [, 230], 2294: [, 220], 2295: [, 230], 2296: [, 230], 2297: [, 220], 2298: [, 220], 2299: [, 230], 2300: [, 230], 2301: [, 230], 2302: [, 230], 2303: [, 230] }, 2304: { 2344: [,, { 2364: 2345 }], 2345: [[2344, 2364]], 2352: [,, { 2364: 2353 }], 2353: [[2352, 2364]], 2355: [,, { 2364: 2356 }], 2356: [[2355, 2364]], 2364: [, 7], 2381: [, 9], 2385: [, 230], 2386: [, 220], 2387: [, 230], 2388: [, 230], 2392: [[2325, 2364], 512], 2393: [[2326, 2364], 512], 2394: [[2327, 2364], 512], 2395: [[2332, 2364], 512], 2396: [[2337, 2364], 512], 2397: [[2338, 2364], 512], 2398: [[2347, 2364], 512], 2399: [[2351, 2364], 512], 2492: [, 7], 2503: [,, { 2494: 2507, 2519: 2508 }], 2507: [[2503, 2494]], 2508: [[2503, 2519]], 2509: [, 9], 2524: [[2465, 2492], 512], 2525: [[2466, 2492], 512], 2527: [[2479, 2492], 512] }, 2560: { 2611: [[2610, 2620], 512], 2614: [[2616, 2620], 512], 2620: [, 7], 2637: [, 9], 2649: [[2582, 2620], 512], 2650: [[2583, 2620], 512], 2651: [[2588, 2620], 512], 2654: [[2603, 2620], 512], 2748: [, 7], 2765: [, 9], 68109: [, 220], 68111: [, 230], 68152: [, 230], 68153: [, 1], 68154: [, 220], 68159: [, 9], 68325: [, 230], 68326: [, 220] }, 2816: { 2876: [, 7], 2887: [,, { 2878: 2891, 2902: 2888, 2903: 2892 }], 2888: [[2887, 2902]], 2891: [[2887, 2878]], 2892: [[2887, 2903]], 2893: [, 9], 2908: [[2849, 2876], 512], 2909: [[2850, 2876], 512], 2962: [,, { 3031: 2964 }], 2964: [[2962, 3031]], 3014: [,, { 3006: 3018, 3031: 3020 }], 3015: [,, { 3006: 3019 }], 3018: [[3014, 3006]], 3019: [[3015, 3006]], 3020: [[3014, 3031]], 3021: [, 9] }, 3072: { 3142: [,, { 3158: 3144 }], 3144: [[3142, 3158]], 3149: [, 9], 3157: [, 84], 3158: [, 91], 3260: [, 7], 3263: [,, { 3285: 3264 }], 3264: [[3263, 3285]], 3270: [,, { 3266: 3274, 3285: 3271, 3286: 3272 }], 3271: [[3270, 3285]], 3272: [[3270, 3286]], 3274: [[3270, 3266],, { 3285: 3275 }], 3275: [[3274, 3285]], 3277: [, 9] }, 3328: { 3398: [,, { 3390: 3402, 3415: 3404 }], 3399: [,, { 3390: 3403 }], 3402: [[3398, 3390]], 3403: [[3399, 3390]], 3404: [[3398, 3415]], 3405: [, 9], 3530: [, 9], 3545: [,, { 3530: 3546, 3535: 3548, 3551: 3550 }], 3546: [[3545, 3530]], 3548: [[3545, 3535],, { 3530: 3549 }], 3549: [[3548, 3530]], 3550: [[3545, 3551]] }, 3584: { 3635: [[3661, 3634], 256], 3640: [, 103], 3641: [, 103], 3642: [, 9], 3656: [, 107], 3657: [, 107], 3658: [, 107], 3659: [, 107], 3763: [[3789, 3762], 256], 3768: [, 118], 3769: [, 118], 3784: [, 122], 3785: [, 122], 3786: [, 122], 3787: [, 122], 3804: [[3755, 3737], 256], 3805: [[3755, 3745], 256] }, 3840: { 3852: [[3851], 256], 3864: [, 220], 3865: [, 220], 3893: [, 220], 3895: [, 220], 3897: [, 216], 3907: [[3906, 4023], 512], 3917: [[3916, 4023], 512], 3922: [[3921, 4023], 512], 3927: [[3926, 4023], 512], 3932: [[3931, 4023], 512], 3945: [[3904, 4021], 512], 3953: [, 129], 3954: [, 130], 3955: [[3953, 3954], 512], 3956: [, 132], 3957: [[3953, 3956], 512], 3958: [[4018, 3968], 512], 3959: [[4018, 3969], 256], 3960: [[4019, 3968], 512], 3961: [[4019, 3969], 256], 3962: [, 130], 3963: [, 130], 3964: [, 130], 3965: [, 130], 3968: [, 130], 3969: [[3953, 3968], 512], 3970: [, 230], 3971: [, 230], 3972: [, 9], 3974: [, 230], 3975: [, 230], 3987: [[3986, 4023], 512], 3997: [[3996, 4023], 512], 4002: [[4001, 4023], 512], 4007: [[4006, 4023], 512], 4012: [[4011, 4023], 512], 4025: [[3984, 4021], 512], 4038: [, 220] }, 4096: { 4133: [,, { 4142: 4134 }], 4134: [[4133, 4142]], 4151: [, 7], 4153: [, 9], 4154: [, 9], 4237: [, 220], 4348: [[4316], 256], 69702: [, 9], 69759: [, 9], 69785: [,, { 69818: 69786 }], 69786: [[69785, 69818]], 69787: [,, { 69818: 69788 }], 69788: [[69787, 69818]], 69797: [,, { 69818: 69803 }], 69803: [[69797, 69818]], 69817: [, 9], 69818: [, 7] }, 4352: { 69888: [, 230], 69889: [, 230], 69890: [, 230], 69934: [[69937, 69927]], 69935: [[69938, 69927]], 69937: [,, { 69927: 69934 }], 69938: [,, { 69927: 69935 }], 69939: [, 9], 69940: [, 9], 70003: [, 7], 70080: [, 9] }, 4608: { 70197: [, 9], 70198: [, 7], 70377: [, 7], 70378: [, 9] }, 4864: { 4957: [, 230], 4958: [, 230], 4959: [, 230], 70460: [, 7], 70471: [,, { 70462: 70475, 70487: 70476 }], 70475: [[70471, 70462]], 70476: [[70471, 70487]], 70477: [, 9], 70502: [, 230], 70503: [, 230], 70504: [, 230], 70505: [, 230], 70506: [, 230], 70507: [, 230], 70508: [, 230], 70512: [, 230], 70513: [, 230], 70514: [, 230], 70515: [, 230], 70516: [, 230] }, 5120: { 70841: [,, { 70832: 70844, 70842: 70843, 70845: 70846 }], 70843: [[70841, 70842]], 70844: [[70841, 70832]], 70846: [[70841, 70845]], 70850: [, 9], 70851: [, 7] }, 5376: { 71096: [,, { 71087: 71098 }], 71097: [,, { 71087: 71099 }], 71098: [[71096, 71087]], 71099: [[71097, 71087]], 71103: [, 9], 71104: [, 7] }, 5632: { 71231: [, 9], 71350: [, 9], 71351: [, 7] }, 5888: { 5908: [, 9], 5940: [, 9], 6098: [, 9], 6109: [, 230] }, 6144: { 6313: [, 228] }, 6400: { 6457: [, 222], 6458: [, 230], 6459: [, 220] }, 6656: { 6679: [, 230], 6680: [, 220], 6752: [, 9], 6773: [, 230], 6774: [, 230], 6775: [, 230], 6776: [, 230], 6777: [, 230], 6778: [, 230], 6779: [, 230], 6780: [, 230], 6783: [, 220], 6832: [, 230], 6833: [, 230], 6834: [, 230], 6835: [, 230], 6836: [, 230], 6837: [, 220], 6838: [, 220], 6839: [, 220], 6840: [, 220], 6841: [, 220], 6842: [, 220], 6843: [, 230], 6844: [, 230], 6845: [, 220] }, 6912: { 6917: [,, { 6965: 6918 }], 6918: [[6917, 6965]], 6919: [,, { 6965: 6920 }], 6920: [[6919, 6965]], 6921: [,, { 6965: 6922 }], 6922: [[6921, 6965]], 6923: [,, { 6965: 6924 }], 6924: [[6923, 6965]], 6925: [,, { 6965: 6926 }], 6926: [[6925, 6965]], 6929: [,, { 6965: 6930 }], 6930: [[6929, 6965]], 6964: [, 7], 6970: [,, { 6965: 6971 }], 6971: [[6970, 6965]], 6972: [,, { 6965: 6973 }], 6973: [[6972, 6965]], 6974: [,, { 6965: 6976 }], 6975: [,, { 6965: 6977 }], 6976: [[6974, 6965]], 6977: [[6975, 6965]], 6978: [,, { 6965: 6979 }], 6979: [[6978, 6965]], 6980: [, 9], 7019: [, 230], 7020: [, 220], 7021: [, 230], 7022: [, 230], 7023: [, 230], 7024: [, 230], 7025: [, 230], 7026: [, 230], 7027: [, 230], 7082: [, 9], 7083: [, 9], 7142: [, 7], 7154: [, 9], 7155: [, 9] }, 7168: { 7223: [, 7], 7376: [, 230], 7377: [, 230], 7378: [, 230], 7380: [, 1], 7381: [, 220], 7382: [, 220], 7383: [, 220], 7384: [, 220], 7385: [, 220], 7386: [, 230], 7387: [, 230], 7388: [, 220], 7389: [, 220], 7390: [, 220], 7391: [, 220], 7392: [, 230], 7394: [, 1], 7395: [, 1], 7396: [, 1], 7397: [, 1], 7398: [, 1], 7399: [, 1], 7400: [, 1], 7405: [, 220], 7412: [, 230], 7416: [, 230], 7417: [, 230] }, 7424: { 7468: [[65], 256], 7469: [[198], 256], 7470: [[66], 256], 7472: [[68], 256], 7473: [[69], 256], 7474: [[398], 256], 7475: [[71], 256], 7476: [[72], 256], 7477: [[73], 256], 7478: [[74], 256], 7479: [[75], 256], 7480: [[76], 256], 7481: [[77], 256], 7482: [[78], 256], 7484: [[79], 256], 7485: [[546], 256], 7486: [[80], 256], 7487: [[82], 256], 7488: [[84], 256], 7489: [[85], 256], 7490: [[87], 256], 7491: [[97], 256], 7492: [[592], 256], 7493: [[593], 256], 7494: [[7426], 256], 7495: [[98], 256], 7496: [[100], 256], 7497: [[101], 256], 7498: [[601], 256], 7499: [[603], 256], 7500: [[604], 256], 7501: [[103], 256], 7503: [[107], 256], 7504: [[109], 256], 7505: [[331], 256], 7506: [[111], 256], 7507: [[596], 256], 7508: [[7446], 256], 7509: [[7447], 256], 7510: [[112], 256], 7511: [[116], 256], 7512: [[117], 256], 7513: [[7453], 256], 7514: [[623], 256], 7515: [[118], 256], 7516: [[7461], 256], 7517: [[946], 256], 7518: [[947], 256], 7519: [[948], 256], 7520: [[966], 256], 7521: [[967], 256], 7522: [[105], 256], 7523: [[114], 256], 7524: [[117], 256], 7525: [[118], 256], 7526: [[946], 256], 7527: [[947], 256], 7528: [[961], 256], 7529: [[966], 256], 7530: [[967], 256], 7544: [[1085], 256], 7579: [[594], 256], 7580: [[99], 256], 7581: [[597], 256], 7582: [[240], 256], 7583: [[604], 256], 7584: [[102], 256], 7585: [[607], 256], 7586: [[609], 256], 7587: [[613], 256], 7588: [[616], 256], 7589: [[617], 256], 7590: [[618], 256], 7591: [[7547], 256], 7592: [[669], 256], 7593: [[621], 256], 7594: [[7557], 256], 7595: [[671], 256], 7596: [[625], 256], 7597: [[624], 256], 7598: [[626], 256], 7599: [[627], 256], 7600: [[628], 256], 7601: [[629], 256], 7602: [[632], 256], 7603: [[642], 256], 7604: [[643], 256], 7605: [[427], 256], 7606: [[649], 256], 7607: [[650], 256], 7608: [[7452], 256], 7609: [[651], 256], 7610: [[652], 256], 7611: [[122], 256], 7612: [[656], 256], 7613: [[657], 256], 7614: [[658], 256], 7615: [[952], 256], 7616: [, 230], 7617: [, 230], 7618: [, 220], 7619: [, 230], 7620: [, 230], 7621: [, 230], 7622: [, 230], 7623: [, 230], 7624: [, 230], 7625: [, 230], 7626: [, 220], 7627: [, 230], 7628: [, 230], 7629: [, 234], 7630: [, 214], 7631: [, 220], 7632: [, 202], 7633: [, 230], 7634: [, 230], 7635: [, 230], 7636: [, 230], 7637: [, 230], 7638: [, 230], 7639: [, 230], 7640: [, 230], 7641: [, 230], 7642: [, 230], 7643: [, 230], 7644: [, 230], 7645: [, 230], 7646: [, 230], 7647: [, 230], 7648: [, 230], 7649: [, 230], 7650: [, 230], 7651: [, 230], 7652: [, 230], 7653: [, 230], 7654: [, 230], 7655: [, 230], 7656: [, 230], 7657: [, 230], 7658: [, 230], 7659: [, 230], 7660: [, 230], 7661: [, 230], 7662: [, 230], 7663: [, 230], 7664: [, 230], 7665: [, 230], 7666: [, 230], 7667: [, 230], 7668: [, 230], 7669: [, 230], 7676: [, 233], 7677: [, 220], 7678: [, 230], 7679: [, 220] }, 7680: { 7680: [[65, 805]], 7681: [[97, 805]], 7682: [[66, 775]], 7683: [[98, 775]], 7684: [[66, 803]], 7685: [[98, 803]], 7686: [[66, 817]], 7687: [[98, 817]], 7688: [[199, 769]], 7689: [[231, 769]], 7690: [[68, 775]], 7691: [[100, 775]], 7692: [[68, 803]], 7693: [[100, 803]], 7694: [[68, 817]], 7695: [[100, 817]], 7696: [[68, 807]], 7697: [[100, 807]], 7698: [[68, 813]], 7699: [[100, 813]], 7700: [[274, 768]], 7701: [[275, 768]], 7702: [[274, 769]], 7703: [[275, 769]], 7704: [[69, 813]], 7705: [[101, 813]], 7706: [[69, 816]], 7707: [[101, 816]], 7708: [[552, 774]], 7709: [[553, 774]], 7710: [[70, 775]], 7711: [[102, 775]], 7712: [[71, 772]], 7713: [[103, 772]], 7714: [[72, 775]], 7715: [[104, 775]], 7716: [[72, 803]], 7717: [[104, 803]], 7718: [[72, 776]], 7719: [[104, 776]], 7720: [[72, 807]], 7721: [[104, 807]], 7722: [[72, 814]], 7723: [[104, 814]], 7724: [[73, 816]], 7725: [[105, 816]], 7726: [[207, 769]], 7727: [[239, 769]], 7728: [[75, 769]], 7729: [[107, 769]], 7730: [[75, 803]], 7731: [[107, 803]], 7732: [[75, 817]], 7733: [[107, 817]], 7734: [[76, 803],, { 772: 7736 }], 7735: [[108, 803],, { 772: 7737 }], 7736: [[7734, 772]], 7737: [[7735, 772]], 7738: [[76, 817]], 7739: [[108, 817]], 7740: [[76, 813]], 7741: [[108, 813]], 7742: [[77, 769]], 7743: [[109, 769]], 7744: [[77, 775]], 7745: [[109, 775]], 7746: [[77, 803]], 7747: [[109, 803]], 7748: [[78, 775]], 7749: [[110, 775]], 7750: [[78, 803]], 7751: [[110, 803]], 7752: [[78, 817]], 7753: [[110, 817]], 7754: [[78, 813]], 7755: [[110, 813]], 7756: [[213, 769]], 7757: [[245, 769]], 7758: [[213, 776]], 7759: [[245, 776]], 7760: [[332, 768]], 7761: [[333, 768]], 7762: [[332, 769]], 7763: [[333, 769]], 7764: [[80, 769]], 7765: [[112, 769]], 7766: [[80, 775]], 7767: [[112, 775]], 7768: [[82, 775]], 7769: [[114, 775]], 7770: [[82, 803],, { 772: 7772 }], 7771: [[114, 803],, { 772: 7773 }], 7772: [[7770, 772]], 7773: [[7771, 772]], 7774: [[82, 817]], 7775: [[114, 817]], 7776: [[83, 775]], 7777: [[115, 775]], 7778: [[83, 803],, { 775: 7784 }], 7779: [[115, 803],, { 775: 7785 }], 7780: [[346, 775]], 7781: [[347, 775]], 7782: [[352, 775]], 7783: [[353, 775]], 7784: [[7778, 775]], 7785: [[7779, 775]], 7786: [[84, 775]], 7787: [[116, 775]], 7788: [[84, 803]], 7789: [[116, 803]], 7790: [[84, 817]], 7791: [[116, 817]], 7792: [[84, 813]], 7793: [[116, 813]], 7794: [[85, 804]], 7795: [[117, 804]], 7796: [[85, 816]], 7797: [[117, 816]], 7798: [[85, 813]], 7799: [[117, 813]], 7800: [[360, 769]], 7801: [[361, 769]], 7802: [[362, 776]], 7803: [[363, 776]], 7804: [[86, 771]], 7805: [[118, 771]], 7806: [[86, 803]], 7807: [[118, 803]], 7808: [[87, 768]], 7809: [[119, 768]], 7810: [[87, 769]], 7811: [[119, 769]], 7812: [[87, 776]], 7813: [[119, 776]], 7814: [[87, 775]], 7815: [[119, 775]], 7816: [[87, 803]], 7817: [[119, 803]], 7818: [[88, 775]], 7819: [[120, 775]], 7820: [[88, 776]], 7821: [[120, 776]], 7822: [[89, 775]], 7823: [[121, 775]], 7824: [[90, 770]], 7825: [[122, 770]], 7826: [[90, 803]], 7827: [[122, 803]], 7828: [[90, 817]], 7829: [[122, 817]], 7830: [[104, 817]], 7831: [[116, 776]], 7832: [[119, 778]], 7833: [[121, 778]], 7834: [[97, 702], 256], 7835: [[383, 775]], 7840: [[65, 803],, { 770: 7852, 774: 7862 }], 7841: [[97, 803],, { 770: 7853, 774: 7863 }], 7842: [[65, 777]], 7843: [[97, 777]], 7844: [[194, 769]], 7845: [[226, 769]], 7846: [[194, 768]], 7847: [[226, 768]], 7848: [[194, 777]], 7849: [[226, 777]], 7850: [[194, 771]], 7851: [[226, 771]], 7852: [[7840, 770]], 7853: [[7841, 770]], 7854: [[258, 769]], 7855: [[259, 769]], 7856: [[258, 768]], 7857: [[259, 768]], 7858: [[258, 777]], 7859: [[259, 777]], 7860: [[258, 771]], 7861: [[259, 771]], 7862: [[7840, 774]], 7863: [[7841, 774]], 7864: [[69, 803],, { 770: 7878 }], 7865: [[101, 803],, { 770: 7879 }], 7866: [[69, 777]], 7867: [[101, 777]], 7868: [[69, 771]], 7869: [[101, 771]], 7870: [[202, 769]], 7871: [[234, 769]], 7872: [[202, 768]], 7873: [[234, 768]], 7874: [[202, 777]], 7875: [[234, 777]], 7876: [[202, 771]], 7877: [[234, 771]], 7878: [[7864, 770]], 7879: [[7865, 770]], 7880: [[73, 777]], 7881: [[105, 777]], 7882: [[73, 803]], 7883: [[105, 803]], 7884: [[79, 803],, { 770: 7896 }], 7885: [[111, 803],, { 770: 7897 }], 7886: [[79, 777]], 7887: [[111, 777]], 7888: [[212, 769]], 7889: [[244, 769]], 7890: [[212, 768]], 7891: [[244, 768]], 7892: [[212, 777]], 7893: [[244, 777]], 7894: [[212, 771]], 7895: [[244, 771]], 7896: [[7884, 770]], 7897: [[7885, 770]], 7898: [[416, 769]], 7899: [[417, 769]], 7900: [[416, 768]], 7901: [[417, 768]], 7902: [[416, 777]], 7903: [[417, 777]], 7904: [[416, 771]], 7905: [[417, 771]], 7906: [[416, 803]], 7907: [[417, 803]], 7908: [[85, 803]], 7909: [[117, 803]], 7910: [[85, 777]], 7911: [[117, 777]], 7912: [[431, 769]], 7913: [[432, 769]], 7914: [[431, 768]], 7915: [[432, 768]], 7916: [[431, 777]], 7917: [[432, 777]], 7918: [[431, 771]], 7919: [[432, 771]], 7920: [[431, 803]], 7921: [[432, 803]], 7922: [[89, 768]], 7923: [[121, 768]], 7924: [[89, 803]], 7925: [[121, 803]], 7926: [[89, 777]], 7927: [[121, 777]], 7928: [[89, 771]], 7929: [[121, 771]] }, 7936: { 7936: [[945, 787],, { 768: 7938, 769: 7940, 834: 7942, 837: 8064 }], 7937: [[945, 788],, { 768: 7939, 769: 7941, 834: 7943, 837: 8065 }], 7938: [[7936, 768],, { 837: 8066 }], 7939: [[7937, 768],, { 837: 8067 }], 7940: [[7936, 769],, { 837: 8068 }], 7941: [[7937, 769],, { 837: 8069 }], 7942: [[7936, 834],, { 837: 8070 }], 7943: [[7937, 834],, { 837: 8071 }], 7944: [[913, 787],, { 768: 7946, 769: 7948, 834: 7950, 837: 8072 }], 7945: [[913, 788],, { 768: 7947, 769: 7949, 834: 7951, 837: 8073 }], 7946: [[7944, 768],, { 837: 8074 }], 7947: [[7945, 768],, { 837: 8075 }], 7948: [[7944, 769],, { 837: 8076 }], 7949: [[7945, 769],, { 837: 8077 }], 7950: [[7944, 834],, { 837: 8078 }], 7951: [[7945, 834],, { 837: 8079 }], 7952: [[949, 787],, { 768: 7954, 769: 7956 }], 7953: [[949, 788],, { 768: 7955, 769: 7957 }], 7954: [[7952, 768]], 7955: [[7953, 768]], 7956: [[7952, 769]], 7957: [[7953, 769]], 7960: [[917, 787],, { 768: 7962, 769: 7964 }], 7961: [[917, 788],, { 768: 7963, 769: 7965 }], 7962: [[7960, 768]], 7963: [[7961, 768]], 7964: [[7960, 769]], 7965: [[7961, 769]], 7968: [[951, 787],, { 768: 7970, 769: 7972, 834: 7974, 837: 8080 }], 7969: [[951, 788],, { 768: 7971, 769: 7973, 834: 7975, 837: 8081 }], 7970: [[7968, 768],, { 837: 8082 }], 7971: [[7969, 768],, { 837: 8083 }], 7972: [[7968, 769],, { 837: 8084 }], 7973: [[7969, 769],, { 837: 8085 }], 7974: [[7968, 834],, { 837: 8086 }], 7975: [[7969, 834],, { 837: 8087 }], 7976: [[919, 787],, { 768: 7978, 769: 7980, 834: 7982, 837: 8088 }], 7977: [[919, 788],, { 768: 7979, 769: 7981, 834: 7983, 837: 8089 }], 7978: [[7976, 768],, { 837: 8090 }], 7979: [[7977, 768],, { 837: 8091 }], 7980: [[7976, 769],, { 837: 8092 }], 7981: [[7977, 769],, { 837: 8093 }], 7982: [[7976, 834],, { 837: 8094 }], 7983: [[7977, 834],, { 837: 8095 }], 7984: [[953, 787],, { 768: 7986, 769: 7988, 834: 7990 }], 7985: [[953, 788],, { 768: 7987, 769: 7989, 834: 7991 }], 7986: [[7984, 768]], 7987: [[7985, 768]], 7988: [[7984, 769]], 7989: [[7985, 769]], 7990: [[7984, 834]], 7991: [[7985, 834]], 7992: [[921, 787],, { 768: 7994, 769: 7996, 834: 7998 }], 7993: [[921, 788],, { 768: 7995, 769: 7997, 834: 7999 }], 7994: [[7992, 768]], 7995: [[7993, 768]], 7996: [[7992, 769]], 7997: [[7993, 769]], 7998: [[7992, 834]], 7999: [[7993, 834]], 8e3: [[959, 787],, { 768: 8002, 769: 8004 }], 8001: [[959, 788],, { 768: 8003, 769: 8005 }], 8002: [[8e3, 768]], 8003: [[8001, 768]], 8004: [[8e3, 769]], 8005: [[8001, 769]], 8008: [[927, 787],, { 768: 8010, 769: 8012 }], 8009: [[927, 788],, { 768: 8011, 769: 8013 }], 8010: [[8008, 768]], 8011: [[8009, 768]], 8012: [[8008, 769]], 8013: [[8009, 769]], 8016: [[965, 787],, { 768: 8018, 769: 8020, 834: 8022 }], 8017: [[965, 788],, { 768: 8019, 769: 8021, 834: 8023 }], 8018: [[8016, 768]], 8019: [[8017, 768]], 8020: [[8016, 769]], 8021: [[8017, 769]], 8022: [[8016, 834]], 8023: [[8017, 834]], 8025: [[933, 788],, { 768: 8027, 769: 8029, 834: 8031 }], 8027: [[8025, 768]], 8029: [[8025, 769]], 8031: [[8025, 834]], 8032: [[969, 787],, { 768: 8034, 769: 8036, 834: 8038, 837: 8096 }], 8033: [[969, 788],, { 768: 8035, 769: 8037, 834: 8039, 837: 8097 }], 8034: [[8032, 768],, { 837: 8098 }], 8035: [[8033, 768],, { 837: 8099 }], 8036: [[8032, 769],, { 837: 8100 }], 8037: [[8033, 769],, { 837: 8101 }], 8038: [[8032, 834],, { 837: 8102 }], 8039: [[8033, 834],, { 837: 8103 }], 8040: [[937, 787],, { 768: 8042, 769: 8044, 834: 8046, 837: 8104 }], 8041: [[937, 788],, { 768: 8043, 769: 8045, 834: 8047, 837: 8105 }], 8042: [[8040, 768],, { 837: 8106 }], 8043: [[8041, 768],, { 837: 8107 }], 8044: [[8040, 769],, { 837: 8108 }], 8045: [[8041, 769],, { 837: 8109 }], 8046: [[8040, 834],, { 837: 8110 }], 8047: [[8041, 834],, { 837: 8111 }], 8048: [[945, 768],, { 837: 8114 }], 8049: [[940]], 8050: [[949, 768]], 8051: [[941]], 8052: [[951, 768],, { 837: 8130 }], 8053: [[942]], 8054: [[953, 768]], 8055: [[943]], 8056: [[959, 768]], 8057: [[972]], 8058: [[965, 768]], 8059: [[973]], 8060: [[969, 768],, { 837: 8178 }], 8061: [[974]], 8064: [[7936, 837]], 8065: [[7937, 837]], 8066: [[7938, 837]], 8067: [[7939, 837]], 8068: [[7940, 837]], 8069: [[7941, 837]], 8070: [[7942, 837]], 8071: [[7943, 837]], 8072: [[7944, 837]], 8073: [[7945, 837]], 8074: [[7946, 837]], 8075: [[7947, 837]], 8076: [[7948, 837]], 8077: [[7949, 837]], 8078: [[7950, 837]], 8079: [[7951, 837]], 8080: [[7968, 837]], 8081: [[7969, 837]], 8082: [[7970, 837]], 8083: [[7971, 837]], 8084: [[7972, 837]], 8085: [[7973, 837]], 8086: [[7974, 837]], 8087: [[7975, 837]], 8088: [[7976, 837]], 8089: [[7977, 837]], 8090: [[7978, 837]], 8091: [[7979, 837]], 8092: [[7980, 837]], 8093: [[7981, 837]], 8094: [[7982, 837]], 8095: [[7983, 837]], 8096: [[8032, 837]], 8097: [[8033, 837]], 8098: [[8034, 837]], 8099: [[8035, 837]], 8100: [[8036, 837]], 8101: [[8037, 837]], 8102: [[8038, 837]], 8103: [[8039, 837]], 8104: [[8040, 837]], 8105: [[8041, 837]], 8106: [[8042, 837]], 8107: [[8043, 837]], 8108: [[8044, 837]], 8109: [[8045, 837]], 8110: [[8046, 837]], 8111: [[8047, 837]], 8112: [[945, 774]], 8113: [[945, 772]], 8114: [[8048, 837]], 8115: [[945, 837]], 8116: [[940, 837]], 8118: [[945, 834],, { 837: 8119 }], 8119: [[8118, 837]], 8120: [[913, 774]], 8121: [[913, 772]], 8122: [[913, 768]], 8123: [[902]], 8124: [[913, 837]], 8125: [[32, 787], 256], 8126: [[953]], 8127: [[32, 787], 256, { 768: 8141, 769: 8142, 834: 8143 }], 8128: [[32, 834], 256], 8129: [[168, 834]], 8130: [[8052, 837]], 8131: [[951, 837]], 8132: [[942, 837]], 8134: [[951, 834],, { 837: 8135 }], 8135: [[8134, 837]], 8136: [[917, 768]], 8137: [[904]], 8138: [[919, 768]], 8139: [[905]], 8140: [[919, 837]], 8141: [[8127, 768]], 8142: [[8127, 769]], 8143: [[8127, 834]], 8144: [[953, 774]], 8145: [[953, 772]], 8146: [[970, 768]], 8147: [[912]], 8150: [[953, 834]], 8151: [[970, 834]], 8152: [[921, 774]], 8153: [[921, 772]], 8154: [[921, 768]], 8155: [[906]], 8157: [[8190, 768]], 8158: [[8190, 769]], 8159: [[8190, 834]], 8160: [[965, 774]], 8161: [[965, 772]], 8162: [[971, 768]], 8163: [[944]], 8164: [[961, 787]], 8165: [[961, 788]], 8166: [[965, 834]], 8167: [[971, 834]], 8168: [[933, 774]], 8169: [[933, 772]], 8170: [[933, 768]], 8171: [[910]], 8172: [[929, 788]], 8173: [[168, 768]], 8174: [[901]], 8175: [[96]], 8178: [[8060, 837]], 8179: [[969, 837]], 8180: [[974, 837]], 8182: [[969, 834],, { 837: 8183 }], 8183: [[8182, 837]], 8184: [[927, 768]], 8185: [[908]], 8186: [[937, 768]], 8187: [[911]], 8188: [[937, 837]], 8189: [[180]], 8190: [[32, 788], 256, { 768: 8157, 769: 8158, 834: 8159 }] }, 8192: { 8192: [[8194]], 8193: [[8195]], 8194: [[32], 256], 8195: [[32], 256], 8196: [[32], 256], 8197: [[32], 256], 8198: [[32], 256], 8199: [[32], 256], 8200: [[32], 256], 8201: [[32], 256], 8202: [[32], 256], 8209: [[8208], 256], 8215: [[32, 819], 256], 8228: [[46], 256], 8229: [[46, 46], 256], 8230: [[46, 46, 46], 256], 8239: [[32], 256], 8243: [[8242, 8242], 256], 8244: [[8242, 8242, 8242], 256], 8246: [[8245, 8245], 256], 8247: [[8245, 8245, 8245], 256], 8252: [[33, 33], 256], 8254: [[32, 773], 256], 8263: [[63, 63], 256], 8264: [[63, 33], 256], 8265: [[33, 63], 256], 8279: [[8242, 8242, 8242, 8242], 256], 8287: [[32], 256], 8304: [[48], 256], 8305: [[105], 256], 8308: [[52], 256], 8309: [[53], 256], 8310: [[54], 256], 8311: [[55], 256], 8312: [[56], 256], 8313: [[57], 256], 8314: [[43], 256], 8315: [[8722], 256], 8316: [[61], 256], 8317: [[40], 256], 8318: [[41], 256], 8319: [[110], 256], 8320: [[48], 256], 8321: [[49], 256], 8322: [[50], 256], 8323: [[51], 256], 8324: [[52], 256], 8325: [[53], 256], 8326: [[54], 256], 8327: [[55], 256], 8328: [[56], 256], 8329: [[57], 256], 8330: [[43], 256], 8331: [[8722], 256], 8332: [[61], 256], 8333: [[40], 256], 8334: [[41], 256], 8336: [[97], 256], 8337: [[101], 256], 8338: [[111], 256], 8339: [[120], 256], 8340: [[601], 256], 8341: [[104], 256], 8342: [[107], 256], 8343: [[108], 256], 8344: [[109], 256], 8345: [[110], 256], 8346: [[112], 256], 8347: [[115], 256], 8348: [[116], 256], 8360: [[82, 115], 256], 8400: [, 230], 8401: [, 230], 8402: [, 1], 8403: [, 1], 8404: [, 230], 8405: [, 230], 8406: [, 230], 8407: [, 230], 8408: [, 1], 8409: [, 1], 8410: [, 1], 8411: [, 230], 8412: [, 230], 8417: [, 230], 8421: [, 1], 8422: [, 1], 8423: [, 230], 8424: [, 220], 8425: [, 230], 8426: [, 1], 8427: [, 1], 8428: [, 220], 8429: [, 220], 8430: [, 220], 8431: [, 220], 8432: [, 230] }, 8448: { 8448: [[97, 47, 99], 256], 8449: [[97, 47, 115], 256], 8450: [[67], 256], 8451: [[176, 67], 256], 8453: [[99, 47, 111], 256], 8454: [[99, 47, 117], 256], 8455: [[400], 256], 8457: [[176, 70], 256], 8458: [[103], 256], 8459: [[72], 256], 8460: [[72], 256], 8461: [[72], 256], 8462: [[104], 256], 8463: [[295], 256], 8464: [[73], 256], 8465: [[73], 256], 8466: [[76], 256], 8467: [[108], 256], 8469: [[78], 256], 8470: [[78, 111], 256], 8473: [[80], 256], 8474: [[81], 256], 8475: [[82], 256], 8476: [[82], 256], 8477: [[82], 256], 8480: [[83, 77], 256], 8481: [[84, 69, 76], 256], 8482: [[84, 77], 256], 8484: [[90], 256], 8486: [[937]], 8488: [[90], 256], 8490: [[75]], 8491: [[197]], 8492: [[66], 256], 8493: [[67], 256], 8495: [[101], 256], 8496: [[69], 256], 8497: [[70], 256], 8499: [[77], 256], 8500: [[111], 256], 8501: [[1488], 256], 8502: [[1489], 256], 8503: [[1490], 256], 8504: [[1491], 256], 8505: [[105], 256], 8507: [[70, 65, 88], 256], 8508: [[960], 256], 8509: [[947], 256], 8510: [[915], 256], 8511: [[928], 256], 8512: [[8721], 256], 8517: [[68], 256], 8518: [[100], 256], 8519: [[101], 256], 8520: [[105], 256], 8521: [[106], 256], 8528: [[49, 8260, 55], 256], 8529: [[49, 8260, 57], 256], 8530: [[49, 8260, 49, 48], 256], 8531: [[49, 8260, 51], 256], 8532: [[50, 8260, 51], 256], 8533: [[49, 8260, 53], 256], 8534: [[50, 8260, 53], 256], 8535: [[51, 8260, 53], 256], 8536: [[52, 8260, 53], 256], 8537: [[49, 8260, 54], 256], 8538: [[53, 8260, 54], 256], 8539: [[49, 8260, 56], 256], 8540: [[51, 8260, 56], 256], 8541: [[53, 8260, 56], 256], 8542: [[55, 8260, 56], 256], 8543: [[49, 8260], 256], 8544: [[73], 256], 8545: [[73, 73], 256], 8546: [[73, 73, 73], 256], 8547: [[73, 86], 256], 8548: [[86], 256], 8549: [[86, 73], 256], 8550: [[86, 73, 73], 256], 8551: [[86, 73, 73, 73], 256], 8552: [[73, 88], 256], 8553: [[88], 256], 8554: [[88, 73], 256], 8555: [[88, 73, 73], 256], 8556: [[76], 256], 8557: [[67], 256], 8558: [[68], 256], 8559: [[77], 256], 8560: [[105], 256], 8561: [[105, 105], 256], 8562: [[105, 105, 105], 256], 8563: [[105, 118], 256], 8564: [[118], 256], 8565: [[118, 105], 256], 8566: [[118, 105, 105], 256], 8567: [[118, 105, 105, 105], 256], 8568: [[105, 120], 256], 8569: [[120], 256], 8570: [[120, 105], 256], 8571: [[120, 105, 105], 256], 8572: [[108], 256], 8573: [[99], 256], 8574: [[100], 256], 8575: [[109], 256], 8585: [[48, 8260, 51], 256], 8592: [,, { 824: 8602 }], 8594: [,, { 824: 8603 }], 8596: [,, { 824: 8622 }], 8602: [[8592, 824]], 8603: [[8594, 824]], 8622: [[8596, 824]], 8653: [[8656, 824]], 8654: [[8660, 824]], 8655: [[8658, 824]], 8656: [,, { 824: 8653 }], 8658: [,, { 824: 8655 }], 8660: [,, { 824: 8654 }] }, 8704: { 8707: [,, { 824: 8708 }], 8708: [[8707, 824]], 8712: [,, { 824: 8713 }], 8713: [[8712, 824]], 8715: [,, { 824: 8716 }], 8716: [[8715, 824]], 8739: [,, { 824: 8740 }], 8740: [[8739, 824]], 8741: [,, { 824: 8742 }], 8742: [[8741, 824]], 8748: [[8747, 8747], 256], 8749: [[8747, 8747, 8747], 256], 8751: [[8750, 8750], 256], 8752: [[8750, 8750, 8750], 256], 8764: [,, { 824: 8769 }], 8769: [[8764, 824]], 8771: [,, { 824: 8772 }], 8772: [[8771, 824]], 8773: [,, { 824: 8775 }], 8775: [[8773, 824]], 8776: [,, { 824: 8777 }], 8777: [[8776, 824]], 8781: [,, { 824: 8813 }], 8800: [[61, 824]], 8801: [,, { 824: 8802 }], 8802: [[8801, 824]], 8804: [,, { 824: 8816 }], 8805: [,, { 824: 8817 }], 8813: [[8781, 824]], 8814: [[60, 824]], 8815: [[62, 824]], 8816: [[8804, 824]], 8817: [[8805, 824]], 8818: [,, { 824: 8820 }], 8819: [,, { 824: 8821 }], 8820: [[8818, 824]], 8821: [[8819, 824]], 8822: [,, { 824: 8824 }], 8823: [,, { 824: 8825 }], 8824: [[8822, 824]], 8825: [[8823, 824]], 8826: [,, { 824: 8832 }], 8827: [,, { 824: 8833 }], 8828: [,, { 824: 8928 }], 8829: [,, { 824: 8929 }], 8832: [[8826, 824]], 8833: [[8827, 824]], 8834: [,, { 824: 8836 }], 8835: [,, { 824: 8837 }], 8836: [[8834, 824]], 8837: [[8835, 824]], 8838: [,, { 824: 8840 }], 8839: [,, { 824: 8841 }], 8840: [[8838, 824]], 8841: [[8839, 824]], 8849: [,, { 824: 8930 }], 8850: [,, { 824: 8931 }], 8866: [,, { 824: 8876 }], 8872: [,, { 824: 8877 }], 8873: [,, { 824: 8878 }], 8875: [,, { 824: 8879 }], 8876: [[8866, 824]], 8877: [[8872, 824]], 8878: [[8873, 824]], 8879: [[8875, 824]], 8882: [,, { 824: 8938 }], 8883: [,, { 824: 8939 }], 8884: [,, { 824: 8940 }], 8885: [,, { 824: 8941 }], 8928: [[8828, 824]], 8929: [[8829, 824]], 8930: [[8849, 824]], 8931: [[8850, 824]], 8938: [[8882, 824]], 8939: [[8883, 824]], 8940: [[8884, 824]], 8941: [[8885, 824]] }, 8960: { 9001: [[12296]], 9002: [[12297]] }, 9216: { 9312: [[49], 256], 9313: [[50], 256], 9314: [[51], 256], 9315: [[52], 256], 9316: [[53], 256], 9317: [[54], 256], 9318: [[55], 256], 9319: [[56], 256], 9320: [[57], 256], 9321: [[49, 48], 256], 9322: [[49, 49], 256], 9323: [[49, 50], 256], 9324: [[49, 51], 256], 9325: [[49, 52], 256], 9326: [[49, 53], 256], 9327: [[49, 54], 256], 9328: [[49, 55], 256], 9329: [[49, 56], 256], 9330: [[49, 57], 256], 9331: [[50, 48], 256], 9332: [[40, 49, 41], 256], 9333: [[40, 50, 41], 256], 9334: [[40, 51, 41], 256], 9335: [[40, 52, 41], 256], 9336: [[40, 53, 41], 256], 9337: [[40, 54, 41], 256], 9338: [[40, 55, 41], 256], 9339: [[40, 56, 41], 256], 9340: [[40, 57, 41], 256], 9341: [[40, 49, 48, 41], 256], 9342: [[40, 49, 49, 41], 256], 9343: [[40, 49, 50, 41], 256], 9344: [[40, 49, 51, 41], 256], 9345: [[40, 49, 52, 41], 256], 9346: [[40, 49, 53, 41], 256], 9347: [[40, 49, 54, 41], 256], 9348: [[40, 49, 55, 41], 256], 9349: [[40, 49, 56, 41], 256], 9350: [[40, 49, 57, 41], 256], 9351: [[40, 50, 48, 41], 256], 9352: [[49, 46], 256], 9353: [[50, 46], 256], 9354: [[51, 46], 256], 9355: [[52, 46], 256], 9356: [[53, 46], 256], 9357: [[54, 46], 256], 9358: [[55, 46], 256], 9359: [[56, 46], 256], 9360: [[57, 46], 256], 9361: [[49, 48, 46], 256], 9362: [[49, 49, 46], 256], 9363: [[49, 50, 46], 256], 9364: [[49, 51, 46], 256], 9365: [[49, 52, 46], 256], 9366: [[49, 53, 46], 256], 9367: [[49, 54, 46], 256], 9368: [[49, 55, 46], 256], 9369: [[49, 56, 46], 256], 9370: [[49, 57, 46], 256], 9371: [[50, 48, 46], 256], 9372: [[40, 97, 41], 256], 9373: [[40, 98, 41], 256], 9374: [[40, 99, 41], 256], 9375: [[40, 100, 41], 256], 9376: [[40, 101, 41], 256], 9377: [[40, 102, 41], 256], 9378: [[40, 103, 41], 256], 9379: [[40, 104, 41], 256], 9380: [[40, 105, 41], 256], 9381: [[40, 106, 41], 256], 9382: [[40, 107, 41], 256], 9383: [[40, 108, 41], 256], 9384: [[40, 109, 41], 256], 9385: [[40, 110, 41], 256], 9386: [[40, 111, 41], 256], 9387: [[40, 112, 41], 256], 9388: [[40, 113, 41], 256], 9389: [[40, 114, 41], 256], 9390: [[40, 115, 41], 256], 9391: [[40, 116, 41], 256], 9392: [[40, 117, 41], 256], 9393: [[40, 118, 41], 256], 9394: [[40, 119, 41], 256], 9395: [[40, 120, 41], 256], 9396: [[40, 121, 41], 256], 9397: [[40, 122, 41], 256], 9398: [[65], 256], 9399: [[66], 256], 9400: [[67], 256], 9401: [[68], 256], 9402: [[69], 256], 9403: [[70], 256], 9404: [[71], 256], 9405: [[72], 256], 9406: [[73], 256], 9407: [[74], 256], 9408: [[75], 256], 9409: [[76], 256], 9410: [[77], 256], 9411: [[78], 256], 9412: [[79], 256], 9413: [[80], 256], 9414: [[81], 256], 9415: [[82], 256], 9416: [[83], 256], 9417: [[84], 256], 9418: [[85], 256], 9419: [[86], 256], 9420: [[87], 256], 9421: [[88], 256], 9422: [[89], 256], 9423: [[90], 256], 9424: [[97], 256], 9425: [[98], 256], 9426: [[99], 256], 9427: [[100], 256], 9428: [[101], 256], 9429: [[102], 256], 9430: [[103], 256], 9431: [[104], 256], 9432: [[105], 256], 9433: [[106], 256], 9434: [[107], 256], 9435: [[108], 256], 9436: [[109], 256], 9437: [[110], 256], 9438: [[111], 256], 9439: [[112], 256], 9440: [[113], 256], 9441: [[114], 256], 9442: [[115], 256], 9443: [[116], 256], 9444: [[117], 256], 9445: [[118], 256], 9446: [[119], 256], 9447: [[120], 256], 9448: [[121], 256], 9449: [[122], 256], 9450: [[48], 256] }, 10752: { 10764: [[8747, 8747, 8747, 8747], 256], 10868: [[58, 58, 61], 256], 10869: [[61, 61], 256], 10870: [[61, 61, 61], 256], 10972: [[10973, 824], 512] }, 11264: { 11388: [[106], 256], 11389: [[86], 256], 11503: [, 230], 11504: [, 230], 11505: [, 230] }, 11520: { 11631: [[11617], 256], 11647: [, 9], 11744: [, 230], 11745: [, 230], 11746: [, 230], 11747: [, 230], 11748: [, 230], 11749: [, 230], 11750: [, 230], 11751: [, 230], 11752: [, 230], 11753: [, 230], 11754: [, 230], 11755: [, 230], 11756: [, 230], 11757: [, 230], 11758: [, 230], 11759: [, 230], 11760: [, 230], 11761: [, 230], 11762: [, 230], 11763: [, 230], 11764: [, 230], 11765: [, 230], 11766: [, 230], 11767: [, 230], 11768: [, 230], 11769: [, 230], 11770: [, 230], 11771: [, 230], 11772: [, 230], 11773: [, 230], 11774: [, 230], 11775: [, 230] }, 11776: { 11935: [[27597], 256], 12019: [[40863], 256] }, 12032: { 12032: [[19968], 256], 12033: [[20008], 256], 12034: [[20022], 256], 12035: [[20031], 256], 12036: [[20057], 256], 12037: [[20101], 256], 12038: [[20108], 256], 12039: [[20128], 256], 12040: [[20154], 256], 12041: [[20799], 256], 12042: [[20837], 256], 12043: [[20843], 256], 12044: [[20866], 256], 12045: [[20886], 256], 12046: [[20907], 256], 12047: [[20960], 256], 12048: [[20981], 256], 12049: [[20992], 256], 12050: [[21147], 256], 12051: [[21241], 256], 12052: [[21269], 256], 12053: [[21274], 256], 12054: [[21304], 256], 12055: [[21313], 256], 12056: [[21340], 256], 12057: [[21353], 256], 12058: [[21378], 256], 12059: [[21430], 256], 12060: [[21448], 256], 12061: [[21475], 256], 12062: [[22231], 256], 12063: [[22303], 256], 12064: [[22763], 256], 12065: [[22786], 256], 12066: [[22794], 256], 12067: [[22805], 256], 12068: [[22823], 256], 12069: [[22899], 256], 12070: [[23376], 256], 12071: [[23424], 256], 12072: [[23544], 256], 12073: [[23567], 256], 12074: [[23586], 256], 12075: [[23608], 256], 12076: [[23662], 256], 12077: [[23665], 256], 12078: [[24027], 256], 12079: [[24037], 256], 12080: [[24049], 256], 12081: [[24062], 256], 12082: [[24178], 256], 12083: [[24186], 256], 12084: [[24191], 256], 12085: [[24308], 256], 12086: [[24318], 256], 12087: [[24331], 256], 12088: [[24339], 256], 12089: [[24400], 256], 12090: [[24417], 256], 12091: [[24435], 256], 12092: [[24515], 256], 12093: [[25096], 256], 12094: [[25142], 256], 12095: [[25163], 256], 12096: [[25903], 256], 12097: [[25908], 256], 12098: [[25991], 256], 12099: [[26007], 256], 12100: [[26020], 256], 12101: [[26041], 256], 12102: [[26080], 256], 12103: [[26085], 256], 12104: [[26352], 256], 12105: [[26376], 256], 12106: [[26408], 256], 12107: [[27424], 256], 12108: [[27490], 256], 12109: [[27513], 256], 12110: [[27571], 256], 12111: [[27595], 256], 12112: [[27604], 256], 12113: [[27611], 256], 12114: [[27663], 256], 12115: [[27668], 256], 12116: [[27700], 256], 12117: [[28779], 256], 12118: [[29226], 256], 12119: [[29238], 256], 12120: [[29243], 256], 12121: [[29247], 256], 12122: [[29255], 256], 12123: [[29273], 256], 12124: [[29275], 256], 12125: [[29356], 256], 12126: [[29572], 256], 12127: [[29577], 256], 12128: [[29916], 256], 12129: [[29926], 256], 12130: [[29976], 256], 12131: [[29983], 256], 12132: [[29992], 256], 12133: [[3e4], 256], 12134: [[30091], 256], 12135: [[30098], 256], 12136: [[30326], 256], 12137: [[30333], 256], 12138: [[30382], 256], 12139: [[30399], 256], 12140: [[30446], 256], 12141: [[30683], 256], 12142: [[30690], 256], 12143: [[30707], 256], 12144: [[31034], 256], 12145: [[31160], 256], 12146: [[31166], 256], 12147: [[31348], 256], 12148: [[31435], 256], 12149: [[31481], 256], 12150: [[31859], 256], 12151: [[31992], 256], 12152: [[32566], 256], 12153: [[32593], 256], 12154: [[32650], 256], 12155: [[32701], 256], 12156: [[32769], 256], 12157: [[32780], 256], 12158: [[32786], 256], 12159: [[32819], 256], 12160: [[32895], 256], 12161: [[32905], 256], 12162: [[33251], 256], 12163: [[33258], 256], 12164: [[33267], 256], 12165: [[33276], 256], 12166: [[33292], 256], 12167: [[33307], 256], 12168: [[33311], 256], 12169: [[33390], 256], 12170: [[33394], 256], 12171: [[33400], 256], 12172: [[34381], 256], 12173: [[34411], 256], 12174: [[34880], 256], 12175: [[34892], 256], 12176: [[34915], 256], 12177: [[35198], 256], 12178: [[35211], 256], 12179: [[35282], 256], 12180: [[35328], 256], 12181: [[35895], 256], 12182: [[35910], 256], 12183: [[35925], 256], 12184: [[35960], 256], 12185: [[35997], 256], 12186: [[36196], 256], 12187: [[36208], 256], 12188: [[36275], 256], 12189: [[36523], 256], 12190: [[36554], 256], 12191: [[36763], 256], 12192: [[36784], 256], 12193: [[36789], 256], 12194: [[37009], 256], 12195: [[37193], 256], 12196: [[37318], 256], 12197: [[37324], 256], 12198: [[37329], 256], 12199: [[38263], 256], 12200: [[38272], 256], 12201: [[38428], 256], 12202: [[38582], 256], 12203: [[38585], 256], 12204: [[38632], 256], 12205: [[38737], 256], 12206: [[38750], 256], 12207: [[38754], 256], 12208: [[38761], 256], 12209: [[38859], 256], 12210: [[38893], 256], 12211: [[38899], 256], 12212: [[38913], 256], 12213: [[39080], 256], 12214: [[39131], 256], 12215: [[39135], 256], 12216: [[39318], 256], 12217: [[39321], 256], 12218: [[39340], 256], 12219: [[39592], 256], 12220: [[39640], 256], 12221: [[39647], 256], 12222: [[39717], 256], 12223: [[39727], 256], 12224: [[39730], 256], 12225: [[39740], 256], 12226: [[39770], 256], 12227: [[40165], 256], 12228: [[40565], 256], 12229: [[40575], 256], 12230: [[40613], 256], 12231: [[40635], 256], 12232: [[40643], 256], 12233: [[40653], 256], 12234: [[40657], 256], 12235: [[40697], 256], 12236: [[40701], 256], 12237: [[40718], 256], 12238: [[40723], 256], 12239: [[40736], 256], 12240: [[40763], 256], 12241: [[40778], 256], 12242: [[40786], 256], 12243: [[40845], 256], 12244: [[40860], 256], 12245: [[40864], 256] }, 12288: { 12288: [[32], 256], 12330: [, 218], 12331: [, 228], 12332: [, 232], 12333: [, 222], 12334: [, 224], 12335: [, 224], 12342: [[12306], 256], 12344: [[21313], 256], 12345: [[21316], 256], 12346: [[21317], 256], 12358: [,, { 12441: 12436 }], 12363: [,, { 12441: 12364 }], 12364: [[12363, 12441]], 12365: [,, { 12441: 12366 }], 12366: [[12365, 12441]], 12367: [,, { 12441: 12368 }], 12368: [[12367, 12441]], 12369: [,, { 12441: 12370 }], 12370: [[12369, 12441]], 12371: [,, { 12441: 12372 }], 12372: [[12371, 12441]], 12373: [,, { 12441: 12374 }], 12374: [[12373, 12441]], 12375: [,, { 12441: 12376 }], 12376: [[12375, 12441]], 12377: [,, { 12441: 12378 }], 12378: [[12377, 12441]], 12379: [,, { 12441: 12380 }], 12380: [[12379, 12441]], 12381: [,, { 12441: 12382 }], 12382: [[12381, 12441]], 12383: [,, { 12441: 12384 }], 12384: [[12383, 12441]], 12385: [,, { 12441: 12386 }], 12386: [[12385, 12441]], 12388: [,, { 12441: 12389 }], 12389: [[12388, 12441]], 12390: [,, { 12441: 12391 }], 12391: [[12390, 12441]], 12392: [,, { 12441: 12393 }], 12393: [[12392, 12441]], 12399: [,, { 12441: 12400, 12442: 12401 }], 12400: [[12399, 12441]], 12401: [[12399, 12442]], 12402: [,, { 12441: 12403, 12442: 12404 }], 12403: [[12402, 12441]], 12404: [[12402, 12442]], 12405: [,, { 12441: 12406, 12442: 12407 }], 12406: [[12405, 12441]], 12407: [[12405, 12442]], 12408: [,, { 12441: 12409, 12442: 12410 }], 12409: [[12408, 12441]], 12410: [[12408, 12442]], 12411: [,, { 12441: 12412, 12442: 12413 }], 12412: [[12411, 12441]], 12413: [[12411, 12442]], 12436: [[12358, 12441]], 12441: [, 8], 12442: [, 8], 12443: [[32, 12441], 256], 12444: [[32, 12442], 256], 12445: [,, { 12441: 12446 }], 12446: [[12445, 12441]], 12447: [[12424, 12426], 256], 12454: [,, { 12441: 12532 }], 12459: [,, { 12441: 12460 }], 12460: [[12459, 12441]], 12461: [,, { 12441: 12462 }], 12462: [[12461, 12441]], 12463: [,, { 12441: 12464 }], 12464: [[12463, 12441]], 12465: [,, { 12441: 12466 }], 12466: [[12465, 12441]], 12467: [,, { 12441: 12468 }], 12468: [[12467, 12441]], 12469: [,, { 12441: 12470 }], 12470: [[12469, 12441]], 12471: [,, { 12441: 12472 }], 12472: [[12471, 12441]], 12473: [,, { 12441: 12474 }], 12474: [[12473, 12441]], 12475: [,, { 12441: 12476 }], 12476: [[12475, 12441]], 12477: [,, { 12441: 12478 }], 12478: [[12477, 12441]], 12479: [,, { 12441: 12480 }], 12480: [[12479, 12441]], 12481: [,, { 12441: 12482 }], 12482: [[12481, 12441]], 12484: [,, { 12441: 12485 }], 12485: [[12484, 12441]], 12486: [,, { 12441: 12487 }], 12487: [[12486, 12441]], 12488: [,, { 12441: 12489 }], 12489: [[12488, 12441]], 12495: [,, { 12441: 12496, 12442: 12497 }], 12496: [[12495, 12441]], 12497: [[12495, 12442]], 12498: [,, { 12441: 12499, 12442: 12500 }], 12499: [[12498, 12441]], 12500: [[12498, 12442]], 12501: [,, { 12441: 12502, 12442: 12503 }], 12502: [[12501, 12441]], 12503: [[12501, 12442]], 12504: [,, { 12441: 12505, 12442: 12506 }], 12505: [[12504, 12441]], 12506: [[12504, 12442]], 12507: [,, { 12441: 12508, 12442: 12509 }], 12508: [[12507, 12441]], 12509: [[12507, 12442]], 12527: [,, { 12441: 12535 }], 12528: [,, { 12441: 12536 }], 12529: [,, { 12441: 12537 }], 12530: [,, { 12441: 12538 }], 12532: [[12454, 12441]], 12535: [[12527, 12441]], 12536: [[12528, 12441]], 12537: [[12529, 12441]], 12538: [[12530, 12441]], 12541: [,, { 12441: 12542 }], 12542: [[12541, 12441]], 12543: [[12467, 12488], 256] }, 12544: { 12593: [[4352], 256], 12594: [[4353], 256], 12595: [[4522], 256], 12596: [[4354], 256], 12597: [[4524], 256], 12598: [[4525], 256], 12599: [[4355], 256], 12600: [[4356], 256], 12601: [[4357], 256], 12602: [[4528], 256], 12603: [[4529], 256], 12604: [[4530], 256], 12605: [[4531], 256], 12606: [[4532], 256], 12607: [[4533], 256], 12608: [[4378], 256], 12609: [[4358], 256], 12610: [[4359], 256], 12611: [[4360], 256], 12612: [[4385], 256], 12613: [[4361], 256], 12614: [[4362], 256], 12615: [[4363], 256], 12616: [[4364], 256], 12617: [[4365], 256], 12618: [[4366], 256], 12619: [[4367], 256], 12620: [[4368], 256], 12621: [[4369], 256], 12622: [[4370], 256], 12623: [[4449], 256], 12624: [[4450], 256], 12625: [[4451], 256], 12626: [[4452], 256], 12627: [[4453], 256], 12628: [[4454], 256], 12629: [[4455], 256], 12630: [[4456], 256], 12631: [[4457], 256], 12632: [[4458], 256], 12633: [[4459], 256], 12634: [[4460], 256], 12635: [[4461], 256], 12636: [[4462], 256], 12637: [[4463], 256], 12638: [[4464], 256], 12639: [[4465], 256], 12640: [[4466], 256], 12641: [[4467], 256], 12642: [[4468], 256], 12643: [[4469], 256], 12644: [[4448], 256], 12645: [[4372], 256], 12646: [[4373], 256], 12647: [[4551], 256], 12648: [[4552], 256], 12649: [[4556], 256], 12650: [[4558], 256], 12651: [[4563], 256], 12652: [[4567], 256], 12653: [[4569], 256], 12654: [[4380], 256], 12655: [[4573], 256], 12656: [[4575], 256], 12657: [[4381], 256], 12658: [[4382], 256], 12659: [[4384], 256], 12660: [[4386], 256], 12661: [[4387], 256], 12662: [[4391], 256], 12663: [[4393], 256], 12664: [[4395], 256], 12665: [[4396], 256], 12666: [[4397], 256], 12667: [[4398], 256], 12668: [[4399], 256], 12669: [[4402], 256], 12670: [[4406], 256], 12671: [[4416], 256], 12672: [[4423], 256], 12673: [[4428], 256], 12674: [[4593], 256], 12675: [[4594], 256], 12676: [[4439], 256], 12677: [[4440], 256], 12678: [[4441], 256], 12679: [[4484], 256], 12680: [[4485], 256], 12681: [[4488], 256], 12682: [[4497], 256], 12683: [[4498], 256], 12684: [[4500], 256], 12685: [[4510], 256], 12686: [[4513], 256], 12690: [[19968], 256], 12691: [[20108], 256], 12692: [[19977], 256], 12693: [[22235], 256], 12694: [[19978], 256], 12695: [[20013], 256], 12696: [[19979], 256], 12697: [[30002], 256], 12698: [[20057], 256], 12699: [[19993], 256], 12700: [[19969], 256], 12701: [[22825], 256], 12702: [[22320], 256], 12703: [[20154], 256] }, 12800: { 12800: [[40, 4352, 41], 256], 12801: [[40, 4354, 41], 256], 12802: [[40, 4355, 41], 256], 12803: [[40, 4357, 41], 256], 12804: [[40, 4358, 41], 256], 12805: [[40, 4359, 41], 256], 12806: [[40, 4361, 41], 256], 12807: [[40, 4363, 41], 256], 12808: [[40, 4364, 41], 256], 12809: [[40, 4366, 41], 256], 12810: [[40, 4367, 41], 256], 12811: [[40, 4368, 41], 256], 12812: [[40, 4369, 41], 256], 12813: [[40, 4370, 41], 256], 12814: [[40, 4352, 4449, 41], 256], 12815: [[40, 4354, 4449, 41], 256], 12816: [[40, 4355, 4449, 41], 256], 12817: [[40, 4357, 4449, 41], 256], 12818: [[40, 4358, 4449, 41], 256], 12819: [[40, 4359, 4449, 41], 256], 12820: [[40, 4361, 4449, 41], 256], 12821: [[40, 4363, 4449, 41], 256], 12822: [[40, 4364, 4449, 41], 256], 12823: [[40, 4366, 4449, 41], 256], 12824: [[40, 4367, 4449, 41], 256], 12825: [[40, 4368, 4449, 41], 256], 12826: [[40, 4369, 4449, 41], 256], 12827: [[40, 4370, 4449, 41], 256], 12828: [[40, 4364, 4462, 41], 256], 12829: [[40, 4363, 4457, 4364, 4453, 4523, 41], 256], 12830: [[40, 4363, 4457, 4370, 4462, 41], 256], 12832: [[40, 19968, 41], 256], 12833: [[40, 20108, 41], 256], 12834: [[40, 19977, 41], 256], 12835: [[40, 22235, 41], 256], 12836: [[40, 20116, 41], 256], 12837: [[40, 20845, 41], 256], 12838: [[40, 19971, 41], 256], 12839: [[40, 20843, 41], 256], 12840: [[40, 20061, 41], 256], 12841: [[40, 21313, 41], 256], 12842: [[40, 26376, 41], 256], 12843: [[40, 28779, 41], 256], 12844: [[40, 27700, 41], 256], 12845: [[40, 26408, 41], 256], 12846: [[40, 37329, 41], 256], 12847: [[40, 22303, 41], 256], 12848: [[40, 26085, 41], 256], 12849: [[40, 26666, 41], 256], 12850: [[40, 26377, 41], 256], 12851: [[40, 31038, 41], 256], 12852: [[40, 21517, 41], 256], 12853: [[40, 29305, 41], 256], 12854: [[40, 36001, 41], 256], 12855: [[40, 31069, 41], 256], 12856: [[40, 21172, 41], 256], 12857: [[40, 20195, 41], 256], 12858: [[40, 21628, 41], 256], 12859: [[40, 23398, 41], 256], 12860: [[40, 30435, 41], 256], 12861: [[40, 20225, 41], 256], 12862: [[40, 36039, 41], 256], 12863: [[40, 21332, 41], 256], 12864: [[40, 31085, 41], 256], 12865: [[40, 20241, 41], 256], 12866: [[40, 33258, 41], 256], 12867: [[40, 33267, 41], 256], 12868: [[21839], 256], 12869: [[24188], 256], 12870: [[25991], 256], 12871: [[31631], 256], 12880: [[80, 84, 69], 256], 12881: [[50, 49], 256], 12882: [[50, 50], 256], 12883: [[50, 51], 256], 12884: [[50, 52], 256], 12885: [[50, 53], 256], 12886: [[50, 54], 256], 12887: [[50, 55], 256], 12888: [[50, 56], 256], 12889: [[50, 57], 256], 12890: [[51, 48], 256], 12891: [[51, 49], 256], 12892: [[51, 50], 256], 12893: [[51, 51], 256], 12894: [[51, 52], 256], 12895: [[51, 53], 256], 12896: [[4352], 256], 12897: [[4354], 256], 12898: [[4355], 256], 12899: [[4357], 256], 12900: [[4358], 256], 12901: [[4359], 256], 12902: [[4361], 256], 12903: [[4363], 256], 12904: [[4364], 256], 12905: [[4366], 256], 12906: [[4367], 256], 12907: [[4368], 256], 12908: [[4369], 256], 12909: [[4370], 256], 12910: [[4352, 4449], 256], 12911: [[4354, 4449], 256], 12912: [[4355, 4449], 256], 12913: [[4357, 4449], 256], 12914: [[4358, 4449], 256], 12915: [[4359, 4449], 256], 12916: [[4361, 4449], 256], 12917: [[4363, 4449], 256], 12918: [[4364, 4449], 256], 12919: [[4366, 4449], 256], 12920: [[4367, 4449], 256], 12921: [[4368, 4449], 256], 12922: [[4369, 4449], 256], 12923: [[4370, 4449], 256], 12924: [[4366, 4449, 4535, 4352, 4457], 256], 12925: [[4364, 4462, 4363, 4468], 256], 12926: [[4363, 4462], 256], 12928: [[19968], 256], 12929: [[20108], 256], 12930: [[19977], 256], 12931: [[22235], 256], 12932: [[20116], 256], 12933: [[20845], 256], 12934: [[19971], 256], 12935: [[20843], 256], 12936: [[20061], 256], 12937: [[21313], 256], 12938: [[26376], 256], 12939: [[28779], 256], 12940: [[27700], 256], 12941: [[26408], 256], 12942: [[37329], 256], 12943: [[22303], 256], 12944: [[26085], 256], 12945: [[26666], 256], 12946: [[26377], 256], 12947: [[31038], 256], 12948: [[21517], 256], 12949: [[29305], 256], 12950: [[36001], 256], 12951: [[31069], 256], 12952: [[21172], 256], 12953: [[31192], 256], 12954: [[30007], 256], 12955: [[22899], 256], 12956: [[36969], 256], 12957: [[20778], 256], 12958: [[21360], 256], 12959: [[27880], 256], 12960: [[38917], 256], 12961: [[20241], 256], 12962: [[20889], 256], 12963: [[27491], 256], 12964: [[19978], 256], 12965: [[20013], 256], 12966: [[19979], 256], 12967: [[24038], 256], 12968: [[21491], 256], 12969: [[21307], 256], 12970: [[23447], 256], 12971: [[23398], 256], 12972: [[30435], 256], 12973: [[20225], 256], 12974: [[36039], 256], 12975: [[21332], 256], 12976: [[22812], 256], 12977: [[51, 54], 256], 12978: [[51, 55], 256], 12979: [[51, 56], 256], 12980: [[51, 57], 256], 12981: [[52, 48], 256], 12982: [[52, 49], 256], 12983: [[52, 50], 256], 12984: [[52, 51], 256], 12985: [[52, 52], 256], 12986: [[52, 53], 256], 12987: [[52, 54], 256], 12988: [[52, 55], 256], 12989: [[52, 56], 256], 12990: [[52, 57], 256], 12991: [[53, 48], 256], 12992: [[49, 26376], 256], 12993: [[50, 26376], 256], 12994: [[51, 26376], 256], 12995: [[52, 26376], 256], 12996: [[53, 26376], 256], 12997: [[54, 26376], 256], 12998: [[55, 26376], 256], 12999: [[56, 26376], 256], 13e3: [[57, 26376], 256], 13001: [[49, 48, 26376], 256], 13002: [[49, 49, 26376], 256], 13003: [[49, 50, 26376], 256], 13004: [[72, 103], 256], 13005: [[101, 114, 103], 256], 13006: [[101, 86], 256], 13007: [[76, 84, 68], 256], 13008: [[12450], 256], 13009: [[12452], 256], 13010: [[12454], 256], 13011: [[12456], 256], 13012: [[12458], 256], 13013: [[12459], 256], 13014: [[12461], 256], 13015: [[12463], 256], 13016: [[12465], 256], 13017: [[12467], 256], 13018: [[12469], 256], 13019: [[12471], 256], 13020: [[12473], 256], 13021: [[12475], 256], 13022: [[12477], 256], 13023: [[12479], 256], 13024: [[12481], 256], 13025: [[12484], 256], 13026: [[12486], 256], 13027: [[12488], 256], 13028: [[12490], 256], 13029: [[12491], 256], 13030: [[12492], 256], 13031: [[12493], 256], 13032: [[12494], 256], 13033: [[12495], 256], 13034: [[12498], 256], 13035: [[12501], 256], 13036: [[12504], 256], 13037: [[12507], 256], 13038: [[12510], 256], 13039: [[12511], 256], 13040: [[12512], 256], 13041: [[12513], 256], 13042: [[12514], 256], 13043: [[12516], 256], 13044: [[12518], 256], 13045: [[12520], 256], 13046: [[12521], 256], 13047: [[12522], 256], 13048: [[12523], 256], 13049: [[12524], 256], 13050: [[12525], 256], 13051: [[12527], 256], 13052: [[12528], 256], 13053: [[12529], 256], 13054: [[12530], 256] }, 13056: { 13056: [[12450, 12497, 12540, 12488], 256], 13057: [[12450, 12523, 12501, 12449], 256], 13058: [[12450, 12531, 12506, 12450], 256], 13059: [[12450, 12540, 12523], 256], 13060: [[12452, 12491, 12531, 12464], 256], 13061: [[12452, 12531, 12481], 256], 13062: [[12454, 12457, 12531], 256], 13063: [[12456, 12473, 12463, 12540, 12489], 256], 13064: [[12456, 12540, 12459, 12540], 256], 13065: [[12458, 12531, 12473], 256], 13066: [[12458, 12540, 12512], 256], 13067: [[12459, 12452, 12522], 256], 13068: [[12459, 12521, 12483, 12488], 256], 13069: [[12459, 12525, 12522, 12540], 256], 13070: [[12460, 12525, 12531], 256], 13071: [[12460, 12531, 12510], 256], 13072: [[12462, 12460], 256], 13073: [[12462, 12491, 12540], 256], 13074: [[12461, 12517, 12522, 12540], 256], 13075: [[12462, 12523, 12480, 12540], 256], 13076: [[12461, 12525], 256], 13077: [[12461, 12525, 12464, 12521, 12512], 256], 13078: [[12461, 12525, 12513, 12540, 12488, 12523], 256], 13079: [[12461, 12525, 12527, 12483, 12488], 256], 13080: [[12464, 12521, 12512], 256], 13081: [[12464, 12521, 12512, 12488, 12531], 256], 13082: [[12463, 12523, 12476, 12452, 12525], 256], 13083: [[12463, 12525, 12540, 12493], 256], 13084: [[12465, 12540, 12473], 256], 13085: [[12467, 12523, 12490], 256], 13086: [[12467, 12540, 12509], 256], 13087: [[12469, 12452, 12463, 12523], 256], 13088: [[12469, 12531, 12481, 12540, 12512], 256], 13089: [[12471, 12522, 12531, 12464], 256], 13090: [[12475, 12531, 12481], 256], 13091: [[12475, 12531, 12488], 256], 13092: [[12480, 12540, 12473], 256], 13093: [[12487, 12471], 256], 13094: [[12489, 12523], 256], 13095: [[12488, 12531], 256], 13096: [[12490, 12494], 256], 13097: [[12494, 12483, 12488], 256], 13098: [[12495, 12452, 12484], 256], 13099: [[12497, 12540, 12475, 12531, 12488], 256], 13100: [[12497, 12540, 12484], 256], 13101: [[12496, 12540, 12524, 12523], 256], 13102: [[12500, 12450, 12473, 12488, 12523], 256], 13103: [[12500, 12463, 12523], 256], 13104: [[12500, 12467], 256], 13105: [[12499, 12523], 256], 13106: [[12501, 12449, 12521, 12483, 12489], 256], 13107: [[12501, 12451, 12540, 12488], 256], 13108: [[12502, 12483, 12471, 12455, 12523], 256], 13109: [[12501, 12521, 12531], 256], 13110: [[12504, 12463, 12479, 12540, 12523], 256], 13111: [[12506, 12477], 256], 13112: [[12506, 12491, 12498], 256], 13113: [[12504, 12523, 12484], 256], 13114: [[12506, 12531, 12473], 256], 13115: [[12506, 12540, 12472], 256], 13116: [[12505, 12540, 12479], 256], 13117: [[12509, 12452, 12531, 12488], 256], 13118: [[12508, 12523, 12488], 256], 13119: [[12507, 12531], 256], 13120: [[12509, 12531, 12489], 256], 13121: [[12507, 12540, 12523], 256], 13122: [[12507, 12540, 12531], 256], 13123: [[12510, 12452, 12463, 12525], 256], 13124: [[12510, 12452, 12523], 256], 13125: [[12510, 12483, 12495], 256], 13126: [[12510, 12523, 12463], 256], 13127: [[12510, 12531, 12471, 12519, 12531], 256], 13128: [[12511, 12463, 12525, 12531], 256], 13129: [[12511, 12522], 256], 13130: [[12511, 12522, 12496, 12540, 12523], 256], 13131: [[12513, 12460], 256], 13132: [[12513, 12460, 12488, 12531], 256], 13133: [[12513, 12540, 12488, 12523], 256], 13134: [[12516, 12540, 12489], 256], 13135: [[12516, 12540, 12523], 256], 13136: [[12518, 12450, 12531], 256], 13137: [[12522, 12483, 12488, 12523], 256], 13138: [[12522, 12521], 256], 13139: [[12523, 12500, 12540], 256], 13140: [[12523, 12540, 12502, 12523], 256], 13141: [[12524, 12512], 256], 13142: [[12524, 12531, 12488, 12466, 12531], 256], 13143: [[12527, 12483, 12488], 256], 13144: [[48, 28857], 256], 13145: [[49, 28857], 256], 13146: [[50, 28857], 256], 13147: [[51, 28857], 256], 13148: [[52, 28857], 256], 13149: [[53, 28857], 256], 13150: [[54, 28857], 256], 13151: [[55, 28857], 256], 13152: [[56, 28857], 256], 13153: [[57, 28857], 256], 13154: [[49, 48, 28857], 256], 13155: [[49, 49, 28857], 256], 13156: [[49, 50, 28857], 256], 13157: [[49, 51, 28857], 256], 13158: [[49, 52, 28857], 256], 13159: [[49, 53, 28857], 256], 13160: [[49, 54, 28857], 256], 13161: [[49, 55, 28857], 256], 13162: [[49, 56, 28857], 256], 13163: [[49, 57, 28857], 256], 13164: [[50, 48, 28857], 256], 13165: [[50, 49, 28857], 256], 13166: [[50, 50, 28857], 256], 13167: [[50, 51, 28857], 256], 13168: [[50, 52, 28857], 256], 13169: [[104, 80, 97], 256], 13170: [[100, 97], 256], 13171: [[65, 85], 256], 13172: [[98, 97, 114], 256], 13173: [[111, 86], 256], 13174: [[112, 99], 256], 13175: [[100, 109], 256], 13176: [[100, 109, 178], 256], 13177: [[100, 109, 179], 256], 13178: [[73, 85], 256], 13179: [[24179, 25104], 256], 13180: [[26157, 21644], 256], 13181: [[22823, 27491], 256], 13182: [[26126, 27835], 256], 13183: [[26666, 24335, 20250, 31038], 256], 13184: [[112, 65], 256], 13185: [[110, 65], 256], 13186: [[956, 65], 256], 13187: [[109, 65], 256], 13188: [[107, 65], 256], 13189: [[75, 66], 256], 13190: [[77, 66], 256], 13191: [[71, 66], 256], 13192: [[99, 97, 108], 256], 13193: [[107, 99, 97, 108], 256], 13194: [[112, 70], 256], 13195: [[110, 70], 256], 13196: [[956, 70], 256], 13197: [[956, 103], 256], 13198: [[109, 103], 256], 13199: [[107, 103], 256], 13200: [[72, 122], 256], 13201: [[107, 72, 122], 256], 13202: [[77, 72, 122], 256], 13203: [[71, 72, 122], 256], 13204: [[84, 72, 122], 256], 13205: [[956, 8467], 256], 13206: [[109, 8467], 256], 13207: [[100, 8467], 256], 13208: [[107, 8467], 256], 13209: [[102, 109], 256], 13210: [[110, 109], 256], 13211: [[956, 109], 256], 13212: [[109, 109], 256], 13213: [[99, 109], 256], 13214: [[107, 109], 256], 13215: [[109, 109, 178], 256], 13216: [[99, 109, 178], 256], 13217: [[109, 178], 256], 13218: [[107, 109, 178], 256], 13219: [[109, 109, 179], 256], 13220: [[99, 109, 179], 256], 13221: [[109, 179], 256], 13222: [[107, 109, 179], 256], 13223: [[109, 8725, 115], 256], 13224: [[109, 8725, 115, 178], 256], 13225: [[80, 97], 256], 13226: [[107, 80, 97], 256], 13227: [[77, 80, 97], 256], 13228: [[71, 80, 97], 256], 13229: [[114, 97, 100], 256], 13230: [[114, 97, 100, 8725, 115], 256], 13231: [[114, 97, 100, 8725, 115, 178], 256], 13232: [[112, 115], 256], 13233: [[110, 115], 256], 13234: [[956, 115], 256], 13235: [[109, 115], 256], 13236: [[112, 86], 256], 13237: [[110, 86], 256], 13238: [[956, 86], 256], 13239: [[109, 86], 256], 13240: [[107, 86], 256], 13241: [[77, 86], 256], 13242: [[112, 87], 256], 13243: [[110, 87], 256], 13244: [[956, 87], 256], 13245: [[109, 87], 256], 13246: [[107, 87], 256], 13247: [[77, 87], 256], 13248: [[107, 937], 256], 13249: [[77, 937], 256], 13250: [[97, 46, 109, 46], 256], 13251: [[66, 113], 256], 13252: [[99, 99], 256], 13253: [[99, 100], 256], 13254: [[67, 8725, 107, 103], 256], 13255: [[67, 111, 46], 256], 13256: [[100, 66], 256], 13257: [[71, 121], 256], 13258: [[104, 97], 256], 13259: [[72, 80], 256], 13260: [[105, 110], 256], 13261: [[75, 75], 256], 13262: [[75, 77], 256], 13263: [[107, 116], 256], 13264: [[108, 109], 256], 13265: [[108, 110], 256], 13266: [[108, 111, 103], 256], 13267: [[108, 120], 256], 13268: [[109, 98], 256], 13269: [[109, 105, 108], 256], 13270: [[109, 111, 108], 256], 13271: [[80, 72], 256], 13272: [[112, 46, 109, 46], 256], 13273: [[80, 80, 77], 256], 13274: [[80, 82], 256], 13275: [[115, 114], 256], 13276: [[83, 118], 256], 13277: [[87, 98], 256], 13278: [[86, 8725, 109], 256], 13279: [[65, 8725, 109], 256], 13280: [[49, 26085], 256], 13281: [[50, 26085], 256], 13282: [[51, 26085], 256], 13283: [[52, 26085], 256], 13284: [[53, 26085], 256], 13285: [[54, 26085], 256], 13286: [[55, 26085], 256], 13287: [[56, 26085], 256], 13288: [[57, 26085], 256], 13289: [[49, 48, 26085], 256], 13290: [[49, 49, 26085], 256], 13291: [[49, 50, 26085], 256], 13292: [[49, 51, 26085], 256], 13293: [[49, 52, 26085], 256], 13294: [[49, 53, 26085], 256], 13295: [[49, 54, 26085], 256], 13296: [[49, 55, 26085], 256], 13297: [[49, 56, 26085], 256], 13298: [[49, 57, 26085], 256], 13299: [[50, 48, 26085], 256], 13300: [[50, 49, 26085], 256], 13301: [[50, 50, 26085], 256], 13302: [[50, 51, 26085], 256], 13303: [[50, 52, 26085], 256], 13304: [[50, 53, 26085], 256], 13305: [[50, 54, 26085], 256], 13306: [[50, 55, 26085], 256], 13307: [[50, 56, 26085], 256], 13308: [[50, 57, 26085], 256], 13309: [[51, 48, 26085], 256], 13310: [[51, 49, 26085], 256], 13311: [[103, 97, 108], 256] }, 27136: { 92912: [, 1], 92913: [, 1], 92914: [, 1], 92915: [, 1], 92916: [, 1] }, 27392: { 92976: [, 230], 92977: [, 230], 92978: [, 230], 92979: [, 230], 92980: [, 230], 92981: [, 230], 92982: [, 230] }, 42496: { 42607: [, 230], 42612: [, 230], 42613: [, 230], 42614: [, 230], 42615: [, 230], 42616: [, 230], 42617: [, 230], 42618: [, 230], 42619: [, 230], 42620: [, 230], 42621: [, 230], 42652: [[1098], 256], 42653: [[1100], 256], 42655: [, 230], 42736: [, 230], 42737: [, 230] }, 42752: { 42864: [[42863], 256], 43e3: [[294], 256], 43001: [[339], 256] }, 43008: { 43014: [, 9], 43204: [, 9], 43232: [, 230], 43233: [, 230], 43234: [, 230], 43235: [, 230], 43236: [, 230], 43237: [, 230], 43238: [, 230], 43239: [, 230], 43240: [, 230], 43241: [, 230], 43242: [, 230], 43243: [, 230], 43244: [, 230], 43245: [, 230], 43246: [, 230], 43247: [, 230], 43248: [, 230], 43249: [, 230] }, 43264: { 43307: [, 220], 43308: [, 220], 43309: [, 220], 43347: [, 9], 43443: [, 7], 43456: [, 9] }, 43520: { 43696: [, 230], 43698: [, 230], 43699: [, 230], 43700: [, 220], 43703: [, 230], 43704: [, 230], 43710: [, 230], 43711: [, 230], 43713: [, 230], 43766: [, 9] }, 43776: { 43868: [[42791], 256], 43869: [[43831], 256], 43870: [[619], 256], 43871: [[43858], 256], 44013: [, 9] }, 48128: { 113822: [, 1] }, 53504: { 119134: [[119127, 119141], 512], 119135: [[119128, 119141], 512], 119136: [[119135, 119150], 512], 119137: [[119135, 119151], 512], 119138: [[119135, 119152], 512], 119139: [[119135, 119153], 512], 119140: [[119135, 119154], 512], 119141: [, 216], 119142: [, 216], 119143: [, 1], 119144: [, 1], 119145: [, 1], 119149: [, 226], 119150: [, 216], 119151: [, 216], 119152: [, 216], 119153: [, 216], 119154: [, 216], 119163: [, 220], 119164: [, 220], 119165: [, 220], 119166: [, 220], 119167: [, 220], 119168: [, 220], 119169: [, 220], 119170: [, 220], 119173: [, 230], 119174: [, 230], 119175: [, 230], 119176: [, 230], 119177: [, 230], 119178: [, 220], 119179: [, 220], 119210: [, 230], 119211: [, 230], 119212: [, 230], 119213: [, 230], 119227: [[119225, 119141], 512], 119228: [[119226, 119141], 512], 119229: [[119227, 119150], 512], 119230: [[119228, 119150], 512], 119231: [[119227, 119151], 512], 119232: [[119228, 119151], 512] }, 53760: { 119362: [, 230], 119363: [, 230], 119364: [, 230] }, 54272: { 119808: [[65], 256], 119809: [[66], 256], 119810: [[67], 256], 119811: [[68], 256], 119812: [[69], 256], 119813: [[70], 256], 119814: [[71], 256], 119815: [[72], 256], 119816: [[73], 256], 119817: [[74], 256], 119818: [[75], 256], 119819: [[76], 256], 119820: [[77], 256], 119821: [[78], 256], 119822: [[79], 256], 119823: [[80], 256], 119824: [[81], 256], 119825: [[82], 256], 119826: [[83], 256], 119827: [[84], 256], 119828: [[85], 256], 119829: [[86], 256], 119830: [[87], 256], 119831: [[88], 256], 119832: [[89], 256], 119833: [[90], 256], 119834: [[97], 256], 119835: [[98], 256], 119836: [[99], 256], 119837: [[100], 256], 119838: [[101], 256], 119839: [[102], 256], 119840: [[103], 256], 119841: [[104], 256], 119842: [[105], 256], 119843: [[106], 256], 119844: [[107], 256], 119845: [[108], 256], 119846: [[109], 256], 119847: [[110], 256], 119848: [[111], 256], 119849: [[112], 256], 119850: [[113], 256], 119851: [[114], 256], 119852: [[115], 256], 119853: [[116], 256], 119854: [[117], 256], 119855: [[118], 256], 119856: [[119], 256], 119857: [[120], 256], 119858: [[121], 256], 119859: [[122], 256], 119860: [[65], 256], 119861: [[66], 256], 119862: [[67], 256], 119863: [[68], 256], 119864: [[69], 256], 119865: [[70], 256], 119866: [[71], 256], 119867: [[72], 256], 119868: [[73], 256], 119869: [[74], 256], 119870: [[75], 256], 119871: [[76], 256], 119872: [[77], 256], 119873: [[78], 256], 119874: [[79], 256], 119875: [[80], 256], 119876: [[81], 256], 119877: [[82], 256], 119878: [[83], 256], 119879: [[84], 256], 119880: [[85], 256], 119881: [[86], 256], 119882: [[87], 256], 119883: [[88], 256], 119884: [[89], 256], 119885: [[90], 256], 119886: [[97], 256], 119887: [[98], 256], 119888: [[99], 256], 119889: [[100], 256], 119890: [[101], 256], 119891: [[102], 256], 119892: [[103], 256], 119894: [[105], 256], 119895: [[106], 256], 119896: [[107], 256], 119897: [[108], 256], 119898: [[109], 256], 119899: [[110], 256], 119900: [[111], 256], 119901: [[112], 256], 119902: [[113], 256], 119903: [[114], 256], 119904: [[115], 256], 119905: [[116], 256], 119906: [[117], 256], 119907: [[118], 256], 119908: [[119], 256], 119909: [[120], 256], 119910: [[121], 256], 119911: [[122], 256], 119912: [[65], 256], 119913: [[66], 256], 119914: [[67], 256], 119915: [[68], 256], 119916: [[69], 256], 119917: [[70], 256], 119918: [[71], 256], 119919: [[72], 256], 119920: [[73], 256], 119921: [[74], 256], 119922: [[75], 256], 119923: [[76], 256], 119924: [[77], 256], 119925: [[78], 256], 119926: [[79], 256], 119927: [[80], 256], 119928: [[81], 256], 119929: [[82], 256], 119930: [[83], 256], 119931: [[84], 256], 119932: [[85], 256], 119933: [[86], 256], 119934: [[87], 256], 119935: [[88], 256], 119936: [[89], 256], 119937: [[90], 256], 119938: [[97], 256], 119939: [[98], 256], 119940: [[99], 256], 119941: [[100], 256], 119942: [[101], 256], 119943: [[102], 256], 119944: [[103], 256], 119945: [[104], 256], 119946: [[105], 256], 119947: [[106], 256], 119948: [[107], 256], 119949: [[108], 256], 119950: [[109], 256], 119951: [[110], 256], 119952: [[111], 256], 119953: [[112], 256], 119954: [[113], 256], 119955: [[114], 256], 119956: [[115], 256], 119957: [[116], 256], 119958: [[117], 256], 119959: [[118], 256], 119960: [[119], 256], 119961: [[120], 256], 119962: [[121], 256], 119963: [[122], 256], 119964: [[65], 256], 119966: [[67], 256], 119967: [[68], 256], 119970: [[71], 256], 119973: [[74], 256], 119974: [[75], 256], 119977: [[78], 256], 119978: [[79], 256], 119979: [[80], 256], 119980: [[81], 256], 119982: [[83], 256], 119983: [[84], 256], 119984: [[85], 256], 119985: [[86], 256], 119986: [[87], 256], 119987: [[88], 256], 119988: [[89], 256], 119989: [[90], 256], 119990: [[97], 256], 119991: [[98], 256], 119992: [[99], 256], 119993: [[100], 256], 119995: [[102], 256], 119997: [[104], 256], 119998: [[105], 256], 119999: [[106], 256], 12e4: [[107], 256], 120001: [[108], 256], 120002: [[109], 256], 120003: [[110], 256], 120005: [[112], 256], 120006: [[113], 256], 120007: [[114], 256], 120008: [[115], 256], 120009: [[116], 256], 120010: [[117], 256], 120011: [[118], 256], 120012: [[119], 256], 120013: [[120], 256], 120014: [[121], 256], 120015: [[122], 256], 120016: [[65], 256], 120017: [[66], 256], 120018: [[67], 256], 120019: [[68], 256], 120020: [[69], 256], 120021: [[70], 256], 120022: [[71], 256], 120023: [[72], 256], 120024: [[73], 256], 120025: [[74], 256], 120026: [[75], 256], 120027: [[76], 256], 120028: [[77], 256], 120029: [[78], 256], 120030: [[79], 256], 120031: [[80], 256], 120032: [[81], 256], 120033: [[82], 256], 120034: [[83], 256], 120035: [[84], 256], 120036: [[85], 256], 120037: [[86], 256], 120038: [[87], 256], 120039: [[88], 256], 120040: [[89], 256], 120041: [[90], 256], 120042: [[97], 256], 120043: [[98], 256], 120044: [[99], 256], 120045: [[100], 256], 120046: [[101], 256], 120047: [[102], 256], 120048: [[103], 256], 120049: [[104], 256], 120050: [[105], 256], 120051: [[106], 256], 120052: [[107], 256], 120053: [[108], 256], 120054: [[109], 256], 120055: [[110], 256], 120056: [[111], 256], 120057: [[112], 256], 120058: [[113], 256], 120059: [[114], 256], 120060: [[115], 256], 120061: [[116], 256], 120062: [[117], 256], 120063: [[118], 256] }, 54528: { 120064: [[119], 256], 120065: [[120], 256], 120066: [[121], 256], 120067: [[122], 256], 120068: [[65], 256], 120069: [[66], 256], 120071: [[68], 256], 120072: [[69], 256], 120073: [[70], 256], 120074: [[71], 256], 120077: [[74], 256], 120078: [[75], 256], 120079: [[76], 256], 120080: [[77], 256], 120081: [[78], 256], 120082: [[79], 256], 120083: [[80], 256], 120084: [[81], 256], 120086: [[83], 256], 120087: [[84], 256], 120088: [[85], 256], 120089: [[86], 256], 120090: [[87], 256], 120091: [[88], 256], 120092: [[89], 256], 120094: [[97], 256], 120095: [[98], 256], 120096: [[99], 256], 120097: [[100], 256], 120098: [[101], 256], 120099: [[102], 256], 120100: [[103], 256], 120101: [[104], 256], 120102: [[105], 256], 120103: [[106], 256], 120104: [[107], 256], 120105: [[108], 256], 120106: [[109], 256], 120107: [[110], 256], 120108: [[111], 256], 120109: [[112], 256], 120110: [[113], 256], 120111: [[114], 256], 120112: [[115], 256], 120113: [[116], 256], 120114: [[117], 256], 120115: [[118], 256], 120116: [[119], 256], 120117: [[120], 256], 120118: [[121], 256], 120119: [[122], 256], 120120: [[65], 256], 120121: [[66], 256], 120123: [[68], 256], 120124: [[69], 256], 120125: [[70], 256], 120126: [[71], 256], 120128: [[73], 256], 120129: [[74], 256], 120130: [[75], 256], 120131: [[76], 256], 120132: [[77], 256], 120134: [[79], 256], 120138: [[83], 256], 120139: [[84], 256], 120140: [[85], 256], 120141: [[86], 256], 120142: [[87], 256], 120143: [[88], 256], 120144: [[89], 256], 120146: [[97], 256], 120147: [[98], 256], 120148: [[99], 256], 120149: [[100], 256], 120150: [[101], 256], 120151: [[102], 256], 120152: [[103], 256], 120153: [[104], 256], 120154: [[105], 256], 120155: [[106], 256], 120156: [[107], 256], 120157: [[108], 256], 120158: [[109], 256], 120159: [[110], 256], 120160: [[111], 256], 120161: [[112], 256], 120162: [[113], 256], 120163: [[114], 256], 120164: [[115], 256], 120165: [[116], 256], 120166: [[117], 256], 120167: [[118], 256], 120168: [[119], 256], 120169: [[120], 256], 120170: [[121], 256], 120171: [[122], 256], 120172: [[65], 256], 120173: [[66], 256], 120174: [[67], 256], 120175: [[68], 256], 120176: [[69], 256], 120177: [[70], 256], 120178: [[71], 256], 120179: [[72], 256], 120180: [[73], 256], 120181: [[74], 256], 120182: [[75], 256], 120183: [[76], 256], 120184: [[77], 256], 120185: [[78], 256], 120186: [[79], 256], 120187: [[80], 256], 120188: [[81], 256], 120189: [[82], 256], 120190: [[83], 256], 120191: [[84], 256], 120192: [[85], 256], 120193: [[86], 256], 120194: [[87], 256], 120195: [[88], 256], 120196: [[89], 256], 120197: [[90], 256], 120198: [[97], 256], 120199: [[98], 256], 120200: [[99], 256], 120201: [[100], 256], 120202: [[101], 256], 120203: [[102], 256], 120204: [[103], 256], 120205: [[104], 256], 120206: [[105], 256], 120207: [[106], 256], 120208: [[107], 256], 120209: [[108], 256], 120210: [[109], 256], 120211: [[110], 256], 120212: [[111], 256], 120213: [[112], 256], 120214: [[113], 256], 120215: [[114], 256], 120216: [[115], 256], 120217: [[116], 256], 120218: [[117], 256], 120219: [[118], 256], 120220: [[119], 256], 120221: [[120], 256], 120222: [[121], 256], 120223: [[122], 256], 120224: [[65], 256], 120225: [[66], 256], 120226: [[67], 256], 120227: [[68], 256], 120228: [[69], 256], 120229: [[70], 256], 120230: [[71], 256], 120231: [[72], 256], 120232: [[73], 256], 120233: [[74], 256], 120234: [[75], 256], 120235: [[76], 256], 120236: [[77], 256], 120237: [[78], 256], 120238: [[79], 256], 120239: [[80], 256], 120240: [[81], 256], 120241: [[82], 256], 120242: [[83], 256], 120243: [[84], 256], 120244: [[85], 256], 120245: [[86], 256], 120246: [[87], 256], 120247: [[88], 256], 120248: [[89], 256], 120249: [[90], 256], 120250: [[97], 256], 120251: [[98], 256], 120252: [[99], 256], 120253: [[100], 256], 120254: [[101], 256], 120255: [[102], 256], 120256: [[103], 256], 120257: [[104], 256], 120258: [[105], 256], 120259: [[106], 256], 120260: [[107], 256], 120261: [[108], 256], 120262: [[109], 256], 120263: [[110], 256], 120264: [[111], 256], 120265: [[112], 256], 120266: [[113], 256], 120267: [[114], 256], 120268: [[115], 256], 120269: [[116], 256], 120270: [[117], 256], 120271: [[118], 256], 120272: [[119], 256], 120273: [[120], 256], 120274: [[121], 256], 120275: [[122], 256], 120276: [[65], 256], 120277: [[66], 256], 120278: [[67], 256], 120279: [[68], 256], 120280: [[69], 256], 120281: [[70], 256], 120282: [[71], 256], 120283: [[72], 256], 120284: [[73], 256], 120285: [[74], 256], 120286: [[75], 256], 120287: [[76], 256], 120288: [[77], 256], 120289: [[78], 256], 120290: [[79], 256], 120291: [[80], 256], 120292: [[81], 256], 120293: [[82], 256], 120294: [[83], 256], 120295: [[84], 256], 120296: [[85], 256], 120297: [[86], 256], 120298: [[87], 256], 120299: [[88], 256], 120300: [[89], 256], 120301: [[90], 256], 120302: [[97], 256], 120303: [[98], 256], 120304: [[99], 256], 120305: [[100], 256], 120306: [[101], 256], 120307: [[102], 256], 120308: [[103], 256], 120309: [[104], 256], 120310: [[105], 256], 120311: [[106], 256], 120312: [[107], 256], 120313: [[108], 256], 120314: [[109], 256], 120315: [[110], 256], 120316: [[111], 256], 120317: [[112], 256], 120318: [[113], 256], 120319: [[114], 256] }, 54784: { 120320: [[115], 256], 120321: [[116], 256], 120322: [[117], 256], 120323: [[118], 256], 120324: [[119], 256], 120325: [[120], 256], 120326: [[121], 256], 120327: [[122], 256], 120328: [[65], 256], 120329: [[66], 256], 120330: [[67], 256], 120331: [[68], 256], 120332: [[69], 256], 120333: [[70], 256], 120334: [[71], 256], 120335: [[72], 256], 120336: [[73], 256], 120337: [[74], 256], 120338: [[75], 256], 120339: [[76], 256], 120340: [[77], 256], 120341: [[78], 256], 120342: [[79], 256], 120343: [[80], 256], 120344: [[81], 256], 120345: [[82], 256], 120346: [[83], 256], 120347: [[84], 256], 120348: [[85], 256], 120349: [[86], 256], 120350: [[87], 256], 120351: [[88], 256], 120352: [[89], 256], 120353: [[90], 256], 120354: [[97], 256], 120355: [[98], 256], 120356: [[99], 256], 120357: [[100], 256], 120358: [[101], 256], 120359: [[102], 256], 120360: [[103], 256], 120361: [[104], 256], 120362: [[105], 256], 120363: [[106], 256], 120364: [[107], 256], 120365: [[108], 256], 120366: [[109], 256], 120367: [[110], 256], 120368: [[111], 256], 120369: [[112], 256], 120370: [[113], 256], 120371: [[114], 256], 120372: [[115], 256], 120373: [[116], 256], 120374: [[117], 256], 120375: [[118], 256], 120376: [[119], 256], 120377: [[120], 256], 120378: [[121], 256], 120379: [[122], 256], 120380: [[65], 256], 120381: [[66], 256], 120382: [[67], 256], 120383: [[68], 256], 120384: [[69], 256], 120385: [[70], 256], 120386: [[71], 256], 120387: [[72], 256], 120388: [[73], 256], 120389: [[74], 256], 120390: [[75], 256], 120391: [[76], 256], 120392: [[77], 256], 120393: [[78], 256], 120394: [[79], 256], 120395: [[80], 256], 120396: [[81], 256], 120397: [[82], 256], 120398: [[83], 256], 120399: [[84], 256], 120400: [[85], 256], 120401: [[86], 256], 120402: [[87], 256], 120403: [[88], 256], 120404: [[89], 256], 120405: [[90], 256], 120406: [[97], 256], 120407: [[98], 256], 120408: [[99], 256], 120409: [[100], 256], 120410: [[101], 256], 120411: [[102], 256], 120412: [[103], 256], 120413: [[104], 256], 120414: [[105], 256], 120415: [[106], 256], 120416: [[107], 256], 120417: [[108], 256], 120418: [[109], 256], 120419: [[110], 256], 120420: [[111], 256], 120421: [[112], 256], 120422: [[113], 256], 120423: [[114], 256], 120424: [[115], 256], 120425: [[116], 256], 120426: [[117], 256], 120427: [[118], 256], 120428: [[119], 256], 120429: [[120], 256], 120430: [[121], 256], 120431: [[122], 256], 120432: [[65], 256], 120433: [[66], 256], 120434: [[67], 256], 120435: [[68], 256], 120436: [[69], 256], 120437: [[70], 256], 120438: [[71], 256], 120439: [[72], 256], 120440: [[73], 256], 120441: [[74], 256], 120442: [[75], 256], 120443: [[76], 256], 120444: [[77], 256], 120445: [[78], 256], 120446: [[79], 256], 120447: [[80], 256], 120448: [[81], 256], 120449: [[82], 256], 120450: [[83], 256], 120451: [[84], 256], 120452: [[85], 256], 120453: [[86], 256], 120454: [[87], 256], 120455: [[88], 256], 120456: [[89], 256], 120457: [[90], 256], 120458: [[97], 256], 120459: [[98], 256], 120460: [[99], 256], 120461: [[100], 256], 120462: [[101], 256], 120463: [[102], 256], 120464: [[103], 256], 120465: [[104], 256], 120466: [[105], 256], 120467: [[106], 256], 120468: [[107], 256], 120469: [[108], 256], 120470: [[109], 256], 120471: [[110], 256], 120472: [[111], 256], 120473: [[112], 256], 120474: [[113], 256], 120475: [[114], 256], 120476: [[115], 256], 120477: [[116], 256], 120478: [[117], 256], 120479: [[118], 256], 120480: [[119], 256], 120481: [[120], 256], 120482: [[121], 256], 120483: [[122], 256], 120484: [[305], 256], 120485: [[567], 256], 120488: [[913], 256], 120489: [[914], 256], 120490: [[915], 256], 120491: [[916], 256], 120492: [[917], 256], 120493: [[918], 256], 120494: [[919], 256], 120495: [[920], 256], 120496: [[921], 256], 120497: [[922], 256], 120498: [[923], 256], 120499: [[924], 256], 120500: [[925], 256], 120501: [[926], 256], 120502: [[927], 256], 120503: [[928], 256], 120504: [[929], 256], 120505: [[1012], 256], 120506: [[931], 256], 120507: [[932], 256], 120508: [[933], 256], 120509: [[934], 256], 120510: [[935], 256], 120511: [[936], 256], 120512: [[937], 256], 120513: [[8711], 256], 120514: [[945], 256], 120515: [[946], 256], 120516: [[947], 256], 120517: [[948], 256], 120518: [[949], 256], 120519: [[950], 256], 120520: [[951], 256], 120521: [[952], 256], 120522: [[953], 256], 120523: [[954], 256], 120524: [[955], 256], 120525: [[956], 256], 120526: [[957], 256], 120527: [[958], 256], 120528: [[959], 256], 120529: [[960], 256], 120530: [[961], 256], 120531: [[962], 256], 120532: [[963], 256], 120533: [[964], 256], 120534: [[965], 256], 120535: [[966], 256], 120536: [[967], 256], 120537: [[968], 256], 120538: [[969], 256], 120539: [[8706], 256], 120540: [[1013], 256], 120541: [[977], 256], 120542: [[1008], 256], 120543: [[981], 256], 120544: [[1009], 256], 120545: [[982], 256], 120546: [[913], 256], 120547: [[914], 256], 120548: [[915], 256], 120549: [[916], 256], 120550: [[917], 256], 120551: [[918], 256], 120552: [[919], 256], 120553: [[920], 256], 120554: [[921], 256], 120555: [[922], 256], 120556: [[923], 256], 120557: [[924], 256], 120558: [[925], 256], 120559: [[926], 256], 120560: [[927], 256], 120561: [[928], 256], 120562: [[929], 256], 120563: [[1012], 256], 120564: [[931], 256], 120565: [[932], 256], 120566: [[933], 256], 120567: [[934], 256], 120568: [[935], 256], 120569: [[936], 256], 120570: [[937], 256], 120571: [[8711], 256], 120572: [[945], 256], 120573: [[946], 256], 120574: [[947], 256], 120575: [[948], 256] }, 55040: { 120576: [[949], 256], 120577: [[950], 256], 120578: [[951], 256], 120579: [[952], 256], 120580: [[953], 256], 120581: [[954], 256], 120582: [[955], 256], 120583: [[956], 256], 120584: [[957], 256], 120585: [[958], 256], 120586: [[959], 256], 120587: [[960], 256], 120588: [[961], 256], 120589: [[962], 256], 120590: [[963], 256], 120591: [[964], 256], 120592: [[965], 256], 120593: [[966], 256], 120594: [[967], 256], 120595: [[968], 256], 120596: [[969], 256], 120597: [[8706], 256], 120598: [[1013], 256], 120599: [[977], 256], 120600: [[1008], 256], 120601: [[981], 256], 120602: [[1009], 256], 120603: [[982], 256], 120604: [[913], 256], 120605: [[914], 256], 120606: [[915], 256], 120607: [[916], 256], 120608: [[917], 256], 120609: [[918], 256], 120610: [[919], 256], 120611: [[920], 256], 120612: [[921], 256], 120613: [[922], 256], 120614: [[923], 256], 120615: [[924], 256], 120616: [[925], 256], 120617: [[926], 256], 120618: [[927], 256], 120619: [[928], 256], 120620: [[929], 256], 120621: [[1012], 256], 120622: [[931], 256], 120623: [[932], 256], 120624: [[933], 256], 120625: [[934], 256], 120626: [[935], 256], 120627: [[936], 256], 120628: [[937], 256], 120629: [[8711], 256], 120630: [[945], 256], 120631: [[946], 256], 120632: [[947], 256], 120633: [[948], 256], 120634: [[949], 256], 120635: [[950], 256], 120636: [[951], 256], 120637: [[952], 256], 120638: [[953], 256], 120639: [[954], 256], 120640: [[955], 256], 120641: [[956], 256], 120642: [[957], 256], 120643: [[958], 256], 120644: [[959], 256], 120645: [[960], 256], 120646: [[961], 256], 120647: [[962], 256], 120648: [[963], 256], 120649: [[964], 256], 120650: [[965], 256], 120651: [[966], 256], 120652: [[967], 256], 120653: [[968], 256], 120654: [[969], 256], 120655: [[8706], 256], 120656: [[1013], 256], 120657: [[977], 256], 120658: [[1008], 256], 120659: [[981], 256], 120660: [[1009], 256], 120661: [[982], 256], 120662: [[913], 256], 120663: [[914], 256], 120664: [[915], 256], 120665: [[916], 256], 120666: [[917], 256], 120667: [[918], 256], 120668: [[919], 256], 120669: [[920], 256], 120670: [[921], 256], 120671: [[922], 256], 120672: [[923], 256], 120673: [[924], 256], 120674: [[925], 256], 120675: [[926], 256], 120676: [[927], 256], 120677: [[928], 256], 120678: [[929], 256], 120679: [[1012], 256], 120680: [[931], 256], 120681: [[932], 256], 120682: [[933], 256], 120683: [[934], 256], 120684: [[935], 256], 120685: [[936], 256], 120686: [[937], 256], 120687: [[8711], 256], 120688: [[945], 256], 120689: [[946], 256], 120690: [[947], 256], 120691: [[948], 256], 120692: [[949], 256], 120693: [[950], 256], 120694: [[951], 256], 120695: [[952], 256], 120696: [[953], 256], 120697: [[954], 256], 120698: [[955], 256], 120699: [[956], 256], 120700: [[957], 256], 120701: [[958], 256], 120702: [[959], 256], 120703: [[960], 256], 120704: [[961], 256], 120705: [[962], 256], 120706: [[963], 256], 120707: [[964], 256], 120708: [[965], 256], 120709: [[966], 256], 120710: [[967], 256], 120711: [[968], 256], 120712: [[969], 256], 120713: [[8706], 256], 120714: [[1013], 256], 120715: [[977], 256], 120716: [[1008], 256], 120717: [[981], 256], 120718: [[1009], 256], 120719: [[982], 256], 120720: [[913], 256], 120721: [[914], 256], 120722: [[915], 256], 120723: [[916], 256], 120724: [[917], 256], 120725: [[918], 256], 120726: [[919], 256], 120727: [[920], 256], 120728: [[921], 256], 120729: [[922], 256], 120730: [[923], 256], 120731: [[924], 256], 120732: [[925], 256], 120733: [[926], 256], 120734: [[927], 256], 120735: [[928], 256], 120736: [[929], 256], 120737: [[1012], 256], 120738: [[931], 256], 120739: [[932], 256], 120740: [[933], 256], 120741: [[934], 256], 120742: [[935], 256], 120743: [[936], 256], 120744: [[937], 256], 120745: [[8711], 256], 120746: [[945], 256], 120747: [[946], 256], 120748: [[947], 256], 120749: [[948], 256], 120750: [[949], 256], 120751: [[950], 256], 120752: [[951], 256], 120753: [[952], 256], 120754: [[953], 256], 120755: [[954], 256], 120756: [[955], 256], 120757: [[956], 256], 120758: [[957], 256], 120759: [[958], 256], 120760: [[959], 256], 120761: [[960], 256], 120762: [[961], 256], 120763: [[962], 256], 120764: [[963], 256], 120765: [[964], 256], 120766: [[965], 256], 120767: [[966], 256], 120768: [[967], 256], 120769: [[968], 256], 120770: [[969], 256], 120771: [[8706], 256], 120772: [[1013], 256], 120773: [[977], 256], 120774: [[1008], 256], 120775: [[981], 256], 120776: [[1009], 256], 120777: [[982], 256], 120778: [[988], 256], 120779: [[989], 256], 120782: [[48], 256], 120783: [[49], 256], 120784: [[50], 256], 120785: [[51], 256], 120786: [[52], 256], 120787: [[53], 256], 120788: [[54], 256], 120789: [[55], 256], 120790: [[56], 256], 120791: [[57], 256], 120792: [[48], 256], 120793: [[49], 256], 120794: [[50], 256], 120795: [[51], 256], 120796: [[52], 256], 120797: [[53], 256], 120798: [[54], 256], 120799: [[55], 256], 120800: [[56], 256], 120801: [[57], 256], 120802: [[48], 256], 120803: [[49], 256], 120804: [[50], 256], 120805: [[51], 256], 120806: [[52], 256], 120807: [[53], 256], 120808: [[54], 256], 120809: [[55], 256], 120810: [[56], 256], 120811: [[57], 256], 120812: [[48], 256], 120813: [[49], 256], 120814: [[50], 256], 120815: [[51], 256], 120816: [[52], 256], 120817: [[53], 256], 120818: [[54], 256], 120819: [[55], 256], 120820: [[56], 256], 120821: [[57], 256], 120822: [[48], 256], 120823: [[49], 256], 120824: [[50], 256], 120825: [[51], 256], 120826: [[52], 256], 120827: [[53], 256], 120828: [[54], 256], 120829: [[55], 256], 120830: [[56], 256], 120831: [[57], 256] }, 59392: { 125136: [, 220], 125137: [, 220], 125138: [, 220], 125139: [, 220], 125140: [, 220], 125141: [, 220], 125142: [, 220] }, 60928: { 126464: [[1575], 256], 126465: [[1576], 256], 126466: [[1580], 256], 126467: [[1583], 256], 126469: [[1608], 256], 126470: [[1586], 256], 126471: [[1581], 256], 126472: [[1591], 256], 126473: [[1610], 256], 126474: [[1603], 256], 126475: [[1604], 256], 126476: [[1605], 256], 126477: [[1606], 256], 126478: [[1587], 256], 126479: [[1593], 256], 126480: [[1601], 256], 126481: [[1589], 256], 126482: [[1602], 256], 126483: [[1585], 256], 126484: [[1588], 256], 126485: [[1578], 256], 126486: [[1579], 256], 126487: [[1582], 256], 126488: [[1584], 256], 126489: [[1590], 256], 126490: [[1592], 256], 126491: [[1594], 256], 126492: [[1646], 256], 126493: [[1722], 256], 126494: [[1697], 256], 126495: [[1647], 256], 126497: [[1576], 256], 126498: [[1580], 256], 126500: [[1607], 256], 126503: [[1581], 256], 126505: [[1610], 256], 126506: [[1603], 256], 126507: [[1604], 256], 126508: [[1605], 256], 126509: [[1606], 256], 126510: [[1587], 256], 126511: [[1593], 256], 126512: [[1601], 256], 126513: [[1589], 256], 126514: [[1602], 256], 126516: [[1588], 256], 126517: [[1578], 256], 126518: [[1579], 256], 126519: [[1582], 256], 126521: [[1590], 256], 126523: [[1594], 256], 126530: [[1580], 256], 126535: [[1581], 256], 126537: [[1610], 256], 126539: [[1604], 256], 126541: [[1606], 256], 126542: [[1587], 256], 126543: [[1593], 256], 126545: [[1589], 256], 126546: [[1602], 256], 126548: [[1588], 256], 126551: [[1582], 256], 126553: [[1590], 256], 126555: [[1594], 256], 126557: [[1722], 256], 126559: [[1647], 256], 126561: [[1576], 256], 126562: [[1580], 256], 126564: [[1607], 256], 126567: [[1581], 256], 126568: [[1591], 256], 126569: [[1610], 256], 126570: [[1603], 256], 126572: [[1605], 256], 126573: [[1606], 256], 126574: [[1587], 256], 126575: [[1593], 256], 126576: [[1601], 256], 126577: [[1589], 256], 126578: [[1602], 256], 126580: [[1588], 256], 126581: [[1578], 256], 126582: [[1579], 256], 126583: [[1582], 256], 126585: [[1590], 256], 126586: [[1592], 256], 126587: [[1594], 256], 126588: [[1646], 256], 126590: [[1697], 256], 126592: [[1575], 256], 126593: [[1576], 256], 126594: [[1580], 256], 126595: [[1583], 256], 126596: [[1607], 256], 126597: [[1608], 256], 126598: [[1586], 256], 126599: [[1581], 256], 126600: [[1591], 256], 126601: [[1610], 256], 126603: [[1604], 256], 126604: [[1605], 256], 126605: [[1606], 256], 126606: [[1587], 256], 126607: [[1593], 256], 126608: [[1601], 256], 126609: [[1589], 256], 126610: [[1602], 256], 126611: [[1585], 256], 126612: [[1588], 256], 126613: [[1578], 256], 126614: [[1579], 256], 126615: [[1582], 256], 126616: [[1584], 256], 126617: [[1590], 256], 126618: [[1592], 256], 126619: [[1594], 256], 126625: [[1576], 256], 126626: [[1580], 256], 126627: [[1583], 256], 126629: [[1608], 256], 126630: [[1586], 256], 126631: [[1581], 256], 126632: [[1591], 256], 126633: [[1610], 256], 126635: [[1604], 256], 126636: [[1605], 256], 126637: [[1606], 256], 126638: [[1587], 256], 126639: [[1593], 256], 126640: [[1601], 256], 126641: [[1589], 256], 126642: [[1602], 256], 126643: [[1585], 256], 126644: [[1588], 256], 126645: [[1578], 256], 126646: [[1579], 256], 126647: [[1582], 256], 126648: [[1584], 256], 126649: [[1590], 256], 126650: [[1592], 256], 126651: [[1594], 256] }, 61696: { 127232: [[48, 46], 256], 127233: [[48, 44], 256], 127234: [[49, 44], 256], 127235: [[50, 44], 256], 127236: [[51, 44], 256], 127237: [[52, 44], 256], 127238: [[53, 44], 256], 127239: [[54, 44], 256], 127240: [[55, 44], 256], 127241: [[56, 44], 256], 127242: [[57, 44], 256], 127248: [[40, 65, 41], 256], 127249: [[40, 66, 41], 256], 127250: [[40, 67, 41], 256], 127251: [[40, 68, 41], 256], 127252: [[40, 69, 41], 256], 127253: [[40, 70, 41], 256], 127254: [[40, 71, 41], 256], 127255: [[40, 72, 41], 256], 127256: [[40, 73, 41], 256], 127257: [[40, 74, 41], 256], 127258: [[40, 75, 41], 256], 127259: [[40, 76, 41], 256], 127260: [[40, 77, 41], 256], 127261: [[40, 78, 41], 256], 127262: [[40, 79, 41], 256], 127263: [[40, 80, 41], 256], 127264: [[40, 81, 41], 256], 127265: [[40, 82, 41], 256], 127266: [[40, 83, 41], 256], 127267: [[40, 84, 41], 256], 127268: [[40, 85, 41], 256], 127269: [[40, 86, 41], 256], 127270: [[40, 87, 41], 256], 127271: [[40, 88, 41], 256], 127272: [[40, 89, 41], 256], 127273: [[40, 90, 41], 256], 127274: [[12308, 83, 12309], 256], 127275: [[67], 256], 127276: [[82], 256], 127277: [[67, 68], 256], 127278: [[87, 90], 256], 127280: [[65], 256], 127281: [[66], 256], 127282: [[67], 256], 127283: [[68], 256], 127284: [[69], 256], 127285: [[70], 256], 127286: [[71], 256], 127287: [[72], 256], 127288: [[73], 256], 127289: [[74], 256], 127290: [[75], 256], 127291: [[76], 256], 127292: [[77], 256], 127293: [[78], 256], 127294: [[79], 256], 127295: [[80], 256], 127296: [[81], 256], 127297: [[82], 256], 127298: [[83], 256], 127299: [[84], 256], 127300: [[85], 256], 127301: [[86], 256], 127302: [[87], 256], 127303: [[88], 256], 127304: [[89], 256], 127305: [[90], 256], 127306: [[72, 86], 256], 127307: [[77, 86], 256], 127308: [[83, 68], 256], 127309: [[83, 83], 256], 127310: [[80, 80, 86], 256], 127311: [[87, 67], 256], 127338: [[77, 67], 256], 127339: [[77, 68], 256], 127376: [[68, 74], 256] }, 61952: { 127488: [[12411, 12363], 256], 127489: [[12467, 12467], 256], 127490: [[12469], 256], 127504: [[25163], 256], 127505: [[23383], 256], 127506: [[21452], 256], 127507: [[12487], 256], 127508: [[20108], 256], 127509: [[22810], 256], 127510: [[35299], 256], 127511: [[22825], 256], 127512: [[20132], 256], 127513: [[26144], 256], 127514: [[28961], 256], 127515: [[26009], 256], 127516: [[21069], 256], 127517: [[24460], 256], 127518: [[20877], 256], 127519: [[26032], 256], 127520: [[21021], 256], 127521: [[32066], 256], 127522: [[29983], 256], 127523: [[36009], 256], 127524: [[22768], 256], 127525: [[21561], 256], 127526: [[28436], 256], 127527: [[25237], 256], 127528: [[25429], 256], 127529: [[19968], 256], 127530: [[19977], 256], 127531: [[36938], 256], 127532: [[24038], 256], 127533: [[20013], 256], 127534: [[21491], 256], 127535: [[25351], 256], 127536: [[36208], 256], 127537: [[25171], 256], 127538: [[31105], 256], 127539: [[31354], 256], 127540: [[21512], 256], 127541: [[28288], 256], 127542: [[26377], 256], 127543: [[26376], 256], 127544: [[30003], 256], 127545: [[21106], 256], 127546: [[21942], 256], 127552: [[12308, 26412, 12309], 256], 127553: [[12308, 19977, 12309], 256], 127554: [[12308, 20108, 12309], 256], 127555: [[12308, 23433, 12309], 256], 127556: [[12308, 28857, 12309], 256], 127557: [[12308, 25171, 12309], 256], 127558: [[12308, 30423, 12309], 256], 127559: [[12308, 21213, 12309], 256], 127560: [[12308, 25943, 12309], 256], 127568: [[24471], 256], 127569: [[21487], 256] }, 63488: { 194560: [[20029]], 194561: [[20024]], 194562: [[20033]], 194563: [[131362]], 194564: [[20320]], 194565: [[20398]], 194566: [[20411]], 194567: [[20482]], 194568: [[20602]], 194569: [[20633]], 194570: [[20711]], 194571: [[20687]], 194572: [[13470]], 194573: [[132666]], 194574: [[20813]], 194575: [[20820]], 194576: [[20836]], 194577: [[20855]], 194578: [[132380]], 194579: [[13497]], 194580: [[20839]], 194581: [[20877]], 194582: [[132427]], 194583: [[20887]], 194584: [[20900]], 194585: [[20172]], 194586: [[20908]], 194587: [[20917]], 194588: [[168415]], 194589: [[20981]], 194590: [[20995]], 194591: [[13535]], 194592: [[21051]], 194593: [[21062]], 194594: [[21106]], 194595: [[21111]], 194596: [[13589]], 194597: [[21191]], 194598: [[21193]], 194599: [[21220]], 194600: [[21242]], 194601: [[21253]], 194602: [[21254]], 194603: [[21271]], 194604: [[21321]], 194605: [[21329]], 194606: [[21338]], 194607: [[21363]], 194608: [[21373]], 194609: [[21375]], 194610: [[21375]], 194611: [[21375]], 194612: [[133676]], 194613: [[28784]], 194614: [[21450]], 194615: [[21471]], 194616: [[133987]], 194617: [[21483]], 194618: [[21489]], 194619: [[21510]], 194620: [[21662]], 194621: [[21560]], 194622: [[21576]], 194623: [[21608]], 194624: [[21666]], 194625: [[21750]], 194626: [[21776]], 194627: [[21843]], 194628: [[21859]], 194629: [[21892]], 194630: [[21892]], 194631: [[21913]], 194632: [[21931]], 194633: [[21939]], 194634: [[21954]], 194635: [[22294]], 194636: [[22022]], 194637: [[22295]], 194638: [[22097]], 194639: [[22132]], 194640: [[20999]], 194641: [[22766]], 194642: [[22478]], 194643: [[22516]], 194644: [[22541]], 194645: [[22411]], 194646: [[22578]], 194647: [[22577]], 194648: [[22700]], 194649: [[136420]], 194650: [[22770]], 194651: [[22775]], 194652: [[22790]], 194653: [[22810]], 194654: [[22818]], 194655: [[22882]], 194656: [[136872]], 194657: [[136938]], 194658: [[23020]], 194659: [[23067]], 194660: [[23079]], 194661: [[23e3]], 194662: [[23142]], 194663: [[14062]], 194664: [[14076]], 194665: [[23304]], 194666: [[23358]], 194667: [[23358]], 194668: [[137672]], 194669: [[23491]], 194670: [[23512]], 194671: [[23527]], 194672: [[23539]], 194673: [[138008]], 194674: [[23551]], 194675: [[23558]], 194676: [[24403]], 194677: [[23586]], 194678: [[14209]], 194679: [[23648]], 194680: [[23662]], 194681: [[23744]], 194682: [[23693]], 194683: [[138724]], 194684: [[23875]], 194685: [[138726]], 194686: [[23918]], 194687: [[23915]], 194688: [[23932]], 194689: [[24033]], 194690: [[24034]], 194691: [[14383]], 194692: [[24061]], 194693: [[24104]], 194694: [[24125]], 194695: [[24169]], 194696: [[14434]], 194697: [[139651]], 194698: [[14460]], 194699: [[24240]], 194700: [[24243]], 194701: [[24246]], 194702: [[24266]], 194703: [[172946]], 194704: [[24318]], 194705: [[140081]], 194706: [[140081]], 194707: [[33281]], 194708: [[24354]], 194709: [[24354]], 194710: [[14535]], 194711: [[144056]], 194712: [[156122]], 194713: [[24418]], 194714: [[24427]], 194715: [[14563]], 194716: [[24474]], 194717: [[24525]], 194718: [[24535]], 194719: [[24569]], 194720: [[24705]], 194721: [[14650]], 194722: [[14620]], 194723: [[24724]], 194724: [[141012]], 194725: [[24775]], 194726: [[24904]], 194727: [[24908]], 194728: [[24910]], 194729: [[24908]], 194730: [[24954]], 194731: [[24974]], 194732: [[25010]], 194733: [[24996]], 194734: [[25007]], 194735: [[25054]], 194736: [[25074]], 194737: [[25078]], 194738: [[25104]], 194739: [[25115]], 194740: [[25181]], 194741: [[25265]], 194742: [[25300]], 194743: [[25424]], 194744: [[142092]], 194745: [[25405]], 194746: [[25340]], 194747: [[25448]], 194748: [[25475]], 194749: [[25572]], 194750: [[142321]], 194751: [[25634]], 194752: [[25541]], 194753: [[25513]], 194754: [[14894]], 194755: [[25705]], 194756: [[25726]], 194757: [[25757]], 194758: [[25719]], 194759: [[14956]], 194760: [[25935]], 194761: [[25964]], 194762: [[143370]], 194763: [[26083]], 194764: [[26360]], 194765: [[26185]], 194766: [[15129]], 194767: [[26257]], 194768: [[15112]], 194769: [[15076]], 194770: [[20882]], 194771: [[20885]], 194772: [[26368]], 194773: [[26268]], 194774: [[32941]], 194775: [[17369]], 194776: [[26391]], 194777: [[26395]], 194778: [[26401]], 194779: [[26462]], 194780: [[26451]], 194781: [[144323]], 194782: [[15177]], 194783: [[26618]], 194784: [[26501]], 194785: [[26706]], 194786: [[26757]], 194787: [[144493]], 194788: [[26766]], 194789: [[26655]], 194790: [[26900]], 194791: [[15261]], 194792: [[26946]], 194793: [[27043]], 194794: [[27114]], 194795: [[27304]], 194796: [[145059]], 194797: [[27355]], 194798: [[15384]], 194799: [[27425]], 194800: [[145575]], 194801: [[27476]], 194802: [[15438]], 194803: [[27506]], 194804: [[27551]], 194805: [[27578]], 194806: [[27579]], 194807: [[146061]], 194808: [[138507]], 194809: [[146170]], 194810: [[27726]], 194811: [[146620]], 194812: [[27839]], 194813: [[27853]], 194814: [[27751]], 194815: [[27926]] }, 63744: { 63744: [[35912]], 63745: [[26356]], 63746: [[36554]], 63747: [[36040]], 63748: [[28369]], 63749: [[20018]], 63750: [[21477]], 63751: [[40860]], 63752: [[40860]], 63753: [[22865]], 63754: [[37329]], 63755: [[21895]], 63756: [[22856]], 63757: [[25078]], 63758: [[30313]], 63759: [[32645]], 63760: [[34367]], 63761: [[34746]], 63762: [[35064]], 63763: [[37007]], 63764: [[27138]], 63765: [[27931]], 63766: [[28889]], 63767: [[29662]], 63768: [[33853]], 63769: [[37226]], 63770: [[39409]], 63771: [[20098]], 63772: [[21365]], 63773: [[27396]], 63774: [[29211]], 63775: [[34349]], 63776: [[40478]], 63777: [[23888]], 63778: [[28651]], 63779: [[34253]], 63780: [[35172]], 63781: [[25289]], 63782: [[33240]], 63783: [[34847]], 63784: [[24266]], 63785: [[26391]], 63786: [[28010]], 63787: [[29436]], 63788: [[37070]], 63789: [[20358]], 63790: [[20919]], 63791: [[21214]], 63792: [[25796]], 63793: [[27347]], 63794: [[29200]], 63795: [[30439]], 63796: [[32769]], 63797: [[34310]], 63798: [[34396]], 63799: [[36335]], 63800: [[38706]], 63801: [[39791]], 63802: [[40442]], 63803: [[30860]], 63804: [[31103]], 63805: [[32160]], 63806: [[33737]], 63807: [[37636]], 63808: [[40575]], 63809: [[35542]], 63810: [[22751]], 63811: [[24324]], 63812: [[31840]], 63813: [[32894]], 63814: [[29282]], 63815: [[30922]], 63816: [[36034]], 63817: [[38647]], 63818: [[22744]], 63819: [[23650]], 63820: [[27155]], 63821: [[28122]], 63822: [[28431]], 63823: [[32047]], 63824: [[32311]], 63825: [[38475]], 63826: [[21202]], 63827: [[32907]], 63828: [[20956]], 63829: [[20940]], 63830: [[31260]], 63831: [[32190]], 63832: [[33777]], 63833: [[38517]], 63834: [[35712]], 63835: [[25295]], 63836: [[27138]], 63837: [[35582]], 63838: [[20025]], 63839: [[23527]], 63840: [[24594]], 63841: [[29575]], 63842: [[30064]], 63843: [[21271]], 63844: [[30971]], 63845: [[20415]], 63846: [[24489]], 63847: [[19981]], 63848: [[27852]], 63849: [[25976]], 63850: [[32034]], 63851: [[21443]], 63852: [[22622]], 63853: [[30465]], 63854: [[33865]], 63855: [[35498]], 63856: [[27578]], 63857: [[36784]], 63858: [[27784]], 63859: [[25342]], 63860: [[33509]], 63861: [[25504]], 63862: [[30053]], 63863: [[20142]], 63864: [[20841]], 63865: [[20937]], 63866: [[26753]], 63867: [[31975]], 63868: [[33391]], 63869: [[35538]], 63870: [[37327]], 63871: [[21237]], 63872: [[21570]], 63873: [[22899]], 63874: [[24300]], 63875: [[26053]], 63876: [[28670]], 63877: [[31018]], 63878: [[38317]], 63879: [[39530]], 63880: [[40599]], 63881: [[40654]], 63882: [[21147]], 63883: [[26310]], 63884: [[27511]], 63885: [[36706]], 63886: [[24180]], 63887: [[24976]], 63888: [[25088]], 63889: [[25754]], 63890: [[28451]], 63891: [[29001]], 63892: [[29833]], 63893: [[31178]], 63894: [[32244]], 63895: [[32879]], 63896: [[36646]], 63897: [[34030]], 63898: [[36899]], 63899: [[37706]], 63900: [[21015]], 63901: [[21155]], 63902: [[21693]], 63903: [[28872]], 63904: [[35010]], 63905: [[35498]], 63906: [[24265]], 63907: [[24565]], 63908: [[25467]], 63909: [[27566]], 63910: [[31806]], 63911: [[29557]], 63912: [[20196]], 63913: [[22265]], 63914: [[23527]], 63915: [[23994]], 63916: [[24604]], 63917: [[29618]], 63918: [[29801]], 63919: [[32666]], 63920: [[32838]], 63921: [[37428]], 63922: [[38646]], 63923: [[38728]], 63924: [[38936]], 63925: [[20363]], 63926: [[31150]], 63927: [[37300]], 63928: [[38584]], 63929: [[24801]], 63930: [[20102]], 63931: [[20698]], 63932: [[23534]], 63933: [[23615]], 63934: [[26009]], 63935: [[27138]], 63936: [[29134]], 63937: [[30274]], 63938: [[34044]], 63939: [[36988]], 63940: [[40845]], 63941: [[26248]], 63942: [[38446]], 63943: [[21129]], 63944: [[26491]], 63945: [[26611]], 63946: [[27969]], 63947: [[28316]], 63948: [[29705]], 63949: [[30041]], 63950: [[30827]], 63951: [[32016]], 63952: [[39006]], 63953: [[20845]], 63954: [[25134]], 63955: [[38520]], 63956: [[20523]], 63957: [[23833]], 63958: [[28138]], 63959: [[36650]], 63960: [[24459]], 63961: [[24900]], 63962: [[26647]], 63963: [[29575]], 63964: [[38534]], 63965: [[21033]], 63966: [[21519]], 63967: [[23653]], 63968: [[26131]], 63969: [[26446]], 63970: [[26792]], 63971: [[27877]], 63972: [[29702]], 63973: [[30178]], 63974: [[32633]], 63975: [[35023]], 63976: [[35041]], 63977: [[37324]], 63978: [[38626]], 63979: [[21311]], 63980: [[28346]], 63981: [[21533]], 63982: [[29136]], 63983: [[29848]], 63984: [[34298]], 63985: [[38563]], 63986: [[40023]], 63987: [[40607]], 63988: [[26519]], 63989: [[28107]], 63990: [[33256]], 63991: [[31435]], 63992: [[31520]], 63993: [[31890]], 63994: [[29376]], 63995: [[28825]], 63996: [[35672]], 63997: [[20160]], 63998: [[33590]], 63999: [[21050]], 194816: [[27966]], 194817: [[28023]], 194818: [[27969]], 194819: [[28009]], 194820: [[28024]], 194821: [[28037]], 194822: [[146718]], 194823: [[27956]], 194824: [[28207]], 194825: [[28270]], 194826: [[15667]], 194827: [[28363]], 194828: [[28359]], 194829: [[147153]], 194830: [[28153]], 194831: [[28526]], 194832: [[147294]], 194833: [[147342]], 194834: [[28614]], 194835: [[28729]], 194836: [[28702]], 194837: [[28699]], 194838: [[15766]], 194839: [[28746]], 194840: [[28797]], 194841: [[28791]], 194842: [[28845]], 194843: [[132389]], 194844: [[28997]], 194845: [[148067]], 194846: [[29084]], 194847: [[148395]], 194848: [[29224]], 194849: [[29237]], 194850: [[29264]], 194851: [[149e3]], 194852: [[29312]], 194853: [[29333]], 194854: [[149301]], 194855: [[149524]], 194856: [[29562]], 194857: [[29579]], 194858: [[16044]], 194859: [[29605]], 194860: [[16056]], 194861: [[16056]], 194862: [[29767]], 194863: [[29788]], 194864: [[29809]], 194865: [[29829]], 194866: [[29898]], 194867: [[16155]], 194868: [[29988]], 194869: [[150582]], 194870: [[30014]], 194871: [[150674]], 194872: [[30064]], 194873: [[139679]], 194874: [[30224]], 194875: [[151457]], 194876: [[151480]], 194877: [[151620]], 194878: [[16380]], 194879: [[16392]], 194880: [[30452]], 194881: [[151795]], 194882: [[151794]], 194883: [[151833]], 194884: [[151859]], 194885: [[30494]], 194886: [[30495]], 194887: [[30495]], 194888: [[30538]], 194889: [[16441]], 194890: [[30603]], 194891: [[16454]], 194892: [[16534]], 194893: [[152605]], 194894: [[30798]], 194895: [[30860]], 194896: [[30924]], 194897: [[16611]], 194898: [[153126]], 194899: [[31062]], 194900: [[153242]], 194901: [[153285]], 194902: [[31119]], 194903: [[31211]], 194904: [[16687]], 194905: [[31296]], 194906: [[31306]], 194907: [[31311]], 194908: [[153980]], 194909: [[154279]], 194910: [[154279]], 194911: [[31470]], 194912: [[16898]], 194913: [[154539]], 194914: [[31686]], 194915: [[31689]], 194916: [[16935]], 194917: [[154752]], 194918: [[31954]], 194919: [[17056]], 194920: [[31976]], 194921: [[31971]], 194922: [[32e3]], 194923: [[155526]], 194924: [[32099]], 194925: [[17153]], 194926: [[32199]], 194927: [[32258]], 194928: [[32325]], 194929: [[17204]], 194930: [[156200]], 194931: [[156231]], 194932: [[17241]], 194933: [[156377]], 194934: [[32634]], 194935: [[156478]], 194936: [[32661]], 194937: [[32762]], 194938: [[32773]], 194939: [[156890]], 194940: [[156963]], 194941: [[32864]], 194942: [[157096]], 194943: [[32880]], 194944: [[144223]], 194945: [[17365]], 194946: [[32946]], 194947: [[33027]], 194948: [[17419]], 194949: [[33086]], 194950: [[23221]], 194951: [[157607]], 194952: [[157621]], 194953: [[144275]], 194954: [[144284]], 194955: [[33281]], 194956: [[33284]], 194957: [[36766]], 194958: [[17515]], 194959: [[33425]], 194960: [[33419]], 194961: [[33437]], 194962: [[21171]], 194963: [[33457]], 194964: [[33459]], 194965: [[33469]], 194966: [[33510]], 194967: [[158524]], 194968: [[33509]], 194969: [[33565]], 194970: [[33635]], 194971: [[33709]], 194972: [[33571]], 194973: [[33725]], 194974: [[33767]], 194975: [[33879]], 194976: [[33619]], 194977: [[33738]], 194978: [[33740]], 194979: [[33756]], 194980: [[158774]], 194981: [[159083]], 194982: [[158933]], 194983: [[17707]], 194984: [[34033]], 194985: [[34035]], 194986: [[34070]], 194987: [[160714]], 194988: [[34148]], 194989: [[159532]], 194990: [[17757]], 194991: [[17761]], 194992: [[159665]], 194993: [[159954]], 194994: [[17771]], 194995: [[34384]], 194996: [[34396]], 194997: [[34407]], 194998: [[34409]], 194999: [[34473]], 195e3: [[34440]], 195001: [[34574]], 195002: [[34530]], 195003: [[34681]], 195004: [[34600]], 195005: [[34667]], 195006: [[34694]], 195007: [[17879]], 195008: [[34785]], 195009: [[34817]], 195010: [[17913]], 195011: [[34912]], 195012: [[34915]], 195013: [[161383]], 195014: [[35031]], 195015: [[35038]], 195016: [[17973]], 195017: [[35066]], 195018: [[13499]], 195019: [[161966]], 195020: [[162150]], 195021: [[18110]], 195022: [[18119]], 195023: [[35488]], 195024: [[35565]], 195025: [[35722]], 195026: [[35925]], 195027: [[162984]], 195028: [[36011]], 195029: [[36033]], 195030: [[36123]], 195031: [[36215]], 195032: [[163631]], 195033: [[133124]], 195034: [[36299]], 195035: [[36284]], 195036: [[36336]], 195037: [[133342]], 195038: [[36564]], 195039: [[36664]], 195040: [[165330]], 195041: [[165357]], 195042: [[37012]], 195043: [[37105]], 195044: [[37137]], 195045: [[165678]], 195046: [[37147]], 195047: [[37432]], 195048: [[37591]], 195049: [[37592]], 195050: [[37500]], 195051: [[37881]], 195052: [[37909]], 195053: [[166906]], 195054: [[38283]], 195055: [[18837]], 195056: [[38327]], 195057: [[167287]], 195058: [[18918]], 195059: [[38595]], 195060: [[23986]], 195061: [[38691]], 195062: [[168261]], 195063: [[168474]], 195064: [[19054]], 195065: [[19062]], 195066: [[38880]], 195067: [[168970]], 195068: [[19122]], 195069: [[169110]], 195070: [[38923]], 195071: [[38923]] }, 64e3: { 64e3: [[20999]], 64001: [[24230]], 64002: [[25299]], 64003: [[31958]], 64004: [[23429]], 64005: [[27934]], 64006: [[26292]], 64007: [[36667]], 64008: [[34892]], 64009: [[38477]], 64010: [[35211]], 64011: [[24275]], 64012: [[20800]], 64013: [[21952]], 64016: [[22618]], 64018: [[26228]], 64021: [[20958]], 64022: [[29482]], 64023: [[30410]], 64024: [[31036]], 64025: [[31070]], 64026: [[31077]], 64027: [[31119]], 64028: [[38742]], 64029: [[31934]], 64030: [[32701]], 64032: [[34322]], 64034: [[35576]], 64037: [[36920]], 64038: [[37117]], 64042: [[39151]], 64043: [[39164]], 64044: [[39208]], 64045: [[40372]], 64046: [[37086]], 64047: [[38583]], 64048: [[20398]], 64049: [[20711]], 64050: [[20813]], 64051: [[21193]], 64052: [[21220]], 64053: [[21329]], 64054: [[21917]], 64055: [[22022]], 64056: [[22120]], 64057: [[22592]], 64058: [[22696]], 64059: [[23652]], 64060: [[23662]], 64061: [[24724]], 64062: [[24936]], 64063: [[24974]], 64064: [[25074]], 64065: [[25935]], 64066: [[26082]], 64067: [[26257]], 64068: [[26757]], 64069: [[28023]], 64070: [[28186]], 64071: [[28450]], 64072: [[29038]], 64073: [[29227]], 64074: [[29730]], 64075: [[30865]], 64076: [[31038]], 64077: [[31049]], 64078: [[31048]], 64079: [[31056]], 64080: [[31062]], 64081: [[31069]], 64082: [[31117]], 64083: [[31118]], 64084: [[31296]], 64085: [[31361]], 64086: [[31680]], 64087: [[32244]], 64088: [[32265]], 64089: [[32321]], 64090: [[32626]], 64091: [[32773]], 64092: [[33261]], 64093: [[33401]], 64094: [[33401]], 64095: [[33879]], 64096: [[35088]], 64097: [[35222]], 64098: [[35585]], 64099: [[35641]], 64100: [[36051]], 64101: [[36104]], 64102: [[36790]], 64103: [[36920]], 64104: [[38627]], 64105: [[38911]], 64106: [[38971]], 64107: [[24693]], 64108: [[148206]], 64109: [[33304]], 64112: [[20006]], 64113: [[20917]], 64114: [[20840]], 64115: [[20352]], 64116: [[20805]], 64117: [[20864]], 64118: [[21191]], 64119: [[21242]], 64120: [[21917]], 64121: [[21845]], 64122: [[21913]], 64123: [[21986]], 64124: [[22618]], 64125: [[22707]], 64126: [[22852]], 64127: [[22868]], 64128: [[23138]], 64129: [[23336]], 64130: [[24274]], 64131: [[24281]], 64132: [[24425]], 64133: [[24493]], 64134: [[24792]], 64135: [[24910]], 64136: [[24840]], 64137: [[24974]], 64138: [[24928]], 64139: [[25074]], 64140: [[25140]], 64141: [[25540]], 64142: [[25628]], 64143: [[25682]], 64144: [[25942]], 64145: [[26228]], 64146: [[26391]], 64147: [[26395]], 64148: [[26454]], 64149: [[27513]], 64150: [[27578]], 64151: [[27969]], 64152: [[28379]], 64153: [[28363]], 64154: [[28450]], 64155: [[28702]], 64156: [[29038]], 64157: [[30631]], 64158: [[29237]], 64159: [[29359]], 64160: [[29482]], 64161: [[29809]], 64162: [[29958]], 64163: [[30011]], 64164: [[30237]], 64165: [[30239]], 64166: [[30410]], 64167: [[30427]], 64168: [[30452]], 64169: [[30538]], 64170: [[30528]], 64171: [[30924]], 64172: [[31409]], 64173: [[31680]], 64174: [[31867]], 64175: [[32091]], 64176: [[32244]], 64177: [[32574]], 64178: [[32773]], 64179: [[33618]], 64180: [[33775]], 64181: [[34681]], 64182: [[35137]], 64183: [[35206]], 64184: [[35222]], 64185: [[35519]], 64186: [[35576]], 64187: [[35531]], 64188: [[35585]], 64189: [[35582]], 64190: [[35565]], 64191: [[35641]], 64192: [[35722]], 64193: [[36104]], 64194: [[36664]], 64195: [[36978]], 64196: [[37273]], 64197: [[37494]], 64198: [[38524]], 64199: [[38627]], 64200: [[38742]], 64201: [[38875]], 64202: [[38911]], 64203: [[38923]], 64204: [[38971]], 64205: [[39698]], 64206: [[40860]], 64207: [[141386]], 64208: [[141380]], 64209: [[144341]], 64210: [[15261]], 64211: [[16408]], 64212: [[16441]], 64213: [[152137]], 64214: [[154832]], 64215: [[163539]], 64216: [[40771]], 64217: [[40846]], 195072: [[38953]], 195073: [[169398]], 195074: [[39138]], 195075: [[19251]], 195076: [[39209]], 195077: [[39335]], 195078: [[39362]], 195079: [[39422]], 195080: [[19406]], 195081: [[170800]], 195082: [[39698]], 195083: [[4e4]], 195084: [[40189]], 195085: [[19662]], 195086: [[19693]], 195087: [[40295]], 195088: [[172238]], 195089: [[19704]], 195090: [[172293]], 195091: [[172558]], 195092: [[172689]], 195093: [[40635]], 195094: [[19798]], 195095: [[40697]], 195096: [[40702]], 195097: [[40709]], 195098: [[40719]], 195099: [[40726]], 195100: [[40763]], 195101: [[173568]] }, 64256: { 64256: [[102, 102], 256], 64257: [[102, 105], 256], 64258: [[102, 108], 256], 64259: [[102, 102, 105], 256], 64260: [[102, 102, 108], 256], 64261: [[383, 116], 256], 64262: [[115, 116], 256], 64275: [[1396, 1398], 256], 64276: [[1396, 1381], 256], 64277: [[1396, 1387], 256], 64278: [[1406, 1398], 256], 64279: [[1396, 1389], 256], 64285: [[1497, 1460], 512], 64286: [, 26], 64287: [[1522, 1463], 512], 64288: [[1506], 256], 64289: [[1488], 256], 64290: [[1491], 256], 64291: [[1492], 256], 64292: [[1499], 256], 64293: [[1500], 256], 64294: [[1501], 256], 64295: [[1512], 256], 64296: [[1514], 256], 64297: [[43], 256], 64298: [[1513, 1473], 512], 64299: [[1513, 1474], 512], 64300: [[64329, 1473], 512], 64301: [[64329, 1474], 512], 64302: [[1488, 1463], 512], 64303: [[1488, 1464], 512], 64304: [[1488, 1468], 512], 64305: [[1489, 1468], 512], 64306: [[1490, 1468], 512], 64307: [[1491, 1468], 512], 64308: [[1492, 1468], 512], 64309: [[1493, 1468], 512], 64310: [[1494, 1468], 512], 64312: [[1496, 1468], 512], 64313: [[1497, 1468], 512], 64314: [[1498, 1468], 512], 64315: [[1499, 1468], 512], 64316: [[1500, 1468], 512], 64318: [[1502, 1468], 512], 64320: [[1504, 1468], 512], 64321: [[1505, 1468], 512], 64323: [[1507, 1468], 512], 64324: [[1508, 1468], 512], 64326: [[1510, 1468], 512], 64327: [[1511, 1468], 512], 64328: [[1512, 1468], 512], 64329: [[1513, 1468], 512], 64330: [[1514, 1468], 512], 64331: [[1493, 1465], 512], 64332: [[1489, 1471], 512], 64333: [[1499, 1471], 512], 64334: [[1508, 1471], 512], 64335: [[1488, 1500], 256], 64336: [[1649], 256], 64337: [[1649], 256], 64338: [[1659], 256], 64339: [[1659], 256], 64340: [[1659], 256], 64341: [[1659], 256], 64342: [[1662], 256], 64343: [[1662], 256], 64344: [[1662], 256], 64345: [[1662], 256], 64346: [[1664], 256], 64347: [[1664], 256], 64348: [[1664], 256], 64349: [[1664], 256], 64350: [[1658], 256], 64351: [[1658], 256], 64352: [[1658], 256], 64353: [[1658], 256], 64354: [[1663], 256], 64355: [[1663], 256], 64356: [[1663], 256], 64357: [[1663], 256], 64358: [[1657], 256], 64359: [[1657], 256], 64360: [[1657], 256], 64361: [[1657], 256], 64362: [[1700], 256], 64363: [[1700], 256], 64364: [[1700], 256], 64365: [[1700], 256], 64366: [[1702], 256], 64367: [[1702], 256], 64368: [[1702], 256], 64369: [[1702], 256], 64370: [[1668], 256], 64371: [[1668], 256], 64372: [[1668], 256], 64373: [[1668], 256], 64374: [[1667], 256], 64375: [[1667], 256], 64376: [[1667], 256], 64377: [[1667], 256], 64378: [[1670], 256], 64379: [[1670], 256], 64380: [[1670], 256], 64381: [[1670], 256], 64382: [[1671], 256], 64383: [[1671], 256], 64384: [[1671], 256], 64385: [[1671], 256], 64386: [[1677], 256], 64387: [[1677], 256], 64388: [[1676], 256], 64389: [[1676], 256], 64390: [[1678], 256], 64391: [[1678], 256], 64392: [[1672], 256], 64393: [[1672], 256], 64394: [[1688], 256], 64395: [[1688], 256], 64396: [[1681], 256], 64397: [[1681], 256], 64398: [[1705], 256], 64399: [[1705], 256], 64400: [[1705], 256], 64401: [[1705], 256], 64402: [[1711], 256], 64403: [[1711], 256], 64404: [[1711], 256], 64405: [[1711], 256], 64406: [[1715], 256], 64407: [[1715], 256], 64408: [[1715], 256], 64409: [[1715], 256], 64410: [[1713], 256], 64411: [[1713], 256], 64412: [[1713], 256], 64413: [[1713], 256], 64414: [[1722], 256], 64415: [[1722], 256], 64416: [[1723], 256], 64417: [[1723], 256], 64418: [[1723], 256], 64419: [[1723], 256], 64420: [[1728], 256], 64421: [[1728], 256], 64422: [[1729], 256], 64423: [[1729], 256], 64424: [[1729], 256], 64425: [[1729], 256], 64426: [[1726], 256], 64427: [[1726], 256], 64428: [[1726], 256], 64429: [[1726], 256], 64430: [[1746], 256], 64431: [[1746], 256], 64432: [[1747], 256], 64433: [[1747], 256], 64467: [[1709], 256], 64468: [[1709], 256], 64469: [[1709], 256], 64470: [[1709], 256], 64471: [[1735], 256], 64472: [[1735], 256], 64473: [[1734], 256], 64474: [[1734], 256], 64475: [[1736], 256], 64476: [[1736], 256], 64477: [[1655], 256], 64478: [[1739], 256], 64479: [[1739], 256], 64480: [[1733], 256], 64481: [[1733], 256], 64482: [[1737], 256], 64483: [[1737], 256], 64484: [[1744], 256], 64485: [[1744], 256], 64486: [[1744], 256], 64487: [[1744], 256], 64488: [[1609], 256], 64489: [[1609], 256], 64490: [[1574, 1575], 256], 64491: [[1574, 1575], 256], 64492: [[1574, 1749], 256], 64493: [[1574, 1749], 256], 64494: [[1574, 1608], 256], 64495: [[1574, 1608], 256], 64496: [[1574, 1735], 256], 64497: [[1574, 1735], 256], 64498: [[1574, 1734], 256], 64499: [[1574, 1734], 256], 64500: [[1574, 1736], 256], 64501: [[1574, 1736], 256], 64502: [[1574, 1744], 256], 64503: [[1574, 1744], 256], 64504: [[1574, 1744], 256], 64505: [[1574, 1609], 256], 64506: [[1574, 1609], 256], 64507: [[1574, 1609], 256], 64508: [[1740], 256], 64509: [[1740], 256], 64510: [[1740], 256], 64511: [[1740], 256] }, 64512: { 64512: [[1574, 1580], 256], 64513: [[1574, 1581], 256], 64514: [[1574, 1605], 256], 64515: [[1574, 1609], 256], 64516: [[1574, 1610], 256], 64517: [[1576, 1580], 256], 64518: [[1576, 1581], 256], 64519: [[1576, 1582], 256], 64520: [[1576, 1605], 256], 64521: [[1576, 1609], 256], 64522: [[1576, 1610], 256], 64523: [[1578, 1580], 256], 64524: [[1578, 1581], 256], 64525: [[1578, 1582], 256], 64526: [[1578, 1605], 256], 64527: [[1578, 1609], 256], 64528: [[1578, 1610], 256], 64529: [[1579, 1580], 256], 64530: [[1579, 1605], 256], 64531: [[1579, 1609], 256], 64532: [[1579, 1610], 256], 64533: [[1580, 1581], 256], 64534: [[1580, 1605], 256], 64535: [[1581, 1580], 256], 64536: [[1581, 1605], 256], 64537: [[1582, 1580], 256], 64538: [[1582, 1581], 256], 64539: [[1582, 1605], 256], 64540: [[1587, 1580], 256], 64541: [[1587, 1581], 256], 64542: [[1587, 1582], 256], 64543: [[1587, 1605], 256], 64544: [[1589, 1581], 256], 64545: [[1589, 1605], 256], 64546: [[1590, 1580], 256], 64547: [[1590, 1581], 256], 64548: [[1590, 1582], 256], 64549: [[1590, 1605], 256], 64550: [[1591, 1581], 256], 64551: [[1591, 1605], 256], 64552: [[1592, 1605], 256], 64553: [[1593, 1580], 256], 64554: [[1593, 1605], 256], 64555: [[1594, 1580], 256], 64556: [[1594, 1605], 256], 64557: [[1601, 1580], 256], 64558: [[1601, 1581], 256], 64559: [[1601, 1582], 256], 64560: [[1601, 1605], 256], 64561: [[1601, 1609], 256], 64562: [[1601, 1610], 256], 64563: [[1602, 1581], 256], 64564: [[1602, 1605], 256], 64565: [[1602, 1609], 256], 64566: [[1602, 1610], 256], 64567: [[1603, 1575], 256], 64568: [[1603, 1580], 256], 64569: [[1603, 1581], 256], 64570: [[1603, 1582], 256], 64571: [[1603, 1604], 256], 64572: [[1603, 1605], 256], 64573: [[1603, 1609], 256], 64574: [[1603, 1610], 256], 64575: [[1604, 1580], 256], 64576: [[1604, 1581], 256], 64577: [[1604, 1582], 256], 64578: [[1604, 1605], 256], 64579: [[1604, 1609], 256], 64580: [[1604, 1610], 256], 64581: [[1605, 1580], 256], 64582: [[1605, 1581], 256], 64583: [[1605, 1582], 256], 64584: [[1605, 1605], 256], 64585: [[1605, 1609], 256], 64586: [[1605, 1610], 256], 64587: [[1606, 1580], 256], 64588: [[1606, 1581], 256], 64589: [[1606, 1582], 256], 64590: [[1606, 1605], 256], 64591: [[1606, 1609], 256], 64592: [[1606, 1610], 256], 64593: [[1607, 1580], 256], 64594: [[1607, 1605], 256], 64595: [[1607, 1609], 256], 64596: [[1607, 1610], 256], 64597: [[1610, 1580], 256], 64598: [[1610, 1581], 256], 64599: [[1610, 1582], 256], 64600: [[1610, 1605], 256], 64601: [[1610, 1609], 256], 64602: [[1610, 1610], 256], 64603: [[1584, 1648], 256], 64604: [[1585, 1648], 256], 64605: [[1609, 1648], 256], 64606: [[32, 1612, 1617], 256], 64607: [[32, 1613, 1617], 256], 64608: [[32, 1614, 1617], 256], 64609: [[32, 1615, 1617], 256], 64610: [[32, 1616, 1617], 256], 64611: [[32, 1617, 1648], 256], 64612: [[1574, 1585], 256], 64613: [[1574, 1586], 256], 64614: [[1574, 1605], 256], 64615: [[1574, 1606], 256], 64616: [[1574, 1609], 256], 64617: [[1574, 1610], 256], 64618: [[1576, 1585], 256], 64619: [[1576, 1586], 256], 64620: [[1576, 1605], 256], 64621: [[1576, 1606], 256], 64622: [[1576, 1609], 256], 64623: [[1576, 1610], 256], 64624: [[1578, 1585], 256], 64625: [[1578, 1586], 256], 64626: [[1578, 1605], 256], 64627: [[1578, 1606], 256], 64628: [[1578, 1609], 256], 64629: [[1578, 1610], 256], 64630: [[1579, 1585], 256], 64631: [[1579, 1586], 256], 64632: [[1579, 1605], 256], 64633: [[1579, 1606], 256], 64634: [[1579, 1609], 256], 64635: [[1579, 1610], 256], 64636: [[1601, 1609], 256], 64637: [[1601, 1610], 256], 64638: [[1602, 1609], 256], 64639: [[1602, 1610], 256], 64640: [[1603, 1575], 256], 64641: [[1603, 1604], 256], 64642: [[1603, 1605], 256], 64643: [[1603, 1609], 256], 64644: [[1603, 1610], 256], 64645: [[1604, 1605], 256], 64646: [[1604, 1609], 256], 64647: [[1604, 1610], 256], 64648: [[1605, 1575], 256], 64649: [[1605, 1605], 256], 64650: [[1606, 1585], 256], 64651: [[1606, 1586], 256], 64652: [[1606, 1605], 256], 64653: [[1606, 1606], 256], 64654: [[1606, 1609], 256], 64655: [[1606, 1610], 256], 64656: [[1609, 1648], 256], 64657: [[1610, 1585], 256], 64658: [[1610, 1586], 256], 64659: [[1610, 1605], 256], 64660: [[1610, 1606], 256], 64661: [[1610, 1609], 256], 64662: [[1610, 1610], 256], 64663: [[1574, 1580], 256], 64664: [[1574, 1581], 256], 64665: [[1574, 1582], 256], 64666: [[1574, 1605], 256], 64667: [[1574, 1607], 256], 64668: [[1576, 1580], 256], 64669: [[1576, 1581], 256], 64670: [[1576, 1582], 256], 64671: [[1576, 1605], 256], 64672: [[1576, 1607], 256], 64673: [[1578, 1580], 256], 64674: [[1578, 1581], 256], 64675: [[1578, 1582], 256], 64676: [[1578, 1605], 256], 64677: [[1578, 1607], 256], 64678: [[1579, 1605], 256], 64679: [[1580, 1581], 256], 64680: [[1580, 1605], 256], 64681: [[1581, 1580], 256], 64682: [[1581, 1605], 256], 64683: [[1582, 1580], 256], 64684: [[1582, 1605], 256], 64685: [[1587, 1580], 256], 64686: [[1587, 1581], 256], 64687: [[1587, 1582], 256], 64688: [[1587, 1605], 256], 64689: [[1589, 1581], 256], 64690: [[1589, 1582], 256], 64691: [[1589, 1605], 256], 64692: [[1590, 1580], 256], 64693: [[1590, 1581], 256], 64694: [[1590, 1582], 256], 64695: [[1590, 1605], 256], 64696: [[1591, 1581], 256], 64697: [[1592, 1605], 256], 64698: [[1593, 1580], 256], 64699: [[1593, 1605], 256], 64700: [[1594, 1580], 256], 64701: [[1594, 1605], 256], 64702: [[1601, 1580], 256], 64703: [[1601, 1581], 256], 64704: [[1601, 1582], 256], 64705: [[1601, 1605], 256], 64706: [[1602, 1581], 256], 64707: [[1602, 1605], 256], 64708: [[1603, 1580], 256], 64709: [[1603, 1581], 256], 64710: [[1603, 1582], 256], 64711: [[1603, 1604], 256], 64712: [[1603, 1605], 256], 64713: [[1604, 1580], 256], 64714: [[1604, 1581], 256], 64715: [[1604, 1582], 256], 64716: [[1604, 1605], 256], 64717: [[1604, 1607], 256], 64718: [[1605, 1580], 256], 64719: [[1605, 1581], 256], 64720: [[1605, 1582], 256], 64721: [[1605, 1605], 256], 64722: [[1606, 1580], 256], 64723: [[1606, 1581], 256], 64724: [[1606, 1582], 256], 64725: [[1606, 1605], 256], 64726: [[1606, 1607], 256], 64727: [[1607, 1580], 256], 64728: [[1607, 1605], 256], 64729: [[1607, 1648], 256], 64730: [[1610, 1580], 256], 64731: [[1610, 1581], 256], 64732: [[1610, 1582], 256], 64733: [[1610, 1605], 256], 64734: [[1610, 1607], 256], 64735: [[1574, 1605], 256], 64736: [[1574, 1607], 256], 64737: [[1576, 1605], 256], 64738: [[1576, 1607], 256], 64739: [[1578, 1605], 256], 64740: [[1578, 1607], 256], 64741: [[1579, 1605], 256], 64742: [[1579, 1607], 256], 64743: [[1587, 1605], 256], 64744: [[1587, 1607], 256], 64745: [[1588, 1605], 256], 64746: [[1588, 1607], 256], 64747: [[1603, 1604], 256], 64748: [[1603, 1605], 256], 64749: [[1604, 1605], 256], 64750: [[1606, 1605], 256], 64751: [[1606, 1607], 256], 64752: [[1610, 1605], 256], 64753: [[1610, 1607], 256], 64754: [[1600, 1614, 1617], 256], 64755: [[1600, 1615, 1617], 256], 64756: [[1600, 1616, 1617], 256], 64757: [[1591, 1609], 256], 64758: [[1591, 1610], 256], 64759: [[1593, 1609], 256], 64760: [[1593, 1610], 256], 64761: [[1594, 1609], 256], 64762: [[1594, 1610], 256], 64763: [[1587, 1609], 256], 64764: [[1587, 1610], 256], 64765: [[1588, 1609], 256], 64766: [[1588, 1610], 256], 64767: [[1581, 1609], 256] }, 64768: { 64768: [[1581, 1610], 256], 64769: [[1580, 1609], 256], 64770: [[1580, 1610], 256], 64771: [[1582, 1609], 256], 64772: [[1582, 1610], 256], 64773: [[1589, 1609], 256], 64774: [[1589, 1610], 256], 64775: [[1590, 1609], 256], 64776: [[1590, 1610], 256], 64777: [[1588, 1580], 256], 64778: [[1588, 1581], 256], 64779: [[1588, 1582], 256], 64780: [[1588, 1605], 256], 64781: [[1588, 1585], 256], 64782: [[1587, 1585], 256], 64783: [[1589, 1585], 256], 64784: [[1590, 1585], 256], 64785: [[1591, 1609], 256], 64786: [[1591, 1610], 256], 64787: [[1593, 1609], 256], 64788: [[1593, 1610], 256], 64789: [[1594, 1609], 256], 64790: [[1594, 1610], 256], 64791: [[1587, 1609], 256], 64792: [[1587, 1610], 256], 64793: [[1588, 1609], 256], 64794: [[1588, 1610], 256], 64795: [[1581, 1609], 256], 64796: [[1581, 1610], 256], 64797: [[1580, 1609], 256], 64798: [[1580, 1610], 256], 64799: [[1582, 1609], 256], 64800: [[1582, 1610], 256], 64801: [[1589, 1609], 256], 64802: [[1589, 1610], 256], 64803: [[1590, 1609], 256], 64804: [[1590, 1610], 256], 64805: [[1588, 1580], 256], 64806: [[1588, 1581], 256], 64807: [[1588, 1582], 256], 64808: [[1588, 1605], 256], 64809: [[1588, 1585], 256], 64810: [[1587, 1585], 256], 64811: [[1589, 1585], 256], 64812: [[1590, 1585], 256], 64813: [[1588, 1580], 256], 64814: [[1588, 1581], 256], 64815: [[1588, 1582], 256], 64816: [[1588, 1605], 256], 64817: [[1587, 1607], 256], 64818: [[1588, 1607], 256], 64819: [[1591, 1605], 256], 64820: [[1587, 1580], 256], 64821: [[1587, 1581], 256], 64822: [[1587, 1582], 256], 64823: [[1588, 1580], 256], 64824: [[1588, 1581], 256], 64825: [[1588, 1582], 256], 64826: [[1591, 1605], 256], 64827: [[1592, 1605], 256], 64828: [[1575, 1611], 256], 64829: [[1575, 1611], 256], 64848: [[1578, 1580, 1605], 256], 64849: [[1578, 1581, 1580], 256], 64850: [[1578, 1581, 1580], 256], 64851: [[1578, 1581, 1605], 256], 64852: [[1578, 1582, 1605], 256], 64853: [[1578, 1605, 1580], 256], 64854: [[1578, 1605, 1581], 256], 64855: [[1578, 1605, 1582], 256], 64856: [[1580, 1605, 1581], 256], 64857: [[1580, 1605, 1581], 256], 64858: [[1581, 1605, 1610], 256], 64859: [[1581, 1605, 1609], 256], 64860: [[1587, 1581, 1580], 256], 64861: [[1587, 1580, 1581], 256], 64862: [[1587, 1580, 1609], 256], 64863: [[1587, 1605, 1581], 256], 64864: [[1587, 1605, 1581], 256], 64865: [[1587, 1605, 1580], 256], 64866: [[1587, 1605, 1605], 256], 64867: [[1587, 1605, 1605], 256], 64868: [[1589, 1581, 1581], 256], 64869: [[1589, 1581, 1581], 256], 64870: [[1589, 1605, 1605], 256], 64871: [[1588, 1581, 1605], 256], 64872: [[1588, 1581, 1605], 256], 64873: [[1588, 1580, 1610], 256], 64874: [[1588, 1605, 1582], 256], 64875: [[1588, 1605, 1582], 256], 64876: [[1588, 1605, 1605], 256], 64877: [[1588, 1605, 1605], 256], 64878: [[1590, 1581, 1609], 256], 64879: [[1590, 1582, 1605], 256], 64880: [[1590, 1582, 1605], 256], 64881: [[1591, 1605, 1581], 256], 64882: [[1591, 1605, 1581], 256], 64883: [[1591, 1605, 1605], 256], 64884: [[1591, 1605, 1610], 256], 64885: [[1593, 1580, 1605], 256], 64886: [[1593, 1605, 1605], 256], 64887: [[1593, 1605, 1605], 256], 64888: [[1593, 1605, 1609], 256], 64889: [[1594, 1605, 1605], 256], 64890: [[1594, 1605, 1610], 256], 64891: [[1594, 1605, 1609], 256], 64892: [[1601, 1582, 1605], 256], 64893: [[1601, 1582, 1605], 256], 64894: [[1602, 1605, 1581], 256], 64895: [[1602, 1605, 1605], 256], 64896: [[1604, 1581, 1605], 256], 64897: [[1604, 1581, 1610], 256], 64898: [[1604, 1581, 1609], 256], 64899: [[1604, 1580, 1580], 256], 64900: [[1604, 1580, 1580], 256], 64901: [[1604, 1582, 1605], 256], 64902: [[1604, 1582, 1605], 256], 64903: [[1604, 1605, 1581], 256], 64904: [[1604, 1605, 1581], 256], 64905: [[1605, 1581, 1580], 256], 64906: [[1605, 1581, 1605], 256], 64907: [[1605, 1581, 1610], 256], 64908: [[1605, 1580, 1581], 256], 64909: [[1605, 1580, 1605], 256], 64910: [[1605, 1582, 1580], 256], 64911: [[1605, 1582, 1605], 256], 64914: [[1605, 1580, 1582], 256], 64915: [[1607, 1605, 1580], 256], 64916: [[1607, 1605, 1605], 256], 64917: [[1606, 1581, 1605], 256], 64918: [[1606, 1581, 1609], 256], 64919: [[1606, 1580, 1605], 256], 64920: [[1606, 1580, 1605], 256], 64921: [[1606, 1580, 1609], 256], 64922: [[1606, 1605, 1610], 256], 64923: [[1606, 1605, 1609], 256], 64924: [[1610, 1605, 1605], 256], 64925: [[1610, 1605, 1605], 256], 64926: [[1576, 1582, 1610], 256], 64927: [[1578, 1580, 1610], 256], 64928: [[1578, 1580, 1609], 256], 64929: [[1578, 1582, 1610], 256], 64930: [[1578, 1582, 1609], 256], 64931: [[1578, 1605, 1610], 256], 64932: [[1578, 1605, 1609], 256], 64933: [[1580, 1605, 1610], 256], 64934: [[1580, 1581, 1609], 256], 64935: [[1580, 1605, 1609], 256], 64936: [[1587, 1582, 1609], 256], 64937: [[1589, 1581, 1610], 256], 64938: [[1588, 1581, 1610], 256], 64939: [[1590, 1581, 1610], 256], 64940: [[1604, 1580, 1610], 256], 64941: [[1604, 1605, 1610], 256], 64942: [[1610, 1581, 1610], 256], 64943: [[1610, 1580, 1610], 256], 64944: [[1610, 1605, 1610], 256], 64945: [[1605, 1605, 1610], 256], 64946: [[1602, 1605, 1610], 256], 64947: [[1606, 1581, 1610], 256], 64948: [[1602, 1605, 1581], 256], 64949: [[1604, 1581, 1605], 256], 64950: [[1593, 1605, 1610], 256], 64951: [[1603, 1605, 1610], 256], 64952: [[1606, 1580, 1581], 256], 64953: [[1605, 1582, 1610], 256], 64954: [[1604, 1580, 1605], 256], 64955: [[1603, 1605, 1605], 256], 64956: [[1604, 1580, 1605], 256], 64957: [[1606, 1580, 1581], 256], 64958: [[1580, 1581, 1610], 256], 64959: [[1581, 1580, 1610], 256], 64960: [[1605, 1580, 1610], 256], 64961: [[1601, 1605, 1610], 256], 64962: [[1576, 1581, 1610], 256], 64963: [[1603, 1605, 1605], 256], 64964: [[1593, 1580, 1605], 256], 64965: [[1589, 1605, 1605], 256], 64966: [[1587, 1582, 1610], 256], 64967: [[1606, 1580, 1610], 256], 65008: [[1589, 1604, 1746], 256], 65009: [[1602, 1604, 1746], 256], 65010: [[1575, 1604, 1604, 1607], 256], 65011: [[1575, 1603, 1576, 1585], 256], 65012: [[1605, 1581, 1605, 1583], 256], 65013: [[1589, 1604, 1593, 1605], 256], 65014: [[1585, 1587, 1608, 1604], 256], 65015: [[1593, 1604, 1610, 1607], 256], 65016: [[1608, 1587, 1604, 1605], 256], 65017: [[1589, 1604, 1609], 256], 65018: [[1589, 1604, 1609, 32, 1575, 1604, 1604, 1607, 32, 1593, 1604, 1610, 1607, 32, 1608, 1587, 1604, 1605], 256], 65019: [[1580, 1604, 32, 1580, 1604, 1575, 1604, 1607], 256], 65020: [[1585, 1740, 1575, 1604], 256] }, 65024: { 65040: [[44], 256], 65041: [[12289], 256], 65042: [[12290], 256], 65043: [[58], 256], 65044: [[59], 256], 65045: [[33], 256], 65046: [[63], 256], 65047: [[12310], 256], 65048: [[12311], 256], 65049: [[8230], 256], 65056: [, 230], 65057: [, 230], 65058: [, 230], 65059: [, 230], 65060: [, 230], 65061: [, 230], 65062: [, 230], 65063: [, 220], 65064: [, 220], 65065: [, 220], 65066: [, 220], 65067: [, 220], 65068: [, 220], 65069: [, 220], 65072: [[8229], 256], 65073: [[8212], 256], 65074: [[8211], 256], 65075: [[95], 256], 65076: [[95], 256], 65077: [[40], 256], 65078: [[41], 256], 65079: [[123], 256], 65080: [[125], 256], 65081: [[12308], 256], 65082: [[12309], 256], 65083: [[12304], 256], 65084: [[12305], 256], 65085: [[12298], 256], 65086: [[12299], 256], 65087: [[12296], 256], 65088: [[12297], 256], 65089: [[12300], 256], 65090: [[12301], 256], 65091: [[12302], 256], 65092: [[12303], 256], 65095: [[91], 256], 65096: [[93], 256], 65097: [[8254], 256], 65098: [[8254], 256], 65099: [[8254], 256], 65100: [[8254], 256], 65101: [[95], 256], 65102: [[95], 256], 65103: [[95], 256], 65104: [[44], 256], 65105: [[12289], 256], 65106: [[46], 256], 65108: [[59], 256], 65109: [[58], 256], 65110: [[63], 256], 65111: [[33], 256], 65112: [[8212], 256], 65113: [[40], 256], 65114: [[41], 256], 65115: [[123], 256], 65116: [[125], 256], 65117: [[12308], 256], 65118: [[12309], 256], 65119: [[35], 256], 65120: [[38], 256], 65121: [[42], 256], 65122: [[43], 256], 65123: [[45], 256], 65124: [[60], 256], 65125: [[62], 256], 65126: [[61], 256], 65128: [[92], 256], 65129: [[36], 256], 65130: [[37], 256], 65131: [[64], 256], 65136: [[32, 1611], 256], 65137: [[1600, 1611], 256], 65138: [[32, 1612], 256], 65140: [[32, 1613], 256], 65142: [[32, 1614], 256], 65143: [[1600, 1614], 256], 65144: [[32, 1615], 256], 65145: [[1600, 1615], 256], 65146: [[32, 1616], 256], 65147: [[1600, 1616], 256], 65148: [[32, 1617], 256], 65149: [[1600, 1617], 256], 65150: [[32, 1618], 256], 65151: [[1600, 1618], 256], 65152: [[1569], 256], 65153: [[1570], 256], 65154: [[1570], 256], 65155: [[1571], 256], 65156: [[1571], 256], 65157: [[1572], 256], 65158: [[1572], 256], 65159: [[1573], 256], 65160: [[1573], 256], 65161: [[1574], 256], 65162: [[1574], 256], 65163: [[1574], 256], 65164: [[1574], 256], 65165: [[1575], 256], 65166: [[1575], 256], 65167: [[1576], 256], 65168: [[1576], 256], 65169: [[1576], 256], 65170: [[1576], 256], 65171: [[1577], 256], 65172: [[1577], 256], 65173: [[1578], 256], 65174: [[1578], 256], 65175: [[1578], 256], 65176: [[1578], 256], 65177: [[1579], 256], 65178: [[1579], 256], 65179: [[1579], 256], 65180: [[1579], 256], 65181: [[1580], 256], 65182: [[1580], 256], 65183: [[1580], 256], 65184: [[1580], 256], 65185: [[1581], 256], 65186: [[1581], 256], 65187: [[1581], 256], 65188: [[1581], 256], 65189: [[1582], 256], 65190: [[1582], 256], 65191: [[1582], 256], 65192: [[1582], 256], 65193: [[1583], 256], 65194: [[1583], 256], 65195: [[1584], 256], 65196: [[1584], 256], 65197: [[1585], 256], 65198: [[1585], 256], 65199: [[1586], 256], 65200: [[1586], 256], 65201: [[1587], 256], 65202: [[1587], 256], 65203: [[1587], 256], 65204: [[1587], 256], 65205: [[1588], 256], 65206: [[1588], 256], 65207: [[1588], 256], 65208: [[1588], 256], 65209: [[1589], 256], 65210: [[1589], 256], 65211: [[1589], 256], 65212: [[1589], 256], 65213: [[1590], 256], 65214: [[1590], 256], 65215: [[1590], 256], 65216: [[1590], 256], 65217: [[1591], 256], 65218: [[1591], 256], 65219: [[1591], 256], 65220: [[1591], 256], 65221: [[1592], 256], 65222: [[1592], 256], 65223: [[1592], 256], 65224: [[1592], 256], 65225: [[1593], 256], 65226: [[1593], 256], 65227: [[1593], 256], 65228: [[1593], 256], 65229: [[1594], 256], 65230: [[1594], 256], 65231: [[1594], 256], 65232: [[1594], 256], 65233: [[1601], 256], 65234: [[1601], 256], 65235: [[1601], 256], 65236: [[1601], 256], 65237: [[1602], 256], 65238: [[1602], 256], 65239: [[1602], 256], 65240: [[1602], 256], 65241: [[1603], 256], 65242: [[1603], 256], 65243: [[1603], 256], 65244: [[1603], 256], 65245: [[1604], 256], 65246: [[1604], 256], 65247: [[1604], 256], 65248: [[1604], 256], 65249: [[1605], 256], 65250: [[1605], 256], 65251: [[1605], 256], 65252: [[1605], 256], 65253: [[1606], 256], 65254: [[1606], 256], 65255: [[1606], 256], 65256: [[1606], 256], 65257: [[1607], 256], 65258: [[1607], 256], 65259: [[1607], 256], 65260: [[1607], 256], 65261: [[1608], 256], 65262: [[1608], 256], 65263: [[1609], 256], 65264: [[1609], 256], 65265: [[1610], 256], 65266: [[1610], 256], 65267: [[1610], 256], 65268: [[1610], 256], 65269: [[1604, 1570], 256], 65270: [[1604, 1570], 256], 65271: [[1604, 1571], 256], 65272: [[1604, 1571], 256], 65273: [[1604, 1573], 256], 65274: [[1604, 1573], 256], 65275: [[1604, 1575], 256], 65276: [[1604, 1575], 256] }, 65280: { 65281: [[33], 256], 65282: [[34], 256], 65283: [[35], 256], 65284: [[36], 256], 65285: [[37], 256], 65286: [[38], 256], 65287: [[39], 256], 65288: [[40], 256], 65289: [[41], 256], 65290: [[42], 256], 65291: [[43], 256], 65292: [[44], 256], 65293: [[45], 256], 65294: [[46], 256], 65295: [[47], 256], 65296: [[48], 256], 65297: [[49], 256], 65298: [[50], 256], 65299: [[51], 256], 65300: [[52], 256], 65301: [[53], 256], 65302: [[54], 256], 65303: [[55], 256], 65304: [[56], 256], 65305: [[57], 256], 65306: [[58], 256], 65307: [[59], 256], 65308: [[60], 256], 65309: [[61], 256], 65310: [[62], 256], 65311: [[63], 256], 65312: [[64], 256], 65313: [[65], 256], 65314: [[66], 256], 65315: [[67], 256], 65316: [[68], 256], 65317: [[69], 256], 65318: [[70], 256], 65319: [[71], 256], 65320: [[72], 256], 65321: [[73], 256], 65322: [[74], 256], 65323: [[75], 256], 65324: [[76], 256], 65325: [[77], 256], 65326: [[78], 256], 65327: [[79], 256], 65328: [[80], 256], 65329: [[81], 256], 65330: [[82], 256], 65331: [[83], 256], 65332: [[84], 256], 65333: [[85], 256], 65334: [[86], 256], 65335: [[87], 256], 65336: [[88], 256], 65337: [[89], 256], 65338: [[90], 256], 65339: [[91], 256], 65340: [[92], 256], 65341: [[93], 256], 65342: [[94], 256], 65343: [[95], 256], 65344: [[96], 256], 65345: [[97], 256], 65346: [[98], 256], 65347: [[99], 256], 65348: [[100], 256], 65349: [[101], 256], 65350: [[102], 256], 65351: [[103], 256], 65352: [[104], 256], 65353: [[105], 256], 65354: [[106], 256], 65355: [[107], 256], 65356: [[108], 256], 65357: [[109], 256], 65358: [[110], 256], 65359: [[111], 256], 65360: [[112], 256], 65361: [[113], 256], 65362: [[114], 256], 65363: [[115], 256], 65364: [[116], 256], 65365: [[117], 256], 65366: [[118], 256], 65367: [[119], 256], 65368: [[120], 256], 65369: [[121], 256], 65370: [[122], 256], 65371: [[123], 256], 65372: [[124], 256], 65373: [[125], 256], 65374: [[126], 256], 65375: [[10629], 256], 65376: [[10630], 256], 65377: [[12290], 256], 65378: [[12300], 256], 65379: [[12301], 256], 65380: [[12289], 256], 65381: [[12539], 256], 65382: [[12530], 256], 65383: [[12449], 256], 65384: [[12451], 256], 65385: [[12453], 256], 65386: [[12455], 256], 65387: [[12457], 256], 65388: [[12515], 256], 65389: [[12517], 256], 65390: [[12519], 256], 65391: [[12483], 256], 65392: [[12540], 256], 65393: [[12450], 256], 65394: [[12452], 256], 65395: [[12454], 256], 65396: [[12456], 256], 65397: [[12458], 256], 65398: [[12459], 256], 65399: [[12461], 256], 65400: [[12463], 256], 65401: [[12465], 256], 65402: [[12467], 256], 65403: [[12469], 256], 65404: [[12471], 256], 65405: [[12473], 256], 65406: [[12475], 256], 65407: [[12477], 256], 65408: [[12479], 256], 65409: [[12481], 256], 65410: [[12484], 256], 65411: [[12486], 256], 65412: [[12488], 256], 65413: [[12490], 256], 65414: [[12491], 256], 65415: [[12492], 256], 65416: [[12493], 256], 65417: [[12494], 256], 65418: [[12495], 256], 65419: [[12498], 256], 65420: [[12501], 256], 65421: [[12504], 256], 65422: [[12507], 256], 65423: [[12510], 256], 65424: [[12511], 256], 65425: [[12512], 256], 65426: [[12513], 256], 65427: [[12514], 256], 65428: [[12516], 256], 65429: [[12518], 256], 65430: [[12520], 256], 65431: [[12521], 256], 65432: [[12522], 256], 65433: [[12523], 256], 65434: [[12524], 256], 65435: [[12525], 256], 65436: [[12527], 256], 65437: [[12531], 256], 65438: [[12441], 256], 65439: [[12442], 256], 65440: [[12644], 256], 65441: [[12593], 256], 65442: [[12594], 256], 65443: [[12595], 256], 65444: [[12596], 256], 65445: [[12597], 256], 65446: [[12598], 256], 65447: [[12599], 256], 65448: [[12600], 256], 65449: [[12601], 256], 65450: [[12602], 256], 65451: [[12603], 256], 65452: [[12604], 256], 65453: [[12605], 256], 65454: [[12606], 256], 65455: [[12607], 256], 65456: [[12608], 256], 65457: [[12609], 256], 65458: [[12610], 256], 65459: [[12611], 256], 65460: [[12612], 256], 65461: [[12613], 256], 65462: [[12614], 256], 65463: [[12615], 256], 65464: [[12616], 256], 65465: [[12617], 256], 65466: [[12618], 256], 65467: [[12619], 256], 65468: [[12620], 256], 65469: [[12621], 256], 65470: [[12622], 256], 65474: [[12623], 256], 65475: [[12624], 256], 65476: [[12625], 256], 65477: [[12626], 256], 65478: [[12627], 256], 65479: [[12628], 256], 65482: [[12629], 256], 65483: [[12630], 256], 65484: [[12631], 256], 65485: [[12632], 256], 65486: [[12633], 256], 65487: [[12634], 256], 65490: [[12635], 256], 65491: [[12636], 256], 65492: [[12637], 256], 65493: [[12638], 256], 65494: [[12639], 256], 65495: [[12640], 256], 65498: [[12641], 256], 65499: [[12642], 256], 65500: [[12643], 256], 65504: [[162], 256], 65505: [[163], 256], 65506: [[172], 256], 65507: [[175], 256], 65508: [[166], 256], 65509: [[165], 256], 65510: [[8361], 256], 65512: [[9474], 256], 65513: [[8592], 256], 65514: [[8593], 256], 65515: [[8594], 256], 65516: [[8595], 256], 65517: [[9632], 256], 65518: [[9675], 256] } };var n = { nfc: function nfc(t) {return r("NFC", t);}, nfd: function nfd(t) {return r("NFD", t);}, nfkc: function nfkc(t) {return r("NFKC", t);}, nfkd: function nfkd(t) {return r("NFKD", t);} };"object" == typeof d ? d.exports = n : t.unorm = n, n.shimApplied = !1, String.prototype.normalize || (String.prototype.normalize = function (t) {var e = "" + this;if ("NFC" === (t = void 0 === t ? "NFC" : t)) return n.nfc(e);if ("NFD" === t) return n.nfd(e);if ("NFKC" === t) return n.nfkc(e);if ("NFKD" === t) return n.nfkd(e);throw new RangeError("Invalid normalization form: " + t);}, n.shimApplied = !0);}(this);}, {}] }, {}, [3])(3);});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../Downloads/HBuilderX/plugins/uniapp-cli/node_modules/webpack/buildin/global.js */ 3), __webpack_require__(/*! ./../../../../Downloads/HBuilderX/plugins/uniapp-cli/node_modules/node-libs-browser/mock/process.js */ 28)))

/***/ }),

/***/ 28:
/*!********************************************************!*\
  !*** ./node_modules/node-libs-browser/mock/process.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports.nextTick = function nextTick(fn) {
	setTimeout(fn, 0);
};

exports.platform = exports.arch = 
exports.execPath = exports.title = 'browser';
exports.pid = 1;
exports.browser = true;
exports.env = {};
exports.argv = [];

exports.binding = function (name) {
	throw new Error('No such module. (Possibly not yet loaded)')
};

(function () {
    var cwd = '/';
    var path;
    exports.cwd = function () { return cwd };
    exports.chdir = function (dir) {
        if (!path) path = __webpack_require__(/*! path */ 29);
        cwd = path.resolve(dir, cwd);
    };
})();

exports.exit = exports.kill = 
exports.umask = exports.dlopen = 
exports.uptime = exports.memoryUsage = 
exports.uvCounters = function() {};
exports.features = {};


/***/ }),

/***/ 29:
/*!***********************************************!*\
  !*** ./node_modules/path-browserify/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node-libs-browser/mock/process.js */ 28)))

/***/ }),

/***/ 3:
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 4:
/*!*************************************************!*\
  !*** C:/Users/Admin/Desktop/evc.app/pages.json ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),

/***/ 423:
/*!**************************************************************!*\
  !*** C:/Users/Admin/Desktop/evc.app/common/qiniuUploader.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) { // created by gpake
(function () {

  var config = {
    qiniuRegion: '',
    qiniuImageURLPrefix: '',
    qiniuUploadToken: '',
    qiniuUploadTokenURL: '',
    qiniuUploadTokenFunction: null,
    qiniuShouldUseQiniuFileName: false };


  module.exports = {
    init: init,
    upload: upload


    // 在整个程序生命周期中，只需要 init 一次即可
    // 如果需要变更参数，再调用 init 即可
  };function init(options) {
    config = {
      qiniuRegion: '',
      qiniuImageURLPrefix: '',
      qiniuUploadToken: '',
      qiniuUploadTokenURL: '',
      qiniuUploadTokenFunction: null,
      qiniuShouldUseQiniuFileName: false };

    updateConfigWithOptions(options);
  }

  function updateConfigWithOptions(options) {
    if (options.region) {
      config.qiniuRegion = options.region;
    } else {
      console.error('qiniu uploader need your bucket region');
    }
    if (options.uptoken) {
      config.qiniuUploadToken = options.uptoken;
    } else if (options.uptokenURL) {
      config.qiniuUploadTokenURL = options.uptokenURL;
    } else if (options.uptokenFunc) {
      config.qiniuUploadTokenFunction = options.uptokenFunc;
    }
    if (options.domain) {
      config.qiniuImageURLPrefix = options.domain;
    }
    config.qiniuShouldUseQiniuFileName = options.shouldUseQiniuFileName;
  }

  function upload(filePath, success, fail, options, progress, cancelTask) {
    if (null == filePath) {
      console.error('qiniu uploader need filePath to upload');
      return;
    }
    if (options) {
      updateConfigWithOptions(options);
    }
    if (config.qiniuUploadToken) {
      doUpload(filePath, success, fail, options, progress, cancelTask);
    } else if (config.qiniuUploadTokenURL) {
      getQiniuToken(function () {
        doUpload(filePath, success, fail, options, progress, cancelTask);
      });
    } else if (config.qiniuUploadTokenFunction) {
      config.qiniuUploadToken = config.qiniuUploadTokenFunction();
      if (null == config.qiniuUploadToken && config.qiniuUploadToken.length > 0) {
        console.error('qiniu UploadTokenFunction result is null, please check the return value');
        return;
      }
      doUpload(filePath, success, fail, options, progress, cancelTask);
    } else {
      console.error('qiniu uploader need one of [uptoken, uptokenURL, uptokenFunc]');
      return;
    }
  }

  function doUpload(filePath, _success, _fail, options, progress, cancelTask) {
    if (null == config.qiniuUploadToken && config.qiniuUploadToken.length > 0) {
      console.error('qiniu UploadToken is null, please check the init config or networking');
      return;
    }
    var url = uploadURLFromRegionCode(config.qiniuRegion);
    var fileName = filePath.split('//')[1];
    if (options && options.key) {
      fileName = options.key;
    }
    var formData = {
      'token': config.qiniuUploadToken };

    if (!config.qiniuShouldUseQiniuFileName) {
      formData['key'] = fileName;
    }
    var uploadTask = uni.uploadFile({
      url: url,
      filePath: filePath,
      name: 'file',
      formData: formData,
      success: function success(res) {
        var dataString = res.data;
        //   // this if case is a compatibility with wechat server returned a charcode, but was fixed
        //   if(res.data.hasOwnProperty('type') && res.data.type === 'Buffer'){
        //     dataString = String.fromCharCode.apply(null, res.data.data)
        //   }
        try {
          console.log(res);
          var dataObject = JSON.parse(dataString);
          //do something
          var fileUrl = config.qiniuImageURLPrefix + '/' + dataObject.key;
          dataObject.fileUrl = fileUrl;
          dataObject.imageURL = fileUrl;
          console.log(dataObject);
          if (_success) {
            _success(dataObject);
          }
        } catch (e) {
          console.log('parse JSON failed, origin String is: ' + dataString);
          if (_fail) {
            _fail(e);
          }
        }
      },
      fail: function fail(error) {
        console.error(error);
        if (_fail) {
          _fail(error);
        }
      } });


    uploadTask.onProgressUpdate(function (res) {
      progress && progress(res);
    });

    cancelTask && cancelTask(function () {
      uploadTask.abort();
    });
  }

  function getQiniuToken(callback) {
    uni.request({
      url: config.qiniuUploadTokenURL,
      success: function success(res) {
        var token = res.data.uptoken;
        if (token && token.length > 0) {
          config.qiniuUploadToken = token;
          if (callback) {
            callback();
          }
        } else {
          console.error('qiniuUploader cannot get your token, please check the uptokenURL or server');
        }
      },
      fail: function fail(error) {
        console.error('qiniu UploadToken is null, please check the init config or networking: ' + error);
      } });

  }

  function uploadURLFromRegionCode(code) {
    var uploadURL = null;
    switch (code) {
      case 'ECN':uploadURL = 'https://up.qiniup.com';break;
      case 'NCN':uploadURL = 'https://up-z1.qiniup.com';break;
      case 'SCN':uploadURL = 'https://up-z2.qiniup.com';break;
      case 'NA':uploadURL = 'https://up-na0.qiniup.com';break;
      case 'ASG':uploadURL = 'https://up-as0.qiniup.com';break;
      default:console.error('please make the region is with one of [ECN, SCN, NCN, NA, ASG]');}

    return uploadURL;
  }

})();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 5:
/*!*******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/dist/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var _package = __webpack_require__(/*! ../package.json */ 6);function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var STAT_VERSION = _package.version;
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif';
var PAGE_PVER_TIME = 1800;
var APP_PVER_TIME = 300;
var OPERATING_TIME = 10;

var UUID_KEY = '__DC_STAT_UUID';
var UUID_VALUE = '__DC_UUID_VALUE';

function getUuid() {
  var uuid = '';
  if (getPlatformName() === 'n') {
    try {
      uuid = plus.runtime.getDCloudId();
    } catch (e) {
      uuid = '';
    }
    return uuid;
  }

  try {
    uuid = uni.getStorageSync(UUID_KEY);
  } catch (e) {
    uuid = UUID_VALUE;
  }

  if (!uuid) {
    uuid = Date.now() + '' + Math.floor(Math.random() * 1e7);
    try {
      uni.setStorageSync(UUID_KEY, uuid);
    } catch (e) {
      uni.setStorageSync(UUID_KEY, UUID_VALUE);
    }
  }
  return uuid;
}

var getSgin = function getSgin(statData) {
  var arr = Object.keys(statData);
  var sortArr = arr.sort();
  var sgin = {};
  var sginStr = '';
  for (var i in sortArr) {
    sgin[sortArr[i]] = statData[sortArr[i]];
    sginStr += sortArr[i] + '=' + statData[sortArr[i]] + '&';
  }
  // const options = sginStr.substr(0, sginStr.length - 1)
  // sginStr = sginStr.substr(0, sginStr.length - 1) + '&key=' + STAT_KEY;
  // const si = crypto.createHash('md5').update(sginStr).digest('hex');
  return {
    sign: '',
    options: sginStr.substr(0, sginStr.length - 1) };

};

var getSplicing = function getSplicing(data) {
  var str = '';
  for (var i in data) {
    str += i + '=' + data[i] + '&';
  }
  return str.substr(0, str.length - 1);
};

var getTime = function getTime() {
  return parseInt(new Date().getTime() / 1000);
};

var getPlatformName = function getPlatformName() {
  var platformList = {
    'app-plus': 'n',
    'h5': 'h5',
    'mp-weixin': 'wx',
    'mp-alipay': 'ali',
    'mp-baidu': 'bd',
    'mp-toutiao': 'tt',
    'mp-qq': 'qq' };

  return platformList["mp-weixin"];
};

var getPackName = function getPackName() {
  var packName = '';
  if (getPlatformName() === 'wx' || getPlatformName() === 'qq') {
    // 兼容微信小程序低版本基础库
    if (uni.canIUse('getAccountInfoSync')) {
      packName = uni.getAccountInfoSync().miniProgram.appId || '';
    }
  }
  return packName;
};

var getVersion = function getVersion() {
  return getPlatformName() === 'n' ? plus.runtime.version : '';
};

var getChannel = function getChannel() {
  var platformName = getPlatformName();
  var channel = '';
  if (platformName === 'n') {
    channel = plus.runtime.channel;
  }
  return channel;
};

var getScene = function getScene(options) {
  var platformName = getPlatformName();
  var scene = '';
  if (options) {
    return options;
  }
  if (platformName === 'wx') {
    scene = uni.getLaunchOptionsSync().scene;
  }
  return scene;
};
var First__Visit__Time__KEY = 'First__Visit__Time';
var Last__Visit__Time__KEY = 'Last__Visit__Time';

var getFirstVisitTime = function getFirstVisitTime() {
  var timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = getTime();
    uni.setStorageSync(First__Visit__Time__KEY, time);
    uni.removeStorageSync(Last__Visit__Time__KEY);
  }
  return time;
};

var getLastVisitTime = function getLastVisitTime() {
  var timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = '';
  }
  uni.setStorageSync(Last__Visit__Time__KEY, getTime());
  return time;
};


var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;
var Last_Page_residence_time = 0;


var setPageResidenceTime = function setPageResidenceTime() {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time;
};

var getPageResidenceTime = function getPageResidenceTime() {
  Last_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
  }
  return Last_Page_residence_time - First_Page_residence_time;
};
var TOTAL__VISIT__COUNT = 'Total__Visit__Count';
var getTotalVisitCount = function getTotalVisitCount() {
  var timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
  var count = 1;
  if (timeStorge) {
    count = timeStorge;
    count++;
  }
  uni.setStorageSync(TOTAL__VISIT__COUNT, count);
  return count;
};

var GetEncodeURIComponentOptions = function GetEncodeURIComponentOptions(statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data;
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function getFirstTime() {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time;
};


var getLastTime = function getLastTime() {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time;
};


var getResidenceTime = function getResidenceTime(type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = parseInt(residenceTime / 1000);
  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  if (type === 'app') {
    var overtime = residenceTime > APP_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime };

  }
  if (type === 'page') {
    var _overtime = residenceTime > PAGE_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: _overtime };

  }

  return {
    residenceTime: residenceTime };


};

var getRoute = function getRoute() {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is;
  } else {
    return _self.$scope && _self.$scope.route || _self.$mp && _self.$mp.page.route;
  }
};

var getPageRoute = function getPageRoute(self) {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;
  var query = self._query;
  var str = query && JSON.stringify(query) !== '{}' ? '?' + JSON.stringify(query) : '';
  // clear
  self._query = '';
  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is + str;
  } else {
    return _self.$scope && _self.$scope.route + str || _self.$mp && _self.$mp.page.route + str;
  }
};

var getPageTypes = function getPageTypes(self) {
  if (self.mpType === 'page' || self.$mp && self.$mp.mpType === 'page' || self.$options.mpType === 'page') {
    return true;
  }
  return false;
};

var calibration = function calibration(eventName, options) {
  //  login 、 share 、pay_success 、pay_fail 、register 、title
  if (!eventName) {
    console.error("uni.report \u7F3A\u5C11 [eventName] \u53C2\u6570");
    return true;
  }
  if (typeof eventName !== 'string') {
    console.error("uni.report [eventName] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u7C7B\u578B");
    return true;
  }
  if (eventName.length > 255) {
    console.error("uni.report [eventName] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (typeof options !== 'string' && typeof options !== 'object') {
    console.error("uni.report [options] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u6216 Object \u7C7B\u578B");
    return true;
  }

  if (typeof options === 'string' && options.length > 255) {
    console.error("uni.report [options] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (eventName === 'title' && typeof options !== 'string') {
    console.error('uni.report [eventName] 参数为 title 时，[options] 参数只能为 String 类型');
    return true;
  }
};

var PagesJson = __webpack_require__(/*! uni-pages?{"type":"style"} */ 7).default;
var statConfig = __webpack_require__(/*! uni-stat-config */ 8).default || __webpack_require__(/*! uni-stat-config */ 8);

var resultOptions = uni.getSystemInfoSync();var

Util = /*#__PURE__*/function () {
  function Util() {_classCallCheck(this, Util);
    this.self = '';
    this._retry = 0;
    this._platform = '';
    this._query = {};
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: '' };

    this._operatingTime = 0;
    this._reportingRequestData = {
      '1': [],
      '11': [] };

    this.__prevent_triggering = false;

    this.__licationHide = false;
    this.__licationShow = false;
    this._lastPageRoute = '';
    this.statData = {
      uuid: getUuid(),
      ut: getPlatformName(),
      mpn: getPackName(),
      ak: statConfig.appid,
      usv: STAT_VERSION,
      v: getVersion(),
      ch: getChannel(),
      cn: '',
      pn: '',
      ct: '',
      t: getTime(),
      tt: '',
      p: resultOptions.platform === 'android' ? 'a' : 'i',
      brand: resultOptions.brand || '',
      md: resultOptions.model,
      sv: resultOptions.system.replace(/(Android|iOS)\s/, ''),
      mpsdk: resultOptions.SDKVersion || '',
      mpv: resultOptions.version || '',
      lang: resultOptions.language,
      pr: resultOptions.pixelRatio,
      ww: resultOptions.windowWidth,
      wh: resultOptions.windowHeight,
      sw: resultOptions.screenWidth,
      sh: resultOptions.screenHeight };


  }_createClass(Util, [{ key: "_applicationShow", value: function _applicationShow()

    {
      if (this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('app');
        if (time.overtime) {
          var options = {
            path: this._lastPageRoute,
            scene: this.statData.sc };

          this._sendReportRequest(options);
        }
        this.__licationHide = false;
      }
    } }, { key: "_applicationHide", value: function _applicationHide(

    self, type) {

      this.__licationHide = true;
      getLastTime();
      var time = getResidenceTime();
      getFirstTime();
      var route = getPageRoute(this);
      this._sendHideRequest({
        urlref: route,
        urlref_ts: time.residenceTime },
      type);
    } }, { key: "_pageShow", value: function _pageShow()

    {
      var route = getPageRoute(this);
      var routepath = getRoute();
      this._navigationBarTitle.config = PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].titleNView &&
      PagesJson.pages[routepath].titleNView.titleText ||
      PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].navigationBarTitleText || '';

      if (this.__licationShow) {
        getFirstTime();
        this.__licationShow = false;
        // console.log('这是 onLauch 之后执行的第一次 pageShow ，为下次记录时间做准备');
        this._lastPageRoute = route;
        return;
      }

      getLastTime();
      this._lastPageRoute = route;
      var time = getResidenceTime('page');
      if (time.overtime) {
        var options = {
          path: this._lastPageRoute,
          scene: this.statData.sc };

        this._sendReportRequest(options);
      }
      getFirstTime();
    } }, { key: "_pageHide", value: function _pageHide()

    {
      if (!this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('page');
        this._sendPageRequest({
          url: this._lastPageRoute,
          urlref: this._lastPageRoute,
          urlref_ts: time.residenceTime });

        this._navigationBarTitle = {
          config: '',
          page: '',
          report: '',
          lt: '' };

        return;
      }
    } }, { key: "_login", value: function _login()

    {
      this._sendEventRequest({
        key: 'login' },
      0);
    } }, { key: "_share", value: function _share()

    {
      this._sendEventRequest({
        key: 'share' },
      0);
    } }, { key: "_payment", value: function _payment(
    key) {
      this._sendEventRequest({
        key: key },
      0);
    } }, { key: "_sendReportRequest", value: function _sendReportRequest(
    options) {

      this._navigationBarTitle.lt = '1';
      var query = options.query && JSON.stringify(options.query) !== '{}' ? '?' + JSON.stringify(options.query) : '';
      this.statData.lt = '1';
      this.statData.url = options.path + query || '';
      this.statData.t = getTime();
      this.statData.sc = getScene(options.scene);
      this.statData.fvts = getFirstVisitTime();
      this.statData.lvts = getLastVisitTime();
      this.statData.tvc = getTotalVisitCount();
      if (getPlatformName() === 'n') {
        this.getProperty();
      } else {
        this.getNetworkInfo();
      }
    } }, { key: "_sendPageRequest", value: function _sendPageRequest(

    opt) {var

      url =


      opt.url,urlref = opt.urlref,urlref_ts = opt.urlref_ts;
      this._navigationBarTitle.lt = '11';
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '11',
        ut: this.statData.ut,
        url: url,
        tt: this.statData.tt,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "_sendHideRequest", value: function _sendHideRequest(

    opt, type) {var

      urlref =

      opt.urlref,urlref_ts = opt.urlref_ts;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '3',
        ut: this.statData.ut,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options, type);
    } }, { key: "_sendEventRequest", value: function _sendEventRequest()



    {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$key = _ref.key,key = _ref$key === void 0 ? '' : _ref$key,_ref$value = _ref.value,value = _ref$value === void 0 ? "" : _ref$value;
      var route = this._lastPageRoute;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '21',
        ut: this.statData.ut,
        url: route,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "getNetworkInfo", value: function getNetworkInfo()

    {var _this = this;
      uni.getNetworkType({
        success: function success(result) {
          _this.statData.net = result.networkType;
          _this.getLocation();
        } });

    } }, { key: "getProperty", value: function getProperty()

    {var _this2 = this;
      plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
        _this2.statData.v = wgtinfo.version || '';
        _this2.getNetworkInfo();
      });
    } }, { key: "getLocation", value: function getLocation()

    {var _this3 = this;
      if (statConfig.getLocation) {
        uni.getLocation({
          type: 'wgs84',
          geocode: true,
          success: function success(result) {
            if (result.address) {
              _this3.statData.cn = result.address.country;
              _this3.statData.pn = result.address.province;
              _this3.statData.ct = result.address.city;
            }

            _this3.statData.lat = result.latitude;
            _this3.statData.lng = result.longitude;
            _this3.request(_this3.statData);
          } });

      } else {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData);
      }
    } }, { key: "request", value: function request(

    data, type) {var _this4 = this;
      var time = getTime();
      var title = this._navigationBarTitle;
      data.ttn = title.page;
      data.ttpj = title.config;
      data.ttc = title.report;

      var requestData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        requestData = uni.getStorageSync('__UNI__STAT__DATA') || {};
      }
      if (!requestData[data.lt]) {
        requestData[data.lt] = [];
      }
      requestData[data.lt].push(data);

      if (getPlatformName() === 'n') {
        uni.setStorageSync('__UNI__STAT__DATA', requestData);
      }
      if (getPageResidenceTime() < OPERATING_TIME && !type) {
        return;
      }
      var uniStatData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        uniStatData = uni.getStorageSync('__UNI__STAT__DATA');
      }
      // 时间超过，重新获取时间戳
      setPageResidenceTime();
      var firstArr = [];
      var contentArr = [];
      var lastArr = [];var _loop = function _loop(

      i) {
        var rd = uniStatData[i];
        rd.forEach(function (elm) {
          var newData = getSplicing(elm);
          if (i === 0) {
            firstArr.push(newData);
          } else if (i === 3) {
            lastArr.push(newData);
          } else {
            contentArr.push(newData);
          }
        });};for (var i in uniStatData) {_loop(i);
      }

      firstArr.push.apply(firstArr, contentArr.concat(lastArr));
      var optionsData = {
        usv: STAT_VERSION, //统计 SDK 版本号
        t: time, //发送请求时的时间戮
        requests: JSON.stringify(firstArr) };


      this._reportingRequestData = {};
      if (getPlatformName() === 'n') {
        uni.removeStorageSync('__UNI__STAT__DATA');
      }

      if (data.ut === 'h5') {
        this.imageRequest(optionsData);
        return;
      }

      if (getPlatformName() === 'n' && this.statData.p === 'a') {
        setTimeout(function () {
          _this4._sendRequest(optionsData);
        }, 200);
        return;
      }
      this._sendRequest(optionsData);
    } }, { key: "_sendRequest", value: function _sendRequest(
    optionsData) {var _this5 = this;
      uni.request({
        url: STAT_URL,
        method: 'POST',
        // header: {
        //   'content-type': 'application/json' // 默认值
        // },
        data: optionsData,
        success: function success() {
          // if (process.env.NODE_ENV === 'development') {
          //   console.log('stat request success');
          // }
        },
        fail: function fail(e) {
          if (++_this5._retry < 3) {
            setTimeout(function () {
              _this5._sendRequest(optionsData);
            }, 1000);
          }
        } });

    }
    /**
       * h5 请求
       */ }, { key: "imageRequest", value: function imageRequest(
    data) {
      var image = new Image();
      var options = getSgin(GetEncodeURIComponentOptions(data)).options;
      image.src = STAT_H5_URL + '?' + options;
    } }, { key: "sendEvent", value: function sendEvent(

    key, value) {
      // 校验 type 参数
      if (calibration(key, value)) return;

      if (key === 'title') {
        this._navigationBarTitle.report = value;
        return;
      }
      this._sendEventRequest({
        key: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value },
      1);
    } }]);return Util;}();var



Stat = /*#__PURE__*/function (_Util) {_inherits(Stat, _Util);_createClass(Stat, null, [{ key: "getInstance", value: function getInstance()
    {
      if (!this.instance) {
        this.instance = new Stat();
      }
      return this.instance;
    } }]);
  function Stat() {var _this6;_classCallCheck(this, Stat);
    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Stat).call(this));
    _this6.instance = null;
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function' && "development" !== 'development') {
      _this6.addInterceptorInit();
      _this6.interceptLogin();
      _this6.interceptShare(true);
      _this6.interceptRequestPayment();
    }return _this6;
  }_createClass(Stat, [{ key: "addInterceptorInit", value: function addInterceptorInit()

    {
      var self = this;
      uni.addInterceptor('setNavigationBarTitle', {
        invoke: function invoke(args) {
          self._navigationBarTitle.page = args.title;
        } });

    } }, { key: "interceptLogin", value: function interceptLogin()

    {
      var self = this;
      uni.addInterceptor('login', {
        complete: function complete() {
          self._login();
        } });

    } }, { key: "interceptShare", value: function interceptShare(

    type) {
      var self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor('share', {
        success: function success() {
          self._share();
        },
        fail: function fail() {
          self._share();
        } });

    } }, { key: "interceptRequestPayment", value: function interceptRequestPayment()

    {
      var self = this;
      uni.addInterceptor('requestPayment', {
        success: function success() {
          self._payment('pay_success');
        },
        fail: function fail() {
          self._payment('pay_fail');
        } });

    } }, { key: "report", value: function report(

    options, self) {
      this.self = self;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('report init');
      // }
      setPageResidenceTime();
      this.__licationShow = true;
      this._sendReportRequest(options, true);
    } }, { key: "load", value: function load(

    options, self) {
      if (!self.$scope && !self.$mp) {
        var page = getCurrentPages();
        self.$scope = page[page.length - 1];
      }
      this.self = self;
      this._query = options;
    } }, { key: "show", value: function show(

    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageShow(self);
      } else {
        this._applicationShow(self);
      }
    } }, { key: "ready", value: function ready(

    self) {
      // this.self = self;
      // if (getPageTypes(self)) {
      //   this._pageShow(self);
      // }
    } }, { key: "hide", value: function hide(
    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageHide(self);
      } else {
        this._applicationHide(self, true);
      }
    } }, { key: "error", value: function error(
    em) {
      if (this._platform === 'devtools') {
        if (true) {
          console.info('当前运行环境为开发者工具，不上报数据。');
        }
        // return;
      }
      var emVal = '';
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '31',
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }]);return Stat;}(Util);


var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch(options) {
    stat.report(options, this);
  },
  onReady: function onReady() {
    stat.ready(this);
  },
  onLoad: function onLoad(options) {
    stat.load(options, this);
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options);
      };
    }
  },
  onShow: function onShow() {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide() {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload() {
    if (isHide) {
      isHide = false;
      return;
    }
    stat.hide(this);
  },
  onError: function onError(e) {
    stat.error(e);
  } };


function main() {
  if (true) {
    uni.report = function (type, options) {};
  } else { var Vue; }
}

main();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 566:
/*!**********************************************************!*\
  !*** C:/Users/Admin/Desktop/evc.app/common/js/qrcode.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var QRCode = {};
(function () {
  /**
               * 获取单个字符的utf8编码
               * unicode BMP平面约65535个字符
               * @param {num} code
               * return {array}
               */
  function unicodeFormat8(code) {
    // 1 byte
    var c0, c1, c2;
    if (code < 128) {
      return [code];
      // 2 bytes
    } else if (code < 2048) {
      c0 = 192 + (code >> 6);
      c1 = 128 + (code & 63);
      return [c0, c1];
      // 3 bytes
    } else {
      c0 = 224 + (code >> 12);
      c1 = 128 + (code >> 6 & 63);
      c2 = 128 + (code & 63);
      return [c0, c1, c2];
    }
  }
  /**
     * 获取字符串的utf8编码字节串
     * @param {string} string
     * @return {array}
     */
  function getUTF8Bytes(string) {
    var utf8codes = [];
    for (var i = 0; i < string.length; i++) {
      var code = string.charCodeAt(i);
      var utf8 = unicodeFormat8(code);
      for (var j = 0; j < utf8.length; j++) {
        utf8codes.push(utf8[j]);
      }
    }
    return utf8codes;
  }
  /**
     * 二维码算法实现
     * @param {string} data              要编码的信息字符串
     * @param {num} errorCorrectLevel 纠错等级
     */
  function QRCodeAlg(data, errorCorrectLevel) {
    this.typeNumber = -1; //版本
    this.errorCorrectLevel = errorCorrectLevel;
    this.modules = null; //二维矩阵，存放最终结果
    this.moduleCount = 0; //矩阵大小
    this.dataCache = null; //数据缓存
    this.rsBlocks = null; //版本数据信息
    this.totalDataCount = -1; //可使用的数据量
    this.data = data;
    this.utf8bytes = getUTF8Bytes(data);
    this.make();
  }
  QRCodeAlg.prototype = {
    constructor: QRCodeAlg,
    /**
                             * 获取二维码矩阵大小
                             * @return {num} 矩阵大小
                             */
    getModuleCount: function getModuleCount() {
      return this.moduleCount;
    },
    /**
        * 编码
        */
    make: function make() {
      this.getRightType();
      this.dataCache = this.createData();
      this.createQrcode();
    },
    /**
        * 设置二位矩阵功能图形
        * @param  {bool} test 表示是否在寻找最好掩膜阶段
        * @param  {num} maskPattern 掩膜的版本
        */
    makeImpl: function makeImpl(maskPattern) {
      this.moduleCount = this.typeNumber * 4 + 17;
      this.modules = new Array(this.moduleCount);
      for (var row = 0; row < this.moduleCount; row++) {
        this.modules[row] = new Array(this.moduleCount);
      }
      this.setupPositionProbePattern(0, 0);
      this.setupPositionProbePattern(this.moduleCount - 7, 0);
      this.setupPositionProbePattern(0, this.moduleCount - 7);
      this.setupPositionAdjustPattern();
      this.setupTimingPattern();
      this.setupTypeInfo(true, maskPattern);
      if (this.typeNumber >= 7) {
        this.setupTypeNumber(true);
      }
      this.mapData(this.dataCache, maskPattern);
    },
    /**
        * 设置二维码的位置探测图形
        * @param  {num} row 探测图形的中心横坐标
        * @param  {num} col 探测图形的中心纵坐标
        */
    setupPositionProbePattern: function setupPositionProbePattern(row, col) {
      for (var r = -1; r <= 7; r++) {
        if (row + r <= -1 || this.moduleCount <= row + r) continue;
        for (var c = -1; c <= 7; c++) {
          if (col + c <= -1 || this.moduleCount <= col + c) continue;
          if (0 <= r && r <= 6 && (c == 0 || c == 6) || 0 <= c && c <= 6 && (r == 0 || r == 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4) {
            this.modules[row + r][col + c] = true;
          } else {
            this.modules[row + r][col + c] = false;
          }
        }
      }
    },
    /**
        * 创建二维码
        * @return {[type]} [description]
        */
    createQrcode: function createQrcode() {
      var minLostPoint = 0;
      var pattern = 0;
      var bestModules = null;
      for (var i = 0; i < 8; i++) {
        this.makeImpl(i);
        var lostPoint = QRUtil.getLostPoint(this);
        if (i == 0 || minLostPoint > lostPoint) {
          minLostPoint = lostPoint;
          pattern = i;
          bestModules = this.modules;
        }
      }
      this.modules = bestModules;
      this.setupTypeInfo(false, pattern);
      if (this.typeNumber >= 7) {
        this.setupTypeNumber(false);
      }
    },
    /**
        * 设置定位图形
        * @return {[type]} [description]
        */
    setupTimingPattern: function setupTimingPattern() {
      for (var r = 8; r < this.moduleCount - 8; r++) {
        if (this.modules[r][6] != null) {
          continue;
        }
        this.modules[r][6] = r % 2 == 0;
        if (this.modules[6][r] != null) {
          continue;
        }
        this.modules[6][r] = r % 2 == 0;
      }
    },
    /**
        * 设置矫正图形
        * @return {[type]} [description]
        */
    setupPositionAdjustPattern: function setupPositionAdjustPattern() {
      var pos = QRUtil.getPatternPosition(this.typeNumber);
      for (var i = 0; i < pos.length; i++) {
        for (var j = 0; j < pos.length; j++) {
          var row = pos[i];
          var col = pos[j];
          if (this.modules[row][col] != null) {
            continue;
          }
          for (var r = -2; r <= 2; r++) {
            for (var c = -2; c <= 2; c++) {
              if (r == -2 || r == 2 || c == -2 || c == 2 || r == 0 && c == 0) {
                this.modules[row + r][col + c] = true;
              } else {
                this.modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    },
    /**
        * 设置版本信息（7以上版本才有）
        * @param  {bool} test 是否处于判断最佳掩膜阶段
        * @return {[type]}      [description]
        */
    setupTypeNumber: function setupTypeNumber(test) {
      var bits = QRUtil.getBCHTypeNumber(this.typeNumber);
      for (var i = 0; i < 18; i++) {
        var mod = !test && (bits >> i & 1) == 1;
        this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
        this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
      }
    },
    /**
        * 设置格式信息（纠错等级和掩膜版本）
        * @param  {bool} test
        * @param  {num} maskPattern 掩膜版本
        * @return {}
        */
    setupTypeInfo: function setupTypeInfo(test, maskPattern) {
      var data = QRErrorCorrectLevel[this.errorCorrectLevel] << 3 | maskPattern;
      var bits = QRUtil.getBCHTypeInfo(data);
      // vertical
      for (var i = 0; i < 15; i++) {
        var mod = !test && (bits >> i & 1) == 1;
        if (i < 6) {
          this.modules[i][8] = mod;
        } else if (i < 8) {
          this.modules[i + 1][8] = mod;
        } else {
          this.modules[this.moduleCount - 15 + i][8] = mod;
        }
        // horizontal
        var mod = !test && (bits >> i & 1) == 1;
        if (i < 8) {
          this.modules[8][this.moduleCount - i - 1] = mod;
        } else if (i < 9) {
          this.modules[8][15 - i - 1 + 1] = mod;
        } else {
          this.modules[8][15 - i - 1] = mod;
        }
      }
      // fixed module
      this.modules[this.moduleCount - 8][8] = !test;
    },
    /**
        * 数据编码
        * @return {[type]} [description]
        */
    createData: function createData() {
      var buffer = new QRBitBuffer();
      var lengthBits = this.typeNumber > 9 ? 16 : 8;
      buffer.put(4, 4); //添加模式
      buffer.put(this.utf8bytes.length, lengthBits);
      for (var i = 0, l = this.utf8bytes.length; i < l; i++) {
        buffer.put(this.utf8bytes[i], 8);
      }
      if (buffer.length + 4 <= this.totalDataCount * 8) {
        buffer.put(0, 4);
      }
      // padding
      while (buffer.length % 8 != 0) {
        buffer.putBit(false);
      }
      // padding
      while (true) {
        if (buffer.length >= this.totalDataCount * 8) {
          break;
        }
        buffer.put(QRCodeAlg.PAD0, 8);
        if (buffer.length >= this.totalDataCount * 8) {
          break;
        }
        buffer.put(QRCodeAlg.PAD1, 8);
      }
      return this.createBytes(buffer);
    },
    /**
        * 纠错码编码
        * @param  {buffer} buffer 数据编码
        * @return {[type]}
        */
    createBytes: function createBytes(buffer) {
      var offset = 0;
      var maxDcCount = 0;
      var maxEcCount = 0;
      var length = this.rsBlock.length / 3;
      var rsBlocks = new Array();
      for (var i = 0; i < length; i++) {
        var count = this.rsBlock[i * 3 + 0];
        var totalCount = this.rsBlock[i * 3 + 1];
        var dataCount = this.rsBlock[i * 3 + 2];
        for (var j = 0; j < count; j++) {
          rsBlocks.push([dataCount, totalCount]);
        }
      }
      var dcdata = new Array(rsBlocks.length);
      var ecdata = new Array(rsBlocks.length);
      for (var r = 0; r < rsBlocks.length; r++) {
        var dcCount = rsBlocks[r][0];
        var ecCount = rsBlocks[r][1] - dcCount;
        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);
        dcdata[r] = new Array(dcCount);
        for (var i = 0; i < dcdata[r].length; i++) {
          dcdata[r][i] = 0xff & buffer.buffer[i + offset];
        }
        offset += dcCount;
        var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
        var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
        var modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = new Array(rsPoly.getLength() - 1);
        for (var i = 0; i < ecdata[r].length; i++) {
          var modIndex = i + modPoly.getLength() - ecdata[r].length;
          ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
        }
      }
      var data = new Array(this.totalDataCount);
      var index = 0;
      for (var i = 0; i < maxDcCount; i++) {
        for (var r = 0; r < rsBlocks.length; r++) {
          if (i < dcdata[r].length) {
            data[index++] = dcdata[r][i];
          }
        }
      }
      for (var i = 0; i < maxEcCount; i++) {
        for (var r = 0; r < rsBlocks.length; r++) {
          if (i < ecdata[r].length) {
            data[index++] = ecdata[r][i];
          }
        }
      }
      return data;

    },
    /**
        * 布置模块，构建最终信息
        * @param  {} data
        * @param  {} maskPattern
        * @return {}
        */
    mapData: function mapData(data, maskPattern) {
      var inc = -1;
      var row = this.moduleCount - 1;
      var bitIndex = 7;
      var byteIndex = 0;
      for (var col = this.moduleCount - 1; col > 0; col -= 2) {
        if (col == 6) col--;
        while (true) {
          for (var c = 0; c < 2; c++) {
            if (this.modules[row][col - c] == null) {
              var dark = false;
              if (byteIndex < data.length) {
                dark = (data[byteIndex] >>> bitIndex & 1) == 1;
              }
              var mask = QRUtil.getMask(maskPattern, row, col - c);
              if (mask) {
                dark = !dark;
              }
              this.modules[row][col - c] = dark;
              bitIndex--;
              if (bitIndex == -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || this.moduleCount <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    } };

  /**
          * 填充字段
          */
  QRCodeAlg.PAD0 = 0xEC;
  QRCodeAlg.PAD1 = 0x11;
  //---------------------------------------------------------------------
  // 纠错等级对应的编码
  //---------------------------------------------------------------------
  var QRErrorCorrectLevel = [1, 0, 3, 2];
  //---------------------------------------------------------------------
  // 掩膜版本
  //---------------------------------------------------------------------
  var QRMaskPattern = {
    PATTERN000: 0,
    PATTERN001: 1,
    PATTERN010: 2,
    PATTERN011: 3,
    PATTERN100: 4,
    PATTERN101: 5,
    PATTERN110: 6,
    PATTERN111: 7 };

  //---------------------------------------------------------------------
  // 工具类
  //---------------------------------------------------------------------
  var QRUtil = {
    /*
                 每个版本矫正图形的位置
                  */
    PATTERN_POSITION_TABLE: [
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
    [6, 30, 54],
    [6, 32, 58],
    [6, 34, 62],
    [6, 26, 46, 66],
    [6, 26, 48, 70],
    [6, 26, 50, 74],
    [6, 30, 54, 78],
    [6, 30, 56, 82],
    [6, 30, 58, 86],
    [6, 34, 62, 90],
    [6, 28, 50, 72, 94],
    [6, 26, 50, 74, 98],
    [6, 30, 54, 78, 102],
    [6, 28, 54, 80, 106],
    [6, 32, 58, 84, 110],
    [6, 30, 58, 86, 114],
    [6, 34, 62, 90, 118],
    [6, 26, 50, 74, 98, 122],
    [6, 30, 54, 78, 102, 126],
    [6, 26, 52, 78, 104, 130],
    [6, 30, 56, 82, 108, 134],
    [6, 34, 60, 86, 112, 138],
    [6, 30, 58, 86, 114, 142],
    [6, 34, 62, 90, 118, 146],
    [6, 30, 54, 78, 102, 126, 150],
    [6, 24, 50, 76, 102, 128, 154],
    [6, 28, 54, 80, 106, 132, 158],
    [6, 32, 58, 84, 110, 136, 162],
    [6, 26, 54, 82, 110, 138, 166],
    [6, 30, 58, 86, 114, 142, 170]],

    G15: 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0,
    G18: 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0,
    G15_MASK: 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1,
    /*
                                                             BCH编码格式信息
                                                              */
    getBCHTypeInfo: function getBCHTypeInfo(data) {
      var d = data << 10;
      while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
        d ^= QRUtil.G15 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15);
      }
      return (data << 10 | d) ^ QRUtil.G15_MASK;
    },
    /*
       BCH编码版本信息
        */
    getBCHTypeNumber: function getBCHTypeNumber(data) {
      var d = data << 12;
      while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
        d ^= QRUtil.G18 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18);
      }
      return data << 12 | d;
    },
    /*
       获取BCH位信息
        */
    getBCHDigit: function getBCHDigit(data) {
      var digit = 0;
      while (data != 0) {
        digit++;
        data >>>= 1;
      }
      return digit;
    },
    /*
       获取版本对应的矫正图形位置
        */
    getPatternPosition: function getPatternPosition(typeNumber) {
      return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
    },
    /*
       掩膜算法
        */
    getMask: function getMask(maskPattern, i, j) {
      switch (maskPattern) {
        case QRMaskPattern.PATTERN000:
          return (i + j) % 2 == 0;
        case QRMaskPattern.PATTERN001:
          return i % 2 == 0;
        case QRMaskPattern.PATTERN010:
          return j % 3 == 0;
        case QRMaskPattern.PATTERN011:
          return (i + j) % 3 == 0;
        case QRMaskPattern.PATTERN100:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
        case QRMaskPattern.PATTERN101:
          return i * j % 2 + i * j % 3 == 0;
        case QRMaskPattern.PATTERN110:
          return (i * j % 2 + i * j % 3) % 2 == 0;
        case QRMaskPattern.PATTERN111:
          return (i * j % 3 + (i + j) % 2) % 2 == 0;
        default:
          throw new Error("bad maskPattern:" + maskPattern);}

    },
    /*
       获取RS的纠错多项式
        */
    getErrorCorrectPolynomial: function getErrorCorrectPolynomial(errorCorrectLength) {
      var a = new QRPolynomial([1], 0);
      for (var i = 0; i < errorCorrectLength; i++) {
        a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
      }
      return a;
    },
    /*
       获取评价
        */
    getLostPoint: function getLostPoint(qrCode) {
      var moduleCount = qrCode.getModuleCount(),
      lostPoint = 0,
      darkCount = 0;
      for (var row = 0; row < moduleCount; row++) {
        var sameCount = 0;
        var head = qrCode.modules[row][0];
        for (var col = 0; col < moduleCount; col++) {
          var current = qrCode.modules[row][col];
          //level 3 评价
          if (col < moduleCount - 6) {
            if (current && !qrCode.modules[row][col + 1] && qrCode.modules[row][col + 2] && qrCode.modules[row][col + 3] && qrCode.modules[row][col + 4] && !qrCode.modules[row][col + 5] && qrCode.modules[row][col + 6]) {
              if (col < moduleCount - 10) {
                if (qrCode.modules[row][col + 7] && qrCode.modules[row][col + 8] && qrCode.modules[row][col + 9] && qrCode.modules[row][col + 10]) {
                  lostPoint += 40;
                }
              } else if (col > 3) {
                if (qrCode.modules[row][col - 1] && qrCode.modules[row][col - 2] && qrCode.modules[row][col - 3] && qrCode.modules[row][col - 4]) {
                  lostPoint += 40;
                }
              }
            }
          }
          //level 2 评价
          if (row < moduleCount - 1 && col < moduleCount - 1) {
            var count = 0;
            if (current) count++;
            if (qrCode.modules[row + 1][col]) count++;
            if (qrCode.modules[row][col + 1]) count++;
            if (qrCode.modules[row + 1][col + 1]) count++;
            if (count == 0 || count == 4) {
              lostPoint += 3;
            }
          }
          //level 1 评价
          if (head ^ current) {
            sameCount++;
          } else {
            head = current;
            if (sameCount >= 5) {
              lostPoint += 3 + sameCount - 5;
            }
            sameCount = 1;
          }
          //level 4 评价
          if (current) {
            darkCount++;
          }
        }
      }
      for (var col = 0; col < moduleCount; col++) {
        var sameCount = 0;
        var head = qrCode.modules[0][col];
        for (var row = 0; row < moduleCount; row++) {
          var current = qrCode.modules[row][col];
          //level 3 评价
          if (row < moduleCount - 6) {
            if (current && !qrCode.modules[row + 1][col] && qrCode.modules[row + 2][col] && qrCode.modules[row + 3][col] && qrCode.modules[row + 4][col] && !qrCode.modules[row + 5][col] && qrCode.modules[row + 6][col]) {
              if (row < moduleCount - 10) {
                if (qrCode.modules[row + 7][col] && qrCode.modules[row + 8][col] && qrCode.modules[row + 9][col] && qrCode.modules[row + 10][col]) {
                  lostPoint += 40;
                }
              } else if (row > 3) {
                if (qrCode.modules[row - 1][col] && qrCode.modules[row - 2][col] && qrCode.modules[row - 3][col] && qrCode.modules[row - 4][col]) {
                  lostPoint += 40;
                }
              }
            }
          }
          //level 1 评价
          if (head ^ current) {
            sameCount++;
          } else {
            head = current;
            if (sameCount >= 5) {
              lostPoint += 3 + sameCount - 5;
            }
            sameCount = 1;
          }
        }
      }
      // LEVEL4
      var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
      lostPoint += ratio * 10;
      return lostPoint;
    } };


  //---------------------------------------------------------------------
  // QRMath使用的数学工具
  //---------------------------------------------------------------------
  var QRMath = {
    /*
                 将n转化为a^m
                  */
    glog: function glog(n) {
      if (n < 1) {
        throw new Error("glog(" + n + ")");
      }
      return QRMath.LOG_TABLE[n];
    },
    /*
       将a^m转化为n
        */
    gexp: function gexp(n) {
      while (n < 0) {
        n += 255;
      }
      while (n >= 256) {
        n -= 255;
      }
      return QRMath.EXP_TABLE[n];
    },
    EXP_TABLE: new Array(256),
    LOG_TABLE: new Array(256) };


  for (var i = 0; i < 8; i++) {
    QRMath.EXP_TABLE[i] = 1 << i;
  }
  for (var i = 8; i < 256; i++) {
    QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
  }
  for (var i = 0; i < 255; i++) {
    QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;
  }
  //---------------------------------------------------------------------
  // QRPolynomial 多项式
  //---------------------------------------------------------------------
  /**
   * 多项式类
   * @param {Array} num   系数
   * @param {num} shift a^shift
   */
  function QRPolynomial(num, shift) {
    if (num.length == undefined) {
      throw new Error(num.length + "/" + shift);
    }
    var offset = 0;
    while (offset < num.length && num[offset] == 0) {
      offset++;
    }
    this.num = new Array(num.length - offset + shift);
    for (var i = 0; i < num.length - offset; i++) {
      this.num[i] = num[i + offset];
    }
  }
  QRPolynomial.prototype = {
    get: function get(index) {
      return this.num[index];
    },
    getLength: function getLength() {
      return this.num.length;
    },
    /**
        * 多项式乘法
        * @param  {QRPolynomial} e 被乘多项式
        * @return {[type]}   [description]
        */
    multiply: function multiply(e) {
      var num = new Array(this.getLength() + e.getLength() - 1);
      for (var i = 0; i < this.getLength(); i++) {
        for (var j = 0; j < e.getLength(); j++) {
          num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
        }
      }
      return new QRPolynomial(num, 0);
    },
    /**
        * 多项式模运算
        * @param  {QRPolynomial} e 模多项式
        * @return {}
        */
    mod: function mod(e) {
      var tl = this.getLength(),
      el = e.getLength();
      if (tl - el < 0) {
        return this;
      }
      var num = new Array(tl);
      for (var i = 0; i < tl; i++) {
        num[i] = this.get(i);
      }
      while (num.length >= el) {
        var ratio = QRMath.glog(num[0]) - QRMath.glog(e.get(0));

        for (var i = 0; i < e.getLength(); i++) {
          num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
        }
        while (num[0] == 0) {
          num.shift();
        }
      }
      return new QRPolynomial(num, 0);
    } };


  //---------------------------------------------------------------------
  // RS_BLOCK_TABLE
  //---------------------------------------------------------------------
  /*
  二维码各个版本信息[块数, 每块中的数据块数, 每块中的信息块数]
   */
  var RS_BLOCK_TABLE = [
  // L
  // M
  // Q
  // H
  // 1
  [1, 26, 19],
  [1, 26, 16],
  [1, 26, 13],
  [1, 26, 9],

  // 2
  [1, 44, 34],
  [1, 44, 28],
  [1, 44, 22],
  [1, 44, 16],

  // 3
  [1, 70, 55],
  [1, 70, 44],
  [2, 35, 17],
  [2, 35, 13],

  // 4
  [1, 100, 80],
  [2, 50, 32],
  [2, 50, 24],
  [4, 25, 9],

  // 5
  [1, 134, 108],
  [2, 67, 43],
  [2, 33, 15, 2, 34, 16],
  [2, 33, 11, 2, 34, 12],

  // 6
  [2, 86, 68],
  [4, 43, 27],
  [4, 43, 19],
  [4, 43, 15],

  // 7
  [2, 98, 78],
  [4, 49, 31],
  [2, 32, 14, 4, 33, 15],
  [4, 39, 13, 1, 40, 14],

  // 8
  [2, 121, 97],
  [2, 60, 38, 2, 61, 39],
  [4, 40, 18, 2, 41, 19],
  [4, 40, 14, 2, 41, 15],

  // 9
  [2, 146, 116],
  [3, 58, 36, 2, 59, 37],
  [4, 36, 16, 4, 37, 17],
  [4, 36, 12, 4, 37, 13],

  // 10
  [2, 86, 68, 2, 87, 69],
  [4, 69, 43, 1, 70, 44],
  [6, 43, 19, 2, 44, 20],
  [6, 43, 15, 2, 44, 16],

  // 11
  [4, 101, 81],
  [1, 80, 50, 4, 81, 51],
  [4, 50, 22, 4, 51, 23],
  [3, 36, 12, 8, 37, 13],

  // 12
  [2, 116, 92, 2, 117, 93],
  [6, 58, 36, 2, 59, 37],
  [4, 46, 20, 6, 47, 21],
  [7, 42, 14, 4, 43, 15],

  // 13
  [4, 133, 107],
  [8, 59, 37, 1, 60, 38],
  [8, 44, 20, 4, 45, 21],
  [12, 33, 11, 4, 34, 12],

  // 14
  [3, 145, 115, 1, 146, 116],
  [4, 64, 40, 5, 65, 41],
  [11, 36, 16, 5, 37, 17],
  [11, 36, 12, 5, 37, 13],

  // 15
  [5, 109, 87, 1, 110, 88],
  [5, 65, 41, 5, 66, 42],
  [5, 54, 24, 7, 55, 25],
  [11, 36, 12],

  // 16
  [5, 122, 98, 1, 123, 99],
  [7, 73, 45, 3, 74, 46],
  [15, 43, 19, 2, 44, 20],
  [3, 45, 15, 13, 46, 16],

  // 17
  [1, 135, 107, 5, 136, 108],
  [10, 74, 46, 1, 75, 47],
  [1, 50, 22, 15, 51, 23],
  [2, 42, 14, 17, 43, 15],

  // 18
  [5, 150, 120, 1, 151, 121],
  [9, 69, 43, 4, 70, 44],
  [17, 50, 22, 1, 51, 23],
  [2, 42, 14, 19, 43, 15],

  // 19
  [3, 141, 113, 4, 142, 114],
  [3, 70, 44, 11, 71, 45],
  [17, 47, 21, 4, 48, 22],
  [9, 39, 13, 16, 40, 14],

  // 20
  [3, 135, 107, 5, 136, 108],
  [3, 67, 41, 13, 68, 42],
  [15, 54, 24, 5, 55, 25],
  [15, 43, 15, 10, 44, 16],

  // 21
  [4, 144, 116, 4, 145, 117],
  [17, 68, 42],
  [17, 50, 22, 6, 51, 23],
  [19, 46, 16, 6, 47, 17],

  // 22
  [2, 139, 111, 7, 140, 112],
  [17, 74, 46],
  [7, 54, 24, 16, 55, 25],
  [34, 37, 13],

  // 23
  [4, 151, 121, 5, 152, 122],
  [4, 75, 47, 14, 76, 48],
  [11, 54, 24, 14, 55, 25],
  [16, 45, 15, 14, 46, 16],

  // 24
  [6, 147, 117, 4, 148, 118],
  [6, 73, 45, 14, 74, 46],
  [11, 54, 24, 16, 55, 25],
  [30, 46, 16, 2, 47, 17],

  // 25
  [8, 132, 106, 4, 133, 107],
  [8, 75, 47, 13, 76, 48],
  [7, 54, 24, 22, 55, 25],
  [22, 45, 15, 13, 46, 16],

  // 26
  [10, 142, 114, 2, 143, 115],
  [19, 74, 46, 4, 75, 47],
  [28, 50, 22, 6, 51, 23],
  [33, 46, 16, 4, 47, 17],

  // 27
  [8, 152, 122, 4, 153, 123],
  [22, 73, 45, 3, 74, 46],
  [8, 53, 23, 26, 54, 24],
  [12, 45, 15, 28, 46, 16],

  // 28
  [3, 147, 117, 10, 148, 118],
  [3, 73, 45, 23, 74, 46],
  [4, 54, 24, 31, 55, 25],
  [11, 45, 15, 31, 46, 16],

  // 29
  [7, 146, 116, 7, 147, 117],
  [21, 73, 45, 7, 74, 46],
  [1, 53, 23, 37, 54, 24],
  [19, 45, 15, 26, 46, 16],

  // 30
  [5, 145, 115, 10, 146, 116],
  [19, 75, 47, 10, 76, 48],
  [15, 54, 24, 25, 55, 25],
  [23, 45, 15, 25, 46, 16],

  // 31
  [13, 145, 115, 3, 146, 116],
  [2, 74, 46, 29, 75, 47],
  [42, 54, 24, 1, 55, 25],
  [23, 45, 15, 28, 46, 16],

  // 32
  [17, 145, 115],
  [10, 74, 46, 23, 75, 47],
  [10, 54, 24, 35, 55, 25],
  [19, 45, 15, 35, 46, 16],

  // 33
  [17, 145, 115, 1, 146, 116],
  [14, 74, 46, 21, 75, 47],
  [29, 54, 24, 19, 55, 25],
  [11, 45, 15, 46, 46, 16],

  // 34
  [13, 145, 115, 6, 146, 116],
  [14, 74, 46, 23, 75, 47],
  [44, 54, 24, 7, 55, 25],
  [59, 46, 16, 1, 47, 17],

  // 35
  [12, 151, 121, 7, 152, 122],
  [12, 75, 47, 26, 76, 48],
  [39, 54, 24, 14, 55, 25],
  [22, 45, 15, 41, 46, 16],

  // 36
  [6, 151, 121, 14, 152, 122],
  [6, 75, 47, 34, 76, 48],
  [46, 54, 24, 10, 55, 25],
  [2, 45, 15, 64, 46, 16],

  // 37
  [17, 152, 122, 4, 153, 123],
  [29, 74, 46, 14, 75, 47],
  [49, 54, 24, 10, 55, 25],
  [24, 45, 15, 46, 46, 16],

  // 38
  [4, 152, 122, 18, 153, 123],
  [13, 74, 46, 32, 75, 47],
  [48, 54, 24, 14, 55, 25],
  [42, 45, 15, 32, 46, 16],

  // 39
  [20, 147, 117, 4, 148, 118],
  [40, 75, 47, 7, 76, 48],
  [43, 54, 24, 22, 55, 25],
  [10, 45, 15, 67, 46, 16],

  // 40
  [19, 148, 118, 6, 149, 119],
  [18, 75, 47, 31, 76, 48],
  [34, 54, 24, 34, 55, 25],
  [20, 45, 15, 61, 46, 16]];


  /**
                              * 根据数据获取对应版本
                              * @return {[type]} [description]
                              */
  QRCodeAlg.prototype.getRightType = function () {
    for (var typeNumber = 1; typeNumber < 41; typeNumber++) {
      var rsBlock = RS_BLOCK_TABLE[(typeNumber - 1) * 4 + this.errorCorrectLevel];
      if (rsBlock == undefined) {
        throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + this.errorCorrectLevel);
      }
      var length = rsBlock.length / 3;
      var totalDataCount = 0;
      for (var i = 0; i < length; i++) {
        var count = rsBlock[i * 3 + 0];
        var dataCount = rsBlock[i * 3 + 2];
        totalDataCount += dataCount * count;
      }
      var lengthBytes = typeNumber > 9 ? 2 : 1;
      if (this.utf8bytes.length + lengthBytes < totalDataCount || typeNumber == 40) {
        this.typeNumber = typeNumber;
        this.rsBlock = rsBlock;
        this.totalDataCount = totalDataCount;
        break;
      }
    }
  };

  //---------------------------------------------------------------------
  // QRBitBuffer
  //---------------------------------------------------------------------
  function QRBitBuffer() {
    this.buffer = new Array();
    this.length = 0;
  }
  QRBitBuffer.prototype = {
    get: function get(index) {
      var bufIndex = Math.floor(index / 8);
      return this.buffer[bufIndex] >>> 7 - index % 8 & 1;
    },
    put: function put(num, length) {
      for (var i = 0; i < length; i++) {
        this.putBit(num >>> length - i - 1 & 1);
      }
    },
    putBit: function putBit(bit) {
      var bufIndex = Math.floor(this.length / 8);
      if (this.buffer.length <= bufIndex) {
        this.buffer.push(0);
      }
      if (bit) {
        this.buffer[bufIndex] |= 0x80 >>> this.length % 8;
      }
      this.length++;
    } };




  // xzedit
  var qrcodeAlgObjCache = [];
  /**
                               * 二维码构造函数，主要用于绘制
                               * @param  {参数列表} opt 传递参数
                               * @return {}
                               */
  QRCode = function QRCode(opt) {
    //设置默认参数
    this.options = {
      text: '',
      size: 256,
      correctLevel: 3,
      background: '#ffffff',
      foreground: '#000000',
      pdground: '#000000',
      image: '',
      imageSize: 30,
      canvasId: '_myQrCodeCanvas',
      context: opt.context,
      usingComponents: opt.usingComponents,
      showLoading: opt.showLoading,
      loadingText: opt.loadingText };

    if (typeof opt === 'string') {// 只编码ASCII字符串
      opt = {
        text: opt };

    }
    if (opt) {
      for (var i in opt) {
        this.options[i] = opt[i];
      }
    }
    //使用QRCodeAlg创建二维码结构
    var qrCodeAlg = null;
    for (var i = 0, l = qrcodeAlgObjCache.length; i < l; i++) {
      if (qrcodeAlgObjCache[i].text == this.options.text && qrcodeAlgObjCache[i].text.correctLevel == this.options.correctLevel) {
        qrCodeAlg = qrcodeAlgObjCache[i].obj;
        break;
      }
    }
    if (i == l) {
      qrCodeAlg = new QRCodeAlg(this.options.text, this.options.correctLevel);
      qrcodeAlgObjCache.push({
        text: this.options.text,
        correctLevel: this.options.correctLevel,
        obj: qrCodeAlg });

    }
    /**
       * 计算矩阵点的前景色
       * @param {Obj} config
       * @param {Number} config.row 点x坐标
       * @param {Number} config.col 点y坐标
       * @param {Number} config.count 矩阵大小
       * @param {Number} config.options 组件的options
       * @return {String}
       */
    var getForeGround = function getForeGround(config) {
      var options = config.options;
      if (options.pdground && (
      config.row > 1 && config.row < 5 && config.col > 1 && config.col < 5 ||
      config.row > config.count - 6 && config.row < config.count - 2 && config.col > 1 && config.col < 5 ||
      config.row > 1 && config.row < 5 && config.col > config.count - 6 && config.col < config.count - 2))
      {
        return options.pdground;
      }
      return options.foreground;
    };
    // 创建canvas
    var createCanvas = function createCanvas(options) {
      if (options.showLoading) {
        uni.showLoading({
          title: options.loadingText,
          mask: true });

      }
      var ctx = uni.createCanvasContext(options.canvasId, options.context);
      var count = qrCodeAlg.getModuleCount();
      var ratioSize = options.size;
      var ratioImgSize = options.imageSize;
      //计算每个点的长宽
      var tileW = (ratioSize / count).toPrecision(4);
      var tileH = (ratioSize / count).toPrecision(4);
      //绘制
      for (var row = 0; row < count; row++) {
        for (var col = 0; col < count; col++) {
          var w = Math.ceil((col + 1) * tileW) - Math.floor(col * tileW);
          var h = Math.ceil((row + 1) * tileW) - Math.floor(row * tileW);
          var foreground = getForeGround({
            row: row,
            col: col,
            count: count,
            options: options });

          ctx.setFillStyle(qrCodeAlg.modules[row][col] ? foreground : options.background);
          ctx.fillRect(Math.round(col * tileW), Math.round(row * tileH), w, h);
        }
      }
      if (options.image) {




        // 画圆角矩形
        var drawRoundedRect = function drawRoundedRect(ctxi, x, y, width, height, r, lineWidth, fill, stroke) {
          ctxi.setLineWidth(lineWidth);
          ctxi.setFillStyle(options.background);
          ctxi.setStrokeStyle(options.background);
          ctxi.beginPath(); // draw top and top right corner 
          ctxi.moveTo(x + r, y);
          ctxi.arcTo(x + width, y, x + width, y + r, r); // draw right side and bottom right corner 
          ctxi.arcTo(x + width, y + height, x + width - r, y + height, r); // draw bottom and bottom left corner 
          ctxi.arcTo(x, y + height, x, y + height - r, r); // draw left and top left corner 
          ctxi.arcTo(x, y, x + r, y, r);
          ctxi.closePath();
          if (fill) {
            ctxi.fill();
          }
          if (stroke) {
            ctxi.stroke();
          }
        };var x = Number(((ratioSize - ratioImgSize) / 2).toFixed(2));var y = Number(((ratioSize - ratioImgSize) / 2).toFixed(2));drawRoundedRect(ctx, x, y, ratioImgSize, ratioImgSize, 2, 6, true, true);ctx.drawImage(options.image, x, y, ratioImgSize, ratioImgSize);
      }
      setTimeout(function () {
        ctx.draw(true, function () {
          // 保存到临时区域
          setTimeout(function () {
            uni.canvasToTempFilePath({
              width: options.width,
              height: options.height,
              destWidth: options.width,
              destHeight: options.height,
              canvasId: options.canvasId,
              quality: Number(1),
              success: function success(res) {
                if (options.cbResult) {
                  // 由于官方还没有统一此接口的输出字段，所以先判定下  支付宝为 res.apFilePath
                  if (!empty(res.tempFilePath)) {
                    options.cbResult(res.tempFilePath);
                  } else if (!empty(res.apFilePath)) {
                    options.cbResult(res.apFilePath);
                  } else {
                    options.cbResult(res.tempFilePath);
                  }
                }
              },
              fail: function fail(res) {
                if (options.cbResult) {
                  options.cbResult(res);
                }
              },
              complete: function complete() {
                //uni.hideLoading();
              } },
            options.context);
          }, options.text.length + 100);
        });
      }, options.usingComponents ? 0 : 150);
    };
    createCanvas(this.options);
    // 空判定
    var empty = function empty(v) {
      var tp = typeof v,
      rt = false;
      if (tp == "number" && String(v) == "") {
        rt = true;
      } else if (tp == "undefined") {
        rt = true;
      } else if (tp == "object") {
        if (JSON.stringify(v) == "{}" || JSON.stringify(v) == "[]" || v == null) rt = true;
      } else if (tp == "string") {
        if (v == "" || v == "undefined" || v == "null" || v == "{}" || v == "[]") rt = true;
      } else if (tp == "function") {
        rt = false;
      }
      return rt;
    };
  };
  QRCode.prototype.clear = function (fn) {
    var ctx = uni.createCanvasContext(this.options.canvasId, this.options.context);
    ctx.clearRect(0, 0, this.options.size, this.options.size);
    ctx.draw(false, function () {
      if (fn) {
        fn();
      }
    });
  };
})();var _default =

QRCode;exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 6:
/*!******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/package.json ***!
  \******************************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, deprecated, description, devDependencies, files, gitHead, homepage, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"@dcloudio/uni-stat@next","_id":"@dcloudio/uni-stat@2.0.0-23720191024001","_inBundle":false,"_integrity":"sha512-vJEk493Vdb8KueNzR2otzDi23rfyRcQBo/t1R41MwNGPk+AUB94gh10+HVLo98DRcvMzkuVofz3KXTAfEx24iw==","_location":"/@dcloudio/uni-stat","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"@dcloudio/uni-stat@next","name":"@dcloudio/uni-stat","escapedName":"@dcloudio%2funi-stat","scope":"@dcloudio","rawSpec":"next","saveSpec":null,"fetchSpec":"next"},"_requiredBy":["#USER","/","/@dcloudio/vue-cli-plugin-uni"],"_resolved":"https://registry.npmjs.org/@dcloudio/uni-stat/-/uni-stat-2.0.0-23720191024001.tgz","_shasum":"18272814446a9bc6053bc92666ec7064a1767588","_spec":"@dcloudio/uni-stat@next","_where":"/Users/fxy/Documents/DCloud/HbuilderX-plugins/release/uniapp-cli","author":"","bugs":{"url":"https://github.com/dcloudio/uni-app/issues"},"bundleDependencies":false,"deprecated":false,"description":"","devDependencies":{"@babel/core":"^7.5.5","@babel/preset-env":"^7.5.5","eslint":"^6.1.0","rollup":"^1.19.3","rollup-plugin-babel":"^4.3.3","rollup-plugin-clear":"^2.0.7","rollup-plugin-commonjs":"^10.0.2","rollup-plugin-copy":"^3.1.0","rollup-plugin-eslint":"^7.0.0","rollup-plugin-json":"^4.0.0","rollup-plugin-node-resolve":"^5.2.0","rollup-plugin-replace":"^2.2.0","rollup-plugin-uglify":"^6.0.2"},"files":["dist","package.json","LICENSE"],"gitHead":"a725c04ef762e5df78a9a69d140c2666e0de05fc","homepage":"https://github.com/dcloudio/uni-app#readme","license":"Apache-2.0","main":"dist/index.js","name":"@dcloudio/uni-stat","repository":{"type":"git","url":"git+https://github.com/dcloudio/uni-app.git","directory":"packages/uni-stat"},"scripts":{"build":"NODE_ENV=production rollup -c rollup.config.js","dev":"NODE_ENV=development rollup -w -c rollup.config.js"},"version":"2.0.0-23720191024001"};

/***/ }),

/***/ 7:
/*!******************************************************************!*\
  !*** C:/Users/Admin/Desktop/evc.app/pages.json?{"type":"style"} ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "pages": { "pages/wallet/wallet": { "navigationBarTitleText": "钱包", "enablePullDownRefresh": true }, "pages/wallet/create": { "navigationBarTitleText": "创建钱包" }, "pages/wallet/backupMnemonic1": { "navigationBarTitleText": "备份助记词" }, "pages/wallet/backupMnemonic": { "navigationBarTitleText": "备份助记词" }, "pages/wallet/import": { "navigationBarTitleText": "助记词导入" }, "pages/wallet/resetPin": { "navigationBarTitleText": "重置PIN码" }, "pages/wallet/backup": { "navigationBarTitleText": "管理" }, "pages/wallet/manage": { "navigationBarTitleText": "钱包管理" }, "pages/user/user": { "navigationBarTextStyle": "white", "navigationBarTitleText": "我的" }, "pages/message/message": { "navigationBarTitleText": "消息中心" }, "pages/message/detail": { "navigationBarTitleText": "详情" }, "pages/coin/detail": { "navigationBarTitleText": "USDT" }, "pages/coin/charge": { "navigationBarTitleText": "收款" }, "pages/coin/transfer": { "navigationBarTitleText": "转账" }, "pages/coin/transferDetail": { "navigationBarTitleText": "记录详情" }, "pages/market/market": { "navigationBarTitleText": "行情", "enablePullDownRefresh": true }, "pages/dapp/dapp": { "navigationBarTitleText": "DAPP" }, "pages/pagesB/login/login": { "navigationBarTitleText": "登录" }, "pages/pagesB/login/register": { "navigationBarTitleText": "邮箱注册" }, "pages/pagesB/login/setPassword": { "navigationBarTitleText": "设置密码" }, "pages/pagesB/index/index": { "navigationBarTextStyle": "white", "enablePullDownRefresh": true, "navigationBarTitleText": "首页" }, "pages/pagesB/index/product-detail": { "navigationBarTitleText": "产品详情" }, "pages/pagesB/index/noticeDetail": { "navigationBarTitleText": "公告详情" }, "pages/pagesB/login/forgetPassword": { "navigationBarTitleText": "忘记密码" }, "pages/pagesB/login/resetPassword": { "navigationBarTitleText": "重置密码" }, "pages/pagesB/index/buy": { "navigationBarTitleText": "购买" }, "pages/pagesB/index/myad": { "navigationBarTitleText": "我的广告包" }, "pages/pagesB/index/profit": { "navigationBarTitleText": "收益账户" }, "pages/pagesB/index/detail": { "navigationBarTitleText": "详情" }, "pages/pagesB/personal/invite": { "navigationBarTitleText": "邀请好友" }, "pages/pagesB/wallet/wallet": { "navigationBarTitleText": "钱包" }, "pages/pagesB/wallet/transfer-num": { "navigationBarTitleText": "转账" }, "pages/pagesB/wallet/receivables-qrcode": { "navigationBarTitleText": "收款" }, "pages/pagesB/wallet/charging-record": { "navigationBarTitleText": "充提记录" }, "pages/pagesB/wallet/record-details": { "navigationBarTitleText": "记录详情" }, "pages/pagesB/wallet/currency-detail": { "navigationBarTitleText": "币种详情" }, "pages/pagesB/wallet/recharge-record": { "navigationBarTitleText": "充提记录" }, "pages/pagesB/my/my-team": { "navigationBarTitleText": "我的团队" }, "pages/pagesB/personal/personal": { "navigationBarTitleText": "个人中心", "titleNView": { "type": "default", "titleColor": "#333333", "backgroundColor": "#fff", "titleSize": "36rpx", "buttons": [{ "text": "EVC", "fontSrc": "/static/font/iconfont.ttf", "fontSize": "13px", "float": "left" }] } }, "pages/pagesB/personal/examine": { "navigationBarTitleText": "" }, "pages/pagesB/personal/aboutus": { "navigationBarTitleText": "关于我们" }, "pages/pagesB/personal/userform": { "navigationBarTitleText": "用户协议" }, "pages/pagesB/personal/unsealing": { "navigationBarTitleText": "账号解封" }, "pages/pagesB/personal/problem": { "navigationBarTitleText": "常见问题" }, "pages/pagesB/personal/real-name": { "navigationBarTitleText": "实名认证" }, "pages/pagesB/personal/set-password": { "navigationBarTitleText": "修改登录密码" }, "pages/pagesB/personal/set-paypassword": { "navigationBarTitleText": "修改交易密码" }, "pages/pagesB/personal/forget-pay-password": { "navigationBarTitleText": "忘记交易密码" }, "pages/pagesB/personal/self-in": { "navigationBarTitleText": "安全中心" }, "pages/pagesB/personal/real-photo": { "navigationBarTitleText": "实名认证" }, "pages/pagesB/personal/personal-info": { "navigationBarTitleText": "个人信息" }, "pages/pagesB/personal/set-nickname": { "navigationBarTitleText": "设置昵称" }, "pages/pagesB/personal/my-bill": { "navigationBarTitleText": "我的账单" }, "pages/pagesB/personal/recorde-detail": { "navigationBarTitleText": "记录详情" }, "pages/pagesB/personal/resetPayPassword": { "navigationBarTitleText": "忘记交易密码" }, "pages/pagesB/personal/binding-phone": { "navigationBarTitleText": "绑定手机" }, "pages/dapp/text-detail": { "navigationBarTitleText": "正文详情" }, "pages/dapp/public-notification": { "navigationBarTitleText": "公告" }, "pages/dapp/public-detail": { "navigationBarTitleText": "详情" }, "pages/pagesB/quotation/quotation": { "navigationBarTitleText": "行情" }, "pages/forget/privatekey": { "navigationBarTitleText": "忘记密码" }, "pages/forget/pwd": { "navigationBarTitleText": "重置密码" }, "pages/export/mnemonic": { "navigationBarTitleText": "导出助记词" }, "pages/export/privatekey": { "navigationBarTitleText": "导出私钥" }, "pages/question/question": { "navigationBarTitleText": "常见问题" }, "pages/question/answer": { "navigationBarTitleText": "问题解答" } }, "globalStyle": { "navigationBarTextStyle": "black", "navigationBarTitleText": "EVC", "navigationBarBackgroundColor": "#FFFFFF", "backgroundColor": "#FFFFFF" } };exports.default = _default;

/***/ }),

/***/ 8:
/*!*****************************************************************!*\
  !*** C:/Users/Admin/Desktop/evc.app/pages.json?{"type":"stat"} ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "appid": "__UNI__A1A6FE1" };exports.default = _default;

/***/ })

}]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map