import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useNavigate, useSearchParams } from '@remix-run/react'
import type { FC } from 'react'
import { Button } from './Button'
import { Icon } from './Icon/Icon'
import { Tooltip } from './Tooltip'

interface LeaveRoomButtonProps {
	meetingId?: string
}

export const LeaveRoomButton: FC<LeaveRoomButtonProps> = ({
	meetingId,
}) => {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const participantId = searchParams.get('participantId')

	return (
		<Tooltip content="Leave call">
			<Button
				displayType="danger"
				onClick={() => {
					// Navigate to end page with participant context
					const params = new URLSearchParams()
					if (participantId) params.set('participantId', participantId)
					if (meetingId) params.set('meetingId', meetingId)
					navigate(`/end?${params}`)
				}}
				className="w-14 h-12 rounded-full shadow-md"
			>
				<VisuallyHidden>Leave call</VisuallyHidden>
				<Icon type="phoneXMark" />
			</Button>
		</Tooltip>
	)
}
