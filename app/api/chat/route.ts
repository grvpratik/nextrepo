import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages } = await req.json();

	const result = streamText({
		model: google("gemini-2.0-flash-lite-preview-02-05"),
		system: "You are a helpful AI assistant. Use tools when appropriate.",
		messages,
		maxSteps:2,
		tools: {
			// Weather lookup tool
			weatherLookup: {
				description: "Lookup current weather for a specific location",
				parameters: z.object({
					location: z.string().describe("City and country or zip code"),
					unit: z.enum(["celsius", "fahrenheit"]).default("celsius"),
				}),
				execute: async ({
					location,
					unit,
				}: {
					location: string;
					unit: string;
				}) => {
					
					type WeatherType = {
						temperature: number;
						condition: string; 
						humidity: number;
						windSpeed: number;
					};

				
					const weatherMap: { [city: string]: WeatherType } = {
						"New York, USA": {
							temperature: unit === "celsius" ? 22 : 72,
							condition: "Partly Cloudy",
							humidity: 65,
							windSpeed: 12,
						},
						"London, UK": {
							temperature: unit === "celsius" ? 18 : 64,
							condition: "Light Rain",
							humidity: 80,
							windSpeed: 8,
						},
					};

					
					const weatherData: WeatherType = weatherMap[location] || {
						temperature: unit === "celsius" ? 20 : 68,
						condition: "Sunny",
						humidity: 50,
						windSpeed: 5,
					};

				
					return {
						result: `Weather in ${location}:
- Temperature: ${weatherData.temperature}°${unit === "celsius" ? "C" : "F"}
- Condition: ${weatherData.condition}
- Humidity: ${weatherData.humidity}%
- Wind Speed: ${weatherData.windSpeed} km/h`,
					};
				},
			},
		
			currencyConvert: {
				description: "Convert an amount from one currency to another",
				parameters: z.object({
					amount: z.number().positive().describe("Amount to convert"),
					fromCurrency: z.string().describe("Source currency code (e.g., USD)"),
					toCurrency: z.string().describe("Target currency code (e.g., EUR)"),
				}),
				execute: async ({ amount, fromCurrency, toCurrency }) => {
					// Simulated exchange rates
					type er = {
						[cov: string]: number;
					};
					const exchangeRates: er = {
						USD_EUR: 0.92,
						EUR_USD: 1.09,
						USD_GBP: 0.79,
						GBP_USD: 1.27,
						USD_JPY: 149.5,
						JPY_USD: 0.0067,
					};

					const rateKey = `${fromCurrency}_${toCurrency}`;
					const rate = exchangeRates[rateKey];

					if (!rate) {
						return {
							result: `Conversion rate not available for ${fromCurrency} to ${toCurrency}`,
						};
					}

					const convertedAmount = amount * rate;
					return {
						result: `${amount} ${fromCurrency} = ${convertedAmount.toFixed(
							2
						)} ${toCurrency}`,
					};
				},
			},
		
			calculate: {
				description: "Perform mathematical calculations",
				parameters: z.object({
					expression: z
						.string()
						.describe("Mathematical expression to calculate"),
				}),
				execute: async ({ expression }) => {
					try {
						// Use Function constructor safely
						const result = new Function(`return (${expression})`)();
						return {
							result: `${expression} = ${result}`,
						};
					} catch (error) {
						return {
							result: "Invalid mathematical expression",
						};
					}
				},
			},
		},
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
