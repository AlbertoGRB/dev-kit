module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    // react-native-reanimated/plugin DEVE ser o último
    plugins: ['react-native-reanimated/plugin'],
  };
};
