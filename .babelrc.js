let plugins = [] 
module.exports = api => {
  const isDev = api.cache(() => process.env.NODE_ENV === "development");
  if (isDev) {
    plugins.unshift("react-hot-loader/babel");
  }
  return {
    "presets": [
      [
        "@babel/preset-env",
        {
          "targets": {
            "node": "10"
          } 
        }
      ],
      "@babel/preset-react"
    ],
    plugins
  }
};