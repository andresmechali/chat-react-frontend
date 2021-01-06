// Example Configuration File
module.exports = {
  plugins: [
    "@snowpack/plugin-react-refresh",
    "@snowpack/plugin-sass",
    "@snowpack/plugin-dotenv",
  ],
  installOptions: {
    /* ... */
  },
  devOptions: {
    port: 3000,
    /* ... */
  },
  buildOptions: {
    baseUrl: "/chat-react-frontend",
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
