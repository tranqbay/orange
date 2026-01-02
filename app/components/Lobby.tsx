import { useState, useEffect } from 'react'
import { useNavigate } from '@remix-run/react'
import { Button } from '~/components/Button'
import { cn } from '~/utils/style'
import type { BookingInfo, MeetingParticipantInfo } from '~/types/booking'
import WELLNESS_QUOTES from '~/data/wellnessQuotes.json'

interface LobbyProps {
	booking: BookingInfo | null
	meeting: MeetingParticipantInfo | null
	participantId: string
	participantType?: string | null
	participantName?: string | null
}

// Icons
function VideoIcon({ className }: { className?: string }) {
	return (
		<svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="m22 8-6 4 6 4V8Z"/>
			<rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>
		</svg>
	)
}

function AudioIcon({ className }: { className?: string }) {
	return (
		<svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
			<path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
			<line x1="12" x2="12" y1="19" y2="22"/>
		</svg>
	)
}

function ClockIcon({ className }: { className?: string }) {
	return (
		<svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="10"/>
			<polyline points="12 6 12 12 16 14"/>
		</svg>
	)
}

function ShieldIcon({ className }: { className?: string }) {
	return (
		<svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
		</svg>
	)
}

function InfoIcon({ className }: { className?: string }) {
	return (
		<svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="10"/>
			<path d="M12 16v-4"/>
			<path d="M12 8h.01"/>
		</svg>
	)
}

function ChevronIcon({ className, direction = 'down' }: { className?: string; direction?: 'up' | 'down' }) {
	return (
		<svg
			className={cn(className, direction === 'up' && 'rotate-180')}
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="m6 9 6 6 6-6"/>
		</svg>
	)
}

function WarningIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
			<line x1="12" y1="9" x2="12" y2="13" />
			<line x1="12" y1="17" x2="12.01" y2="17" />
		</svg>
	)
}

// Contact policy notice for providers
function ContactPolicyNotice() {
	const [isExpanded, setIsExpanded] = useState(false)

	return (
		<div className="bg-meet_secondary_1/10 border border-meet_secondary_1/30 rounded-lg text-xs text-meet_text_1 overflow-hidden">
			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				className="w-full flex items-start gap-2 px-3 py-2.5 text-left hover:bg-meet_secondary_1/5 transition-colors"
			>
				<WarningIcon className="w-4 h-4 text-meet_secondary_1 flex-shrink-0 mt-0.5" />
				<div className="flex-1">
					<span>Please keep all communication within TranqBay.</span>
					<span className="ml-1.5 text-meet_primary_1 font-medium">
						{isExpanded ? 'Less ↑' : 'Why? →'}
					</span>
				</div>
			</button>

			{isExpanded && (
				<div className="px-3 pb-3 pt-1 border-t border-meet_secondary_1/20 space-y-2.5 text-meet_text_2">
					<p>
						Requesting personal contact details (phone, email, social media) from clients is not permitted and may result in account suspension.{' '}
						<a
							href="https://tranqbay.health/provider-terms-of-service#Termination%20and%20Suspension"
							target="_blank"
							rel="noopener noreferrer"
							className="text-meet_primary_1 hover:underline"
						>
							Learn more
						</a>
					</p>
					<p>
						<strong className="text-meet_text_1">Need to share files or stay connected?</strong> Use TranqBay's secure messaging feature.
					</p>
					<p>
						<strong className="text-meet_text_1">Emergency?</strong> Direct contact is permitted only in genuine emergencies. Contact{' '}
						<a
							href="mailto:support@tranqbay.health"
							className="text-meet_primary_1 hover:underline"
						>
							support@tranqbay.health
						</a>
						{' '}if unsure.
					</p>
				</div>
			)}
		</div>
	)
}

