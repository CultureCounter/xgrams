import { tags } from "typia";

export const ScopeNames = [
	"Top 50",
	"Top 100",
	"Top 200",
	"Top 500",
	"Top 1000",
	"Top 2000",
	"Top 4000",
	"Top 8000",
	"Top 16000",
];
export const ScopeValues = [50, 100, 200, 500, 1000, 2000, 4000, 8000, 16000];

export class LessonXG {
	scope: number & tags.Type<"int32"> & tags.Default<50> = $state(ScopeValues[0]);
	combination: number & tags.Type<"int32"> & tags.Default<2> = $state(2);
	repetition: number & tags.Type<"int32"> & tags.Default<20> = $state(20);
	filter: string = $state("");
	WPMs: number[] = $state([]);
	lines: string[] = [];
	linesCurrentIndex: number & tags.Type<"int32"> & tags.Default<0> = 0;
}
