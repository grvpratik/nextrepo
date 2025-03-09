"use client";
import React, { useEffect } from "react";
import { createPhantom, Position } from "@phantom/wallet-sdk";

// Initialize the Phantom wallet as a popup
async function wallet() {
            // console.log(window.solana)
			const phantom = await createPhantom({
				position: Position.bottomRight, // Choose from bottomRight, bottomLeft, topRight, topLeft
				
				
			});
           
			phantom.show();
		}
// Show the wallet UI
const EmbededWallet =  () => {
	useEffect(() => {
        const isPhantomInstalled = window.phantom?.solana?.isPhantom;
		 console.log(isPhantomInstalled);
		wallet();
	}, []);

	return (
	
			<div className="relative h-44 w-44 overflow-hidden" id="embeded">
				EmbededWallet <button>open</button>
			</div>
		
	);
};

export default EmbededWallet;