// Safety notice for clients
function ClientSafetyNotice() {
	const [isExpanded, setIsExpanded] = useState(false)

	return (
		<div className="bg-meet_primary_1/10 border border-meet_primary_1/30 rounded-lg text-xs text-meet_text_1 overflow-hidden">
			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				className="w-full flex items-start gap-2 px-3 py-2.5 text-left hover:bg-meet_primary_1/5 transition-colors"
			>
				<ShieldIcon className="w-4 h-4 text-meet_primary_1 flex-shrink-0 mt-0.5" />
				<div className="flex-1">
					<span>We're here to support you.</span>
					<span className="ml-1.5 text-meet_primary_1 font-medium">
						{isExpanded ? 'Less ↑' : 'Know your rights →'}
					</span>
				</div>
			</button>

			{isExpanded && (
				<div className="px-3 pb-3 pt-1 border-t border-meet_primary_1/20 space-y-2.5 text-meet_text_2">
					<div className="space-y-1.5">
						<p className="flex items-start gap-2">
							<span className="text-meet_primary_1">•</span>
							<span><strong className="text-meet_text_1">You're in control</strong> — leave anytime if you feel uncomfortable.</span>
						</p>
						<p className="flex items-start gap-2">
							<span className="text-meet_primary_1">•</span>
							<span><strong className="text-meet_text_1">Your session is private</strong> — encrypted and HIPAA compliant.</span>
						</p>
						<p className="flex items-start gap-2">
							<span className="text-meet_primary_1">•</span>
							<span><strong className="text-meet_text_1">Pay only through TranqBay</strong> — never send money directly to providers.</span>
						</p>
					</div>
					<p className="pt-1 border-t border-meet_primary_1/10">
						Need help?{' '}
						<a href="mailto:support@tranqbay.health" className="text-meet_primary_1 hover:underline font-medium">
							support@tranqbay.health
						</a>
					</p>
				</div>
			)}
		</div>
	)
}

// Countdown hook
function useCountdown(appointmentTime: string | undefined) {
	const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null)
	const [isWithinFiveMinutes, setIsWithinFiveMinutes] = useState(false)
	const [isReady, setIsReady] = useState(false)

	useEffect(() => {
		if (!appointmentTime) return

		const updateCountdown = () => {
			const now = new Date().getTime()
			const sessionTime = new Date(appointmentTime).getTime()
			const fiveMinBefore = sessionTime - 5 * 60 * 1000
			const diff = sessionTime - now

			if (diff <= 0) {
				setTimeLeft(null)
				setIsReady(true)
				setIsWithinFiveMinutes(true)
				return
			}

			setIsWithinFiveMinutes(now >= fiveMinBefore)
			setIsReady(now >= fiveMinBefore)

			const days = Math.floor(diff / (1000 * 60 * 60 * 24))
			const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
			const seconds = Math.floor((diff % (1000 * 60)) / 1000)

			setTimeLeft({ days, hours, minutes, seconds })
		}

		updateCountdown()
		const interval = setInterval(updateCountdown, 1000)
		return () => clearInterval(interval)
	}, [appointmentTime])

	return { timeLeft, isWithinFiveMinutes, isReady }
}

