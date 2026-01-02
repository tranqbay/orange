import type { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import {
	useLoaderData,
	useNavigate,
	useParams,
	useSearchParams,
} from '@remix-run/react'
import { useEffect, useState, useCallback } from 'react'
import { useMount, useWindowSize } from 'react-use'
import { AiButton } from '~/components/AiButton'
import { ButtonLink } from '~/components/Button'
import { CameraButton } from '~/components/CameraButton'
import Chat from '~/components/Chat'
import { ChatButton } from '~/components/ChatButton'
import { CopyButton } from '~/components/CopyButton'
import ViewToggle, { type ViewMode } from '~/components/ViewToggle'
import { HighPacketLossWarningsToast } from '~/components/HighPacketLossWarningsToast'
import ReconnectingOverlay from '~/components/ReconnectingOverlay'
import MeetingTimer from '~/components/MeetingTimer'
import { IceDisconnectedToast } from '~/components/IceDisconnectedToast'
import { LeaveRoomButton } from '~/components/LeaveRoomButton'
import { MicButton } from '~/components/MicButton'
import { OverflowMenu } from '~/components/OverflowMenu'
import { ParticipantLayout } from '~/components/ParticipantLayout'
import { ParticipantsButton } from '~/components/ParticipantsMenu'
import { PullAudioTracks } from '~/components/PullAudioTracks'
import { RaiseHandButton } from '~/components/RaiseHandButton'
import { SafetyNumberToast } from '~/components/SafetyNumberToast'
import { ScreenshareButton } from '~/components/ScreenshareButton'
import Toast, { useDispatchToast } from '~/components/Toast'
import useBroadcastStatus from '~/hooks/useBroadcastStatus'
import useIsSpeaking from '~/hooks/useIsSpeaking'
import { useRoomContext } from '~/hooks/useRoomContext'
import { useShowDebugInfoShortcut } from '~/hooks/useShowDebugInfoShortcut'
import useSounds from '~/hooks/useSounds'
import useStageManager from '~/hooks/useStageManager'
import { useUserJoinLeaveToasts } from '~/hooks/useUserJoinLeaveToasts'
import { useMeetingTimer } from '~/hooks/useMeetingTimer'
import { dashboardLogsLink } from '~/utils/dashboardLogsLink'
import { getParticipantContext } from '~/utils/api.server'
import isNonNullable from '~/utils/isNonNullable'

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	// Username comes from JWT token (stored in sessionStorage by Lobby)
	// and validated by ChatRoom.onConnect()

	// Get participantId from URL params to fetch booking info for meeting timer
	const url = new URL(request.url)
	const participantId = url.searchParams.get('participantId')

	let meetingEndTime: string | null = null
	if (participantId) {
		const { booking } = await getParticipantContext(participantId, context)
		meetingEndTime = booking?.appointmentEndTime || null
	}

	return json({
		meetingEndTime,
		bugReportsEnabled: Boolean(
			context.env.FEEDBACK_URL &&
				context.env.FEEDBACK_QUEUE &&
				context.env.FEEDBACK_STORAGE
		),
		disableLobbyEnforcement: context.env.DISABLE_LOBBY_ENFORCEMENT === 'true',
		mode: context.mode,
		hasAiCredentials: Boolean(
			context.env.OPENAI_API_TOKEN && context.env.OPENAI_MODEL_ENDPOINT
		),
		dashboardDebugLogsBaseUrl: context.env.DASHBOARD_WORKER_URL,
	})
}

export default function Room() {
	const { joined } = useRoomContext()
	const navigate = useNavigate()
	const { roomName } = useParams()
	const { mode, bugReportsEnabled, disableLobbyEnforcement } =
		useLoaderData<typeof loader>()
	const [search] = useSearchParams()

	useEffect(() => {
		if (!joined && mode !== 'development' && !disableLobbyEnforcement)
			navigate(`/${roomName}${search.size > 0 ? '?' + search.toString() : ''}`)
	}, [joined, mode, navigate, roomName, search, disableLobbyEnforcement])

	if (!joined && mode !== 'development' && !disableLobbyEnforcement) return null

	return (
		<Toast.Provider>
			<JoinedRoom bugReportsEnabled={bugReportsEnabled} />
		</Toast.Provider>
	)
}

