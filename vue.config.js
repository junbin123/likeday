const { original } = JSON.parse(process.env.npm_config_argv)
if (original[2]) {
  process.env.VUE_APP_ENV = original[2].slice(1)
}
