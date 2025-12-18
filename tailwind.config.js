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
		},
	},
	plugins: [forms, typography, lineClamp, ...skeleton()],
};
