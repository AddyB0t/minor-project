module.exports = {
  presets: [
    [
      'babel-preset-expo',
      {
        jsxRuntime: 'automatic',
      },
    ],
  ],
  plugins: [
    ["module:react-native-dotenv", {
      "envName": "APP_ENV",
      "moduleName": "@env"
    }]
  ],
};