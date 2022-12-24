module.exports = {
  devServer: {
    port: 8100,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        ws: true,
        changeOrigin: true,
      },
    },
  },
  pwa: {
    name: "LSR",
    themeColor: "#ffffff",
    msTileColor: "#ffffff",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "default",
    manifestOptions: {
      start_url: ".",
      display: "standalone",
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule("pdf")
      .test(/\.(pdf)(\?.*)?$/)
      .use("file-loader")
      .loader("file-loader")
      .options({
        name: "assets/pdfs/[name].[hash:8].[ext]",
      });
  },
  transpileDependencies: ["vuetify"],
};
