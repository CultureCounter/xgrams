import type { FingerIndex } from "./keyboard";

export enum ColorIndex {
	red = 0,
	orange,
	amber,
	yellow,
	lime,
	green,
	emerald,
	teal,
	cyan,
	sky,
	blue,
	indigo,
	violet,
	purple,
	fuchsia,
	pink,
	rose,
	slate,
	gray,
	zinc,
	neutral,
	stone,
}

export const ColorNames = [
	"red",
	"orange",
	"amber",
	"yellow",
	"lime",
	"green",
	"emerald",
	"teal",
	"cyan",
	"sky",
	"blue",
	"indigo",
	"violet",
	"purple",
	"fuchsia",
	"pink",
	"rose",
	"slate",
	"gray",
	"zinc",
	"neutral",
	"stone",
];

export const getHourStrokeFill = (colorIndex: ColorIndex) => {
	return '"' + HourStrokeColors[colorIndex] + " " + HourFillColors[colorIndex] + '" ';
};

export const getMinuteStrokeFill = (colorIndex: ColorIndex) => {
	return MinuteStrokeColors[colorIndex] + " " + MinuteFillColors[colorIndex];
};

export const getSecondStrokeFill = (colorIndex: ColorIndex) => {
	return SecondStrokeColors[colorIndex] + " " + SecondFillColors[colorIndex];
};

export const getBorderColor = (colorIndex: ColorIndex, light: string = "100", dark: string = "900") => {
	return "border-" + ColorNames[colorIndex] + "-" + light + " dark:border-" + ColorNames[colorIndex] + "-" + dark;
};

export const getBGColor = (colorIndex: ColorIndex, light: string = "100", dark: string = "900") => {
	return "bg-" + ColorNames[colorIndex] + "-" + light + " dark:bg-" + ColorNames[colorIndex] + "-" + dark;
};

export const getStrokeColor = (colorIndex: ColorIndex, light: string = "900", dark: string = "400") => {
	return "stroke-" + ColorNames[colorIndex] + "-" + light + " dark:stroke-" + ColorNames[colorIndex] + "-" + dark;
};

export const getFillColor = (colorIndex: ColorIndex, light: string = "100", dark: string = "900") => {
	return "fill-" + ColorNames[colorIndex] + "-" + light + " dark:fill-" + ColorNames[colorIndex] + "-" + dark;
};

