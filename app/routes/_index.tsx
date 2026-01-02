import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import HomeScreen from '~/components/HomeScreen'

export const meta: MetaFunction = () => [
	{ title: 'TranqBay Meet - Join Your Session' },
	{
		name: 'description',
		content: 'Enter your session code to join your meeting. TranqBay provides secure, HIPAA-compliant video sessions with no downloads required.',
	},
]

export const loader = async ({ context }: LoaderFunctionArgs) => {
	return json({
		hasBackendApi: Boolean(context.env.BACKEND_API_URL),
	})
}

export default function Index() {
	return <HomeScreen />
}
