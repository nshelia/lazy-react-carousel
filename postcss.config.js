const autoprefixer = require('autoprefixer')

const plugins = [
	autoprefixer({
	  browsers: ['> 0%']
	})
]

module.exports = {
  plugins
}