export default function Lobby({ booking, meeting, participantId, participantType, participantName }: LobbyProps) {
	const navigate = useNavigate()
	const [showTips, setShowTips] = useState(false)
	const [showQuote, setShowQuote] = useState(false)
	const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * WELLNESS_QUOTES.length))
	const [isTransitioning, setIsTransitioning] = useState(false)
	const [usedQuoteIndices, setUsedQuoteIndices] = useState<Set<number>>(new Set())

	const appointmentTime = booking?.appointmentTime
	const { timeLeft, isWithinFiveMinutes, isReady } = useCountdown(appointmentTime)

	// Get a random quote index that hasn't been shown recently
	const getNextQuoteIndex = () => {
		let availableIndices = Array.from({ length: WELLNESS_QUOTES.length }, (_, i) => i)
			.filter(i => !usedQuoteIndices.has(i))

		// If we've shown all quotes, reset
		if (availableIndices.length === 0) {
			setUsedQuoteIndices(new Set())
			availableIndices = Array.from({ length: WELLNESS_QUOTES.length }, (_, i) => i)
		}

		const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
		setUsedQuoteIndices(prev => new Set([...prev, randomIndex]))
		return randomIndex
	}

	// Alternate between session info and quotes with smart timing
	useEffect(() => {
		const INITIAL_SESSION_DELAY = 45000 // 45 seconds before first quote
		const QUOTE_DISPLAY_TIME = 12000 // 12 seconds to read quote
		const SESSION_DISPLAY_TIME = 30000 // 30 seconds showing session info

		const transition = (toQuote: boolean) => {
			setIsTransitioning(true)
			setTimeout(() => {
				if (toQuote) {
					setQuoteIndex(getNextQuoteIndex())
				}
				setShowQuote(toQuote)
				setIsTransitioning(false)
			}, 300)
		}

		// Initial delay before showing first quote
		const initialTimeout = setTimeout(() => {
			transition(true)
		}, INITIAL_SESSION_DELAY)

		// Set up recurring cycle after initial delay
		const startCycle = setTimeout(() => {
			const cycle = () => {
				// Show quote for QUOTE_DISPLAY_TIME, then switch to session
				setTimeout(() => {
					transition(false)

					// Show session for SESSION_DISPLAY_TIME, then switch to quote
					setTimeout(() => {
						transition(true)
						cycle() // Repeat
					}, SESSION_DISPLAY_TIME)
				}, QUOTE_DISPLAY_TIME)
			}

			cycle()
		}, INITIAL_SESSION_DELAY)

		return () => {
			clearTimeout(initialTimeout)
			clearTimeout(startCycle)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const currentQuote = WELLNESS_QUOTES[quoteIndex]

	// Get the other party's name
	const getOtherPartyName = () => {
		if (participantType === 'provider') {
			return `${booking?.client?.firstName || ''} ${booking?.client?.lastName || ''}`.trim() || 'Your Client'
		}
		const title = booking?.provider?.professionalTitle || ''
		const firstName = booking?.provider?.firstName || ''
		const lastName = booking?.provider?.lastName || ''
		return `${title} ${firstName} ${lastName}`.trim() || 'Your Provider'
	}

	// Get session type
	const getSessionType = () => {
		const modality = booking?.modality?.shortName || booking?.modality?.name || 'Video'
		return modality.toLowerCase().includes('audio') ? 'Audio' : 'Video'
	}

	const isVideoSession = getSessionType() === 'Video'

	// Format time for display
	const formatSessionTime = () => {
		if (!appointmentTime) return ''
		const date = new Date(appointmentTime)
		return date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		})
	}

	const formatSessionDate = () => {
		if (!appointmentTime) return ''
		const date = new Date(appointmentTime)
		const today = new Date()
		const tomorrow = new Date(today)
		tomorrow.setDate(tomorrow.getDate() + 1)

		if (date.toDateString() === today.toDateString()) {
			return 'Today'
		} else if (date.toDateString() === tomorrow.toDateString()) {
			return 'Tomorrow'
		}
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'short',
			day: 'numeric'
		})
	}

	// Get disabled button text based on how far away the session is
	const getJoinButtonDisabledText = () => {
		if (!appointmentTime) return 'Not available yet'

		const sessionDate = new Date(appointmentTime)
		const joinDate = new Date(sessionDate.getTime() - 5 * 60 * 1000) // 5 min before
		const now = new Date()
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
		const joinDay = new Date(joinDate.getFullYear(), joinDate.getMonth(), joinDate.getDate())
		const diffDays = Math.floor((joinDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

		const timeStr = joinDate.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		})

		if (diffDays === 0) {
			// Same day - show time only
			return `Opens at ${timeStr}`
		} else if (diffDays === 1) {
			// Tomorrow
			return `Opens tomorrow at ${timeStr}`
		} else {
			// More than 1 day away - show simpler message
			return 'Opens 5 min before session'
		}
	}

	const handleJoin = () => {
		if (!isWithinFiveMinutes) return
		const roomName = meeting?.meeting?.id || participantId

		// Store participant data in session storage for the room to use
		// This includes the JWT token for authentication
		const participantData = {
			token: meeting?.token || '',
			participantIdentifier: participantId,
			participantType: participantType || 'participant',
			displayName: participantName || 'Participant',
			roomName,
			meetingStartTime: appointmentTime,
			meetingEndTime: booking?.appointmentEndTime,
			timestamp: Date.now(),
		}
		sessionStorage.setItem('participantData', JSON.stringify(participantData))

		// Navigate to room with participantId for meeting timer
		navigate(`/${roomName}/room?participantId=${participantId}`)
	}

	// Check if session has started
	const currentTime = Date.now()
	const sessionStartTime = new Date(appointmentTime || '').getTime()
	const sessionHasStarted = currentTime >= sessionStartTime

	// Tips based on participant type
	const getTips = () => {
		if (participantType === 'provider') {
			return [
				'Use TranqBay\'s messaging platform for sharing files and notes',
				'Ensure stable internet and a quiet environment',
				'You can allow rescheduling from the Completed Booking Summary page if needed',
			]
		}
		return [
			'Find a quiet, private space for your session',
			'Use headphones for better audio quality',
			'Test your camera and microphone before joining',
		]
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-meet_primary_2/30 via-meet_grey_5 to-meet_primary_2/20 p-4 md:p-6 overflow-x-hidden overflow-y-auto relative">
			{/* Decorative background elements */}
			<div className="absolute top-0 right-0 w-64 h-64 bg-meet_primary_1/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
			<div className="absolute bottom-0 left-0 w-80 h-80 bg-meet_secondary_2/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
			<div className="absolute top-1/2 left-1/4 w-40 h-40 bg-meet_primary_2/50 rounded-full blur-2xl" />

			<div className="w-full max-w-4xl relative z-10">
				<div className="flex flex-col md:flex-row md:items-stretch md:gap-6">
					{/* Left side - Session info */}
					<div className="md:w-[45%] md:flex md:flex-col">
						<div className="border-0 shadow-xl overflow-hidden md:h-full backdrop-blur-sm rounded-2xl">
							{/* Header with gradient */}
							<div className="bg-gradient-to-br from-meet_primary_1 to-meet_secondary_1 p-6 md:p-8 text-white text-center md:h-full md:flex md:flex-col md:justify-center relative overflow-hidden min-h-[200px] md:min-h-0">
								{/* Decorative elements */}
								<div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
								<div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

								<div
									className={cn(
										"relative z-10 transition-opacity duration-300",
										isTransitioning ? "opacity-0" : "opacity-100"
									)}
								>
									{!showQuote ? (
										<>
											{/* Session type icon */}
											<div className="w-14 h-14 md:w-20 md:h-20 mx-auto mb-3 md:mb-5 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
												{isVideoSession ? (
													<VideoIcon className="w-7 h-7 md:w-10 md:h-10 text-white" />
												) : (
													<AudioIcon className="w-7 h-7 md:w-10 md:h-10 text-white" />
												)}
											</div>

											{/* Title */}
											<h1 className="text-lg md:text-2xl font-semibold mb-1">
												{participantType === 'provider' ? 'Session with' : 'Your Session'}
											</h1>
											<p className="text-white/90 text-base md:text-xl font-medium">
												{getOtherPartyName()}
											</p>

											{/* Session badge */}
											<div className="mt-3 md:mt-5 inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1.5 text-sm backdrop-blur-sm">
												{isVideoSession ? (
													<VideoIcon className="w-4 h-4" />
												) : (
													<AudioIcon className="w-4 h-4" />
												)}
												<span>{getSessionType()} Session</span>
											</div>

											{/* Time info - desktop */}
											<div className="hidden md:flex items-center justify-center gap-2 text-white/80 mt-6 text-sm">
												<ClockIcon className="w-4 h-4" />
												<span className="text-white font-medium">{formatSessionDate()}</span>
												<span>at</span>
												<span className="text-white font-medium">{formatSessionTime()}</span>
											</div>
										</>
									) : (
										<>
											{/* Quote icon */}
											<div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-5 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
												<svg className="w-7 h-7 md:w-8 md:h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
													<path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
												</svg>
											</div>

											{/* Affirmation text */}
											<blockquote className="text-base md:text-lg font-medium leading-relaxed mb-3 px-2">
												"{currentQuote.quote}"
											</blockquote>

											{/* Label */}
											<p className="text-white/60 text-xs uppercase tracking-wider">
												Affirmation
											</p>
										</>
									)}
								</div>

								{/* Indicator dots */}
								<div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
									<button
										type="button"
										onClick={() => { setIsTransitioning(true); setTimeout(() => { setShowQuote(false); setIsTransitioning(false); }, 300); }}
										className={cn(
											"w-1.5 h-1.5 rounded-full transition-all",
											!showQuote ? "bg-white w-3" : "bg-white/40 hover:bg-white/60"
										)}
										aria-label="Show session info"
									/>
									<button
										type="button"
										onClick={() => { setIsTransitioning(true); setTimeout(() => { setShowQuote(true); setIsTransitioning(false); }, 300); }}
										className={cn(
											"w-1.5 h-1.5 rounded-full transition-all",
											showQuote ? "bg-white w-3" : "bg-white/40 hover:bg-white/60"
										)}
										aria-label="Show quote"
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Right side - Action area */}
					<div className="md:w-[55%] md:flex md:flex-col mt-3 md:mt-0">
						<div className="border-0 shadow-xl md:h-full bg-white/95 backdrop-blur-sm rounded-2xl">
							<div className="p-5 md:p-6 space-y-4 md:h-full md:flex md:flex-col md:justify-center">
								{/* Policy notice for PLATFORM providers only */}
								{participantType === 'provider' && booking?.provider?.providerType === 'PLATFORM' && (
									<ContactPolicyNotice />
								)}

								{/* Safety notice for platform clients only */}
								{participantType === 'client' && booking?.client?.clientType === 'platform' && (
									<ClientSafetyNotice />
								)}

								{/* Time info - mobile */}
								<div className="flex md:hidden items-center justify-center gap-2 text-meet_text_2 text-sm">
									<ClockIcon className="w-4 h-4" />
									<span className="text-meet_text_1 font-medium">{formatSessionDate()}</span>
									<span>at</span>
									<span className="text-meet_text_1 font-medium">{formatSessionTime()}</span>
								</div>

								{/* Countdown */}
								{!isReady && timeLeft && (
									<div className="text-center">
										<p className="text-sm text-meet_text_2 mb-3">Session begins in</p>
										<div className="flex justify-center gap-2 md:gap-3">
											{timeLeft.days > 0 && (
												<div className="flex flex-col items-center bg-meet_primary_2 rounded-lg px-3 py-2 md:px-4 md:py-3 min-w-[50px] md:min-w-[65px]">
													<span className="text-xl md:text-2xl font-bold text-meet_primary_1">{timeLeft.days}</span>
													<span className="text-[10px] md:text-xs text-meet_text_2 uppercase">Days</span>
												</div>
											)}
											{(timeLeft.days > 0 || timeLeft.hours > 0) && (
												<div className="flex flex-col items-center bg-meet_primary_2 rounded-lg px-3 py-2 md:px-4 md:py-3 min-w-[50px] md:min-w-[65px]">
													<span className="text-xl md:text-2xl font-bold text-meet_primary_1">{timeLeft.hours}</span>
													<span className="text-[10px] md:text-xs text-meet_text_2 uppercase">Hrs</span>
												</div>
											)}
											<div className="flex flex-col items-center bg-meet_primary_2 rounded-lg px-3 py-2 md:px-4 md:py-3 min-w-[50px] md:min-w-[65px]">
												<span className="text-xl md:text-2xl font-bold text-meet_primary_1">{timeLeft.minutes}</span>
												<span className="text-[10px] md:text-xs text-meet_text_2 uppercase">Min</span>
											</div>
											{timeLeft.days === 0 && (
												<div className="flex flex-col items-center bg-meet_primary_2 rounded-lg px-3 py-2 md:px-4 md:py-3 min-w-[50px] md:min-w-[65px]">
													<span className="text-xl md:text-2xl font-bold text-meet_primary_1">{timeLeft.seconds}</span>
													<span className="text-[10px] md:text-xs text-meet_text_2 uppercase">Sec</span>
												</div>
											)}
										</div>
									</div>
								)}

								{/* Ready status */}
								{isReady && (
									<div className="text-center py-2">
										<span className="bg-meet_primary_2 text-meet_primary_1 border-0 text-sm py-1.5 px-4 rounded-full font-medium">
											{sessionHasStarted ? 'Session is active' : 'Ready to join'}
										</span>
									</div>
								)}

								{/* Join button */}
								<Button
									onClick={handleJoin}
									disabled={!isWithinFiveMinutes}
									className={cn(
										'w-full h-11 md:h-12 text-base font-semibold rounded-xl transition-all duration-200',
										isWithinFiveMinutes
											? 'bg-meet_primary_1 hover:bg-meet_primary_1/90 text-white shadow-lg shadow-meet_primary_1/20 hover:shadow-xl hover:shadow-meet_primary_1/30'
											: 'bg-meet_grey_6 text-meet_text_2 cursor-not-allowed'
									)}
								>
									{isWithinFiveMinutes
										? (sessionHasStarted ? 'Join Now' : 'Enter Session')
										: getJoinButtonDisabledText()}
								</Button>

								{/* Security note */}
								<div className="flex items-center justify-center gap-2 text-xs text-meet_text_2">
									<ShieldIcon className="w-3.5 h-3.5" />
									<span>End-to-end encrypted & HIPAA compliant</span>
								</div>

								{/* Tips Section - desktop */}
								<div className="hidden md:block pt-3 border-t border-meet_grey_6">
									<button
										type="button"
										onClick={() => setShowTips(!showTips)}
										className="w-full flex items-center justify-between py-1.5 text-sm text-meet_text_1 hover:text-meet_primary_1 transition-colors"
									>
										<div className="flex items-center gap-2">
											<InfoIcon className="w-4 h-4 text-meet_text_2" />
											<span>Preparation tips</span>
										</div>
										<ChevronIcon direction={showTips ? 'up' : 'down'} className="text-meet_text_2" />
									</button>

									{showTips && (
										<div className="mt-2 pt-2 border-t border-meet_grey_5">
											<ul className="space-y-2">
												{getTips().map((tip, index) => (
													<li key={index} className="flex items-start gap-2 text-sm text-meet_text_2">
														<div className="w-5 h-5 rounded-full bg-meet_primary_2 flex items-center justify-center flex-shrink-0 mt-0.5">
															<span className="text-xs text-meet_primary_1 font-medium">{index + 1}</span>
														</div>
														<span>{tip}</span>
													</li>
												))}
											</ul>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Mobile Tips Section */}
				<div className="md:hidden mt-3">
					<button
						type="button"
						onClick={() => setShowTips(!showTips)}
						className="w-full flex items-center justify-between px-4 py-2.5 bg-white/95 backdrop-blur-sm rounded-xl shadow-md text-sm text-meet_text_1 hover:bg-white transition-colors"
					>
						<div className="flex items-center gap-2">
							<InfoIcon className="w-4 h-4 text-meet_text_2" />
							<span>Preparation tips</span>
						</div>
						<ChevronIcon direction={showTips ? 'up' : 'down'} className="text-meet_text_2" />
					</button>

					{showTips && (
						<div className="mt-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-md p-4">
							<ul className="space-y-2.5">
								{getTips().map((tip, index) => (
									<li key={index} className="flex items-start gap-2.5 text-sm text-meet_text_2">
										<div className="w-5 h-5 rounded-full bg-meet_primary_2 flex items-center justify-center flex-shrink-0 mt-0.5">
											<span className="text-xs text-meet_primary_1 font-medium">{index + 1}</span>
										</div>
										<span>{tip}</span>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
