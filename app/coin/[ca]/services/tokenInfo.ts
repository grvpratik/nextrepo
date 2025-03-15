import { Connection, PublicKey } from "@solana/web3.js";
import {
	Metaplex,
	Nft,
	NftWithToken,
	Sft,
	SftWithToken,
} from "@metaplex-foundation/js";
import { Mint, getMint } from "@solana/spl-token";
import { z } from "zod";

// Define Types
type TokenMetadata = Nft | NftWithToken | Sft | SftWithToken;

// Define validation schema for configuration
const ConfigSchema = z.object({
	connectionUrl: z.string().url(),
	connectionCommitment: z
		.enum(["processed", "confirmed", "finalized"])
		.default("confirmed"),
	retryAttempts: z.number().int().positive().default(3),
	retryDelay: z.number().int().positive().default(1000),
});

type Config = z.infer<typeof ConfigSchema>;

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
	offChainMetadata?: Record<string, any> | null;
}

/**
 * Custom error class for token metadata operations
 */
class TokenMetadataError extends Error {
	constructor(message: string, public originalError?: Error) {
		super(message);
		this.name = "TokenMetadataError";
		// Preserve the stack trace
		if (originalError && originalError.stack) {
			this.stack = originalError.stack;
		}
	}
}

/**
 * Fetches SPL token metadata from Solana
 * @param connection - Solana connection instance
 * @param mintAddress - The mint address of the token
 * @param options - Optional configuration
 * @returns Promise resolving to token data
 */
export async function getSPLTokenMetadata(
	connection: Connection,
	mintAddress: string | PublicKey,
	options: Partial<Config> = {}
): Promise<TokenData> {
	// Validate and set configuration
	let config: Config;
	try {
		config = ConfigSchema.parse({
			connectionUrl: connection.rpcEndpoint,
			connectionCommitment: connection.commitment || "confirmed",
			retryAttempts: 3,
			retryDelay: 1000,
			...options,
		});
	} catch (error) {
		throw new TokenMetadataError(
			`Invalid configuration: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}

	// Convert string address to PublicKey if needed
	let mint: PublicKey;
	try {
		mint =
			typeof mintAddress === "string"
				? new PublicKey(mintAddress)
				: mintAddress;
	} catch (error) {
		throw new TokenMetadataError(
			`Invalid mint address: ${mintAddress}`,
			error instanceof Error ? error : undefined
		);
	}

	// Initialize Metaplex
	const metaplex = new Metaplex(connection);

	// Create retry wrapper function
	async function withRetry<T>(
		operation: () => Promise<T>,
		operationName: string
	): Promise<T> {
		let lastError: Error | undefined;

		for (let attempt = 1; attempt <= config.retryAttempts; attempt++) {
			try {
				return await operation();
			} catch (error) {
				lastError = error instanceof Error ? error : new Error(String(error));
				console.warn(
					`Attempt ${attempt}/${config.retryAttempts} failed for ${operationName}: ${lastError.message}`
				);

				if (attempt < config.retryAttempts) {
					await new Promise((resolve) =>
						setTimeout(resolve, config.retryDelay)
					);
				}
			}
		}

		throw new TokenMetadataError(
			`All ${config.retryAttempts} attempts failed for ${operationName}`,
			lastError
		);
	}

	try {
		// Get basic mint information with retry
		const mintInfo = await withRetry<Mint>(
			() => getMint(connection, mint),
			"getMint"
		);

		// Get token metadata if it exists, with retry
		let tokenMetadata: TokenMetadata | null = null;
		try {
			tokenMetadata = await withRetry<TokenMetadata>(
				() => metaplex.nfts().findByMint({ mintAddress: mint }),
				"findByMint"
			);
		} catch (error) {
			// Specific error handling for metadata not found
			if (
				error instanceof Error &&
				error.message.includes("Account does not exist")
			) {
				console.info(
					"No metadata found for this token, using basic mint info only"
				);
			} else {
				console.warn("Error fetching token metadata:", error);
			}
		}

		// Construct the base response
		const response: TokenData = {
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
		};

		return response;
	} catch (error) {
		throw new TokenMetadataError(
			`Failed to fetch SPL token metadata: ${
				error instanceof Error ? error.message : String(error)
			}`,
			error instanceof Error ? error : undefined
		);
	}
}

/**
 * Fetches SPL token metadata including off-chain data
 * @param connection - Solana connection instance
 * @param mintAddress - The mint address of the token
 * @param options - Optional configuration
 * @returns Promise resolving to token data including off-chain metadata
 */
export async function getSPLTokenMetadataWithOffchain(
	connection: Connection,
	mintAddress: string | PublicKey,
	options: Partial<Config> = {}
): Promise<TokenData> {
	// First get the on-chain metadata
	const tokenData = await getSPLTokenMetadata(connection, mintAddress, options);

	// If there's metadata with a URI, fetch additional off-chain data
	if (tokenData.uri) {
		try {
			const response = await fetch(tokenData.uri, {
				headers: { Accept: "application/json" },
				signal: AbortSignal.timeout(10000), // 10 second timeout
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const jsonMetadata = await response.json();
			return {
				...tokenData,
				offChainMetadata: jsonMetadata,
			};
		} catch (error) {
			console.warn("Failed to fetch off-chain metadata:", error);
			// Return the on-chain data even if off-chain fetch fails
			return {
				...tokenData,
				offChainMetadata: null,
			};
		}
	}

	return tokenData;
}
