import { initState } from './state.js'
export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    // $options
    const vm = this;
    vm.$options = options; // 用户传入的参数

    initState(vm) // 初始化状态
  }
}