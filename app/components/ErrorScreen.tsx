import { useNavigate } from '@remix-run/react'
import { Button } from '~/components/Button'

interface ErrorScreenProps {
	errorMessage?: string
	participantId?: string
}

export default function ErrorScreen({ errorMessage, participantId }: ErrorScreenProps) {
	const navigate = useNavigate()

	const handleGoBack = () => {
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
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
					</svg>
				</div>
			</div>

			{/* Content */}
			<h1 className="text-2xl font-semibold text-meet_text_1 mb-2">
				{errorMessage ? 'Session Error' : 'Connection Lost'}
			</h1>
			<p className="text-meet_text_2 mb-6">
				{errorMessage || 'Your connection to the session was interrupted.'}
			</p>

			{/* Tips */}
			<div className="bg-meet_primary_2 rounded-xl p-4 mb-6 text-left">
				<p className="text-sm text-meet_primary_1 font-medium mb-2">How to reconnect:</p>
				<p className="text-sm text-meet_primary_1">Click "Rejoin Call" below. Make sure your internet is stable.</p>
			</div>

			<div className="bg-meet_grey_5 rounded-xl p-4 mb-6 text-left">
				<p className="text-sm text-meet_text_1 font-medium mb-2">Common causes:</p>
				<ul className="space-y-1 text-sm text-meet_text_2">
					<li>• Internet connection interrupted</li>
					<li>• Browser page was refreshed</li>
					<li>• Device went to sleep</li>
				</ul>
			</div>

			{/* Actions */}
			<div className="space-y-3">
				<Button
					onClick={handleGoBack}
					className="w-full bg-meet_primary_1 hover:bg-meet_secondary_1 text-white rounded-xl h-12"
				>
					Rejoin Call
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
