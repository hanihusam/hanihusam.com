import { useEffect, useLayoutEffect } from 'react'

export type TError = {
	code: number
	message: string
}

function isErrorWithMessage(error: unknown): error is TError {
	return (
		typeof error === 'object' &&
		error !== null &&
		'error' in error &&
		typeof (error as Record<string, unknown>).message === 'string' &&
		typeof (error as Record<string, unknown>).code === 'number'
	)
}

function toErrorWithMessage(
	maybeError: unknown,
): TError | Omit<TError, 'code'> {
	if (isErrorWithMessage(maybeError)) return maybeError

	try {
		return new Error(JSON.stringify(maybeError))
	} catch {
		// fallback in case there's an error stringifying the maybeError
		// like with circular references for example.
		return new Error(String(maybeError))
	}
}

const useIsomorphicLayoutEffect =
	typeof window === 'undefined' ? useEffect : useLayoutEffect

export type RequestInfo = {
	origin: string
	path: string
}

function removeTrailingSlash(s: string): string {
	return s.endsWith('/') ? s.slice(0, -1) : s
}

function getDomainUrl(requestInfo?: Pick<RequestInfo, 'origin'>): string {
	return requestInfo?.origin ?? ''
}

// Absolute URL for the current request, e.g. https://hanihusam.com/works/foo.
function getUrl(requestInfo?: RequestInfo): string {
	return removeTrailingSlash(
		`${requestInfo?.origin ?? ''}${requestInfo?.path ?? ''}`,
	)
}

// Protocol-stripped URL used as the label printed on the social card,
// e.g. hanihusam.com/works/foo.
function getDisplayUrl(requestInfo?: RequestInfo): string {
	return getUrl(requestInfo).replace(/^https?:\/\//, '')
}

export {
	getDisplayUrl,
	getDomainUrl,
	getUrl,
	removeTrailingSlash,
	toErrorWithMessage,
	useIsomorphicLayoutEffect,
}
