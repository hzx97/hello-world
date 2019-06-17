module.exports = {

  // 下面这个成员就是不同类型的文件的解析加载规则
  module: {
    rules: [
      // 配置less解析
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'less-loader'
        }]
      },
      // 配置scss解析
      {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'sass-loader'
        }]
      }
      // 添加图片和图标的配置

    ]
  }

}