export const HourStrokeColors = [
	"stroke-red-900 dark:stroke-red-400",
	"stroke-orange-900 dark:stroke-orange-400",
	"stroke-amber-900 dark:stroke-amber-400",
	"stroke-yellow-900 dark:stroke-yellow-400",
	"stroke-lime-900 dark:stroke-lime-400",
	"stroke-green-900 dark:stroke-green-400",
	"stroke-emerald-900 dark:stroke-emerald-400",
	"stroke-teal-900 dark:stroke-teal-400",
	"stroke-cyan-900 dark:stroke-cyan-400",
	"stroke-sky-900 dark:stroke-sky-400",
	"stroke-blue-900 dark:stroke-blue-400",
	"stroke-indigo-900 dark:stroke-indigo-400",
	"stroke-violet-900 dark:stroke-violet-400",
	"stroke-purple-900 dark:stroke-purple-400",
	"stroke-fuchsia-900 dark:stroke-fuchsia-400",
	"stroke-pink-900 dark:stroke-pink-400",
	"stroke-rose-900 dark:stroke-rose-400",
	"stroke-slate-900 dark:stroke-slate-400",
	"stroke-gray-900 dark:stroke-gray-400",
	"stroke-zinc-900 dark:stroke-zinc-400",
	"stroke-neutral-900 dark:stroke-neutral-400",
	"stroke-stone-900 dark:stroke-stone-400",
];
export const HourFillColors = [
	"fill-red-100/90 dark:fill-red-900/20",
	"fill-orange-100/90 dark:fill-orange-900/20",
	"fill-amber-100/90 dark:fill-amber-900/20",
	"fill-yellow-100/90 dark:fill-yellow-900/20",
	"fill-lime-100/90 dark:fill-lime-900/20",
	"fill-green-100/90 dark:fill-green-900/20",
	"fill-emerald-100/90 dark:fill-emerald-900/20",
	"fill-teal-100/90 dark:fill-teal-900/20",
	"fill-cyan-100/90 dark:fill-cyan-900/20",
	"fill-sky-100/90 dark:fill-sky-900/20",
	"fill-blue-100/90 dark:fill-blue-900/20",
	"fill-indigo-100/90 dark:fill-indigo-900/20",
	"fill-violet-100/90 dark:fill-violet-900/20",
	"fill-purple-100/90 dark:fill-purple-900/20",
	"fill-fuchsia-100/90 dark:fill-fuchsia-900/20",
	"fill-pink-100/90 dark:fill-pink-900/20",
	"fill-rose-100/90 dark:fill-rose-900/20",
	"fill-slate-100/90 dark:fill-slate-900/20",
	"fill-gray-100/90 dark:fill-gray-900/20",
	"fill-zinc-100/90 dark:fill-zinc-900/20",
	"fill-neutral-100/90 dark:fill-neutral-900/20",
	"fill-stone-100/90 dark:fill-stone-900/20",
];
export const MinuteStrokeColors = [
	"stroke-red-600 dark:stroke-red-600",
	"stroke-orange-600 dark:stroke-orange-600",
	"stroke-amber-600 dark:stroke-amber-600",
	"stroke-yellow-600 dark:stroke-yellow-600",
	"stroke-lime-600 dark:stroke-lime-600",
	"stroke-green-600 dark:stroke-green-600",
	"stroke-emerald-600 dark:stroke-emerald-600",
	"stroke-teal-600 dark:stroke-teal-600",
	"stroke-cyan-600 dark:stroke-cyan-600",
	"stroke-sky-600 dark:stroke-sky-600",
	"stroke-blue-600 dark:stroke-blue-600",
	"stroke-indigo-600 dark:stroke-indigo-600",
	"stroke-violet-600 dark:stroke-violet-600",
	"stroke-purple-600 dark:stroke-purple-600",
	"stroke-fuchsia-600 dark:stroke-fuchsia-600",
	"stroke-pink-600 dark:stroke-pink-600",
	"stroke-rose-600 dark:stroke-rose-600",
	"stroke-slate-600 dark:stroke-slate-600",
	"stroke-gray-600 dark:stroke-gray-600",
	"stroke-zinc-600 dark:stroke-zinc-600",
	"stroke-neutral-600 dark:stroke-neutral-600",
	"stroke-stone-600 dark:stroke-stone-600",
];
export const MinuteFillColors = [
	"fill-red-600/30 dark:fill-red-600/10",
	"fill-orange-600/30 dark:fill-orange-600/10",
	"fill-amber-600/30 dark:fill-amber-600/10",
	"fill-yellow-600/30 dark:fill-yellow-600/10",
	"fill-lime-600/30 dark:fill-lime-600/10",
	"fill-green-600/30 dark:fill-green-600/10",
	"fill-emerald-600/30 dark:fill-emerald-600/10",
	"fill-teal-600/30 dark:fill-teal-600/10",
	"fill-cyan-600/30 dark:fill-cyan-600/10",
	"fill-sky-600/30 dark:fill-sky-600/10",
	"fill-blue-600/30 dark:fill-blue-600/10",
	"fill-indigo-600/30 dark:fill-indigo-600/10",
	"fill-violet-600/30 dark:fill-violet-600/10",
	"fill-purple-600/30 dark:fill-purple-600/10",
	"fill-fuchsia-600/30 dark:fill-fuchsia-600/10",
	"fill-pink-600/30 dark:fill-pink-600/10",
	"fill-rose-600/30 dark:fill-rose-600/10",
	"fill-slate-600/30 dark:fill-slate-600/10",
	"fill-gray-600/30 dark:fill-gray-600/10",
	"fill-zinc-600/30 dark:fill-zinc-600/10",
	"fill-neutral-600/30 dark:fill-neutral-600/10",
	"fill-stone-600/30 dark:fill-stone-600/10",
];
export const SecondStrokeColors = [
	"stroke-red-400 dark:stroke-red-800",
	"stroke-orange-400 dark:stroke-orange-800",
	"stroke-amber-400 dark:stroke-amber-800",
	"stroke-yellow-400 dark:stroke-yellow-800",
	"stroke-lime-400 dark:stroke-lime-800",
	"stroke-green-400 dark:stroke-green-800",
	"stroke-emerald-400 dark:stroke-emerald-800",
	"stroke-teal-400 dark:stroke-teal-800",
	"stroke-cyan-400 dark:stroke-cyan-800",
	"stroke-sky-400 dark:stroke-sky-800",
	"stroke-blue-400 dark:stroke-blue-800",
	"stroke-indigo-400 dark:stroke-indigo-800",
	"stroke-violet-400 dark:stroke-violet-800",
	"stroke-purple-400 dark:stroke-purple-800",
	"stroke-fuchsia-400 dark:stroke-fuchsia-800",
	"stroke-pink-400 dark:stroke-pink-800",
	"stroke-rose-400 dark:stroke-rose-800",
	"stroke-slate-400 dark:stroke-slate-800",
	"stroke-gray-400 dark:stroke-gray-800",
	"stroke-zinc-400 dark:stroke-zinc-800",
	"stroke-neutral-400 dark:stroke-neutral-800",
	"stroke-stone-400 dark:stroke-stone-800",
];
export const SecondFillColors = [
	"fill-red-100/20 dark:fill-red-800/20",
	"fill-orange-100/20 dark:fill-orange-800/20",
	"fill-amber-100/20 dark:fill-amber-800/20",
	"fill-yellow-100/20 dark:fill-yellow-800/20",
	"fill-lime-100/20 dark:fill-lime-800/20",
	"fill-green-100/20 dark:fill-green-800/20",
	"fill-emerald-100/20 dark:fill-emerald-800/20",
	"fill-teal-100/20 dark:fill-teal-800/20",
	"fill-cyan-100/20 dark:fill-cyan-800/20",
	"fill-sky-100/20 dark:fill-sky-800/20",
	"fill-blue-100/20 dark:fill-blue-800/20",
	"fill-indigo-100/20 dark:fill-indigo-800/20",
	"fill-violet-100/20 dark:fill-violet-800/20",
	"fill-purple-100/20 dark:fill-purple-800/20",
	"fill-fuchsia-100/20 dark:fill-fuchsia-800/20",
	"fill-pink-100/20 dark:fill-pink-800/20",
	"fill-rose-100/20 dark:fill-rose-800/20",
	"fill-slate-100/20 dark:fill-slate-800/20",
	"fill-gray-100/20 dark:fill-gray-800/20",
	"fill-zinc-100/20 dark:fill-zinc-800/20",
	"fill-neutral-100/20 dark:fill-neutral-800/20",
	"fill-stone-100/20 dark:fill-stone-800/20",
];

