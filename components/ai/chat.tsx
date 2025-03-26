'use client'
import React from "react";
import { Message, useChat } from "@ai-sdk/react";
import Messages from "./messages";
import AiInput from "./ai-input";
import { toast } from "sonner"; 


interface ChatInterfaceProps {
	id?: string;
	initialMessages?: Message[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
	id = "default",
	initialMessages = [],
}) => {
	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		isLoading,
		stop,
		append,
	} = useChat({
		id,
		initialMessages,
		onFinish: () => {
			window.history.replaceState({}, "", `/chat/${id}`);
		},
		onError: (error) => {
			console.log(error)
			toast.error(`Error in chat: ${error.message}`);
		},
	});

	return (
		<div className="flex flex-col h-screen max-w-3xl mx-auto bg-white">
			<div className="flex-1 overflow-y-auto">
				<Messages messages={messages} isLoading={isLoading} />
			</div>
			<AiInput
				input={input}
				handleInputChange={handleInputChange}
				handleSubmit={handleSubmit}
				messages={messages}
				isLoading={isLoading}
				stop={stop}
				append={append}
			/>
		</div>
	);
};

export default ChatInterface;
