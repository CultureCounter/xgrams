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
export const ScopeIndex = {
	top50: 0,
	top100: 1,
	top200: 2,
	top500: 3,
	top1000: 4,
	top2000: 5,
	top4000: 6,
	top8000: 7,
	top16000: 8,
};

export class LessonXG {
	scope: number = ScopeValues[ScopeIndex.top50];
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

export class LessonState {
	scope: number = $state(ScopeValues[ScopeIndex.top50]);
	combination: number = $state(2);
	repetition: number = $state(20);
	filter: string = $state("");
	WPMs: number[] = $state([]);

	constructor(init?: Partial<LessonXG>) {
		if (init) {
			if (init.scope !== undefined) this.scope = init.scope;
			if (init.combination !== undefined) this.combination = init.combination;
			if (init.repetition !== undefined) this.repetition = init.repetition;
			if (init.filter !== undefined) this.filter = init.filter;
			if (init.WPMs !== undefined) {
				this.WPMs.length = 0;
				init.WPMs.forEach((wpm) => {
					const x: number = wpm;
					this.WPMs.push(x);
				});
			}
		}
	}

	transferFromLesson(lesson: LessonXG): void {
		this.scope = lesson.scope;
		this.combination = lesson.combination;
		this.repetition = lesson.repetition;
		this.filter = lesson.filter;
		this.WPMs.length = 0;
		lesson.WPMs.forEach((wpm) => {
			const x: number = wpm;
			this.WPMs.push(x);
		});
	}

	transferToLesson(lesson: LessonXG): boolean {
		let didChange = false;
		if (this.scope !== lesson.scope) {
			lesson.scope = this.scope;
			didChange = true;
		}
		if (this.combination !== lesson.combination) {
			lesson.combination = this.combination;
			didChange = true;
		}
		if (this.repetition !== lesson.repetition) {
			lesson.repetition = this.repetition;
			didChange = true;
		}
		if (this.filter !== lesson.filter) {
			lesson.filter = this.filter;
			didChange = true;
		}
		if (this.WPMs !== lesson.WPMs) {
			lesson.WPMs.length = 0;
			this.WPMs.forEach((wpm, i) => {
				if (lesson.WPMs[i] != wpm) return false;
			});
			this.WPMs.forEach((wpm) => {
				lesson.WPMs.push(wpm);
			});
			didChange = true;
		}
		return didChange;
	}
}
