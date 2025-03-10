// File: app/api/coins/route.ts
import { NextResponse } from "next/server";
import axios from 'axios'
export async function GET(request: Request) {
	try {
	

        let datax = JSON.stringify({
					query:
						'{\n  Solana {\n    DEXTrades(\n      limitBy: {by: Trade_Buy_Currency_MintAddress, count: 1}\n      limit: {count: 10}\n      orderBy: {descending: Trade_Buy_Price}\n      where: {Trade: {Dex: {ProtocolName: {is: "pump"}}, Buy: {Currency: {MintAddress: {notIn: ["11111111111111111111111111111111"]}}, PriceInUSD: {gt: 0.00001}}, Sell: {AmountInUSD: {gt: "10"}}}, Transaction: {Result: {Success: true}}, Block: {Time: {since: "2025-02-21T05:05:00Z"}}}\n    ) {\n      Trade {\n        Buy {\n          Price(maximum: Block_Time)\n          PriceInUSD(maximum: Block_Time)\n          Currency {\n            Name\n            Symbol\n            MintAddress\n            Decimals\n            Fungible\n            Uri\n          }\n        }\n      }\n    }\n  }\n}\n',
					variables: "{}",
				});

				let config = {
					method: "post",
					maxBodyLength: Infinity,
					url: "https://streaming.bitquery.io/eap",
					headers: {
						"Content-Type": "application/json",
						Authorization:
							`Bearer ${process.env.BITQUERY_API_TOKEN}`,
					},
					data: datax,
				};

				// axios
				// 	.request(config)
				// 	.then((response) => {
				// 		console.log(JSON.stringify(response.data,null,2));
				// 	})
				// 	.catch((error) => {
				// 		console.log(error);
				// 	});

		//const timestamp = new Date().getTime();
		const url = `https://advanced-api-v2.pump.fun/coins/list?sortBy=creationTime`;

	
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
