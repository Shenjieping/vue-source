import { observe } from './observe/index.js';
export function initState(vm) {
  const options = vm.$options;
  // 根据不同的属性。进行不同的初始化
  if (options.props) {
    initProps(vm);
  }
  if (options.methods) {
    initMethod(vm);
  }
  if (options.data) {
    initData(vm);
  }
}

function initProps(vm) { }
function initMethod(vm) { }
function initData(vm) {
  let data = vm.$options.data;
  // 拿到用户传入的data数据
  data = vm._data = typeof data === 'function' ? data.call(vm) : data;
  // 给所有的属性增加get/set
  observe(data); // 观测整个数据
}