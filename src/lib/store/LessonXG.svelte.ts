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
	scope: number = ScopeValues[0];
	combination: number = 2;
	repetition: number = 20;
	filter: string = "";
	WPMs: number[] = [];

	constructor(init?: Partial<LessonXG>) {
		if (init) {
			if (init.scope !== undefined) this.scope = init.scope;
			if (init.combination !== undefined) this.combination = init.combination;
			if (init.repetition !== undefined) this.repetition = init.repetition;
			if (init.filter !== undefined) this.filter = init.filter;
			if (init.WPMs !== undefined) this.WPMs = init.WPMs;
		}
	}
}
