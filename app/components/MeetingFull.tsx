import { Button } from '~/components/Button'

interface MeetingFullProps {
	errorMessage?: string
}

export default function MeetingFull({ errorMessage }: MeetingFullProps) {
	const handleGoHome = () => {
		window.location.href = 'https://tranqbay.health'
	}

	return (
		<div className="max-w-md w-full text-center">
			{/* Icon */}
			<div className="mb-8 flex justify-center">
				<div className="w-20 h-20 rounded-full bg-meet_error_2 flex items-center justify-center">
					<svg className="w-10 h-10 text-meet_error_1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
							d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
					</svg>
				</div>
			</div>

			{/* Content */}
			<h1 className="text-2xl font-semibold text-meet_text_1 mb-2">Meeting is Full</h1>
			<p className="text-meet_text_2 mb-6">
				{errorMessage || "This meeting has reached its maximum capacity."}
			</p>

			{/* Tips */}
			<div className="bg-meet_error_2 rounded-xl p-4 mb-6 text-left">
				<p className="text-sm text-meet_error_1 font-medium mb-2">What you can do:</p>
				<ul className="space-y-1 text-sm text-meet_error_1">
					<li>• Wait a few minutes and try rejoining if someone leaves</li>
					<li>• Contact your meeting host to request access</li>
					<li>• Ask the host to increase the meeting capacity</li>
				</ul>
			</div>

			{/* Actions */}
			<div className="space-y-3">
				<Button
					onClick={handleGoHome}
					className="w-full bg-meet_error_1 hover:bg-meet_error_1/90 text-white rounded-xl h-12"
				>
					Go to TranqBay Website
				</Button>
				<p className="text-xs text-meet_text_2 text-center pt-2">
					Need help? <a href="mailto:support@tranqbay.health" className="text-meet_error_1 hover:underline">support@tranqbay.health</a>
				</p>
			</div>
		</div>
	)
}
