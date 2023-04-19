module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["@react-native-community", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
  rules: {
    printWidth: 150,
  },
}
