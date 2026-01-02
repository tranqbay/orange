import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from 'react'
import type { ChatMessage } from '~/types/Messages'
import { cn } from '~/utils/style'
import { Button } from '~/components/Button'

interface ChatProps {
	showChat: boolean
	toggleChat: () => void
	messages: ChatMessage[]
	onSendMessage: (message: string) => void
	currentUserId?: string
}

export default function Chat({
	showChat,
	toggleChat,
	messages,
	onSendMessage,
	currentUserId,
}: ChatProps) {
	const [inputValue, setInputValue] = useState('')
	const messagesEndRef = useRef<HTMLDivElement>(null)

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value)
	}

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!inputValue.trim()) return
		onSendMessage(inputValue)
		setInputValue('')
	}

	if (!showChat) return null

	return (
		<div className="fixed right-0 top-0 bottom-[72px] w-80 bg-white border-l border-meet_grey_6 flex flex-col z-40 shadow-xl">
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-3 border-b border-meet_grey_6">
				<h3 className="text-meet_text_1 font-medium">In-call messages</h3>
				<Button
					displayType="ghost"
					onClick={toggleChat}
					className="text-meet_text_2 hover:text-meet_text_1 hover:bg-meet_grey_5 rounded-full w-8 h-8 p-0"
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</Button>
			</div>

			{/* Messages area */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-meet_text_2 text-sm">
							Messages can only be seen by people in the call and are deleted when the call ends.
						</p>
					</div>
				) : (
					messages.map((message) => (
						<div key={message.id} className="space-y-1">
							<span className={cn(
								"text-xs font-medium",
								message.fromId === currentUserId ? "text-meet_secondary_1" : "text-meet_primary_1"
							)}>
								{message.from}
								{message.fromId === currentUserId && " (You)"}
							</span>
							<p className="text-sm text-meet_text_1 bg-meet_primary_2 rounded-lg px-3 py-2">
								{message.message}
							</p>
						</div>
					))
				)}
				<div ref={messagesEndRef} />
			</div>

			{/* Input area */}
			<div className="p-4 border-t border-meet_grey_6">
				<form className="flex gap-2" onSubmit={handleSubmit}>
					<input
						className="flex-1 bg-meet_grey_5 border border-meet_grey_6 rounded-full px-4 py-2 text-sm text-meet_text_1 placeholder:text-meet_text_2 focus:outline-none focus:ring-2 focus:ring-meet_primary_1/30 focus:border-meet_primary_1"
						type="text"
						placeholder="Send a message to everyone"
						value={inputValue}
						onChange={handleChange}
					/>
					<Button
						type="submit"
						className="rounded-full bg-meet_primary_1 hover:bg-meet_primary_1/90 text-white w-10 h-10 p-0"
					>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
							<path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
						</svg>
					</Button>
				</form>
			</div>
		</div>
	)
}
