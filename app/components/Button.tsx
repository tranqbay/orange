import type { LinkProps } from '@remix-run/react'
import { Link } from '@remix-run/react'
import { forwardRef } from 'react'
import { cn } from '~/utils/style'

const displayTypeMap = {
	primary: [
		'bg-meet_primary_1 text-white shadow hover:bg-meet_primary_1/90',
	],
	secondary: [
		'bg-meet_grey_5 text-meet_text_1 shadow-sm hover:bg-meet_grey_6',
		'border border-meet_grey_6',
	],
	ghost: [
		'hover:bg-meet_grey_5 hover:text-meet_text_1',
	],
	outline: [
		'border border-meet_grey_6 bg-white shadow-sm hover:bg-meet_grey_5 hover:text-meet_text_1',
	],
	danger: [
		'bg-meet_error_1 text-white shadow-sm hover:bg-meet_error_1/90',
	],
	link: [
		'text-meet_primary_1 underline-offset-4 hover:underline',
	],
}

export type ButtonProps = Omit<JSX.IntrinsicElements['button'], 'ref'> & {
	displayType?: keyof typeof displayTypeMap
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, displayType = 'primary', disabled, onClick, ...rest }, ref) => (
		<button
			className={cn(
				'inline-flex items-center justify-center gap-2 whitespace-nowrap',
				'rounded-md text-sm font-medium',
				'transition-colors',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-meet_primary_1 focus-visible:ring-offset-2',
				'h-9 px-4 py-2',
				disabled && 'pointer-events-none opacity-50',
				displayTypeMap[displayType].join(' '),
				className
			)}
			aria-disabled={disabled}
			onClick={disabled ? (e) => e.preventDefault() : onClick}
			{...rest}
			ref={ref}
		/>
	)
)

Button.displayName = 'Button'

export const ButtonLink = forwardRef<
	HTMLAnchorElement,
	LinkProps & {
		displayType?: keyof typeof displayTypeMap
	}
>(({ className, displayType = 'primary', ...rest }, ref) => (
	// eslint-disable-next-line jsx-a11y/anchor-has-content
	<Link
		className={cn(
			'inline-flex items-center justify-center gap-2 whitespace-nowrap',
			'rounded-md text-sm font-medium',
			'transition-colors',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-meet_primary_1 focus-visible:ring-offset-2',
			'h-9 px-4 py-2',
			displayTypeMap[displayType].join(' '),
			className
		)}
		{...rest}
		ref={ref}
	/>
))

ButtonLink.displayName = 'ButtonLink'
