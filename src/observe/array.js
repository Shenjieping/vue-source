let oldArrayMethods = Array.prototype; // 获取数组原型上的方法
// 创建一个全新的对象，可以找到数组原型上的方法，而且修改对象时，不会影响原来对象上的方法
export let arrayMethods = Object.create(oldArrayMethods);

let methods = [ // 这7个方法都会改变原数组
  'push',
  'pop',
  'shift',
  'unshift',
  'short',
  'reverse',
  'splice'
];

methods.forEach(method => {
  arrayMethods[method] = function(...args) { // 函数劫持，AOP的思想
    // 当用户调用数组的方法时，会先调用我的逻辑，在调用数组本身的逻辑
    const ob = this.__ob__;
    let result = oldArrayMethods[method].apply(this, args);
    // 特殊处理，push unshift splice 都可以像数组新增属性（新增的属性可能是一个对象）
    // 内部还对数组中的引用类型也做了一次劫持
    let inserted = [];
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice': // 可以增、删、改 从第三个参数开始才是新增的属性
        inserted = args.slice(2);
        break;
      default:
        break;
    }
    inserted && ob.observeArray(inserted); // 新增的属性也需要去调用此方法监听更改。那么这是两个文件，如何才能拿到上一个文件的此方法呢？？
    return result;
  }
});