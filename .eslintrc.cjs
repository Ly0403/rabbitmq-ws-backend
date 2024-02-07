/* eslint-env node */
module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  rules: {
    semi: ["off", "always"],
    quotes: ["off", "double"],
    "object-curly-spacing": ["off", "double"],
  },
};
