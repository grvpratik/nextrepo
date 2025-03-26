"use client";
import React, { useState } from "react";

import {
	FeatherIcon,
	CalculatorIcon,
	CurrencyIcon,
	SendIcon,
	SoupIcon,
	SparklesIcon,
} from "lucide-react";
import { useChat } from "@ai-sdk/react";

// Tool button component
const ToolButton = ({
	icon: Icon,
	label,
	onClick,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	onClick: () => void;
}) => (
	<button
		onClick={onClick}
		className="flex items-center space-x-2 bg-blue-100 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors"
	>
		<Icon className="w-5 h-5" />
		<span className="text-sm">{label}</span>
	</button>
);

// Tool Calling Chat Interface
const ToolCallingChat = () => {
	const [selectedTool, setSelectedTool] = useState<string | null>(null);
	const [toolInputs, setToolInputs] = useState<{ [key: string]: string }>({
		weatherLocation: "",
		currencyAmount: "",
		currencyFrom: "",
		currencyTo: "",
		calculatorExpression: "",
	});

	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		append,
		isLoading,
	} = useChat({
		api: "/api/chat",
	});

	// Handle tool-specific input changes
	const handleToolInputChange = (tool: string, value: string) => {
		setToolInputs((prev) => ({
			...prev,
			[tool]: value,
		}));
	};

	// Trigger tool-specific actions
	const triggerTool = (tool: string) => {
		let toolMessage = "";
		switch (tool) {
			case "weather":
				toolMessage = `What's the weather in ${toolInputs.weatherLocation}?`;
				break;
			case "currency":
				toolMessage = `Convert ${toolInputs.currencyAmount} ${toolInputs.currencyFrom} to ${toolInputs.currencyTo}`;
				break;
			case "calculator":
				toolMessage = `Calculate ${toolInputs.calculatorExpression}`;
				break;
		}

		append({
			role: "user",
			content: toolMessage,
		});
		setSelectedTool(null);
	};

	// Render tool input modal
	const renderToolInput = () => {
		switch (selectedTool) {
			case "weather":
				return (
					<div className="p-4 bg-white shadow-lg rounded-lg">
						<h3 className="text-lg font-semibold mb-3 flex items-center">
							<FeatherIcon className="mr-2 w-6 h-6 text-blue-500" />
							Weather Lookup
						</h3>
						<input
							type="text"
							value={toolInputs.weatherLocation}
							onChange={(e) =>
								handleToolInputChange("weatherLocation", e.target.value)
							}
							placeholder="Enter city (e.g., New York, USA)"
							className="w-full p-2 border rounded-lg mb-3"
						/>
						<button
							onClick={() => triggerTool("weather")}
							className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
						>
							Get Weather
						</button>
					</div>
				);
			case "currency":
				return (
					<div className="p-4 bg-white shadow-lg rounded-lg">
						<h3 className="text-lg font-semibold mb-3 flex items-center">
							<CurrencyIcon className="mr-2 w-6 h-6 text-green-500" />
							Currency Converter
						</h3>
						<div className="space-y-3">
							<input
								type="number"
								value={toolInputs.currencyAmount}
								onChange={(e) =>
									handleToolInputChange("currencyAmount", e.target.value)
								}
								placeholder="Amount"
								className="w-full p-2 border rounded-lg"
							/>
							<div className="flex space-x-2">
								<input
									type="text"
									value={toolInputs.currencyFrom}
									onChange={(e) =>
										handleToolInputChange("currencyFrom", e.target.value)
									}
									placeholder="From (USD)"
									className="w-1/2 p-2 border rounded-lg"
								/>
								<input
									type="text"
									value={toolInputs.currencyTo}
									onChange={(e) =>
										handleToolInputChange("currencyTo", e.target.value)
									}
									placeholder="To (EUR)"
									className="w-1/2 p-2 border rounded-lg"
								/>
							</div>
							<button
								onClick={() => triggerTool("currency")}
								className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
							>
								Convert
							</button>
						</div>
					</div>
				);
			case "calculator":
				return (
					<div className="p-4 bg-white shadow-lg rounded-lg">
						<h3 className="text-lg font-semibold mb-3 flex items-center">
							<CalculatorIcon className="mr-2 w-6 h-6 text-purple-500" />
							Calculator
						</h3>
						<input
							type="text"
							value={toolInputs.calculatorExpression}
							onChange={(e) =>
								handleToolInputChange("calculatorExpression", e.target.value)
							}
							placeholder="Enter calculation (e.g., 5*7+3)"
							className="w-full p-2 border rounded-lg mb-3"
						/>
						<button
							onClick={() => triggerTool("calculator")}
							className="w-full bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600"
						>
							Calculate
						</button>
					</div>
				);
			default:
				return null;
		}
	};

	// Loading indicator with animated dots
	const LoadingIndicator = () => (
		<div className="flex items-center space-x-2 text-blue-500 animate-pulse">
			<SparklesIcon className="w-6 h-6" />
			<span>AI is thinking</span>
			<span className="animate-bounce">...</span>
			{messages.map((message) =>
				message.parts.map((part, i) => {
					switch (part.type) {
					
						case "tool-invocation":
							return <div className="animate-bounce" key={i}>{part.toolInvocation.toolName}...</div>;
					
					}
				})
			)}
		</div>
	);
  console.log(messages);
	return (
		<div className="max-w-2xl mx-auto p-4 bg-gray-50 min-h-screen">
			{/* Tool Selection Buttons */}
			<div className="mb-4 flex space-x-3 justify-center">
				<ToolButton
					icon={FeatherIcon}
					label="Weather"
					onClick={() => setSelectedTool("weather")}
				/>
				<ToolButton
					icon={CurrencyIcon}
					label="Currency"
					onClick={() => setSelectedTool("currency")}
				/>
				<ToolButton
					icon={CalculatorIcon}
					label="Calculator"
					onClick={() => setSelectedTool("calculator")}
				/>
			</div>

			{/* Tool Input Modal */}
			{selectedTool && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="relative w-full max-w-md">
						{renderToolInput()}
						<button
							onClick={() => setSelectedTool(null)}
							className="absolute -top-10 right-0 text-white bg-red-500 rounded-full p-2 hover:bg-red-600"
						>
							✕
						</button>
					</div>
				</div>
			)}

			{/* Messages Container */}
			<div className="bg-white rounded-lg shadow-md p-4 mb-4 min-h-[400px] max-h-[600px] overflow-y-auto">
				{messages.map((message, index) => (
                  
					<div
						key={index}
						className={`mb-4 p-3 rounded-lg ${
							message.role === "user"
								? "bg-blue-100 text-right"
								: "bg-gray-100 text-left"
						}`}
					>
						{message.content}
					</div>
				))}

				{/* Loading State */}
				{isLoading && <LoadingIndicator />}
			</div>

			{/* Chat Input */}
			<form onSubmit={handleSubmit} className="flex space-x-2">
				<input
					value={input}
					onChange={handleInputChange}
					placeholder="Type your message or use a tool..."
					className="flex-1 p-3 border rounded-lg"
				/>
				{isLoading ? (
					<button
						type="button"
						className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
					>
						<SoupIcon />
					</button>
				) : (
					<button
						type="submit"
						className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
					>
						<SendIcon />
					</button>
				)}
			</form>
		</div>
	);
};

export default ToolCallingChat;
