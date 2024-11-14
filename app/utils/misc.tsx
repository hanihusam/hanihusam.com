import * as React from 'react'

const useSSRLayoutEffect =
	typeof window === 'undefined' ? () => {} : React.useLayoutEffect

function getFromLocalStorage(key: string) {
	if (typeof localStorage !== 'undefined') {
		return localStorage.getItem(key)
	}
	return null
}

function getRequiredEnvVarFromObj(
	obj: Record<string, string | undefined>,
	key: string,
	devValue: string = `${key}-dev-value`,
) {
	let value = devValue
	const envVal = obj[key]
	if (envVal) {
		value = envVal
	} else if (obj.NODE_ENV === 'production') {
		throw new Error(`${key} is a required env variable`)
	}
	return value
}

function getRequiredServerEnvVar(key: string, devValue?: string) {
	return getRequiredEnvVarFromObj(process.env, key, devValue)
}

function typedBoolean<T>(
	value: T,
): value is Exclude<T, '' | 0 | false | null | undefined> {
	return Boolean(value)
}

function useUpdateQueryStringValueWithoutNavigation(
	queryKey: string,
	queryValue: string,
) {
	React.useEffect(() => {
		const currentSearchParams = new URLSearchParams(window.location.search)
		const oldQuery = currentSearchParams.get(queryKey) ?? ''
		if (queryValue === oldQuery) return

		if (queryValue) {
			currentSearchParams.set(queryKey, queryValue)
		} else {
			currentSearchParams.delete(queryKey)
		}
		const newUrl = [window.location.pathname, currentSearchParams.toString()]
			.filter(Boolean)
			.join('?')
		// alright, let's talk about this...
		// Normally with remix, you'd update the params via useSearchParams from react-router-dom
		// and updating the search params will trigger the search to update for you.
		// However, it also triggers a navigation to the new url, which will trigger
		// the loader to run which we do not want because all our data is already
		// on the client and we're just doing client-side filtering of data we
		// already have. So we manually call `window.history.pushState` to avoid
		// the router from triggering the loader.
		window.history.replaceState(null, '', newUrl)
	}, [queryKey, queryValue])
}

export {
	getFromLocalStorage,
	getRequiredEnvVarFromObj,
	getRequiredServerEnvVar,
	typedBoolean,
	useSSRLayoutEffect,
	useUpdateQueryStringValueWithoutNavigation,
}
