/**
 * JWT Verification Utility for Orange
 * Verifies JWT tokens issued by orange-api using RS256 algorithm
 *
 * The public key is embedded via environment variable (JWT_PUBLIC_KEY)
 * since it's static and doesn't change per participant.
 */

import type { Env } from '~/types/Env'

// JWT Payload structure from orange-api
export interface JWTPayload {
	roomName: string
	participantId: string
	userId: string
	displayName: string
	isOwner: boolean
	iat: number
	exp: number
	nbf?: number
}

// Cache for parsed public key (parsed once from env var)
let cachedPublicKey: CryptoKey | null = null

// Base64URL decoding
function base64UrlDecode(str: string): Uint8Array {
	const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
	const padding = '='.repeat((4 - (base64.length % 4)) % 4)
	const binary = atob(base64 + padding)
	return new Uint8Array([...binary].map((c) => c.charCodeAt(0)))
}

/**
 * Get the public key from environment variable
 * The key is cached after first parse since it never changes
 */
async function getPublicKey(env: Env): Promise<CryptoKey | null> {
	// Return cached key if already parsed
	if (cachedPublicKey) {
		return cachedPublicKey
	}

	try {
		const pem = env.JWT_PUBLIC_KEY
		if (!pem) {
			console.error('JWT_PUBLIC_KEY environment variable is not configured')
			return null
		}

		// Parse PEM and convert to CryptoKey
		const pemContents = pem
			.replace('-----BEGIN PUBLIC KEY-----', '')
			.replace('-----END PUBLIC KEY-----', '')
			.replace(/\\n/g, '') // Handle escaped newlines from env var
			.replace(/\s/g, '')

		const binaryKey = base64UrlDecode(
			pemContents.replace(/\+/g, '-').replace(/\//g, '_')
		)

		cachedPublicKey = await crypto.subtle.importKey(
			'spki',
			binaryKey,
			{ name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
			false,
			['verify']
		)

		return cachedPublicKey
	} catch (error) {
		console.error('Failed to parse public key:', error)
		return null
	}
}

/**
 * Verify a JWT token and return the payload if valid
 * Returns null if token is invalid, expired, or verification fails
 */
export async function verifyToken(
	token: string,
	env: Env,
	options?: { expectedRoomName?: string }
): Promise<JWTPayload | null> {
	try {
		const parts = token.split('.')
		if (parts.length !== 3) {
			console.warn('Invalid token format')
			return null
		}

		const [encodedHeader, encodedPayload, encodedSignature] = parts

		// Get public key
		const publicKey = await getPublicKey(env)
		if (!publicKey) {
			console.error('Could not get public key for verification')
			return null
		}

		// Verify signature
		const data = new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
		const signature = base64UrlDecode(encodedSignature)

		const isValid = await crypto.subtle.verify(
			'RSASSA-PKCS1-v1_5',
			publicKey,
			signature,
			data
		)

		if (!isValid) {
			console.warn('Token signature verification failed')
			return null
		}

		// Decode payload
		const payloadJson = new TextDecoder().decode(base64UrlDecode(encodedPayload))
		const payload: JWTPayload = JSON.parse(payloadJson)

		const now = Math.floor(Date.now() / 1000)

		// Check expiration
		if (payload.exp < now) {
			console.warn('Token has expired')
			return null
		}

		// Check not-before (if present)
		if (payload.nbf && payload.nbf > now) {
			console.warn('Token not yet valid (nbf)')
			return null
		}

		// Check room name if provided
		if (options?.expectedRoomName && payload.roomName !== options.expectedRoomName) {
			console.warn(`Token room name mismatch: expected ${options.expectedRoomName}, got ${payload.roomName}`)
			return null
		}

		return payload
	} catch (error) {
		console.error('JWT verification error:', error)
		return null
	}
}

/**
 * Extract token from WebSocket request URL query parameters
 */
export function extractTokenFromRequest(request: Request): string | null {
	try {
		const url = new URL(request.url)
		return url.searchParams.get('token')
	} catch {
		return null
	}
}
