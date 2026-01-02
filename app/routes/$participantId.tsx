import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare'
import { json, redirect } from '@remix-run/cloudflare'
import { Outlet, useLoaderData } from '@remix-run/react'
import { getParticipantContext } from '~/utils/api.server'
import {
	isWithinJoinWindow,
	isWithinGracePeriod,
	isMeetingExpired,
	getGracePeriodEnd,
} from '~/types/booking'
import type { BookingContextType } from '~/hooks/useBookingContext'
import ErrorScreen from '~/components/ErrorScreen'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	if (!data?.booking) {
		return [{ title: 'TranqBay Meet' }]
	}
	const providerName = `${data.booking.provider.firstName} ${data.booking.provider.lastName}`
	return [
		{ title: `Session with ${providerName} - TranqBay Meet` },
		{
			name: 'description',
			content: `Your video session with ${providerName}`,
		},
	]
}

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
	const { participantId } = params

	if (!participantId) {
		throw redirect('/')
	}

	// Fetch booking and meeting info from VIVI
	const { booking, meeting, error } = await getParticipantContext(participantId, context)

	if (error || !meeting) {
		return json({
			booking: null,
			meeting: null,
			participantId,
			error: error || 'Meeting not found',
			status: 'error' as const,
		})
	}

	// Parse meeting times
	const startTime = meeting.meeting?.startTime ? new Date(meeting.meeting.startTime) : null
	const endTime = booking?.appointmentEndTime ? new Date(booking.appointmentEndTime) : null

	// Check timing - only check for expired sessions
	// TooEarly is handled by the Lobby countdown, not by blocking access
	// Redirect to end page if session is expired (past grace period)
	if (endTime && isMeetingExpired(endTime)) {
		throw redirect(`/end?participantId=${participantId}`)
	}

	// Calculate timing info
	const withinJoinWindow = startTime ? isWithinJoinWindow(startTime) : true
	const withinGracePeriod = endTime ? isWithinGracePeriod(endTime) : true
	const gracePeriodEnd = endTime ? getGracePeriodEnd(endTime) : null

	// Calculate duration
	let duration: number | null = null
	if (startTime && endTime) {
		duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))
	}

	return json({
		booking,
		meeting,
		participantId,
		participantType: meeting.participantType,
		participantName: meeting.fullName,
		startTime: startTime?.toISOString() || null,
		endTime: endTime?.toISOString() || null,
		duration,
		isWithinJoinWindow: withinJoinWindow,
		isExpired: !withinGracePeriod,
		isTooEarly: !withinJoinWindow,
		gracePeriodEnd: gracePeriodEnd?.toISOString() || null,
		token: meeting.token,
		roomUrl: meeting.meeting?.joinUrl || null,
		error: null,
		status: 'ok' as const,
	})
}

export default function ParticipantLayout() {
	const data = useLoaderData<typeof loader>()

	// Handle error state
	if (data.status === 'error') {
		return (
			<div className="min-h-screen flex items-center justify-center bg-meet_grey_5 py-8 px-4">
				<ErrorScreen errorMessage={data.error || 'An error occurred'} />
			</div>
		)
	}

	// Build booking context for child routes
	const bookingContext: BookingContextType = {
		booking: data.booking,
		meeting: data.meeting,
		participantId: data.participantId,
		participantType: data.participantType || null,
		participantName: data.participantName || null,
		startTime: data.startTime ? new Date(data.startTime) : null,
		endTime: data.endTime ? new Date(data.endTime) : null,
		duration: data.duration,
		isWithinJoinWindow: data.isWithinJoinWindow,
		isExpired: data.isExpired,
		isTooEarly: data.isTooEarly,
		gracePeriodEnd: data.gracePeriodEnd ? new Date(data.gracePeriodEnd) : null,
		token: data.token,
		roomUrl: data.roomUrl,
		error: data.error,
	}

	// Render child routes with booking context
	return <Outlet context={bookingContext} />
}
