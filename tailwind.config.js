/** @type {import('tailwindcss').Config} */
import path from "path";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import lineClamp from "@tailwindcss/line-clamp";
import skeleton from "@skeletonlabs/skeleton/tailwind/skeleton.cjs";

export default {
	darkMode: "class",
	content: [
		"./src/**/*.{html,js,svelte,ts}",
		path.join(path.dirname(import.meta.resolve("@skeletonlabs/skeleton")), "../**/*.{html,js,svelte,ts}"),
	],
	theme: {
		screens: {
			"sm": "640px",
			"md": "768px",
			"lg": "1024px",
			"xl": "1280px",
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
				arial: ["Arial", "font-sans"],
				notoSans: ["Noto Sans", "font-sans"],
				roboto: ["Roboto", "font-sans"],
				segoeUI: ["Segoe UI Variable Text", "font-sans"],
				tahoma: ["Tahoma", "font-sans"],
				verdana: ["Verdana", "Geneva", "font-sans"],

				// serif
				century: ["Century", "Gothic", "CenturyGothic", "AppleGothic", "font-serif"],
				garamond: ["Garamond", "Baskerville", "Baskerville Old Face", "Hoefler Text", "font-serif"],
				georgia: ["Georgia", "Times", "font-serif"],
				notoSerif: ["Noto Serif", "font-serif"],
				palatino: ["Palatino Linotype", "font-serif"],
				timesNewRoman: ["Times New Roman", "Times", "font-serif"],

				// mono
				andaleMono: ["Andale Mono", "font-mono"],
				cascadiaMono: ["Cascadia Mono", "font-mono"],
				courierNew: ["Courier New", "Courier", "Lucida Sans Typewriter", "Lucida Typewriter", "font-mono"],
				ubuntuMono: ["Ubuntu Mono", "font-mono"],
			},
			// https://kinsta.com/blog/web-safe-fonts/
			// https://blog.hubspot.com/website/web-safe-html-css-fonts

			// colors: {
			// 	'primary-color': 'var(--primary-color)',
			// 	'secondary-color': 'var(--secondary-color)'
			// }
		},
	},
	plugins: [forms, typography, lineClamp, ...skeleton()],
};
