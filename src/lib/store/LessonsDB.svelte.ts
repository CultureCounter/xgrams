import { LessonDB } from "./LessonDB.svelte.ts";

export const currentVersion = 3; // increment for schema changes.

export const OtherNames: { code: string; custom: string } = { code: "Code", custom: "Custom" };

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

	constructor(init?: Partial<LessonsDB>) {
		if (init) {
			if (init.version !== undefined) this.version = init.version;
			if (init.sourceLessons !== undefined) this.sourceLessons = init.sourceLessons;
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
