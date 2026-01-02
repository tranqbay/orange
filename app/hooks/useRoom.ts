import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ChatMessage, ClientMessage, RoomState, ServerMessage } from '~/types/Messages'

import usePartySocket from 'partysocket/react'
import type { UserMedia } from './useUserMedia'

// Participant data stored in session storage
interface ParticipantData {
	token: string
	participantIdentifier: string
	participantType: string
	displayName: string
	roomName: string
	meetingStartTime?: string
	meetingEndTime?: string
	timestamp: number
}

// Get participant data from session storage
function getParticipantData(): ParticipantData | null {
	try {
		const stored = sessionStorage.getItem('participantData')
		if (!stored) return null
		return JSON.parse(stored) as ParticipantData
	} catch {
		return null
	}
}

export default function useRoom({
	roomName,
	userMedia,
}: {
	roomName: string
	userMedia: UserMedia
}) {
	const [roomState, setRoomState] = useState<RoomState>({
		users: [],
		ai: { enabled: false },
	})
	const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

	const userLeftFunctionRef = useRef(() => {})

	useEffect(() => {
		return () => userLeftFunctionRef.current()
	}, [])

	// Get participant data including JWT token
	const participantData = useMemo(() => getParticipantData(), [])

	const websocket = usePartySocket({
		party: 'rooms',
		room: roomName,
		// Pass token as query parameter for server-side validation
		query: participantData?.token ? { token: participantData.token } : undefined,
		onMessage: (e) => {
			const message = JSON.parse(e.data) as ServerMessage
			switch (message.type) {
				case 'roomState':
					// prevent updating state if nothing has changed
					if (JSON.stringify(message.state) === JSON.stringify(roomState)) break
					setRoomState(message.state)
					break
				case 'error':
					console.error('Received error message from WebSocket')
					console.error(message.error)
					break
				case 'directMessage':
					break
				case 'muteMic':
					userMedia.turnMicOff()
					break
				case 'partyserver-pong':
				case 'e2eeMlsMessage':
				case 'userLeftNotification':
					// do nothing
					break
				case 'chatMessage':
					setChatMessages((prev) => [...prev, message.message])
					break
				default:
					message satisfies never
					break
			}
		},
	})

	userLeftFunctionRef.current = () =>
		websocket.send(JSON.stringify({ type: 'userLeft' } satisfies ClientMessage))

	useEffect(() => {
		function onBeforeUnload() {
			userLeftFunctionRef.current()
		}
		window.addEventListener('beforeunload', onBeforeUnload)
		return () => {
			window.removeEventListener('beforeunload', onBeforeUnload)
		}
	}, [websocket])

	// setup a heartbeat
	useEffect(() => {
		const interval = setInterval(() => {
			websocket.send(
				JSON.stringify({ type: 'heartbeat' } satisfies ClientMessage)
			)
		}, 5_000)

		return () => clearInterval(interval)
	}, [websocket])

	const identity = useMemo(
		() => roomState.users.find((u) => u.id === websocket.id),
		[roomState.users, websocket.id]
	)

	const otherUsers = useMemo(
		() => roomState.users.filter((u) => u.id !== websocket.id && u.joined),
		[roomState.users, websocket.id]
	)

	const sendChatMessage = useCallback(
		(message: string) => {
			websocket.send(
				JSON.stringify({ type: 'chatMessage', message } satisfies ClientMessage)
			)
		},
		[websocket]
	)

	return { identity, otherUsers, websocket, roomState, chatMessages, sendChatMessage }
}
