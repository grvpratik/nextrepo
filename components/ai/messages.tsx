import React from "react";

import { UserIcon, BotIcon } from "lucide-react";
import { Message } from "@ai-sdk/react";

interface MessagesProps {
	messages: Message[];
	isLoading?: boolean;
}

const Messages: React.FC<MessagesProps> = ({ messages, isLoading }) => {
	return (
		<div className="w-full px-4 pb-20 space-y-4 overflow-y-auto">
			{messages.map((message, index) => (
				<div
					key={index}
					className={`flex items-start space-x-3 ${
						message.role === "user" ? "justify-end" : "justify-start"
					}`}
				>
					{message.role === "assistant" && (
						<div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
							<BotIcon className="w-6 h-6 text-white" />
						</div>
					)}
					<div
						className={`p-3 rounded-lg max-w-[70%] ${
							message.role === "user"
								? "bg-blue-100 text-right"
								: "bg-gray-100 text-left"
						}`}
					>
						{message.content}
					</div>
					{message.role === "user" && (
						<div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
							<UserIcon className="w-6 h-6 text-white" />
						</div>
					)}
				</div>
			))}
			{isLoading && (
				<div className="flex justify-start items-center space-x-3">
					<div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
						<BotIcon className="w-6 h-6 text-white" />
					</div>
					<div className="bg-gray-100 p-3 rounded-lg animate-pulse">
						Typing...
					</div>
				</div>
			)}
		</div>
	);
};

export default Messages;
