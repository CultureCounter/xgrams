/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', require('path').join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
		screens: {
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1536px',
			'3xl': '1792px',
			'4xl': '2048px',
		},
		extend: {
			fontFamily: {
				serif: ['kobenhavn', 'ui-serif'],
				sans: ['BlinkMacSystemFont', 'ui-sans-serif', 'sans-serif', 'Roboto'],
				mono: ['fira-mono', 'ui-monospace'],
			},
			// --theme-font-family-base: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
			// 	'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
			// colors: {
			// 	'primary-color': 'var(--primary-color)',
			// 	'secondary-color': 'var(--secondary-color)'
			// }
		},
	},
	plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('@tailwindcss/line-clamp'), ...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()],
};
