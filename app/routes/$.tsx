import { data } from 'react-router'

// Splat route: matches any URL not handled by a more specific route. Throwing a
// 404 lets the error bubble to the root error boundary, which renders the
// not-found page without the site navigation and footer.
export const loader = () => {
	throw data(null, { status: 404 })
}

// A default export is required so React Router treats this as a UI route (not a
// resource route). It never renders because the loader always throws.
export default function NotFoundRoute() {
	return null
}
