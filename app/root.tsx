import {
	json,
	type LinksFunction,
	type LoaderFunctionArgs,
	type MetaFunction,
} from '@remix-run/cloudflare'
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from '@remix-run/react'
import type { FC, ReactNode } from 'react'
import { useRef } from 'react'
import { useFullscreen, useToggle } from 'react-use'

import { QueryClient, QueryClientProvider } from 'react-query'
import tailwind from '~/styles/tailwind.css'
import { elementNotContainedByClickTarget } from './utils/elementNotContainedByClickTarget'
import { cn } from './utils/style'

export const loader = async ({ context }: LoaderFunctionArgs) => {
	// TranqBay uses JWT token authentication, not username cookies
	// Identity comes from the participant token in the session
	return json({
		userDirectoryUrl: context.env.USER_DIRECTORY_URL,
	})
}

export const meta: MetaFunction = () => [
	{
		title: 'TranqBay Meet',
	},
	{
		name: 'description',
		content: 'Secure, HIPAA-compliant video sessions for healthcare. Join your appointment with no downloads required.',
	},
]

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: tailwind },
	{
		rel: 'apple-touch-icon',
		sizes: '180x180',
		href: '/apple-touch-icon.png?v=orange-emoji',
	},
	{
		rel: 'icon',
		type: 'image/png',
		sizes: '32x32',
		href: '/favicon-32x32.png?v=orange-emoji',
	},
	{
		rel: 'icon',
		type: 'image/png',
		sizes: '16x16',
		href: '/favicon-16x16.png?v=orange-emoji',
	},
	{
		rel: 'manifest',
		href: '/site.webmanifest',
		crossOrigin: 'use-credentials',
	},
	{
		rel: 'mask-icon',
		href: '/safari-pinned-tab.svg?v=orange-emoji',
		color: '#034732',
	},
	{
		rel: 'shortcut icon',
		href: '/favicon.ico?v=orange',
	},
]

const Document: FC<{ children?: ReactNode }> = ({ children }) => {
	const fullscreenRef = useRef<HTMLBodyElement>(null)
	const [fullscreenEnabled, toggleFullscreen] = useToggle(false)
	useFullscreen(fullscreenRef, fullscreenEnabled, {
		onClose: () => toggleFullscreen(false),
	})
	return (
		// some extensions add data attributes to the html
		// element that React complains about.
		<html className="h-full" lang="en" suppressHydrationWarning>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="apple-mobile-web-app-title" content="TranqBay Meet" />
				<meta name="application-name" content="TranqBay Meet" />
				<meta name="msapplication-TileColor" content="#ffffff" />
				<meta
					name="theme-color"
					content="#034732"
					media="(prefers-color-scheme: light)"
				/>
				<meta
					name="theme-color"
					content="#034732"
					media="(prefers-color-scheme: dark)"
				/>
				<Meta />
				<Links />
			</head>
			<body
				className={cn(
					'h-full',
					'bg-meet_grey_5',
					'text-meet_text_1'
				)}
				ref={fullscreenRef}
				onDoubleClick={(e) => {
					if (
						e.target instanceof HTMLElement &&
						!elementNotContainedByClickTarget(e.target)
					)
						toggleFullscreen()
				}}
			>
				{children}
				<ScrollRestoration />
				<div className="hidden" suppressHydrationWarning>
					{/* Replaced in entry.server.ts */}
					__CLIENT_ENV__
				</div>
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}

export const ErrorBoundary = () => {
	return (
		<Document>
			<div className="grid h-full place-items-center">
				<p>
					It looks like there was an error, but don't worry it has been
					reported. Sorry about that!
				</p>
			</div>
		</Document>
	)
}

const queryClient = new QueryClient()

export default function App() {
	const { userDirectoryUrl } = useLoaderData<typeof loader>()
	return (
		<Document>
			<div id="root" className="h-full bg-inherit isolate">
				<QueryClientProvider client={queryClient}>
					<Outlet
						context={{
							userDirectoryUrl,
						}}
					/>
				</QueryClientProvider>
			</div>
		</Document>
	)
}
