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

export class LessonDB {
	scope: number = ScopeValues[ScopeIndex.top50];
	combination: number = 2;
	repetition: number = 20;
	filter: string = "";
	WPMs: number[] = [];

	constructor(init?: Partial<LessonDB>) {
		if (init) {
			if (init.scope !== undefined) this.scope = init.scope;
			if (init.combination !== undefined) this.combination = init.combination;
			if (init.repetition !== undefined) this.repetition = init.repetition;
			if (init.filter !== undefined) this.filter = init.filter;
			if (init.WPMs !== undefined) this.WPMs = init.WPMs;
		}
	}

	#isDirty: boolean = false;
	set isDirty(value: boolean) {
		this.#isDirty = value;
	}
	get isDirty() {
		return this.#isDirty;
	}
}

export class LessonState {
	scope: number = $state(ScopeValues[ScopeIndex.top50]);
	combination: number = $state(2);
	repetition: number = $state(20);
	filter: string = $state("");
	WPMs: number[] = $state([]);

	constructor(init?: Partial<LessonDB>) {
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

	transferFrom(lesson: LessonDB): void {
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

	transferTo(lesson: LessonDB): boolean {
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

		let wpmChanged = false;
		this.WPMs.forEach((wpm, i) => {
			if (lesson.WPMs[i] != wpm) wpmChanged = true;
		});
		if (wpmChanged) {
			lesson.WPMs.length = 0;
			this.WPMs.forEach((wpm) => {
				lesson.WPMs.push(wpm);
			});
			didChange = true;
		}

		return didChange;
	}
}

export const transferTo = (lesson: LessonDB, lessonDB: LessonDB): boolean => {
	let didChange = false;
	if (lessonDB.scope !== lesson.scope) {
		lessonDB.scope = lesson.scope;
		didChange = true;
	}
	if (lessonDB.combination !== lesson.combination) {
		lessonDB.combination = lesson.combination;
		didChange = true;
	}
	if (lessonDB.repetition !== lesson.repetition) {
		lessonDB.repetition = lesson.repetition;
		didChange = true;
	}
	if (lessonDB.filter !== lesson.filter) {
		lessonDB.filter = lesson.filter;
		didChange = true;
	}

	let wpmChanged = false;
	lessonDB.WPMs.forEach((wpm, i) => {
		if (lesson.WPMs[i] != wpm) wpmChanged = true;
	});
	if (wpmChanged) {
		lessonDB.WPMs.length = 0;
		lesson.WPMs.forEach((wpm) => {
			lessonDB.WPMs.push(wpm);
		});
		didChange = true;
	}

	return didChange;
};
