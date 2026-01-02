import { useOutletContext } from '@remix-run/react';
import type { BookingInfo, MeetingParticipantInfo } from '~/types/booking';

export interface BookingContextType {
  // Booking and meeting data
  booking: BookingInfo | null;
  meeting: MeetingParticipantInfo | null;

  // Participant info
  participantId: string;
  participantType: 'provider' | 'client' | 'participant' | null;
  participantName: string | null;

  // Session timing
  startTime: Date | null;
  endTime: Date | null;
  duration: number | null; // in minutes

  // Timing states
  isWithinJoinWindow: boolean;
  isExpired: boolean;
  isTooEarly: boolean;
  gracePeriodEnd: Date | null;

  // Token for joining
  token: string | null;
  roomUrl: string | null;

  // Error state
  error: string | null;
}

/**
 * Hook to access booking context from parent route
 * This context is set by the participant route loader
 */
export function useBookingContext(): BookingContextType | null {
  try {
    return useOutletContext<BookingContextType>();
  } catch {
    return null;
  }
}

/**
 * Calculate minutes remaining until meeting ends
 */
export function getMinutesRemaining(endTime: Date | null): number | null {
  if (!endTime) return null;
  const now = new Date();
  const diff = endTime.getTime() - now.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60)));
}

/**
 * Calculate minutes until meeting starts
 */
export function getMinutesUntilStart(startTime: Date | null): number | null {
  if (!startTime) return null;
  const now = new Date();
  const diff = startTime.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60)));
}

/**
 * Format time for display (e.g., "2:30 PM")
 */
export function formatTime(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format date for display (e.g., "January 15, 2025")
 */
export function formatDate(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format duration for display (e.g., "30 minutes" or "1 hour")
 */
export function formatDuration(minutes: number | null): string {
  if (!minutes) return '';
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  return `${hours}h ${remainingMinutes}m`;
}
