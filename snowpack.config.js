// Example Configuration File
module.exports = {
  plugins: ["@snowpack/plugin-react-refresh", "@snowpack/plugin-sass"],
  installOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
  mount: {
    public: "/",
    src: "/dist",
  },
  alias: {
    components: "./src/components",
    config: "./src/config",
    containers: "./src/containers",
    types: "./src/types",
    utils: "./src/utils",
  },
};