export const GlowColors = [
	"bg-red-300 dark:bg-red-900",
	"bg-orange-300 dark:bg-orange-900",
	"bg-amber-300 dark:bg-amber-900",
	"bg-yellow-300 dark:bg-yellow-900",
	"bg-lime-300 dark:bg-lime-900",
	"bg-green-300 dark:bg-green-900",
	"bg-emerald-300 dark:bg-emerald-900",
	"bg-teal-300 dark:bg-teal-900",
	"bg-cyan-300 dark:bg-cyan-900",
	"bg-sky-300 dark:bg-sky-900",
	"bg-blue-300 dark:bg-blue-900",
	"bg-indigo-300 dark:bg-indigo-900",
	"bg-violet-300 dark:bg-violet-900",
	"bg-purple-300 dark:bg-purple-900",
	"bg-fuchsia-300 dark:bg-fuchsia-900",
	"bg-pink-300 dark:bg-pink-900",
	"bg-rose-300 dark:bg-rose-900",
	"bg-slate-300 dark:bg-slate-900",
	"bg-gray-300 dark:bg-gray-900",
	"bg-zinc-300 dark:bg-zinc-900",
	"bg-neutral-300 dark:bg-neutral-900",
	"bg-stone-300 dark:bg-stone-900",
];
export const KeyColors = [
	"bg-red-100 dark:bg-red-900",
	"bg-orange-100 dark:bg-orange-900",
	"bg-amber-100 dark:bg-amber-900",
	"bg-yellow-100 dark:bg-yellow-900",
	"bg-lime-100 dark:bg-lime-900",
	"bg-green-100 dark:bg-green-900",
	"bg-emerald-100 dark:bg-emerald-900",
	"bg-teal-100 dark:bg-teal-900",
	"bg-cyan-100 dark:bg-cyan-900",
	"bg-sky-100 dark:bg-sky-900",
	"bg-blue-100 dark:bg-blue-900",
	"bg-indigo-100 dark:bg-indigo-900",
	"bg-violet-100 dark:bg-violet-900",
	"bg-purple-100 dark:bg-purple-900",
	"bg-fuchsia-100 dark:bg-fuchsia-900",
	"bg-pink-100 dark:bg-pink-900",
	"bg-rose-100 dark:bg-rose-900",
	"bg-slate-100 dark:bg-slate-900",
	"bg-gray-100 dark:bg-gray-900",
	"bg-zinc-100 dark:bg-zinc-900",
	"bg-neutral-100 dark:bg-neutral-900",
	"bg-stone-100 dark:bg-stone-900",
];
export const BGColors = [
	"bg-red-100/40 dark:bg-red-900/20",
	"bg-orange-100/40 dark:bg-orange-900/20",
	"bg-amber-100/40 dark:bg-amber-900/20",
	"bg-yellow-100/40 dark:bg-yellow-900/20",
	"bg-lime-100/40 dark:bg-lime-900/20",
	"bg-green-100/40 dark:bg-green-900/20",
	"bg-emerald-100/40 dark:bg-emerald-900/20",
	"bg-teal-100/40 dark:bg-teal-900/20",
	"bg-cyan-100/40 dark:bg-cyan-900/20",
	"bg-sky-100/40 dark:bg-sky-900/20",
	"bg-blue-100/40 dark:bg-blue-900/20",
	"bg-indigo-100/40 dark:bg-indigo-900/20",
	"bg-violet-100/40 dark:bg-violet-900/20",
	"bg-purple-100/40 dark:bg-purple-900/20",
	"bg-fuchsia-100/40 dark:bg-fuchsia-900/20",
	"bg-pink-100/40 dark:bg-pink-900/20",
	"bg-rose-100/40 dark:bg-rose-900/20",
	"bg-slate-100/40 dark:bg-slate-900/20",
	"bg-gray-100/40 dark:bg-gray-900/20",
	"bg-zinc-100/40 dark:bg-zinc-900/20",
	"bg-neutral-100/40 dark:bg-neutral-900/20",
	"bg-stone-100/40 dark:bg-stone-900/20",
];

