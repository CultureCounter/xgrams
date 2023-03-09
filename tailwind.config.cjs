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
			// colors: {
			// 	'primary-color': 'var(--primary-color)',
			// 	'secondary-color': 'var(--secondary-color)'
			// }
		},
	},
	plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('@tailwindcss/line-clamp'), ...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()],
};
