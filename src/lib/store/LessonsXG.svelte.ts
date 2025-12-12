import { SourceIndex } from "./SourceXG.svelte";
import { LessonXG } from "./LessonXG.svelte.ts";

export const currentVersion = 2; // increment for schema changes.

/**
 * LessonsXG stores LessonXG for each datasource.
 * Changes cause the lesson or lines to regenerate.
 */
export class LessonsXG {
	version: number = currentVersion;

	public sourceLessons: LessonXG[] = [
		new LessonXG(),
		new LessonXG(),
		new LessonXG(),
		new LessonXG(),
		new LessonXG(),
		new LessonXG(),
		new LessonXG(),
		new LessonXG(),
		new LessonXG(),
	];

	public source: number = SourceIndex.bigrams;
	public lessonIndex: number = SourceIndex.bigrams;

	constructor(init?: Partial<LessonsXG>) {
		if (init) {
			if (init.version !== undefined) this.version = init.version;
			if (init.source !== undefined) this.source = init.source;
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

/**
 * Creates a deep clone of an object.
 * @param original
 * @returns the deep clone
 */
// eslint-disable-next-line
export function deepClone(original: any): any {
	return structuredClone(original);
}