export const BorderColors: string[] = [
	"border-red-900 dark:border-red-400",
	"border-orange-900 dark:border-orange-400",
	"border-amber-900 dark:border-amber-400",
	"border-yellow-900 dark:border-yellow-400",
	"border-lime-900 dark:border-lime-400",
	"border-green-900 dark:border-green-400",
	"border-emerald-900 dark:border-emerald-400",
	"border-teal-900 dark:border-teal-400",
	"border-cyan-900 dark:border-cyan-400",
	"border-sky-900 dark:border-sky-400",
	"border-blue-900 dark:border-blue-400",
	"border-indigo-900 dark:border-indigo-400",
	"border-violet-900 dark:border-violet-400",
	"border-purple-900 dark:border-purple-400",
	"border-fuchsia-900 dark:border-fuchsia-400",
	"border-pink-900 dark:border-pink-400",
	"border-rose-900 dark:border-rose-400",
	"border-slate-900 dark:border-slate-400",
	"border-gray-900 dark:border-gray-400",
	"border-zinc-900 dark:border-zinc-400",
	"border-neutral-900 dark:border-neutral-400",
	"border-stone-900 dark:border-stone-400",
];
// ColorNames.forEach((colorName) => {
// 	BorderColor.push("border-" + colorName + "-900 dark:border-" + colorName + "-400");
// });

// Finger colors for 10-finger touch typing (indexed by FingerIndex from keyboard.ts)
// Symmetric colors: same finger on each hand gets the same color
export const FingerColors = [
	"bg-red-200 dark:bg-red-800", // leftPinky (0)
	"bg-orange-200 dark:bg-orange-800", // leftRing (1)
	"bg-yellow-200 dark:bg-yellow-800", // leftMiddle (2)
	"bg-fuchsia-200 dark:bg-fuchsia-800", // leftIndex (3)
	"bg-violet-200 dark:bg-violet-800", // leftThumb (4)
	"bg-sky-200 dark:bg-sky-800", // rightThumb (5)
	"bg-blue-200 dark:bg-blue-800", // rightIndex (6)
	"bg-yellow-200 dark:bg-yellow-800", // rightMiddle (7)
	"bg-orange-200 dark:bg-orange-800", // rightRing (8)
	"bg-red-200 dark:bg-red-800", // rightPinky (9)
];

// Highlight ring for next key to type
export const NextFingerColor = [
	"ring-red-700 dark:ring-red-300", // leftPinky (0)
	"ring-orange-700 dark:ring-orange-300", // leftRing (1)
	"ring-yellow-700 dark:ring-yellow-300", // leftMiddle (2)
	"ring-fuchsia-700 dark:ring-fuchsia-300", // leftIndex (3)
	"ring-violet-700 dark:ring-violet-300", // leftThumb (4)
	"ring-sky-700 dark:ring-sky-300", // rightThumb (5)
	"ring-blue-700 dark:ring-blue-300", // rightIndex (6)
	"ring-yellow-700 dark:ring-yellow-300", // rightMiddle (7)
	"ring-orange-700 dark:ring-orange-300", // rightRing (8)
	"ring-red-700 dark:ring-red-300", // rightPinky (9)
];
export const getNextFingerColor = (fingerIndex: FingerIndex) => {
	return " ring-6 " + NextFingerColor[fingerIndex] + " animate-pulse";
};
