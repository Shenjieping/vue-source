(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function isObject(obj) {
    return _typeof(obj) === 'object' && obj !== null;
  }

  var oldArrayMethods = Array.prototype; // 获取数组原型上的方法
  // 创建一个全新的对象，可以找到数组原型上的方法，而且修改对象时，不会影响原来对象上的方法

  var arrayMethods = Object.create(oldArrayMethods);
  var methods = [// 这7个方法都会改变原数组
  'push', 'pop', 'shift', 'unshift', 'short', 'reverse', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      // 函数劫持，AOP的思想
      // 当用户调用数组的方法时，会先调用我的逻辑，在调用数组本身的逻辑
      var ob = this.__ob__;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayMethods[method].apply(this, args); // 特殊处理，push unshift splice 都可以像数组新增属性（新增的属性可能是一个对象）
      // 内部还对数组中的引用类型也做了一次劫持

      var inserted = [];

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          // 可以增、删、改 从第三个参数开始才是新增的属性
          inserted = args.slice(2);
          break;
      }

      inserted && ob.observeArray(inserted); // 新增的属性也需要去调用此方法监听更改。那么这是两个文件，如何才能拿到上一个文件的此方法呢？？

      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      // 要想在array.js 中调用observeArray方法，在data增加一个属性
      Object.defineProperty(data, '__ob__', {
        // 是一个响应式的标识
        enumerable: false,
        // 设置不可枚举，就不能被Object.keys使用
        configurable: false,
        value: this
      }); // data.__ob__ = this; // 相当于在数据上可以获取__ob__ 这个属性，就可以获取到Observer实例 // 直接这样写会出现无限递归
      // 对数组索引拦截，性能差，直接更改索引的情况比较少

      if (Array.isArray(data)) {
        // vue 中数组主要是用的重写数组的方法，将数组的方法进行包装
        // 函数劫持，改变数组本身的方法就可以监听到了
        data.__proto__ = arrayMethods; // 通过原型链向上查找的方式
        // 可能会有 arr: [{a: 1}] => arr[0].a = 100; 这种也能被监听

        this.observeArray(data);
      } else {
        this.walk(data); // 可以对数据一步一步的处理
      }
    }

    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(data) {
        for (var i = 0; i < data.length; i++) {
          observe(data[i]);
        }
      }
    }, {
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    observe(value); // 深度监听

    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        observe(newValue); // 如果设置的值也是个对象，也要进行观测

        value = newValue;
      }
    });
  }

  function observe(data) {
    // 对象就是使用 Object.defineProperty 来观测数据
    if (!isObject(data)) {
      return data;
    }

    if (data.__ob__ instanceof Observer) {
      // 防止对象被重复观测
      return data;
    } // 对数据进行观测


    return new Observer(data); // 可以看到当前数据是否有被观测过
  }

  function initState(vm) {
    var options = vm.$options; // 根据不同的属性。进行不同的初始化

    if (options.props) ;

    if (options.methods) ;

    if (options.data) {
      initData(vm);
    }
  }

  function initData(vm) {
    var data = vm.$options.data; // 拿到用户传入的data数据

    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 给所有的属性增加get/set

    observe(data); // 观测整个数据
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // $options
      var vm = this;
      vm.$options = options; // 用户传入的参数

      initState(vm); // 初始化状态
    };
  }

  function Vue(options) {
    // 内部进行初始化
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
