import { prisma } from '@/utils/db.server'

import { type Route } from './+types/healthcheck'

export async function loader({ request: _ }: Route.LoaderArgs) {
	try {
		await prisma.$queryRaw`SELECT 1`
		return new Response('OK')
	} catch (error: unknown) {
		console.error('healthcheck ❌', { error })
		return new Response('ERROR', { status: 500 })
	}
}
