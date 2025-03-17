// File: app/api/coins/route.ts
import { NextResponse } from "next/server";
import axios from 'axios'
export async function GET(
	request: Request,
	{ params }: { params: { mintAddress: string } }
) {
    	const { mintAddress } = params;
console.log(mintAddress,"MINTADDR")
	try {
		const url = `https://frontend-api-v3.pump.fun/trades/all/${mintAddress}?limit=500&offset=0&minimumSize=500`;

		const response = await fetch(url, {
			headers: {
				Accept: "*/*",
				"Accept-Language": "en-US,en;q=0.7",
				"Cache-Control": "no-cache, no-store, must-revalidate",
				Pragma: "no-cache",
				Expires: "0",
			},
			// cache: "no-store",
			next: { revalidate: 0 },
			method: "GET",
		});

		if (!response.ok) {
			throw new Error(`API responded with status: ${response.status}`);
		}

		const data = await response.json();

		// Add cache control headers to the API response as well
		return NextResponse.json(data, {
			headers: {
				"Cache-Control": "no-cache, no-store, must-revalidate",
				Pragma: "no-cache",
				Expires: "0",
			},
		});
	} catch (error) {
		console.error("Error fetching data:", error);
		return NextResponse.json(
			{ error: "Failed to fetch data" },
			{ status: 500 }
		);
	}
}
