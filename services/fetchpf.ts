//frontend api
//helius websocket
//websocket
//rpc ?
//bitquery


// 1.pf
fetch("https://advanced-api-v2.pump.fun/coins/about-to-graduate", {
	headers: {
		accept: "*/*",
		"accept-language": "en-US,en;q=0.7",
		"if-none-match": 'W/"f01-4qANKxFilnCg0g063FAi7MypACA"',
		priority: "u=1, i",
		"sec-ch-ua": '"Chromium";v="134", "Not:A-Brand";v="24", "Brave";v="134"',
		"sec-ch-ua-mobile": "?0",
		"sec-ch-ua-platform": '"Windows"',
		"sec-fetch-dest": "empty",
		"sec-fetch-mode": "cors",
		"sec-fetch-site": "same-site",
		"sec-gpc": "1",
	},
	referrer: "https://pump.fun/",
	referrerPolicy: "strict-origin-when-cross-origin",
	body: null,
	method: "GET",
	mode: "cors",
	credentials: "omit",
    cache:'no-cache'
});

fetch("https://advanced-api-v2.pump.fun/coins/list?sortBy=creationTime", {
	headers: {
		accept: "*/*",
		"accept-language": "en-US,en;q=0.7",
		"if-none-match": 'W/"c5ac-+c8nMC7XDtnF/9E3cfTR2zA8W2A"',
		priority: "u=1, i",
		"sec-ch-ua": '"Chromium";v="134", "Not:A-Brand";v="24", "Brave";v="134"',
		"sec-ch-ua-mobile": "?0",
		"sec-ch-ua-platform": '"Windows"',
		"sec-fetch-dest": "empty",
		"sec-fetch-mode": "cors",
		"sec-fetch-site": "same-site",
		"sec-gpc": "1",
	},
	referrer: "https://pump.fun/",
	referrerPolicy: "strict-origin-when-cross-origin",
	body: null,
	method: "GET",
	mode: "cors",
	credentials: "omit",
});

fetch("https://advanced-api-v2.pump.fun/coins/featured", {
	headers: {
		accept: "*/*",
		"accept-language": "en-US,en;q=0.7",
		"if-none-match": 'W/"12060-+HTtqYU/+LI3fpEIym+lGM5Xfhw"',
		priority: "u=1, i",
		"sec-ch-ua": '"Chromium";v="134", "Not:A-Brand";v="24", "Brave";v="134"',
		"sec-ch-ua-mobile": "?0",
		"sec-ch-ua-platform": '"Windows"',
		"sec-fetch-dest": "empty",
		"sec-fetch-mode": "cors",
		"sec-fetch-site": "same-site",
		"sec-gpc": "1",
	},
	referrer: "https://pump.fun/",
	referrerPolicy: "strict-origin-when-cross-origin",
	body: null,
	method: "GET",
	mode: "cors",
	credentials: "omit",
});

//2.helis websocket

//3.websocket


//4.bitquery
//10k marketcap
const axios = require("axios");
let data = JSON.stringify({
	query:
		'{\n  Solana {\n    DEXTrades(\n      limitBy: {by: Trade_Buy_Currency_MintAddress, count: 1}\n      limit: {count: 10}\n      orderBy: {descending: Trade_Buy_Price}\n      where: {Trade: {Dex: {ProtocolName: {is: "pump"}}, Buy: {Currency: {MintAddress: {notIn: ["11111111111111111111111111111111"]}}, PriceInUSD: {gt: 0.00001}}, Sell: {AmountInUSD: {gt: "10"}}}, Transaction: {Result: {Success: true}}, Block: {Time: {since: "2025-02-21T05:05:00Z"}}}\n    ) {\n      Trade {\n        Buy {\n          Price(maximum: Block_Time)\n          PriceInUSD(maximum: Block_Time)\n          Currency {\n            Name\n            Symbol\n            MintAddress\n            Decimals\n            Fungible\n            Uri\n          }\n        }\n      }\n    }\n  }\n}\n',
	variables: "{}",
});

let config = {
	method: "post",
	maxBodyLength: Infinity,
	url: "https://streaming.bitquery.io/graphql",
	headers: {
		"Content-Type": "application/json",
		Authorization: "Bearer undefined",
	},
	data: data,
};

axios
	.request(config)
	.then((response) => {
		console.log(JSON.stringify(response.data));
	})
	.catch((error) => {
		console.log(error);
	});