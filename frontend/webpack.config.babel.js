require("@babel/register"); // this is required to write es6 style code here

import path from "path";
import webpack from "webpack";
import merge from "webpack-merge";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TerserWebpackPlugin from "terser-webpack-plugin";
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";

const resolveRoot = (...args) => path.join(__dirname, ...args);
const resolveSrc = () => resolveRoot("src");
const env = process.env.NODE_ENV || "production";

const config = {
  entry: resolveSrc(),
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: resolveSrc(),
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.s[ac]ss$/,
        include: resolveSrc(),
        exclude: /node_modules/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          { loader: "css-loader", options: { importLoaders: 1 } },
          "postcss-loader",
        ],
      },
    ],
  },

  resolve: {
    modules: ["node_modules", resolveSrc()],
    extensions: [".js", ".jsx", ".json", ".css", ".scss"],
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
    new webpack.DefinePlugin({
      APP_CONFIG: JSON.stringify({
        SOCKET_URL: process.env.SOCKET_URL,
        NODE_ENV: process.env.NODE_ENV
      })
    })
  ],
};

const dev = merge(config, {
  output: {
    path: resolveRoot("public"),
    filename: "js/[name].[hash].js",
    publicPath: "/",
  },
  devtool: "cheap-module-inline-source-map",
  mode: "development",
  devServer: {
    proxy: {
      // backend port should be the one that is running inside the container, not the one that is exposed
      "/api": "http://backend:8080",
    },
    contentBase: resolveRoot("public"),
    host: "0.0.0.0",
    port: 3000,
    historyApiFallback: true,
    disableHostCheck: true,
    hot: true,
    compress: true,
    overlay: true,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  // separate vendor bundle to a separate file
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  }
});

const prod = merge(config, {
  devtool: "nosources-source-map",
  mode: "production",
  output: {
    publicPath: resolveRoot("public"),
    filename: "js/[name].[contentHash:8].min.js",
    publicPath: "/"
  },
  module:{
    rules: [{
        test: /\.s[ac]ss$/,
        include: resolveSrc(),
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      }],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contentHash:8].min.css"
    }),
  ],
  optimization: {
    minimize: true,
    runtimeChunk: "single",
    moduleIds: "hashed",
    splitChunks: {
      chunks: "all"
    },
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        },
        sourceMap: true,
        parallel: true,
        extractComments: false
      }),
      new OptimizeCssAssetsPlugin()
    ]
  }
});


export default env === "development" ? dev : prod;
