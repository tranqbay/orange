/**
 * Types for VIVI API integration
 * These types match the responses from VIVI endpoints
 */

// Provider info from booking
export interface ProviderInfo {
  firstName: string;
  lastName: string;
  identifier: string;
  photo?: string;
  professionalTitle?: string | null;
  timezone: string;
  providerType?: string;
}

// Client info from booking
export interface ClientInfo {
  firstName: string;
  lastName: string;
  identifier: string;
  photoUrl?: string;
  timezone: string;
  clientType?: string;
}

// Participant info
export interface ParticipantInfo {
  reference: string;
  isGuest: number;
  fullName: string | null;
  participantType: 'provider' | 'client' | 'guest' | null;
  identifier: string;
}

// Modality (Video/Audio)
export interface ModalityInfo {
  identifier: string;
  isOffline: number;
  name: string;
  shortName?: string;
}

// Booking information from /booking/participant/:id
export interface BookingInfo {
  identifier: string;
  appointmentTime: string;
  appointmentStartTime?: string;
  appointmentEndTime: string;
  appointmentDuration?: string;
  modality: ModalityInfo;
  provider: ProviderInfo;
  client: ClientInfo;
  participants: ParticipantInfo[];
  createdAt: string;
}

// Meeting provider info
export interface MeetingProviderInfo {
  code: string;
  name: string;
}

// Meeting information from /meeting/participant/:id
export interface MeetingParticipantInfo {
  identifier: string;
  participantType: 'provider' | 'client' | 'participant';
  participantIdentifier: string | null;
  fullName: string;
  isOwner: boolean;
  token: string;
  meeting?: {
    id: string;
    startTime: string;
    joinUrl: string;
    duration: string;
    externalIdentifier?: string;
    provider?: MeetingProviderInfo;
  };
}

// Combined context for the meeting
export interface MeetingContext {
  booking: BookingInfo | null;
  meeting: MeetingParticipantInfo | null;
  participantId: string;
  participantType: 'provider' | 'client' | 'participant' | null;
  startTime: Date | null;
  endTime: Date | null;
  isWithinJoinWindow: boolean;
  isExpired: boolean;
  isTooEarly: boolean;
  gracePeriodEnd: Date | null;
  error: string | null;
}

// Session timing constants
export const EARLY_JOIN_MINUTES = 5;
export const GRACE_PERIOD_MINUTES = 15;
export const TOO_EARLY_HOURS = 24; // Show TooEarly screen only if more than 24 hours before session

// Helper functions for timing
export function isWithinJoinWindow(startTime: Date): boolean {
  const now = new Date();
  const joinWindowStart = new Date(startTime.getTime() - EARLY_JOIN_MINUTES * 60 * 1000);
  return now >= joinWindowStart;
}

export function isWithinGracePeriod(endTime: Date): boolean {
  const now = new Date();
  const gracePeriodEnd = new Date(endTime.getTime() + GRACE_PERIOD_MINUTES * 60 * 1000);
  return now <= gracePeriodEnd;
}

export function isMeetingExpired(endTime: Date): boolean {
  const now = new Date();
  const gracePeriodEnd = new Date(endTime.getTime() + GRACE_PERIOD_MINUTES * 60 * 1000);
  return now > gracePeriodEnd;
}

export function isTooEarly(startTime: Date): boolean {
  const now = new Date();
  const joinWindowStart = new Date(startTime.getTime() - EARLY_JOIN_MINUTES * 60 * 1000);
  return now < joinWindowStart;
}

export function getGracePeriodEnd(endTime: Date): Date {
  return new Date(endTime.getTime() + GRACE_PERIOD_MINUTES * 60 * 1000);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `${hours}h ${mins}m`;
}
