import adapter from '@sveltejs/adapter-static';
const dev = process.env.NODE_ENV === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {

	kit: {
		adapter: adapter({
			// default options are shown
			pages: 'docs',
			assets: 'docs',
			precompress: true,
			fallback: 'index.html',
			path: '',
			strict: true
		}),
		paths: {
			base: dev ? '' : '/superquote',
			assets: 'https://martin-havala.github.io/superquote'
		},
		files: {
			assets: 'static'
		},
		appDir: 'app'
	}
};

export default config;
