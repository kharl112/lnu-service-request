module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        ws: true,
        changeOrigin: true,
      },
    },
  },
  pwa: {
    name: "LnuSR",
    themeColor: "#e78a00",
    msTileColor: "#ffffff",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    manifestOptions: {
      start_url: "/faculty/login",
      display: "standalone",
      background_color: "#ffffff",
    },
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
    },
  },

  transpileDependencies: ["vuetify"],
};
