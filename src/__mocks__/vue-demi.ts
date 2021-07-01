// Hide annoying console warnings for Vue2
import Vue from "vue2";
Vue.config.productionTip = false;
Vue.config.devtools = false;

const vue = jest.requireActual("vue-demi");

module.exports = {
  ...vue,
  inject: jest.fn(),
  provide: jest.fn(),
  onUnmounted: jest.fn(),
  getCurrentInstance: jest.fn(() => ({ proxy: {} })),
};
