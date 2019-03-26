let plugins = [] 
module.exports = api => {
  if (api.env() !== 'production') {
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
      "@babel/preset-react",
      "@babel/preset-flow"
    ],
    plugins
  }
};