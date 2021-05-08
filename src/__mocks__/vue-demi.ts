const vue = jest.requireActual("vue-demi");

module.exports = {
  ...vue,
  inject: jest.fn(),
  onUnmounted: jest.fn(),
  getCurrentInstance: jest.fn(),
};
