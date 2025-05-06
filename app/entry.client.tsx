import { startTransition } from 'react'

import { handleDarkAndLightModeEls } from './utils/theme-provider'

import { hydrateRoot } from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'

function hydrate() {
	handleDarkAndLightModeEls()
	startTransition(() => {
		hydrateRoot(document, <HydratedRouter />)
	})
}

if (typeof requestIdleCallback === 'function') {
	requestIdleCallback(hydrate)
} else {
	// Safari doesn't support requestIdleCallback
	// https://caniuse.com/requestidlecallback
	setTimeout(hydrate, 1)
}
