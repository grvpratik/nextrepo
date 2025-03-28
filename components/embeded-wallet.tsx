"use client";
import React, { useState } from "react";
import {
	useAppKit,
	useAppKitAccount,
	useAppKitNetwork,
	useAppKitState,
	useAppKitTheme,
	useAppKitEvents,
	useDisconnect,
	useWalletInfo,
} from "@reown/appkit/react";

const WalletManager = () => {
	// Hooks from AppKit
	const { open, close } = useAppKit();
	const { address, isConnected, caipAddress, status, embeddedWalletInfo } =
		useAppKitAccount();
	const { caipNetwork, caipNetworkId, chainId, switchNetwork } =
		useAppKitNetwork();
	const { open: modalOpen, selectedNetworkId } = useAppKitState();
	const { themeMode, setThemeMode } = useAppKitTheme();
	const events = useAppKitEvents();
	const { disconnect } = useDisconnect();
	const { walletInfo } = useWalletInfo();
console.log(walletInfo)
	// Theme toggle
	const toggleTheme = () => {
		setThemeMode(themeMode === "dark" ? "light" : "dark");
	};

	// Formatted address display
	const formatAddress = (addr?: string) => {
		if (!addr) return "Not Connected";
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	};

	return (
		<div className="w-full max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
			<h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>

			{/* Connection Status */}
			<div className="mb-4">
				<p>Connection Status: {status}</p>
				<p>Address: {formatAddress(address)}</p>
				{caipNetwork && (
					<p>
						Network: {caipNetwork.name} (Chain ID: {chainId})
					</p>
				)}
			</div>

			{/* Wallet Actions */}
			<div className="space-y-2">
				{!isConnected ? (
					<appkit-connect-button/>
				) : (
					<>
						<appkit-button balance="hide"/>
						{/* <appkit-network-button/> */}
						<button
							onClick={disconnect}
							className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
						>
							Disconnect
						</button>
					</>
				)}
			</div>

			{/* Additional Options */}
			<div className="mt-4">
				<button
					onClick={toggleTheme}
					className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
				>
					Toggle {themeMode === "dark" ? "Light" : "Dark"} Mode
				</button>
			</div>

			{/* Debugging Information */}
			{isConnected && embeddedWalletInfo && (
				<div className="mt-4 text-xs text-gray-600">
					<p>Wallet Type: {embeddedWalletInfo.accountType}</p>
					<p>Auth Provider: {embeddedWalletInfo.authProvider}</p>
				</div>
			)}
		</div>
	);
};

export default WalletManager;
