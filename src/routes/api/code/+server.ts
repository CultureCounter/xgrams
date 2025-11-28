// import { json } from '@sveltejs/kit';
import code, { CodeXG } from "$lib/store/code";
import typia from "typia";

const data: CodeXG = new CodeXG();
data.languageCpp = code.languageCpp;
data.languageCs = code.languageCs;
data.languageGo = code.languageGo;
data.languageJava = code.languageJava;
data.languageJavascript = code.languageJavascript;
data.languagePython = code.languagePython;
data.languageRust = code.languageRust;
data.languageSwift = code.languageSwift;
data.languageTypescript = code.languageTypescript;

const jsonString = typia.json.stringify<CodeXG>(data);

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
