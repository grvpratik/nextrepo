import { Message } from "ai";
import React from "react";
import Messages from "./messages";
import AiInput from "./ai-input";

const ChatInterface = ({
	id,
	saved = [],
}: {
	id: string;
	saved?: Message[];
}) => {
	return (
		<div className=" items-center mx-auto max-w-3xl h-full">
			<Messages />
			<AiInput messages={[]}/>
		</div>
	);
};

export default ChatInterface;
