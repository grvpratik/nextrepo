'use client'
import React from "react";
import { cn } from "@/lib/cn";

import { SoupIcon, SendIcon } from "lucide-react";
import { Message } from "@ai-sdk/react";

interface AiInputProps {
	input: string;
	handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	isLoading: boolean;
	messages: Message[];
	stop: () => void;
	append: (message: Partial<Message>) => void;
}

const AiInput: React.FC<AiInputProps> = ({
	input,
	handleInputChange,
	handleSubmit,
	isLoading,
	stop,
	append,
}) => {
	return (
		<div
			className={cn(
				"mx-auto px-4 flex items-center justify-center w-full fixed bottom-0 left-0 right-0 py-4  shadow-lg"
			)}
		>
			<div className="max-w-3xl mx-auto relative w-full flex flex-col space-x-2">
				<form onSubmit={handleSubmit} className="flex-1 flex space-x-2">
					<textarea
						value={input}
						onChange={handleInputChange}
						placeholder="Type your message..."
						className="flex-1 p-2 border rounded-lg resize-none min-h-[50px] max-h-[150px]"
						rows={1}
					/>
					{isLoading ? (
						<button
							type="button"
							onClick={stop}
							className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
						>
							<SoupIcon className="w-6 h-6" />
						</button>
					) : (
						<button
							type="submit"
							disabled={input.trim() === ""}
							className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
						>
							<SendIcon className="w-6 h-6" />
						</button>
					)}
				</form>
				<div>list</div>
			</div>
		</div>
	);
};

export default AiInput;
