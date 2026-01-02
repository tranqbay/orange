import type { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { routePartykitRequest } from 'partyserver'

// handles PartyServer/PartyKit requests
// Authentication is handled at WebSocket level via JWT token in ChatRoom.onConnect()
export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const partyResponse = await routePartykitRequest(request, context.env)
	return partyResponse || new Response('Not found', { status: 404 })
}
