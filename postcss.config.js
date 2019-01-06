module.exports = {
  // parser: 'sugarss', // 一种更简洁的css语法格式
  loader: 'postcss-loader',
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {},
    'cssnano': {},
    'postcss-flexbugs-fixes': {},
  }
}