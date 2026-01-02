import { useEffect, useState } from 'react'

const tips = [
	"Check your camera and microphone are working",
	"Find a quiet, private space for your session",
	"Close other browser tabs to improve connection",
	"Have a glass of water nearby"
]

interface LoadingProps {
	message?: string
}

export default function Loading({ message = "Getting everything ready..." }: LoadingProps) {
	const [currentTip, setCurrentTip] = useState(0)

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTip((prev) => (prev + 1) % tips.length)
		}, 3000)

		return () => clearInterval(interval)
	}, [])

	return (
		<div className="min-h-screen flex items-center justify-center bg-meet_grey_5 p-4">
			<div className="max-w-sm w-full text-center">
				{/* Loading spinner */}
				<div className="flex justify-center mb-8">
					<div className="w-12 h-12 border-3 border-meet_grey_6 border-t-meet_primary_1 rounded-full animate-spin" />
				</div>

				<h2 className="text-xl font-semibold text-meet_text_1 mb-2">{message}</h2>
				<p className="text-meet_text_2 text-sm mb-8">
					This usually takes just a moment
				</p>

				{/* Quick Tip Section */}
				<div className="bg-meet_primary_2 rounded-xl p-4">
					<span className="inline-block mb-3 text-xs font-medium text-meet_primary_1 bg-white px-2 py-1 rounded-full">
						Quick tip
					</span>
					<p className="text-sm text-meet_primary_1 transition-opacity duration-300">
						{tips[currentTip]}
					</p>
				</div>
			</div>
		</div>
	)
}
