import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

import { PrismaClient } from '@/generated/prisma/client'

import { getRequiredServerEnvVar } from './misc'

let prisma: PrismaClient

function createPrismaClient() {
	const adapter = new PrismaBetterSqlite3(
		{ url: getRequiredServerEnvVar('DATABASE_PATH') },
		{ timestampFormat: 'unixepoch-ms' },
	)
	return new PrismaClient({ adapter })
}

declare global {
	var __db__: PrismaClient
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === 'production') {
	prisma = createPrismaClient()
} else {
	if (!global.__db__) {
		global.__db__ = createPrismaClient()
	}
	prisma = global.__db__
	prisma.$connect()
}

const sessionExpirationTime = 1000 * 60 * 60 * 24 * 365

export { prisma, sessionExpirationTime }
