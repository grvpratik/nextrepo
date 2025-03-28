"use client";
import React, { useEffect, useState } from "react";
import { createAppKit, SIWXMessage } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import {
	PhantomWalletAdapter,
	SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { solana } from "@reown/appkit/networks";
import { DefaultSIWX } from "@reown/appkit-siwx";
import { type SIWXConfig } from "@reown/appkit";

const siwx: SIWXConfig = {
	createMessage: async (input) => {
		// Generate a unique message with timestamp, domain, etc.
		const message =
			`Sign in to MyApp\n` +
			`Address: ${input.accountAddress}\n` +
			`Chain: ${input.chainId}\n` +
			`Nonce: ${Math.random().toString(36).substring(2)}\n` +
			`Issued At: ${new Date().toISOString()}`;

		return {
			...input,
			domain: "myapp.com",
			uri: "https://myapp.com/login",
			version: "1.0",
			nonce: Math.random().toString(36).substring(2),
			toString: () => message,
		};
	},

	addSession: async (session) => {
		console.log(session, "ADD");
		// Store session in local storage or database
		localStorage.setItem(
			`session_${session.data.chainId}`,
			JSON.stringify(session)
		);
	},

	revokeSession: async (chainId, address) => {
		// Remove specific session
		localStorage.removeItem(`session_${chainId}`);
	},

	setSessions: async (sessions) => {
		// Clear existing sessions and set new ones
		console.log(sessions, "Set");
		Object.keys(localStorage)
			.filter((key) => key.startsWith("session_"))
			.forEach((key) => localStorage.removeItem(key));

		sessions.forEach((session) => {
			localStorage.setItem(
				`session_${session.data.chainId}`,
				JSON.stringify(session)
			);
		});
	},

	getSessions: async (chainId, address) => {
		const sessionKey = `session_${chainId}`;
		const storedSession = localStorage.getItem(sessionKey);

		if (!storedSession) return [];

		try {
			const session = JSON.parse(storedSession);

			

			
			return  [session]
		} catch (error) {
			console.error("Session parsing error:", error);
			return [];
		}
	},
};
// Wallet Configuration
const solanaWeb3JsAdapter = new SolanaAdapter({
	wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
});

const metadata = {
	name: "Your Solana App",
	description: "Solana Wallet Connection Example",
	url: "http://localhost:3000",
	icons: ["https://yourapp.com/logo.png"],
};

// Initialize AppKit
createAppKit({
	adapters: [solanaWeb3JsAdapter],
	networks: [solana],
	metadata: metadata,
	projectId: "d593c206db1515e0a5b3a31dbcc16db7",
	siwx,
	features: {
		email: false,
		analytics: true,
		socials: ["google", "x", "discord"],
	},
	allWallets: "HIDE",
});

// Wrapper Component to Ensure AppKit is Initialized
export default function WalletProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [mount, setMount] = useState(false);
	useEffect(() => {
		setMount(true);
	}, []);
	if (!mount) return <div>loading</div>;

	return <>{children}</>;
}
