require("@babel/register"); // this is required to write es6 style code here

import path from "path";
import webpack from "webpack";
import merge from "webpack-merge";
import HtmlWebpackPlugin from "html-webpack-plugin";

const resolveRoot = (...args) => path.join(__dirname, ...args);
const resolveSrc = () => resolveRoot("src");
const isDev = process.env.NODE_ENV || "development";

const config = {
  entry: resolveSrc(),
  output: {
    path: resolveRoot("public"),
    filename: "js/bundle-[hash].js",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: resolveSrc(),
        exclude: resolveRoot("node_modules"),
        use: "babel-loader",
      },
      {
        test: /\.s?css$/,
        include: resolveSrc(),
        exclude: resolveRoot("node_modules"),
        use: ["style-loader", "css-loader", "sass-loader", "postcss-loader"],
      },
    ],
  },

  resolve: {
    modules: ["node_modules", resolveSrc()],
    extensions: [".js", ".jsx", ".json", ".css", "./scss"],
    alias: {
      "react-dom": "@hot-loader/react-dom", // this is for a hook support, replace with fast-refresh once webpack supports it
      src: resolveSrc(),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: resolveRoot("public", "index.html"),
    }),
  ],
};

const dev = merge(config, {
  devtool: "cheap-module-inline-source-map",
  mode: "development",
  devServer: {
    proxy: {
      // backend port should be the one that is running inside the container, not the one that is exposed
      "/api": "http://backend:5000",
    },
    contentBase: resolveRoot("public"),
    host: "0.0.0.0",
    port: 3000,
    historyApiFallback: true,
    disableHostCheck: true,
    hot: true,
    compress: true,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
});

const prod = merge(config, {
  devtool: "source-map",
  mode: "production",
});

console.log("Application is running on port 3000");
console.log(`Env: ${process.env.NODE_ENV}`);

export default isDev ? dev : prod;
