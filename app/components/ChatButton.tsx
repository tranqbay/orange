import { Icon } from '~/components/Icon/Icon'
import { Button } from './Button'
import { cn } from '~/utils/style'

interface ChatButtonProps {
	showChat: boolean
	toggleChat: () => void
	unreadCount?: number
	className?: string
}

export function ChatButton({ showChat, toggleChat, unreadCount = 0, className }: ChatButtonProps) {
	return (
		<div className="relative">
			<Button
				displayType={showChat ? 'primary' : 'secondary'}
				onClick={toggleChat}
				className={cn(
					'w-12 h-12 rounded-full shadow-sm',
					className
				)}
			>
				<Icon type="chat" />
			</Button>
			{unreadCount > 0 && !showChat && (
				<span className="absolute top-1 right-1 bg-meet_secondary_2 rounded-full w-2.5 h-2.5 animate-pulse" />
			)}
		</div>
	)
}