function JoinedRoom({ bugReportsEnabled }: { bugReportsEnabled: boolean }) {
	const { hasAiCredentials, dashboardDebugLogsBaseUrl, meetingEndTime } =
		useLoaderData<typeof loader>()
	const {
		userMedia,
		partyTracks,
		pushedTracks,
		showDebugInfo,
		pinnedTileIds,
		room,
		e2eeSafetyNumber,
		e2eeOnJoin,
		iceConnectionState,
	} = useRoomContext()

	// Meeting timer
	const {
		timeLeft,
		warningLevel,
		showWarning,
		dismissWarning,
	} = useMeetingTimer(meetingEndTime)

	// Reconnection state
	const [reconnectAttempts, setReconnectAttempts] = useState(0)
	const maxReconnectAttempts = 5
	const isReconnecting = iceConnectionState === 'disconnected' || iceConnectionState === 'failed'

	// Track reconnection attempts
	useEffect(() => {
		if (isReconnecting) {
			const interval = setInterval(() => {
				setReconnectAttempts((prev) => Math.min(prev + 1, maxReconnectAttempts))
			}, 3000)
			return () => clearInterval(interval)
		} else {
			setReconnectAttempts(0)
		}
	}, [isReconnecting])
	const {
		otherUsers,
		websocket,
		identity,
		roomState: { meetingId },
		chatMessages,
		sendChatMessage,
	} = room

	// Chat state
	const [showChat, setShowChat] = useState(false)
	const [lastReadCount, setLastReadCount] = useState(0)

	const toggleChat = useCallback(() => {
		setShowChat((prev) => {
			if (!prev) {
				// Opening chat - mark all messages as read
				setLastReadCount(chatMessages.length)
			}
			return !prev
		})
	}, [chatMessages.length])

	// Update last read count when chat is open and new messages arrive
	useEffect(() => {
		if (showChat) {
			setLastReadCount(chatMessages.length)
		}
	}, [showChat, chatMessages.length])

	const unreadCount = showChat ? 0 : chatMessages.length - lastReadCount

	// View mode state
	const [viewMode, setViewMode] = useState<ViewMode>('grid')

	// only want this evaluated once upon mounting
	const [firstUser] = useState(otherUsers.length === 0)

	useEffect(() => {
		e2eeOnJoin(firstUser)
	}, [e2eeOnJoin, firstUser])

	useShowDebugInfoShortcut()

	const [raisedHand, setRaisedHand] = useState(false)
	const speaking = useIsSpeaking(userMedia.audioStreamTrack)

	useMount(() => {
		if (otherUsers.length > 5) {
			userMedia.turnMicOff()
		}
	})

	useBroadcastStatus({
		userMedia,
		partyTracks,
		websocket,
		identity,
		pushedTracks,
		raisedHand,
		speaking,
	})

	useSounds(otherUsers)
	useUserJoinLeaveToasts(otherUsers)

	const { width } = useWindowSize()
	const isMobile = width < 600

	const someScreenshare =
		otherUsers.some((u) => u.tracks.screenShareEnabled) ||
		Boolean(identity?.tracks.screenShareEnabled)
	const stageLimit = isMobile ? 2 : someScreenshare ? 5 : 9

	const { recordActivity, actorsOnStage } = useStageManager(
		otherUsers,
		stageLimit,
		identity
	)

	useEffect(() => {
		otherUsers.forEach((u) => {
			if (u.speaking || u.raisedHand) recordActivity(u)
		})
	}, [otherUsers, recordActivity])

	const pinnedActors = actorsOnStage.filter((u) => pinnedTileIds.includes(u.id))
	const unpinnedActors = actorsOnStage.filter(
		(u) => !pinnedTileIds.includes(u.id)
	)

	// For speaker view, determine main speaker and sidebar participants
	const mainSpeaker = viewMode === 'speaker'
		? actorsOnStage.find((u) => u.speaking) || actorsOnStage[0]
		: null
	const sidebarParticipants = viewMode === 'speaker' && mainSpeaker
		? actorsOnStage.filter((u) => u.id !== mainSpeaker.id)
		: []

	const gridGap = 12
	const dispatchToast = useDispatchToast()

	useEffect(() => {
		if (e2eeSafetyNumber) {
			dispatchToast(
				<SafetyNumberToast safetyNumber={e2eeSafetyNumber.slice(0, 8)} />,
				{ duration: Infinity, id: 'e2ee-safety-number' }
			)
		}
	}, [e2eeSafetyNumber, dispatchToast])

	return (
		<PullAudioTracks
			audioTracks={otherUsers.map((u) => u.tracks.audio).filter(isNonNullable)}
		>
			<div className="flex flex-col h-screen bg-meet_grey_5">
				<ViewToggle
					view={viewMode}
					onViewChange={setViewMode}
					participantCount={otherUsers.length + 1}
					isMobile={width < 600}
				/>
				<div className="relative flex-grow bg-meet_grey_5 isolate">
					<div
						style={{ '--gap': gridGap + 'px' } as any}
						className="absolute inset-0 flex isolate p-[--gap] gap-[--gap]"
					>
						{viewMode === 'speaker' && mainSpeaker ? (
							<>
								{/* Speaker view: main speaker large, others in sidebar */}
								<div className="flex-grow-[4] overflow-hidden relative">
									<ParticipantLayout
										users={[mainSpeaker].filter(isNonNullable)}
										gap={gridGap}
										aspectRatio="16:9"
									/>
								</div>
								{sidebarParticipants.length > 0 && (
									<div className="w-48 md:w-64 overflow-hidden relative flex flex-col gap-[--gap]">
										<ParticipantLayout
											users={sidebarParticipants.filter(isNonNullable)}
											gap={gridGap}
											aspectRatio="4:3"
										/>
									</div>
								)}
							</>
						) : (
							<>
								{/* Grid view: all participants equal */}
								{pinnedActors.length > 0 && (
									<div className="flex-grow-[5] overflow-hidden relative">
										<ParticipantLayout
											users={pinnedActors.filter(isNonNullable)}
											gap={gridGap}
											aspectRatio="16:9"
										/>
									</div>
								)}
								<div className="flex-grow overflow-hidden relative">
									<ParticipantLayout
										users={unpinnedActors.filter(isNonNullable)}
										gap={gridGap}
										aspectRatio="4:3"
									/>
								</div>
							</>
						)}
					</div>
					<Toast.Viewport className="absolute bottom-0 right-0" />
				</div>
				{/* Bottom control bar - matching Meet's Tray styling */}
				<div className="flex-shrink-0 z-50 bg-white/95 backdrop-blur-md border-t border-meet_grey_6 shadow-lg">
					<div className="flex items-center justify-center gap-3 px-4 py-3">
					{hasAiCredentials && <AiButton recordActivity={recordActivity} />}
					<MicButton warnWhenSpeakingWhileMuted />
					<CameraButton />
					<ScreenshareButton />
					<RaiseHandButton
						raisedHand={raisedHand}
						onClick={() => setRaisedHand(!raisedHand)}
					/>
					<ChatButton
						showChat={showChat}
						toggleChat={toggleChat}
						unreadCount={unreadCount}
					/>
					<ParticipantsButton
						identity={identity}
						otherUsers={otherUsers}
						className="hidden md:block"
					></ParticipantsButton>
					<OverflowMenu bugReportsEnabled={bugReportsEnabled} />
					<LeaveRoomButton meetingId={meetingId} />
					{showDebugInfo && meetingId && (
						<CopyButton contentValue={meetingId}>Meeting Id</CopyButton>
					)}
					{showDebugInfo && meetingId && dashboardDebugLogsBaseUrl && (
						<ButtonLink
							className="text-xs"
							displayType="secondary"
							to={dashboardLogsLink(dashboardDebugLogsBaseUrl, [
								{
									id: '2',
									key: 'meetingId',
									type: 'string',
									value: meetingId,
									operation: 'eq',
								},
							])}
							target="_blank"
							rel="noreferrer"
						>
							Meeting Logs
						</ButtonLink>
					)}
					</div>
				</div>
			</div>
			<HighPacketLossWarningsToast />
			{showWarning && (
				<MeetingTimer
					warningLevel={warningLevel}
					timeLeft={timeLeft}
					onDismiss={dismissWarning}
					isMobile={isMobile}
				/>
			)}
			{isReconnecting && (
				<ReconnectingOverlay
					attemptNumber={reconnectAttempts}
					maxAttempts={maxReconnectAttempts}
				/>
			)}
			<Chat
				showChat={showChat}
				toggleChat={toggleChat}
				messages={chatMessages}
				onSendMessage={sendChatMessage}
				currentUserId={websocket.id}
			/>
		</PullAudioTracks>
	)
}
