import { useNavigate } from '@remix-run/react'
import { Button } from '~/components/Button'

interface TooEarlyProps {
	participantId?: string
	errorMessage?: string
}

export default function TooEarly({ participantId, errorMessage }: TooEarlyProps) {
	const navigate = useNavigate()

	const handleTryAgain = () => {
		if (participantId) {
			navigate(`/${participantId}`)
		} else {
			window.location.reload()
		}
	}

	const handleGoHome = () => {
		window.location.href = 'https://tranqbay.health'
	}

	return (
		<div className="max-w-md w-full text-center">
			{/* Icon */}
			<div className="mb-8 flex justify-center">
				<div className="w-20 h-20 rounded-full bg-meet_primary_2 flex items-center justify-center">
					<svg className="w-10 h-10 text-meet_primary_1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
			</div>

			{/* Content */}
			<h1 className="text-2xl font-semibold text-meet_text_1 mb-2">Session Not Yet Available</h1>
			<p className="text-meet_text_2 mb-6">
				{errorMessage || "This room is not available yet, please try later"}
			</p>

			{/* Tips */}
			<div className="bg-meet_primary_2 rounded-xl p-4 mb-6 text-left">
				<p className="text-sm text-meet_primary_1 font-medium mb-2">What to do:</p>
				<ul className="space-y-1 text-sm text-meet_primary_1">
					<li>• Check your appointment time in the confirmation email</li>
					<li>• You can join up to 5 minutes before your session</li>
					<li>• If it's close to your time, try refreshing</li>
				</ul>
			</div>

			{/* Actions */}
			<div className="space-y-3">
				<Button
					onClick={handleTryAgain}
					className="w-full bg-meet_primary_1 hover:bg-meet_secondary_1 text-white rounded-xl h-12"
				>
					Try Again
				</Button>
				<Button
					onClick={handleGoHome}
					displayType="outline"
					className="w-full border-meet_grey_6 text-meet_text_1 hover:bg-meet_grey_5 rounded-xl h-12"
				>
					Go to Website
				</Button>
				<p className="text-xs text-meet_text_2 text-center pt-2">
					Need help? <a href="mailto:support@tranqbay.health" className="text-meet_primary_1 hover:underline">support@tranqbay.health</a>
				</p>
			</div>
		</div>
	)
}
