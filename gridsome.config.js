const path = require("path");

function addStyleResource(rule) {
  rule
    .use("style-resource")
    .loader("style-resources-loader")
    .options({
      patterns: [path.resolve(__dirname, "./src/assets/style.scss")],
    });
}

module.exports = {
  chainWebpack(config) {
    // Load variables for all vue-files
    const types = ["vue-modules", "vue", "normal-modules", "normal"];

    types.forEach((type) => {
      addStyleResource(config.module.rule("scss").oneOf(type));
    });
  },
  plugins: [
    {
      use: "@gridsome/source-filesystem",
      options: {
        path: "_pages/**/*.md",
        typeName: "page",
      },
    },
  ],
  transformers: {
    remark: {
      // global remark options
    },
  },
};
