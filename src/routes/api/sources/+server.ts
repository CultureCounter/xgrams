// import { json } from '@sveltejs/kit';
import bigrams from "$lib/store/bigrams";
import trigrams from "$lib/store/trigrams";
import tetragrams from "$lib/store/tetragrams";
import pentagrams from "$lib/store/pentagrams";
import hexagrams from "$lib/store/hexagrams";
import pangrams from "$lib/store/pangrams";
import words from "$lib/store/words";
import { SourceXG } from "$lib/store/SourceDB.svelte";

const data: SourceXG = new SourceXG();
data.bigrams = bigrams;
data.trigrams = trigrams;
data.tetragrams = tetragrams;
data.pentagrams = pentagrams;
data.hexagrams = hexagrams;
data.pangrams = pangrams;
data.words = words;

const jsonString = JSON.stringify(data);

// Create a new Headers object
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

export function GET() {
	// Create a new Response object
	const myResponse = new Response(jsonString, {
		status: 200,
		statusText: "OK",
		headers: myHeaders,
	});

	// The one true precalculated object
	return myResponse;
}
