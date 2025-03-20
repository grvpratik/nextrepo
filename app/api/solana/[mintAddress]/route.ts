// File: app/api/solana/token/[mintAddress]/route.ts

import { Connection, PublicKey } from "@solana/web3.js";
import {
	Metaplex,
	Nft,
	NftWithToken,
	Sft,
	SftWithToken,
} from "@metaplex-foundation/js";
import { Mint, getMint } from "@solana/spl-token";
import { NextRequest, NextResponse } from "next/server";

// Define error types
enum ErrorType {
	INVALID_PARAMS = "INVALID_PARAMS",
	NOT_FOUND = "NOT_FOUND",
	INTERNAL_ERROR = "INTERNAL_ERROR",
	RPC_ERROR = "RPC_ERROR",
}

// Define API response types
type ApiSuccessResponse = {
	success: true;
	data: TokenData;
};

type ApiErrorResponse = {
	success: false;
	error: {
		type: ErrorType;
		message: string;
	};
};

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

// Define Types
type TokenMetadata = Nft | NftWithToken | Sft | SftWithToken;

// Define return type for our function
interface TokenData {
	mint: string;
	decimals: number;
	supply: number;
	isInitialized: boolean;
	freezeAuthority: string | null;
	mintAuthority: string | null;
	name: string | null;
	symbol: string | null;
	uri: string | null;
	metadataAddress: string | null;
	creators: Creator[] | null;
	sellerFeeBasisPoints: number | null;
	collection: Collection | null;
	editionInfo: EditionInfo | null;
	uses: Uses | null;
	tokenStandard: string | null;
	offChainMetadata?: Record<string, any> | null;
}

interface Creator {
	address: string;
	verified: boolean;
	share: number;
}

interface Collection {
	address: string;
	verified: boolean;
}

interface EditionInfo {
	type: "Original" | "Print";
	supply?: number;
	maxSupply?: number;
	editionNumber?: number;
}

interface Uses {
	remaining: number;
	total: number;
}

// Configure cache settings
export const dynamic = "force-dynamic"; // This makes the route dynamic by default
// Change to 'auto' if you want to enable caching

/**
 * API handler for fetching Solana token metadata
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: { mintAddress: string } }
) {
	// Get mint address from URL params
	const { mintAddress } = params;

	// Get search parameters
	const searchParams = request.nextUrl.searchParams;
	const includeOffchain = searchParams.get("includeOffchain") !== "false";
	const rpcUrl =
		searchParams.get("rpcUrl") ||
		process.env.SOLANA_RPC_URL ||
		"https://api.mainnet-beta.solana.com";
	const commitment = searchParams.get("commitment") || "confirmed";

	// Validate mint address
	if (!mintAddress || typeof mintAddress !== "string") {
		return NextResponse.json(
			{
				success: false,
				error: {
					type: ErrorType.INVALID_PARAMS,
					message: "Missing or invalid mint address",
				},
			} as ApiErrorResponse,
			{ status: 400 }
		);
	}

	try {
		// Validate the mint address is a valid public key
		const mint = new PublicKey(mintAddress);

		// Initialize connection to Solana
		const connection = new Connection(rpcUrl, commitment as any);

		// Initialize Metaplex instance
		const metaplex = new Metaplex(connection);

		try {
			// Get token data
			const tokenData = await fetchTokenData(
				connection,
				metaplex,
				mint,
				includeOffchain
			);

			// Return success response with caching headers
			return NextResponse.json(
				{
					success: true,
					data: tokenData,
				} as ApiSuccessResponse,
				{
					status: 200,
					headers: {
						"Cache-Control":
							"max-age=60, s-maxage=300, stale-while-revalidate=600",
					},
				}
			);
		} catch (error: any) {
			// Handle specific errors
			if (error.message?.includes("Account does not exist")) {
				return NextResponse.json(
					{
						success: false,
						error: {
							type: ErrorType.NOT_FOUND,
							message: `Token with mint address ${mintAddress} not found`,
						},
					} as ApiErrorResponse,
					{ status: 404 }
				);
			}

			// Handle RPC errors
			if (
				error.message?.includes("failed to get info about account") ||
				error.message?.includes("Connection error")
			) {
				return NextResponse.json(
					{
						success: false,
						error: {
							type: ErrorType.RPC_ERROR,
							message: `Error connecting to Solana RPC: ${error.message}`,
						},
					} as ApiErrorResponse,
					{ status: 502 }
				);
			}

			// Generic internal error
			console.error("API Error:", error);
			return NextResponse.json(
				{
					success: false,
					error: {
						type: ErrorType.INTERNAL_ERROR,
						message: `An internal error occurred: ${
							error.message || "Unknown error"
						}`,
					},
				} as ApiErrorResponse,
				{ status: 500 }
			);
		}
	} catch (error: any) {
		// Handle invalid public key
		if (error.message?.includes("Invalid public key")) {
			return NextResponse.json(
				{
					success: false,
					error: {
						type: ErrorType.INVALID_PARAMS,
						message: `Invalid mint address: ${mintAddress}`,
					},
				} as ApiErrorResponse,
				{ status: 400 }
			);
		}

		// Generic error
		console.error("API Error:", error);
		return NextResponse.json(
			{
				success: false,
				error: {
					type: ErrorType.INTERNAL_ERROR,
					message: `An internal error occurred: ${
						error.message || "Unknown error"
					}`,
				},
			} as ApiErrorResponse,
			{ status: 500 }
		);
	}
}

/**
 * Fetches comprehensive token data from Solana
 */
