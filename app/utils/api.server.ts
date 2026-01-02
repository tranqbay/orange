/**
 * Backend API Client
 * Server-side utility for calling backend API endpoints
 */

import type { BookingInfo, MeetingParticipantInfo } from '~/types/booking';

/**
 * Get the backend API base URL from environment
 */
function getApiBaseUrl(context: { env: { BACKEND_API_URL?: string } }): string {
  const url = context.env.BACKEND_API_URL;
  if (!url) {
    throw new Error('BACKEND_API_URL environment variable is not configured');
  }
  return url;
}

/**
 * Fetch booking information by participant identifier
 * Endpoint: GET /booking/participant/:participantId
 */
export async function getBookingByParticipant(
  participantId: string,
  context: { env: { BACKEND_API_URL?: string } }
): Promise<BookingInfo | null> {
  try {
    const baseUrl = getApiBaseUrl(context);
    const response = await fetch(`${baseUrl}/booking/participant/${participantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Booking not found for participant: ${participantId}`);
        return null;
      }
      throw new Error(`Failed to fetch booking: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as BookingInfo;
  } catch (error) {
    console.error(`Error fetching booking for participant ${participantId}:`, error);
    return null;
  }
}

/**
 * Fetch meeting information by participant identifier
 * Endpoint: GET /meeting/participant/:participantId
 */
export async function getMeetingByParticipant(
  participantId: string,
  context: { env: { BACKEND_API_URL?: string } }
): Promise<MeetingParticipantInfo | null> {
  try {
    const baseUrl = getApiBaseUrl(context);
    const response = await fetch(`${baseUrl}/meeting/participant/${participantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Meeting not found for participant: ${participantId}`);
        return null;
      }
      throw new Error(`Failed to fetch meeting: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as MeetingParticipantInfo;
  } catch (error) {
    console.error(`Error fetching meeting for participant ${participantId}:`, error);
    return null;
  }
}

/**
 * Fetch both booking and meeting information in parallel
 */
export async function getParticipantContext(
  participantId: string,
  context: { env: { BACKEND_API_URL?: string } }
): Promise<{
  booking: BookingInfo | null;
  meeting: MeetingParticipantInfo | null;
  error: string | null;
}> {
  try {
    const [booking, meeting] = await Promise.all([
      getBookingByParticipant(participantId, context),
      getMeetingByParticipant(participantId, context),
    ]);

    if (!meeting) {
      return {
        booking: null,
        meeting: null,
        error: 'Meeting not found for this participant',
      };
    }

    return {
      booking,
      meeting,
      error: null,
    };
  } catch (error) {
    console.error(`Error fetching participant context for ${participantId}:`, error);
    return {
      booking: null,
      meeting: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
