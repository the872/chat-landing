import { sveltekit } from '@sveltejs/kit/vite';

const config = {
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
	server: {
		proxy: {
			'/api': {
				target: 'https://api.openai.com',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '/v1/completions'),
			},
		},
	},
};

export default config;
