import { useState, useEffect } from 'react'
import { Button } from '~/components/Button'
import { cn } from '~/utils/style'

interface ReconnectingOverlayProps {
	attemptNumber: number
	maxAttempts: number
	onRetry?: () => void
}

export default function ReconnectingOverlay({
	attemptNumber,
	maxAttempts,
	onRetry,
}: ReconnectingOverlayProps) {
	const [isCollapsed, setIsCollapsed] = useState(false)

	// Auto-collapse after 10 seconds
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsCollapsed(true)
		}, 10000)

		return () => clearTimeout(timer)
	}, [])

	if (isCollapsed) {
		return (
			<div
				className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-meet_secondary_1 text-white px-4 py-2 rounded-full shadow-lg cursor-pointer flex items-center gap-3"
				onClick={() => setIsCollapsed(false)}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault()
						setIsCollapsed(false)
					}
				}}
				role="button"
				tabIndex={0}
				aria-label="Expand reconnecting banner"
			>
				<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
				<span className="text-sm font-medium">Reconnecting...</span>
				<button
					type="button"
					className="h-5 w-5 text-white/80 hover:text-white hover:bg-white/10 rounded flex items-center justify-center"
					onClick={(e) => {
						e.stopPropagation()
						setIsCollapsed(false)
					}}
					aria-label="Expand reconnecting details"
				>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
						<path d="M7 10l5 5 5-5H7z" />
					</svg>
				</button>
			</div>
		)
	}

	return (
		<div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-meet_secondary_1 text-white px-5 py-3 rounded-xl shadow-xl min-w-[320px]">
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
					<div>
						<div className="font-medium text-sm">Connection Lost</div>
						<div className="text-xs text-white/70">Reconnecting to your session...</div>
					</div>
				</div>

				<div className="flex items-center gap-3">
					{attemptNumber > 0 && (
						<div className="flex items-center gap-2">
							<div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden">
								<div
									className="h-full bg-white rounded-full transition-all duration-300"
									style={{ width: `${(attemptNumber / maxAttempts) * 100}%` }}
								/>
							</div>
							<span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded">
								{attemptNumber}/{maxAttempts}
							</span>
						</div>
					)}

					{onRetry && (
						<Button
							displayType="secondary"
							className="h-7 px-3 text-xs bg-white/20 border-0 text-white hover:bg-white/30"
							onClick={onRetry}
						>
							Retry Now
						</Button>
					)}

					<button
						type="button"
						className="h-6 w-6 text-white/80 hover:text-white hover:bg-white/10 rounded flex items-center justify-center"
						onClick={() => setIsCollapsed(true)}
						aria-label="Minimize reconnecting banner"
					>
						<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
							<path d="M7 14l5-5 5 5H7z" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	)
}
