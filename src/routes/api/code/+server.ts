// import { json } from '@sveltejs/kit';
import code, { CodeXG } from "$lib/store/code";

const data: CodeXG = new CodeXG();
data.cpp = code.cpp;
data.cs = code.cs;
data.go = code.go;
data.java = code.java;
data.javascript = code.javascript;
data.python = code.python;
data.rust = code.rust;
data.swift = code.swift;
data.typescript = code.typescript;

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
