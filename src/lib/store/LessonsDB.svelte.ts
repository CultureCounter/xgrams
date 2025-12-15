import { SourceIndex } from "./SourceDB.svelte.ts";
import { LessonDB } from "./LessonDB.svelte.ts";

export const currentVersion = 2; // increment for schema changes.

/**
 * LessonsDB stores LessonDB for each datasource.
 * Changes cause the lesson or lines to regenerate.
 */
export class LessonsDB {
	version: number = currentVersion;

	public sourceLessons: LessonDB[] = [
		new LessonDB(),
		new LessonDB(),
		new LessonDB(),
		new LessonDB(),
		new LessonDB(),
		new LessonDB(),
		new LessonDB(),
		new LessonDB(),
		new LessonDB(),
	];

	// public source: number = SourceIndex.bigrams;
	public lessonIndex: number = SourceIndex.bigrams;

	constructor(init?: Partial<LessonsDB>) {
		if (init) {
			if (init.version !== undefined) this.version = init.version;
			// if (init.source !== undefined) this.source = init.source;
			if (init.sourceLessons !== undefined) this.sourceLessons = init.sourceLessons;
			if (init.lessonIndex !== undefined) this.lessonIndex = init.lessonIndex;
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
