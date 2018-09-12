module.exports = {
	mode: 'spa',
	head: {title: 'deslugar'}, // Headers of the page
	loading: false, // Disable default loading bar
	// plugins: [ "~/plugins/quasar.js" ],
	modules: [
		// 'nuxt-fontawesome',
		['nuxt-sass-resources-loader',
			{ resources: '@/assets/main.scss' }
		],
		['nuxt-fontawesome', {
			component: 'fa', 
			imports: [
				//import whole set
				{
					set: '@fortawesome/free-solid-svg-icons',
					icons: ['fas']
				},
				{
					set: '@fortawesome/free-brands-svg-icons',
					icons: ['fab']
				}
				//import 2 icons from set 
				// please note this is PRO set in this example, 
				// you must have it in your node_modules to actually import
				// {
				// 	set: '@fortawesome/pro-regular-svg-icons',
				// 	icons: ['faAdjust', 'faArchive']
				// }
			]
		}]
	],
	// },
	build: {
		extend (config, { isDev }) {
			if (isDev && process.client) {
				// Run ESLint on save
				config.module.rules.push({
					enforce: 'pre',
					test: /\.(js|vue)$/,
					loader: 'eslint-loader',
					exclude: /(node_modules)/,
					
				}),
				config.resolve.alias['@fortawesome/fontawesome-free-brands$'] = '@fortawesome/fontawesome-free-brands/shakable.es.js'
				config.resolve.alias['@fortawesome/fontawesome-free-solid$'] = '@fortawesome/fontawesome-free-solid/shakable.es.js'
			}
			// Extend only webpack config for client-bundle
			if (process.client) { config.target = 'electron-renderer' }
		}
	},
	dev: process.env.NODE_ENV === 'DEV',
	css: [
		'@/assets/css/global.css',
		// { src: './node_modules/font-awesome/scss/font-awesome.scss', lang: 'scss' }
	]
}
