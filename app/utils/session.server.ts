import { sessionExpirationTime } from './db.server.ts'
import { getRequiredServerEnvVar } from './misc.tsx'

import { createHash } from 'crypto'
import { createCookieSessionStorage } from 'react-router'

const sessionIdKey = '__session_id__'

const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: 'HNH_root_session',
		secure: true,
		secrets: [getRequiredServerEnvVar('SESSION_SECRET')],
		sameSite: 'lax',
		path: '/',
		maxAge: sessionExpirationTime / 1000,
		httpOnly: true,
	},
})

async function getSession(request: Request) {
	const session = await sessionStorage.getSession(request.headers.get('Cookie'))
	const initialValue = await sessionStorage.commitSession(session)
	const getSessionId = () => session.get(sessionIdKey) as string | undefined
	const unsetSessionId = () => session.unset(sessionIdKey)

	const commit = async () => {
		const currentValue = await sessionStorage.commitSession(session)
		return currentValue === initialValue ? null : currentValue
	}
	return {
		session,
		getSessionId,
		unsetSessionId,
		commit,
		/**
		 * This will initialize a Headers object if one is not provided.
		 * It will set the 'Set-Cookie' header value on that headers object.
		 * It will then return that Headers object.
		 */
		getHeaders: async (headers: ResponseInit['headers'] = new Headers()) => {
			const value = await commit()
			if (!value) return headers
			if (headers instanceof Headers) {
				headers.append('Set-Cookie', value)
			} else if (Array.isArray(headers)) {
				headers.push(['Set-Cookie', value])
			} else {
				headers['Set-Cookie'] = value
			}
			return headers
		},
	}
}

export const getSessionId = (req: Request) => {
	const ipAddress =
		req.headers.get('x-forwarded-for') ||
		// Fallback for localhost or non Vercel deployments
		'0.0.0.0'

	// Since a users IP address is part of the sessionId in our database, we
	// hash it to protect their privacy. By combining it with a salt, we get
	// get a unique id we can refer to, but we won't know what their ip
	// address was.
	const currentUserId = createHash('md5')
		.update(ipAddress + (process.env.IP_ADDRESS_SALT as string), 'utf8')
		.digest('hex')
	return currentUserId
}

export { getSession }
