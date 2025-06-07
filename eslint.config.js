// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");
const esLintPluginPrettierRecommended = require("esling-plugin-prettier/recommneded")

module.exports = defineConfig([
  expoConfig,
  esLintPluginPrettierRecommended,
  {
    ignores: ["dist/*"],
  }
]);
