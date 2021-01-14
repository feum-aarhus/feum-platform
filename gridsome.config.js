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
  siteName: "FEUM",
  siteUrl: "https://feum-ticketing.dk",
  siteDescription: "We love electronic music!",
  titleTemplate: "%s | FEUM",
  favicon: "./src/favicon.jpg",
  chainWebpack(config) {
    // config.resolve.alias.set('@images', '@/assets/uploads');
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
        path: "_events/*.md",
        typeName: "events",
      },
    },
    {
      use: "@gridsome/source-filesystem",
      options: {
        path: "_music/*.md",
        typeName: "music",
      },
    },
  ],
  transformers: {
    remark: {
      // global remark options
    },
  },
};
