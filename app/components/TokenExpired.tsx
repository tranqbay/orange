import { Button } from '~/components/Button'

interface TokenExpiredProps {
	errorMessage?: string
}

export default function TokenExpired({ errorMessage }: TokenExpiredProps) {
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
							d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
					</svg>
				</div>
			</div>

			{/* Content */}
			<h1 className="text-2xl font-semibold text-meet_text_1 mb-2">Meeting Link Expired</h1>
			<p className="text-meet_text_2 mb-6">
				{errorMessage || "Your meeting access link has expired or is no longer valid."}
			</p>

			{/* Tips */}
			<div className="bg-meet_primary_2 rounded-xl p-4 mb-6 text-left">
				<p className="text-sm text-meet_primary_1 font-medium mb-2">What you can do:</p>
				<ul className="space-y-1 text-sm text-meet_primary_1">
					<li>• Check your email for a new or updated meeting link</li>
					<li>• Contact your meeting host to request a new access link</li>
					<li>• Verify the meeting date and time in your calendar</li>
				</ul>
			</div>

			{/* Actions */}
			<div className="space-y-3">
				<Button
					onClick={handleGoHome}
					className="w-full bg-meet_primary_1 hover:bg-meet_secondary_1 text-white rounded-xl h-12"
				>
					Go to TranqBay Website
				</Button>
				<p className="text-xs text-meet_text_2 text-center pt-2">
					Need help? <a href="mailto:support@tranqbay.health" className="text-meet_primary_1 hover:underline">support@tranqbay.health</a>
				</p>
			</div>
		</div>
	)
}
