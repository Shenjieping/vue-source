import { isObject } from './../util.js';
import { arrayMethods } from './array.js'
class Observer {
  constructor(data) {
    // 要想在array.js 中调用observeArray方法，在data增加一个属性
    Object.defineProperty(data, '__ob__', { // 是一个响应式的标识
      enumerable: false, // 设置不可枚举，就不能被Object.keys使用
      configurable: false,
      value: this
    });
    // data.__ob__ = this; // 相当于在数据上可以获取__ob__ 这个属性，就可以获取到Observer实例 // 直接这样写会出现无限递归
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
  observeArray (data) {
    for (let i = 0; i < data.length; i++) {
      observe(data[i]);
    }
  }
  walk (data) {
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key]);
    })
  }
}

function defineReactive(data, key, value) {
  observe(value); // 深度监听
  Object.defineProperty(data, key, {
    get() {
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      observe(newValue); // 如果设置的值也是个对象，也要进行观测
      value = newValue; 
    }
  })
}
export function observe(data) {
  // 对象就是使用 Object.defineProperty 来观测数据
  if(!isObject(data)) {
    return data;
  }
  if (data.__ob__ instanceof Observer) { // 防止对象被重复观测
    return data;
  }
  // 对数据进行观测
  return new Observer(data); // 可以看到当前数据是否有被观测过
}
