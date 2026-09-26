import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "npm-packages/**",
      "skill-packages/**",
      "reports/**",
      "skills/**",
      "localized/**",
    ],
  },
  {
    files: [
      "bin/**/*.ts",
      "src/**/*.ts",
      "scripts/**/*.ts",
      "scripts/**/*.mjs",
      "tests/**/*.ts",
      "eslint.config.mjs",
    ],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { globals: globals.node },
    rules: {
      "no-empty": ["error", { allowEmptyCatch: true }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
);
