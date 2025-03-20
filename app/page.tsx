"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, ChevronDown } from "lucide-react";
import { PromptInputBasic } from "@/components/chat-input";

// Define available models
const MODELS = [
	{ id: "openai:gpt-4o", name: "GPT-4o", provider: "OpenAI" },
	{ id: "openai:gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" },
	{ id: "google:gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "Google" },
	{
		id: "google:gemini-2.0-flash-exp",
		name: "Gemini 2.0 Flash",
		provider: "Google",
	},
];

export default function ChatPage() {
	const [selectedModel, setSelectedModel] = useState(MODELS[0]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		isLoading,
		
		reload,
	} = useChat({
		api: "/api/chat",
		body: {
			model: selectedModel.id,
		},
		onError: (error) => {
			console.error("Chat error:", error);
		},
	});
console.log({
	messages,
	input,
	handleInputChange,
	handleSubmit,
	isLoading,
	reload,
});
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to bottom when messages change
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	// Handle model change
	const handleModelChange = (model: (typeof MODELS)[0]) => {
		setSelectedModel(model);
		setIsDropdownOpen(false);

		// Reload the chat with the new model if there are messages
		if (messages.length > 0) {
			reload();
		}
	};

	return (
		<div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
			<div className="w-full max-w-4xl mx-auto flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
				{/* Header with Model Selector */}
				<div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
					<h1 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
						<Bot className="h-5 w-5" />
						AI Chatbot
					</h1>

					{/* Model Selector Dropdown */}
					<div className="relative">
						<button
							type="button"
							className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
							onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						>
							<span>{selectedModel.name}</span>
							<ChevronDown className="h-4 w-4" />
						</button>

						{isDropdownOpen && (
							<div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
								<div className="py-1">
									{MODELS.map((model) => (
										<button
											key={model.id}
											className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center ${
												selectedModel.id === model.id
													? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
													: "text-gray-700 dark:text-gray-200"
											}`}
											onClick={() => handleModelChange(model)}
										>
											<span>{model.name}</span>
											<span className="text-xs text-gray-500 dark:text-gray-400">
												{model.provider}
											</span>
										</button>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
<PromptInputBasic/>
				{/* Chat Messages */}
				<div className="flex-1 overflow-y-auto p-4 space-y-4">
					{messages.length === 0 ? (
						<div className="flex items-center justify-center h-full">
							<div className="text-center text-gray-500 dark:text-gray-400">
								<Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<p className="text-lg font-medium">How can I help you today?</p>
								<p className="text-sm">
									Ask me anything using {selectedModel.name}!
								</p>
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
							placeholder={`Ask ${selectedModel.name} something...`}
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
