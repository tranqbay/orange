import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { Link, useLoaderData, useSearchParams, useNavigate } from '@remix-run/react'
import { useState, useEffect } from 'react'
import { Button } from '~/components/Button'
import { getParticipantContext } from '~/utils/api.server'
import { isWithinGracePeriod } from '~/types/booking'

export const meta: MetaFunction = () => [
	{ title: 'Session Ended - TranqBay Meet' },
]

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const participantId = url.searchParams.get('participantId')

	if (!participantId) {
		return json({
			booking: null,
			meeting: null,
			canRejoin: false,
			participantId: null as string | null,
			participantType: null as string | null,
			error: 'No participant ID provided',
		})
	}

	const { booking, meeting } = await getParticipantContext(participantId, context)

	// Check if still within grace period for rejoin
	const endTime = booking?.appointmentEndTime ? new Date(booking.appointmentEndTime) : null
	const canRejoin = endTime ? isWithinGracePeriod(endTime) : false

	return json({
		booking,
		meeting,
		canRejoin,
		participantId,
		participantType: meeting?.participantType || null,
		error: null,
	})
}

// Appointment End icon matching Meet's design
function AppointmentIcon() {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="86" height="86" viewBox="0 0 86 86" fill="none">
			<rect width="86" height="86" rx="43" fill="#FDECEC" />
			<path
				d="M67.5696 45.198C68.2589 39.8459 67.2587 34.4122 64.7087 29.6564C62.1588 24.9006 58.1865 21.0604 53.3473 18.6726C48.5081 16.2848 43.0437 15.4688 37.7179 16.3385C32.3922 17.2083 27.4713 19.7203 23.6432 23.5236C19.815 27.3269 17.2708 32.2312 16.3663 37.5512C15.4618 42.8711 16.2422 48.3407 18.5983 53.1954C20.9545 58.0502 24.7686 62.0474 29.5077 64.6283C34.2467 67.2093 39.6737 68.245 45.0302 67.5907"
				stroke="#9D3A3A"
				strokeWidth="5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M41.8906 27.5059V41.8897L47.6441 47.6432M70.6582 70.6573L56.2744 56.2735M56.2744 70.6573L70.6582 56.2735"
				stroke="#9D3A3A"
				strokeWidth="5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

export default function CallEnded() {
	const data = useLoaderData<typeof loader>()
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const [isRejoining, setIsRejoining] = useState(false)

	const participantId = data.participantId || searchParams.get('participantId')
	const roomId = searchParams.get('roomId')
	const participantType = data.participantType || searchParams.get('participantType')

	// Check if session expired
	const [isExpired, setIsExpired] = useState(!data.canRejoin)

	// Update expired status periodically
	useEffect(() => {
		if (!data.booking?.appointmentEndTime) return

		const checkExpiry = () => {
			const endTime = new Date(data.booking!.appointmentEndTime!)
			setIsExpired(!isWithinGracePeriod(endTime))
		}

		checkExpiry()
		const interval = setInterval(checkExpiry, 30000)
		return () => clearInterval(interval)
	}, [data.booking?.appointmentEndTime])

	const handleRejoin = () => {
		if (!participantId) return
		setIsRejoining(true)
		// Navigate back to the room
		if (roomId) {
			navigate(`/${roomId}/room`)
		} else {
			navigate(`/${participantId}`)
		}
	}

	// Get session partner name
	const getPartnerName = () => {
		if (participantType === 'client') {
			const title = data.booking?.provider?.professionalTitle || ''
			const firstName = data.booking?.provider?.firstName || ''
			const lastName = data.booking?.provider?.lastName || ''
			return `${title} ${firstName} ${lastName}`.trim()
		}
		const firstName = data.booking?.client?.firstName || ''
		const lastName = data.booking?.client?.lastName || ''
		return `${firstName} ${lastName}`.trim()
	}

	const partnerName = getPartnerName()
	const isClient = participantType === 'client'
	const baseUrl = 'https://tranqbay.health'

	return (
		<div className="min-h-screen bg-meet_grey_5 flex items-center justify-center p-4">
			<div className="w-full max-w-lg text-center bg-white rounded-2xl shadow-xl overflow-hidden">
				{/* Header */}
				<div className="p-6 md:p-8 space-y-4">
					<h1 className="text-xl text-meet_text_1 font-semibold">
						Session with {partnerName || 'Your Provider'}
					</h1>
					<p className="text-meet_text_2">
						Thank you for taking this important step in your mental health journey.
					</p>
				</div>

				{/* Content */}
				<div className="px-6 md:px-8 pb-6 md:pb-8 space-y-6">
					{/* Icon */}
					<div className="flex justify-center">
						<AppointmentIcon />
					</div>

					{/* Session Complete Badge */}
					<div className="bg-meet_primary_2 rounded-xl p-6">
						<h2 className="text-2xl font-semibold text-meet_primary_1 mb-2">Session Complete</h2>
						<p className="text-meet_text_2">Your therapy session has successfully ended.</p>
					</div>

					{/* Message */}
					<div className="space-y-3 text-sm text-meet_text_2">
						<p>
							We hope your time with {partnerName || 'your provider'} was helpful and supportive.
						</p>
						{isClient && (
							<p>
								Ready to continue your journey? You can easily schedule your next session whenever you're ready.
							</p>
						)}
					</div>
				</div>

				{/* Footer Actions */}
				<div className="px-6 md:px-8 pb-6 md:pb-8 flex flex-col items-center gap-3">
					{/* Rejoin button if session still active */}
					{!isExpired && participantId && (
						<Button
							onClick={handleRejoin}
							disabled={isRejoining}
							className="w-full max-w-xs bg-meet_primary_1 hover:bg-meet_primary_1/90 text-white rounded-xl h-12"
						>
							{isRejoining ? 'Reconnecting...' : 'Return to Session'}
						</Button>
					)}

					{/* Primary action based on participant type */}
					{isClient && data.booking?.provider?.identifier ? (
						<a
							href={`${baseUrl}/provider/${data.booking.provider.identifier}`}
							className="w-full max-w-xs"
						>
							<Button className="w-full bg-meet_primary_1 hover:bg-meet_primary_1/90 text-white rounded-xl h-12">
								Schedule Next Session
							</Button>
						</a>
					) : (
						<a href={baseUrl} className="w-full max-w-xs">
							<Button className="w-full bg-meet_primary_1 hover:bg-meet_primary_1/90 text-white rounded-xl h-12">
								Return to Dashboard
							</Button>
						</a>
					)}

					<Link
						to="/"
						className="text-meet_text_2 hover:text-meet_text_1 text-sm transition-colors"
					>
						Return Home
					</Link>
				</div>
			</div>
		</div>
	)
}
