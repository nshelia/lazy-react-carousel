let plugins = [] 
module.exports = api => {
	const isDev = api.cache(() => process.env.NODE_ENV === "development");
	if (isDev) {
  	plugins.unshift("react-hot-loader/babel");
	}
	return {
  	"presets": [
			"@babel/preset-env",
			"@babel/preset-react"
		],
	  plugins
	}
};