async function fetchTokenData(
	connection: Connection,
	metaplex: Metaplex,
	mint: PublicKey,
	includeOffchain: boolean
): Promise<TokenData> {
	// Get basic mint information
	const mintInfo = await getMint(connection, mint);

	// Try to get token metadata
	let tokenMetadata: TokenMetadata | null = null;
	try {
		tokenMetadata = await metaplex.nfts().findByMint({ mintAddress: mint });
	} catch (error) {
		// Handle missing metadata gracefully
		console.info(
			"No metadata found for this token, using basic mint info only"
		);
	}

	// Process creators info if available
	const creators =
		tokenMetadata?.creators?.map((creator) => ({
			address: creator.address.toString(),
			verified: creator.verified,
			share: creator.share,
		})) || null;

	// Process collection info if available
	const collection = tokenMetadata?.collection
		? {
				address: tokenMetadata.collection.address.toString(),
				verified: tokenMetadata.collection.verified,
		  }
		: null;

	// Process edition info if available
	let editionInfo: EditionInfo | null = null;
	if (tokenMetadata?.editionNonce !== null) {
		try {
			// Check if it's a master edition
			if (tokenMetadata?.edition?.isOriginal) {
				editionInfo = {
					type: "Original",
					supply: tokenMetadata?.edition?.supply?.toNumber() || 0,
					maxSupply: tokenMetadata?.edition?.maxSupply?.toNumber() || undefined,
				};
			} else {
				// It's a print edition
				editionInfo = {
					type: "Print",
					editionNumber: tokenMetadata?.edition?.number?.toNumber() || 0,
				};
			}
		} catch (error) {
			console.warn("Error processing edition info:", error);
		}
	}

	// Process uses info
	const uses = tokenMetadata?.uses
		? {
				remaining: tokenMetadata.uses.remaining.toNumber(),
				total: tokenMetadata.uses.total.toNumber(),
		  }
		: null;

	// Construct the token data response
	const tokenData: TokenData = {
		mint: mint.toString(),
		decimals: mintInfo.decimals,
		supply: Number(mintInfo.supply) / Math.pow(10, mintInfo.decimals),
		isInitialized: mintInfo.isInitialized,
		freezeAuthority: mintInfo.freezeAuthority?.toString() || null,
		mintAuthority: mintInfo.mintAuthority?.toString() || null,
		name: tokenMetadata?.name || null,
		symbol: tokenMetadata?.symbol || null,
		uri: tokenMetadata?.uri || null,
		metadataAddress: tokenMetadata?.address.toString() || null,
		creators,
		sellerFeeBasisPoints: tokenMetadata?.sellerFeeBasisPoints || null,
		collection,
		editionInfo,
		uses,
		tokenStandard: tokenMetadata?.tokenStandard || null,
	};

	// Fetch off-chain metadata if requested and a URI is available
	if (includeOffchain && tokenData.uri) {
		try {
			const response = await fetch(tokenData.uri, {
				headers: { Accept: "application/json" },
				signal: AbortSignal.timeout(5000), // 5 second timeout
			});

			if (response.ok) {
				const jsonMetadata = await response.json();
				tokenData.offChainMetadata = jsonMetadata;
			}
		} catch (error) {
			console.warn("Failed to fetch off-chain metadata:", error);
			// Continue without off-chain metadata
		}
	}

	return tokenData;
}

async function getTokenCreatedByWallet(params) {
	let data = JSON.stringify({
		query:
			'query MyQuery {\n  Solana {\n    TokenSupplyUpdates(\n      where: {Transaction: {Result: {Success: true}, Signer: {is: "8uydUdb3DiQijXPDfzwuJCNiqfFQzCzinFDXRFHQQgCB"}}, Instruction: {Program: {Address: {is: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"}, Method: {is: "create"}}}}\n    ) {\n      Block {\n        Time\n      }\n      TokenSupplyUpdate {\n        Amount\n        Currency {\n          Uri\n          UpdateAuthority\n          Symbol\n          Name\n          MintAddress\n          MetadataAddress\n          Fungible\n          Decimals\n        }\n        PostBalance\n      }\n      Transaction {\n        Signature\n        Signer\n      }\n    }\n  }\n}\n',
		variables: "{}",
	});

	let config = {
		method: "post",
		maxBodyLength: Infinity,
		url: "https://streaming.bitquery.io/eap",
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
}
