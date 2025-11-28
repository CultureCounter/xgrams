/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: [
		"./src/**/*.{html,js,svelte,ts}",
		require("path").join(require.resolve("@skeletonlabs/skeleton"), "../**/*.{html,js,svelte,ts}"),
	],
	theme: {
		screens: {
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
			"2xl": "1536px",
			"3xl": "1792px",
			"4xl": "2048px",
		},
		extend: {
			aspectRatio: {
				"3/2": "3 / 2",
			},
			strokeWidth: {
				0.5: "0.5px",
				1.5: "1.5px",
			},
			fontFamily: {
				// sans
				helveticaNeue: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
				calibri: ["Calibri", "Candara", "Segoe", "Segoe UI", "Optima", "Arial", "sans-serif"],
				candara: ["Candara", "Calibri", "Segoe", "Segoe UI", "Optima", "Arial", "sans-serif"],
				century: ["Century", "Gothic", "CenturyGothic", "AppleGothic", "sans-serif"],
				dejavu: ["Dejavu Sans", "Arial", "Verdana", "sans-serif"],
				notoSans: ["Noto Sans", "sans-serif"],
				optima: ["Optima", "Segoe", "Segoe UI", "Candara", "Calibri", "Arial", "sans-serif"],
				roboto: ["Roboto", "sans-serif"],
				ubuntu: ["Ubuntu", "sans-serif"],
				verdana: ["Verdana", "Geneva", "sans-serif"],
				// serif
				baskerville: [
					"Baskerville",
					"Baskerville Old Face",
					"Garamond",
					"Times New Roman",
					"serif",
				],
				calistoMT: [
					"Calisto MT",
					"Bookman Old Style",
					"Bookman",
					"Goudy Old Style",
					"Garamond",
					"Hoefler Text",
					"Bitstream Charter",
					"Georgia",
					"serif",
				],
				cambria: ["Cambria", "Georgia", "serif"],
				didot: [
					"Didot",
					"Didot LT STD",
					"Hoefler Text",
					"Garamond",
					"Calisto MT",
					"Times New Roman",
					"serif",
				],
				garamond: [
					"Garamond",
					"Baskerville",
					"Baskerville Old Face",
					"Hoefler Text",
					"Times New Roman",
					"serif",
				],
				georgia: ["Georgia", "Times", "Times New Roman", "serif"],
				notoSerif: ["Noto Serif", "sans-serif"],
				palatino: [
					"Palatino",
					"Palatino Linotype",
					"Palatino LT STD",
					"Book Antiqua",
					"Georgia",
					"serif",
				],
				// mono
				andaleMono: ["Andale Mono", "monospace"],
				consolas: ["Consolas", "Monaco", "monospace"],
				courierNew: [
					"Courier New",
					"Courier",
					"Lucida Sans Typewriter",
					"Lucida Typewriter",
					"monospace",
				],
				ubuntuMono: ["Ubuntu Mono", "monospace"],
				// fantasy
				luminari: ["Luminari"],
				// cursive
				comicSansMS: ["Comic Sans MS"],
			},
			// https://kinsta.com/blog/web-safe-fonts/
			// https://blog.hubspot.com/website/web-safe-html-css-fonts

			// --theme-font-family-base: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
			// 	'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
			// font-sans	font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
			// font-serif	font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
			// font-mono	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;			// colors: {
			// 	'primary-color': 'var(--primary-color)',
			// 	'secondary-color': 'var(--secondary-color)'
			// }
		},
	},
	plugins: [
		require("@tailwindcss/forms"),
		require("@tailwindcss/typography"),
		require("@tailwindcss/line-clamp"),
		...require("@skeletonlabs/skeleton/tailwind/skeleton.cjs")(),
	],
};
