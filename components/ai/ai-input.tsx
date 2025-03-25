import { cn } from '@/lib/cn';
import { Message } from 'ai';
import React from 'react'
interface AiInputInterface {
	input: string;
	handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	isLoading: boolean;
	messages: Message[];
	setMessages: (messages: Message[]) => void;
	query?: string;
	stop: () => void;
	append: (message: any) => void;
	models?: any;
}
const AiInput = ({
	input,
	handleInputChange,
	handleSubmit,
	isLoading,
	messages,
	setMessages,
	
	stop,
	append,
	models,
}:AiInputInterface) => {
	return (
		<div
			className={cn(
				"mx-auto w-full",
				Array.isArray(messages) && messages.length > 0
					? "fixed bottom-0 left-0 right-0 bg-background"
					: "fixed bottom-8 left-0 right-0 top-6 flex flex-col items-center justify-center"
			)}
		>
			AiInput
		</div>
	);
};

export default AiInput