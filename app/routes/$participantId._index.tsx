import { useBookingContext } from '~/hooks/useBookingContext'
import { Spinner } from '~/components/Spinner'
import Lobby from '~/components/Lobby'

export default function ParticipantLobby() {
	const bookingContext = useBookingContext()

	if (!bookingContext) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-meet_grey_5">
				<Spinner className="w-8 h-8 text-meet_primary_1" />
			</div>
		)
	}

	const { booking, meeting, participantName, participantType } = bookingContext

	return (
		<Lobby
			booking={booking}
			meeting={meeting}
			participantId={bookingContext.participantId}
			participantType={participantType}
			participantName={participantName}
		/>
	)
}
