import { useState, useEffect, useCallback } from 'react'

export type WarningLevel = '10-min' | '2-min' | 'time-up' | null

interface UseMeetingTimerReturn {
  timeLeft: string
  minutesRemaining: number | null
  warningLevel: WarningLevel
  isTimeUp: boolean
  dismissWarning: () => void
  showWarning: boolean
}

/**
 * Hook to manage meeting timer and warnings
 * @param endTime - The meeting end time as Date or ISO string
 */
export function useMeetingTimer(endTime: Date | string | null): UseMeetingTimerReturn {
  const [timeLeft, setTimeLeft] = useState<string>('00:00:00')
  const [minutesRemaining, setMinutesRemaining] = useState<number | null>(null)
  const [warningLevel, setWarningLevel] = useState<WarningLevel>(null)
  const [dismissedLevel, setDismissedLevel] = useState<WarningLevel>(null)
  const [showWarning, setShowWarning] = useState(false)

  const dismissWarning = useCallback(() => {
    setDismissedLevel(warningLevel)
    setShowWarning(false)
  }, [warningLevel])

  useEffect(() => {
    if (!endTime) {
      setTimeLeft('00:00:00')
      setMinutesRemaining(null)
      setWarningLevel(null)
      return
    }

    const endTimeDate = typeof endTime === 'string' ? new Date(endTime) : endTime

    const updateTimer = () => {
      const now = new Date()
      const diff = endTimeDate.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft('00:00:00')
        setMinutesRemaining(0)
        setWarningLevel('time-up')
        setShowWarning(true)
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      )

      const totalMinutes = hours * 60 + minutes
      setMinutesRemaining(totalMinutes)

      // Determine warning level
      let newWarningLevel: WarningLevel = null
      if (totalMinutes <= 0) {
        newWarningLevel = 'time-up'
      } else if (totalMinutes <= 2) {
        newWarningLevel = '2-min'
      } else if (totalMinutes <= 10) {
        newWarningLevel = '10-min'
      }

      // Only show warning if it's a new level and not dismissed
      if (newWarningLevel !== warningLevel) {
        setWarningLevel(newWarningLevel)
        if (newWarningLevel && newWarningLevel !== dismissedLevel) {
          setShowWarning(true)
        }
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [endTime, warningLevel, dismissedLevel])

  return {
    timeLeft,
    minutesRemaining,
    warningLevel,
    isTimeUp: timeLeft === '00:00:00',
    dismissWarning,
    showWarning,
  }
}
