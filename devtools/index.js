if (process.env.NODE_ENV === "production") {
  module.exports = {
    VueQueryDevTools: function () {
      return null;
    },
    VueQueryDevToolsPanel: function () {
      return null;
    },
  };
} else {
  module.exports = require("../lib/devtools-bundle");
}
