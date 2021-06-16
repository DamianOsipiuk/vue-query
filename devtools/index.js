if (process.env.NODE_ENV !== "development") {
  module.exports = {
    VueQueryDevTools: function () {
      return null;
    },
    VueQueryDevToolsPanel: function () {
      return null;
    },
    VUE_QUERY_DEVTOOLS_THEME: "",
  };
} else {
  module.exports = require("./dev");
}
