import { useEffect, useState } from 'react'
import { cn } from '~/utils/style'
import type { WarningLevel } from '~/hooks/useMeetingTimer'

interface MeetingTimerProps {
  warningLevel: WarningLevel
  timeLeft: string
  onDismiss: () => void
  isMobile?: boolean
}

export default function MeetingTimer({
  warningLevel,
  timeLeft,
  onDismiss,
  isMobile = false,
}: MeetingTimerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  const isTimeUp = timeLeft === '00:00:00'

  // Reset visibility when warning level changes
  useEffect(() => {
    setIsVisible(true)
    setIsExiting(false)
  }, [warningLevel])

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onDismiss()
    }, 200)
  }

  if (!warningLevel || !isVisible) return null

  // Get minutes remaining
  const getMinutesLeft = () => {
    const parts = timeLeft.split(':')
    if (parts.length === 3) {
      const hours = parseInt(parts[0])
      const mins = parseInt(parts[1])
      return hours * 60 + mins
    }
    return 0
  }

  const minutesLeft = getMinutesLeft()

  // Get message - shorter on mobile
  const getMessage = () => {
    if (isTimeUp) {
      return isMobile ? 'Ending soon' : 'Session will close soon'
    }
    if (minutesLeft <= 1) {
      return isMobile ? '<1 min left' : 'This session will end in less than a minute'
    }
    if (minutesLeft <= 2) {
      return isMobile ? `${minutesLeft}m left` : `This session will end in ${minutesLeft} minutes`
    }
    if (warningLevel === '10-min') {
      return isMobile ? '10m left' : 'This session will end in 10 minutes'
    }
    return isMobile ? `${minutesLeft}m left` : `This session will end in ${minutesLeft} minutes`
  }

  return (
    <div
      className={cn(
        'fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out',
        isMobile ? 'top-2' : 'top-4',
        isExiting
          ? 'opacity-0 -translate-y-4 scale-95'
          : 'opacity-100 translate-y-0 scale-100'
      )}
    >
      {/* Compact notification pill - smaller on mobile */}
      <div
        className={cn(
          'bg-white/95 backdrop-blur-sm text-meet_text_1 rounded-full shadow-md border border-meet_grey_6 overflow-hidden',
          isMobile && 'text-[10px]'
        )}
      >
        <div
          className={cn(
            'flex items-center gap-1.5',
            isMobile ? 'px-2 py-1' : 'px-3 py-1.5'
          )}
        >
          <span
            className={cn(
              'font-medium',
              isMobile ? 'text-[10px]' : 'text-xs',
              isTimeUp && 'animate-pulse text-meet_error_1'
            )}
          >
            {getMessage()}
          </span>

          {!isTimeUp && (
            <button
              type="button"
              className={cn(
                'font-medium',
                isMobile
                  ? 'text-[10px] text-meet_text_2'
                  : 'text-xs text-meet_primary_1 hover:text-meet_primary_1/80'
              )}
              onClick={handleDismiss}
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
