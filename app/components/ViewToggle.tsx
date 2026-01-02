import { cn } from '~/utils/style'

export type ViewMode = 'speaker' | 'grid'

interface ViewToggleProps {
	view: ViewMode
	onViewChange: (view: ViewMode) => void
	participantCount: number
	isMobile?: boolean
}

export default function ViewToggle({
	view,
	onViewChange,
	participantCount,
	isMobile = false,
}: ViewToggleProps) {
	return (
		<div className="flex items-center justify-between px-4 py-2 bg-white/95 backdrop-blur-md border-b border-meet_grey_6 shadow-sm">
			{/* Left: Participant count */}
			<div className="text-sm text-meet_text_1 font-medium">
				{participantCount > 0
					? `${participantCount} in call`
					: 'Waiting for others'}
			</div>

			{/* Right: Layout toggle */}
			{(!isMobile || participantCount >= 2) && (
				<div className="flex items-center gap-1 bg-meet_grey_5 rounded-full p-1">
					{/* Speaker view button */}
					<button
						onClick={() => onViewChange('speaker')}
						onTouchEnd={(e) => {
							e.preventDefault()
							onViewChange('speaker')
						}}
						type="button"
						className={cn(
							'rounded-full transition-all flex items-center justify-center touch-manipulation select-none',
							isMobile ? 'p-3 min-w-[44px] min-h-[44px]' : 'p-2 gap-1.5',
							view === 'speaker'
								? 'bg-white text-meet_text_1 shadow-sm'
								: 'text-meet_text_2 active:text-meet_text_1'
						)}
						title="Speaker view"
					>
						<svg
							width={isMobile ? '20' : '18'}
							height={isMobile ? '20' : '18'}
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M2 4h20v14H2V4zm2 2v10h16V6H4zm0 12h5v2H4v-2zm7 0h6v2h-6v-2zm8 0h1v2h-1v-2z" />
						</svg>
						{!isMobile && <span className="text-xs font-medium pr-1">Speaker</span>}
					</button>

					{/* Grid view button */}
					<button
						onClick={() => onViewChange('grid')}
						onTouchEnd={(e) => {
							e.preventDefault()
							onViewChange('grid')
						}}
						type="button"
						className={cn(
							'rounded-full transition-all flex items-center justify-center touch-manipulation select-none',
							isMobile ? 'p-3 min-w-[44px] min-h-[44px]' : 'p-2 gap-1.5',
							view === 'grid'
								? 'bg-white text-meet_text_1 shadow-sm'
								: 'text-meet_text_2 active:text-meet_text_1'
						)}
						title="Grid view"
					>
						<svg
							width={isMobile ? '20' : '18'}
							height={isMobile ? '20' : '18'}
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z" />
						</svg>
						{!isMobile && <span className="text-xs font-medium pr-1">Grid</span>}
					</button>
				</div>
			)}
		</div>
	)
}
