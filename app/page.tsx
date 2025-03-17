"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";

export default function ChatPage() {
	const { messages, input, handleInputChange, handleSubmit, isLoading } =
		useChat();
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to bottom when messages change
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	return (
		<div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
			<div className="w-full max-w-4xl mx-auto flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
				{/* Header */}
				<div className="border-b border-gray-200 dark:border-gray-700 p-4">
					<h1 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
						<Bot className="h-5 w-5" />
						AI Chatbot
					</h1>
				</div>

				{/* Chat Messages */}
				<div className="flex-1 overflow-y-auto p-4 space-y-4">
					{messages.length === 0 ? (
						<div className="flex items-center justify-center h-full">
							<div className="text-center text-gray-500 dark:text-gray-400">
								<Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<p className="text-lg font-medium">How can I help you today?</p>
								<p className="text-sm">Ask me anything!</p>
							</div>
						</div>
					) : (
						messages.map((message) => (
							<div
								key={message.id}
								className={`flex ${
									message.role === "user" ? "justify-end" : "justify-start"
								}`}
							>
								<div
									className={`
                  flex items-start gap-2 max-w-[80%]
                  ${message.role === "user" ? "flex-row-reverse" : ""}
                `}
								>
									<div
										className={`
                    flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center
                    ${
											message.role === "user"
												? "bg-blue-500"
												: "bg-gray-200 dark:bg-gray-700"
										}
                  `}
									>
										{message.role === "user" ? (
											<User className="h-5 w-5 text-white" />
										) : (
											<Bot className="h-5 w-5 text-gray-700 dark:text-gray-300" />
										)}
									</div>
									<div
										className={`
                    p-3 rounded-lg whitespace-pre-wrap
                    ${
											message.role === "user"
												? "bg-blue-500 text-white rounded-tr-none"
												: "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none"
										}
                  `}
									>
										{message.content}
									</div>
								</div>
							</div>
						))
					)}
					<div ref={messagesEndRef} />
				</div>

				{/* Input Form */}
				<div className="border-t border-gray-200 dark:border-gray-700 p-4">
					<form onSubmit={handleSubmit} className="flex w-full gap-2">
						<input
							type="text"
							value={input}
							onChange={handleInputChange}
							placeholder="Type your message..."
							className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
							disabled={isLoading}
						/>
						<button
							type="submit"
							disabled={isLoading || !input.trim()}
							className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<Send className="h-4 w-4" />
							<span className="sr-only">Send</span>
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
