import { tags } from "typia";
import { SourceIndex } from "./SourceXG.svelte";
import { LessonXG } from "./LessonXG.svelte.ts";

export const currentVersion = 2; // increment for schema changes.

/**
 * LessonsXG stores LessonXG for each datasource.
 * Changes cause the lesson or lines to regenerate.
 */
export class LessonsXG {
	version: number & tags.Type<"int32"> = currentVersion;

	public sourceOptions: LessonXG[] = [
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

	public source: number & tags.Minimum<0> & tags.Maximum<8> = SourceIndex.bigrams;
	public lessonIndex: number & tags.Minimum<0> & tags.Maximum<8> = 0;

	constructor(init?: Partial<LessonsXG>) {
		if (init) {
			if (init.version !== undefined) this.version = init.version;
			if (init.sourceOptions !== undefined) this.sourceOptions = init.sourceOptions;
			if (init.source !== undefined) this.source = init.source;
			if (init.lessonIndex !== undefined) this.lessonIndex = init.lessonIndex;
		}
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
