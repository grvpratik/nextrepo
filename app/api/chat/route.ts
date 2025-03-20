import { google } from "@ai-sdk/google";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages } = await req.json();

	const result = streamText({
		model: google("gemini-2.0-flash-lite-preview-02-05"),
		system:
			"You are a helpful, friendly AI assistant. Provide clear, concise, and accurate responses.",
		messages,
	});

	return result.toDataStreamResponse();
}



// import { openai } from "@ai-sdk/openai";
// import { google } from "@ai-sdk/google";
// import { streamText } from "ai";

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

// export async function POST(req: Request) {
// 	const { messages, model } = await req.json();

// 	// Parse the model string to get provider and model name
// 	const [provider, modelName] = model.split(":");

// 	let selectedModel;

// 	// Select the appropriate provider and model
// 	if (provider === "openai") {
// 		selectedModel = openai(modelName);
// 	} else if (provider === "google") {
// 		selectedModel = google(modelName);
// 	} else {
// 		selectedModel = google("gemini-2.0-flash-lite-preview-02-05");
// 	}

// 	const result = streamText({
// 		model: selectedModel,
// 		system:
// 			"You are a helpful, friendly AI assistant. Provide clear, concise, and accurate responses.",
// 		messages,
// 	});

// 	return result.toDataStreamResponse();
// }
