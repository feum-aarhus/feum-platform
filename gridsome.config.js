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
  siteName: "FEUM",
  siteUrl: "https://feum-ticketing.dk",
  siteDescription: "We love electronic music!",
  titleTemplate: "%s | FEUM",
  templates: {
    events: [
      {
        path: (node) => {
          return `/event/${node.id}`;
        },
        component: "./src/templates/Event.vue",
      },
    ],
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
      config: {
        footnotes: true,
      },
    },
  },
};
