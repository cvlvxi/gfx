const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    math: "./src/main.ts",
    fun: "./fundamentals/fun.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
  },
  output: {
    path: `${__dirname}/dist`,
    filename: "[name].js",
  },
};
