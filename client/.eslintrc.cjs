module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "eslint-config-prettier",
    "prettier",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs", "vite.config.ts"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "prettier"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      {
        allowConstantExport: true,
        semi: false, // dấu chấm phẩy cuối dòng
        trailingComma: "none", //No trailing commas
        tabWidth: 2, // Specify the number of spaces per indentation-level
        endOfLine: "auto", //Maintaining existing line endings
        useTabs: false, //Indent lines with tabs instead of spaces
        singleQuote: true, //Use single quotes instead of double quotes
        printWidth: 120, //Specify the line length that the printer will wrap on
        jsxSingleQuote: true, // Use single quotes instead of double quotes in JSX
      },
    ],
  },
};
