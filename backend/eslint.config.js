import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ["**/node_modules/**", "dist/**"],
  },
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  {
    languageOptions: { globals: globals.node },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-unreachable": "error",
      "no-empty-function": "warn",
      "require-await": "warn",
    },
  },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
