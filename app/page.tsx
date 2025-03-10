import React from 'react'
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import EmbededWallet from '@/components/embeded-wallet';
import PumpFunExplore from '@/components/pumpfun-explore';

const HomePage = async() => {
	const result = await generateText({
		model: google("gemini-2.0-flash-exp"),
		messages: [
			{
				role: "user",
				content: [
					{
						type: "text",
						text: "What is an embedding model",
					},
					
				],
			},
		],
	});

// console.log(result.text);
  return (
		<div>
			{" "}
			<div className="flex bg-green-100 h-full flex-col p-4 items-center gap-4">
				home page  
				
		
				
				<EmbededWallet/>
				<PumpFunExplore />
			</div>
		</div>
	);
}

export default HomePage