"use client";
import React, { useEffect } from "react";
import { createPhantom, Position } from "@phantom/wallet-sdk";
import { useAppKit } from "@reown/appkit/react";
import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import {
	PhantomWalletAdapter,
	SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

// 0. Set up Solana Adapter
const solanaWeb3JsAdapter = new SolanaAdapter({
	wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
});

// 1. Get projectId from https://cloud.reown.com
const projectId = process.env;
console.log(projectId,"id")
// 2. Create a metadata object - optional
const metadata = {
	name: "AppKit",
	description: "AppKit Solana Example",
	url: "https://example.com", // origin must match your domain & subdomain
	icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// 3. Create modal
createAppKit({
	adapters: [solanaWeb3JsAdapter],
	networks: [solana],
	metadata: metadata,
	projectId,
	features: {
		email: false,
		analytics: true,
		socials: ["google", "x", "discord"],
	},
	allWallets: "HIDE", // Optional - defaults to your Cloud configuration
});
// // Initialize the Phantom wallet as a popup
// async function wallet() {
// 	// console.log(window.solana)
// 	const phantom = await createPhantom({
// 		position: Position.bottomRight, // Choose from bottomRight, bottomLeft, topRight, topLeft
// 		namespace: "app",
// 	});

// 	phantom.show();
// }
// Show the wallet UI
const EmbededWallet = () => {
	// useEffect(() => {
	// 	const isPhantomInstalled = window.phantom?.solana?.isPhantom;
	// 	console.log(isPhantomInstalled);
	// 	wallet();
	// }, []);
	const { open } = useAppKit();
	return (
		<div className="relative " id="embeded">
			<button onClick={() => open()}>Open Connect Modal</button>
			<button
				onClick={() => open({ view: "Networks" })}
			></button>
		</div>
	);
};

export default EmbededWallet;
